import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUser } from "@/hooks/useUser";
import { useAllLessons } from "@/hooks/useLesson";
import { useUserProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  ArrowLeft,
  Search,
  Filter,
  BookOpen,
  Clock,
  Trophy,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react";
import Learn from "@/components/Learn";
import { seedLessons } from "@/scripts/seedLessons";

const LearnPage = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { data: user } = useCurrentUser();
  const {
    data: lessons,
    isLoading: lessonsLoading,
    refetch: refetchLessons,
    error: lessonsError,
  } = useAllLessons();
  const { data: progress } = useUserProgress(user?.id);
  const [seedError, setSeedError] = React.useState<string | null>(null);
  const [loadingTimedOut, setLoadingTimedOut] = React.useState(false);
  const timeoutAppliedRef = React.useRef(false);
  const seedAttemptedRef = React.useRef(false);

  // Show loading for 2 seconds on initial mount, then show mock lessons
  useEffect(() => {
    // Only apply timeout once
    if (timeoutAppliedRef.current) {
      return;
    }

    if (!lessonsLoading) {
      return;
    }

    const timer = setTimeout(() => {
      if (!timeoutAppliedRef.current) {
        console.warn(
          "⏱️  Loading lessons took too long (2s), showing sample lessons",
        );
        timeoutAppliedRef.current = true;
        setLoadingTimedOut(true);
      }
    }, 2000); // 2 second timeout - show something quickly

    return () => clearTimeout(timer);
  }, []);

  // Seed lessons on mount only - single attempt
  useEffect(() => {
    const seedAndFetch = async () => {
      // Skip if we've already attempted
      if (seedAttemptedRef.current) {
        return;
      }

      seedAttemptedRef.current = true;

      try {
        setSeedError(null);
        // Only seed if we have no lessons
        if (!lessons || lessons.length === 0) {
          console.log("🌱 No lessons found, seeding...");
          await seedLessons();
          console.log("✅ Lessons seeded, refetching...");

          // Wait a moment for the database to update
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Refetch lessons after seeding
          await refetchLessons();
          console.log("✅ Lessons refetched");
        } else {
          console.log(`✅ Lessons already loaded: ${lessons.length} lessons`);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Failed to seed lessons:", err);
        setSeedError(errorMsg);
        // Don't retry - just show error and mock lessons
      }
    };

    // Only run when session is established
    if (session && !seedAttemptedRef.current) {
      seedAndFetch();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="max-w-md mx-auto mt-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to access the learning platform.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasError = lessonsError || seedError;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Learn
          lessons={lessons}
          progress={progress}
          isLoading={lessonsLoading && !loadingTimedOut}
          error={
            lessonsError ||
            (loadingTimedOut && !lessons?.length
              ? new Error("Loading took too long. Please try again.")
              : null)
          }
          refetch={refetchLessons}
        />
      </div>
    </div>
  );
};

export default LearnPage;
