import { Challenge } from "@/data/challengeTypes";

/**
 * Score Calculation System
 * Handles points, bonuses, and performance metrics
 */

export class ScoringSystem {
  /**
   * Calculate total score for a challenge submission
   */
  static calculateTotalScore(
    challenge: Challenge,
    testsPassed: number,
    totalTests: number,
    timeSpentSeconds: number,
  ): {
    score: number;
    baseScore: number;
    timeBonus: number;
    accuracy: number;
    feedback: string;
  } {
    const totalTests_safe = Math.max(totalTests, 1);
    const accuracy = Math.round((testsPassed / totalTests_safe) * 100);

    // Base score (only if all tests pass)
    const allTestsPassed = testsPassed === totalTests_safe;
    const baseScore = allTestsPassed
      ? challenge.points
      : Math.floor(challenge.points * 0.6); // 60% for partial

    // Time bonus
    const timeLimit = challenge.timeLimit * 60; // convert to seconds
    let timeBonus = 0;

    if (allTestsPassed) {
      if (timeSpentSeconds < timeLimit * 0.3) {
        timeBonus = Math.floor(challenge.points * 0.3); // 30% bonus
      } else if (timeSpentSeconds < timeLimit * 0.6) {
        timeBonus = Math.floor(challenge.points * 0.2); // 20% bonus
      } else if (timeSpentSeconds < timeLimit * 0.9) {
        timeBonus = Math.floor(challenge.points * 0.1); // 10% bonus
      }
    }

    // Difficulty multiplier
    const difficultyMultiplier =
      challenge.difficulty === "Hard"
        ? 1.5
        : challenge.difficulty === "Medium"
          ? 1.2
          : 1.0;

    const totalScore = Math.floor(
      (baseScore + timeBonus) * difficultyMultiplier,
    );

    // Feedback
    let feedback = "";
    if (accuracy === 100 && timeSpentSeconds < timeLimit * 0.5) {
      feedback = "Perfect! Blazing fast! 🔥";
    } else if (accuracy === 100) {
      feedback = "Excellent! All tests passed! ✨";
    } else if (accuracy >= 80) {
      feedback = "Great work! Most tests passed.";
    } else if (accuracy >= 50) {
      feedback = "Good progress! Keep improving.";
    } else {
      feedback = "Keep practicing! Review the problem.";
    }

    return {
      score: totalScore,
      baseScore,
      timeBonus,
      accuracy,
      feedback,
    };
  }

  /**
   * Calculate accuracy percentage
   */
  static calculateAccuracy(testsPassed: number, totalTests: number): number {
    return totalTests === 0 ? 0 : Math.round((testsPassed / totalTests) * 100);
  }

  /**
   * Get performance rating
   */
  static getPerformanceRating(
    accuracy: number,
    timeSpentSeconds: number,
    timeLimitSeconds: number,
  ): "Perfect" | "Great" | "Good" | "Fair" | "Poor" {
    const timeFraction = timeSpentSeconds / timeLimitSeconds;

    if (accuracy === 100 && timeFraction < 0.4) {
      return "Perfect";
    } else if (accuracy === 100 && timeFraction < 0.7) {
      return "Great";
    } else if (accuracy >= 80 && timeFraction < 0.8) {
      return "Good";
    } else if (accuracy >= 60) {
      return "Fair";
    }
    return "Poor";
  }

  /**
   * Calculate level based on points
   */
  static calculateLevel(totalPoints: number): number {
    return Math.floor(totalPoints / 500) + 1;
  }

  /**
   * Calculate progress to next level
   */
  static getProgressToNextLevel(totalPoints: number): {
    currentLevel: number;
    pointsInLevel: number;
    pointsNeeded: number;
    progress: number;
  } {
    const currentLevel = this.calculateLevel(totalPoints);
    const pointsForCurrentLevel = (currentLevel - 1) * 500;
    const pointsInLevel = totalPoints - pointsForCurrentLevel;
    const pointsNeeded = 500 - pointsInLevel;

    return {
      currentLevel,
      pointsInLevel,
      pointsNeeded,
      progress: Math.round((pointsInLevel / 500) * 100),
    };
  }

  /**
   * Get daily bonus
   */
  static getDailyBonus(baseScore: number): number {
    return Math.floor(baseScore * 0.15); // 15% daily bonus
  }

  /**
   * Get streak bonus
   */
  static getStreakBonus(baseScore: number, currentStreak: number): number {
    if (currentStreak < 3) return 0;
    if (currentStreak < 7) return Math.floor(baseScore * 0.1); // 10%
    if (currentStreak < 14) return Math.floor(baseScore * 0.2); // 20%
    if (currentStreak < 30) return Math.floor(baseScore * 0.3); // 30%
    return Math.floor(baseScore * 0.5); // 50%
  }

  /**
   * Get category multiplier
   */
  static getCategoryMultiplier(categoryLevel: number): number {
    // Higher level in category = higher multiplier
    return 1 + (categoryLevel - 1) * 0.1;
  }
}

export default ScoringSystem;
