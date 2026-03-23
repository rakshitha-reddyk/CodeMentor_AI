import { useState, useEffect, useCallback } from "react";

export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isTimeUp: boolean;
  totalSecondsElapsed: number;
}

export const useChallengeTimer = (initialMinutes: number) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isRunning || isTimeUp) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        setTotalElapsed((e) => e + 1);

        if (newTime <= 0) {
          setIsRunning(false);
          setIsTimeUp(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isTimeUp]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    if (!isTimeUp) {
      setIsRunning(true);
    }
  }, [isTimeUp]);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialMinutes * 60);
    setIsRunning(true);
    setTotalElapsed(0);
    setIsTimeUp(false);
  }, [initialMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    isRunning,
    isTimeUp,
    totalSecondsElapsed: totalElapsed,
    timeLeftSeconds: timeLeft,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getFormattedTime: () =>
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  };
};
