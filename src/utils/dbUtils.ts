import { supabase } from "@/integrations/supabase/client";

/**
 * Database Utilities
 *
 * Helper functions for database operations, migrations, and maintenance
 */

export const dbUtils = {
  /**
   * Initialize default lessons (seed data)
   */
  async initializeLessons() {
    const defaultLessons = [
      {
        title: "Python Fundamentals",
        content:
          "Learn the basics of Python programming including variables, data types, and control flow.",
        difficulty: "beginner",
      },
      {
        title: "Functions and Modules",
        content:
          "Understand how to create and use functions, organize code into modules.",
        difficulty: "intermediate",
      },
      {
        title: "Object-Oriented Programming",
        content:
          "Master OOP concepts including classes, inheritance, polymorphism, and encapsulation.",
        difficulty: "intermediate",
      },
      {
        title: "Advanced Algorithms",
        content:
          "Study complex algorithms including sorting, searching, graph algorithms, and dynamic programming.",
        difficulty: "advanced",
      },
      {
        title: "System Design Patterns",
        content:
          "Learn design patterns and architectural principles for building scalable systems.",
        difficulty: "advanced",
      },
      {
        title: "Distributed Systems",
        content:
          "Explore concepts in distributed computing, microservices, and scalability.",
        difficulty: "expert",
      },
    ];

    const { data: existingLessons } = await supabase
      .from("lessons")
      .select("title")
      .limit(1);

    if (existingLessons && existingLessons.length > 0) {
      console.log("Lessons already exist, skipping initialization");
      return;
    }

    const { error } = await supabase.from("lessons").insert(defaultLessons);

    if (error) {
      console.error("Error initializing lessons:", error);
      throw error;
    }

    console.log("✅ Lessons initialized successfully");
  },

  /**
   * Get database statistics
   */
  async getStatistics() {
    const [
      { count: usersCount },
      { count: lessonsCount },
      { count: progressCount },
      { count: chatCount },
    ] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("lessons").select("id", { count: "exact", head: true }),
      supabase.from("progress").select("id", { count: "exact", head: true }),
      supabase
        .from("chat_history")
        .select("id", { count: "exact", head: true }),
    ]);

    return {
      users: usersCount || 0,
      lessons: lessonsCount || 0,
      progress: progressCount || 0,
      chatMessages: chatCount || 0,
    };
  },

  /**
   * Clear all user data (useful for testing)
   */
  async clearUserData(userId: string) {
    try {
      await Promise.all([
        supabase.from("progress").delete().eq("user_id", userId),
        supabase.from("analytics").delete().eq("user_id", userId),
        supabase.from("chat_history").delete().eq("user_id", userId),
      ]);

      console.log("✅ User data cleared");
    } catch (error) {
      console.error("Error clearing user data:", error);
      throw error;
    }
  },

  /**
   * Export user data for GDPR compliance
   */
  async exportUserData(userId: string) {
    const [
      { data: user },
      { data: profile },
      { data: progress },
      { data: chat },
      { data: analytics },
    ] = await Promise.all([
      supabase.auth.admin.getUserById(userId).catch(() => ({ data: null })),
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase.from("progress").select("*").eq("user_id", userId),
      supabase.from("chat_history").select("*").eq("user_id", userId),
      supabase.from("analytics").select("*").eq("user_id", userId).single(),
    ]);

    return {
      user,
      profile,
      progress,
      chat,
      analytics,
    };
  },

  /**
   * Get user engagement metrics
   */
  async getUserEngagementMetrics(userId: string) {
    const { data: progress } = await supabase
      .from("progress")
      .select("status, score")
      .eq("user_id", userId);

    const { data: analytics } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", userId)
      .single();

    const { data: chat } = await supabase
      .from("chat_history")
      .select("created_at")
      .eq("user_id", userId);

    if (!progress || !analytics) {
      return null;
    }

    const completedCount = progress.filter(
      (p) => p.status === "completed",
    ).length;
    const totalCount = progress.length;
    const averageScore =
      totalCount > 0
        ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / totalCount
        : 0;

    return {
      lessonsCompleted: completedCount,
      lessonsStarted: totalCount,
      completionRate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
      averageScore: Math.round(averageScore),
      timeSpent: analytics.total_time_spent || 0,
      chatMessages: chat?.length || 0,
      lastActive: analytics.last_active,
    };
  },

  /**
   * Get lessons by difficulty with progress stats
   */
  async getLessonsWithStats(userId?: string) {
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("*")
      .order("difficulty", { ascending: true });

    if (error) throw error;

    if (!userId) return lessons;

    // Enrich with user's progress
    const { data: progress } = await supabase
      .from("progress")
      .select("lesson_id, status, score")
      .eq("user_id", userId);

    return lessons?.map((lesson) => {
      const userProgress = progress?.find((p) => p.lesson_id === lesson.id);
      return {
        ...lesson,
        userProgress: userProgress || {
          status: "not_started",
          score: null,
        },
      };
    });
  },

  /**
   * Get complettion statistics
   */
  async getCompletionStats() {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, difficulty");

    const { data: progress } = await supabase
      .from("progress")
      .select("lesson_id, status");

    if (!lessons || !progress) return null;

    const stats: Record<string, { total: number; completed: number }> = {};

    lessons.forEach((lesson) => {
      const diff = lesson.difficulty || "unknown";
      if (!stats[diff]) {
        stats[diff] = { total: 0, completed: 0 };
      }
      stats[diff].total++;

      const lessonProgress = progress.find((p) => p.lesson_id === lesson.id);
      if (lessonProgress?.status === "completed") {
        stats[diff].completed++;
      }
    });

    return stats;
  },

  /**
   * Backup lessons
   */
  async backupLessons() {
    const { data, error } = await supabase.from("lessons").select("*");

    if (error) throw error;

    const timestamp = new Date().toISOString();
    const backup = {
      timestamp,
      lessons: data,
    };

    // Save to localStorage for now
    localStorage.setItem(`lessons_backup_${timestamp}`, JSON.stringify(backup));

    return backup;
  },

  /**
   * Get recent user activity
   */
  async getRecentActivity(limit: number = 10) {
    const { data, error } = await supabase
      .from("chat_history")
      .select("user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Health check - verify database connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("count")
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  },
};

/**
 * Batch operations for performance
 */
export const batchOperations = {
  /**
   * Bulk update user progress
   */
  async bulkUpdateProgress(
    updates: Array<{
      userId: string;
      lessonId: number;
      status: string;
      score: number;
    }>,
  ) {
    const operations = updates.map((update) =>
      supabase.from("progress").upsert(
        [
          {
            user_id: update.userId,
            lesson_id: update.lessonId,
            status: update.status,
            score: update.score,
            updated_at: new Date().toISOString(),
          },
        ],
        {
          onConflict: "user_id,lesson_id",
        },
      ),
    );

    const results = await Promise.allSettled(operations);
    return results;
  },

  /**
   * Bulk record completions
   */
  async bulkRecordCompletions(
    completions: Array<{
      userId: string;
      lessonId: number;
      score: number;
    }>,
  ) {
    return this.bulkUpdateProgress(
      completions.map((c) => ({
        ...c,
        status: "completed",
      })),
    );
  },
};
