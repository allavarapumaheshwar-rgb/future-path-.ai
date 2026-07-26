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
      colleges: {
        Row: {
          accreditation: string | null
          category: string[] | null
          city: string | null
          courses: string[] | null
          created_at: string | null
          description: string | null
          district: string | null
          eligibility: string | null
          email: string | null
          entrance_exams: string[] | null
          facilities: string[] | null
          fees_max: number | null
          fees_min: number | null
          hostel: boolean | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          placement_avg: number | null
          placement_high: number | null
          ranking: number | null
          slug: string
          state: string | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          accreditation?: string | null
          category?: string[] | null
          city?: string | null
          courses?: string[] | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          eligibility?: string | null
          email?: string | null
          entrance_exams?: string[] | null
          facilities?: string[] | null
          fees_max?: number | null
          fees_min?: number | null
          hostel?: boolean | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          placement_avg?: number | null
          placement_high?: number | null
          ranking?: number | null
          slug: string
          state?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          accreditation?: string | null
          category?: string[] | null
          city?: string | null
          courses?: string[] | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          eligibility?: string | null
          email?: string | null
          entrance_exams?: string[] | null
          facilities?: string[] | null
          fees_max?: number | null
          fees_min?: number | null
          hostel?: boolean | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          placement_avg?: number | null
          placement_high?: number | null
          ranking?: number | null
          slug?: string
          state?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          category: string
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          grade: string | null
          id: string
          interests: string[] | null
          mobile: string | null
          stream: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id: string
          interests?: string[] | null
          mobile?: string | null
          stream?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          interests?: string[] | null
          mobile?: string | null
          stream?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_careers: {
        Row: {
          career_slug: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          career_slug: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          career_slug?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_colleges: {
        Row: {
          college_name: string
          college_slug: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          college_name: string
          college_slug?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          college_name?: string
          college_slug?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_scholarships: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          scholarship_name: string
          scholarship_slug: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          scholarship_name: string
          scholarship_slug?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          scholarship_name?: string
          scholarship_slug?: string | null
          user_id?: string
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: string | null
          application_last: string | null
          application_start: string | null
          apply_link: string | null
          category: string[] | null
          course: string[] | null
          created_at: string | null
          description: string | null
          documents: string[] | null
          faq: Json | null
          gender: string | null
          id: string
          income_limit: string | null
          is_active: boolean | null
          level: string[] | null
          name: string
          provider: string | null
          provider_type: string | null
          selection_process: string | null
          slug: string
          state: string | null
          stream: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          amount?: string | null
          application_last?: string | null
          application_start?: string | null
          apply_link?: string | null
          category?: string[] | null
          course?: string[] | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          faq?: Json | null
          gender?: string | null
          id?: string
          income_limit?: string | null
          is_active?: boolean | null
          level?: string[] | null
          name: string
          provider?: string | null
          provider_type?: string | null
          selection_process?: string | null
          slug: string
          state?: string | null
          stream?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          amount?: string | null
          application_last?: string | null
          application_start?: string | null
          apply_link?: string | null
          category?: string[] | null
          course?: string[] | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          faq?: Json | null
          gender?: string | null
          id?: string
          income_limit?: string | null
          is_active?: boolean | null
          level?: string[] | null
          name?: string
          provider?: string | null
          provider_type?: string | null
          selection_process?: string | null
          slug?: string
          state?: string | null
          stream?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      skill_progress: {
        Row: {
          id: string
          progress: number
          skill_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          progress?: number
          skill_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          progress?: number
          skill_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "student" | "parent" | "teacher" | "counselor" | "admin"
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
      app_role: ["student", "parent", "teacher", "counselor", "admin"],
    },
  },
} as const
