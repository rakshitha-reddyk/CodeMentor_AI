import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Brain,
  Clock,
  Zap,
  MessageCircle,
  CheckCircle,
  BookOpen,
  Award,
  Flame,
  Code,
  Bug,
  Sparkles,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";

type ChartType = "line" | "bar" | "area";
type DateRange = "7days" | "30days" | "year";

interface AnalyticsData {
  day: string;
  lessons: number;
  problems: number;
  time: number;
  score: number;
}

interface PerformanceRow {
  date: string;
  lessons: number;
  problems: number;
  time: number;
  score: number;
}

interface AIUsageStat {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

interface AchievementBadge {
  id: string;
  title: string;
  icon: React.ReactNode;
  earned: boolean;
  date?: string;
}

interface SkillData {
  name: string;
  level: number;
  change: string;
}

interface AnalyticsProps {
  analytics?: any;
}

// Mock data for different date ranges
const getChartData = (range: DateRange): AnalyticsData[] => {
  const baseData: AnalyticsData[] = [
    {
      day: "Mon",
      lessons: 4,
      problems: 6,
      time: 120,
      score: 85,
    },
    {
      day: "Tue",
      lessons: 3,
      problems: 8,
      time: 150,
      score: 88,
    },
    {
      day: "Wed",
      lessons: 5,
      problems: 5,
      time: 90,
      score: 82,
    },
    {
      day: "Thu",
      lessons: 2,
      problems: 10,
      time: 180,
      score: 90,
    },
    {
      day: "Fri",
      lessons: 6,
      problems: 7,
      time: 140,
      score: 87,
    },
    {
      day: "Sat",
      lessons: 3,
      problems: 12,
      time: 200,
      score: 92,
    },
    {
      day: "Sun",
      lessons: 4,
      problems: 4,
      time: 80,
      score: 80,
    },
  ];

  if (range === "7days") return baseData;

  if (range === "30days") {
    return Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      lessons: Math.floor(Math.random() * 8),
      problems: Math.floor(Math.random() * 15),
      time: Math.floor(Math.random() * 200) + 50,
      score: Math.floor(Math.random() * 25) + 70,
    }));
  }

  return Array.from({ length: 12 }, (_, i) => ({
    day: `Month ${i + 1}`,
    lessons: Math.floor(Math.random() * 100),
    problems: Math.floor(Math.random() * 150),
    time: Math.floor(Math.random() * 2000) + 500,
    score: Math.floor(Math.random() * 25) + 75,
  }));
};

const performanceData: PerformanceRow[] = [
  { date: "Mar 12", lessons: 4, problems: 6, time: 120, score: 85 },
  { date: "Mar 11", lessons: 3, problems: 8, time: 150, score: 88 },
  { date: "Mar 10", lessons: 5, problems: 5, time: 90, score: 82 },
  { date: "Mar 9", lessons: 2, problems: 10, time: 180, score: 90 },
  { date: "Mar 8", lessons: 6, problems: 7, time: 140, score: 87 },
];

const skillsData: SkillData[] = [
  { name: "JavaScript", level: 75, change: "+5% this month" },
  { name: "React", level: 82, change: "+8% this month" },
  { name: "Python", level: 68, change: "+3% this month" },
  { name: "DSA", level: 71, change: "+6% this month" },
  { name: "AI/ML", level: 55, change: "+2% this month" },
  { name: "Web Dev", level: 79, change: "+7% this month" },
];

const achievementBadges: AchievementBadge[] = [
  {
    id: "1",
    title: "7 Day Streak",
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    earned: true,
    date: "Mar 10",
  },
  {
    id: "2",
    title: "50 Problems",
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    earned: true,
    date: "Mar 5",
  },
  {
    id: "3",
    title: "100 Lessons",
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    earned: false,
  },
  {
    id: "4",
    title: "AI Master",
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    earned: false,
  },
];

const heatmapData = Array.from({ length: 52 }, (_, weekIndex) =>
  Array.from({ length: 7 }, (_, dayIndex) => ({
    date: `${weekIndex}-${dayIndex}`,
    value: Math.floor(Math.random() * 5),
  })),
);

const Analytics: React.FC<AnalyticsProps> = ({ analytics }) => {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateRange, setDateRange] = useState<DateRange>("7days");
  const [activityChartType, setActivityChartType] = useState<
    "daily" | "weekly"
  >("daily");

  const chartData = useMemo(() => getChartData(dateRange), [dateRange]);

  const overviewStats = [
    {
      title: "Total Lessons",
      value: 247,
      change: "+28 this month",
      icon: <BookOpen className="w-6 h-6" />,
      gradient: "from-blue-600/20 to-blue-400/20",
    },
    {
      title: "Problems Solved",
      value: 342,
      change: "+45 this month",
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: "from-green-600/20 to-green-400/20",
    },
    {
      title: "Time Spent",
      value: "1,247 hrs",
      change: "+156 hrs this month",
      icon: <Clock className="w-6 h-6" />,
      gradient: "from-cyan-600/20 to-cyan-400/20",
    },
    {
      title: "Accuracy",
      value: "87%",
      change: "+3% this month",
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-purple-600/20 to-purple-400/20",
    },
    {
      title: "Sessions",
      value: 456,
      change: "+67 this month",
      icon: <Sparkles className="w-6 h-6" />,
      gradient: "from-amber-600/20 to-amber-400/20",
    },
    {
      title: "AI Usage",
      value: "2.4K",
      change: "+389 this month",
      icon: <Brain className="w-6 h-6" />,
      gradient: "from-pink-600/20 to-pink-400/20",
    },
  ];

  const aiUsageStats: AIUsageStat[] = [
    {
      id: "1",
      title: "Messages Sent",
      value: "2,847",
      icon: <MessageCircle className="w-5 h-5" />,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "2",
      title: "Tokens Used",
      value: "1.2M",
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      id: "3",
      title: "AI Helps",
      value: "524",
      icon: <Brain className="w-5 h-5" />,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "4",
      title: "Bug Fixes",
      value: "128",
      icon: <Bug className="w-5 h-5" />,
      gradient: "from-red-500 to-red-600",
    },
    {
      id: "5",
      title: "Code Generated",
      value: "456",
      icon: <Code className="w-5 h-5" />,
      gradient: "from-green-500 to-green-600",
    },
  ];

  const getHeatmapColor = (value: number): string => {
    if (value === 0) return "bg-surface-elevated/30";
    if (value === 1) return "bg-blue-900/30";
    if (value === 2) return "bg-blue-800/50";
    if (value === 3) return "bg-blue-700/70";
    return "bg-blue-600/90";
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Detailed insights into your learning performance
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex gap-2">
          {(["7days", "30days", "year"] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange(range)}
              className="rounded-lg"
            >
              {range === "7days"
                ? "Last 7 days"
                : range === "30days"
                  ? "Last 30 days"
                  : "Last year"}
            </Button>
          ))}
        </div>
      </div>

      {/* Section 1: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewStats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.gradient} border border-border/50 rounded-xl p-6 hover:border-brand-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-muted-foreground p-2 rounded-lg bg-surface-elevated/50">
                {stat.icon}
              </div>
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

      {/* Section 2: Main Chart */}
      <div>
        <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Lessons, problems, and time spent analytics
              </p>
            </div>
            <div className="flex gap-2">
              {(["line", "bar", "area"] as const).map((type) => (
                <Button
                  key={type}
                  variant={chartType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType(type)}
                  className="rounded-lg capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96">
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
                ) : chartType === "bar" ? (
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
                ) : (
                  <AreaChart data={chartData}>
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
                    <Area
                      type="monotone"
                      dataKey="lessons"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="problems"
                      fill="#10b981"
                      fillOpacity={0.1}
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="time"
                      fill="#f59e0b"
                      fillOpacity={0.1}
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 3: Skill Analytics */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
            <CardHeader>
              <CardTitle>Skill Analytics</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your skill progress across different categories
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillsData.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {skill.change}
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

        {/* Section 5: AI Usage Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Usage</h3>
          <div className="space-y-3">
            {aiUsageStats.map((stat) => (
              <div
                key={stat.id}
                className="bg-gradient-to-br bg-surface-elevated/40 border border-border/50 rounded-lg p-4 hover:border-brand-primary/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Activity Chart */}
      <div>
        <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activity Distribution</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Daily and weekly activity patterns
              </p>
            </div>
            <div className="flex gap-2">
              {(["daily", "weekly"] as const).map((type) => (
                <Button
                  key={type}
                  variant={activityChartType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActivityChartType(type)}
                  className="rounded-lg capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
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
                  <Bar dataKey="score" fill="#06b6d4" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 6: Performance Table */}
        <div>
          <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Recent performance data
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3 px-2 font-semibold text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-muted-foreground">
                        Lessons
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-muted-foreground">
                        Problems
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-muted-foreground">
                        Time
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-muted-foreground">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border/20 hover:bg-surface-elevated/30 transition-colors"
                      >
                        <td className="py-3 px-2 text-sm">{row.date}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="rounded-full">
                            {row.lessons}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="rounded-full">
                            {row.problems}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            variant="outline"
                            className="rounded-full bg-cyan-500/10 text-cyan-300"
                          >
                            {row.time}m
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-semibold text-green-400">
                          {row.score}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 7: Achievements */}
        <div>
          <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Unlocked milestones
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievementBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border text-center transition-all hover:shadow-lg ${
                      badge.earned
                        ? "border-brand-primary/50 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 hover:scale-105"
                        : "border-border/20 bg-surface-elevated/20 opacity-60"
                    }`}
                  >
                    <div
                      className={`flex justify-center mb-2 ${
                        badge.earned ? "" : "opacity-50"
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <p className="font-semibold text-sm mb-1">{badge.title}</p>
                    {badge.date && (
                      <p className="text-xs text-green-400">{badge.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 8: Session Heatmap */}
      <div>
        <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
          <CardHeader>
            <CardTitle>Session Activity Heatmap</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Your learning consistency - past 52 weeks
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 flex-wrap p-4 bg-surface-elevated/50 rounded-lg overflow-x-auto">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-150 ${getHeatmapColor(
                        day.value,
                      )}`}
                      title={`${day.value} sessions`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
              <span>Sessions:</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-surface-elevated/30" />
                <div className="w-3 h-3 rounded-sm bg-blue-900/30" />
                <div className="w-3 h-3 rounded-sm bg-blue-800/50" />
                <div className="w-3 h-3 rounded-sm bg-blue-700/70" />
                <div className="w-3 h-3 rounded-sm bg-blue-600/90" />
              </div>
              <span className="ml-2">Low → High</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
