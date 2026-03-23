// Database types for CodeMentor AI

export interface User {
  id: string;
  email: string;
  name: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalChallengesSolved: number;
  level: number;
  createdAt: string;
  lastActiveAt: string;
  totalTimeSpent: number; // in seconds
}

export interface UserProgress {
  id: string;
  userId: string;
  skillCategory: string; // e.g., "Strings", "Arrays", "DP"
  level: number; // 1-5
  pointsInLevel: number;
  totalChallengesInCategory: number;
  solvedChallengesInCategory: number;
  lastUpdatedAt: string;
}

export interface UserStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt: string;
  completedToday: boolean;
  totalCompletions: number;
}

export interface ChallengeScore {
  id: string;
  userId: string;
  challengeId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  timeSpent: number; // in seconds
  attempts: number;
  language: string;
  passed: boolean;
  accuracy: number; // 0-100
}

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  challengeId: string;
  bonus: number; // extra points for daily completion
  completedByUsers: string[]; // user IDs
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: string;
  timestamp: string;
  testsPassed: number;
  testsFailed: number;
  executionTime: number;
  points: number;
}

export interface AIConversation {
  id: string;
  userId: string;
  challengeId: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  type: "hint" | "explanation" | "approach" | "debug" | "optimize" | "user";
  content: string;
  timestamp: string;
  codeContext?: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: string;
  unlockedAt: string;
  metadata?: Record<string, unknown>;
}
