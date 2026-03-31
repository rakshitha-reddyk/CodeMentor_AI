import { useEffect, useState, useCallback } from "react";
import {
  getRecommendations,
  getDefaultRecommendations,
  UserPerformanceData,
  RecommendationEngineResult,
} from "@/services/recommendationEngine";
import { useCurrentUser } from "./useUser";
import { progressService } from "@/services/progressService";

export const useRecommendations = () => {
  const { data: currentUser } = useCurrentUser();
  const [recommendations, setRecommendations] =
    useState<RecommendationEngineResult>(getDefaultRecommendations());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build user performance data from various sources
  const buildUserPerformanceData = useCallback(
    async (userId: string): Promise<UserPerformanceData> => {
      try {
        // Get user progress
        const progressData = await progressService.getUserProgress(userId);

        // Calculate statistics from progress data
        let totalAttempts = 0;
        let successfulAttempts = 0;
        const topicMap: Record<string, number[]> = {};
        const recentActivityList: Array<{
          topic: string;
          timestamp: Date;
          type: "success" | "failure";
          accuracy?: number;
        }> = [];

        // Process progress data
        progressData.forEach((p: any) => {
          const isSuccess = p.status === "completed" && p.score >= 70;
          if (isSuccess) successfulAttempts++;
          totalAttempts++;

          // Track by topic/lesson
          const topic = p.lesson_id?.toString() || "unknown";
          if (!topicMap[topic]) topicMap[topic] = [];
          topicMap[topic].push(p.score || 0);

          // Add to recent activity
          recentActivityList.push({
            topic,
            timestamp: new Date(p.updated_at || new Date()),
            type: isSuccess ? "success" : "failure",
            accuracy: p.score,
          });
        });

        // Calculate accuracy
        const accuracy =
          totalAttempts > 0
            ? Math.round((successfulAttempts / totalAttempts) * 100)
            : 0;

        // Identify failed and strong topics
        const failedTopics: string[] = [];
        const strongTopics: string[] = [];
        const skillProgress: Record<string, number> = {};

        Object.entries(topicMap).forEach(([topic, scores]) => {
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          skillProgress[topic] = Math.round(avgScore);

          if (avgScore < 70) {
            failedTopics.push(topic);
          } else if (avgScore >= 85) {
            strongTopics.push(topic);
          }
        });

        // Calculate streak (simplified - assumes consecutive days of activity)
        let streak = 0;
        if (recentActivityList.length > 0) {
          const sortedByDate = recentActivityList.sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
          );

          let currentDate = new Date(sortedByDate[0].timestamp);
          currentDate.setHours(0, 0, 0, 0);

          for (const activity of sortedByDate) {
            const actDate = new Date(activity.timestamp);
            actDate.setHours(0, 0, 0, 0);

            const diffDays = Math.floor(
              (currentDate.getTime() - actDate.getTime()) /
                (1000 * 60 * 60 * 24),
            );

            if (diffDays === streak) {
              streak++;
              currentDate = new Date(actDate);
            } else {
              break;
            }
          }
        }

        // Calculate time spent (assuming each progress entry = time spent)
        const timeSpent = progressData.length * 25; // Estimate 25m per lesson

        // Get last activity date
        const lastActivityDate =
          recentActivityList.length > 0
            ? new Date(recentActivityList[0].timestamp)
            : undefined;

        return {
          accuracy,
          completedChallenges: successfulAttempts,
          failedChallenges: totalAttempts - successfulAttempts,
          failedTopics,
          strongTopics,
          recentActivity: recentActivityList,
          streak,
          timeSpent,
          lastActivityDate,
          skillProgress,
        };
      } catch (err) {
        console.error("Error building user performance data:", err);
        // Return default data on error
        return {
          accuracy: 0,
          completedChallenges: 0,
          failedChallenges: 0,
          failedTopics: [],
          strongTopics: [],
          recentActivity: [],
          streak: 0,
          timeSpent: 0,
          skillProgress: {},
        };
      }
    },
    [],
  );

  // Fetch and update recommendations
  const fetchRecommendations = useCallback(async () => {
    if (!currentUser?.id) {
      setRecommendations(getDefaultRecommendations());
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userData = await buildUserPerformanceData(currentUser.id);
      const result = getRecommendations(userData);

      setRecommendations(result);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load recommendations",
      );
      setRecommendations(getDefaultRecommendations());
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, buildUserPerformanceData]);

  // Refetch when user changes or on mount
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Refresh recommendations (can be called after challenge completion, etc.)
  const refresh = useCallback(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    isLoading,
    error,
    refresh,
    primaryRec: recommendations.primaryRecommendation,
    allRecs: recommendations.recommendations,
    analysisReason: recommendations.analysisReason,
  };
};
