/**
 * Backend-Ready API Structure
 *
 * This module provides a clean API interface that can:
 * 1. Use local mock database for development/offline testing
 * 2. Switch to real backend (Supabase, Firebase, REST API) without UI changes
 *
 * Pattern: Dependency Injection - inject different implementations at runtime
 */

import {
  User,
  UserProgress,
  UserStreak,
  ChallengeScore,
  ChallengeAttempt,
  AIConversation,
  UserAchievement,
} from "@/types/database";
import MockDatabase from "./mockDatabase";

// API Response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: number;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Abstract API Interface - defines all methods both implementations must support
 */
export interface IUserAPI {
  // User Management
  getOrCreateUser(userId: string, name: string, email: string): Promise<User>;
  getUser(userId: string): Promise<User | null>;
  updateUserPoints(userId: string, points: number): Promise<User>;
  incrementChallengesSolved(userId: string): Promise<User>;

  // Streak Management
  getOrCreateStreak(userId: string): Promise<UserStreak>;
  updateStreak(userId: string): Promise<any>;
  resetDailyFlags(): Promise<void>;

  // Progress Management
  getUserProgress(userId: string, skillCategory: string): Promise<UserProgress>;
  updateSkillProgress(
    userId: string,
    skillCategory: string,
    pointsEarned: number,
    passed: boolean,
  ): Promise<UserProgress>;

  // Scoring
  saveChallengeScore(score: ChallengeScore): Promise<void>;
  getUserChallengeScores(userId: string): Promise<ChallengeScore[]>;
  getBestScore(
    userId: string,
    challengeId: string,
  ): Promise<ChallengeScore | null>;

  // Attempts & History
  saveChallengeAttempt(attempt: ChallengeAttempt): Promise<void>;
  getUserChallengeHistory(
    userId: string,
    limit?: number,
  ): Promise<ChallengeAttempt[]>;

  // Daily Tracking
  markDailyCompleted(userId: string, date: string): Promise<void>;
  isDailyCompleted(userId: string, date: string): Promise<boolean>;

  // Achievements
  unlockAchievement(
    userId: string,
    achievementId: string,
  ): Promise<UserAchievement>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;

  // AI Conversations
  saveAIConversation(conversation: AIConversation): Promise<void>;
  getAIConversations(
    userId: string,
    challengeId: string,
  ): Promise<AIConversation[]>;
}

/**
 * Mock API Implementation
 * Uses localStorage for persistence - suitable for development and offline testing
 */
class MockAPI implements IUserAPI {
  async getOrCreateUser(
    userId: string,
    name: string,
    email: string,
  ): Promise<User> {
    return MockDatabase.getOrCreateUser(userId, name, email);
  }

  async getUser(userId: string): Promise<User | null> {
    return MockDatabase.getUser(userId);
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    return MockDatabase.updateUserPoints(userId, points);
  }

  async incrementChallengesSolved(userId: string): Promise<User> {
    return MockDatabase.incrementChallengesSolved(userId);
  }

  async getOrCreateStreak(userId: string): Promise<UserStreak> {
    return MockDatabase.getOrCreateStreak(userId);
  }

  async updateStreak(userId: string): Promise<any> {
    return MockDatabase.updateStreak(userId);
  }

  async resetDailyFlags(): Promise<void> {
    return MockDatabase.resetDailyFlags();
  }

  async getUserProgress(
    userId: string,
    skillCategory: string,
  ): Promise<UserProgress> {
    return MockDatabase.getUserProgress(userId, skillCategory);
  }

  async updateSkillProgress(
    userId: string,
    skillCategory: string,
    pointsEarned: number,
    passed: boolean,
  ): Promise<UserProgress> {
    return MockDatabase.updateSkillProgress(
      userId,
      skillCategory,
      pointsEarned,
      passed,
    );
  }

  async saveChallengeScore(score: ChallengeScore): Promise<void> {
    return MockDatabase.saveChallengeScore(score);
  }

  async getUserChallengeScores(userId: string): Promise<ChallengeScore[]> {
    return MockDatabase.getUserChallengeScores(userId);
  }

  async getBestScore(
    userId: string,
    challengeId: string,
  ): Promise<ChallengeScore | null> {
    return MockDatabase.getBestScore(userId, challengeId);
  }

  async saveChallengeAttempt(attempt: ChallengeAttempt): Promise<void> {
    return MockDatabase.saveChallengeAttempt(attempt);
  }

  async getUserChallengeHistory(
    userId: string,
    limit?: number,
  ): Promise<ChallengeAttempt[]> {
    return MockDatabase.getUserChallengeHistory(userId, limit);
  }

  async markDailyCompleted(userId: string, date: string): Promise<void> {
    return MockDatabase.markDailyCompleted(userId, date);
  }

  async isDailyCompleted(userId: string, date: string): Promise<boolean> {
    return MockDatabase.isDailyCompleted(userId, date);
  }

  async unlockAchievement(
    userId: string,
    achievementId: string,
  ): Promise<UserAchievement> {
    return MockDatabase.unlockAchievement(userId, achievementId);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return MockDatabase.getUserAchievements(userId);
  }

  async saveAIConversation(conversation: AIConversation): Promise<void> {
    return MockDatabase.saveAIConversation(conversation);
  }

  async getAIConversations(
    userId: string,
    challengeId: string,
  ): Promise<AIConversation[]> {
    return MockDatabase.getAIConversations(userId, challengeId);
  }
}

/**
 * Remote API Implementation Template
 * To implement: Replace fetch calls with your actual backend (Supabase, Firebase, REST API, etc.)
 */
class RemoteAPI implements IUserAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getOrCreateUser(
    userId: string,
    name: string,
    email: string,
  ): Promise<User> {
    return this.request("/users/create", {
      method: "POST",
      body: JSON.stringify({ userId, name, email }),
    });
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      return await this.request(`/users/${userId}`);
    } catch {
      return null;
    }
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    return this.request(`/users/${userId}/points`, {
      method: "PATCH",
      body: JSON.stringify({ points }),
    });
  }

  async incrementChallengesSolved(userId: string): Promise<User> {
    return this.request(`/users/${userId}/challenges`, {
      method: "PATCH",
    });
  }

  async getOrCreateStreak(userId: string): Promise<UserStreak> {
    return this.request(`/streaks/${userId}`);
  }

  async updateStreak(userId: string): Promise<any> {
    return this.request(`/streaks/${userId}/update`, {
      method: "PATCH",
    });
  }

  async resetDailyFlags(): Promise<void> {
    return this.request("/streaks/reset-daily", {
      method: "POST",
    });
  }

  async getUserProgress(
    userId: string,
    skillCategory: string,
  ): Promise<UserProgress> {
    return this.request(`/progress/${userId}/${skillCategory}`);
  }

  async updateSkillProgress(
    userId: string,
    skillCategory: string,
    pointsEarned: number,
    passed: boolean,
  ): Promise<UserProgress> {
    return this.request(`/progress/${userId}/${skillCategory}`, {
      method: "PATCH",
      body: JSON.stringify({ pointsEarned, passed }),
    });
  }

  async saveChallengeScore(score: ChallengeScore): Promise<void> {
    return this.request("/scores", {
      method: "POST",
      body: JSON.stringify(score),
    });
  }

  async getUserChallengeScores(userId: string): Promise<ChallengeScore[]> {
    return this.request(`/scores/user/${userId}`);
  }

  async getBestScore(
    userId: string,
    challengeId: string,
  ): Promise<ChallengeScore | null> {
    try {
      return await this.request(`/scores/${userId}/${challengeId}/best`);
    } catch {
      return null;
    }
  }

  async saveChallengeAttempt(attempt: ChallengeAttempt): Promise<void> {
    return this.request("/attempts", {
      method: "POST",
      body: JSON.stringify(attempt),
    });
  }

  async getUserChallengeHistory(
    userId: string,
    limit: number = 10,
  ): Promise<ChallengeAttempt[]> {
    return this.request(`/attempts/${userId}?limit=${limit}`);
  }

  async markDailyCompleted(userId: string, date: string): Promise<void> {
    return this.request("/daily-tracking", {
      method: "POST",
      body: JSON.stringify({ userId, date }),
    });
  }

  async isDailyCompleted(userId: string, date: string): Promise<boolean> {
    return this.request(`/daily-tracking/${userId}/${date}`);
  }

  async unlockAchievement(
    userId: string,
    achievementId: string,
  ): Promise<UserAchievement> {
    return this.request("/achievements", {
      method: "POST",
      body: JSON.stringify({ userId, achievementId }),
    });
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.request(`/achievements/${userId}`);
  }

  async saveAIConversation(conversation: AIConversation): Promise<void> {
    return this.request("/ai-conversations", {
      method: "POST",
      body: JSON.stringify(conversation),
    });
  }

  async getAIConversations(
    userId: string,
    challengeId: string,
  ): Promise<AIConversation[]> {
    return this.request(`/ai-conversations/${userId}/${challengeId}`);
  }
}

/**
 * API Factory - creates and manages API instances
 * Automatically uses mock API, can be switched at runtime
 */
class APIFactory {
  private static instance: IUserAPI;
  private static mode: "mock" | "remote" = "mock";

  static initialize(
    mode: "mock" | "remote" = "mock",
    backendURL?: string,
  ): void {
    this.mode = mode;

    if (mode === "mock") {
      this.instance = new MockAPI();
    } else if (mode === "remote" && backendURL) {
      this.instance = new RemoteAPI(backendURL);
    } else {
      console.warn(
        "Remote mode selected but no backend URL provided, falling back to mock",
      );
      this.instance = new MockAPI();
    }
  }

  static getInstance(): IUserAPI {
    if (!this.instance) {
      this.initialize("mock");
    }
    return this.instance;
  }

  static getMode(): "mock" | "remote" {
    return this.mode;
  }

  static switchToRemote(backendURL: string): void {
    this.initialize("remote", backendURL);
    console.log(`[API] Switched to remote backend: ${backendURL}`);
  }

  static switchToMock(): void {
    this.initialize("mock");
    console.log("[API] Switched to mock database");
  }
}

// Initialize with mock by default
APIFactory.initialize("mock");

export { APIFactory, MockAPI, RemoteAPI };
export type { IUserAPI };
