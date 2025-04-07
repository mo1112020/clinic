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
      animals: {
        Row: {
          animal_type: string
          breed: string | null
          chip_number: string | null
          created_at: string | null
          custom_animal_type: string | null
          health_notes: string | null
          id: string
          name: string
          owner_id: string
          prone_diseases: string[] | null
          updated_at: string | null
        }
        Insert: {
          animal_type: string
          breed?: string | null
          chip_number?: string | null
          created_at?: string | null
          custom_animal_type?: string | null
          health_notes?: string | null
          id?: string
          name: string
          owner_id: string
          prone_diseases?: string[] | null
          updated_at?: string | null
        }
        Update: {
          animal_type?: string
          breed?: string | null
          chip_number?: string | null
          created_at?: string | null
          custom_animal_type?: string | null
          health_notes?: string | null
          id?: string
          name?: string
          owner_id?: string
          prone_diseases?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          created_at: string | null
          id: string
          price: number
          product_name: string
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          price: number
          product_name: string
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          price?: number
          product_name?: string
          quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          id: string
          inventory_id: string
          quantity: number
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_id: string
          quantity: number
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_id?: string
          quantity?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_files: {
        Row: {
          animal_id: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          uploaded_at: string | null
        }
        Insert: {
          animal_id: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          animal_id?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_files_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          animal_id: string
          created_at: string | null
          date: string
          description: string
          id: string
          notes: string
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          notes: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          notes?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          id_number: string
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          id_number: string
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          id_number?: string
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vaccinations: {
        Row: {
          animal_id: string
          completed: boolean | null
          created_at: string | null
          id: string
          notification_sent: boolean | null
          scheduled_date: string
          updated_at: string | null
          vaccine_name: string
        }
        Insert: {
          animal_id: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          notification_sent?: boolean | null
          scheduled_date: string
          updated_at?: string | null
          vaccine_name: string
        }
        Update: {
          animal_id?: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          notification_sent?: boolean | null
          scheduled_date?: string
          updated_at?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
