"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CalendarDays,
  FileText,
  Hotel,
  TrendingUp,
  Star,
  Gift,
  Clock,
  Award,
  ArrowRight,
  BarChart3
} from "lucide-react"

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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {customerData?.first_name || 'Guest'}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Your loyalty journey continues with {customerData?.total_stays || 0} amazing stays
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-chart-1 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stays</CardTitle>
            <div className="p-2 bg-chart-1/10 rounded-lg">
              <Hotel className="h-4 w-4 text-chart-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData?.total_stays || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Completed bookings
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Benefits</CardTitle>
            <div className="p-2 bg-chart-2/10 rounded-lg">
              <Star className="h-4 w-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData?.loyalty_tier?.name || 'Welcome'}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="default" className="text-xs bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                Free Wi-Fi
              </Badge>
              <Badge variant="default" className="text-xs bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                Late Checkout
              </Badge>
              <Badge variant="default" className="text-xs bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                Points Earning
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Status</CardTitle>
            <div className="p-2 bg-chart-3/10 rounded-lg">
              <Star className="h-4 w-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {customerData?.loyalty_tier?.name || 'Welcome'}
              <Badge variant="secondary" className="bg-chart-3/20 text-chart-3 border-chart-3/30">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {customerData?.loyalty_tier?.code || 'MEMBER'} tier benefits
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Points</CardTitle>
            <div className="p-2 bg-chart-4/10 rounded-lg">
              <Gift className="h-4 w-4 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((customerData?.total_stays || 0) * 150).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Award className="h-3 w-3 mr-1" />
              Available to redeem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Activities & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Activities</span>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                Your latest interactions with the loyalty program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 hover:border-primary/20 transition-all duration-200 group">
                  <div className={`rounded-full p-2.5 ${activity.status === 'pending'
                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                    : 'bg-green-100 text-green-600 border border-green-200'
                    }`}>
                    {activity.type === 'stay' && <Hotel className="h-4 w-4" />}
                    {activity.type === 'policy' && <FileText className="h-4 w-4" />}
                    {activity.type === 'loyalty' && <Star className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.date}
                    </p>
                  </div>
                  <Badge
                    variant={activity.status === 'pending' ? 'destructive' : 'default'}
                    className={activity.status === 'pending'
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Loyalty Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Loyalty Progress
              </CardTitle>
              <CardDescription>
                Your journey to the next tier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Tier</p>
                  <p className="text-2xl font-bold">
                    {customerData?.loyalty_tier?.name || 'Welcome'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Next Tier</p>
                  <p className="text-2xl font-bold">Gold</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{customerData?.total_stays || 0} stays</span>
                  <span>5 stays needed</span>
                </div>
                <Progress
                  value={((customerData?.total_stays || 0) / 5) * 100}
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{customerData?.total_stays || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Stays</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {((customerData?.total_stays || 0) * 150).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Points Earned</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {5 - (customerData?.total_stays || 0) > 0 ? 5 - (customerData?.total_stays || 0) : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Stays to Gold</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Benefits */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start h-auto p-4 bg-primary hover:bg-primary/90 group">
                <a href="/dashboard/policy" className="flex items-center space-x-3">
                  <div className="p-1.5 bg-primary-foreground/20 rounded-md">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium">Review Policies</p>
                    <p className="text-xs text-primary-foreground/80">
                      {customerData?.pending_policies || 0} pending approvals
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-auto p-4 hover:bg-accent group">
                <a href="/dashboard/calendar" className="flex items-center space-x-3">
                  <div className="p-1.5 bg-chart-2/10 rounded-md">
                    <CalendarDays className="h-4 w-4 text-chart-2" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium">View Calendar</p>
                    <p className="text-xs text-muted-foreground">Check stay history</p>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <div className="flex items-center space-x-3 rounded-lg border border-dashed border-muted p-4 bg-muted/20">
                <div className="p-1.5 bg-chart-5/10 rounded-md">
                  <Gift className="h-4 w-4 text-chart-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-muted-foreground">Redeem Rewards</p>
                  <p className="text-xs text-muted-foreground/70">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}