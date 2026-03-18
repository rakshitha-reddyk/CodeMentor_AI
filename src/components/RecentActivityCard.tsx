import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle,
  BookmarkCheck,
  MessageSquare,
} from "lucide-react";

interface ActivityItem {
  id: number;
  type: "lesson" | "challenge" | "chat" | "practice";
  title: string;
  timestamp: string;
  icon: React.ReactNode;
}

const RecentActivityCard: React.FC = () => {
  const [activities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: "challenge",
      title: "Completed: Daily Challenge - Array Sort",
      timestamp: "2 hours ago",
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
    },
    {
      id: 2,
      type: "lesson",
      title: "Started: Advanced React Patterns",
      timestamp: "5 hours ago",
      icon: <BookmarkCheck className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 3,
      type: "chat",
      title: "Asked: Debug React Hook Issue",
      timestamp: "1 day ago",
      icon: <MessageSquare className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 4,
      type: "practice",
      title: "Completed: TypeScript Basics Quiz",
      timestamp: "2 days ago",
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
    },
  ]);

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div
              key={activity.id}
              className={`flex gap-3 p-3 rounded-lg bg-surface-elevated/30 border border-border/50 hover:border-cyan-500/30 transition-all ${
                idx !== activities.length - 1 ? "" : ""
              }`}
            >
              <div className="flex-shrink-0 pt-1">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
              <div className="flex-shrink-0 pt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {activity.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
