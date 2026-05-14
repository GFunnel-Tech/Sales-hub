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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      banner_slides: {
        Row: {
          accent_gradient: string
          audience: string
          created_at: string
          cta_href: string
          cta_label: string
          description: string
          division_id: string | null
          gradient: string
          icon: string
          id: string
          is_active: boolean
          org_id: string | null
          placement: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          accent_gradient?: string
          audience?: string
          created_at?: string
          cta_href?: string
          cta_label?: string
          description: string
          division_id?: string | null
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          org_id?: string | null
          placement?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          accent_gradient?: string
          audience?: string
          created_at?: string
          cta_href?: string
          cta_label?: string
          description?: string
          division_id?: string | null
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          org_id?: string | null
          placement?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blueprint_sessions: {
        Row: {
          agent_notes: string | null
          agent_profile_id: string | null
          bridge_understanding: string | null
          canvas_image_url: string | null
          canvas_json: Json | null
          canvas_notes: string | null
          completed_at: string | null
          created_at: string | null
          current_page: number | null
          custom_request: string | null
          disposition: string | null
          dream_state_responses: Json | null
          follow_up_date: string | null
          generated_scope: string | null
          id: string
          is_qualified: boolean | null
          pain_point_responses: Json | null
          prospect_company: string | null
          prospect_email: string | null
          prospect_industry: string | null
          prospect_name: string
          prototype_url: string | null
          qualification_answers: Json | null
          qualification_score: number | null
          recording_url: string | null
          scope_url: string | null
          selected_plan: string | null
          session_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_notes?: string | null
          agent_profile_id?: string | null
          bridge_understanding?: string | null
          canvas_image_url?: string | null
          canvas_json?: Json | null
          canvas_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_page?: number | null
          custom_request?: string | null
          disposition?: string | null
          dream_state_responses?: Json | null
          follow_up_date?: string | null
          generated_scope?: string | null
          id?: string
          is_qualified?: boolean | null
          pain_point_responses?: Json | null
          prospect_company?: string | null
          prospect_email?: string | null
          prospect_industry?: string | null
          prospect_name: string
          prototype_url?: string | null
          qualification_answers?: Json | null
          qualification_score?: number | null
          recording_url?: string | null
          scope_url?: string | null
          selected_plan?: string | null
          session_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_notes?: string | null
          agent_profile_id?: string | null
          bridge_understanding?: string | null
          canvas_image_url?: string | null
          canvas_json?: Json | null
          canvas_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_page?: number | null
          custom_request?: string | null
          disposition?: string | null
          dream_state_responses?: Json | null
          follow_up_date?: string | null
          generated_scope?: string | null
          id?: string
          is_qualified?: boolean | null
          pain_point_responses?: Json | null
          prospect_company?: string | null
          prospect_email?: string | null
          prospect_industry?: string | null
          prospect_name?: string
          prototype_url?: string | null
          qualification_answers?: Json | null
          qualification_score?: number | null
          recording_url?: string | null
          scope_url?: string | null
          selected_plan?: string | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blueprint_sessions_agent_profile_id_fkey"
            columns: ["agent_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          created_at: string
          flat_bonus: number
          id: string
          is_active: boolean
          notes: string | null
          org_id: string | null
          rate_percent: number
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          flat_bonus?: number
          id?: string
          is_active?: boolean
          notes?: string | null
          org_id?: string | null
          rate_percent?: number
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          flat_bonus?: number
          id?: string
          is_active?: boolean
          notes?: string | null
          org_id?: string | null
          rate_percent?: number
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      dispositions: {
        Row: {
          created_at: string
          description: string | null
          division_id: string | null
          follow_up_days: number | null
          id: string
          is_active: boolean
          label: string
          org_id: string
          outcome_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          division_id?: string | null
          follow_up_days?: number | null
          id?: string
          is_active?: boolean
          label: string
          org_id: string
          outcome_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          division_id?: string | null
          follow_up_days?: number | null
          id?: string
          is_active?: boolean
          label?: string
          org_id?: string
          outcome_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispositions_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispositions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      divisions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "divisions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          auth_mode: string
          brand_primary_color: string | null
          brand_secondary_color: string | null
          created_at: string
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          setup_completed_at: string | null
          slug: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          auth_mode?: string
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          setup_completed_at?: string | null
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          auth_mode?: string
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          setup_completed_at?: string | null
          slug?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_details: string | null
          payment_method: string | null
          profile_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_details?: string | null
          payment_method?: string | null
          profile_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_details?: string | null
          payment_method?: string | null
          profile_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          audience: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          member_id: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audience?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          member_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audience?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          member_id?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          call_duration_minutes: number | null
          call_type: string | null
          closed_at_stage: Database["public"]["Enums"]["sales_stage"] | null
          created_at: string
          customer_address: string | null
          customer_city: string | null
          customer_country: string | null
          customer_email: string | null
          customer_first_name: string
          customer_last_name: string | null
          customer_phone: string | null
          customer_state: string | null
          customer_zip: string | null
          disposition: Database["public"]["Enums"]["disposition_type"]
          follow_up_date: string | null
          follow_up_notes: string | null
          id: string
          meeting_link: string | null
          notes: string | null
          objections_handled: string | null
          product_service: string
          profile_id: string | null
          sale_amount: number | null
          script_used: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          call_duration_minutes?: number | null
          call_type?: string | null
          closed_at_stage?: Database["public"]["Enums"]["sales_stage"] | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email?: string | null
          customer_first_name: string
          customer_last_name?: string | null
          customer_phone?: string | null
          customer_state?: string | null
          customer_zip?: string | null
          disposition: Database["public"]["Enums"]["disposition_type"]
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          objections_handled?: string | null
          product_service: string
          profile_id?: string | null
          sale_amount?: number | null
          script_used?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          call_duration_minutes?: number | null
          call_type?: string | null
          closed_at_stage?: Database["public"]["Enums"]["sales_stage"] | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email?: string | null
          customer_first_name?: string
          customer_last_name?: string | null
          customer_phone?: string | null
          customer_state?: string | null
          customer_zip?: string | null
          disposition?: Database["public"]["Enums"]["disposition_type"]
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          objections_handled?: string | null
          product_service?: string
          profile_id?: string | null
          sale_amount?: number | null
          script_used?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_script_used_fkey"
            columns: ["script_used"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_phases: {
        Row: {
          created_at: string
          fields: Json
          hints: Json
          id: string
          is_active: boolean
          objections: Json
          org_id: string | null
          phase_key: string
          script_blocks: Json
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fields?: Json
          hints?: Json
          id?: string
          is_active?: boolean
          objections?: Json
          org_id?: string | null
          phase_key: string
          script_blocks?: Json
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fields?: Json
          hints?: Json
          id?: string
          is_active?: boolean
          objections?: Json
          org_id?: string | null
          phase_key?: string
          script_blocks?: Json
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      script_requests: {
        Row: {
          admin_notes: string | null
          common_objections: string | null
          created_at: string
          id: string
          key_benefits: string | null
          product_description: string | null
          product_name: string
          status: string
          target_audience: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          common_objections?: string | null
          created_at?: string
          id?: string
          key_benefits?: string | null
          product_description?: string | null
          product_name: string
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          common_objections?: string | null
          created_at?: string
          id?: string
          key_benefits?: string | null
          product_description?: string | null
          product_name?: string
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scripts: {
        Row: {
          category: string | null
          content: Json
          created_at: string
          created_by: string | null
          description: string | null
          division_id: string | null
          id: string
          is_active: boolean
          org_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          division_id?: string | null
          id?: string
          is_active?: boolean
          org_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          division_id?: string | null
          id?: string
          is_active?: boolean
          org_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_invites: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          label: string | null
          org_id: string | null
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          label?: string | null
          org_id?: string | null
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          label?: string | null
          org_id?: string | null
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setup_invites_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          attachments: Json | null
          content: string | null
          created_at: string
          division_id: string | null
          id: string
          is_active: boolean
          org_id: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          attachments?: Json | null
          content?: string | null
          created_at?: string
          division_id?: string | null
          id?: string
          is_active?: boolean
          org_id: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string | null
          created_at?: string
          division_id?: string | null
          id?: string
          is_active?: boolean
          org_id?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainings_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Enums: {
      app_role: "admin" | "salesperson"
      disposition_type:
        | "sold"
        | "no_sale"
        | "callback"
        | "no_answer"
        | "not_interested"
        | "needs_followup"
        | "sent_info"
        | "scheduled_demo"
        | "left_voicemail"
      sales_stage:
        | "handshake_authority"
        | "dream_pain_bridge"
        | "discovery"
        | "presentation"
        | "ask_objections"
        | "ask_order"
        | "handoff"
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
      app_role: ["admin", "salesperson"],
      disposition_type: [
        "sold",
        "no_sale",
        "callback",
        "no_answer",
        "not_interested",
        "needs_followup",
        "sent_info",
        "scheduled_demo",
        "left_voicemail",
      ],
      sales_stage: [
        "handshake_authority",
        "dream_pain_bridge",
        "discovery",
        "presentation",
        "ask_objections",
        "ask_order",
        "handoff",
      ],
    },
  },
} as const
