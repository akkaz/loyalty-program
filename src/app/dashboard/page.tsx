"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, FileText, Users, Hotel } from "lucide-react"

interface CustomerData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  loyalty_tier?: {
    name: string
    code: string
    benefits?: any
  }
  total_stays: number
  pending_policies: number
}

export default function DashboardPage() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.email) return

        const response = await fetch(`/api/customers?email=${encodeURIComponent(user.email)}`)
        if (response.ok) {
          const data = await response.json()
          setCustomerData(data)
        }
      } catch (error) {
        console.error('Error fetching customer data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const recentActivities = [
    {
      type: "stay",
      title: "Recent hotel stay completed",
      date: "2 days ago",
      status: "completed"
    },
    {
      type: "policy",
      title: "New privacy policy requires approval",
      date: "1 week ago",
      status: "pending"
    },
    {
      type: "loyalty",
      title: `${customerData?.loyalty_tier?.name || 'Member'} status active`,
      date: "Current",
      status: "completed"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stays</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData?.total_stays || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData?.pending_policies || 0}</div>
            <p className="text-xs text-muted-foreground">
              Require your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Tier</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {customerData?.loyalty_tier?.name || 'Member'}
              <Badge variant="secondary">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {customerData?.loyalty_tier?.code || 'MEMBER'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerData?.first_name || 'Guest'}
            </div>
            <p className="text-xs text-muted-foreground">
              Welcome back!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Your latest interactions with the loyalty program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.date}
                  </p>
                </div>
                <Badge variant={activity.status === 'pending' ? 'destructive' : 'default'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a 
              href="/dashboard/policy" 
              className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <FileText className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Review Policies</p>
                <p className="text-xs text-muted-foreground">
                  {customerData?.pending_policies || 0} pending approvals
                </p>
              </div>
            </a>

            <a 
              href="/dashboard/calendar" 
              className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <CalendarDays className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">View Calendar</p>
                <p className="text-xs text-muted-foreground">Check stay history</p>
              </div>
            </a>

            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <Users className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Loyalty Benefits</p>
                <p className="text-xs text-muted-foreground">
                  {customerData?.loyalty_tier?.name || 'Member'} tier
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}