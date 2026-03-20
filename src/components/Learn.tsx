import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Search,
  Clock,
  Play,
  Zap,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import LessonCard from "@/components/LessonCard";
import type { Lesson } from "@/services/lessonService";
import { useAllLessons } from "@/hooks/useLesson";
import { useCurrentUser } from "@/hooks/useUser";
import { useUserProgress } from "@/hooks/useProgress";

// Mock lessons for offline/fallback display
const MOCK_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "JavaScript Basics",
    difficulty: "Beginner",
    content:
      "Learn the fundamentals of JavaScript including variables, data types, and basic operations.",
    created_at: new Date().toISOString(),
  } as Lesson,
  {
    id: 2,
    title: "React Hooks - useState",
    difficulty: "Intermediate",
    content:
      "Master the useState hook to manage component state in functional components.",
    created_at: new Date().toISOString(),
  } as Lesson,
  {
    id: 3,
    title: "CSS Flexbox",
    difficulty: "Intermediate",
    content: "Master CSS Flexbox for creating flexible and responsive layouts.",
    created_at: new Date().toISOString(),
  } as Lesson,
  {
    id: 4,
    title: "Functions in JavaScript",
    difficulty: "Beginner",
    content: "Learn how to create and use functions to organize your code.",
    created_at: new Date().toISOString(),
  } as Lesson,
];

interface LearnProps {
  lessons?: Lesson[] | undefined;
  progress?: any[] | undefined;
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => Promise<any>;
}

const Learn: React.FC<LearnProps> = ({
  lessons: propLessons,
  progress: propProgress,
  isLoading: propIsLoading,
  error: propError,
  refetch: propRefetch,
}) => {
  const navigate = useNavigate();

  // Fetch data directly if not provided through props
  const { data: user } = useCurrentUser();
  const {
    data: fetchedLessons,
    isLoading: fetchIsLoading,
    refetch: defaultRefetch,
  } = useAllLessons();
  const { data: fetchedProgress } = useUserProgress(user?.id);

  // Use props if provided, otherwise use fetched data, fallback to mock lessons for offline
  const lessons =
    propLessons || fetchedLessons || (propError ? MOCK_LESSONS : []);
  const progress = propProgress || fetchedProgress || [];
  const isLoading =
    propIsLoading !== undefined ? propIsLoading : fetchIsLoading;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Filter levels only
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  // Get user progress for a lesson
  const getProgressForLesson = (lessonId: string | number) => {
    const lessonProgress = progress?.find(
      (p) => p.lesson_id === lessonId || p.lesson_id === String(lessonId),
    );
    return lessonProgress?.score || 0;
  };

  // Get completion status
  const isLessonCompleted = (lessonId: string | number) => {
    const lessonProgress = progress?.find(
      (p) => p.lesson_id === lessonId || p.lesson_id === String(lessonId),
    );
    return lessonProgress?.status === "completed";
  };

  // Filter lessons based on search and difficulty
  const filteredLessons = useMemo(() => {
    let filtered = (lessons || []).slice(); // Create copy

    // Search filter (title and content only)
    if (searchQuery) {
      filtered = filtered.filter(
        (lesson: any) =>
          lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.content?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Difficulty filter
    if (selectedLevel && selectedLevel !== "All") {
      filtered = filtered.filter(
        (lesson: any) =>
          lesson.difficulty?.toLowerCase() === selectedLevel.toLowerCase(),
      );
    }

    return filtered;
  }, [lessons, searchQuery, selectedLevel]);

  // Get recommended lessons (randomly pick 3 from filtered)
  const recommendedLessons = useMemo(() => {
    if (!filteredLessons || filteredLessons.length === 0) return [];
    return filteredLessons.sort(() => Math.random() - 0.5).slice(0, 3);
  }, [filteredLessons]);

  // Get continue learning lesson (first in-progress or most recent)
  const continueLearningLesson = useMemo(() => {
    if (!lessons) return null;
    const inProgress = lessons.find((lesson) => {
      const lessonProgress = progress?.find((p) => p.lesson_id === lesson.id);
      return lessonProgress && lessonProgress.status === "in_progress";
    });
    return inProgress || lessons[0];
  }, [lessons, progress]);

  if (isLoading && !propError) {
    // Show loading spinner for max 2 seconds, then show mock lessons
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">No Lessons Available</h2>
          <p className="text-muted-foreground mb-6">
            Lessons are being loaded. Please refresh the page or try again in a
            moment.
          </p>
          <Button onClick={() => window.location.reload()} className="gap-2">
            <span>Refresh Page</span>
          </Button>
        </div>
      </div>
    );
  }

  const isNetworkError =
    propError &&
    (propError.message.includes("Failed to fetch") ||
      propError.message.includes("Network error") ||
      propError.message.includes("Cannot reach Supabase") ||
      propError.message.includes("Loading took too long"));

  return (
    <div className="space-y-8">
      {/* Error Banner - if offline mode */}
      {isNetworkError && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <span className="text-xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
              Offline Mode - Showing Sample Lessons
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-300 mb-3">
              Cannot connect to lesson server. Displaying sample lessons. Check
              your internet connection above or click "Diagnose" for help.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // @ts-ignore
                  if (typeof window.checkSupabaseHealth === "function") {
                    // @ts-ignore
                    window.checkSupabaseHealth();
                  }
                }}
              >
                Diagnose
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Learn</h1>
        <p className="text-lg text-muted-foreground">
          Browse lessons and continue your coding journey
        </p>
      </div>

      {/* Search & Filters Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-elevated/50 border border-border/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all"
          />
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level === "All" ? null : level)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (level === "All" && !selectedLevel) || selectedLevel === level
                  ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30"
                  : "bg-surface-elevated/50 border border-border/50 text-muted-foreground hover:border-brand-primary/50 hover:text-foreground"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Learning Section - Only if lesson exists */}
      {continueLearningLesson && (
        <div className="relative overflow-hidden rounded-2xl border border-brand-primary/20 bg-gradient-to-r from-brand-primary/10 via-purple-500/5 to-brand-secondary/10 p-8 backdrop-blur">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full mix-blend-multiply filter blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/20 rounded-full mix-blend-multiply filter blur-3xl -ml-32 -mb-32"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Continue Learning
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {continueLearningLesson.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {continueLearningLesson.content?.substring(0, 120)}...
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="w-full md:flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {getProgressForLesson(continueLearningLesson.id)}% Complete
                  </span>
                </div>
                <Progress
                  value={getProgressForLesson(continueLearningLesson.id)}
                  className="h-2"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-xl hover:shadow-brand-primary/40 text-white border-0 rounded-lg font-medium flex-shrink-0"
                onClick={() => navigate(`/lesson/${continueLearningLesson.id}`)}
              >
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Course Cards Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Lessons
          </h2>
          {filteredLessons.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filteredLessons.length} lesson
              {filteredLessons.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {filteredLessons.length === 0 ? (
          // Empty State - only show if we've tried to seed and still have no lessons
          <Card className="gradient-card border-card-border bg-surface-elevated/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-muted/20 mb-4">
                <BookOpen className="w-12 h-12 text-muted-foreground opacity-40" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Lessons Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {searchQuery ? (
                  <>
                    No lessons match <strong>"{searchQuery}"</strong>. Try
                    different keywords.
                  </>
                ) : (
                  <>
                    No lessons match your filters. Try adjusting your selection.
                  </>
                )}
              </p>
              {(searchQuery || selectedLevel) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLevel(null);
                  }}
                  className="rounded-lg"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredLessons as any[]).map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                <LessonCard
                  id={lesson.id}
                  title={lesson.title}
                  difficulty={lesson.difficulty}
                  content={lesson.content}
                  progress={getProgressForLesson(lesson.id)}
                  isCompleted={isLessonCompleted(lesson.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Section - Only if recommended lessons exist */}
      {recommendedLessons.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Recommended For You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(recommendedLessons as any[]).map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                <LessonCard
                  id={lesson.id}
                  title={lesson.title}
                  difficulty={lesson.difficulty}
                  content={lesson.content}
                  progress={getProgressForLesson(lesson.id)}
                  isCompleted={isLessonCompleted(lesson.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
