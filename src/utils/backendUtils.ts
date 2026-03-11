import { supabase } from "@/integrations/supabase/client";

export const backendUtils = {
  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  },

  /**
   * Get current user ID
   */
  async getCurrentUserId(): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  },

  /**
   * Debounce function for API calls
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  /**
   * Calculate learning statistics
   */
  calculateStats(analytics: any, progress: any[]) {
    if (!analytics || !progress) return null;

    const completedLessons = progress.filter(
      (p) => p.status === "completed",
    ).length;
    const averageScore =
      progress.length > 0
        ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length
        : 0;

    const streakDays = Math.floor((analytics.total_time_spent || 0) / 60);

    return {
      totalLessons: progress.length,
      completedLessons,
      inProgressLessons: progress.filter((p) => p.status === "in_progress")
        .length,
      averageScore: Math.round(averageScore),
      totalTimeSpent: analytics.total_time_spent || 0,
      streakDays,
      completionRate: Math.round(
        (completedLessons / Math.max(progress.length, 1)) * 100,
      ),
    };
  },

  /**
   * Format time spent
   */
  formatTimeSpent(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  },

  /**
   * Get difficulty level color
   */
  getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
      beginner: "text-green-500",
      intermediate: "text-yellow-500",
      advanced: "text-red-500",
      expert: "text-purple-500",
    };
    return colors[difficulty.toLowerCase()] || "text-gray-500";
  },

  /**
   * Get difficulty level badge variant
   */
  getDifficultyBadgeVariant(
    difficulty: string,
  ): "default" | "secondary" | "destructive" | "outline" {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      beginner: "default",
      intermediate: "secondary",
      advanced: "destructive",
      expert: "outline",
    };
    return variants[difficulty.toLowerCase()] || "outline";
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isStrong: boolean;
    feedback: string[];
  } {
    const feedback: string[] = [];

    if (password.length < 8)
      feedback.push("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password))
      feedback.push("Password must contain uppercase letters");
    if (!/[a-z]/.test(password))
      feedback.push("Password must contain lowercase letters");
    if (!/[0-9]/.test(password)) feedback.push("Password must contain numbers");
    if (!/[^A-Za-z0-9]/.test(password))
      feedback.push("Password must contain special characters");

    return {
      isStrong: feedback.length === 0,
      feedback,
    };
  },
};
