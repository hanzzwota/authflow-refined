create table if not exists public.app_settings (
  id integer primary key default 1 check (id = 1),
  rate bigint not null default 4500,
  min_withdrawal bigint not null default 4000,
  fee bigint not null default 0,
  campaign_password text not null default 'sgsg1122',
  store_open boolean not null default true,
  withdraw_open boolean not null default true,
  daily_limit integer not null default 500,
  batch_limit integer not null default 1,
  announcement text not null default ''
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  display_name text not null default '',
  password_hash text not null,
  password_salt text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  balance bigint not null default 0 check (balance >= 0),
  withdrawn bigint not null default 0 check (withdrawn >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  token_hash text primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_profile_id_idx on public.sessions(profile_id);
create index if not exists sessions_expires_at_idx on public.sessions(expires_at);

create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  emails jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'diterima', 'ditolak')),
  accepted_count integer not null default 0,
  earned bigint not null default 0,
  reason text,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);
create index if not exists deposits_user_id_idx on public.deposits(user_id);
create index if not exists deposits_status_idx on public.deposits(status);

create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount bigint not null check (amount > 0),
  fee bigint not null default 0,
  wallet_name text not null,
  wallet_number text not null,
  status text not null default 'pending' check (status in ('pending', 'selesai', 'ditolak')),
  reason text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists withdrawals_user_id_idx on public.withdrawals(user_id);

-- Server-only access (service_role). No anon/authenticated access.
grant all on public.app_settings to service_role;
grant all on public.profiles to service_role;
grant all on public.sessions to service_role;
grant all on public.deposits to service_role;
grant all on public.withdrawals to service_role;
revoke all on public.app_settings, public.profiles, public.sessions, public.deposits, public.withdrawals from anon, authenticated;

alter table public.app_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.deposits enable row level security;
alter table public.withdrawals enable row level security;

alter table public.app_settings add column if not exists auto_stock_enabled boolean not null default false;
alter table public.app_settings add column if not exists gmail_stock jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists wallet_bank text not null default 'DANA';
alter table public.profiles add column if not exists wallet_name text not null default '';
alter table public.profiles add column if not exists wallet_number text not null default '';
alter table public.deposits add column if not exists accepted_emails jsonb not null default '[]'::jsonb;
alter table public.deposits add column if not exists rejected_emails jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists is_blocked boolean not null default false;
alter table public.app_settings add column if not exists checker_open boolean not null default true;

create or replace function public.claim_gmail_stock()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  item text;
begin
  update public.app_settings
  set gmail_stock = gmail_stock - 0
  where id = 1
    and jsonb_typeof(gmail_stock) = 'array'
    and jsonb_array_length(gmail_stock) > 0
  returning gmail_stock ->> 0 into item;

  if item is null then return null; end if;

  update public.app_settings
  set gmail_stock = (select jsonb_agg(value) from jsonb_array_elements(gmail_stock) with ordinality as items(value, ordinal) where ordinal > 1)
  where id = 1;
  return item;
end;
$$;
revoke execute on function public.claim_gmail_stock() from public, anon, authenticated;
grant execute on function public.claim_gmail_stock() to service_role;

alter table public.app_settings
  add column if not exists payment_fees jsonb not null default '{"DANA":0,"OVO":0,"GoPay":0,"ShopeePay":0,"BCA":0,"BRI":0,"Mandiri":0}'::jsonb;
alter table public.withdrawals
  add column if not exists wallet_bank text not null default 'DANA';
alter table public.app_settings
  add column if not exists rules_text text not null default '1. Gmail harus fresh.\n2. Wajib menggunakan password yang dicantumkan di bawah.\n3. Keputusan admin tachi69gmail mutlak.';
alter table public.app_settings
  add column if not exists support_channels jsonb not null default '{"admins":[{"name":"Admin 1","whatsapp":"","telegram":"","enabled":true},{"name":"Admin 2","whatsapp":"","telegram":"","enabled":true}]}'::jsonb;

alter table public.app_settings drop constraint if exists app_settings_fee_step;
alter table public.app_settings
  add constraint app_settings_fee_step check (fee >= 0 and fee % 1000 = 0);
alter table public.withdrawals drop constraint if exists withdrawals_fee_step;
alter table public.withdrawals
  add constraint withdrawals_fee_step check (fee >= 0 and fee % 1000 = 0) not valid;

create or replace function public.enforce_withdrawal_minimum()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  required bigint;
begin
  if new.wallet_bank = 'DANA' then
    select coalesce(min_withdrawal, 0) into required from public.app_settings where id = 1;
  else
    required := 15000;
  end if;
  if new.amount < coalesce(required, 0) then
    raise exception 'Minimal penarikan % adalah Rp%', new.wallet_bank, required;
  end if;
  return new;
end;
$$;

drop trigger if exists withdrawals_enforce_minimum on public.withdrawals;
create trigger withdrawals_enforce_minimum
  before insert on public.withdrawals
  for each row execute function public.enforce_withdrawal_minimum();

alter table public.app_settings
  add column if not exists payment_mode text not null default 'all';
alter table public.app_settings
  drop constraint if exists app_settings_payment_mode_check;
alter table public.app_settings
  add constraint app_settings_payment_mode_check
  check (payment_mode in ('all', 'dana_only'));