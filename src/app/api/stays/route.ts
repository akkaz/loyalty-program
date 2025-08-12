import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Fetch stays with hotel and company information
    const { data: stays, error: staysError } = await supabaseAdmin
      .from('stays')
      .select(`
        *,
        hotel:hotels(
          id,
          name,
          company:companies(
            id,
            name
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('arrival_date', { ascending: false })

    if (staysError) {
      console.error('Error fetching stays:', staysError)
      return NextResponse.json(
        { error: 'Failed to fetch stays data' },
        { status: 500 }
      )
    }

    // Calculate nights for each stay
    const staysWithNights = stays?.map(stay => {
      let nights = 0
      if (stay.arrival_date && stay.departure_date) {
        const arrival = new Date(stay.arrival_date)
        const departure = new Date(stay.departure_date)
        nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24))
      }
      
      return {
        ...stay,
        nights,
        // Map status for frontend compatibility
        status: mapBookingStatus(stay.status)
      }
    }) || []

    return NextResponse.json(staysWithNights)
  } catch (error) {
    console.error('Error in stays API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function mapBookingStatus(status: string | null): 'completed' | 'upcoming' | 'cancelled' {
  switch (status) {
    case 'checked_out':
      return 'completed'
    case 'canceled':
    case 'no_show':
      return 'cancelled'
    case 'booked':
    case 'confirmed':
    case 'waiting_payment':
    case 'payment_in_progress':
    case 'waiting_credit_card_guarantee':
    case 'checked_in':
      return 'upcoming'
    default:
      return 'upcoming'
  }
}