import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowRight, Star } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed";
}

const GoalTrackerCard: React.FC = () => {
  const [goals] = useState<Goal[]>([
    {
      id: 1,
      title: "Master React Hooks",
      description: "Complete all hooks modules and build 3 projects",
      progress: 60,
      deadline: "Dec 31, 2024",
      priority: "high",
      status: "active",
    },
    {
      id: 2,
      title: "Learn TypeScript",
      description: "Complete intermediate TypeScript course",
      progress: 45,
      deadline: "Jan 15, 2025",
      priority: "high",
      status: "active",
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-400" />
          Learning Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-4 rounded-lg bg-surface-elevated/50 border border-border/50 hover:border-red-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h4 className="font-semibold flex items-center gap-2">
                  {goal.title}
                  {goal.status === "completed" && (
                    <Star className="w-4 h-4 text-yellow-400" />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {goal.description}
                </p>
              </div>
              <Badge
                variant={getPriorityColor(goal.priority)}
                className="text-xs capitalize flex-shrink-0"
              >
                {goal.priority}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-elevated rounded-full h-2 mb-2 overflow-hidden border border-border/50">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Target: {goal.deadline}
              </span>
              <span className="font-bold text-red-400">{goal.progress}%</span>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full border-red-500/30 hover:bg-red-500/10"
        >
          Add New Goal
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalTrackerCard;
