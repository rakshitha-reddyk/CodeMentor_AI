import React, { useState } from "react";
import { Challenge, TestCase } from "@/data/challengeTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Lightbulb, Code, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProblemPanelProps {
  challenge: Challenge;
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({ challenge }) => {
  const [expandedHint, setExpandedHint] = useState<number | null>(null);

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

  return (
    <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-5 h-5 text-blue-400" />
                {challenge.title}
              </CardTitle>
            </div>
            <Badge
              className={cn(
                `${getDifficultyColor(challenge.difficulty)} border`,
                "whitespace-nowrap",
              )}
            >
              {challenge.difficulty}
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            {challenge.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="space-y-6 pt-4">
          {/* Problem Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Problem Description
            </h3>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {challenge.fullDescription}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Examples
            </h3>
            {challenge.examples.map((example, idx) => (
              <div
                key={example.id}
                className="bg-muted/50 rounded-lg p-3 space-y-2 border border-border/50"
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  Example {idx + 1}:
                </p>
                <div className="space-y-1 font-mono text-xs">
                  <div>
                    <span className="text-muted-foreground">Input: </span>
                    <span className="text-codementor-cyan">
                      {example.input}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Output: </span>
                    <span className="text-codementor-lime">
                      {example.expectedOutput}
                    </span>
                  </div>
                </div>
                {example.description && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {example.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Hints */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              Hints
            </h3>
            <div className="space-y-2">
              {challenge.hints.map((hint, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setExpandedHint(expandedHint === idx ? null : idx)
                  }
                  className="w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Hint {idx + 1}
                    </span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        expandedHint === idx && "rotate-90",
                      )}
                    />
                  </div>
                  {expandedHint === idx && (
                    <p className="text-xs text-foreground mt-2">{hint}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-2 bg-muted/50 rounded-lg p-3 border border-border/50">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Constraints
            </h3>
            <ul className="text-xs text-foreground space-y-1 list-disc list-inside">
              <li>Time Limit: {challenge.timeLimit} minutes</li>
              <li>Supported Languages: {challenge.languages.join(", ")}</li>
              <li>Total Test Cases: {challenge.testCases.length}</li>
            </ul>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default ProblemPanel;
