import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

interface InProgressLesson {
  id: number;
  title: string;
  category: string;
  progress: number;
  timeSpent: number;
  estimatedTime: number;
  lastAccessed: string;
}

const ContinueLearningCard: React.FC = () => {
  const [currentLesson] = useState<InProgressLesson>({
    id: 1,
    title: "Advanced React Hooks",
    category: "React",
    progress: 65,
    timeSpent: 120,
    estimatedTime: 180,
    lastAccessed: "2 hours ago",
  });

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Continue Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-surface-elevated/50 border border-border/50">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h4 className="font-semibold text-white">
                {currentLesson.title}
              </h4>
              <Badge variant="secondary" className="mt-1 text-xs">
                {currentLesson.category}
              </Badge>
            </div>
            <span className="text-sm font-bold text-blue-400">
              {currentLesson.progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-surface-elevated rounded-full h-2 mb-3 overflow-hidden border border-border/50">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${currentLesson.progress}%` }}
            />
          </div>

          {/* Time Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2 p-2 rounded bg-surface-elevated/50 border border-border/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs text-muted-foreground">Time Spent</p>
                <p className="text-sm font-semibold">
                  {currentLesson.timeSpent}m
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-surface-elevated/50 border border-border/30">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated</p>
                <p className="text-sm font-semibold">
                  {currentLesson.estimatedTime}m
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            Last accessed {currentLesson.lastAccessed}
          </p>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Continue Lesson
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContinueLearningCard;
