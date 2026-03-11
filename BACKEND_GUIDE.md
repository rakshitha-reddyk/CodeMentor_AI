# Backend Integration Guide

This document outlines the backend services and utilities built with Supabase and React Query.

## 📂 Architecture Overview

```
src/
├── services/           # Core backend business logic
│   ├── userService.ts          # User authentication & profile management
│   ├── lessonService.ts        # Lesson CRUD operations
│   ├── progressService.ts      # User progress tracking
│   ├── chatService.ts          # Chat history management
│   └── analyticsService.ts     # User analytics & statistics
├── hooks/              # React Query hooks for data fetching
│   ├── useUser.ts             # User-related queries & mutations
│   ├── useLesson.ts           # Lesson-related queries & mutations
│   ├── useProgress.ts         # Progress-related queries & mutations
│   ├── useChat.ts             # Chat-related queries & mutations
│   └── useAnalytics.ts        # Analytics-related queries & mutations
├── contexts/           # React Context for state management
│   └── AuthContext.tsx        # Authentication state provider
├── utils/              # Utility functions
│   ├── supabaseErrors.ts      # Error handling utilities
│   └── backendUtils.ts        # Helper functions
└── integrations/
    └── supabase/
        ├── client.ts          # Supabase client initialization
        └── types.ts           # Generated TypeScript types
```

## 🔐 Authentication

### Setup Auth Provider

Wrap your app with the `AuthProvider`:

```tsx
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{/* Your app */}</AuthProvider>
    </QueryClientProvider>
  );
}
```

### Using Authentication

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { useSignIn, useSignUp } from "@/hooks/useUser";

function LoginForm() {
  const { session, loading } = useAuth();
  const signIn = useSignIn();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn.mutateAsync({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (session) return <div>Welcome {session.user.email}</div>;

  return (
    <button onClick={() => handleLogin("user@example.com", "password")}>
      Sign In
    </button>
  );
}
```

## 📚 Services

### User Service

Manage user accounts and profiles.

```tsx
import {
  useCurrentUser,
  useUserProfile,
  useUpdateUserProfile,
} from "@/hooks/useUser";

function UserProfile() {
  const { data: user } = useCurrentUser();
  const { data: profile } = useUserProfile(user?.id);
  const updateProfile = useUpdateUserProfile();

  const handleUpdate = async (name: string, avatar_url: string) => {
    await updateProfile.mutateAsync({
      userId: user!.id,
      updates: { name, avatar_url },
    });
  };

  return <div>{profile?.name}</div>;
}
```

**Available Methods:**

- `getCurrentUser()` - Get authenticated user
- `getUserProfile(userId)` - Get user profile
- `upsertUserProfile(userId, profile)` - Create or update profile
- `updateUserProfile(userId, updates)` - Update profile
- `signUp(email, password, userData)` - Register new user
- `signIn(email, password)` - Login user
- `signOut()` - Logout user
- `onAuthStateChange(callback)` - Listen to auth changes

### Lesson Service

Manage coding lessons and challenges.

```tsx
import { useAllLessons, useLesson, useCreateLesson } from "@/hooks/useLesson";

function LessonList() {
  const { data: lessons, isLoading } = useAllLessons();
  const createLesson = useCreateLesson();

  const handleCreate = async () => {
    await createLesson.mutateAsync({
      title: "Python Basics",
      content: "...",
      difficulty: "beginner",
    });
  };

  if (isLoading) return <div>Loading lessons...</div>;

  return (
    <div>
      {lessons?.map((lesson) => (
        <div key={lesson.id}>{lesson.title}</div>
      ))}
      <button onClick={handleCreate}>Create Lesson</button>
    </div>
  );
}
```

**Available Methods:**

- `getAllLessons()` - Get all lessons
- `getLessonsByDifficulty(difficulty)` - Filter by difficulty
- `getLesson(id)` - Get single lesson
- `createLesson(lesson)` - Create lesson (admin)
- `updateLesson(id, updates)` - Update lesson (admin)
- `deleteLesson(id)` - Delete lesson (admin)

### Progress Service

Track user progress on lessons.

```tsx
import { useUserProgress, useCompleteLesson } from "@/hooks/useProgress";

function LessonLearner() {
  const userId = "user-123";
  const { data: progress } = useUserProgress(userId);
  const completeLesson = useCompleteLesson();

  const handleComplete = async (lessonId: number, score: number) => {
    await completeLesson.mutateAsync({ userId, lessonId, score });
  };

  return (
    <div>
      {progress?.map((p) => (
        <div key={p.id}>
          Lesson {p.lesson_id}: {p.status} ({p.score}%)
        </div>
      ))}
    </div>
  );
}
```

**Available Methods:**

- `getUserLessonProgress(userId, lessonId)` - Get progress on specific lesson
- `getUserProgress(userId)` - Get all user progress
- `getLessonProgress(lessonId)` - Get progress stats for lesson
- `saveProgress(progress)` - Save/update progress
- `completeLesson(userId, lessonId, score)` - Mark lesson complete
- `startLesson(userId, lessonId)` - Mark lesson in progress
- `deleteProgress(id)` - Delete progress entry

### Chat Service

Manage AI chat history.

```tsx
import { useRecentMessages, useSaveMessage } from "@/hooks/useChat";

function ChatWidget() {
  const userId = "user-123";
  const { data: messages } = useRecentMessages(userId);
  const saveMessage = useSaveMessage();

  const handleSendMessage = async (message: string) => {
    await saveMessage.mutateAsync({
      userId,
      message,
      role: "user",
    });
  };

  return (
    <div>
      {messages?.map((msg) => (
        <div key={msg.id}>{msg.message}</div>
      ))}
      <input onSubmit={(e) => handleSendMessage(e.target.value)} />
    </div>
  );
}
```

**Available Methods:**

- `getUserChatHistory(userId, limit)` - Get chat history
- `getRecentMessages(userId, limit)` - Get recent messages
- `saveMessage(userId, message, role)` - Save chat message
- `deleteMessage(id)` - Delete message
- `clearUserChatHistory(userId)` - Clear all messages
- `getChatContext(userId, messageLimit)` - Get formatted context for AI

### Analytics Service

Track user learning statistics.

```tsx
import { useUserAnalytics, useTopLearners } from "@/hooks/useAnalytics";

function Analytics() {
  const userId = "user-123";
  const { data: analytics } = useUserAnalytics(userId);
  const { data: topLearners } = useTopLearners(10);

  return (
    <div>
      <p>Lessons Completed: {analytics?.total_lessons_completed}</p>
      <p>Time Spent: {analytics?.total_time_spent} minutes</p>
      {topLearners?.map((learner) => (
        <div key={learner.id}>{learner.name}</div>
      ))}
    </div>
  );
}
```

**Available Methods:**

- `getUserAnalytics(userId)` - Get user stats
- `updateAnalytics(userId, updates)` - Update stats
- `recordLessonCompletion(userId)` - Increment completed lessons
- `updateTimeSpent(userId, timeInMinutes)` - Add time spent
- `updateLastActive(userId)` - Update last active timestamp
- `getAllAnalytics()` - Get all users' stats (admin)
- `getTopLearners(limit)` - Get leaderboard

## 🎣 Custom Hooks

All services have corresponding React Query hooks:

### Query Hooks (Read Data)

- `useCurrentUser()` - Current auth user
- `useUserProfile(userId)` - User profile data
- `useAllLessons()` - All lessons
- `useLesson(id)` - Single lesson
- `useUserProgress(userId)` - User's all progress
- `useUserLessonProgress(userId, lessonId)` - Specific lesson progress
- `useUserChatHistory(userId)` - Chat messages
- `useUserAnalytics(userId)` - User statistics

### Mutation Hooks (Write Data)

- `useUpdateUserProfile()` - Update profile
- `useSignUp()` - Register user
- `useSignIn()` - Login user
- `useSignOut()` - Logout user
- `useCreateLesson()` - Create lesson
- `useUpdateLesson()` - Update lesson
- `useDeleteLesson()` - Delete lesson
- `useSaveProgress()` - Save progress
- `useCompleteLesson()` - Mark lesson complete
- `useSaveMessage()` - Save chat message
- `useRecordLessonCompletion()` - Record completion

## 🛠️ Utility Functions

### Backend Utils

```tsx
import { backendUtils } from "@/utils/backendUtils";

// Check authentication
const isAuth = await backendUtils.isAuthenticated();

// Get current user ID
const userId = await backendUtils.getCurrentUserId();

// Calculate stats from analytics data
const stats = backendUtils.calculateStats(analytics, progress);

// Format time
backendUtils.formatTimeSpent(150); // "2h 30m"

// Validate email
backendUtils.isValidEmail("user@example.com"); // true

// Validate password strength
const validation = backendUtils.validatePasswordStrength("password123");
// { isStrong: false, feedback: ["..."] }

// Get difficulty styling
backendUtils.getDifficultyColor("advanced"); // "text-red-500"
backendUtils.getDifficultyBadgeVariant("expert"); // "outline"
```

### Error Handling

```tsx
import { formatSupabaseError, SupabaseError } from "@/utils/supabaseErrors";

try {
  await userService.getUserProfile("user-id");
} catch (error) {
  const message = formatSupabaseError(error);
  console.error(message);
}
```

## 📦 Data Models

### User

```ts
{
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}
```

### Lesson

```ts
{
  id: number;
  title: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  created_at: string;
}
```

### Progress

```ts
{
  id: number;
  user_id: string;
  lesson_id: number;
  status: "not_started" | "in_progress" | "completed";
  score: number; // 0-100
  updated_at: string;
}
```

### Analytics

```ts
{
  id: number;
  user_id: string;
  total_lessons_completed: number;
  total_time_spent: number; // minutes
  last_active: string;
}
```

### Chat Message

```ts
{
  id: number;
  user_id: string;
  message: string;
  role: "user" | "assistant";
  created_at: string;
}
```

## 🔄 Best Practices

1. **Always use hooks in React components** - Never call services directly in components
2. **Handle loading and error states** - useQuery returns `isLoading` and `isError`
3. **Invalidate queries after mutations** - Hooks automatically do this
4. **Protect routes with auth** - Check `session` from `useAuth()` or `useCurrentUser()`
5. **Use debouncing for frequent updates** - See `backendUtils.debounce`
6. **Validate input data** - Use utilities in `backendUtils`
7. **Handle errors gracefully** - Use `formatSupabaseError` for user-friendly messages

## Example: Complete Feature

```tsx
import { useCurrentUser } from "@/hooks/useUser";
import { useAllLessons, useLesson } from "@/hooks/useLesson";
import { useCompleteLesson, useUserProgress } from "@/hooks/useProgress";
import { useRecordLessonCompletion } from "@/hooks/useAnalytics";
import { backendUtils } from "@/utils/backendUtils";

export function CourseLearning() {
  const { data: user } = useCurrentUser();
  const { data: lessons, isLoading } = useAllLessons();
  const { data: userProgress } = useUserProgress(user?.id);
  const completeLesson = useCompleteLesson();
  const recordCompletion = useRecordLessonCompletion();

  const handleLessonComplete = async (lessonId: number, score: number) => {
    if (!user) return;

    try {
      // Save progress
      await completeLesson.mutateAsync({
        userId: user.id,
        lessonId,
        score,
      });

      // Record in analytics
      await recordCompletion.mutateAsync(user.id);

      // Show success
      toast.success("Lesson completed!");
    } catch (error) {
      toast.error(backendUtils.formatTimeSpent(error));
    }
  };

  if (isLoading) return <div>Loading lessons...</div>;

  return (
    <div>
      {lessons?.map((lesson) => {
        const progress = userProgress?.find((p) => p.lesson_id === lesson.id);
        return (
          <div key={lesson.id}>
            <h3>{lesson.title}</h3>
            <span
              className={backendUtils.getDifficultyColor(lesson.difficulty)}
            >
              {lesson.difficulty}
            </span>
            <button onClick={() => handleLessonComplete(lesson.id, 85)}>
              Complete Lesson
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Types](./src/integrations/supabase/types.ts)
- [Client Configuration](./src/integrations/supabase/client.ts)
