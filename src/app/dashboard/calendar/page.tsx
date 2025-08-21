"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDays, Hotel, MapPin, Clock } from "lucide-react"

interface Stay {
  id: string
  hotel: {
    name: string
    company: {
      name: string
    }
  }
  arrival_date: string
  departure_date: string
  nights: number
  status: 'completed' | 'upcoming' | 'cancelled'
  living_unit_name?: string
  mrpreno_booking_number?: string
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [stays, setStays] = useState<Stay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStays = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.email) return

        // First get customer data to get customer ID
        const customerResponse = await fetch(`/api/customers?email=${encodeURIComponent(user.email)}`)
        if (!customerResponse.ok) return

        const customerData = await customerResponse.json()
        
        // Then get stays for this customer
        const staysResponse = await fetch(`/api/stays?customer_id=${customerData.id}`)
        if (staysResponse.ok) {
          const staysData = await staysResponse.json()
          setStays(staysData)
        }
      } catch (error) {
        console.error('Error fetching stays:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStays()
  }, [])

  // Create arrays of dates by stay status with proper date generation
  const completedStayDates: Date[] = []
  const upcomingStayDates: Date[] = []
  const cancelledStayDates: Date[] = []

  stays.forEach(stay => {
    const startDate = new Date(stay.arrival_date)
    const endDate = new Date(stay.departure_date)
    
    // Generate all nights for this stay (excluding checkout day)
    const currentDate = new Date(startDate)
    while (currentDate < endDate) {
      const dateToAdd = new Date(currentDate)
      
      if (stay.status === 'completed') {
        completedStayDates.push(dateToAdd)
      } else if (stay.status === 'upcoming') {
        upcomingStayDates.push(dateToAdd)
      } else if (stay.status === 'cancelled') {
        cancelledStayDates.push(dateToAdd)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  // All stay dates for general checks
  const allStayDates = [...completedStayDates, ...upcomingStayDates, ...cancelledStayDates]

  // Get stays for selected date (only include nights, not checkout day)
  const getStaysForDate = (date: Date) => {
    return stays.filter(stay => {
      const stayStart = new Date(stay.arrival_date)
      const stayEnd = new Date(stay.departure_date)
      return date >= stayStart && date < stayEnd
    })
  }

  const selectedDateStays = selectedDate ? getStaysForDate(selectedDate) : []

  // Calculate total stats
  const totalNights = stays.reduce((sum, stay) => sum + stay.nights, 0)
  const completedStays = stays.filter(stay => stay.status === 'completed').length
  const upcomingStays = stays.filter(stay => stay.status === 'upcoming').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Hotel Nights Calendar</h1>
        <p className="text-muted-foreground">
          Track your hotel stays and view your travel history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nights</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNights}</div>
            <p className="text-xs text-muted-foreground">
              Across all stays
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Stays</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedStays}</div>
            <p className="text-xs text-muted-foreground">
              Past bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Stays</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingStays}</div>
            <p className="text-xs text-muted-foreground">
              Future bookings
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              Click on a date to see stays for that day. Days with stays are highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                completed: completedStayDates,
                upcoming: upcomingStayDates,
                cancelled: cancelledStayDates,
              }}
              modifiersStyles={{
                completed: {
                  backgroundColor: "hsl(142 76% 36%)", // green for completed
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto"
                },
                upcoming: {
                  backgroundColor: "hsl(221 83% 53%)", // blue for upcoming
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto"
                },
                cancelled: {
                  backgroundColor: "hsl(0 84% 60%)", // red for cancelled
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto"
                }
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-600"></div>
                <span>Completed Stays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-600"></div>
                <span>Upcoming Stays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span>Cancelled Stays</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Hotel Stays */}
        <Card>
          <CardHeader>
            <CardTitle>All Hotel Stays</CardTitle>
            <CardDescription>
              Complete history of your hotel bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {stays.length > 0 ? (
                  stays
                    .sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime())
                    .map((stay) => (
                    <div key={stay.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Hotel className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{stay.hotel.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {stay.hotel.company.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(stay.arrival_date).toLocaleDateString()} - {new Date(stay.departure_date).toLocaleDateString()} 
                            ({stay.nights} night{stay.nights === 1 ? '' : 's'})
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            stay.status === 'completed' ? 'default' : 
                            stay.status === 'upcoming' ? 'secondary' : 'destructive'
                          }
                          className="mb-2"
                        >
                          {stay.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">{stay.living_unit_name || 'Room'}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Hotel className="h-12 w-12 mx-auto mb-4" />
                    <p>No hotel stays found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}