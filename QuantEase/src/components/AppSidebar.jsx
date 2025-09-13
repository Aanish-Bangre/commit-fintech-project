import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Calculator,
  BarChart3,
  Shield,
  Bot,
  TrendingUp,
  FileCheck,
  Users,
  BookOpen,
  LayoutDashboard,
  LogOut,
  User,
  Building2
} from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

// Menu items data
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Strategy Builder",
    url: "/strategy-builder",
    icon: Calculator,
  },
  {
    title: "Backtesting",
    url: "/backtesting",
    icon: BarChart3,
  },
  {
    title: "Risk Dashboard",
    url: "/risk-dashboard",
    icon: Shield,
  },
  {
    title: "AI Assistant",
    url: "/ai-assistant",
    icon: Bot,
  },
  {
    title: "Paper Trading",
    url: "/paper-trading",
    icon: TrendingUp,
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: FileCheck,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Users,
  },
  {
    title: "Education",
    url: "/education",
    icon: BookOpen,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, signOut, user } = useAuthContext()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">QuantEase</span>
            <span className="text-sm text-muted-foreground">Trading Platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <button className="flex items-center gap-3 w-full">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        {session ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Authenticated</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => handleNavigation('/login')}
          >
            Sign In
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
