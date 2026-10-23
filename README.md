# AuthFlow Refined

@connector:github:"GitHub API" https://github.com/hanzzwota/tachi-admin-glow,,Tugas Anda adalah mengganti seluruh sistem notifikasi/alert lama di dalam project ini dengan UI "Outlined Toast Notification" yang baru.



Sistem toast yang baru memiliki 3 tipe pemanggilan:

1. Success (Warna hijau)

2. Error (Warna merah)

3. Warning (Warna kuning dengan emoji ⚠️)

Durasi tampil adalah 3 detik dan sudah memiliki fungsi anti-duplikat.



⚠️ ATURAN VALIDASI LOGIKA MUTLAK & PESAN KONTEKSTUAL (SANGAT PENTING) ⚠️

Saya tidak mau ada kejadian di mana sistem mengalami error, tetapi UI malah menampilkan notifikasi Success. Selain itu, PESAN NOTIFIKASI WAJIB DISESUAIKAN DENGAN KONTEKS FITUR (Login, Register, Hapus Data, dll). Jangan gunakan pesan generic jika konteksnya jelas!



ATURAN PENGGUNAAN:



1. KONDISI SUCCESS (BERHASIL):

- Hanya dipanggil JIKA proses benar-benar berhasil (HTTP 200/201, data masuk DB).

- Teks WAJIB sesuai konteks. 

  Contoh Login: showToast('success', 'Login berhasil! Selamat datang. 🚀');

  Contoh Simpan: showToast('success', 'Data profil berhasil diperbarui!');



2. KONDISI ERROR (GAGAL):

- WAJIB dipanggil jika kode masuk ke blok `catch (error)`, status 400/500, atau respons dari backend menyatakan gagal. Dilarang menaruh notif success di sini!

- Teks WAJIB sesuai konteks kegagalan.

  Contoh Login Gagal: showToast('error', 'Login gagal! Username atau password salah. 😟');

  Contoh Hapus Gagal: showToast('error', 'Gagal menghapus file. Tidak ada akses.');

  Contoh Catch Error: showToast('error', 'Koneksi terputus: ' + error.message);



3. KONDISI WARNING (PERINGATAN):

- Dipanggil untuk pengecualian atau validasi input.

  Contoh: showToast('warning', '⚠️ Harap isi semua kolom yang wajib!');

  Contoh: showToast('warning', '⚠️ Sesi Anda akan habis dalam 5 menit.');



Gunakan standar penulisan ini saat mengganti kode lama:



try {

  const response = await fetch('/api/login', data);

  const result = await response.json();



  if (response.ok && result.status === true) {

    // HARUS SUCCESS DAN SESUAI KONTEKS

    showToast('success', 'Login berhasil! Mengalihkan ke dashboard... 🚀');

  } else {

    // HARUS ERROR DAN MENGAMBIL PESAN DARI BACKEND JIKA ADA, ATAU BUAT SESUAI KONTEKS

    showToast('error', result.message || 'Login gagal! Cek kembali kredensial Anda. 😟');

  }

} catch (error) {

  // WAJIB ERROR DI DALAM CATCH

  showToast('error', 'Terjadi kesalahan sistem saat mencoba login. Coba lagi nanti.');

}



Silakan cari semua fungsi notifikasi lama di codebase, ganti dengan fungsi `showToast(type, message)` yang baru. Audit ulang (double-check) semua validasi IF/ELSE dan TRY/CATCH untuk memastikan tidak ada logika notifikasi yang terbalik, dan pastikan setiap pesan teksnya sangat relevan dengan fungsi yang sedang berjalan!

 .Tugas Anda adalah mendebug dan memperbaiki fitur Login yang selalu gagal (fetch failed) di project Lovable ini. Database dan Autentikasi yang digunakan adalah bawaan Lovable (Supabase).



Terdapat beberapa kemungkinan kenapa fetch login ini gagal terus. Tolong lakukan pengecekan dan perbaikan pada aspek-aspek berikut:



1. CEK KONEKSI & ENV VARIABLES:

Pastikan URL endpoint API / URL Supabase dan Anon Key (Environment Variables) sudah dipanggil dengan benar. Jika pakai fetch biasa, pastikan header `Content-Type: application/json` dan Authorization header (jika diperlukan) disertakan.



2. CEK CORS & PAYLOAD:

Pastikan tidak ada isu CORS saat fetch dipanggil. Periksa juga apakah payload body yang dikirim (email/password) formatnya sudah sesuai dengan yang diminta oleh database Supabase Auth.



3. CEK RLS (Row Level Security):

Jika proses login membaca tabel kustom (bukan bawaan auth), pastikan aturan RLS di database tidak memblokir akses baca (SELECT) untuk user anon/publik.



4. IMPLEMENTASI LOGIKA TOAST NOTIFIKASI KETAT:

Gunakan sistem "Outlined Toast Notification" (showToast) untuk memberikan feedback kepada user. Terapkan Try-Catch dengan validasi yang sangat ketat:

- SUCCESS: Hanya jika login BENAR-BENAR berhasil dan mendapat token/sesi.

- ERROR: Wajib jika kredensial salah, gagal fetch, atau error server. Pesan harus kontekstual!



Tulis ulang atau perbaiki fungsi login saya mengikuti standar kode di bawah ini:



```javascript

async function handleLogin(email, password) {

  try {

    // Tambahkan console.log ini untuk membantu saya melihat error di browser console

    console.log("Mencoba login dengan payload:", { email });



    const response = await fetch('YOUR_LOGIN_ENDPOINT_OR_SUPABASE_AUTH', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        // 'apiKey': process.env.VITE_SUPABASE_ANON_KEY (sesuaikan standar Lovable)

      },

      body: JSON.stringify({ email, password })

    });



    const result = await response.json();

    console.log("Response dari server:", result);



    if (response.ok && !result.error) {

      // WAJIB SUCCESS: Sesuai konteks

      showToast('success', 'Login berhasil! Mengalihkan ke dashboard... 🚀');

      // Lanjutkan logika redirect / simpan token di sini

    } else {

      // WAJIB ERROR: Tampilkan pesan spesifik dari database/server jika kredensial salah

      const errorMessage = result.error?.message || result.message || 'Login gagal! Email atau password salah. 😟';

      showToast('error', errorMessage);

    }

  } catch (error) {

    // WAJIB ERROR: Untuk Network error / CORS / Server Down

    console.error("Fetch Error:", error);

    showToast('error', 'Koneksi gagal! Silakan periksa jaringan Anda atau coba lagi nanti.');

  }

}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/87437d14-02b8-425c-8326-89415751bd58).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
