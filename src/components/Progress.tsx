import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Zap,
  Award,
  Clock,
  Brain,
  Flame,
  CheckCircle,
  BookOpen,
  MessageCircle,
  Grid3X3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  gradient: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  type: "lesson" | "problem" | "chat" | "course";
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  locked: boolean;
  earnedDate?: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

const chartData = [
  {
    day: "Mon",
    lessons: 4,
    problems: 6,
    time: 120,
  },
  {
    day: "Tue",
    lessons: 3,
    problems: 8,
    time: 150,
  },
  {
    day: "Wed",
    lessons: 5,
    problems: 5,
    time: 90,
  },
  {
    day: "Thu",
    lessons: 2,
    problems: 10,
    time: 180,
  },
  {
    day: "Fri",
    lessons: 6,
    problems: 7,
    time: 140,
  },
  {
    day: "Sat",
    lessons: 3,
    problems: 12,
    time: 200,
  },
  {
    day: "Sun",
    lessons: 4,
    problems: 4,
    time: 80,
  },
];

const heatmapData = Array.from({ length: 52 }, (_, weekIndex) =>
  Array.from({ length: 7 }, (_, dayIndex) => ({
    date: `${weekIndex}-${dayIndex}`,
    value: Math.floor(Math.random() * 5),
  })),
);

const skillsData: Skill[] = [
  { name: "JavaScript", level: 75, category: "Language" },
  { name: "React", level: 82, category: "Framework" },
  { name: "Python", level: 68, category: "Language" },
  { name: "DSA", level: 71, category: "Fundamentals" },
  { name: "AI/ML", level: 55, category: "Advanced" },
  { name: "Web Dev", level: 79, category: "Full Stack" },
];

const activities: Activity[] = [
  {
    id: "1",
    title: "Solved Two Sum",
    description: "Completed medium difficulty problem",
    timestamp: "2 hours ago",
    icon: <CheckCircle className="w-5 h-5" />,
    type: "problem",
  },
  {
    id: "2",
    title: "Completed Lesson: React Hooks",
    description: "Finished advanced React concepts",
    timestamp: "5 hours ago",
    icon: <BookOpen className="w-5 h-5" />,
    type: "lesson",
  },
  {
    id: "3",
    title: "7 Day Streak!",
    description: "Consistency unlocked 🔥",
    timestamp: "1 day ago",
    icon: <Flame className="w-5 h-5 text-orange-500" />,
    type: "course",
  },
  {
    id: "4",
    title: "Used AI Chat",
    description: "Asked CodeMentor for debugging help",
    timestamp: "1 day ago",
    icon: <MessageCircle className="w-5 h-5" />,
    type: "chat",
  },
  {
    id: "5",
    title: "Started Course: Python Fundamentals",
    description: "New learning path initiated",
    timestamp: "2 days ago",
    icon: <BookOpen className="w-5 h-5" />,
    type: "course",
  },
];

const achievements: Achievement[] = [
  {
    id: "1",
    title: "7 Day Streak",
    description: "Learn 7 days in a row",
    icon: <Flame className="w-8 h-8 text-orange-500" />,
    locked: false,
    earnedDate: "Mar 10, 2026",
  },
  {
    id: "2",
    title: "Problem Solver",
    description: "Solve 10 problems",
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    locked: false,
    earnedDate: "Mar 5, 2026",
  },
  {
    id: "3",
    title: "First Lesson",
    description: "Complete your first lesson",
    icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    locked: false,
    earnedDate: "Feb 28, 2026",
  },
  {
    id: "4",
    title: "AI Assistant",
    description: "Use AI Chat 5 times",
    icon: <Brain className="w-8 h-8 text-purple-500" />,
    locked: false,
    earnedDate: "Mar 8, 2026",
  },
  {
    id: "5",
    title: "Speed Coder",
    description: "Solve a problem in < 5 min",
    icon: <TrendingUp className="w-8 h-8 text-cyan-500" />,
    locked: true,
  },
  {
    id: "6",
    title: "Master",
    description: "Reach skill level 100+",
    icon: <Award className="w-8 h-8 text-yellow-500" />,
    locked: true,
  },
];

const statCards: StatCard[] = [
  {
    title: "Lessons Completed",
    value: 24,
    change: "+3 this week",
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-blue-600/20 to-blue-400/20",
  },
  {
    title: "Problems Solved",
    value: 42,
    change: "+8 this week",
    icon: <CheckCircle className="w-6 h-6" />,
    gradient: "from-green-600/20 to-green-400/20",
  },
  {
    title: "Accuracy",
    value: "87%",
    change: "+2% from last month",
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: "from-purple-600/20 to-purple-400/20",
  },
  {
    title: "Current Streak",
    value: "7 days",
    change: "Keep it going! 🔥",
    icon: <Flame className="w-6 h-6" />,
    gradient: "from-orange-600/20 to-orange-400/20",
  },
  {
    title: "Total Time",
    value: "127 hrs",
    change: "+12 hrs this week",
    icon: <Clock className="w-6 h-6" />,
    gradient: "from-cyan-600/20 to-cyan-400/20",
  },
  {
    title: "Skill Level",
    value: "Advanced",
    change: "Next: Expert 🚀",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-amber-600/20 to-amber-400/20",
  },
];

interface ProgressProps {
  progress?: any[];
}

const Progress: React.FC<ProgressProps> = ({ progress }) => {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const getSkillColor = (level: number): string => {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-blue-500";
    if (level >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getHeatmapColor = (value: number): string => {
    if (value === 0) return "bg-surface-elevated/30";
    if (value === 1) return "bg-green-900/30";
    if (value === 2) return "bg-green-800/50";
    if (value === 3) return "bg-green-700/70";
    return "bg-green-600/90";
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
          Progress
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your learning journey
        </p>
      </div>

      {/* Section 1: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.gradient} border border-border/50 rounded-xl p-6 hover:border-brand-primary/50 transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-muted-foreground">{stat.icon}</div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {stat.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{stat.value}</p>
              <span className="text-xs text-green-400">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2: Progress Chart */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Lessons, problems, and time spent
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
              className="rounded-lg"
            >
              Line
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="rounded-lg"
            >
              Bar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="lessons"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="problems"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", r: 4 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="lessons" fill="#3b82f6" radius={8} />
                  <Bar dataKey="problems" fill="#10b981" radius={8} />
                  <Bar dataKey="time" fill="#f59e0b" radius={8} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 3: Skill Progress (Left + Middle) */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
            <CardHeader>
              <CardTitle>Skill Progress</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your proficiency in key areas
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillsData.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {skill.category}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-brand-primary">
                      {skill.level}%
                    </span>
                  </div>
                  <ProgressBar
                    value={skill.level}
                    className="h-2 bg-surface-elevated/50"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Section 7: Performance Panel (Right) */}
        <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                <span className="text-muted-foreground">Avg Score</span>
                <span className="font-bold text-green-400">87%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                <span className="text-muted-foreground">Best Streak</span>
                <span className="font-bold text-orange-400">7 days</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                <span className="text-muted-foreground">Total Sessions</span>
                <span className="font-bold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rank</span>
                <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/50 rounded-full">
                  Top 5%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Activity Heatmap */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle>Activity Heatmap</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Your learning consistency over the past year
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap p-4 bg-surface-elevated/50 rounded-lg overflow-x-auto">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer ${getHeatmapColor(
                      day.value,
                    )}`}
                    title={`${day.value} activities`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-surface-elevated/30" />
              <div className="w-3 h-3 rounded-sm bg-green-900/30" />
              <div className="w-3 h-3 rounded-sm bg-green-800/50" />
              <div className="w-3 h-3 rounded-sm bg-green-700/70" />
              <div className="w-3 h-3 rounded-sm bg-green-600/90" />
            </div>
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 5: Recent Activity */}
        <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest learning milestones
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 pb-4 border-b border-border/30 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0 text-brand-primary mt-1">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{activity.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section 6: Achievements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border transition-all ${
                  achievement.locked
                    ? "border-border/20 bg-surface-elevated/20 opacity-50"
                    : "border-border/50 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 hover:border-brand-primary/50 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div
                    className={`${
                      achievement.locked ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <p className="font-semibold text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                  {achievement.earnedDate && (
                    <p className="text-xs text-green-400 mt-1">
                      {achievement.earnedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
