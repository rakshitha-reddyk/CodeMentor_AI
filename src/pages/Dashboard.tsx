import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useUser";
import { useAllLessons } from "@/hooks/useLesson";
import { useUserProgress } from "@/hooks/useProgress";
import { useUserAnalytics } from "@/hooks/useAnalytics";
import { SignInDialog } from "@/components/SignInDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  Trophy,
  Clock,
  Flame,
  CheckCircle,
  LogOut,
  Code,
  MessageCircle,
  Brain,
  AlertCircle,
  Mic,
  TrendingUp,
  Play,
  Settings,
  Bell,
  ChevronRight,
  Star,
  Zap,
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  BarChart3,
  Home,
  Search,
  Menu,
  X,
} from "lucide-react";
import { backendUtils } from "@/utils/backendUtils";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, signOut, loading } = useAuth();
  const { data: user } = useCurrentUser();
  const { data: lessons, isLoading: lessonsLoading } = useAllLessons();
  const { data: progress } = useUserProgress(user?.id);
  const { data: analytics } = useUserAnalytics(user?.id);
  const [showSignInDialog, setShowSignInDialog] = useState(
    !session && !loading,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="max-w-md mx-auto mt-20 text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
              <p className="text-muted-foreground mb-8">
                Sign in or create an account to start learning with AI-powered
                guidance.
              </p>
            </div>
          </div>
        </div>
        <SignInDialog
          open={showSignInDialog}
          onOpenChange={setShowSignInDialog}
        />
      </>
    );
  }

  const stats = backendUtils.calculateStats(analytics, progress || []);
  const userEmail = user?.email || "Student";
  const userName = userEmail.split("@")[0];

  // Sidebar navigation items
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "#dashboard",
    },
    {
      id: "learn",
      label: "Learn",
      icon: Lightbulb,
      href: "#learn",
    },
    {
      id: "chat",
      label: "AI Chat",
      icon: MessageSquare,
      href: "#chat",
    },
    {
      id: "practice",
      label: "Practice",
      icon: Code,
      href: "#practice",
    },
    {
      id: "progress",
      label: "Progress",
      icon: TrendingUp,
      href: "#progress",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "#analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "#settings",
    },
  ];

  // AI Tools data
  const aiTools = [
    {
      icon: Code,
      title: "Real-time Code Feedback",
      description: "Instant feedback as you code",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: MessageCircle,
      title: "AI Chat Mentor",
      description: "24/7 AI coding assistant",
      color: "from-green-500 to-green-600",
      lightColor: "bg-green-500/10 border-green-500/20",
    },
    {
      icon: AlertCircle,
      title: "Smart Debugger",
      description: "Auto-detect and fix errors",
      color: "from-red-500 to-red-600",
      lightColor: "bg-red-500/10 border-red-500/20",
    },
    {
      icon: Brain,
      title: "Adaptive Learning Path",
      description: "AI-powered curriculum",
      color: "from-purple-500 to-purple-600",
      lightColor: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: Mic,
      title: "Voice Learning",
      description: "Learn through voice commands",
      color: "from-cyan-500 to-cyan-600",
      lightColor: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Detailed learning insights",
      color: "from-orange-500 to-orange-600",
      lightColor: "bg-orange-500/10 border-orange-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="max-w-md mx-auto mt-20 text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
              <p className="text-muted-foreground mb-8">
                Sign in or create an account to start learning with AI-powered
                guidance.
              </p>
            </div>
          </div>
        </div>
        <SignInDialog
          open={showSignInDialog}
          onOpenChange={setShowSignInDialog}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-elevated/50 border-r border-border/50 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
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
              <div>
                <h1 className="text-lg font-semibold capitalize">
                  {sidebarItems.find((item) => item.id === activeTab)?.label ||
                    "Dashboard"}
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-sm items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search lessons, topics..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 ml-4">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-sm font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Panel */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-2xl border border-brand-primary/20 bg-gradient-to-r from-brand-primary/10 via-purple-500/5 to-brand-secondary/10 p-8 backdrop-blur">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full mix-blend-multiply filter blur-3xl -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/20 rounded-full mix-blend-multiply filter blur-3xl -ml-32 -mb-32"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-brand-primary via-purple-400 to-brand-secondary bg-clip-text text-transparent mb-2">
                        Welcome back, {userName}! 👋
                      </h2>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        You're{" "}
                        <span className="text-brand-primary font-semibold">
                          {stats?.completionRate ?? 0}%
                        </span>{" "}
                        through your learning path. Keep coding!
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-2 flex-shrink-0">
                      <Flame className="w-5 h-5 text-orange-400" />
                      <span className="font-semibold text-sm">
                        {stats?.streakDays ?? 0} day streak
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    "The best way to learn is by doing. Start a lesson today."
                    ✨
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl border border-border/50 bg-gradient-to-br from-brand-success/10 to-brand-success/5 p-5 hover:border-brand-success/50 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-brand-success">
                      {stats?.completedLessons ?? 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-brand-success/20 group-hover:bg-brand-success/30 transition-colors flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-brand-success" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-5 hover:border-blue-500/50 transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                      In Progress
                    </p>
                    <p className="text-3xl font-bold text-blue-400">
                      {stats?.inProgressLessons ?? 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-5 hover:border-purple-500/50 transition-all group sm:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                      Time Spent
                    </p>
                    <p className="text-3xl font-bold text-purple-400">
                      {backendUtils.formatTimeSpent(
                        analytics?.total_time_spent || 0,
                      )}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Button className="h-14 bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary/90 hover:to-brand-primary/70 text-white border-0 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/40 transition-all rounded-xl font-medium">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
                <Button
                  variant="outline"
                  className="h-14 border-brand-primary/30 hover:bg-brand-primary/10 hover:border-brand-primary/50 rounded-xl font-medium"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  className="h-14 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 rounded-xl font-medium hidden sm:flex"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Code
                </Button>
                <Button
                  variant="outline"
                  className="h-14 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50 rounded-xl font-medium hidden sm:flex"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Stats
                </Button>
                <Button
                  variant="outline"
                  className="h-14 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500/50 rounded-xl font-medium hidden lg:flex"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column - Continue Learning */}
              <div className="lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Continue Learning
                  </h3>
                  {lessons && lessons.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-brand-primary hover:bg-brand-primary/10"
                    >
                      View all <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                {lessonsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                  </div>
                ) : !lessons || lessons.length === 0 ? (
                  <div className="rounded-xl border border-border/50 bg-surface-elevated/30 p-12 text-center backdrop-blur">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h4 className="text-lg font-semibold mb-2">
                      No Active Lessons
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      Start exploring our curated lessons to begin your journey
                    </p>
                    <Button className="bg-gradient-to-r from-brand-primary to-brand-primary/80">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Lessons
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.slice(0, 3).map((lesson) => {
                      const lessonProgress = progress?.find(
                        (p) => p.lesson_id === lesson.id,
                      );
                      const isCompleted =
                        lessonProgress?.status === "completed";

                      return (
                        <div
                          key={lesson.id}
                          className="group rounded-xl border border-border/50 bg-surface-elevated/50 p-4 hover:border-brand-primary/30 hover:bg-surface-elevated/80 transition-all hover:shadow-lg hover:shadow-brand-primary/5 cursor-pointer backdrop-blur-sm"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                              <Code className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold group-hover:text-brand-primary transition-colors truncate">
                                  {lesson.title}
                                </h4>
                                {isCompleted && (
                                  <CheckCircle className="w-4 h-4 text-brand-success flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                {lesson.content?.substring(0, 80)}...
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {lesson.difficulty}
                                </Badge>
                                {!isCompleted && (
                                  <div className="flex-1 min-w-fit max-w-xs">
                                    <Progress value={50} className="h-1.5" />
                                  </div>
                                )}
                                {isCompleted && (
                                  <span className="text-xs font-semibold text-brand-success">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={isCompleted ? "outline" : "default"}
                              className="flex-shrink-0 rounded-lg"
                            >
                              {isCompleted ? "Review" : "Continue"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column - AI Assistant Panel */}
              <div className="space-y-6">
                {/* AI Assistant Widget */}
                <div className="rounded-xl border border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 to-purple-500/5 p-6 backdrop-blur">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Brain className="w-5 h-5 text-brand-primary" />
                      Ask AI
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get instant help with your coding questions
                  </p>
                  <Button className="w-full bg-gradient-to-r from-brand-primary to-purple-600 hover:from-brand-primary/90 hover:to-purple-600/90 text-white rounded-lg font-medium">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>

                {/* Stats Panel */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-brand-warning" />
                    Your Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-brand-success/20 bg-brand-success/10 p-4 backdrop-blur-sm">
                      <p className="text-xs font-medium text-brand-success/70 mb-1">
                        TOTAL LESSONS
                      </p>
                      <p className="text-2xl font-bold text-brand-success">
                        {lessons?.length || 0}
                      </p>
                    </div>
                    <div className="rounded-lg border border-brand-primary/20 bg-brand-primary/10 p-4 backdrop-blur-sm">
                      <p className="text-xs font-medium text-brand-primary/70 mb-1">
                        COMPLETION
                      </p>
                      <p className="text-2xl font-bold text-brand-primary">
                        {stats?.completionRate ?? 0}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 backdrop-blur-sm">
                      <p className="text-xs font-medium text-purple-400/70 mb-1">
                        AVG SCORE
                      </p>
                      <p className="text-2xl font-bold text-purple-400">
                        {stats?.averageScore ?? 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Features Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-primary" />
                AI Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map((tool, idx) => {
                  const IconComponent = tool.icon;
                  return (
                    <div
                      key={idx}
                      className={`group rounded-xl border border-border/50 bg-gradient-to-br ${tool.lightColor} p-5 hover:shadow-lg transition-all cursor-pointer overflow-hidden relative backdrop-blur-sm hover:border-opacity-100`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={`p-2.5 rounded-lg bg-gradient-to-br ${tool.color} bg-opacity-20`}
                          >
                            <IconComponent className="w-5 h-5 text-white opacity-70" />
                          </div>
                        </div>
                        <h4 className="font-semibold mb-1 group-hover:text-brand-primary transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
