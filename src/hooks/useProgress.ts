import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService } from "@/services/progressService";

export const useUserProgress = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["progress", userId],
    queryFn: () => progressService.getUserProgress(userId!),
    enabled: !!userId,
  });
};

export const useUserLessonProgress = (
  userId: string | null | undefined,
  lessonId: number | null | undefined,
) => {
  return useQuery({
    queryKey: ["progress", userId, lessonId],
    queryFn: () => progressService.getUserLessonProgress(userId!, lessonId!),
    enabled: !!userId && !!lessonId,
  });
};

export const useLessonProgress = (lessonId: number | null) => {
  return useQuery({
    queryKey: ["lessonProgress", lessonId],
    queryFn: () => progressService.getLessonProgress(lessonId!),
    enabled: !!lessonId,
  });
};

export const useSaveProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      progress: Parameters<typeof progressService.saveProgress>[0],
    ) => progressService.saveProgress(progress),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["lessonProgress"] });
    },
  });
};

export const useCompleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      lessonId,
      score,
    }: {
      userId: string;
      lessonId: number;
      score: number;
    }) => progressService.completeLesson(userId, lessonId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};

export const useStartLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, lessonId }: { userId: string; lessonId: number }) =>
      progressService.startLesson(userId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};

export const useDeleteProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => progressService.deleteProgress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};
