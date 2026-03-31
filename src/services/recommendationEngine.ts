/**
 * AI Recommendation Engine
 * Analyzes user behavior and generates personalized learning recommendations
 */

export interface UserPerformanceData {
  accuracy: number; // 0-100, e.g., 78
  completedChallenges: number;
  failedChallenges: number;
  failedTopics: string[]; // e.g., ["arrays", "strings"]
  strongTopics: string[]; // e.g., ["recursion", "basic-loops"]
  recentActivity: Array<{
    topic: string;
    timestamp: Date;
    type: "success" | "failure";
    accuracy?: number;
  }>;
  streak: number; // in days
  timeSpent: number; // in minutes
  lastActivityDate?: Date;
  skillProgress: Record<string, number>; // skill -> accuracy %
}

export interface Recommendation {
  id: string;
  type: "skill-improvement" | "practice" | "challenge";
  title: string;
  description: string;
  reason: string;
  difficulty: "Easy" | "Intermediate" | "Advanced" | "Expert";
  estimatedTime: number; // in minutes
  confidenceScore: number; // 0-100
  topic?: string;
  actionUrl?: string;
}

export interface RecommendationEngineResult {
  recommendations: Recommendation[];
  primaryRecommendation: Recommendation;
  analysisReason: string;
}

/**
 * Main recommendation engine function
 * Analyzes user data and generates 3 personalized recommendations
 */
export const getRecommendations = (
  userData: UserPerformanceData,
): RecommendationEngineResult => {
  const recommendations: Recommendation[] = [];

  // Determine user learning phase
  const isBeginnerPhase = userData.accuracy < 70;
  const isIntermediatePhase = userData.accuracy >= 70 && userData.accuracy < 85;
  const isAdvancedPhase = userData.accuracy >= 85;
  const isInactive =
    userData.lastActivityDate &&
    new Date().getTime() - userData.lastActivityDate.getTime() >
      7 * 24 * 60 * 60 * 1000; // 7 days

  // 1. SKILL IMPROVEMENT RECOMMENDATION
  const skillImprovement = generateSkillImprovementRec(
    userData,
    isBeginnerPhase,
    isIntermediatePhase,
    isAdvancedPhase,
  );
  recommendations.push(skillImprovement);

  // 2. PRACTICE RECOMMENDATION
  const practiceRec = generatePracticeRecommendation(
    userData,
    isBeginnerPhase,
    isInactive,
  );
  recommendations.push(practiceRec);

  // 3. CHALLENGE RECOMMENDATION
  const challengeRec = generateChallengeRecommendation(
    userData,
    userData.streak,
    isAdvancedPhase,
  );
  recommendations.push(challengeRec);

  // Determine primary recommendation based on engagement and streak
  let primaryIdx = 0;
  if (userData.streak > 5) {
    primaryIdx = 2; // Challenge recommendation for active users
  } else if (isBeginnerPhase || isInactive) {
    primaryIdx = 0; // Skill improvement for struggling users
  }

  const analysisReason = generateAnalysisReason(userData);

  return {
    recommendations,
    primaryRecommendation: recommendations[primaryIdx],
    analysisReason,
  };
};

/**
 * Generate skill improvement recommendation
 */
function generateSkillImprovementRec(
  userData: UserPerformanceData,
  isBeginnerPhase: boolean,
  isIntermediatePhase: boolean,
  isAdvancedPhase: boolean,
): Recommendation {
  // Find weakest topic
  let weakestTopic = userData.failedTopics[0] || "fundamentals";
  let weakestAccuracy = 100;

  for (const [skill, accuracy] of Object.entries(userData.skillProgress)) {
    if (accuracy < weakestAccuracy) {
      weakestAccuracy = accuracy;
      weakestTopic = skill;
    }
  }

  // Format topic name
  const topicDisplay = formatTopicName(weakestTopic);

  let difficulty: "Easy" | "Intermediate" | "Advanced" = "Intermediate";
  let confidence = 75;
  let estimatedTime = 45;

  if (isBeginnerPhase) {
    difficulty = "Easy";
    confidence = 85;
    estimatedTime = 30;
  } else if (isAdvancedPhase) {
    difficulty = "Advanced";
    confidence = 78;
    estimatedTime = 60;
  }

  return {
    id: "skill-improvement-1",
    type: "skill-improvement",
    title: `Master ${topicDisplay}`,
    description: `Based on your recent practice, ${topicDisplay} is an area where you can make significant progress.`,
    reason: `Your accuracy in ${topicDisplay} is ${weakestAccuracy}%. Mastering this skill will boost your problem-solving speed and confidence.`,
    difficulty,
    estimatedTime,
    confidenceScore: confidence,
    topic: weakestTopic,
    actionUrl: `/learn?topic=${weakestTopic}`,
  };
}

/**
 * Generate practice recommendation
 */
function generatePracticeRecommendation(
  userData: UserPerformanceData,
  isBeginnerPhase: boolean,
  isInactive: boolean,
): Recommendation {
  let title = "Continue Practicing";
  let description = "Keep your momentum going with focused practice sessions.";
  let reason = "Consistent practice is key to improvement.";
  let difficulty: "Easy" | "Intermediate" | "Advanced" = "Intermediate";
  let estimatedTime = 30;
  let confidence = 72;

  if (isInactive) {
    title = "Get Back on Track";
    description = "Take an easy challenge to rebuild your streak and momentum.";
    reason =
      "You've been inactive for a while. Start with something manageable!";
    difficulty = "Easy";
    estimatedTime = 15;
    confidence = 88;
  } else if (isBeginnerPhase) {
    title = "Retry Failed Challenges";
    description = "Review and practice problems where you struggled before.";
    reason = `You've completed ${userData.completedChallenges} challenges. Retrying failed ones builds fundamentals.`;
    difficulty = "Easy";
    estimatedTime = 25;
    confidence = 81;
  } else {
    const passRate = Math.round(
      (userData.completedChallenges /
        (userData.completedChallenges + userData.failedChallenges)) *
        100,
    );
    reason = `Your success rate is ${passRate}%. Push toward 90%+ by practicing consistently.`;
    difficulty = "Intermediate";
    confidence = 68;
  }

  return {
    id: "practice-1",
    type: "practice",
    title,
    description,
    reason,
    difficulty,
    estimatedTime,
    confidenceScore: confidence,
    actionUrl: `/practice?difficulty=${difficulty.toLowerCase()}`,
  };
}

/**
 * Generate challenge recommendation
 */
function generateChallengeRecommendation(
  userData: UserPerformanceData,
  streak: number,
  isAdvancedPhase: boolean,
): Recommendation {
  let difficulty: "Easy" | "Intermediate" | "Advanced" | "Expert" =
    "Intermediate";
  let title = "Try Today's Challenge";
  let description = "Test your skills with today's curated challenge.";
  let reason = "Daily challenges help you discover new problem patterns.";
  let estimatedTime = 30;
  let confidence = 75;

  if (streak > 10 && isAdvancedPhase) {
    difficulty = "Expert";
    title = "Tackle an Expert Challenge";
    description = "Push your limits with an advanced algorithmic challenge.";
    reason = `Your ${streak}-day streak shows dedication. You're ready for expert-level problems!`;
    estimatedTime = 60;
    confidence = 82;
  } else if (streak > 5) {
    difficulty = "Advanced";
    title = "Level Up Your Skills";
    description = "Challenge yourself with a more difficult problem.";
    reason = `You have a ${streak}-day streak! Capitalize on your momentum with advanced challenges.`;
    estimatedTime = 45;
    confidence = 79;
  } else if (streak < 2) {
    difficulty = "Easy";
    title = "Build Your Streak";
    description = "Start small and consistent with an easy challenge.";
    reason = "Building a streak with easy wins builds confidence and habit.";
    estimatedTime = 20;
    confidence = 86;
  }

  return {
    id: "challenge-1",
    type: "challenge",
    title,
    description,
    reason,
    difficulty,
    estimatedTime,
    confidenceScore: confidence,
    actionUrl: `/challenge?difficulty=${difficulty.toLowerCase()}`,
  };
}

/**
 * Generate overall analysis reason for display
 */
function generateAnalysisReason(userData: UserPerformanceData): string {
  const timeSpentHours = Math.round(userData.timeSpent / 60);
  const passRate = Math.round(
    (userData.completedChallenges /
      (userData.completedChallenges + userData.failedChallenges + 0.0001)) * // Avoid division by zero
      100,
  );

  const factors = [];

  if (userData.accuracy < 70) {
    factors.push("accuracy is below 70%");
  } else if (userData.accuracy > 85) {
    factors.push("you're performing at an advanced level");
  }

  if (userData.streak > 7) {
    factors.push(`${userData.streak}-day streak shows strong commitment`);
  }

  if (userData.failedChallenges > userData.completedChallenges * 0.5) {
    factors.push("recent practice shows some struggle areas");
  }

  if (timeSpentHours > 50) {
    factors.push("you've invested significant time");
  }

  if (factors.length === 0) {
    factors.push("your learning patterns suggest steady progress");
  }

  return `Based on ${factors.join(", ")}, here are personalized recommendations to accelerate your growth.`;
}

/**
 * Format topic names for display
 */
function formatTopicName(topic: string): string {
  return topic
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Calculate recommendation confidence based on data quality
 */
export const calculateRecommendationReliability = (
  userData: UserPerformanceData,
): number => {
  let reliability = 50; // Base reliability

  // More data = more confidence
  if (userData.completedChallenges > 10) reliability += 15;
  if (userData.completedChallenges > 25) reliability += 15;

  // Recent activity = more confidence
  const daysSinceActivity = userData.lastActivityDate
    ? (new Date().getTime() - userData.lastActivityDate.getTime()) /
      (1000 * 60 * 60 * 24)
    : 999;

  if (daysSinceActivity < 1) reliability += 20;
  else if (daysSinceActivity < 7) reliability += 10;

  // Consistent progress = more confidence
  if (userData.streak > 5) reliability += 15;

  return Math.min(reliability, 100);
};

/**
 * Get recommendation with fallback data (for new users with minimal data)
 */
export const getDefaultRecommendations = (): RecommendationEngineResult => {
  const defaultData: UserPerformanceData = {
    accuracy: 60,
    completedChallenges: 0,
    failedChallenges: 0,
    failedTopics: ["arrays", "strings"],
    strongTopics: [],
    recentActivity: [],
    streak: 0,
    timeSpent: 0,
    skillProgress: {
      arrays: 40,
      strings: 35,
      recursion: 50,
    },
  };

  return getRecommendations(defaultData);
};
