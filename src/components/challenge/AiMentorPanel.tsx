import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  Lightbulb,
  BookOpen,
  Bug,
  Zap,
  Loader,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIResponse {
  type: "hint" | "explanation" | "approach" | "debug" | "optimize";
  content: string;
}

const AiMentorPanel: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);

  // Mock AI responses
  const aiResponses: Record<string, AIResponse> = {
    hint: {
      type: "hint",
      content: `Here's a helpful hint:
      
Consider breaking down the problem into smaller steps:
1. What do you need to iterate through?
2. How will you build your result?
3. What data structure would work best?

Try starting with the simplest approach first, then optimize if needed.`,
    },
    explanation: {
      type: "explanation",
      content: `Let me explain this problem:

The key concept here is understanding what the problem is asking:
- You need to process input and produce a specific output
- Consider the edge cases (empty input, single element, etc.)
- Think about the time and space complexity

This type of problem tests your basic understanding of:
- Data structures (arrays, strings, maps)
- Loop logic and control flow
- Problem decomposition`,
    },
    approach: {
      type: "approach",
      content: `Here's a recommended approach:

Step 1: Understand the input/output format
Step 2: Think about the algorithm:
   - Option A: Brute force (simple but slower)
   - Option B: Optimized approach (more efficient)
Step 3: Choose data structures
Step 4: Write pseudocode first
Step 5: Implement in your preferred language
Step 6: Test with examples
Step 7: Optimize if needed

Start with clarity over optimization!`,
    },
    debug: {
      type: "debug",
      content: `Debugging tips:

1. Check your inputs and outputs match the expected format
2. Add console.log/print statements to trace execution
3. Test with the provided examples first
4. Test edge cases:
   - Empty input
   - Single element
   - Large inputs
   - Special characters or values
5. Use a debugger to step through your code
6. Compare your output with expected output character by character

What specific output are you getting vs expecting?`,
    },
    optimize: {
      type: "optimize",
      content: `Optimization strategies:

1. Identify bottlenecks:
   - What's the time complexity of your current solution?
   - Can you reduce it by using better data structures?
   
2. Common optimizations:
   - Use hash maps/dictionaries instead of nested loops
   - Avoid redundant calculations
   - Use built-in library functions
   
3. Space vs Time trade-offs:
   - Sometimes using more memory enables faster solutions
   
4. Profile your code to see where time is spent

What's your current approach? I can suggest specific optimizations!`,
    },
  };

  const handleAskMentor = async (tag: string) => {
    setSelectedTag(tag);
    setIsLoading(true);
    setResponse(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setResponse(
      aiResponses[tag] || {
        type: "hint",
        content:
          "I'm here to help! What specific aspect do you need help with?",
      },
    );
    setIsLoading(false);
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
      label: "Explain",
      icon: BookOpen,
      color: "text-blue-400",
      description: "Explain the problem",
    },
    {
      id: "approach",
      label: "Approach",
      icon: Brain,
      color: "text-purple-400",
      description: "Show solution approach",
    },
    {
      id: "debug",
      label: "Debug",
      icon: Bug,
      color: "text-red-400",
      description: "Debug your code",
    },
    {
      id: "optimize",
      label: "Optimize",
      icon: Zap,
      color: "text-codementor-lime",
      description: "Optimize solution",
    },
  ];

  return (
    <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          AI Mentor
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Mentor Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {mentorButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <Button
                key={btn.id}
                variant={selectedTag === btn.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleAskMentor(btn.id)}
                disabled={isLoading}
                className={cn(
                  "text-xs h-10 flex-col gap-1",
                  selectedTag === btn.id &&
                    "bg-brand-primary/20 border-brand-primary/50",
                )}
              >
                <Icon className={cn("w-4 h-4", btn.color)} />
                <span className="leading-tight">{btn.label}</span>
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

        {/* Info */}
        <Alert className="text-xs border-border/50 bg-muted/50">
          <AlertDescription>
            💡 Your AI mentor is available 24/7 to help with hints,
            explanations, and debugging.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AiMentorPanel;
