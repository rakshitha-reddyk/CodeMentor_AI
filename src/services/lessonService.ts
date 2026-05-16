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
  // Get all lessons (optimized - uses local data)
  async getAllLessons() {
    console.log("📚 lessonService.getAllLessons() called");
    console.log(`✅ Loaded ${MOCK_LESSONS.length} lessons`);
    return getMockLessons();
  },

  // Get lessons by difficulty (optimized - uses local data)
  async getLessonsByDifficulty(difficulty: string) {
    console.log(`📚 Getting ${difficulty} lessons`);
    return getMockLessonsByDifficulty(
      difficulty as "Beginner" | "Intermediate" | "Advanced",
    );
  },

  // Get lesson by ID (optimized - uses local data)
  async getLesson(id: number) {
    console.log(`📖 lessonService.getLesson(${id}) called`);

    // Use local mock lesson directly for instant loading
    const mockLesson = getMockLessonById(id);
    if (mockLesson) {
      console.log(`✅ Loaded lesson: ${mockLesson.title}`);
      return mockLesson;
    }

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
