import React from "react";
import { RunTestResult } from "@/data/challengeTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  testResults: RunTestResult[];
  isLoading?: boolean;
  error?: string;
  passedCount?: number;
  totalCount?: number;
}

const OutputPanel: React.FC<OutputPanelProps> = ({
  testResults,
  isLoading = false,
  error,
  passedCount = 0,
  totalCount = 0,
}) => {
  if (isLoading) {
    return (
      <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-sm">Output</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 text-brand-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Running tests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-sm">Output</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (testResults.length === 0) {
    return (
      <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-sm">Output</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Run or submit to see test results
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allPassed = testResults.every((r) => r.status === "passed");

  return (
    <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Test Results</CardTitle>
          <div className="flex items-center gap-2">
            {allPassed ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-xs font-semibold text-green-500">
                  {passedCount}/{totalCount} Passed
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-xs font-semibold text-red-500">
                  {passedCount}/{totalCount} Passed
                </span>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="space-y-2 pt-4">
          {testResults.map((result, idx) => (
            <div
              key={result.testCaseId}
              className="bg-muted/50 rounded-lg p-3 border border-border/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Test Case {idx + 1}
                </span>
                {result.status === "passed" && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400 border-green-500/30 border"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passed
                  </Badge>
                )}
                {result.status === "failed" && (
                  <Badge
                    variant="secondary"
                    className="bg-red-500/20 text-red-400 border-red-500/30 border"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Failed
                  </Badge>
                )}
                {result.status === "error" && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>

              {/* Expected vs Output */}
              {result.status !== "error" && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-semibold">
                      Expected:
                    </p>
                    <div className="font-mono bg-background/50 p-2 rounded border border-border/30 overflow-auto max-h-16 text-codementor-lime">
                      {result.expectedOutput}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-semibold">
                      Output:
                    </p>
                    <div
                      className={cn(
                        "font-mono bg-background/50 p-2 rounded border border-border/30 overflow-auto max-h-16",
                        result.status === "passed"
                          ? "text-codementor-lime"
                          : "text-red-400",
                      )}
                    >
                      {result.output}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {result.error && (
                <div className="text-xs text-red-400 font-mono bg-red-500/10 p-2 rounded border border-red-500/20 overflow-auto max-h-16">
                  {result.error}
                </div>
              )}

              {/* Execution Time */}
              <div className="text-xs text-muted-foreground">
                ⏱ {result.executionTime.toFixed(2)}ms
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default OutputPanel;
