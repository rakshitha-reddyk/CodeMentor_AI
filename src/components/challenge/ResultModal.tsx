import React, { useEffect } from "react";
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ResultModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  pointsEarned: number;
  timeSpent: number;
  accuracy: number;
  passedTests: number;
  totalTests: number;
  streakMessage?: string;
  streakCount?: number;
  skillLevelUp?: boolean;
  skillName?: string;
  onClose: () => void;
  onContinue: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isSuccess,
  pointsEarned,
  timeSpent,
  accuracy,
  passedTests,
  totalTests,
  streakMessage,
  streakCount = 0,
  skillLevelUp = false,
  skillName = "",
  onClose,
  onContinue,
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getAccuracyColor = (acc: number) => {
    if (acc === 100) return "text-green-400";
    if (acc >= 75) return "text-blue-400";
    if (acc >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                <CheckCircle className="w-16 h-16 text-green-400 relative" />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                <XCircle className="w-16 h-16 text-red-400 relative" />
              </div>
            )}
          </div>

          <DialogTitle className="text-center text-2xl">
            {isSuccess ? "Challenge Completed!" : "Keep Trying!"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSuccess
              ? "Outstanding performance! You've passed all test cases."
              : "You can improve. Review the hints and try again."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Points */}
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-muted-foreground">Points</span>
              </div>
              <p className="text-lg font-bold text-brand-primary">
                +{pointsEarned}
              </p>
            </div>

            {/* Time */}
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">Time</span>
              </div>
              <p className="text-lg font-bold text-blue-400">
                {formatTime(timeSpent)}
              </p>
            </div>

            {/* Test Results */}
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-xs text-muted-foreground">Tests</span>
              </div>
              <p className="text-lg font-bold">
                {passedTests}/{totalTests}
              </p>
            </div>

            {/* Accuracy */}
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-muted-foreground">Accuracy</span>
              </div>
              <p
                className={cn("text-lg font-bold", getAccuracyColor(accuracy))}
              >
                {accuracy}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Test Pass Rate
              </span>
              <span className="text-xs font-semibold">
                {((passedTests / totalTests) * 100).toFixed(0)}%
              </span>
            </div>
            <Progress
              value={(passedTests / totalTests) * 100}
              className="h-2"
            />
          </div>

          {/* Streak Message */}
          {streakMessage && (
            <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-3 text-center space-y-1">
              <p className="text-sm font-semibold text-brand-primary">
                🔥 {streakMessage}
              </p>
              {streakCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Current Streak:{" "}
                  <span className="font-bold text-brand-primary">
                    {streakCount}
                  </span>{" "}
                  days
                </p>
              )}
            </div>
          )}

          {/* Skill Level Up */}
          {skillLevelUp && skillName && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center space-y-1 animate-pulse">
              <p className="text-sm font-semibold text-purple-400">
                ⭐ Level Up!
              </p>
              <p className="text-xs text-muted-foreground">
                Your skill in{" "}
                <span className="font-bold text-purple-400">{skillName}</span>{" "}
                has increased
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Back to Challenge
            </Button>
            <Button
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-brand-primary to-brand-primary/80"
            >
              Next Challenge
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
