# 🚀 Backend Integration Quick Start Guide

## Setup Instructions

### Step 1: Update Your App Configuration

Update your `src/main.tsx` to use the new providers:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "@/config/providers";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
```

### Step 2: Remove Duplicate Supabase Client

Choose one of:

- Option A: Keep using `src/integrations/supabase/client.ts` (recommended - has TypeScript types)
- Option B: Delete `src/supabaseClient.js` and update imports

If you choose Option A, update imports anywhere using the old client:

```tsx
// Old ❌
import { supabase } from "@/supabaseClient.js";

// New ✅
import { supabase } from "@/integrations/supabase/client";
```

### Step 3: Start Using Backend Services

Pick a component and add backend functionality:

#### Example: Add Authentication to Your App

```tsx
// src/App.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useUser";

export default function App() {
  const { session, loading } = useAuth();
  const { data: user } = useCurrentUser();

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <Dashboard />
    </div>
  );
}
```

#### Example: Display Lessons

```tsx
// src/components/LessonsList.tsx
import { useAllLessons } from "@/hooks/useLesson";

export function LessonsList() {
  const { data: lessons, isLoading, error } = useAllLessons();

  if (isLoading) return <div>Loading lessons...</div>;
  if (error) return <div>Failed to load lessons</div>;

  return (
    <div className="grid gap-4">
      {lessons?.map((lesson) => (
        <div key={lesson.id} className="border p-4 rounded-lg">
          <h3 className="font-bold">{lesson.title}</h3>
          <p className="text-sm text-gray-600">{lesson.difficulty}</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Start Lesson
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### Example: Track Progress

```tsx
// src/components/LessonViewer.tsx
import { useCompleteLesson } from "@/hooks/useProgress";
import { useCurrentUser } from "@/hooks/useUser";
import { useRecordLessonCompletion } from "@/hooks/useAnalytics";

export function LessonViewer({ lessonId }: { lessonId: number }) {
  const { data: user } = useCurrentUser();
  const completeLesson = useCompleteLesson();
  const recordCompletion = useRecordLessonCompletion();

  const handleComplete = async (score: number) => {
    if (!user) return;

    // Save progress
    await completeLesson.mutateAsync({
      userId: user.id,
      lessonId,
      score,
    });

    // Update analytics
    await recordCompletion.mutateAsync(user.id);

    console.log("✅ Lesson completed!");
  };

  return (
    <div className="p-6">
      <h2>Lesson Content</h2>
      <button
        onClick={() => handleComplete(85)}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Complete Lesson (Score: 85%)
      </button>
    </div>
  );
}
```

## 📁 File Structure Created

```
src/
├── services/
│   ├── userService.ts          ✅ User authentication & profiles
│   ├── lessonService.ts        ✅ Lesson management
│   ├── progressService.ts      ✅ Progress tracking
│   ├── chatService.ts          ✅ Chat history
│   └── analyticsService.ts     ✅ Analytics & statistics
│
├── hooks/
│   ├── useUser.ts              ✅ User queries & mutations
│   ├── useLesson.ts            ✅ Lesson queries & mutations
│   ├── useProgress.ts          ✅ Progress queries & mutations
│   ├── useChat.ts              ✅ Chat queries & mutations
│   └── useAnalytics.ts         ✅ Analytics queries & mutations
│
├── contexts/
│   └── AuthContext.tsx         ✅ Auth state management
│
├── config/
│   └── providers.tsx           ✅ App-wide provider setup
│
├── utils/
│   ├── supabaseErrors.ts       ✅ Error handling
│   └── backendUtils.ts         ✅ Helper utilities
│
├── examples/
│   └── BackendIntegrationExamples.tsx  ✅ Usage examples
│
└── integrations/supabase/
    ├── client.ts               ✅ Supabase client
    └── types.ts                ✅ TypeScript types
```

## 🔑 Key Features

### ✅ User Authentication

- Sign up, sign in, sign out
- Persistent sessions
- Profile management
- Type-safe auth context

### ✅ Lesson Management

- Fetch lessons by difficulty
- Create/update/delete (admin)
- Full CRUD operations

### ✅ Progress Tracking

- Track lesson completion
- Store scores
- Get user progress analytics
- Leaderboards

### ✅ Chat History

- Save chat messages
- Get chat context for AI
- Clear history
- Message management

### ✅ Analytics

- Track time spent
- Completion statistics
- Leaderboards
- User engagement metrics

### ✅ Developer Experience

- React Query for caching & sync
- Custom hooks for all operations
- Type-safe Supabase integration
- Error handling utilities
- Example implementations

## 🎯 Common Tasks

### Get Current User

```tsx
const { data: user } = useCurrentUser();
const userId = user?.id;
```

### Load User Progress

```tsx
const { data: progress, isLoading } = useUserProgress(userId);
```

### Complete a Lesson

```tsx
const completLesson = useCompleteLesson();
await completeLesson.mutateAsync({
  userId,
  lessonId: 5,
  score: 95,
});
```

### Save Chat Message

```tsx
const saveMessage = useSaveMessage();
await saveMessage.mutateAsync({
  userId,
  message: "How do I learn Python?",
  role: "user",
});
```

### Get User Statistics

```tsx
const { data: analytics } = useUserAnalytics(userId);
console.log(`Lessons completed: ${analytics?.total_lessons_completed}`);
```

### Get Top Learners

```tsx
const { data: topLearners } = useTopLearners(10);
```

## 🐛 Debugging

### Enable React Query DevTools

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Check Supabase Connection

```tsx
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

useEffect(() => {
  supabase
    .from("lessons")
    .select("count")
    .then((res) => {
      console.log("✅ Supabase connected:", res);
    });
}, []);
```

### Monitor Data Loading

```tsx
const { data, isLoading, isError, error } = useUserProgress(userId);

console.log("Loading:", isLoading);
console.log("Error:", error?.message);
console.log("Data:", data);
```

## 📊 Database Schema Reference

### Users Table

- `id` (UUID) - User ID from auth
- `email` - User email
- `name` - Display name
- `avatar_url` - Profile picture URL
- `created_at` - Account creation date

### Lessons Table

- `id` (Serial) - Lesson ID
- `title` - Lesson title
- `content` - Lesson markdown content
- `difficulty` - beginner | intermediate | advanced | expert
- `created_at` - Creation timestamp

### Progress Table

- `id` (Serial) - Progress record ID
- `user_id` - FK to users
- `lesson_id` - FK to lessons
- `status` - not_started | in_progress | completed
- `score` - Achievement score (0-100)
- `updated_at` - Last update timestamp

### Chat History Table

- `id` (Serial) - Message ID
- `user_id` - FK to users
- `message` - Message content
- `role` - user | assistant
- `created_at` - Message timestamp

### Analytics Table

- `id` (Serial) - Analytics record ID
- `user_id` - FK to users
- `total_lessons_completed` - Count of completed lessons
- `total_time_spent` - Total minutes spent learning
- `last_active` - Last activity timestamp

## 🚨 Troubleshooting

### "useAuth must be used within AuthProvider"

✅ Make sure `AppProviders` wraps your app in `main.tsx`

### Queries returning undefined

✅ Check if `enabled` param is correct and parent data is loaded

### Mutations not updating UI

✅ React Query queries automatically invalidate and refetch

### TypeScript errors with Database types

✅ Run `supabase gen types` to regenerate types.ts

### 404 errors from Supabase

✅ Verify database tables exist in Supabase dashboard

## 🎓 Next Steps

1. ✅ Set up providers in your app
2. ✅ Review examples in `src/examples/`
3. ✅ Add authentication to your app
4. ✅ Create a lessons page
5. ✅ Add progress tracking
6. ✅ Implement chat widget
7. ✅ Build analytics dashboard

## 📖 Full Documentation

See [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for comprehensive documentation on all services, hooks, and utilities.

---

**Ready to go?** Copy one of the example components and adapt it to your needs! 🎉
