import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Analytics = Tables<"analytics">;

export const analyticsService = {
  // Get user analytics
  async getUserAnalytics(userId: string) {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
    return data || null;
  },

  // Update analytics
  async updateAnalytics(userId: string, updates: Partial<Analytics>) {
    const existing = await this.getUserAnalytics(userId);

    if (existing) {
      const { data, error } = await supabase
        .from("analytics")
        .update(updates as any)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("analytics")
        .insert([
          {
            user_id: userId,
            last_active: new Date().toISOString(),
            ...updates,
          } as any,
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Record lesson completion
  async recordLessonCompletion(userId: string) {
    const analytics = await this.getUserAnalytics(userId);
    const lessonsCompleted = (analytics?.total_lessons_completed || 0) + 1;

    return this.updateAnalytics(userId, {
      total_lessons_completed: lessonsCompleted,
      last_active: new Date().toISOString(),
    });
  },

  // Update time spent
  async updateTimeSpent(userId: string, timeInMinutes: number) {
    const analytics = await this.getUserAnalytics(userId);
    const totalTime = (analytics?.total_time_spent || 0) + timeInMinutes;

    return this.updateAnalytics(userId, {
      total_time_spent: totalTime,
      last_active: new Date().toISOString(),
    });
  },

  // Update last active
  async updateLastActive(userId: string) {
    return this.updateAnalytics(userId, {
      last_active: new Date().toISOString(),
    });
  },

  // Get all user analytics (admin)
  async getAllAnalytics() {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .order("total_lessons_completed", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get top learners
  async getTopLearners(limit: number = 10) {
    const { data, error } = await supabase
      .from("analytics")
      .select("*, users:user_id(name, avatar_url, email)")
      .order("total_lessons_completed", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
