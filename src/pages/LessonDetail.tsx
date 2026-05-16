import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lessonService } from "@/services/lessonService";
import * as progressStore from "@/data/progressStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const LessonDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lessonIdRef = useRef<number | null>(null);

  useEffect(() => {
    loadLesson();

    // Cleanup: save time when user leaves
    return () => {
      if (startTimeRef.current && lessonIdRef.current) {
        saveTimeSpent();
      }
    };
  }, [id]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) throw new Error("No lesson ID provided");

      const lessonId = parseInt(id, 10);
      if (isNaN(lessonId)) throw new Error("Invalid lesson ID");

      // Load lesson (uses local mock data)
      const lessonData = await lessonService.getLesson(lessonId);
      setLesson(lessonData);
      lessonIdRef.current = lessonData.id;

      // Load progress from localStorage
      const progressData = progressStore.getLessonProgress(lessonId);
      setProgress(progressData);

      // Start lesson if not started
      if (!progressData) {
        const newProgress = progressStore.startLesson(lessonId);
        setProgress(newProgress);
      }

      // Start time tracking
      startTimeRef.current = Date.now();
    } catch (err) {
      console.error("Error loading lesson:", err);
      setError(err instanceof Error ? err.message : "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const saveTimeSpent = () => {
    if (!lessonIdRef.current || !startTimeRef.current) return;

    const timeSpentMs = Date.now() - startTimeRef.current;
    const timeSpentMinutes = Math.round(timeSpentMs / 60000);

    if (timeSpentMinutes > 0) {
      try {
        progressStore.updateTimeSpent(lessonIdRef.current, timeSpentMinutes);
        console.log(`✅ Saved ${timeSpentMinutes} minutes`);
      } catch (err) {
        console.error("Error saving time:", err);
      }
    }
  };

  const handleCompleteLesson = () => {
    if (!lesson) return;

    try {
      setMarking(true);
      saveTimeSpent();
      progressStore.completeLesson(lesson.id);
      setProgress(progressStore.getLessonProgress(lesson.id));
      console.log("✅ Lesson completed");
    } catch (err) {
      setError("Failed to complete lesson");
    } finally {
      setMarking(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error && !lesson) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/learn")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learn
          </Button>

          <Card className="border-red-500/30 bg-red-500/10">
            <CardContent className="flex items-center gap-3 py-8">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-400">Error</h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/learn")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learn
          </Button>

          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lesson Not Found</h3>
              <p className="text-muted-foreground text-center mb-6">
                The lesson you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate("/learn")}>
                Back to Lessons
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.status === "completed";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/learn")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>

        {/* Error Toast */}
        {error && (
          <Card className="mb-6 border-red-500/30 bg-red-500/10">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {lesson.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${getDifficultyColor(lesson.difficulty)}`}
                >
                  {lesson.difficulty}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {lesson.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {lesson.description}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm mb-6 md:mb-0">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">⭐</span>
                <span className="text-muted-foreground">{lesson.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            <Card className="gradient-card border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Text */}
                <div className="prose prose-invert max-w-none">
                  {lesson.content
                    ?.split("\n")
                    .map((line: string, idx: number) => {
                      if (line.trim() === "") return null;

                      if (line.startsWith("###")) {
                        return (
                          <h4
                            key={idx}
                            className="text-lg font-bold mt-4 mb-2 text-foreground"
                          >
                            {line.replace("###", "").trim()}
                          </h4>
                        );
                      }

                      if (line.startsWith("##")) {
                        return (
                          <h3
                            key={idx}
                            className="text-xl font-bold mt-4 mb-2 text-foreground"
                          >
                            {line.replace("##", "").trim()}
                          </h3>
                        );
                      }

                      if (line.trimStart().startsWith("-")) {
                        return (
                          <li key={idx} className="ml-6 text-muted-foreground">
                            {line.replace("-", "").trim()}
                          </li>
                        );
                      }

                      if (
                        line.startsWith("function") ||
                        line.startsWith("const") ||
                        line.startsWith("class") ||
                        line.includes("=>") ||
                        line.includes("{") ||
                        line.includes("}")
                      ) {
                        return (
                          <pre
                            key={idx}
                            className="bg-surface-elevated/80 rounded-lg p-4 overflow-x-auto my-2"
                          >
                            <code className="text-sm text-cyan-400 font-mono">
                              {line}
                            </code>
                          </pre>
                        );
                      }

                      return (
                        <p key={idx} className="text-muted-foreground">
                          {line}
                        </p>
                      );
                    })}
                </div>

                {/* Code Block */}
                {lesson.content?.includes("Example") && (
                  <div className="mt-8 pt-8 border-t border-border/50">
                    <h4 className="font-bold text-foreground mb-4">
                      Code Example
                    </h4>
                    <div className="bg-surface-elevated/80 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-cyan-400 font-mono whitespace-pre">
                        {lesson.content?.substring(
                          lesson.content.indexOf("Example:"),
                        )}
                      </code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <Card className="gradient-card border-card-border">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isCompleted ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Completion</span>
                        <span className="text-sm font-bold text-brand-primary">
                          {progress?.score || 0}%
                        </span>
                      </div>
                      <Progress value={progress?.score || 0} className="h-2" />
                    </div>

                    <Button
                      onClick={handleCompleteLesson}
                      disabled={marking}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium"
                    >
                      {marking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-green-400">
                      Lesson Completed!
                    </p>
                    <p className="text-xs text-green-300 mt-1">
                      You earned {lesson.xp} XP
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lesson Info Card */}
            <Card className="gradient-card border-card-border">
              <CardHeader>
                <CardTitle className="text-lg">Lesson Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Category
                  </p>
                  <p className="font-semibold">{lesson.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Difficulty
                  </p>
                  <Badge className={`${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Rewards
                  </p>
                  <p className="font-semibold">⭐ {lesson.xp} XP</p>
                </div>
              </CardContent>
            </Card>

            {/* Continue Button */}
            <Button
              onClick={() => navigate("/learn")}
              variant="outline"
              className="w-full border-border/50 hover:bg-surface-elevated/50"
            >
              Back to Lessons
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
