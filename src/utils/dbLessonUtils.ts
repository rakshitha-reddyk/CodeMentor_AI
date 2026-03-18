import { supabase } from "@/integrations/supabase/client";
import { seedLessons } from "@/scripts/seedLessons";

export const dbLessonUtils = {
  // Clear all lessons and reseed
  async clearAndReseedLessons() {
    try {
      console.log("🗑️ Clearing all lessons...");

      // Delete all lessons
      const { error: deleteError } = await supabase
        .from("lessons")
        .delete()
        .neq("id", -1); // Delete all records (neq to -1 matches all)

      if (deleteError) {
        console.error("Error deleting lessons:", deleteError);
        throw deleteError;
      }

      console.log("✅ Lessons cleared");

      // Re-seed lessons
      const result = await seedLessons();
      return result || [];
    } catch (error) {
      console.error("Error in clearAndReseedLessons:", error);
      throw error;
    }
  },

  // Get all lessons count
  async getLessonCount() {
    const { data, error } = await supabase
      .from("lessons")
      .select("id", { count: "exact" });

    if (error) {
      console.error("Error getting lesson count:", error);
      return 0;
    }

    return data?.length || 0;
  },

  // Check if lessons exist
  async lessonsExist() {
    const count = await this.getLessonCount();
    return count > 0;
  },
};
