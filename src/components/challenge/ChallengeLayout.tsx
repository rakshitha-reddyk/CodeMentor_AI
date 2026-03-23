import React from "react";
import { Challenge, RunTestResult } from "@/data/challengeTypes";
import ProblemPanel from "./ProblemPanel";
import EditorPanel from "./EditorPanel";
import AiMentorPanel from "./AiMentorPanel";
import OutputPanel from "./OutputPanel";
import Timer from "./Timer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChallengeLayoutProps {
  challenge: Challenge;
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  testResults: RunTestResult[];
  timerMinutes: number;
  timerSeconds: number;
  isTimeUp: boolean;
  isRunningTimer: boolean;
  formattedTime: string;
  error?: string;
}

const ChallengeLayout: React.FC<ChallengeLayoutProps> = ({
  challenge,
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  testResults,
  timerMinutes,
  timerSeconds,
  isTimeUp,
  isRunningTimer,
  formattedTime,
  error,
}) => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold">{challenge.title}</h1>
            <p className="text-xs text-muted-foreground">
              {challenge.difficulty} • {challenge.points} points
            </p>
          </div>
        </div>

        {/* Timer */}
        <Timer
          minutes={timerMinutes}
          seconds={timerSeconds}
          isTimeUp={isTimeUp}
          isRunning={isRunningTimer}
          formattedTime={formattedTime}
        />
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden gap-3 p-3">
        {/* Left Panel - Problem (33%) */}
        <div className="w-1/3 overflow-hidden">
          <ProblemPanel challenge={challenge} />
        </div>

        {/* Center Panel - Editor (33%) */}
        <div className="w-1/3 flex flex-col overflow-hidden gap-3">
          <EditorPanel
            challenge={challenge}
            code={code}
            language={language}
            onCodeChange={onCodeChange}
            onLanguageChange={onLanguageChange}
            onRun={onRun}
            onSubmit={onSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Panel - AI Mentor & Output (33%) */}
        <div className="w-1/3 flex flex-col overflow-hidden gap-3">
          {/* Output Panel */}
          <div className="flex-1 overflow-hidden">
            <OutputPanel
              testResults={testResults}
              isLoading={isRunning}
              error={error}
              passedCount={
                testResults.filter((r) => r.status === "passed").length
              }
              totalCount={testResults.length}
            />
          </div>

          {/* AI Mentor Panel */}
          <div className="flex-1 overflow-hidden">
            <AiMentorPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeLayout;
