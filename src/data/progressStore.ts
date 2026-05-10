/**
 * Local Progress Store
 * Manages user progress using localStorage
 * Serves as a simple database replacement for MVP
 */

export interface LessonProgress {
  lessonId: number;
  status: "not-started" | "in-progress" | "completed";
  progress_percent: number;
  time_spent: number; // minutes
  completed_at?: string;
  started_at: string;
}

export interface UserAnalytics {
  total_lessons_completed: number;
  total_lessons_in_progress: number;
  total_time_spent: number; // minutes
  last_active: string;
}

const PROGRESS_STORAGE_KEY = "codementor_progress";
const ANALYTICS_STORAGE_KEY = "codementor_analytics";

/**
 * Get all progress records for a user
 */
export function getAllProgress(): LessonProgress[] {
  try {
    const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading progress from storage:", error);
    return [];
  }
}

/**
 * Get progress for a specific lesson
 */
export function getLessonProgress(lessonId: number): LessonProgress | null {
  const allProgress = getAllProgress();
  return allProgress.find((p) => p.lessonId === lessonId) || null;
}

/**
 * Save or update lesson progress
 */
export function saveLessonProgress(progress: LessonProgress): LessonProgress {
  const allProgress = getAllProgress();
  const index = allProgress.findIndex((p) => p.lessonId === progress.lessonId);

  if (index >= 0) {
    // Update existing
    allProgress[index] = {
      ...allProgress[index],
      ...progress,
    };
  } else {
    // Add new
    allProgress.push({
      ...progress,
      started_at: progress.started_at || new Date().toISOString(),
    });
  }

  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
    updateAnalytics(); // Auto-update analytics when progress changes
    return progress;
  } catch (error) {
    console.error("Error saving progress to storage:", error);
    throw error;
  }
}

/**
 * Start a lesson
 */
export function startLesson(lessonId: number): LessonProgress {
  const existing = getLessonProgress(lessonId);

  if (existing && existing.status !== "not-started") {
    // Already started, just return it
    return existing;
  }

  const progress: LessonProgress = {
    lessonId,
    status: "in-progress",
    progress_percent: 0,
    time_spent: 0,
    started_at: new Date().toISOString(),
  };

  return saveLessonProgress(progress);
}

/**
 * Update time spent on a lesson
 */
export function updateTimeSpent(
  lessonId: number,
  minutesSpent: number,
): LessonProgress {
  const existing = getLessonProgress(lessonId);

  if (!existing) {
    // If no progress yet, start the lesson first
    return updateTimeSpent(lessonId, minutesSpent);
  }

  const updated: LessonProgress = {
    ...existing,
    time_spent: existing.time_spent + minutesSpent,
  };

  return saveLessonProgress(updated);
}

/**
 * Mark lesson as completed
 */
export function completeLesson(lessonId: number): LessonProgress {
  const existing = getLessonProgress(lessonId);

  const progress: LessonProgress = {
    lessonId,
    status: "completed",
    progress_percent: 100,
    time_spent: existing?.time_spent || 0,
    started_at: existing?.started_at || new Date().toISOString(),
    completed_at: new Date().toISOString(),
  };

  return saveLessonProgress(progress);
}

/**
 * Get user analytics (aggregated from progress)
 */
export function getAnalytics(): UserAnalytics {
  const allProgress = getAllProgress();

  const completed = allProgress.filter((p) => p.status === "completed").length;
  const inProgress = allProgress.filter(
    (p) => p.status === "in-progress",
  ).length;
  const totalTime = allProgress.reduce((sum, p) => sum + p.time_spent, 0);

  return {
    total_lessons_completed: completed,
    total_lessons_in_progress: inProgress,
    total_time_spent: totalTime,
    last_active: new Date().toISOString(),
  };
}

/**
 * Update analytics (called automatically when progress changes)
 */
function updateAnalytics(): void {
  const analytics = getAnalytics();
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error("Error saving analytics to storage:", error);
  }
}

/**
 * Clear all progress (for testing/reset)
 */
export function clearAllProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    console.log("✅ All progress cleared");
  } catch (error) {
    console.error("Error clearing progress:", error);
  }
}

/**
 * Export progress as JSON (for backup)
 */
export function exportProgress(): string {
  const progress = getAllProgress();
  const analytics = getAnalytics();
  return JSON.stringify({ progress, analytics }, null, 2);
}

/**
 * Import progress from JSON (for restore)
 */
export function importProgress(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    if (data.progress && Array.isArray(data.progress)) {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data.progress));
      updateAnalytics();
      console.log("✅ Progress imported successfully");
    }
  } catch (error) {
    console.error("Error importing progress:", error);
    throw error;
  }
}
