import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";

export const useUserChatHistory = (
  userId: string | null | undefined,
  limit?: number,
) => {
  return useQuery({
    queryKey: ["chatHistory", userId],
    queryFn: () => chatService.getUserChatHistory(userId!, limit),
    enabled: !!userId,
  });
};

export const useRecentMessages = (
  userId: string | null | undefined,
  limit: number = 50,
) => {
  return useQuery({
    queryKey: ["recentMessages", userId],
    queryFn: () => chatService.getRecentMessages(userId!, limit),
    enabled: !!userId,
  });
};

export const useSaveMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      message,
      role,
    }: {
      userId: string;
      message: string;
      role: "user" | "assistant";
    }) => chatService.saveMessage(userId, message, role),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory", userId] });
      queryClient.invalidateQueries({ queryKey: ["recentMessages", userId] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => chatService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
      queryClient.invalidateQueries({ queryKey: ["recentMessages"] });
    },
  });
};

export const useClearChatHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => chatService.clearUserChatHistory(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
      queryClient.invalidateQueries({ queryKey: ["recentMessages"] });
    },
  });
};

export const useGetChatContext = (
  userId: string | null | undefined,
  messageLimit: number = 5,
) => {
  return useQuery({
    queryKey: ["chatContext", userId],
    queryFn: () => chatService.getChatContext(userId!, messageLimit),
    enabled: !!userId,
  });
};
