export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedAt?: string;
  completedToday: boolean;
  totalCompletions: number;
}

export class StreakSystem {
  /**
   * Update streak based on challenge completion
   */
  static updateStreak(currentStreakData: StreakData): {
    streakData: StreakData;
    streakIncremented: boolean;
    message: string;
  } {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    let newStreakData = { ...currentStreakData };
    let streakIncremented = false;
    let message = "";

    // Check if already completed today
    if (
      currentStreakData.lastCompletedAt &&
      currentStreakData.lastCompletedAt.startsWith(todayStr)
    ) {
      return {
        streakData: newStreakData,
        streakIncremented: false,
        message: "Already completed a challenge today!",
      };
    }

    // Check if last completion was yesterday (to continue streak)
    const lastDate = currentStreakData.lastCompletedAt
      ? new Date(currentStreakData.lastCompletedAt)
      : null;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (
      lastDate &&
      !currentStreakData.lastCompletedAt.startsWith(yesterdayStr)
    ) {
      // Streak broken - more than 1 day since last completion
      newStreakData.currentStreak = 1;
      message = "Streak broken, but starting fresh today! 💪";
    } else if (lastDate || currentStreakData.currentStreak === 0) {
      // Continue or start streak
      newStreakData.currentStreak = currentStreakData.currentStreak + 1;
      message = `🔥 Streak: ${newStreakData.currentStreak} days!`;
      streakIncremented = true;

      // Update longest streak
      if (newStreakData.currentStreak > newStreakData.longestStreak) {
        newStreakData.longestStreak = newStreakData.currentStreak;
        message += ` New personal best! 🎉`;
      }
    } else {
      // First completion
      newStreakData.currentStreak = 1;
      message = "🌟 First challenge, great start!";
      streakIncremented = true;
    }

    newStreakData.lastCompletedAt = now.toISOString();
    newStreakData.completedToday = true;
    newStreakData.totalCompletions = currentStreakData.totalCompletions + 1;

    return { streakData: newStreakData, streakIncremented, message };
  }

  /**
   * Reset streak for next day if needed
   */
  static resetDailyFlag(streakData: StreakData): StreakData {
    return {
      ...streakData,
      completedToday: false,
    };
  }

  /**
   * Get streak status display
   */
  static getStreakDisplay(streakData: StreakData): {
    text: string;
    emoji: string;
    color: string;
  } {
    const streak = streakData.currentStreak;

    if (streak === 0) {
      return {
        text: "Start your first challenge!",
        emoji: "🚀",
        color: "gray",
      };
    } else if (streak < 3) {
      return { text: `${streak} day streak`, emoji: "⭐", color: "blue" };
    } else if (streak < 7) {
      return { text: `${streak} day streak`, emoji: "🔥", color: "orange" };
    } else if (streak < 30) {
      return { text: `${streak} day streak`, emoji: "🔥🔥", color: "red" };
    } else {
      return { text: `${streak} day streak`, emoji: "🏆", color: "gold" };
    }
  }

  /**
   * Check if streak will be lost tomorrow if no action taken
   */
  static isStreakAtRisk(streakData: StreakData): boolean {
    if (!streakData.lastCompletedAt) return false;

    const lastDate = new Date(streakData.lastCompletedAt);
    const now = new Date();
    const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

    return diffHours > 24;
  }

  /**
   * Get hours until streak is lost
   */
  static getHoursUntilStreakLost(streakData: StreakData): number {
    if (!streakData.lastCompletedAt) return 24;

    const lastDate = new Date(streakData.lastCompletedAt);
    const now = new Date();
    const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

    return Math.ceil(24 - diffHours);
  }
}

// Default streak data
export const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedAt: undefined,
  completedToday: false,
  totalCompletions: 0,
};
