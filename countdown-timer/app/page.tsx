'use client';

import * as React from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import DateTimePicker from '@/components/DateTimePicker';

export default function Home() {
  // Default target date to 3 days from now
  const [targetDate, setTargetDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    // Format to yyyy-MM-ddThh:mm for datetime-local
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  });

  return (
    <main className="page-root">
      <div className="bg-layer" />
      <div className="hero-card">
        
        <header className="hero-header">
          <div className="nav-logo">PIXAR</div>
        </header>

        <h1 className="hero-tagline">
          Own Your Time. Beat the Deadline.
        </h1>
        <div className="hero-spacer" />

        <div className="hero-countdown">
          <CountdownTimer targetDate={targetDate} />
        </div>

        <div className="hero-picker">
          <DateTimePicker value={targetDate} onChange={setTargetDate} />
        </div>

      </div>
    </main>
  );
}
