// ============================================
// HeartQuest Database Types (Supabase)
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Simplified database types - using 'any' for flexibility
// since we're using JSONB columns extensively
export interface Database {
  public: {
    Tables: {
      players: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
      inventory: {
        Row: Record<string, any>
        Insert: Record<string, any>
        Update: Record<string, any>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
