import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ChatMessage = Tables<"chat_history">;

export const chatService = {
  // Get chat history for a user
  async getUserChatHistory(userId: string, limit?: number) {
    let query = supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get recent chat messages
  async getRecentMessages(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.reverse(); // Return in ascending order
  },

  // Save chat message
  async saveMessage(
    userId: string,
    message: string,
    role: "user" | "assistant",
  ) {
    const { data, error } = await supabase
      .from("chat_history")
      .insert([
        {
          user_id: userId,
          message,
          role,
          created_at: new Date().toISOString(),
        } as any,
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete chat message
  async deleteMessage(id: number) {
    const { error } = await supabase.from("chat_history").delete().eq("id", id);

    if (error) throw error;
  },

  // Clear chat history for user
  async clearUserChatHistory(userId: string) {
    const { error } = await supabase
      .from("chat_history")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  },

  // Get chat context (recent messages for AI context)
  async getChatContext(userId: string, messageLimit: number = 5) {
    const messages = await this.getRecentMessages(userId, messageLimit);
    return messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.message || "",
    }));
  },
};
