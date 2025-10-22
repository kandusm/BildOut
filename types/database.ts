export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'void'
export type PaymentStatus = 'requires_payment' | 'processing' | 'succeeded' | 'failed' | 'canceled'
export type UserRole = 'owner' | 'admin' | 'member'

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          owner_id: string
          invoice_number_sequence: number
          invoice_prefix: string
          created_at: string
          updated_at: string
          deleted_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          invoice_number_sequence?: number
          invoice_prefix?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          invoice_number_sequence?: number
          invoice_prefix?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          metadata?: Json
        }
      }
      users: {
        Row: {
          id: string
          org_id: string | null
          role: UserRole
          stripe_connect_id: string | null
          stripe_onboarding_complete: boolean
          display_name: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          metadata: Json
        }
        Insert: {
          id: string
          org_id?: string | null
          role?: UserRole
          stripe_connect_id?: string | null
          stripe_onboarding_complete?: boolean
          display_name?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          org_id?: string | null
          role?: UserRole
          stripe_connect_id?: string | null
          stripe_onboarding_complete?: boolean
          display_name?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          metadata?: Json
        }
      }
      clients: {
        Row: {
          id: string
          org_id: string
          name: string
          email: string | null
          phone: string | null
          address: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
          created_by: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          metadata?: Json
        }
      }
      items: {
        Row: {
          id: string
          org_id: string
          name: string
          description: string | null
          unit_price: number
          unit: string
          tax_rate: number
          created_at: string
          updated_at: string
          deleted_at: string | null
          created_by: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          description?: string | null
          unit_price?: number
          unit?: string
          tax_rate?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          description?: string | null
          unit_price?: number
          unit?: string
          tax_rate?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          metadata?: Json
        }
      }
      invoices: {
        Row: {
          id: string
          org_id: string
          client_id: string | null
          number: string
          status: InvoiceStatus
          currency: string
          issue_date: string
          due_date: string | null
          subtotal: number
          tax_total: number
          discount_total: number
          total: number
          amount_paid: number
          amount_due: number
          allow_partial: boolean
          deposit_required: number | null
          notes: string | null
          terms: string | null
          pdf_url: string | null
          payment_link_token: string
          stripe_payment_intent: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
          created_by: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          org_id: string
          client_id?: string | null
          number: string
          status?: InvoiceStatus
          currency?: string
          issue_date?: string
          due_date?: string | null
          subtotal?: number
          tax_total?: number
          discount_total?: number
          total?: number
          amount_paid?: number
          amount_due?: number
          allow_partial?: boolean
          deposit_required?: number | null
          notes?: string | null
          terms?: string | null
          pdf_url?: string | null
          payment_link_token: string
          stripe_payment_intent?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          org_id?: string
          client_id?: string | null
          number?: string
          status?: InvoiceStatus
          currency?: string
          issue_date?: string
          due_date?: string | null
          subtotal?: number
          tax_total?: number
          discount_total?: number
          total?: number
          amount_paid?: number
          amount_due?: number
          allow_partial?: boolean
          deposit_required?: number | null
          notes?: string | null
          terms?: string | null
          pdf_url?: string | null
          payment_link_token?: string
          stripe_payment_intent?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          created_by?: string | null
          metadata?: Json
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          item_id: string | null
          name: string
          description: string | null
          quantity: number
          unit_price: number
          tax_rate: number
          line_total: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          item_id?: string | null
          name: string
          description?: string | null
          quantity?: number
          unit_price?: number
          tax_rate?: number
          line_total?: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          item_id?: string | null
          name?: string
          description?: string | null
          quantity?: number
          unit_price?: number
          tax_rate?: number
          line_total?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          org_id: string
          invoice_id: string
          stripe_payment_intent: string | null
          stripe_charge_id: string | null
          amount: number
          currency: string
          status: PaymentStatus
          method: string | null
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          org_id: string
          invoice_id: string
          stripe_payment_intent?: string | null
          stripe_charge_id?: string | null
          amount: number
          currency?: string
          status: PaymentStatus
          method?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          org_id?: string
          invoice_id?: string
          stripe_payment_intent?: string | null
          stripe_charge_id?: string | null
          amount?: number
          currency?: string
          status?: PaymentStatus
          method?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      stripe_events: {
        Row: {
          id: string
          type: string
          received_at: string
          payload: Json
          processed: boolean
          processed_at: string | null
        }
        Insert: {
          id: string
          type: string
          received_at?: string
          payload: Json
          processed?: boolean
          processed_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          received_at?: string
          payload?: Json
          processed?: boolean
          processed_at?: string | null
        }
      }
    }
  }
}
