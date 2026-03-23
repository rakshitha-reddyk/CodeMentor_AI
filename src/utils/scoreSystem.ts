import { Challenge, ChallengeResult } from "@/data/challengeTypes";

export interface ScoreCalculationInput {
  challenge: Challenge;
  testsPassedCount: number;
  testsTotalCount: number;
  timeSpentSeconds: number;
}

export class ScoreSystem {
  /**
   * Calculate points earned based on difficulty, test results, and time
   */
  static calculateScore(input: ScoreCalculationInput): number {
    const { challenge, testsPassedCount, testsTotalCount, timeSpentSeconds } =
      input;

    const basePoints = challenge.points;
    const timeLimit = challenge.timeLimit * 60; // convert to seconds

    // All tests passed
    if (testsPassedCount === testsTotalCount) {
      // Time bonus: 20% bonus if completed in <50% of time limit
      let timeBonus = 0;
      if (timeSpentSeconds < timeLimit * 0.5) {
        timeBonus = Math.floor(basePoints * 0.2);
      } else if (timeSpentSeconds < timeLimit * 0.75) {
        timeBonus = Math.floor(basePoints * 0.1);
      }

      return basePoints + timeBonus;
    }

    // Partial credit for some tests passed
    const passedPercentage = testsPassedCount / testsTotalCount;
    return Math.floor(basePoints * passedPercentage * 0.8); // 80% of base for partial
  }

  /**
   * Calculate accuracy percentage
   */
  static calculateAccuracy(
    testsPassedCount: number,
    testsTotalCount: number,
  ): number {
    if (testsTotalCount === 0) return 0;
    return Math.round((testsPassedCount / testsTotalCount) * 100);
  }

  /**
   * Determine if submission was successful
   */
  static isSuccessful(
    testsPassedCount: number,
    testsTotalCount: number,
  ): boolean {
    return testsPassedCount === testsTotalCount;
  }

  /**
   * Get performance feedback
   */
  static getPerformanceFeedback(
    accuracy: number,
    timeSpentSeconds: number,
    timeLimitSeconds: number,
  ): string {
    if (accuracy === 100) {
      if (timeSpentSeconds < timeLimitSeconds * 0.5) {
        return "Perfect solution! Blazing fast! 🔥";
      }
      return "Perfect solution! Well done! ✨";
    } else if (accuracy >= 75) {
      return "Great attempt! Most tests passed.";
    } else if (accuracy >= 50) {
      return "Good progress! Keep working on edge cases.";
    }
    return "Keep practicing! Review the problem and hints.";
  }
}
