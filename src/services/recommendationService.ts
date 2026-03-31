/**
 * Recommendation Service
 * Manages caching, updates, and lifecycle of recommendations
 */

import {
  RecommendationEngineResult,
  getRecommendations,
  getDefaultRecommendations,
  UserPerformanceData,
} from "./recommendationEngine";

interface CachedRecommendations {
  data: RecommendationEngineResult;
  timestamp: number;
  userId: string;
}

class RecommendationService {
  private cache: Map<string, CachedRecommendations> = new Map();
  private cacheValidityMs = 5 * 60 * 1000; // 5 minutes
  private listeners: Map<string, Set<() => void>> = new Map();

  /**
   * Get recommendations with caching
   */
  getRecommendations(
    userData: UserPerformanceData,
    userId: string,
    useCache = true,
  ): RecommendationEngineResult {
    const cached = this.cache.get(userId);
    const now = Date.now();

    // Return cached if valid
    if (useCache && cached && now - cached.timestamp < this.cacheValidityMs) {
      return cached.data;
    }

    // Generate fresh recommendations
    const recommendations = getRecommendations(userData);

    // Cache result
    this.cache.set(userId, {
      data: recommendations,
      timestamp: now,
      userId,
    });

    return recommendations;
  }

  /**
   * Invalidate cache for a user (e.g., after challenge completion)
   */
  invalidateCache(userId: string): void {
    this.cache.delete(userId);
    this.notifyListeners(userId);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Subscribe to recommendation updates
   */
  subscribe(userId: string, callback: () => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }

    const listenersSet = this.listeners.get(userId)!;
    listenersSet.add(callback);

    // Return unsubscribe function
    return () => {
      listenersSet.delete(callback);
      if (listenersSet.size === 0) {
        this.listeners.delete(userId);
      }
    };
  }

  /**
   * Notify listeners about updates
   */
  private notifyListeners(userId: string): void {
    const listenersSet = this.listeners.get(userId);
    if (listenersSet) {
      listenersSet.forEach((callback) => callback());
    }
  }

  /**
   * Get recommendation for a specific topic
   */
  getTopicSpecificRec(
    userData: UserPerformanceData,
    topic: string,
  ): RecommendationEngineResult {
    const allRecs = getRecommendations(userData);

    // Find recommendation related to topic
    const topicRec = allRecs.recommendations.find((r) => r.topic === topic);

    if (topicRec) {
      return {
        ...allRecs,
        primaryRecommendation: topicRec,
      };
    }

    return allRecs;
  }

  /**
   * Get recommendations for a user with minimal data (new users)
   */
  getDefaultRecommendations(): RecommendationEngineResult {
    return getDefaultRecommendations();
  }

  /**
   * Manually trigger cache refresh for a user
   */
  refreshUserRecommendations(userId: string): void {
    this.invalidateCache(userId);
  }
}

// Singleton instance
export const recommendationService = new RecommendationService();
