/**
 * Streak Management System
 * Handles daily streaks with proper date checking
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalDaysActive: number;
}

export interface StreakUpdateResult {
  streak: StreakData;
  streakIncremented: boolean;
  message: string;
  milestone?: string;
}

export class StreakSystem {
  /**
   * Initialize a streak record
   */
  static initializeStreak(): StreakData {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      totalDaysActive: 0,
    };
  }

  /**
   * Get today's date as ISO string (YYYY-MM-DD)
   */
  static getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  /**
   * Get yesterday's date as ISO string
   */
  static getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  /**
   * Check if given date is today
   */
  static isToday(dateString: string): boolean {
    return dateString === this.getTodayDate();
  }

  /**
   * Check if given date is yesterday
   */
  static isYesterday(dateString: string): boolean {
    return dateString === this.getYesterdayDate();
  }

  /**
   * Update streak based on completion date
   */
  static updateStreak(currentStreak: StreakData): StreakUpdateResult {
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();

    // Already completed today - no increment
    if (currentStreak.lastCompletedDate === today) {
      return {
        streak: currentStreak,
        streakIncremented: false,
        message: "Already completed today! Come back tomorrow.",
      };
    }

    // First challenge or continuation from yesterday
    if (
      !currentStreak.lastCompletedDate ||
      currentStreak.lastCompletedDate === yesterday
    ) {
      const newStreak = currentStreak.currentStreak + 1;
      const updated: StreakData = {
        ...currentStreak,
        currentStreak: newStreak,
        lastCompletedDate: today,
        totalDaysActive: currentStreak.totalDaysActive + 1,
        longestStreak: Math.max(newStreak, currentStreak.longestStreak),
      };

      let message = `🔥 ${newStreak} day streak!`;
      let milestone: string | undefined;

      // Check for milestones
      if (newStreak === 7) {
        milestone = "week-warrior";
        message = `🔥 One week streak! Week Warrior badge unlocked! 🏆`;
      } else if (newStreak === 14) {
        milestone = "fortnight-master";
        message = `🔥 Two weeks! Fortnight Master badge! 🏆✨`;
      } else if (newStreak === 30) {
        milestone = "month-legend";
        message = `🔥 30 DAY STREAK! Legend status unlocked! 👑`;
      } else if (newStreak === 100) {
        milestone = "century-champion";
        message = `🔥 100 DAY STREAK! You are UNSTOPPABLE! 👑⭐`;
      }

      return {
        streak: updated,
        streakIncremented: true,
        message,
        milestone,
      };
    }

    // Break in streak - reset to 1
    const resetStreak: StreakData = {
      ...currentStreak,
      currentStreak: 1,
      lastCompletedDate: today,
      totalDaysActive: currentStreak.totalDaysActive + 1,
      longestStreak: currentStreak.longestStreak, // preserve longest
    };

    return {
      streak: resetStreak,
      streakIncremented: true,
      message:
        "Streak broken, but you're back on track! Starting fresh at 1 day.",
    };
  }

  /**
   * Reset daily completion flags (call at midnight)
   */
  static resetDailyFlags(streak: StreakData): StreakData {
    // This is handled by checking lastCompletedDate
    // No actual reset needed - the date comparison handles it
    return streak;
  }

  /**
   * Get days until streak breaks
   */
  static getDaysUntilBreak(lastCompletedDate: string | null): number {
    if (!lastCompletedDate) return 1;

    const lastDate = new Date(lastCompletedDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDateNormalized = new Date(
      lastDate.getFullYear(),
      lastDate.getMonth(),
      lastDate.getDate(),
    );

    const timeDiff = today.getTime() - lastDateNormalized.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // If 1 or fewer days passed, streak still safe
    if (daysDiff <= 1) return 24; // hours remaining

    // Streak broken
    return 0;
  }

  /**
   * Get visual representation of streak
   */
  static getStreakEmoji(streak: number): string {
    if (streak === 0) return "⚫";
    if (streak < 3) return "🟡";
    if (streak < 7) return "🟠";
    if (streak < 14) return "🔥";
    if (streak < 30) return "🔥🔥";
    return "🔥🔥🔥";
  }

  /**
   * Get streak status message
   */
  static getStreakStatus(streak: StreakData): string {
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();

    if (streak.lastCompletedDate === today) {
      return "✅ Completed today";
    }

    if (streak.lastCompletedDate === yesterday) {
      return `${this.getStreakEmoji(streak.currentStreak)} ${streak.currentStreak} day streak (continue tomorrow)`;
    }

    if (!streak.lastCompletedDate) {
      return "🌱 Start your streak today";
    }

    return `⚠️ Streak broken (record: ${streak.longestStreak} days)`;
  }

  /**
   * Format streak for display
   */
  static formatStreak(streak: StreakData): {
    display: string;
    emoji: string;
    status: string;
    onTrack: boolean;
  } {
    const today = this.getTodayDate();
    const yesterday = this.getYesterdayDate();

    const onTrack =
      streak.lastCompletedDate === today ||
      streak.lastCompletedDate === yesterday;

    return {
      display: `${streak.currentStreak} day`,
      emoji: this.getStreakEmoji(streak.currentStreak),
      status: this.getStreakStatus(streak),
      onTrack,
    };
  }
}

export default StreakSystem;
