import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, CheckCircle } from "lucide-react";

interface LessonCardProps {
  id: number;
  title: string;
  difficulty: string;
  content: string;
  progress?: number;
  isCompleted?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  difficulty,
  content,
  progress = 0,
  isCompleted = false,
}) => {
  const navigate = useNavigate();

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  // Get first line or 150 characters for preview
  const contentPreview = content
    ? content.split("\n")[0].substring(0, 150) + "..."
    : "Start learning this lesson";

  return (
    <Card className="gradient-card border-card-border overflow-hidden hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-300 h-full flex flex-col group cursor-pointer">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header with badges and completion indicator */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${getDifficultyColor(difficulty)}`}
            >
              {difficulty}
            </Badge>
          </div>
          {isCompleted && (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
          {title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {contentPreview}
        </p>

        {/* Progress bar if in progress */}
        {progress > 0 && progress < 100 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Start/Resume Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/lesson/${id}`);
          }}
          className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/40 text-white border-0 rounded-lg font-medium"
        >
          <Play className="w-4 h-4 mr-2" />
          {isCompleted ? "Review" : progress > 0 ? "Resume" : "Start"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
