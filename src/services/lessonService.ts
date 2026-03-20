import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Lesson = Tables<"lessons">;

export const lessonService = {
  // Get all lessons
  async getAllLessons() {
    console.log("🔍 lessonService.getAllLessons() called");
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase error fetching lessons:", error);
        throw new Error(`Supabase Error: ${error.message}`);
      }

      console.log(`✅ Fetched ${data?.length || 0} lessons`);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      // Check for network/DNS errors
      if (
        errorMsg.includes("Failed to fetch") ||
        errorMsg.includes("ERR_NAME_NOT_RESOLVED")
      ) {
        console.error("🌐 Network connectivity issue - cannot reach Supabase");
        console.error(
          "   Check: Internet connection, firewall, or DNS resolution",
        );
        throw new Error(
          "Network error: Cannot reach Supabase. Check your internet connection.",
        );
      }

      throw err;
    }
  },

  // Get lessons by difficulty
  async getLessonsByDifficulty(difficulty: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("difficulty", difficulty)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get lesson by ID
  async getLesson(id: number) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create lesson (admin only)
  async createLesson(lesson: Partial<Lesson>) {
    const { data, error } = await supabase
      .from("lessons")
      .insert([
        {
          ...lesson,
          created_at: new Date().toISOString(),
        } as any,
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update lesson (admin only)
  async updateLesson(id: number, updates: Partial<Lesson>) {
    const { data, error } = await supabase
      .from("lessons")
      .update(updates as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete lesson (admin only)
  async deleteLesson(id: number) {
    const { error } = await supabase.from("lessons").delete().eq("id", id);

    if (error) throw error;
  },
};
