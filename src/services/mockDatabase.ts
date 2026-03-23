import {
  User,
  UserProgress,
  UserStreak,
  ChallengeScore,
  ChallengeAttempt,
} from "@/types/database";

/**
 * Mock Database Service
 * Stores data in localStorage for persistence
 * Ready to replace with Supabase/Firebase
 */

const STORAGE_KEYS = {
  USERS: "codementor_users",
  USER_PROGRESS: "codementor_progress",
  USER_STREAKS: "codementor_streaks",
  CHALLENGE_SCORES: "codementor_scores",
  CHALLENGE_ATTEMPTS: "codementor_attempts",
  DAILY_COMPLETED: "codementor_daily_completed",
};

export class MockDatabase {
  /**
   * Get or create user
   */
  static async getOrCreateUser(
    userId: string,
    name: string,
    email: string,
  ): Promise<User> {
    const users = this.getAllUsers();
    let user = users.find((u) => u.id === userId);

    if (!user) {
      user = {
        id: userId,
        email,
        name,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalChallengesSolved: 0,
        level: 1,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        totalTimeSpent: 0,
      };
      users.push(user);
      this.saveToStorage(STORAGE_KEYS.USERS, users);
    }

    // Update last active
    user.lastActiveAt = new Date().toISOString();
    this.saveToStorage(STORAGE_KEYS.USERS, users);

    return user;
  }

  /**
   * Get user by ID
   */
  static async getUser(userId: string): Promise<User | null> {
    const users = this.getAllUsers();
    return users.find((u) => u.id === userId) || null;
  }

  /**
   * Update user points
   */
  static async updateUserPoints(userId: string, points: number): Promise<User> {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) throw new Error("User not found");

    user.totalPoints += points;
    user.level = Math.floor(user.totalPoints / 500) + 1; // Level up every 500 points
    user.lastActiveAt = new Date().toISOString();

    this.saveToStorage(STORAGE_KEYS.USERS, users);
    return user;
  }

  /**
   * Increment solved challenges
   */
  static async incrementChallengesSolved(userId: string): Promise<User> {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) throw new Error("User not found");

    user.totalChallengesSolved += 1;
    this.saveToStorage(STORAGE_KEYS.USERS, users);
    return user;
  }

  /**
   * Get or create user streak
   */
  static async getOrCreateStreak(userId: string): Promise<UserStreak> {
    const streaks = this.getAllStreaks();
    let streak = streaks.find((s) => s.userId === userId);

    if (!streak) {
      streak = {
        id: `streak_${userId}`,
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedAt: "",
        completedToday: false,
        totalCompletions: 0,
      };
      streaks.push(streak);
      this.saveToStorage(STORAGE_KEYS.USER_STREAKS, streaks);
    }

    return streak;
  }

  /**
   * Update streak after challenge completion
   */
  static async updateStreak(
    userId: string,
  ): Promise<{ streak: UserStreak; incremented: boolean; message: string }> {
    const streaks = this.getAllStreaks();
    let streak = streaks.find((s) => s.userId === userId);

    if (!streak) {
      streak = {
        id: `streak_${userId}`,
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedAt: new Date().toISOString(),
        completedToday: true,
        totalCompletions: 1,
      };
      streaks.push(streak);
      this.saveToStorage(STORAGE_KEYS.USER_STREAKS, streaks);
      return {
        streak,
        incremented: true,
        message: "🌟 First challenge! Great start!",
      };
    }

    // Check if already completed today
    if (streak.completedToday) {
      return {
        streak,
        incremented: false,
        message: "Already completed a challenge today!",
      };
    }

    // Check if completing on consecutive day
    const lastDate = new Date(streak.lastCompletedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isConsecutive = lastDate.toDateString() === yesterday.toDateString();

    if (isConsecutive) {
      // Continue streak
      streak.currentStreak += 1;
      streak.totalCompletions += 1;

      // Update longest streak
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      streak.lastCompletedAt = new Date().toISOString();
      streak.completedToday = true;

      this.saveToStorage(STORAGE_KEYS.USER_STREAKS, streaks);

      const message =
        streak.currentStreak % 7 === 0
          ? `🔥 ${streak.currentStreak} day streak! Incredible! 🎉`
          : `🔥 ${streak.currentStreak} day streak! Keep it up!`;

      return { streak, incremented: true, message };
    } else {
      // Streak broken or first challenge in a while
      streak.currentStreak = 1;
      streak.totalCompletions += 1;
      streak.lastCompletedAt = new Date().toISOString();
      streak.completedToday = true;

      this.saveToStorage(STORAGE_KEYS.USER_STREAKS, streaks);

      return {
        streak,
        incremented: true,
        message: "Starting fresh! Your new streak begins today 🚀",
      };
    }
  }

  /**
   * Reset daily flags (call at midnight)
   */
  static async resetDailyFlags(): Promise<void> {
    const streaks = this.getAllStreaks();
    streaks.forEach((s) => {
      s.completedToday = false;
    });
    this.saveToStorage(STORAGE_KEYS.USER_STREAKS, streaks);
  }

  /**
   * Get user progress for a skill
   */
  static async getUserProgress(
    userId: string,
    skillCategory: string,
  ): Promise<UserProgress> {
    const progresses = this.getAllProgress();
    let progress = progresses.find(
      (p) => p.userId === userId && p.skillCategory === skillCategory,
    );

    if (!progress) {
      progress = {
        id: `progress_${userId}_${skillCategory}`,
        userId,
        skillCategory,
        level: 1,
        pointsInLevel: 0,
        totalChallengesInCategory: 0,
        solvedChallengesInCategory: 0,
        lastUpdatedAt: new Date().toISOString(),
      };
      progresses.push(progress);
      this.saveToStorage(STORAGE_KEYS.USER_PROGRESS, progresses);
    }

    return progress;
  }

  /**
   * Update skill progress
   */
  static async updateSkillProgress(
    userId: string,
    skillCategory: string,
    pointsEarned: number,
    passed: boolean,
  ): Promise<UserProgress> {
    const progresses = this.getAllProgress();
    let progress = progresses.find(
      (p) => p.userId === userId && p.skillCategory === skillCategory,
    );

    if (!progress) {
      progress = {
        id: `progress_${userId}_${skillCategory}`,
        userId,
        skillCategory,
        level: 1,
        pointsInLevel: 0,
        totalChallengesInCategory: 0,
        solvedChallengesInCategory: 0,
        lastUpdatedAt: new Date().toISOString(),
      };
      progresses.push(progress);
    }

    progress.totalChallengesInCategory += 1;
    if (passed) {
      progress.solvedChallengesInCategory += 1;
      progress.pointsInLevel += pointsEarned;

      // Level up every 500 points
      while (progress.pointsInLevel >= 500 && progress.level < 5) {
        progress.pointsInLevel -= 500;
        progress.level += 1;
      }
    }

    progress.lastUpdatedAt = new Date().toISOString();
    this.saveToStorage(STORAGE_KEYS.USER_PROGRESS, progresses);

    return progress;
  }

  /**
   * Save challenge score
   */
  static async saveChallengeScore(
    score: ChallengeScore,
  ): Promise<ChallengeScore> {
    const scores = this.getAllScores();
    scores.push(score);
    this.saveToStorage(STORAGE_KEYS.CHALLENGE_SCORES, scores);
    return score;
  }

  /**
   * Get challenge scores for user
   */
  static async getUserChallengeScores(
    userId: string,
  ): Promise<ChallengeScore[]> {
    const scores = this.getAllScores();
    return scores.filter((s) => s.userId === userId);
  }

  /**
   * Get best attempt for challenge
   */
  static async getBestScore(
    userId: string,
    challengeId: string,
  ): Promise<ChallengeScore | null> {
    const scores = this.getAllScores();
    const userScores = scores.filter(
      (s) => s.userId === userId && s.challengeId === challengeId,
    );
    return userScores.sort((a, b) => b.score - a.score)[0] || null;
  }

  /**
   * Save challenge attempt
   */
  static async saveChallengeAttempt(
    attempt: ChallengeAttempt,
  ): Promise<ChallengeAttempt> {
    const attempts = this.getAllAttempts();
    attempts.push(attempt);
    this.saveToStorage(STORAGE_KEYS.CHALLENGE_ATTEMPTS, attempts);
    return attempt;
  }

  /**
   * Get user's challenge history
   */
  static async getUserChallengeHistory(
    userId: string,
    limit: number = 10,
  ): Promise<ChallengeAttempt[]> {
    const attempts = this.getAllAttempts();
    return attempts
      .filter((a) => a.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  }

  /**
   * Mark daily challenge as completed
   */
  static async markDailyCompleted(userId: string, date: string): Promise<void> {
    const completed = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DAILY_COMPLETED) || "{}",
    );
    if (!completed[userId]) completed[userId] = [];
    if (!completed[userId].includes(date)) {
      completed[userId].push(date);
    }
    localStorage.setItem(
      STORAGE_KEYS.DAILY_COMPLETED,
      JSON.stringify(completed),
    );
  }

  /**
   * Check if daily challenge completed
   */
  static async isDailyCompleted(
    userId: string,
    date: string,
  ): Promise<boolean> {
    const completed = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DAILY_COMPLETED) || "{}",
    );
    return completed[userId]?.includes(date) || false;
  }

  // ==================== INTERNAL HELPERS ====================

  private static getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  }

  private static getAllProgress(): UserProgress[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS) || "[]");
  }

  private static getAllStreaks(): UserStreak[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_STREAKS) || "[]");
  }

  private static getAllScores(): ChallengeScore[] {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CHALLENGE_SCORES) || "[]",
    );
  }

  private static getAllAttempts(): ChallengeAttempt[] {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CHALLENGE_ATTEMPTS) || "[]",
    );
  }

  private static saveToStorage(key: string, data: unknown): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Export for convenience
export default MockDatabase;
