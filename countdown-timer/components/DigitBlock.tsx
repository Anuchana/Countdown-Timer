'use client';

import { useEffect, useRef } from 'react';

interface DigitBlockProps {
  value: number;
  label: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export default function DigitBlock({ value, label }: DigitBlockProps) {
  const prevValueRef = useRef<number>(value);
  const topRef = useRef<HTMLSpanElement>(null);   // always shows current value
  const botRef = useRef<HTMLSpanElement>(null);   // shows during animation (old value)

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev === value) return;

    prevValueRef.current = value;

    const top = topRef.current;
    const bot = botRef.current;
    if (!top || !bot) return;

    // Keep bot content = old value during the outgoing animation
    if (bot) bot.textContent = pad(prev);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Plain cross-fade — no transform (AGENTS.md §5)
      bot.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 180,
        easing: 'ease-out',
        fill: 'forwards',
      });
      top.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        easing: 'ease-in',
        fill: 'forwards',
      });
    } else {
      // Outgoing: slide down + fade
      bot.animate(
        [
          { transform: 'translateY(0px)', opacity: 1 },
          { transform: 'translateY(16px)', opacity: 0 },
        ],
        { duration: 240, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }
      );

      // Incoming: spring up from below — critically damped (damping=1.0, response=0.35)
      top.animate(
        [
          { transform: 'translateY(-16px)', opacity: 0 },
          { transform: 'translateY(0px)', opacity: 1 },
        ],
        { duration: 350, easing: 'cubic-bezier(0.34, 1.0, 0.64, 1)', fill: 'forwards' }
      );
    }
  }, [value]);

  return (
    <div className="digit-block" aria-label={`${value} ${label}`}>
      <div className="digit-stack">
        {/* Bottom layer: the outgoing digit (animates out on change) */}
        <span ref={botRef} className="digit digit-bot" aria-hidden="true">
          {pad(value)}
        </span>
        {/* Top layer: the incoming / current digit (always up-to-date) */}
        <span ref={topRef} className="digit digit-top">
          {pad(value)}
        </span>
      </div>
      <span className="digit-label">{label}</span>
    </div>
  );
}
