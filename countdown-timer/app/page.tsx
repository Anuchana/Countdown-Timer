'use client';

import { useState, useEffect } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import DateTimePicker from '@/components/DateTimePicker';


const STORAGE_KEY = 'countdown-target-date';

function getDefaultTarget(): string {
  // Default: 30 days from now
  const d = new Date();
  d.setDate(d.getDate() + 30);
  // Format to datetime-local string (YYYY-MM-DDTHH:MM)
  return d.toISOString().slice(0, 16);
}

export default function Home() {
  const [targetDate, setTargetDate] = useState<string>(getDefaultTarget);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage on mount (avoid SSR mismatch)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTargetDate(stored);
    }
    setMounted(true);
  }, []);

  function handleDateChange(value: string) {
    setTargetDate(value);
    localStorage.setItem(STORAGE_KEY, value);
  }

  return (
    <main className="page-root">
      {/* Full-bleed background */}
      <div className="bg-layer" aria-hidden="true" />

      {/* Hero card — glassmorphism material */}
      <div className="hero-card" role="region" aria-label="Coming soon countdown">

        {/* Navigation */}
        <nav className="hero-nav" aria-label="Site navigation">
          <span className="nav-logo" aria-label="PIXAR">PIXAR</span>
          <ul className="nav-links" role="list">
            {['About', 'Services', 'Products', 'News', 'Contact'].map((link) => (
              <li key={link}>
                <a href="#" className="nav-link" aria-label={link}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Spacer — pushes content toward center */}
        <div className="hero-spacer" />

        {/* Countdown display — always render, no mounted guard needed
            CountdownTimer is 'use client' so it's safe to render always */}
        <section className="hero-countdown" aria-label="Countdown timer">
          <CountdownTimer targetDate={targetDate} />
        </section>

        {/* Date picker */}
        <section className="hero-picker" aria-label="Set target date">
          <DateTimePicker value={targetDate} onChange={handleDateChange} />
        </section>
     
      </div>
    </main>
  );
}
