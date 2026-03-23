import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Lock, ChevronRight } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  description: string;
  timeLimit: number;
  language: string;
  completed: boolean;
}

const DailyChallengeCard: React.FC = () => {
  const navigate = useNavigate();

  const [challenge] = useState<Challenge>({
    id: 1,
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    points: 100,
    description:
      "Write a function to reverse a string without using built-in methods.",
    timeLimit: 30,
    language: "JavaScript",
    completed: false,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const handleStartChallenge = () => {
    navigate(`/challenge/${challenge.slug}`);
  };

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-400" />
              Today's Challenge
            </CardTitle>
            <h3 className="text-lg font-semibold">{challenge.title}</h3>
          </div>
          <Badge
            className={`${getDifficultyColor(challenge.difficulty)} border`}
          >
            {challenge.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{challenge.description}</p>

        <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Points</p>
            <p className="text-lg font-bold text-brand-primary">
              {challenge.points}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Time Limit</p>
            <p className="text-lg font-bold text-blue-400">
              {challenge.timeLimit}m
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Language</p>
            <p className="text-xs font-semibold text-purple-400">
              {challenge.language}
            </p>
          </div>
        </div>

        <Button
          onClick={handleStartChallenge}
          className="w-full bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary/90 hover:to-brand-primary/70"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Start Challenge
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyChallengeCard;
