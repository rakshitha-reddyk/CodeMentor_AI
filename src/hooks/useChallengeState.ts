import { useState, useCallback } from "react";
import { Challenge, RunTestResult } from "@/data/challengeTypes";
import { ScoreSystem } from "@/utils/scoreSystem";

export interface ChallengeEditorState {
  code: string;
  language: string;
  isRunning: boolean;
  isSubmitting: boolean;
}

export interface ChallengeTestState {
  testResults: RunTestResult[];
  passedCount: number;
  totalCount: number;
  isLoading: boolean;
}

export interface ChallengeError {
  message: string;
  type: "runtime" | "compilation" | "timeout" | "unknown";
}

export const useChallengeState = (challenge: Challenge) => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>(challenge.defaultLanguage);
  const [testResults, setTestResults] = useState<RunTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ChallengeError | null>(null);
  const [lastSubmission, setLastSubmission] = useState<{
    code: string;
    language: string;
    timestamp: Date;
  } | null>(null);

  const runTests = useCallback(
    async (testCode: string): Promise<RunTestResult[]> => {
      setIsRunning(true);
      setError(null);

      try {
        // Simulate test execution
        const results: RunTestResult[] = [];

        for (const testCase of challenge.testCases) {
          const result: RunTestResult = {
            testCaseId: testCase.id,
            status: "passed",
            output: testCase.expectedOutput,
            expectedOutput: testCase.expectedOutput,
            executionTime: Math.random() * 50 + 10,
          };

          // Simulate random failures for demo
          if (Math.random() < 0.1) {
            result.status = "failed";
            result.output = "incorrect output";
          }

          results.push(result);
        }

        setTestResults(results);
        return results;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError({
          message: errorMsg,
          type: "runtime",
        });
        setTestResults([]);
        return [];
      } finally {
        setIsRunning(false);
      }
    },
    [challenge.testCases],
  );

  const submitChallenge = useCallback(
    async (
      submissionCode: string,
    ): Promise<{ success: boolean; results: RunTestResult[] }> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const results = await runTests(submissionCode);
        setLastSubmission({
          code: submissionCode,
          language,
          timestamp: new Date(),
        });

        return {
          success: results.every((r) => r.status === "passed"),
          results,
        };
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Submission failed";
        setError({
          message: errorMsg,
          type: "unknown",
        });
        return { success: false, results: [] };
      } finally {
        setIsSubmitting(false);
      }
    },
    [language, runTests],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setCode("");
    setLanguage(challenge.defaultLanguage);
    setTestResults([]);
    setError(null);
    setLastSubmission(null);
  }, [challenge.defaultLanguage]);

  const getStatistics = useCallback(() => {
    const passedCount = testResults.filter((r) => r.status === "passed").length;
    const totalCount = testResults.length;
    const accuracy = ScoreSystem.calculateAccuracy(passedCount, totalCount);

    return {
      passedCount,
      totalCount,
      accuracy,
      allPassed: passedCount === totalCount,
    };
  }, [testResults]);

  return {
    // State
    code,
    language,
    testResults,
    isRunning,
    isSubmitting,
    error,
    lastSubmission,

    // Setters
    setCode,
    setLanguage,

    // Actions
    runTests,
    submitChallenge,
    clearError,
    resetState,
    getStatistics,
  };
};
