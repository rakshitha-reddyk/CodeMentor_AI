export interface SkillProgress {
  skillName: string;
  category: string;
  level: number; // 1-5
  nextLevelPoints: number;
  currentPoints: number;
  maxPoints: number;
}

export interface ChallengeAnalytics {
  userId: string;
  totalChallengesSolved: number;
  totalPointsEarned: number;
  averageTimePerChallenge: number; // in seconds
  totalTimeSpent: number; // in seconds
  successRate: number; // 0-100
  skillProgress: Record<string, SkillProgress>;
  categoryStats: Record<string, { completed: number; attempts: number }>;
  difficulty: {
    easy: { completed: number; attempts: number };
    medium: { completed: number; attempts: number };
    hard: { completed: number; attempts: number };
  };
  lastUpdated: string;
}

export class AnalyticsSystem {
  /**
   * Update analytics after challenge completion
   */
  static updateAnalytics(
    currentAnalytics: ChallengeAnalytics,
    challengeId: string,
    challengeCategory: string,
    challengeDifficulty: "Easy" | "Medium" | "Hard",
    points: number,
    timeSpentSeconds: number,
    success: boolean,
  ): ChallengeAnalytics {
    const updated = { ...currentAnalytics };

    // Update total stats
    updated.totalPointsEarned += success ? points : 0;
    updated.totalTimeSpent += timeSpentSeconds;

    if (success) {
      updated.totalChallengesSolved += 1;
    }

    // Update average time
    updated.averageTimePerChallenge = Math.round(
      updated.totalTimeSpent / Math.max(updated.totalChallengesSolved + 1, 1),
    );

    // Update success rate
    const totalAttempts =
      updated.difficulty.easy.attempts +
      updated.difficulty.medium.attempts +
      updated.difficulty.hard.attempts +
      1;
    const totalSuccesses = updated.totalChallengesSolved;
    updated.successRate = Math.round((totalSuccesses / totalAttempts) * 100);

    // Update difficulty stats
    const difficultyKey = challengeDifficulty.toLowerCase() as
      | "easy"
      | "medium"
      | "hard";
    updated.difficulty[difficultyKey].attempts += 1;
    if (success) {
      updated.difficulty[difficultyKey].completed += 1;
    }

    // Update category stats
    if (!updated.categoryStats[challengeCategory]) {
      updated.categoryStats[challengeCategory] = {
        completed: 0,
        attempts: 0,
      };
    }
    updated.categoryStats[challengeCategory].attempts += 1;
    if (success) {
      updated.categoryStats[challengeCategory].completed += 1;
    }

    // Update skill progress (simplified)
    const skillName = `${challengeCategory} Level`;
    if (!updated.skillProgress[skillName]) {
      updated.skillProgress[skillName] = {
        skillName,
        category: challengeCategory,
        level: 1,
        nextLevelPoints: 500,
        currentPoints: 0,
        maxPoints: 500,
      };
    }

    const skill = updated.skillProgress[skillName];
    skill.currentPoints += success ? points : Math.floor(points * 0.3);

    // Level up if needed
    while (skill.currentPoints >= skill.maxPoints && skill.level < 5) {
      skill.currentPoints -= skill.maxPoints;
      skill.level += 1;
      skill.nextLevelPoints = skill.maxPoints * (skill.level + 1);
      skill.maxPoints = skill.nextLevelPoints;
    }

    updated.lastUpdated = new Date().toISOString();

    return updated;
  }

  /**
   * Get skill level display
   */
  static getSkillLevelDisplay(level: number): {
    label: string;
    emoji: string;
    color: string;
  } {
    const levels = [
      { label: "Beginner", emoji: "🌱", color: "blue" },
      { label: "Basic", emoji: "📚", color: "green" },
      { label: "Competent", emoji: "💪", color: "blue" },
      { label: "Advanced", emoji: "🚀", color: "purple" },
      { label: "Expert", emoji: "👑", color: "gold" },
    ];
    return levels[Math.min(level - 1, 4)];
  }

  /**
   * Get category performance summary
   */
  static getCategoryPerformance(
    analytics: ChallengeAnalytics,
    category: string,
  ): { completionRate: number; difficulty: string } {
    const stats = analytics.categoryStats[category];
    if (!stats) {
      return { completionRate: 0, difficulty: "Not started" };
    }

    const rate = Math.round((stats.completed / stats.attempts) * 100);
    let difficulty = "Easy";
    if (rate < 50) difficulty = "Challenging";
    else if (rate < 75) difficulty = "Moderate";
    else if (rate >= 90) difficulty = "Mastered";

    return { completionRate: rate, difficulty };
  }

  /**
   * Get next recommended challenge difficulty
   */
  static getNextDifficultyRecommendation(
    analytics: ChallengeAnalytics,
  ): "Easy" | "Medium" | "Hard" {
    const easyRate =
      analytics.difficulty.easy.attempts > 0
        ? (analytics.difficulty.easy.completed /
            analytics.difficulty.easy.attempts) *
          100
        : 0;
    const mediumRate =
      analytics.difficulty.medium.attempts > 0
        ? (analytics.difficulty.medium.completed /
            analytics.difficulty.medium.attempts) *
          100
        : 0;

    if (easyRate >= 75 && mediumRate < 50) {
      return "Medium";
    } else if (mediumRate >= 75) {
      return "Hard";
    }
    return "Easy";
  }
}

// Default analytics data
export const defaultAnalytics: ChallengeAnalytics = {
  userId: "",
  totalChallengesSolved: 0,
  totalPointsEarned: 0,
  averageTimePerChallenge: 0,
  totalTimeSpent: 0,
  successRate: 0,
  skillProgress: {},
  categoryStats: {},
  difficulty: {
    easy: { completed: 0, attempts: 0 },
    medium: { completed: 0, attempts: 0 },
    hard: { completed: 0, attempts: 0 },
  },
  lastUpdated: new Date().toISOString(),
};
