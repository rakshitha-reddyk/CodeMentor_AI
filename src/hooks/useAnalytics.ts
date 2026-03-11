import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export const useUserAnalytics = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["analytics", userId],
    queryFn: () => analyticsService.getUserAnalytics(userId!),
    enabled: !!userId,
  });
};

export const useAllAnalytics = () => {
  return useQuery({
    queryKey: ["allAnalytics"],
    queryFn: () => analyticsService.getAllAnalytics(),
  });
};

export const useTopLearners = (limit: number = 10) => {
  return useQuery({
    queryKey: ["topLearners", limit],
    queryFn: () => analyticsService.getTopLearners(limit),
  });
};

export const useRecordLessonCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      analyticsService.recordLessonCompletion(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
      queryClient.invalidateQueries({ queryKey: ["allAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["topLearners"] });
    },
  });
};

export const useUpdateTimeSpent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      timeInMinutes,
    }: {
      userId: string;
      timeInMinutes: number;
    }) => analyticsService.updateTimeSpent(userId, timeInMinutes),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    },
  });
};

export const useUpdateLastActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => analyticsService.updateLastActive(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    },
  });
};
