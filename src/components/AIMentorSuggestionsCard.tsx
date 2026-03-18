import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Lightbulb, ArrowRight } from "lucide-react";

interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  actionLabel: string;
}

const AIMentorSuggestionsCard: React.FC = () => {
  const [suggestions] = useState<Suggestion[]>([
    {
      id: 1,
      title: "Practice useContext Patterns",
      description:
        "You've mastered useState. Let's level up with useContext next!",
      category: "React Hooks",
      actionLabel: "Start Practice",
    },
    {
      id: 2,
      title: "Type Your Hooks",
      description: "Add TypeScript to your React hooks for safer code.",
      category: "TypeScript",
      actionLabel: "Learn More",
    },
  ]);

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          AI Mentor Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-3 rounded-lg bg-surface-elevated/30 border border-border/50 hover:border-amber-500/30 transition-all group"
          >
            <div className="flex gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm group-hover:text-amber-400 transition-colors">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {suggestion.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {suggestion.category}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
              >
                {suggestion.actionLabel}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIMentorSuggestionsCard;
