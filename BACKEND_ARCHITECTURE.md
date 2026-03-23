# CodeMentor AI - Backend Services Architecture

## Overview

This document describes the complete backend services architecture for CodeMentor AI challenge system. The system is designed to be production-ready with a mock database for development and easy integration with real backends.

## Architecture Layers

```
React Components (UI)
         ↓
   Custom Hooks (useDatabase, useUserData, etc.)
         ↓
   API Factory (APIFactory)
         ↓
   API Implementations (MockAPI / RemoteAPI)
         ↓
   Service Layer (MockDatabase, AIMentorService, etc.)
         ↓
   Data Layer (localStorage for Mock, HTTP for Remote)
```

## Core Services

### 1. **MockDatabase** (`services/mockDatabase.ts`)

Complete in-memory + localStorage database implementation.

**Key Methods:**

- User Management: `getOrCreateUser()`, `getUser()`, `updateUserPoints()`
- Streak System: `getOrCreateStreak()`, `updateStreak()`
- Progress Tracking: `getUserProgress()`, `updateSkillProgress()`
- Scoring: `saveChallengeScore()`, `getBestScore()`
- History: `saveChallengeAttempt()`, `getUserChallengeHistory()`
- Daily Tracking: `markDailyCompleted()`, `isDailyCompleted()`

### 2. **AIMentorService** (`services/aiMentorService.ts`)

Context-aware AI responses adapted to challenge type and difficulty.

**Key Methods:**

- `getHint(challenge, userCode?)` - Tactical hints
- `getExplanation(challenge)` - Problem breakdown
- `getApproach(challenge)` - Step-by-step strategy
- `debugCode(challenge, userCode)` - Code analysis
- `optimizeCode(challenge, userCode)` - Performance optimization

### 3. **ScoringSystem** (`services/scoringSystem.ts`)

Point calculation with bonuses, level progression, and performance metrics.

**Key Methods:**

- `calculateTotalScore()` - Base score + time bonus + difficulty multiplier
- `calculateAccuracy()` - Test pass percentage
- `getPerformanceRating()` - Perfect/Great/Good/Fair/Poor
- `calculateLevel()` - Level based on total points (1 level per 500 points)
- `getStreakBonus()` - Extra points for consecutive days
- `getDailyBonus()` - 15% bonus for daily completion

### 4. **StreakSystem** (`services/streakSystem.ts`)

Daily streak management with milestone tracking.

**Key Methods:**

- `updateStreak()` - Increment or reset based on daily play
- `getTodayDate()` - Consistent date format (YYYY-MM-DD)
- `getStreakStatus()` - Current status message
- `formatStreak()` - Ready-to-display format with emoji
- `getDaysUntilBreak()` - Time remaining to maintain streak

### 5. **API Factory** (`services/api.ts`)

Dependency injection pattern for seamless mock ↔ remote switching.

**Architecture:**

```typescript
// Initialize (automatically uses mock)
APIFactory.initialize("mock");

// Later, switch to backend without code changes
APIFactory.switchToRemote("https://api.mybackend.com");

// Use the same API everywhere
const api = APIFactory.getInstance();
await api.getUser(userId); // Works with either implementation
```

## Custom Hooks

### Database Hooks (`hooks/useDatabase.ts`)

#### `useUserData()`

Manages user profile and statistics.

```typescript
const {
  user,
  loading,
  error,
  refetchUser,
  addPoints,
  incrementChallengesSolved,
} = useUserData();

// Access user data
console.log(
  user?.totalPoints,
  user?.currentStreak,
  user?.totalChallengesSolved,
);

// Update points
await addPoints(100);

// Increment challenges solved
await incrementChallengesSolved();

// Refresh user data
await refetchUser();
```

#### `useUserStreak()`

Manages daily streak tracking.

```typescript
const { streak, loading, updateStreak } = useUserStreak();

// Access streak data
console.log(
  streak?.currentStreak,
  streak?.longestStreak,
  streak?.lastCompletedDate,
);

// Update streak after challenge completion
const result = await updateStreak();
console.log(result.message); // "🔥 7 day streak!"
```

#### `useUserProgress(skillCategory)`

Tracks skill progression per category.

```typescript
const { progress, loading, updateProgress } = useUserProgress("Arrays");

// Access progress
console.log(
  progress?.level,
  progress?.pointsInLevel,
  progress?.skillsPracticed,
);

// Update after completing challenge
await updateProgress(100, true); // 100 points, challenge passed
```

#### `useUserScores(challengeId?)`

Manages individual challenge scores.

```typescript
const { scores, bestScore, saveScore } = useUserScores("2sum");

// Access scores
console.log(bestScore?.score, bestScore?.accuracy, bestScore?.timeSpent);

// Save new score
await saveScore(scoreObject);
```

#### `useChallengeHistory(limit?)`

Retrieves challenge attempt history.

```typescript
const { history, loading, refetch } = useChallengeHistory(10);

// Access past attempts
history.forEach((attempt) => {
  console.log(attempt.challengeId, attempt.language, attempt.passed);
});
```

## Challenge Data System

### Challenge Database (`data/challengeDataExpanded.ts`)

**13 Production Challenges Across 7 Categories:**

- Strings: 2 challenges
- Arrays: 2 challenges
- Stack: 2 challenges
- HashMap: 2 challenges
- Dynamic Programming: 2 challenges
- Searching: 1 challenge
- Numbers: 2 challenges

**Daily Challenge Rotation:**

```typescript
import { getDailyChallenge } from "@/data/challengeDataExpanded";

// Get today's challenge (same for all users)
const challenge = getDailyChallenge(new Date());

// Challenge changes daily automatically
// No manual refresh needed - algorithm is deterministic
```

**Challenge Properties:**

- `id` - Unique identifier
- `title` - Challenge name
- `difficulty` - Easy/Medium/Hard
- `points` - Base points (100-200)
- `timeLimit` - Minutes (20-45)
- `categories` - Skill tags
- `hints` - 3-5 tactical hints
- `approach` - Solution strategy
- `testCases` - 5-10 test cases
- `languages` - JavaScript, TypeScript, Python, etc.

## Integration Guide

### Step 1: Initialize User in Challenge Component

```typescript
import { useUserData } from "@/hooks/useDatabase";

export function ChallengePage() {
  const { user, loading, addPoints } = useUserData();

  useEffect(() => {
    if (!user) {
      console.log("User initialized");
    }
  }, [user]);
}
```

### Step 2: Handle Challenge Submission

```typescript
const handleSubmit = async (code: string) => {
  // Calculate score
  const scoreData = ScoringSystem.calculateTotalScore(
    challenge,
    testsPassed,
    totalTests,
    timeSpentSeconds,
  );

  // Save attempt
  await MockDatabase.saveChallengeAttempt({
    id: crypto.randomUUID(),
    userId: user.id,
    challengeId: challenge.id,
    code,
    language: selectedLanguage,
    passed: scoreData.accuracy === 100,
    score: scoreData.score,
    accuracy: scoreData.accuracy,
    timeSpent: timeSpentSeconds,
    timestamp: new Date().toISOString(),
  });

  // Update user
  await addPoints(scoreData.score);

  // Update streak
  const streakResult = await updateStreak();

  // Update skill progress
  await updateProgress(scoreData.score, scoreData.accuracy === 100);
};
```

### Step 3: AI Mentor Integration

```typescript
import AIMentorService from "@/services/aiMentorService";

const handleGetHint = async () => {
  const hint = AIMentorService.getHint(challenge, userCode);
  setAiResponse(hint);
};

const handleDebugCode = async () => {
  const feedback = AIMentorService.debugCode(challenge, userCode);
  setAiResponse(feedback);
};
```

### Step 4: Display User Stats

```typescript
import { useUserData } from '@/hooks/useDatabase';

export function UserStats() {
  const { user } = useUserData();

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div>Level: {ScoringSystem.calculateLevel(user.totalPoints)}</div>
      <div>Points: {user.totalPoints}</div>
      <div>Streak: 🔥 {user.currentStreak} days</div>
      <div>Solved: {user.totalChallengesSolved}</div>
    </div>
  );
}
```

## Backend Integration

### Switching from Mock to Real Backend

```typescript
// In your app initialization (App.tsx)
import { APIFactory } from "@/services/api";

// Development: Use mock
if (import.meta.env.DEV) {
  APIFactory.initialize("mock");
}

// Production: Use real backend
if (import.meta.env.PROD) {
  APIFactory.initialize("remote", "https://api.myapp.com");
}
```

### Implementing Remote API

Create `services/remoteAPI.ts`:

```typescript
// Use the RemoteAPI template from api.ts
// Implement with your Supabase, Firebase, or REST endpoints
```

**Example with Supabase:**

```typescript
import { createClient } from "@supabase/supabase-js";

class SupabaseAPI implements IUserAPI {
  private supabase;

  constructor(url: string, key: string) {
    this.supabase = createClient(url, key);
  }

  async getOrCreateUser(userId: string, name: string, email: string) {
    const { data, error } = await this.supabase
      .from("users")
      .upsert({ id: userId, name, email })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Implement other methods...
}
```

## Data Flow Diagrams

### Challenge Submission Flow

```
User clicks "Submit"
    ↓
Run tests (existing logic)
    ↓
Calculate score (ScoringSystem)
    ↓
Save attempt (MockDatabase)
    ↓
Update user points (MockDatabase)
    ↓
Update streak (StreakSystem)
    ↓
Update skill progress (MockDatabase)
    ↓
Display results with new stats
    ↓
Invalidate React Query cache
    ↓
Dashboard auto-refreshes
```

### AI Mentor Request Flow

```
User clicks "Get Hint" / "Debug" / etc.
    ↓
Get AI response (AIMentorService)
    ↓
Display in chat panel
    ↓
(Optional) Save conversation (MockDatabase)
```

### Daily Challenge Selection

```
App loads / User navigates to challenge
    ↓
Check URL challenge ID
    ↓
If no ID, call getDailyChallenge(today)
    ↓
Load challenge metadata
    ↓
Display challenge + editor
```

## Error Handling

### Mock Database Errors

```typescript
try {
  const user = await MockDatabase.getOrCreateUser(userId, name, email);
} catch (error) {
  console.error("Failed to create user:", error);
  // Show error to user, retry logic, etc.
}
```

### API Factory Fallback

```typescript
// If remote fails, automatically retry with mock
APIFactory.switchToRemote("https://api.myapp.com").catch(() => {
  console.warn("Backend unavailable, using local database");
  APIFactory.switchToMock();
});
```

## Performance Considerations

### 1. Caching

- React Query automatically caches API responses
- Use `refetchOnMount: false` to avoid excessive fetches

### 2. Batch Operations

- When updating multiple fields, group in single API call
- E.g., score + streak + progress = 1 database update

### 3. Lazy Loading

- Load user data on-demand with hooks
- Don't fetch all users' data upfront

### 4. localStorage Limits

- Mock database uses localStorage (~5-10MB limit)
- For large deployments, implement pagination

## Security Considerations (Production)

### 1. Authentication

- Always verify user ID on backend before updating
- Use JWT tokens for API calls

### 2. Data Validation

- Validate all input on both client and server
- Sanitize code submissions before storage

### 3. Rate Limiting

- Limit API calls to prevent abuse
- Track score submissions to prevent duplicate rewards

### 4. Environment Variables

```typescript
// .env.local
VITE_BACKEND_URL=https://api.myapp.com
VITE_API_MODE=mock  # or remote
```

## Monitoring & Debugging

### Enable Debug Logging

```typescript
// Add to services/api.ts
const DEBUG = true;

class RemoteAPI implements IUserAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    if (DEBUG) console.log(`[API] ${options?.method || "GET"} ${endpoint}`);
    // ... rest of implementation
  }
}
```

### Inspect localStorage (Browser DevTools)

```javascript
// In browser console
JSON.parse(localStorage.getItem("users"));
JSON.parse(localStorage.getItem("streaks"));
JSON.parse(localStorage.getItem("userProgress"));
```

## Testing

### Unit Tests

```typescript
import { ScoringSystem } from "@/services/scoringSystem";

describe("ScoringSystem", () => {
  it("should calculate level correctly", () => {
    expect(ScoringSystem.calculateLevel(500)).toBe(2);
    expect(ScoringSystem.calculateLevel(1500)).toBe(4);
  });
});
```

### Integration Tests

```typescript
import { MockDatabase } from "@/services/mockDatabase";

describe("User Workflow", () => {
  it("should create user and update streak", async () => {
    const user = await MockDatabase.getOrCreateUser(
      "123",
      "Test",
      "test@example.com",
    );
    const streak = await MockDatabase.getOrCreateStreak(user.id);
    const result = await MockDatabase.updateStreak(user.id);
    expect(result.streak.currentStreak).toBe(1);
  });
});
```

## Deployment Checklist

- [ ] Replace mock API with real backend
- [ ] Update environment variables
- [ ] Test all database operations
- [ ] Implement rate limiting
- [ ] Add error tracking (Sentry)
- [ ] Set up database backups
- [ ] Configure CORS headers
- [ ] Enable HTTPS
- [ ] Set up monitoring/alerts
- [ ] Test user authentication flow

---

**Summary:** This architecture provides a complete, production-ready backend system that works with both mock and real databases. Switch implementations without changing UI code using the API Factory pattern.
