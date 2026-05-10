# CodeMentor AI: Project Overview

Welcome to the comprehensive overview of your **CodeMentor AI** project! This document outlines what you've built, explaining the frontend and backend implementations, your tech stack, and how the entire system is architected.

## 🚀 What is CodeMentor AI?

CodeMentor AI is an interactive, web-based coding challenge platform that integrates learning paths with an intelligent AI Mentor. It allows users to read lessons, solve coding challenges, track their progress, earn points, and build daily streaks, all while receiving specialized hints, explanations, and code optimizations from an AI assistant.

---

## 💻 Tech Stack

### Frontend

- **Core:** React 18, TypeScript, Vite.
- **Routing:** `react-router-dom` for handling page routing.
- **Component Library & Styling:** Tailwind CSS combined with `shadcn/ui` components (Radix UI primitives).
- **Data Fetching & Caching:** React Query (TanStack Query) ensures smooth remote states, caching, and background synchronization.
- **Icons & Visuals:** `lucide-react` for iconography, `recharts` for progress visualization.

### Backend

- **Database & Auth:** Supabase (PostgreSQL database built-in, seamlessly integrated for Authentication `AuthContext`).
- **Mock Implementation:** A sophisticated offline/mock setup using `localStorage` ensures development can happen independently of the remote database.
- **AI Provider:** Integration via OpenAI API (as indicated by the `openai` dependency).

---

## 🏗️ System Architecture & Structure

The codebase is organized modularly, separating UI from business logic and data access.

```
src/
├── components/       # Reusable UI components (shadcn/ui + custom panels)
├── pages/            # Routable pages (Dashboard, Challenge, Learn, Practice, etc.)
├── hooks/            # Custom React hooks (React Query integrations)
├── services/         # Core business logic and data manipulation
├── contexts/         # React Contexts (Authentication & Global states)
├── data/             # Static configurations & mock questions data
└── utils/            # Helper functions
```

### 1. Frontend Structure

The user interface follows a modern layout. The crowning jewel piece is the **Challenge Environment**, split into an intuitive three-panel layout:

- **Left Panel:** Displays challenge title, difficulty, problem description, examples with I/O, and expandable hints.
- **Center Panel (Editor):** Language selector, coding text-area/editor, and action buttons (`Run` and `Submit`).
- **Right Panel (Results & AI):**
  - **Output Panel:** Detailed breakdown of test case results, Expected vs. Output status, and Execution times.
  - **AI Mentor Panel:** Contains triggers for specific AI help (Hints, Breakdowns, Reviews), chat response areas, and code debugging.

**Overlay Statuses:**
When a challenge is submitted, a Result Modal displays success/failure statuses, point updates, accuracy, streak increments, and skill improvements.

### 2. Backend & Services Architecture

You built a powerful **Dependency Injection Pattern via an `APIFactory`**. This factory determines whether to route data requests to the local `MockDatabase` or remote `Supabase` APIs, meaning you can develop fully offline!

#### Core Services Built:

- **User Service:** Handles authentication, registration, user profiles, and session validation.
- **Lesson & Progress Service:** CRUD operations for curriculum content, and tracks user performance stats (Time spent, lessons completed).
- **Scoring & Streak System:** Computes challenge points based on accuracy, time spent, and difficulty. Controls the daily streak mechanisms and milestone check-ins.
- **AI Mentor Service:** Serves context-aware AI outputs (Tactical hints, step-by-step strategy, code analysis, performance optimizations) based on the user's specific challenge logic.
- **Chat Service:** Manages chat history between the user and AI Mentor contextually.
- **Analytics Service:** Aggregates statistics for Leaderboards, total points, and skill level tracking.

### 3. Data Flow Cycle

By leveraging Custom Hooks mapped cleanly to React Query, components stay lightweight and reactive:

1. **Load:** The URL points to `challenge/:id`. `useChallengeState` dynamically fetches data structure via API.
2. **Execute:** The user presses "Run". The code is funneled through either local mock tests or an API backend.
3. **Analyze:** The test cases pass/fail array is returned and displayed in the Right Panel.
4. **Submit & Persist:** When submitted, the `ScoringSystem` algorithm processes accuracy/speed and passes this payload to `useUserProgress` and `useUserAnalytics` to map data reliably into the backend instance (Supabase).

## 🎉 Summary

You built a highly robust, deeply decoupled full-stack React implementation capable of elegantly alternating between local-mock states and cloud-native Supabase scaling. The addition of the AI Mentor logic transforms the standard technical-interview prep loop into a specialized interactive tutorial experience.
