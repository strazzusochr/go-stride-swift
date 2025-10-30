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
      exercises: {
        Row: {
          contraindications: string[] | null
          created_at: string
          created_by: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          equipment: Database["public"]["Enums"]["equipment_type"]
          id: string
          is_custom: boolean | null
          name: string
          primary_muscle: Database["public"]["Enums"]["muscle_group"]
          secondary_muscles:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          technique_cues: string[] | null
          video_url: string | null
        }
        Insert: {
          contraindications?: string[] | null
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          equipment: Database["public"]["Enums"]["equipment_type"]
          id?: string
          is_custom?: boolean | null
          name: string
          primary_muscle: Database["public"]["Enums"]["muscle_group"]
          secondary_muscles?:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          technique_cues?: string[] | null
          video_url?: string | null
        }
        Update: {
          contraindications?: string[] | null
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          equipment?: Database["public"]["Enums"]["equipment_type"]
          id?: string
          is_custom?: boolean | null
          name?: string
          primary_muscle?: Database["public"]["Enums"]["muscle_group"]
          secondary_muscles?:
            | Database["public"]["Enums"]["muscle_group"][]
            | null
          technique_cues?: string[] | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_records: {
        Row: {
          created_at: string
          date: string
          exercise_id: string
          id: string
          pr_type: Database["public"]["Enums"]["pr_type"]
          reps: number | null
          session_id: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date?: string
          exercise_id: string
          id?: string
          pr_type: Database["public"]["Enums"]["pr_type"]
          reps?: number | null
          session_id?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          date?: string
          exercise_id?: string
          id?: string
          pr_type?: Database["public"]["Enums"]["pr_type"]
          reps?: number | null
          session_id?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferred_unit: string | null
          privacy_analytics_opt_in: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          preferred_unit?: string | null
          privacy_analytics_opt_in?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_unit?: string | null
          privacy_analytics_opt_in?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      recovery_logs: {
        Row: {
          created_at: string
          date: string
          hrv: number | null
          id: string
          mood: number | null
          notes: string | null
          resting_hr: number | null
          sleep_hours: number | null
          soreness_data: Json | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          hrv?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          resting_hr?: number | null
          sleep_hours?: number | null
          soreness_data?: Json | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          hrv?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          resting_hr?: number | null
          sleep_hours?: number | null
          soreness_data?: Json | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      set_entries: {
        Row: {
          completed: boolean | null
          created_at: string
          exercise_id: string
          id: string
          reps: number | null
          rest_actual_sec: number | null
          rest_planned_sec: number | null
          rir: number | null
          rpe: number | null
          session_id: string
          set_number: number
          set_type: Database["public"]["Enums"]["set_type"] | null
          technique_note: string | null
          tempo: string | null
          weight: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          exercise_id: string
          id?: string
          reps?: number | null
          rest_actual_sec?: number | null
          rest_planned_sec?: number | null
          rir?: number | null
          rpe?: number | null
          session_id: string
          set_number: number
          set_type?: Database["public"]["Enums"]["set_type"] | null
          technique_note?: string | null
          tempo?: string | null
          weight?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          exercise_id?: string
          id?: string
          reps?: number | null
          rest_actual_sec?: number | null
          rest_planned_sec?: number | null
          rir?: number | null
          rpe?: number | null
          session_id?: string
          set_number?: number
          set_type?: Database["public"]["Enums"]["set_type"] | null
          technique_note?: string | null
          tempo?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "set_entries_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      template_exercises: {
        Row: {
          day_number: number
          exercise_id: string
          exercise_order: number
          id: string
          notes: string | null
          rest_seconds: number | null
          target_reps_max: number | null
          target_reps_min: number | null
          target_rpe: number | null
          target_sets: number | null
          template_id: string
        }
        Insert: {
          day_number: number
          exercise_id: string
          exercise_order: number
          id?: string
          notes?: string | null
          rest_seconds?: number | null
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_rpe?: number | null
          target_sets?: number | null
          template_id: string
        }
        Update: {
          day_number?: number
          exercise_id?: string
          exercise_order?: number
          id?: string
          notes?: string | null
          rest_seconds?: number | null
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_rpe?: number | null
          target_sets?: number | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_exercises_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          created_at: string
          date: string
          end_time: string | null
          id: string
          notes: string | null
          perceived_energy: number | null
          start_time: string
          template_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          perceived_energy?: number | null
          start_time?: string
          template_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          perceived_energy?: number | null
          start_time?: string
          template_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          created_at: string
          days_per_week: number | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          periodization:
            | Database["public"]["Enums"]["periodization_type"]
            | null
          split_type: Database["public"]["Enums"]["split_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_per_week?: number | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          periodization?:
            | Database["public"]["Enums"]["periodization_type"]
            | null
          split_type?: Database["public"]["Enums"]["split_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_per_week?: number | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          periodization?:
            | Database["public"]["Enums"]["periodization_type"]
            | null
          split_type?: Database["public"]["Enums"]["split_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_templates_user_id_fkey"
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "coach" | "admin"
      difficulty_level: "beginner" | "intermediate" | "advanced" | "elite"
      equipment_type:
        | "barbell"
        | "dumbbell"
        | "cable"
        | "machine"
        | "bodyweight"
        | "resistance_band"
        | "kettlebell"
        | "other"
      muscle_group:
        | "chest"
        | "back"
        | "shoulders"
        | "biceps"
        | "triceps"
        | "forearms"
        | "quads"
        | "hamstrings"
        | "glutes"
        | "calves"
        | "abs"
        | "obliques"
        | "lower_back"
        | "traps"
        | "neck"
      periodization_type: "linear" | "undulating" | "block" | "dup"
      pr_type:
        | "one_rm"
        | "three_rm"
        | "five_rm"
        | "eight_rm"
        | "ten_rm"
        | "volume"
        | "rep_at_weight"
      set_type:
        | "normal"
        | "warmup"
        | "drop_set"
        | "super_set"
        | "tri_set"
        | "myo_reps"
        | "rest_pause"
        | "cluster"
      split_type:
        | "full_body"
        | "upper_lower"
        | "push_pull_legs"
        | "bro_split"
        | "custom"
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
      app_role: ["user", "coach", "admin"],
      difficulty_level: ["beginner", "intermediate", "advanced", "elite"],
      equipment_type: [
        "barbell",
        "dumbbell",
        "cable",
        "machine",
        "bodyweight",
        "resistance_band",
        "kettlebell",
        "other",
      ],
      muscle_group: [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "forearms",
        "quads",
        "hamstrings",
        "glutes",
        "calves",
        "abs",
        "obliques",
        "lower_back",
        "traps",
        "neck",
      ],
      periodization_type: ["linear", "undulating", "block", "dup"],
      pr_type: [
        "one_rm",
        "three_rm",
        "five_rm",
        "eight_rm",
        "ten_rm",
        "volume",
        "rep_at_weight",
      ],
      set_type: [
        "normal",
        "warmup",
        "drop_set",
        "super_set",
        "tri_set",
        "myo_reps",
        "rest_pause",
        "cluster",
      ],
      split_type: [
        "full_body",
        "upper_lower",
        "push_pull_legs",
        "bro_split",
        "custom",
      ],
    },
  },
} as const
