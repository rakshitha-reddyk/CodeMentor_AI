import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChallengeById } from "@/data/challengeData";
import { useChallengeTimer } from "@/hooks/useChallengeTimer";
import { useChallengeState } from "@/hooks/useChallengeState";
import { ScoreSystem } from "@/utils/scoreSystem";
import { StreakSystem, defaultStreakData } from "@/utils/streakSystem";
import { AnalyticsSystem, defaultAnalytics } from "@/utils/analyticsSystem";
import ChallengeLayout from "@/components/challenge/ChallengeLayout";
import ResultModal from "@/components/challenge/ResultModal";
import { useCurrentUser } from "@/hooks/useUser";
import { useUserProgress } from "@/hooks/useProgress";
import { useUserAnalytics } from "@/hooks/useAnalytics";

const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { data: progress } = useUserProgress(user?.id);
  const { data: analytics } = useUserAnalytics(user?.id);

  const challenge = getChallengeById(id || "");
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<{
    isSuccess: boolean;
    pointsEarned: number;
    timeSpent: number;
    accuracy: number;
    passedTests: number;
    totalTests: number;
    streakMessage?: string;
    streakCount?: number;
    skillLevelUp?: boolean;
    skillName?: string;
  } | null>(null);

  // Initialize state and hooks
  const {
    minutes,
    seconds,
    isRunning: isTimerRunning,
    isTimeUp,
    totalSecondsElapsed,
    getFormattedTime,
  } = useChallengeTimer(challenge?.timeLimit || 30);

  const {
    code,
    language,
    testResults,
    isRunning,
    isSubmitting,
    error,
    setCode,
    setLanguage,
    runTests,
    submitChallenge,
    clearError,
  } = useChallengeState(challenge!);

  // Handle time up
  useEffect(() => {
    if (isTimeUp) {
      handleTimeUp();
    }
  }, [isTimeUp]);

  const handleTimeUp = async () => {
    if (testResults.length === 0) {
      // Auto submit if no tests run
      await handleSubmit();
    }
  };

  const handleRun = async () => {
    clearError();
    await runTests(code);
  };

  const handleSubmit = async () => {
    clearError();

    const submissionResult = await submitChallenge(code);

    if (!challenge) return;

    // Calculate stats
    const { accuracy, passedCount, allPassed } =
      submissionResult.results.length > 0
        ? {
            accuracy: Math.round(
              (submissionResult.results.filter((r) => r.status === "passed")
                .length /
                submissionResult.results.length) *
                100,
            ),
            passedCount: submissionResult.results.filter(
              (r) => r.status === "passed",
            ).length,
            allPassed: submissionResult.results.every(
              (r) => r.status === "passed",
            ),
          }
        : { accuracy: 0, passedCount: 0, allPassed: false };

    // Calculate score
    const pointsEarned = ScoreSystem.calculateScore({
      challenge,
      testsPassedCount: passedCount,
      testsTotalCount: challenge.testCases.length,
      timeSpentSeconds: totalSecondsElapsed,
    });

    // Update streak (mock - in real app, update from backend)
    let streakData = defaultStreakData;
    let streakMessage = "";
    let streakCount = 0;

    if (allPassed) {
      const streakUpdate = StreakSystem.updateStreak(streakData);
      streakData = streakUpdate.streakData;
      streakMessage = streakUpdate.message;
      streakCount = streakData.currentStreak;
    }

    // Update analytics (mock - use default since hook may not return full structure)
    const previousAnalytics = defaultAnalytics;
    let analyticsData = { ...previousAnalytics };

    analyticsData = AnalyticsSystem.updateAnalytics(
      analyticsData,
      challenge.id,
      challenge.categories[0],
      challenge.difficulty,
      pointsEarned,
      totalSecondsElapsed,
      allPassed,
    );

    // Check skill level up
    const skillName = challenge.categories[0] + " Level";
    const skillLevelUp =
      analyticsData?.skillProgress[skillName]?.level >
      previousAnalytics?.skillProgress[skillName]?.level;

    // Show result modal
    setResultData({
      isSuccess: allPassed,
      pointsEarned,
      timeSpent: totalSecondsElapsed,
      accuracy,
      passedTests: passedCount,
      totalTests: challenge.testCases.length,
      streakMessage,
      streakCount,
      skillLevelUp,
      skillName: skillName.replace(" Level", ""),
    });

    setShowResultModal(true);
  };

  const handleResultClose = () => {
    setShowResultModal(false);
  };

  const handleContinueToNext = () => {
    setShowResultModal(false);
    // Navigate to next challenge or dashboard
    navigate("/dashboard");
  };

  if (!challenge) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Challenge not found</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-brand-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChallengeLayout
        challenge={challenge}
        code={code}
        language={language}
        onCodeChange={setCode}
        onLanguageChange={setLanguage}
        onRun={handleRun}
        onSubmit={handleSubmit}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        testResults={testResults}
        timerMinutes={minutes}
        timerSeconds={seconds}
        isTimeUp={isTimeUp}
        isRunningTimer={isTimerRunning}
        formattedTime={getFormattedTime()}
        error={error?.message}
      />

      {/* Result Modal */}
      {resultData && (
        <ResultModal
          isOpen={showResultModal}
          isSuccess={resultData.isSuccess}
          pointsEarned={resultData.pointsEarned}
          timeSpent={resultData.timeSpent}
          accuracy={resultData.accuracy}
          passedTests={resultData.passedTests}
          totalTests={resultData.totalTests}
          streakMessage={resultData.streakMessage}
          streakCount={resultData.streakCount}
          skillLevelUp={resultData.skillLevelUp}
          skillName={resultData.skillName}
          onClose={handleResultClose}
          onContinue={handleContinueToNext}
        />
      )}
    </>
  );
};

export default ChallengePage;
