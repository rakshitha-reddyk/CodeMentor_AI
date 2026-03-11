/**
 * Backend Integration Examples
 *
 * This file demonstrates how to use the backend services and hooks
 * in your React components. Copy and adapt these examples for your needs.
 */

import React from "react";

// ============================================================================
// EXAMPLE 1: User Authentication
// ============================================================================

import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser, useSignIn, useSignUp } from "@/hooks/useUser";

export function AuthenticationExample() {
  const { session, signOut } = useAuth();
  const { data: user } = useCurrentUser();
  const signIn = useSignIn();
  const signUp = useSignUp();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn.mutateAsync({ email, password });
      console.log("✅ Login successful");
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await signUp.mutateAsync({ email, password });
      console.log("✅ Registration successful");
    } catch (error) {
      console.error("❌ Registration failed:", error);
    }
  };

  if (!session) {
    return (
      <div>
        <button onClick={() => handleLogin("user@example.com", "password123")}>
          Login
        </button>
        <button
          onClick={() => handleRegister("newuser@example.com", "password123")}
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Display Lessons
// ============================================================================

import { useAllLessons, useLesson } from "@/hooks/useLesson";
import { Badge } from "@/components/ui/badge";
import { backendUtils } from "@/utils/backendUtils";

export function LessonListExample() {
  const { data: lessons, isLoading, error } = useAllLessons();

  if (isLoading) return <div>Loading lessons...</div>;
  if (error) return <div>Error loading lessons</div>;

  return (
    <div className="space-y-4">
      {lessons?.map((lesson) => (
        <div key={lesson.id} className="border p-4 rounded">
          <h3 className="font-bold">{lesson.title}</h3>
          <Badge
            variant={backendUtils.getDifficultyBadgeVariant(lesson.difficulty!)}
          >
            {lesson.difficulty}
          </Badge>
          <p className="text-sm text-gray-600 mt-2">
            {lesson.content?.substring(0, 100)}...
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: User Progress Tracking
// ============================================================================

import { useUserProgress, useCompleteLesson } from "@/hooks/useProgress";
import { Progress } from "@/components/ui/progress";

export function ProgressTrackingExample() {
  const { data: user } = useCurrentUser();
  const { data: progress } = useUserProgress(user?.id);
  const completeLesson = useCompleteLesson();

  const handleCompleteLesson = async (lessonId: number) => {
    if (!user) return;

    try {
      await completeLesson.mutateAsync({
        userId: user.id,
        lessonId,
        score: 85,
      });
      console.log("✅ Lesson marked as complete");
    } catch (error) {
      console.error("❌ Error completing lesson:", error);
    }
  };

  const stats = backendUtils.calculateStats(null, progress || []);

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded border">
          <div className="text-2xl font-bold">
            {stats?.completedLessons ?? 0}
          </div>
          <div className="text-sm text-gray-600">Lessons Completed</div>
        </div>
        <div className="bg-white p-4 rounded border">
          <div className="text-2xl font-bold">
            {stats?.completionRate ?? 0}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>

      {/* Progress by Lesson */}
      <div className="space-y-4">
        {progress?.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Lesson {p.lesson_id}</span>
              <Badge>{p.status}</Badge>
            </div>
            {p.status === "completed" && (
              <Progress value={p.score || 0} className="h-2" />
            )}
            {p.status !== "completed" && (
              <button
                onClick={() => handleCompleteLesson(p.lesson_id!)}
                className="text-sm text-blue-600 hover:underline"
              >
                Complete Lesson
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Chat Integration
// ============================================================================

import { useRecentMessages, useSaveMessage } from "@/hooks/useChat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatIntegrationExample() {
  const { data: user } = useCurrentUser();
  const { data: messages } = useRecentMessages(user?.id);
  const saveMessage = useSaveMessage();
  const [input, setInput] = React.useState("");

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;

    try {
      await saveMessage.mutateAsync({
        userId: user.id,
        message: input,
        role: "user",
      });
      setInput("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 ml-auto text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} disabled={!input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Analytics Dashboard
// ============================================================================

import { useUserAnalytics, useTopLearners } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsDashboardExample() {
  const { data: user } = useCurrentUser();
  const { data: analytics } = useUserAnalytics(user?.id);
  const { data: topLearners } = useTopLearners(5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Lessons Completed:</span>
            <span className="font-bold">
              {analytics?.total_lessons_completed || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Time Spent:</span>
            <span className="font-bold">
              {backendUtils.formatTimeSpent(analytics?.total_time_spent || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Active:</span>
            <span className="font-bold">
              {analytics?.last_active
                ? new Date(analytics.last_active).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Top Learners</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {topLearners?.map((learner, index) => (
              <li key={learner.id} className="flex justify-between">
                <span>
                  {index + 1}. {/* @ts-ignore */}
                  {learner.users?.name || "Anonymous"}
                </span>
                <span className="font-bold">
                  {learner.total_lessons_completed}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Combined Learning Interface
// ============================================================================

export function CompleteLearningInterface() {
  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <AuthenticationExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Available Lessons</h2>
        <LessonListExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <ProgressTrackingExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">AI Tutor Chat</h2>
        <ChatIntegrationExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <AnalyticsDashboardExample />
      </section>
    </div>
  );
}

/**
 * Export all examples for reference
 */
export const EXAMPLES = {
  Auth: AuthenticationExample,
  Lessons: LessonListExample,
  Progress: ProgressTrackingExample,
  Chat: ChatIntegrationExample,
  Analytics: AnalyticsDashboardExample,
  Complete: CompleteLearningInterface,
};
