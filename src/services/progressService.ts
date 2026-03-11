import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Progress = Tables<"progress">;

export const progressService = {
  // Get user's progress on a lesson
  async getUserLessonProgress(userId: string, lessonId: number) {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
    return data || null;
  },

  // Get all progress for a user
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get progress for a specific lesson (all users)
  async getLessonProgress(lessonId: number) {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Save or update progress
  async saveProgress(progress: Partial<Progress>) {
    if (!progress.user_id || !progress.lesson_id) {
      throw new Error("user_id and lesson_id are required");
    }

    // Try to get existing progress
    const existing = await this.getUserLessonProgress(
      progress.user_id,
      progress.lesson_id,
    );

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("progress")
        .update({
          ...progress,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from("progress")
        .insert([
          {
            ...progress,
            updated_at: new Date().toISOString(),
          } as any,
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Mark lesson as completed
  async completeLesson(userId: string, lessonId: number, score: number) {
    return this.saveProgress({
      user_id: userId,
      lesson_id: lessonId,
      status: "completed",
      score,
    });
  },

  // Mark lesson as in progress
  async startLesson(userId: string, lessonId: number) {
    return this.saveProgress({
      user_id: userId,
      lesson_id: lessonId,
      status: "in_progress",
    });
  },

  // Delete progress
  async deleteProgress(id: number) {
    const { error } = await supabase.from("progress").delete().eq("id", id);

    if (error) throw error;
  },
};
