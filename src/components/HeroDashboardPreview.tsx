import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  Trophy,
  Calendar,
  Code,
  CheckCircle,
  Clock,
  Flame,
  Star,
} from "lucide-react";

const HeroDashboardPreview = () => {
  const stats = [
    {
      label: "Problems Solved",
      value: "247",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-brand-success",
    },
    {
      label: "Current Streak",
      value: "12",
      icon: <Flame className="w-5 h-5" />,
      color: "text-brand-accent",
    },
    {
      label: "Languages",
      value: "5",
      icon: <Code className="w-5 h-5" />,
      color: "text-brand-primary",
    },
    {
      label: "Rank",
      value: "#42",
      icon: <Trophy className="w-5 h-5" />,
      color: "text-brand-warning",
    },
  ];

  const recentActivity = [
    { skill: "Python Functions", progress: 85, level: "Intermediate" },
    { skill: "JavaScript Async/Await", progress: 72, level: "Advanced" },
    { skill: "React Hooks", progress: 94, level: "Expert" },
    { skill: "Algorithm Analysis", progress: 58, level: "Beginner" },
  ];

  return (
    <section className="py-24 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Learning Analytics
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Track Your <span className="text-gradient">Coding Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive progress tracking with detailed analytics, skill
            assessments, and personalized recommendations for accelerated
            learning.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="gradient-card border-card-border text-center hover:shadow-card transition-smooth"
              >
                <CardContent className="pt-6">
                  <div
                    className={`inline-flex p-3 rounded-full bg-surface-elevated mb-3 ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Progress Chart */}
            <Card className="gradient-card border-card-border shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-primary" />
                  Skill Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentActivity.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs 
                          ${
                            skill.level === "Expert"
                              ? "border-brand-success/30 text-brand-success"
                              : skill.level === "Advanced"
                                ? "border-brand-primary/30 text-brand-primary"
                                : skill.level === "Intermediate"
                                  ? "border-brand-accent/30 text-brand-accent"
                                  : "border-muted-foreground/30 text-muted-foreground"
                          }`}
                      >
                        {skill.level}
                      </Badge>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                    <div className="text-sm text-muted-foreground text-right">
                      {skill.progress}% Complete
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievement Preview */}
            <Card className="gradient-card border-card-border shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-brand-warning" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-surface-elevated rounded-lg border border-brand-success/20">
                  <div className="p-2 bg-brand-success/20 rounded-full">
                    <Flame className="w-4 h-4 text-brand-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">10-Day Streak!</p>
                    <p className="text-sm text-muted-foreground">
                      Consistent daily practice
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-brand-warning" />
                </div>

                <div className="flex items-center gap-4 p-3 bg-surface-elevated rounded-lg border border-brand-primary/20">
                  <div className="p-2 bg-brand-primary/20 rounded-full">
                    <Code className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Python Master</p>
                    <p className="text-sm text-muted-foreground">
                      Completed 50 Python challenges
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-brand-warning" />
                </div>

                <div className="flex items-center gap-4 p-3 bg-surface-elevated rounded-lg border border-brand-accent/20">
                  <div className="p-2 bg-brand-accent/20 rounded-full">
                    <Target className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Algorithm Expert</p>
                    <p className="text-sm text-muted-foreground">
                      Solved 25 advanced algorithms
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-brand-warning" />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-primary">
                      4.8
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Code Quality
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-secondary">
                      92%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDashboardPreview;
