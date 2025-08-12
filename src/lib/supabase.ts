import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser use (with Row Level Security)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types based on our schema
export interface Customer {
  id: string
  mrpreno_customer_id?: number
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
  fiscal_code?: string
  loyalty_tier_id?: string
  preferences?: any
  Language?: string
  created_at?: string
  updated_at?: string
}

export interface LoyaltyTier {
  id: string
  name: string
  code: string
  min_stays: number
  description?: string
  benefits?: any
  created_at?: string
}

export interface Stay {
  id: string
  customer_id: string
  hotel_id: string
  mrpreno_booking_id: number
  mrpreno_booking_number?: string
  booking_date?: string
  arrival_date?: string
  departure_date?: string
  status?: 'booked' | 'waiting_payment' | 'payment_in_progress' | 'confirmed' | 'canceled' | 'waiting_credit_card_guarantee' | 'checked_in' | 'checked_out' | 'no_show'
  amount?: number
  discount?: number
  deposit?: number
  deposit_is_paid?: boolean
  deposit_payment_method?: string
  deposit_payment_date?: string
  annotations?: string
  request_source_medium?: string
  request_source_channel?: string
  request_source_type_name?: string
  living_unit_name?: string
  living_unit_number?: string
  accommodation_type_name?: string
  raw_payload_booking?: any
  created_at?: string
  updated_at?: string
}

export interface Hotel {
  id: string
  company_id: string
  name: string
  created_at?: string
}

export interface Company {
  id: string
  name: string
  created_at?: string
}

export interface Consent {
  id: string
  customer_id: string
  newsletter_optin?: boolean
  marketing_optin?: boolean
  profiling_optin?: boolean
  source?: string
  ip_address?: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}