import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap, Calendar } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  nextGoal: number;
  nextMilestone: string;
}

const LearningStreakCard: React.FC = () => {
  const [streakData] = useState<StreakData>({
    currentStreak: 12,
    longestStreak: 45,
    lastActivityDate: "Today",
    nextGoal: 15,
    nextMilestone: "Unlock Diamond Badge",
  });

  const streakPercentage =
    (streakData.currentStreak / streakData.nextGoal) * 100;

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Display */}
        <div className="text-center py-4 px-4 rounded-lg bg-gradient-to-b from-orange-500/10 to-transparent border border-orange-500/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <span className="text-4xl font-bold text-white">
              {streakData.currentStreak}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Day Streak Active</p>
        </div>

        {/* Progress to Next Goal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Next Goal</span>
            <span className="text-sm text-muted-foreground">
              {streakData.nextGoal} days
            </span>
          </div>
          <div className="w-full bg-surface-elevated/50 rounded-full h-2 overflow-hidden border border-border/50">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-500"
              style={{ width: `${Math.min(streakPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-surface-elevated/50 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">
                Longest Streak
              </span>
            </div>
            <p className="text-lg font-bold">{streakData.longestStreak} days</p>
          </div>

          <div className="p-3 rounded-lg bg-surface-elevated/50 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">
                Last Activity
              </span>
            </div>
            <p className="text-lg font-bold">{streakData.lastActivityDate}</p>
          </div>
        </div>

        {/* Milestone Badge */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              UNLOCKED SOON
            </Badge>
          </div>
          <p className="text-sm font-medium mt-2">{streakData.nextMilestone}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStreakCard;
