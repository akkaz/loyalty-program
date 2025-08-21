"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Home, FileText, Calendar, LogOut, User, Settings } from "lucide-react"

interface User {
  email: string
  name: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        router.push('/login')
      }
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home
    },
    {
      title: "Policy Review",
      url: "/dashboard/policy",
      icon: FileText
    },
    {
      title: "Hotel Nights",
      url: "/dashboard/calendar",
      icon: Calendar
    }
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <div className="flex w-full">
          <Sidebar className="border-r bg-sidebar">
            <SidebarHeader className="border-b border-sidebar-border p-6 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-lg font-bold text-sidebar-foreground">Loyalty Program</span>
                  <p className="text-xs text-sidebar-foreground/70">Hotel Management</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarMenu className="space-y-2">
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="w-full justify-start rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                      <a href={item.url} className="flex items-center gap-3 p-3">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-4 bg-gradient-to-r from-sidebar-accent/20 to-sidebar-accent/10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                      <AvatarImage src="/avatars/user.png" alt={user.name || user.email} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 text-left flex-1">
                      <div className="text-sm font-semibold text-sidebar-foreground">{user.name || user.email}</div>
                      <div className="text-xs text-sidebar-foreground/70">{user.email}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" side="top">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 min-w-0 w-full">
            <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
              <div className="flex h-16 items-center px-6 w-full">
                <SidebarTrigger className="mr-4 hover:bg-accent rounded-md" />
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      Hotel Loyalty Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Welcome back, {user.name ? user.name.split(' ')[0] : user.email}!
                    </p>
                  </div>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium border border-green-200">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="w-full p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}