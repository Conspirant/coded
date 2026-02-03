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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_activities: {
        Row: {
          action: string
          admin_id: string
          changes: Json | null
          created_at: string | null
          id: string
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          admin_id: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activities_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          category: string | null
          code: string
          created_at: string | null
          duration: number | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string | null
          duration?: number | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      college_reviews: {
        Row: {
          college_id: string
          created_at: string | null
          faculty_rating: number | null
          helpful_votes: number | null
          id: string
          infrastructure_rating: number | null
          placements_rating: number | null
          rating: number | null
          review_text: string | null
          session_id: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          college_id: string
          created_at?: string | null
          faculty_rating?: number | null
          helpful_votes?: number | null
          id?: string
          infrastructure_rating?: number | null
          placements_rating?: number | null
          rating?: number | null
          review_text?: string | null
          session_id?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          college_id?: string
          created_at?: string | null
          faculty_rating?: number | null
          helpful_votes?: number | null
          id?: string
          infrastructure_rating?: number | null
          placements_rating?: number | null
          rating?: number | null
          review_text?: string | null
          session_id?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "college_reviews_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          code: string
          created_at: string | null
          district: string | null
          established_year: number | null
          facilities: Json | null
          fees_structure: Json | null
          id: string
          location: string | null
          name: string
          placement_stats: Json | null
          type: string | null
          website: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          district?: string | null
          established_year?: number | null
          facilities?: Json | null
          fees_structure?: Json | null
          id?: string
          location?: string | null
          name: string
          placement_stats?: Json | null
          type?: string | null
          website?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          district?: string | null
          established_year?: number | null
          facilities?: Json | null
          fees_structure?: Json | null
          id?: string
          location?: string | null
          name?: string
          placement_stats?: Json | null
          type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      cutoffs: {
        Row: {
          branch_id: string
          category: Database["public"]["Enums"]["category_type"]
          closing_rank: number
          college_id: string
          created_at: string | null
          id: string
          opening_rank: number | null
          quota_type: Database["public"]["Enums"]["quota_type"] | null
          round: number | null
          seat_type: Database["public"]["Enums"]["seat_type"]
          seats_available: number | null
          source_url: string | null
          verified: boolean | null
          year: number
        }
        Insert: {
          branch_id: string
          category: Database["public"]["Enums"]["category_type"]
          closing_rank: number
          college_id: string
          created_at?: string | null
          id?: string
          opening_rank?: number | null
          quota_type?: Database["public"]["Enums"]["quota_type"] | null
          round?: number | null
          seat_type: Database["public"]["Enums"]["seat_type"]
          seats_available?: number | null
          source_url?: string | null
          verified?: boolean | null
          year: number
        }
        Update: {
          branch_id?: string
          category?: Database["public"]["Enums"]["category_type"]
          closing_rank?: number
          college_id?: string
          created_at?: string | null
          id?: string
          opening_rank?: number | null
          quota_type?: Database["public"]["Enums"]["quota_type"] | null
          round?: number | null
          seat_type?: Database["public"]["Enums"]["seat_type"]
          seats_available?: number | null
          source_url?: string | null
          verified?: boolean | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "cutoffs_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cutoffs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_simulations: {
        Row: {
          category: Database["public"]["Enums"]["category_type"]
          created_at: string | null
          id: string
          preferences: Json
          rank: number
          round_results: Json | null
          simulation_result: Json | null
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          id?: string
          preferences: Json
          rank: number
          round_results?: Json | null
          simulation_result?: Json | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          id?: string
          preferences?: Json
          rank?: number
          round_results?: Json | null
          simulation_result?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_simulations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_subscriptions: {
        Row: {
          created_at: string | null
          email_enabled: boolean | null
          filters: Json | null
          id: string
          push_enabled: boolean | null
          subscription_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_enabled?: boolean | null
          filters?: Json | null
          id?: string
          push_enabled?: boolean | null
          subscription_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_enabled?: boolean | null
          filters?: Json | null
          id?: string
          push_enabled?: boolean | null
          subscription_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rank_predictions: {
        Row: {
          category: Database["public"]["Enums"]["category_type"]
          confidence_score: number | null
          created_at: string | null
          id: string
          marks: number
          predicted_rank_max: number
          predicted_rank_min: number
          subject_marks: Json | null
          user_id: string | null
          year: number
        }
        Insert: {
          category: Database["public"]["Enums"]["category_type"]
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          marks: number
          predicted_rank_max: number
          predicted_rank_min: number
          subject_marks?: Json | null
          user_id?: string | null
          year: number
        }
        Update: {
          category?: Database["public"]["Enums"]["category_type"]
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          marks?: number
          predicted_rank_max?: number
          predicted_rank_min?: number
          subject_marks?: Json | null
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "rank_predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_matrix: {
        Row: {
          branch_id: string
          category: Database["public"]["Enums"]["category_type"]
          college_id: string
          id: string
          last_updated: string | null
          quota_type: Database["public"]["Enums"]["quota_type"] | null
          seats_filled: number | null
          seats_remaining: number | null
          seats_total: number
          year: number
        }
        Insert: {
          branch_id: string
          category: Database["public"]["Enums"]["category_type"]
          college_id: string
          id?: string
          last_updated?: string | null
          quota_type?: Database["public"]["Enums"]["quota_type"] | null
          seats_filled?: number | null
          seats_remaining?: number | null
          seats_total: number
          year: number
        }
        Update: {
          branch_id?: string
          category?: Database["public"]["Enums"]["category_type"]
          college_id?: string
          id?: string
          last_updated?: string | null
          quota_type?: Database["public"]["Enums"]["quota_type"] | null
          seats_filled?: number | null
          seats_remaining?: number | null
          seats_total?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "seat_matrix_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_matrix_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          category: Database["public"]["Enums"]["category_type"] | null
          created_at: string | null
          email: string
          expected_rank: number | null
          full_name: string | null
          id: string
          marks: number | null
          phone: string | null
          preferences: string[] | null
          subject_marks: Json | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["category_type"] | null
          created_at?: string | null
          email: string
          expected_rank?: number | null
          full_name?: string | null
          id: string
          marks?: number | null
          phone?: string | null
          preferences?: string[] | null
          subject_marks?: Json | null
        }
        Update: {
          category?: Database["public"]["Enums"]["category_type"] | null
          created_at?: string | null
          email?: string
          expected_rank?: number | null
          full_name?: string | null
          id?: string
          marks?: number | null
          phone?: string | null
          preferences?: string[] | null
          subject_marks?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_rank_prediction: {
        Args: {
          input_category: Database["public"]["Enums"]["category_type"]
          input_marks: number
          target_year?: number
        }
        Returns: {
          confidence_score: number
          predicted_rank_max: number
          predicted_rank_min: number
        }[]
      }
    }
    Enums: {
      category_type: "1G" | "2A" | "2B" | "3A" | "3B" | "GM" | "SC" | "ST"
      quota_type:
        | "general"
        | "rural"
        | "hyderabad_karnataka"
        | "horanadu"
        | "gadinadu"
      seat_type: "government" | "management" | "nri" | "comed_k"
      user_role: "student" | "admin"
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
      category_type: ["1G", "2A", "2B", "3A", "3B", "GM", "SC", "ST"],
      quota_type: [
        "general",
        "rural",
        "hyderabad_karnataka",
        "horanadu",
        "gadinadu",
      ],
      seat_type: ["government", "management", "nri", "comed_k"],
      user_role: ["student", "admin"],
    },
  },
} as const
