"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react"

interface Policy {
  id: string
  title: string
  type: 'newsletter' | 'marketing' | 'profiling'
  version: string
  content: string
  dateIssued: string
  status: 'pending' | 'approved' | 'rejected'
  required: boolean
  currentValue: boolean | null
}

interface CustomerConsents {
  newsletter_optin: boolean | null
  marketing_optin: boolean | null
  profiling_optin: boolean | null
}

export default function PolicyReviewPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null)
  const [approvals, setApprovals] = useState<{ [key: string]: boolean }>({})
  const [customerConsents, setCustomerConsents] = useState<CustomerConsents | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) return

        // Fetch current customer consents
        const consentsResponse = await fetch(`/api/consents?customer_id=${user.id}`)
        if (consentsResponse.ok) {
          const consentsData = await consentsResponse.json()
          setCustomerConsents(consentsData)
          
          // Create policies based on current consent status
          const policyList: Policy[] = [
            {
              id: "newsletter",
              title: "Newsletter Subscription",
              type: "newsletter",
              version: "2.1",
              content: `
# Newsletter Subscription Policy - Version 2.1

## Newsletter Communications

We would like to send you our newsletter with exclusive offers, hotel updates, and loyalty program benefits.

### What you'll receive:
- Monthly newsletters with exclusive hotel deals
- Special loyalty program offers and benefits
- Updates on new properties and services
- Seasonal promotions and holiday packages

### Your Choice:
You can choose whether to receive our newsletter communications. This is optional and you can change your preference at any time.

### How to manage:
- Update your preferences in your account dashboard
- Click unsubscribe in any newsletter email
- Contact our customer service team

*Last updated: December 2024*
              `,
              dateIssued: "2024-12-15",
              status: consentsData.newsletter_optin === null ? 'pending' : (consentsData.newsletter_optin ? 'approved' : 'rejected'),
              required: false,
              currentValue: consentsData.newsletter_optin
            },
            {
              id: "marketing",
              title: "Marketing Communications",
              type: "marketing",
              version: "1.3",
              content: `
# Marketing Communications Policy - Version 1.3

## Promotional Communications

We would like permission to send you targeted marketing communications about special offers and promotions that may interest you.

### Types of Communications:
- Personalized hotel recommendations based on your stay history
- Exclusive member-only promotions and discounts
- Event invitations and special experiences
- Partner offers and benefits

### How we personalize:
- Your booking history and preferences
- Loyalty tier status and benefits
- Geographic location and travel patterns
- Communication preferences and engagement

### Your Control:
- This is completely optional
- You can opt out at any time
- We respect all communication preferences
- No impact on your loyalty program benefits

*Last updated: November 2024*
              `,
              dateIssued: "2024-11-20",
              status: consentsData.marketing_optin === null ? 'pending' : (consentsData.marketing_optin ? 'approved' : 'rejected'),
              required: false,
              currentValue: consentsData.marketing_optin
            },
            {
              id: "profiling",
              title: "Data Profiling for Personalization",
              type: "profiling",
              version: "1.0",
              content: `
# Data Profiling Policy - Version 1.0

## Personalization and Profiling

We would like permission to analyze your data to create a personalized experience and improve our services.

### What this means:
- Analysis of your stay patterns and preferences
- Personalized room and service recommendations
- Customized loyalty program benefits
- Improved customer service based on your profile

### Data we analyze:
- Booking history and stay preferences
- Communication engagement patterns
- Service usage and feedback
- Loyalty program participation

### Benefits to you:
- More relevant offers and recommendations
- Faster check-in with pre-set preferences
- Personalized customer service
- Enhanced loyalty program experience

### Your rights:
- This is optional and does not affect core services
- You can withdraw consent at any time
- Request details about your profile
- Update or correct your preferences

*Last updated: December 2024*
              `,
              dateIssued: "2024-12-10",
              status: consentsData.profiling_optin === null ? 'pending' : (consentsData.profiling_optin ? 'approved' : 'rejected'),
              required: false,
              currentValue: consentsData.profiling_optin
            }
          ]
          
          setPolicies(policyList)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleApprovalChange = (policyId: string, approved: boolean) => {
    setApprovals(prev => ({ ...prev, [policyId]: approved }))
  }

  const handleSubmitAll = async () => {
    setSaving(true)
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.id) return

      // Prepare consent data
      const consentData = {
        customer_id: user.id,
        newsletter_optin: approvals.newsletter ?? customerConsents?.newsletter_optin ?? false,
        marketing_optin: approvals.marketing ?? customerConsents?.marketing_optin ?? false,
        profiling_optin: approvals.profiling ?? customerConsents?.profiling_optin ?? false,
        source: 'dashboard',
        ip_address: '', // Could be populated from request headers in production
        user_agent: navigator.userAgent
      }

      const response = await fetch('/api/consents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consentData)
      })

      if (response.ok) {
        // Update policies status
        setPolicies(prev => prev.map(policy => {
          const newValue = approvals[policy.id] ?? policy.currentValue
          return {
            ...policy,
            status: newValue === null ? 'pending' : (newValue ? 'approved' : 'rejected'),
            currentValue: newValue
          }
        }))
        
        // Clear pending approvals
        setApprovals({})
        
        // Show success message or redirect
        alert('Your preferences have been saved successfully!')
      }
    } catch (error) {
      console.error('Error saving consents:', error)
      alert('Error saving your preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const pendingPolicies = policies.filter(p => p.status === 'pending')
  const hasChanges = Object.keys(approvals).length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Privacy Preferences</h1>
        <p className="text-muted-foreground">
          Manage your communication and data processing preferences
        </p>
      </div>

      {/* Status Alert */}
      {pendingPolicies.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {pendingPolicies.length} preference{pendingPolicies.length === 1 ? '' : 's'} that need your attention.
            Please review and set your preferences below.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Policy List */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Preferences</CardTitle>
            <CardDescription>
              Select a preference to review its details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPolicy === policy.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedPolicy(policy.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{policy.title}</span>
                      {policy.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Version {policy.version} • {new Date(policy.dateIssued).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge 
                    variant={
                      policy.status === 'approved' ? 'default' : 
                      policy.status === 'rejected' ? 'secondary' : 'destructive'
                    }
                  >
                    {policy.status === 'approved' ? 'Enabled' : 
                     policy.status === 'rejected' ? 'Disabled' : 'Pending'}
                  </Badge>
                </div>

                {/* Approval Controls */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`approve-${policy.id}`}
                      checked={approvals[policy.id] ?? policy.currentValue ?? false}
                      onCheckedChange={(checked) => 
                        handleApprovalChange(policy.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`approve-${policy.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to this preference
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Policy Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedPolicy 
                ? policies.find(p => p.id === selectedPolicy)?.title
                : "Select a Preference"
              }
            </CardTitle>
            <CardDescription>
              {selectedPolicy
                ? "Review the details of this privacy preference"
                : "Choose a preference from the list to view its details"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPolicy ? (
              <ScrollArea className="h-[500px] w-full">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {policies
                    .find(p => p.id === selectedPolicy)
                    ?.content.split('\n')
                    .map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-xl font-bold mb-4">{line.slice(2)}</h1>
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-lg font-semibold mb-3 mt-6">{line.slice(3)}</h2>
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-md font-medium mb-2 mt-4">{line.slice(4)}</h3>
                      }
                      if (line.startsWith('- ')) {
                        return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>
                      }
                      if (line.startsWith('*') && line.endsWith('*')) {
                        return <p key={index} className="text-sm text-muted-foreground italic mt-4">{line.slice(1, -1)}</p>
                      }
                      if (line.trim() === '') {
                        return <br key={index} />
                      }
                      return <p key={index} className="mb-3">{line}</p>
                    })}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a preference to view its details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      {hasChanges && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Save your preferences?</p>
                <p className="text-sm text-muted-foreground">
                  Your changes will be applied to your account
                </p>
              </div>
              <Button 
                onClick={handleSubmitAll}
                disabled={saving}
                size="lg"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}