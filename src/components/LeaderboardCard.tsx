import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowRight, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  streak: number;
  isCurrentUser?: boolean;
}

const LeaderboardCard: React.FC = () => {
  const [leaders] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      name: "Alex Chen",
      points: 4850,
      streak: 89,
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: "Sarah Williams",
      points: 4620,
      streak: 67,
      isCurrentUser: false,
    },
    { rank: 3, name: "You", points: 3890, streak: 12, isCurrentUser: true },
    {
      rank: 4,
      name: "Jordan Lee",
      points: 3450,
      streak: 34,
      isCurrentUser: false,
    },
    {
      rank: 5,
      name: "Emma Davis",
      points: 3210,
      streak: 56,
      isCurrentUser: false,
    },
  ]);

  const currentUserRank = leaders.find((l) => l.isCurrentUser);

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Weekly Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaders.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              entry.isCurrentUser
                ? "bg-yellow-500/15 border border-yellow-500/30"
                : "bg-surface-elevated/30 border border-border/50 hover:border-yellow-500/20"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-elevated/50 border border-border/50">
                {entry.rank === 1 ? (
                  <Crown className="w-4 h-4 text-yellow-400" />
                ) : (
                  <span className="font-bold text-sm">{entry.rank}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  {entry.name}
                  {entry.isCurrentUser && (
                    <Badge className="text-xs">YOU</Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  🔥 {entry.streak} day streak
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-bold text-yellow-400">{entry.points}</p>
              <p className="text-xs text-muted-foreground">pts</p>
            </div>
          </div>
        ))}

        {currentUserRank && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-muted-foreground text-center">
              You're ranked{" "}
              <span className="font-bold text-yellow-400">
                #{currentUserRank.rank}
              </span>{" "}
              this week
            </p>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full border-yellow-500/30 hover:bg-yellow-500/10"
        >
          View Full Rankings
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
