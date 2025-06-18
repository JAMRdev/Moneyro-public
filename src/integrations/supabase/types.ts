export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      budgets: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          period: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          period?: string
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          period?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: []
      }
      expense_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      fixed_monthly_expenses: {
        Row: {
          amount: number | null
          created_at: string
          due_date: string | null
          expense_group_id: string | null
          id: string
          month: string
          name: string
          notes: string | null
          paid: boolean | null
          payment_source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          due_date?: string | null
          expense_group_id?: string | null
          id?: string
          month: string
          name: string
          notes?: string | null
          paid?: boolean | null
          payment_source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          due_date?: string | null
          expense_group_id?: string | null
          id?: string
          month?: string
          name?: string
          notes?: string | null
          paid?: boolean | null
          payment_source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixed_monthly_expenses_expense_group_id_fkey"
            columns: ["expense_group_id"]
            isOneToOne: false
            referencedRelation: "expense_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      inactivity_notifications: {
        Row: {
          created_at: string
          id: string
          last_transaction_date: string | null
          notification_sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_transaction_date?: string | null
          notification_sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_transaction_date?: string | null
          notification_sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          device_info: string | null
          id: string
          location: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          device_info?: string | null
          id?: string
          location?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          device_info?: string | null
          id?: string
          location?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          theme: string
          updated_at: string
          username: string | null
        }
        Insert: {
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          theme?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          theme?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          id: string
          subscription: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subscription: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subscription?: Json
          user_id?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          category: string
          created_at: string
          current_amount: number
          description: string | null
          id: string
          is_active: boolean
          name: string
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          current_amount?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          savings_goal_id: string
          transaction_date: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          savings_goal_id: string
          transaction_date?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          savings_goal_id?: string
          transaction_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_transactions_savings_goal_id_fkey"
            columns: ["savings_goal_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          transaction_date?: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          user_email: string
          username: string
        }[]
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          user_email: string
          username: string
          role: string
          created_at: string
          last_transaction_date: string
          hours_since_last_transaction: number
        }[]
      }
      get_inactive_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          user_email: string
          username: string
          last_transaction_date: string
          hours_since_last_transaction: number
        }[]
      }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "admin" | "member"
      category_type: "ingreso" | "egreso"
      transaction_type: "ingreso" | "egreso" | "ahorro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member"],
      category_type: ["ingreso", "egreso"],
      transaction_type: ["ingreso", "egreso", "ahorro"],
    },
  },
} as const
