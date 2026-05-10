import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  getAllLessons as getMockLessons,
  getLessonById as getMockLessonById,
  getLessonsByDifficulty as getMockLessonsByDifficulty,
  MOCK_LESSONS,
  type MockLesson,
} from "@/data/mockLessons";

export type Lesson = Tables<"lessons"> | MockLesson;

export const lessonService = {
  // Get all lessons (local first, fallback to Supabase)
  async getAllLessons() {
    console.log("📚 lessonService.getAllLessons() called");

    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        console.log(`✅ Fetched ${data.length} lessons from Supabase`);
        return data;
      }
    } catch (err) {
      console.warn("⚠️ Supabase failed, using local lessons:", err);
    }

    // Fallback to local mock lessons
    console.log(`📖 Using local mock lessons (${MOCK_LESSONS.length} lessons)`);
    return getMockLessons();
  },

  // Get lessons by difficulty (local first, fallback to Supabase)
  async getLessonsByDifficulty(difficulty: string) {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("difficulty", difficulty)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("⚠️ Supabase failed, using local lessons");
    }

    return getMockLessonsByDifficulty(
      difficulty as "Beginner" | "Intermediate" | "Advanced",
    );
  },

  // Get lesson by ID (local first, fallback to Supabase)
  async getLesson(id: number) {
    console.log(`📖 lessonService.getLesson(${id}) called`);

    // Try Supabase first
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        console.log(`✅ Fetched lesson ${id} from Supabase`);
        return data;
      }
    } catch (err) {
      console.warn(`⚠️ Supabase failed for lesson ${id}, using local data`);
    }

    // Fallback to local mock lesson
    const mockLesson = getMockLessonById(id);
    if (mockLesson) {
      console.log(`📖 Using local mock lesson: ${mockLesson.title}`);
      return mockLesson;
    }

    // Not found anywhere
    throw new Error(`Lesson with ID ${id} not found`);
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
