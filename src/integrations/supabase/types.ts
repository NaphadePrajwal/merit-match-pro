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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_dashboard: {
        Row: {
          id: string
          industry_distribution: Json | null
          location_distribution: Json | null
          placement_rate: number | null
          skill_gaps: Json | null
          top_skills: Json | null
          total_applications: number | null
          total_internships: number | null
          total_students: number | null
          trending_skills: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          industry_distribution?: Json | null
          location_distribution?: Json | null
          placement_rate?: number | null
          skill_gaps?: Json | null
          top_skills?: Json | null
          total_applications?: number | null
          total_internships?: number | null
          total_students?: number | null
          trending_skills?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          industry_distribution?: Json | null
          location_distribution?: Json | null
          placement_rate?: number | null
          skill_gaps?: Json | null
          top_skills?: Json | null
          total_applications?: number | null
          total_internships?: number | null
          total_students?: number | null
          trending_skills?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          applied_at: string
          id: string
          internship_id: string
          match_score: number | null
          ml_analysis: Json | null
          status: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          id?: string
          internship_id: string
          match_score?: number | null
          ml_analysis?: Json | null
          status?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          id?: string
          internship_id?: string
          match_score?: number | null
          ml_analysis?: Json | null
          status?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          application_deadline: string | null
          category: string
          company: string
          created_at: string
          current_applications: number | null
          description: string
          difficulty_level: string
          duration: string
          id: string
          is_active: boolean | null
          location: string
          max_applications: number | null
          min_qualification: string
          preferred_skills: string[] | null
          required_skills: string[]
          start_date: string | null
          stipend: number | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          category: string
          company: string
          created_at?: string
          current_applications?: number | null
          description: string
          difficulty_level: string
          duration: string
          id?: string
          is_active?: boolean | null
          location: string
          max_applications?: number | null
          min_qualification: string
          preferred_skills?: string[] | null
          required_skills: string[]
          start_date?: string | null
          stipend?: number | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          category?: string
          company?: string
          created_at?: string
          current_applications?: number | null
          description?: string
          difficulty_level?: string
          duration?: string
          id?: string
          is_active?: boolean | null
          location?: string
          max_applications?: number | null
          min_qualification?: string
          preferred_skills?: string[] | null
          required_skills?: string[]
          start_date?: string | null
          stipend?: number | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          education_level: string | null
          email: string
          experience_level: string | null
          github_url: string | null
          gpa: number | null
          graduation_year: number | null
          id: string
          institution: string | null
          interests: string[] | null
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          portfolio_url: string | null
          resume_text: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education_level?: string | null
          email: string
          experience_level?: string | null
          github_url?: string | null
          gpa?: number | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          name: string
          phone?: string | null
          portfolio_url?: string | null
          resume_text?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education_level?: string | null
          email?: string
          experience_level?: string | null
          github_url?: string | null
          gpa?: number | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          portfolio_url?: string | null
          resume_text?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_trends: {
        Row: {
          category: string
          created_at: string
          demand_count: number | null
          id: string
          month_year: string
          skill_name: string
          trend_direction: string | null
        }
        Insert: {
          category: string
          created_at?: string
          demand_count?: number | null
          id?: string
          month_year: string
          skill_name: string
          trend_direction?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          demand_count?: number | null
          id?: string
          month_year?: string
          skill_name?: string
          trend_direction?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
