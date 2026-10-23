export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          announcement: string
          auto_stock_enabled: boolean
          batch_limit: number
          campaign_password: string
          checker_open: boolean
          daily_limit: number
          fee: number
          gmail_stock: Json
          id: number
          min_withdrawal: number
          payment_fees: Json
          payment_mode: string
          rate: number
          rules_text: string
          store_open: boolean
          support_channels: Json
          withdraw_open: boolean
        }
        Insert: {
          announcement?: string
          auto_stock_enabled?: boolean
          batch_limit?: number
          campaign_password?: string
          checker_open?: boolean
          daily_limit?: number
          fee?: number
          gmail_stock?: Json
          id?: number
          min_withdrawal?: number
          payment_fees?: Json
          payment_mode?: string
          rate?: number
          rules_text?: string
          store_open?: boolean
          support_channels?: Json
          withdraw_open?: boolean
        }
        Update: {
          announcement?: string
          auto_stock_enabled?: boolean
          batch_limit?: number
          campaign_password?: string
          checker_open?: boolean
          daily_limit?: number
          fee?: number
          gmail_stock?: Json
          id?: number
          min_withdrawal?: number
          payment_fees?: Json
          payment_mode?: string
          rate?: number
          rules_text?: string
          store_open?: boolean
          support_channels?: Json
          withdraw_open?: boolean
        }
        Relationships: []
      }
      deposits: {
        Row: {
          accepted_count: number
          accepted_emails: Json
          created_at: string
          earned: number
          emails: Json
          id: string
          reason: string | null
          rejected_emails: Json
          status: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          accepted_count?: number
          accepted_emails?: Json
          created_at?: string
          earned?: number
          emails?: Json
          id?: string
          reason?: string | null
          rejected_emails?: Json
          status?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          accepted_count?: number
          accepted_emails?: Json
          created_at?: string
          earned?: number
          emails?: Json
          id?: string
          reason?: string | null
          rejected_emails?: Json
          status?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number
          created_at: string
          display_name: string
          id: string
          is_blocked: boolean
          password_hash: string
          password_salt: string
          role: string
          username: string
          wallet_bank: string
          wallet_name: string
          wallet_number: string
          withdrawn: number
        }
        Insert: {
          balance?: number
          created_at?: string
          display_name?: string
          id?: string
          is_blocked?: boolean
          password_hash: string
          password_salt: string
          role?: string
          username: string
          wallet_bank?: string
          wallet_name?: string
          wallet_number?: string
          withdrawn?: number
        }
        Update: {
          balance?: number
          created_at?: string
          display_name?: string
          id?: string
          is_blocked?: boolean
          password_hash?: string
          password_salt?: string
          role?: string
          username?: string
          wallet_bank?: string
          wallet_name?: string
          wallet_number?: string
          withdrawn?: number
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          expires_at: string
          profile_id: string
          token_hash: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          profile_id: string
          token_hash: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          profile_id?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          fee: number
          id: string
          reason: string | null
          status: string
          user_id: string
          wallet_bank: string
          wallet_name: string
          wallet_number: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          fee?: number
          id?: string
          reason?: string | null
          status?: string
          user_id: string
          wallet_bank?: string
          wallet_name: string
          wallet_number: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          fee?: number
          id?: string
          reason?: string | null
          status?: string
          user_id?: string
          wallet_bank?: string
          wallet_name?: string
          wallet_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_gmail_stock: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
