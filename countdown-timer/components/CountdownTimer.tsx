'use client';

import { useState, useEffect } from 'react';
import DigitBlock from './DigitBlock';

interface TimeLeft {
  finished: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();

  if (diff <= 0) {
    return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    finished: false,
    // Use Math.floor only — never Math.round (avoids showing 0s when 0.9s remain)
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    // Immediately recalculate when targetDate changes without triggering sync setState warning
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 0);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Cleanup — prevent multiple timers stacking on re-render
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.finished) {
    return (
      <div className="time-up" role="status" aria-live="assertive">
        <span className="time-up-emoji">🎉</span>
        <p className="time-up-text">Time is Up!</p>
        <p className="time-up-sub">The moment has arrived.</p>
      </div>
    );
  }

  return (
    <div className="countdown-display" role="timer" aria-live="off" aria-label="Countdown timer">
      <div className="countdown-row">
        <DigitBlock value={timeLeft.days} label="Days" />
        <span className="countdown-separator" aria-hidden="true">:</span>
        <DigitBlock value={timeLeft.hours} label="Hours" />
        <span className="countdown-separator" aria-hidden="true">:</span>
        <DigitBlock value={timeLeft.minutes} label="Minutes" />
        <span className="countdown-separator" aria-hidden="true">:</span>
        <DigitBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}
