import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Fetch customer with loyalty tier information
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select(`
        *,
        loyalty_tier:loyalty_tiers(*)
      `)
      .eq('email', email)
      .single()

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Error fetching customer:', customerError)
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      )
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Fetch customer stays count
    const { count: staysCount } = await supabaseAdmin
      .from('stays')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customer.id)
      .eq('status', 'checked_out')

    // Fetch pending consents (can be used for policy review)
    const { count: pendingConsents } = await supabaseAdmin
      .from('consents')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customer.id)
      .is('newsletter_optin', null)

    const customerData = {
      ...customer,
      total_stays: staysCount || 0,
      pending_policies: pendingConsents || 0
    }

    return NextResponse.json(customerData)
  } catch (error) {
    console.error('Error in customer API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}