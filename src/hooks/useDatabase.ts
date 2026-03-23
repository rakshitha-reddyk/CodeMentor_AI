import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MockDatabase from "@/services/mockDatabase";
import {
  User,
  UserProgress,
  UserStreak,
  ChallengeScore,
} from "@/types/database";

/**
 * Hook for managing user data from mock database
 * Automatically syncs with database and handles updates
 */
export function useUserData() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch/create user on mount or when auth user changes
  useEffect(() => {
    const initializeUser = async () => {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await MockDatabase.getOrCreateUser(
          authUser.id,
          authUser.user_metadata?.full_name || "User",
          authUser.email || "",
        );
        setUser(userData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load user data",
        );
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [authUser?.id]);

  // Refetch user data
  const refetchUser = useCallback(async () => {
    if (!authUser) return;

    try {
      const userData = await MockDatabase.getUser(authUser.id);
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error("Error refetching user:", err);
    }
  }, [authUser?.id]);

  // Update user points
  const addPoints = useCallback(
    async (points: number) => {
      if (!authUser) return;

      try {
        const updated = await MockDatabase.updateUserPoints(
          authUser.id,
          points,
        );
        setUser(updated);
        return updated;
      } catch (err) {
        console.error("Error adding points:", err);
      }
    },
    [authUser?.id],
  );

  // Increment challenges solved
  const incrementChallengesSolved = useCallback(async () => {
    if (!authUser) return;

    try {
      const updated = await MockDatabase.incrementChallengesSolved(authUser.id);
      setUser(updated);
      return updated;
    } catch (err) {
      console.error("Error incrementing challenges:", err);
    }
  }, [authUser?.id]);

  return {
    user,
    loading,
    error,
    refetchUser,
    addPoints,
    incrementChallengesSolved,
  };
}

/**
 * Hook for managing user streak
 */
export function useUserStreak() {
  const { user: authUser } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  // Load streak on mount
  useEffect(() => {
    const loadStreak = async () => {
      if (!authUser) {
        setStreak(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const streakData = await MockDatabase.getOrCreateStreak(authUser.id);
        setStreak(streakData);
      } catch (err) {
        console.error("Error loading streak:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStreak();
  }, [authUser?.id]);

  // Update streak
  const updateStreak = useCallback(async () => {
    if (!authUser) return;

    try {
      const result = await MockDatabase.updateStreak(authUser.id);
      setStreak(result.streak);
      return result;
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  }, [authUser?.id]);

  return {
    streak,
    loading,
    updateStreak,
  };
}

/**
 * Hook for managing user skill progress
 */
export function useUserProgress(skillCategory?: string) {
  const { user: authUser } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Load progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!authUser || !skillCategory) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const progressData = await MockDatabase.getUserProgress(
          authUser.id,
          skillCategory,
        );
        setProgress(progressData);
      } catch (err) {
        console.error("Error loading progress:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [authUser?.id, skillCategory]);

  // Update progress
  const updateProgress = useCallback(
    async (pointsEarned: number, passed: boolean = true) => {
      if (!authUser || !skillCategory) return;

      try {
        const updated = await MockDatabase.updateSkillProgress(
          authUser.id,
          skillCategory,
          pointsEarned,
          passed,
        );
        setProgress(updated);
        return updated;
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    },
    [authUser?.id, skillCategory],
  );

  return {
    progress,
    loading,
    updateProgress,
  };
}

/**
 * Hook for managing challenge scores
 */
export function useUserScores(challengeId?: string) {
  const { user: authUser } = useAuth();
  const [scores, setScores] = useState<ChallengeScore[]>([]);
  const [bestScore, setBestScore] = useState<ChallengeScore | null>(null);
  const [loading, setLoading] = useState(true);

  // Load scores
  useEffect(() => {
    const loadScores = async () => {
      if (!authUser) {
        setScores([]);
        setBestScore(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userScores = await MockDatabase.getUserChallengeScores(
          authUser.id,
        );
        setScores(userScores);

        if (challengeId) {
          const best = await MockDatabase.getBestScore(
            authUser.id,
            challengeId,
          );
          setBestScore(best || null);
        }
      } catch (err) {
        console.error("Error loading scores:", err);
      } finally {
        setLoading(false);
      }
    };

    loadScores();
  }, [authUser?.id, challengeId]);

  // Save new score
  const saveScore = useCallback(
    async (score: ChallengeScore) => {
      if (!authUser) return;

      try {
        await MockDatabase.saveChallengeScore(score);
        setScores((prev) => [score, ...prev]);

        if (challengeId === score.challengeId) {
          setBestScore(score);
        }
      } catch (err) {
        console.error("Error saving score:", err);
      }
    },
    [authUser?.id, challengeId],
  );

  return {
    scores,
    bestScore,
    loading,
    saveScore,
  };
}

/**
 * Hook for challenge history
 */
export function useChallengeHistory(limit: number = 10) {
  const { user: authUser } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history
  useEffect(() => {
    const loadHistory = async () => {
      if (!authUser) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const historyData = await MockDatabase.getUserChallengeHistory(
          authUser.id,
          limit,
        );
        setHistory(historyData);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [authUser?.id, limit]);

  const refetch = useCallback(async () => {
    if (!authUser) return;

    try {
      const historyData = await MockDatabase.getUserChallengeHistory(
        authUser.id,
        limit,
      );
      setHistory(historyData);
    } catch (err) {
      console.error("Error refetching history:", err);
    }
  }, [authUser?.id, limit]);

  return {
    history,
    loading,
    refetch,
  };
}
