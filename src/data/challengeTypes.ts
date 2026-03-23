export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
  isExample: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  fullDescription: string;
  points: number;
  timeLimit: number; // in minutes
  languages: string[];
  defaultLanguage: string;
  testCases: TestCase[];
  examples: TestCase[];
  categories: string[];
  hints: string[];
  approachExplanation: string;
  optimizedSolution?: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  code: string;
  language: string;
  status: "pending" | "passed" | "failed" | "error";
  timeSpent: number; // in seconds
  testsPassedCount: number;
  testsTotalCount: number;
  pointsEarned: number;
  accuracy: number; // 0-100
  submittedAt: string;
  error?: string;
}

export interface ChallengeResult {
  status: "success" | "failed" | "timeout";
  pointsEarned: number;
  timeSpent: number;
  accuracy: number;
  testsPassedCount: number;
  testsTotalCount: number;
  streakIncremented: boolean;
  newSkillLevel?: number;
}

export interface RunTestResult {
  testCaseId: string;
  status: "passed" | "failed" | "error";
  output: string;
  expectedOutput: string;
  error?: string;
  executionTime: number; // in ms
}

export interface AIHintResponse {
  type: "hint" | "explanation" | "approach" | "debug" | "optimize";
  content: string;
  relatedConcepts: string[];
}
