import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonService } from "@/services/lessonService";

export const useAllLessons = () => {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      console.log("📚 Fetching all lessons from Supabase...");
      try {
        const data = await lessonService.getAllLessons();
        console.log(`✅ Successfully fetched ${data?.length || 0} lessons`);
        return data;
      } catch (error) {
        console.error("❌ Error fetching lessons:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useLessonsByDifficulty = (difficulty: string | null) => {
  return useQuery({
    queryKey: ["lessons", "difficulty", difficulty],
    queryFn: () => lessonService.getLessonsByDifficulty(difficulty!),
    enabled: !!difficulty,
  });
};

export const useLesson = (id: number | null) => {
  return useQuery({
    queryKey: ["lesson", id],
    queryFn: () => lessonService.getLesson(id!),
    enabled: !!id,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lesson: Parameters<typeof lessonService.createLesson>[0]) =>
      lessonService.createLesson(lesson),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Parameters<typeof lessonService.updateLesson>[1];
    }) => lessonService.updateLesson(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["lesson", id] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => lessonService.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};
