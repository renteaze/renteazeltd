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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          owner_id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          owner_id: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          owner_id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_application_staff_notes: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          loan_application_id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          loan_application_id: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          loan_application_id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_application_staff_notes_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          annual_rent: number | null
          approved_amount: number | null
          created_at: string
          disbursed_at: string | null
          employer_name: string | null
          employment_type: string | null
          id: string
          interest_rate: number | null
          job_tenure: string | null
          landlord_name: string | null
          loan_amount_requested: number
          monthly_income: number | null
          monthly_repayment: number | null
          next_due_date: string | null
          outstanding_balance: number | null
          product_type: Database["public"]["Enums"]["loan_product_type"]
          property_address: string | null
          rejection_reason: string | null
          repayment_months: number | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["loan_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_rent?: number | null
          approved_amount?: number | null
          created_at?: string
          disbursed_at?: string | null
          employer_name?: string | null
          employment_type?: string | null
          id?: string
          interest_rate?: number | null
          job_tenure?: string | null
          landlord_name?: string | null
          loan_amount_requested: number
          monthly_income?: number | null
          monthly_repayment?: number | null
          next_due_date?: string | null
          outstanding_balance?: number | null
          product_type: Database["public"]["Enums"]["loan_product_type"]
          property_address?: string | null
          rejection_reason?: string | null
          repayment_months?: number | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_rent?: number | null
          approved_amount?: number | null
          created_at?: string
          disbursed_at?: string | null
          employer_name?: string | null
          employment_type?: string | null
          id?: string
          interest_rate?: number | null
          job_tenure?: string | null
          landlord_name?: string | null
          loan_amount_requested?: number
          monthly_income?: number | null
          monthly_repayment?: number | null
          next_due_date?: string | null
          outstanding_balance?: number | null
          product_type?: Database["public"]["Enums"]["loan_product_type"]
          property_address?: string | null
          rejection_reason?: string | null
          repayment_months?: number | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          user_id: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          user_id?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profile_crm_tags: {
        Row: {
          created_at: string
          tags: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          tags?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          tags?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accommodation_type: string | null
          account_manager_id: string | null
          acquisition_source: string | null
          address: string | null
          address_lat: number | null
          address_lon: number | null
          address_of_residence: string | null
          age_range: string | null
          annual_rent_range: string | null
          avatar_url: string | null
          bank_account_number: string | null
          bank_name: string | null
          bathrooms: number | null
          bedrooms: number | null
          bvn: string | null
          country: string | null
          created_at: string
          dob: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          interested_in_platform: string | null
          is_current_tenant: boolean | null
          kyc_completed: boolean
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          last_name: string | null
          marital_status: string | null
          marketing_consent: boolean
          nin: string | null
          nin_verified: boolean
          notification_preferences: Json
          occupation: string | null
          office_address: string | null
          office_lat: number | null
          office_lon: number | null
          pays_on_time: string | null
          pays_rent_to: string | null
          phone: string | null
          phone_verified: boolean
          preferred_contact_method: string | null
          profession_type: string | null
          professional_association: string | null
          referral_code: string | null
          referred_by: string | null
          rent_payment_ease: number | null
          rent_payment_method: string | null
          sought_rent_help_before: boolean | null
          state_of_residence: string | null
          status: Database["public"]["Enums"]["account_status"]
          survey_completed: boolean
          survey_completed_at: string | null
          tenancy_duration: string | null
          tenancy_period: string | null
          tenancy_property_type: string | null
          toilets: number | null
          updated_at: string
          years_experience: string | null
        }
        Insert: {
          accommodation_type?: string | null
          account_manager_id?: string | null
          acquisition_source?: string | null
          address?: string | null
          address_lat?: number | null
          address_lon?: number | null
          address_of_residence?: string | null
          age_range?: string | null
          annual_rent_range?: string | null
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          bvn?: string | null
          country?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          interested_in_platform?: string | null
          is_current_tenant?: boolean | null
          kyc_completed?: boolean
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name?: string | null
          marital_status?: string | null
          marketing_consent?: boolean
          nin?: string | null
          nin_verified?: boolean
          notification_preferences?: Json
          occupation?: string | null
          office_address?: string | null
          office_lat?: number | null
          office_lon?: number | null
          pays_on_time?: string | null
          pays_rent_to?: string | null
          phone?: string | null
          phone_verified?: boolean
          preferred_contact_method?: string | null
          profession_type?: string | null
          professional_association?: string | null
          referral_code?: string | null
          referred_by?: string | null
          rent_payment_ease?: number | null
          rent_payment_method?: string | null
          sought_rent_help_before?: boolean | null
          state_of_residence?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          survey_completed?: boolean
          survey_completed_at?: string | null
          tenancy_duration?: string | null
          tenancy_period?: string | null
          tenancy_property_type?: string | null
          toilets?: number | null
          updated_at?: string
          years_experience?: string | null
        }
        Update: {
          accommodation_type?: string | null
          account_manager_id?: string | null
          acquisition_source?: string | null
          address?: string | null
          address_lat?: number | null
          address_lon?: number | null
          address_of_residence?: string | null
          age_range?: string | null
          annual_rent_range?: string | null
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          bvn?: string | null
          country?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          interested_in_platform?: string | null
          is_current_tenant?: boolean | null
          kyc_completed?: boolean
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name?: string | null
          marital_status?: string | null
          marketing_consent?: boolean
          nin?: string | null
          nin_verified?: boolean
          notification_preferences?: Json
          occupation?: string | null
          office_address?: string | null
          office_lat?: number | null
          office_lon?: number | null
          pays_on_time?: string | null
          pays_rent_to?: string | null
          phone?: string | null
          phone_verified?: boolean
          preferred_contact_method?: string | null
          profession_type?: string | null
          professional_association?: string | null
          referral_code?: string | null
          referred_by?: string | null
          rent_payment_ease?: number | null
          rent_payment_method?: string | null
          sought_rent_help_before?: boolean | null
          state_of_residence?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          survey_completed?: boolean
          survey_completed_at?: string | null
          tenancy_duration?: string | null
          tenancy_period?: string | null
          tenancy_property_type?: string | null
          toilets?: number | null
          updated_at?: string
          years_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_account_manager_id_fkey"
            columns: ["account_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_plans: {
        Row: {
          annual_rent_target: number
          created_at: string
          current_balance: number
          id: string
          monthly_contribution: number
          months_completed: number
          notes: string | null
          product_type: Database["public"]["Enums"]["savings_product_type"]
          start_date: string
          status: Database["public"]["Enums"]["savings_plan_status"]
          target_months: number
          updated_at: string
          user_id: string
          virtual_account_number: string | null
          virtual_bank_name: string | null
        }
        Insert: {
          annual_rent_target: number
          created_at?: string
          current_balance?: number
          id?: string
          monthly_contribution: number
          months_completed?: number
          notes?: string | null
          product_type?: Database["public"]["Enums"]["savings_product_type"]
          start_date?: string
          status?: Database["public"]["Enums"]["savings_plan_status"]
          target_months?: number
          updated_at?: string
          user_id: string
          virtual_account_number?: string | null
          virtual_bank_name?: string | null
        }
        Update: {
          annual_rent_target?: number
          created_at?: string
          current_balance?: number
          id?: string
          monthly_contribution?: number
          months_completed?: number
          notes?: string | null
          product_type?: Database["public"]["Enums"]["savings_product_type"]
          start_date?: string
          status?: Database["public"]["Enums"]["savings_plan_status"]
          target_months?: number
          updated_at?: string
          user_id?: string
          virtual_account_number?: string | null
          virtual_bank_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "savings_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          direction: Database["public"]["Enums"]["transaction_direction"]
          id: string
          loan_id: string | null
          occurred_at: string
          plan_id: string | null
          reference: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          direction: Database["public"]["Enums"]["transaction_direction"]
          id?: string
          loan_id?: string | null
          occurred_at?: string
          plan_id?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          direction?: Database["public"]["Enums"]["transaction_direction"]
          id?: string
          loan_id?: string | null
          occurred_at?: string
          plan_id?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "savings_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      set_my_crm_tags: { Args: { _tags: string[] }; Returns: undefined }
    }
    Enums: {
      account_status: "active" | "suspended" | "pending_approval"
      app_role:
        | "tenant"
        | "landlord"
        | "investor"
        | "professional"
        | "staff"
        | "admin"
      document_status: "pending" | "verified" | "rejected"
      document_type:
        | "government_id"
        | "proof_of_income"
        | "tenancy_agreement"
        | "utility_bill"
        | "title_deed"
        | "loan_agreement"
        | "passport"
        | "proof_of_address"
        | "tax_id"
        | "other"
      kyc_status: "pending" | "verified" | "rejected"
      loan_product_type:
        | "loan_for_rent"
        | "add_on_funds"
        | "upgrade"
        | "construction"
        | "renovation"
        | "repair"
      loan_status:
        | "submitted"
        | "under_review"
        | "approved"
        | "disbursed"
        | "active_repayment"
        | "closed"
        | "rejected"
      savings_plan_status:
        | "active"
        | "completed"
        | "disbursement_requested"
        | "disbursed"
        | "paused"
        | "cancelled"
      savings_product_type: "save_for_rent" | "save_to_own" | "save_for_house"
      transaction_direction: "credit" | "debit"
      transaction_status: "pending" | "confirmed" | "failed" | "reversed"
      transaction_type:
        | "savings_credit"
        | "savings_debit"
        | "loan_disbursement"
        | "loan_repayment"
        | "payout"
        | "commission_payment"
        | "manual_adjustment"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "suspended", "pending_approval"],
      app_role: [
        "tenant",
        "landlord",
        "investor",
        "professional",
        "staff",
        "admin",
      ],
      document_status: ["pending", "verified", "rejected"],
      document_type: [
        "government_id",
        "proof_of_income",
        "tenancy_agreement",
        "utility_bill",
        "title_deed",
        "loan_agreement",
        "passport",
        "proof_of_address",
        "tax_id",
        "other",
      ],
      kyc_status: ["pending", "verified", "rejected"],
      loan_product_type: [
        "loan_for_rent",
        "add_on_funds",
        "upgrade",
        "construction",
        "renovation",
        "repair",
      ],
      loan_status: [
        "submitted",
        "under_review",
        "approved",
        "disbursed",
        "active_repayment",
        "closed",
        "rejected",
      ],
      savings_plan_status: [
        "active",
        "completed",
        "disbursement_requested",
        "disbursed",
        "paused",
        "cancelled",
      ],
      savings_product_type: ["save_for_rent", "save_to_own", "save_for_house"],
      transaction_direction: ["credit", "debit"],
      transaction_status: ["pending", "confirmed", "failed", "reversed"],
      transaction_type: [
        "savings_credit",
        "savings_debit",
        "loan_disbursement",
        "loan_repayment",
        "payout",
        "commission_payment",
        "manual_adjustment",
      ],
    },
  },
} as const
