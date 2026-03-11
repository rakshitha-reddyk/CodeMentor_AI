import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Search,
  Clock,
  Play,
  ChevronRight,
  Star,
  Zap,
  Filter,
  Sparkles,
  ArrowRight,
  Code,
} from "lucide-react";
import type { Lesson } from "@/services/lessonService";

interface LearnProps {
  lessons: Lesson[] | undefined;
  progress: any[] | undefined;
  isLoading?: boolean;
}

const Learn: React.FC<LearnProps> = ({
  lessons = [],
  progress = [],
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterMobile, setShowFilterMobile] = useState(false);

  // Filter levels and categories
  const levels = ["All", "Beginner", "Intermediate", "Advanced", "Completed"];
  const categories = [
    "JavaScript",
    "React",
    "Python",
    "DSA",
    "AI",
    "Web Dev",
  ];

  // Get user progress for a lesson
  const getProgressForLesson = (lessonId: number) => {
    const lessonProgress = progress?.find((p) => p.lesson_id === lessonId);
    return lessonProgress?.score || 0;
  };

  // Get completion status
  const isLessonCompleted = (lessonId: number) => {
    const lessonProgress = progress?.find((p) => p.lesson_id === lessonId);
    return lessonProgress?.status === "completed";
  };

  // Filter lessons based on search and filters
  const filteredLessons = useMemo(() => {
    let filtered = lessons || [];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.content?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Level filter
    if (selectedLevel && selectedLevel !== "All") {
      if (selectedLevel === "Completed") {
        filtered = filtered.filter((lesson) =>
          isLessonCompleted(lesson.id),
        );
      } else {
        filtered = filtered.filter(
          (lesson) =>
            lesson.difficulty?.toLowerCase() ===
            selectedLevel.toLowerCase(),
        );
      }
    }

    return filtered;
  }, [lessons, searchQuery, selectedLevel]);

  // Get recommended lessons (randomly pick 3 from filtered)
  const recommendedLessons = useMemo(() => {
    if (!filteredLessons || filteredLessons.length === 0)
      return [];
    return filteredLessons
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [filteredLessons]);

  // Get continue learning lesson (first in-progress or most recent)
  const continueLearningLesson = useMemo(() => {
    if (!lessons) return null;
    const inProgress = lessons.find((lesson) => {
      const lessonProgress = progress?.find(
        (p) => p.lesson_id === lesson.id,
      );
      return (
        lessonProgress && lessonProgress.status === "in_progress"
      );
    });
    return inProgress || lessons[0];
  }, [lessons, progress]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
                (level === "All" && !selectedLevel) ||
                selectedLevel === level
                  ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30"
                  : "bg-surface-elevated/50 border border-border/50 text-muted-foreground hover:border-brand-primary/50 hover:text-foreground"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Category Tabs - Desktop */}
        <div className="hidden md:flex gap-2 pb-2 border-b border-border/50">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(
                selectedCategory === category ? null : category,
              )}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                selectedCategory === category
                  ? "text-brand-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
              {selectedCategory === category && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Category Tabs - Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setShowFilterMobile(!showFilterMobile)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-sm font-medium hover:border-brand-primary/50"
          >
            <Filter className="w-4 h-4" />
            Categories
          </button>
          {showFilterMobile && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(
                      selectedCategory === category ? null : category,
                    );
                    setShowFilterMobile(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/50"
                      : "bg-surface-elevated/50 border border-border/50 text-muted-foreground hover:border-brand-primary/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
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
                    {getProgressForLesson(continueLearningLesson.id)}%
                    Complete
                  </span>
                </div>
                <Progress
                  value={getProgressForLesson(continueLearningLesson.id)}
                  className="h-2"
                />
              </div>
              <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-xl hover:shadow-brand-primary/40 text-white border-0 rounded-lg font-medium flex-shrink-0">
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
              {filteredLessons.length} lesson{filteredLessons.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {!filteredLessons || filteredLessons.length === 0 ? (
          // Empty State
          <Card className="gradient-card border-card-border bg-surface-elevated/30">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-muted/20 mb-4">
                <BookOpen className="w-12 h-12 text-muted-foreground opacity-40" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Lessons Found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {searchQuery ? (
                  <>
                    No lessons match your search. Try different keywords or
                    explore all lessons.
                  </>
                ) : (
                  <>
                    Browse our curated collection of coding lessons or check
                    back soon for more content.
                  </>
                )}
              </p>
              {searchQuery && (
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
            {filteredLessons.map((lesson) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const progressValue = getProgressForLesson(lesson.id);

              return (
                <div key={lesson.id}>
                  <Card className="gradient-card border-card-border hover:shadow-card hover:border-brand-primary/30 transition-all duration-300 group flex flex-col h-full overflow-hidden">
                    {/* Card Header with Icon */}
                    <div className="h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors flex items-center justify-center border-b border-border/50">
                      <div className="p-3 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                        <Code className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>

                    <CardContent className="pt-6 flex-1 flex flex-col">
                      {/* Title and Badge */}
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors line-clamp-2 flex-1">
                          {lesson.title}
                        </h3>
                        {isCompleted && (
                          <Star className="w-5 h-5 text-brand-warning flex-shrink-0 fill-brand-warning" />
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                        {lesson.content?.substring(0, 80)}...
                      </p>

                      {/* Level Badge */}
                      <div className="mb-4 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${
                            lesson.difficulty?.toLowerCase() === "advanced"
                              ? "border-red-500/30 text-red-400"
                              : lesson.difficulty?.toLowerCase() ===
                                  "intermediate"
                                ? "border-yellow-500/30 text-yellow-400"
                                : "border-green-500/30 text-green-400"
                          }`}
                        >
                          {lesson.difficulty || "Beginner"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          12 min
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {!isCompleted && (
                        <div className="mb-4 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">Progress</span>
                            <span className="text-muted-foreground">
                              {progressValue}%
                            </span>
                          </div>
                          <Progress value={progressValue} className="h-1.5" />
                        </div>
                      )}
                      {isCompleted && (
                        <div className="mb-4 px-3 py-2 bg-brand-success/10 border border-brand-success/20 rounded-lg text-center">
                          <p className="text-xs font-semibold text-brand-success">
                            ✓ Completed
                          </p>
                        </div>
                      )}

                      {/* Start Button */}
                      <Button className="w-full bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary/90 hover:to-brand-primary/70 text-white border-0 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all rounded-lg font-medium group/btn">
                        {isCompleted ? "Review" : "Start"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
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
            {recommendedLessons.map((lesson) => (
              <div key={lesson.id}>
                <Card className="gradient-card border border-amber-500/20 hover:shadow-card hover:border-amber-500/40 transition-all duration-300 group flex flex-col h-full overflow-hidden relative">
                  {/* Recommended Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs font-semibold">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>

                  {/* Card Header with Icon */}
                  <div className="h-16 bg-gradient-to-r from-amber-500/10 to-orange-500/10 group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-colors flex items-center justify-center border-b border-border/50">
                    <div className="p-3 rounded-lg bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>

                  <CardContent className="pt-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg font-bold group-hover:text-orange-400 transition-colors line-clamp-2 mb-3">
                      {lesson.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                      {lesson.content?.substring(0, 80)}...
                    </p>

                    {/* Level Badge */}
                    <div className="mb-4 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold ${
                          lesson.difficulty?.toLowerCase() === "advanced"
                            ? "border-red-500/30 text-red-400"
                            : lesson.difficulty?.toLowerCase() ===
                                "intermediate"
                              ? "border-yellow-500/30 text-yellow-400"
                              : "border-green-500/30 text-green-400"
                        }`}
                      >
                        {lesson.difficulty || "Beginner"}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        12 min
                      </span>
                    </div>

                    {/* Start Button */}
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all rounded-lg font-medium group/btn">
                      Start Learning
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
