import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Settings as SettingsIcon,
  Bell,
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  Code,
  TrendingUp,
  Search,
  Menu,
  X,
  MessageSquare,
  BarChart3,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { data: user } = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userEmail = user?.email || "Student";
  const userName = userEmail.split("@")[0];

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "learn", label: "Learn", icon: Lightbulb, href: "/learn" },
    { id: "practice", label: "Practice", icon: Code, href: "/practice" },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      href: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-elevated/50 border-r border-border/50 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                CodeMentor
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 text-brand-primary shadow-lg shadow-brand-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/80"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/50">
          <Button
            variant="outline"
            className="w-full justify-center border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <div className="sticky top-0 z-30 border-b border-border/50 bg-surface-elevated/30 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-8 w-8 p-0"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <h1 className="text-lg font-semibold capitalize hidden sm:block">
                {sidebarItems.find((i) => i.href === location.pathname)
                  ?.label || ""}
              </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-3 ml-4 flex-1">
              {/* Search Bar */}
              <div className="hidden md:flex relative max-w-sm w-full mr-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent"
                />
              </div>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate("/settings")}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-primary/50 transition-all"
              >
                {userName.charAt(0).toUpperCase()}
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
