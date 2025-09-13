import * as React from "react"
import { useNavigate } from "react-router-dom"
import { TrendingUp, Calculator, BarChart3, PieChart, Settings, User, LogOut } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const navigate = useNavigate();
  const { session, signOut, user } = useAuthContext();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="flex items-center gap-4 bg-[#1d1d1d] rounded-full shadow-lg px-8 py-3">
        <NavigationMenu className="max-w-none">
          <NavigationMenuList className="space-x-2">
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/strategy-builder')}
              >
                Strategy Builder
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/backtesting')}
              >
                Backtesting
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/risk-dashboard')}
              >
                Risk Dashboard
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/ai-assistant')}
              >
                AI Assistant
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/paper-trading')}
              >
                Paper Trading
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/compliance')}
              >
                Compliance
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/marketplace')}
              >
                Marketplace
              </button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button 
                className="hover:bg-accent/50 rounded-full px-4 py-2 transition-colors"
                onClick={() => handleNavigation('/education')}
              >
                Education
              </button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {session ? (
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User size={16} />
              <span>{user?.email}</span>
            </div>
            <button
              className="ml-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-4 py-2 shadow transition-colors flex items-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 shadow transition-colors"
            onClick={() => handleNavigation('/login')}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}

function ListItem({
  title,
  children,
  onClick,
  ...props
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <button 
          onClick={onClick} 
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground w-full text-left"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </button>
      </NavigationMenuLink>
    </li>
  )
}
