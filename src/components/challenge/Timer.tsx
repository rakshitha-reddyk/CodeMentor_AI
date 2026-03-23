import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  minutes: number;
  seconds: number;
  isTimeUp: boolean;
  isRunning: boolean;
  formattedTime: string;
}

const Timer: React.FC<TimerProps> = ({
  minutes,
  seconds,
  isTimeUp,
  isRunning,
  formattedTime,
}) => {
  const isWarning = minutes === 0 && seconds < 300; // Less than 5 minutes
  const isCritical = minutes === 0 && seconds < 60; // Less than 1 minute

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg border",
        isCritical && "bg-red-500/10 border-red-500/30 animate-pulse",
        isWarning && !isCritical && "bg-yellow-500/10 border-yellow-500/30",
        !isWarning && !isTimeUp && "bg-card border-border/50",
        isTimeUp && "bg-destructive/10 border-destructive/30",
      )}
    >
      {isCritical && (
        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
      )}
      {!isCritical && <Clock className="w-5 h-5 text-muted-foreground" />}

      <div className="flex flex-col">
        <span
          className={cn(
            "text-sm font-medium",
            isCritical && "text-red-500",
            isWarning && !isCritical && "text-yellow-500",
            !isWarning && !isTimeUp && "text-muted-foreground",
            isTimeUp && "text-destructive",
          )}
        >
          Time Remaining
        </span>
        <span
          className={cn(
            "text-lg font-bold font-mono",
            isCritical && "text-red-500",
            isWarning && !isCritical && "text-yellow-500",
            !isWarning && !isTimeUp && "text-foreground",
            isTimeUp && "text-destructive",
          )}
        >
          {formattedTime}
        </span>
      </div>

      {isTimeUp && (
        <div className="ml-auto text-xs font-semibold text-destructive">
          TIME UP
        </div>
      )}
    </div>
  );
};

export default Timer;
