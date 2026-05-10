import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, BookOpen, Loader, MessageSquare, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import PremiumModal from "@/components/PremiumModal";
import { Challenge } from "@/data/challengeTypes";
import { AIMentorService } from "@/services/aiMentorService";

interface AIResponse {
  type: "hint" | "explanation";
  content: string;
  relatedConcepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface AiMentorPanelProps {
  challenge: Challenge;
  code: string;
}

const AiMentorPanel: React.FC<AiMentorPanelProps> = ({ challenge, code }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Debug: log when component mounts or challenge changes
  useEffect(() => {
    console.log("AiMentorPanel mounted/updated with challenge:", challenge);
    console.log("Code:", code);
  }, [challenge, code]);

  const handleAskMentor = async (tag: string) => {
    console.log("Hint button clicked with tag:", tag);
    setSelectedTag(tag);
    setIsLoading(true);
    setResponse(null);

    // Simulate a slight delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get response from AI Mentor Service based on tag
    let mentorResponse: AIResponse | null = null;

    try {
      console.log("Processing mentor request for:", tag);
      console.log("Challenge exists:", !!challenge);
      console.log("Challenge title:", challenge?.title);
      console.log("Challenge hints array:", challenge?.hints);

      if (!challenge) {
        console.error("Challenge is undefined!");
        throw new Error("Challenge is not defined");
      }

      switch (tag) {
        case "hint":
          console.log("Getting hint...");
          // Directly create a response from challenge hints
          const firstHint =
            challenge.hints && challenge.hints.length > 0
              ? challenge.hints[0]
              : "Try starting with a simple case and gradually build up.";

          mentorResponse = {
            type: "hint",
            content: firstHint,
            relatedConcepts: challenge.categories || [],
            difficulty: "beginner",
          };
          console.log("Created hint response:", mentorResponse);
          break;

        case "explanation":
          mentorResponse = AIMentorService.getExplanation(challenge);
          break;

        default:
          mentorResponse = {
            type: "hint",
            content: "I'm here to help! Click Show Hint for guidance.",
            relatedConcepts: [],
            difficulty: "beginner",
          };
      }

      if (mentorResponse) {
        console.log("Response before setResponse:", mentorResponse);
        setResponse(mentorResponse);
        console.log("Response state should now be set");
      }
    } catch (error) {
      console.error("Error in handleAskMentor:", error);
      const errorResponse: AIResponse = {
        type: "hint",
        content: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Try refreshing the page.`,
        relatedConcepts: [],
        difficulty: "beginner",
      };
      setResponse(errorResponse);
    }

    setIsLoading(false);
    console.log("Finished processing mentor request");
  };

  const mentorButtons = [
    {
      id: "hint",
      label: "Hint",
      icon: Lightbulb,
      color: "text-yellow-400",
      description: "Get a hint",
    },
    {
      id: "explanation",
      label: "Explain Solution",
      icon: BookOpen,
      color: "text-blue-400",
      description: "Explain the solution",
    },
  ];

  return (
    <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          AI Mentor
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Get coding hints and explanations.
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Mentor Buttons */}
        <div className="flex gap-2">
          {mentorButtons.map((btn) => {
            const Icon = btn.icon;
            const isPremium = btn.id === "explanation";
            return (
              <Button
                key={btn.id}
                variant={
                  selectedTag === btn.id
                    ? "default"
                    : isPremium
                      ? "outline"
                      : "default"
                }
                size="sm"
                onClick={() => {
                  if (isPremium) {
                    setPendingAction(btn.id);
                    setShowPremiumModal(true);
                  } else {
                    handleAskMentor(btn.id);
                  }
                }}
                disabled={isLoading}
                className={cn(
                  "flex-1 text-xs gap-1",
                  isPremium && "opacity-75",
                  selectedTag === btn.id &&
                    "bg-brand-primary/20 border-brand-primary/50",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{btn.label}</span>
                {isPremium && <Lock className="w-3 h-3" />}
              </Button>
            );
          })}
        </div>

        {/* Response Area */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <Loader className="w-6 h-6 text-brand-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Thinking...</p>
            </div>
          ) : response ? (
            <>
              <div className="px-3 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded text-xs font-semibold text-brand-primary">
                {mentorButtons
                  .find((b) => b.id === response.type)
                  ?.description.toUpperCase()}
              </div>
              <ScrollArea className="flex-1">
                <div className="pr-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {response.content}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <Brain className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">
                Click any button to get AI assistance
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPrimary={() => {
          setShowPremiumModal(false);
          if (pendingAction) handleAskMentor(pendingAction);
        }}
        onSecondary={() => {
          console.log("Learn more requested for:", pendingAction);
          setShowPremiumModal(false);
        }}
      />
    </Card>
  );
};

export default AiMentorPanel;
