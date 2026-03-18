import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface StudySession {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  category: string;
}

const StudyPlannerCard: React.FC = () => {
  const [sessions] = useState<StudySession[]>([
    {
      id: 1,
      title: "React Hooks Deep Dive",
      date: "Today",
      time: "3:00 PM",
      duration: 60,
      category: "React",
    },
    {
      id: 2,
      title: "TypeScript Generics",
      date: "Tomorrow",
      time: "2:00 PM",
      duration: 45,
      category: "TypeScript",
    },
    {
      id: 3,
      title: "CSS Grid Mastery",
      date: "Dec 22",
      time: "7:00 PM",
      duration: 30,
      category: "CSS",
    },
  ]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      React: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      TypeScript: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      CSS: "bg-pink-500/10 text-pink-400 border-pink-500/30",
      JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    };
    return colors[category] || colors.React;
  };

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          Study Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-3 rounded-lg bg-surface-elevated/30 border border-border/50 hover:border-teal-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{session.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{session.date}</span>
                  <span>•</span>
                  <span>{session.time}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs flex-shrink-0 ${getCategoryColor(session.category)}`}
              >
                {session.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{session.duration} minutes</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 p-1"
              >
                Join
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full border-teal-500/30 hover:bg-teal-500/10"
        >
          View Schedule
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudyPlannerCard;
