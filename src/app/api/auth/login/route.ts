import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if customer exists in database
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select(`
        *,
        loyalty_tier:loyalty_tiers(
          id,
          name,
          code,
          min_stays,
          description,
          benefits
        )
      `)
      .eq('email', email.toLowerCase().trim())
      .single()

    if (customerError && customerError.code === 'PGRST116') {
      // Customer not found
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your email or contact support.' },
        { status: 404 }
      )
    }

    if (customerError) {
      console.error('Database error during login:', customerError)
      return NextResponse.json(
        { error: 'Database error. Please try again later.' },
        { status: 500 }
      )
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your email or contact support.' },
        { status: 404 }
      )
    }

    // Get additional customer stats
    const [staysResult, consentsResult] = await Promise.all([
      // Get total completed stays
      supabaseAdmin
        .from('stays')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', customer.id)
        .eq('status', 'checked_out'),
      
      // Get pending consents (policies that need approval)
      supabaseAdmin
        .from('consents')
        .select('*')
        .eq('customer_id', customer.id)
        .single()
    ])

    const totalStays = staysResult.count || 0
    
    // Check for pending policies (if no consent record exists or if any consent is null)
    let pendingPolicies = 0
    if (!consentsResult.data || 
        consentsResult.data.newsletter_optin === null || 
        consentsResult.data.marketing_optin === null || 
        consentsResult.data.profiling_optin === null) {
      pendingPolicies = 1 // At least one policy needs attention
    }

    // Prepare customer data for frontend
    const customerData = {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
      city: customer.city,
      country: customer.country,
      loyalty_tier: customer.loyalty_tier,
      preferences: customer.preferences,
      Language: customer.Language,
      total_stays: totalStays,
      pending_policies: pendingPolicies,
      created_at: customer.created_at
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      customer: customerData
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}