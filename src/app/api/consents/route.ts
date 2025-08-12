import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    // Fetch customer consents
    const { data: consents, error } = await supabase
      .from('customer_consents')
      .select('*')
      .eq('customer_id', customerId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching consents:', error)
      return NextResponse.json({ error: 'Failed to fetch consents' }, { status: 500 })
    }

    // If no consents found, return defaults
    if (!consents) {
      return NextResponse.json({
        newsletter_optin: null,
        marketing_optin: null,
        profiling_optin: null
      })
    }

    return NextResponse.json({
      newsletter_optin: consents.newsletter_optin,
      marketing_optin: consents.marketing_optin,
      profiling_optin: consents.profiling_optin,
      updated_at: consents.updated_at
    })

  } catch (error) {
    console.error('Error in consents GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_id,
      newsletter_optin,
      marketing_optin,
      profiling_optin,
      source = 'dashboard',
      ip_address = '',
      user_agent = ''
    } = body

    if (!customer_id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    // Prepare consent record
    const consentData = {
      customer_id,
      newsletter_optin: newsletter_optin === null ? null : Boolean(newsletter_optin),
      marketing_optin: marketing_optin === null ? null : Boolean(marketing_optin),
      profiling_optin: profiling_optin === null ? null : Boolean(profiling_optin),
      source,
      ip_address,
      user_agent,
      updated_at: new Date().toISOString()
    }

    // Check if customer consents already exist
    const { data: existingConsents, error: fetchError } = await supabase
      .from('customer_consents')
      .select('id')
      .eq('customer_id', customer_id)
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing consents:', fetchError)
      return NextResponse.json({ error: 'Failed to check existing consents' }, { status: 500 })
    }

    let result
    if (existingConsents) {
      // Update existing consents
      result = await supabase
        .from('customer_consents')
        .update(consentData)
        .eq('customer_id', customer_id)
        .select()
    } else {
      // Insert new consents
      result = await supabase
        .from('customer_consents')
        .insert(consentData)
        .select()
    }

    const { data, error } = result

    if (error) {
      console.error('Error saving consents:', error)
      return NextResponse.json({ error: 'Failed to save consents' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Consents saved successfully',
      data: data[0]
    })

  } catch (error) {
    console.error('Error in consents POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}