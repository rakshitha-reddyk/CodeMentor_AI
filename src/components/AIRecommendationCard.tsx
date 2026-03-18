import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, ArrowRight } from "lucide-react";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  reason: string;
  difficulty: string;
  estimatedTime: number;
  relevanceScore: number;
}

const AIRecommendationCard: React.FC = () => {
  const [recommendations] = useState<Recommendation[]>([
    {
      id: 1,
      title: "Master Array Manipulation",
      description: "Based on your recent attempts, arrays are your next skill.",
      reason: "Your recent practice shows 78% accuracy in this area",
      difficulty: "Intermediate",
      estimatedTime: 45,
      relevanceScore: 92,
    },
  ]);

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-lg bg-surface-elevated/50 border border-border/50 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h4 className="font-semibold group-hover:text-purple-400 transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {rec.reason}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-green-400 flex-shrink-0">
                <TrendingUp className="w-4 h-4" />
                {rec.relevanceScore}%
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {rec.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ~{rec.estimatedTime}m
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              {rec.description}
            </p>

            <Button
              size="sm"
              variant="outline"
              className="w-full border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50"
            >
              Explore
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationCard;
