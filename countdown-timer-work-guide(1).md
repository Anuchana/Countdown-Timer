# Countdown Timer — Work Guide (Next.js)
**Task:** MoraSpirit Web Pillar Recruitment Task 02 — Simple Countdown Timer
**Stack:** Next.js (App Router) + Tailwind CSS
**Deploy target:** Vercel

---

## 1. Goal Recap

Build a "coming soon" style landing page (like the reference PIXAR forest image) with:
- A working countdown timer (Days : Hours : Minutes : Seconds)
- A date/time picker so the user can set the target date
- Live updates every second, hand-written in JS (no countdown library)
- A "Time is up!" state when countdown reaches zero
- Clean, mobile-responsive design
- Deployed live (Vercel/Netlify)

---

## 2. Project Setup

```bash
npx create-next-app@latest countdown-timer
cd countdown-timer
# Choose: TypeScript optional, Tailwind CSS = Yes, App Router = Yes
npm run dev
```

Folder structure to aim for:
```
app/
  page.tsx          -> main landing page
  layout.tsx
components/
  CountdownTimer.tsx
  DateTimePicker.tsx
  SubscribeForm.tsx
public/
  forest-bg.jpg      -> background image
```

---

## 3. Core Logic — Countdown Timer (write this yourself)

This is the part they will grill you on in the interview. Understand it fully.

### 3.1 The math
```js
const diffMs = targetDate.getTime() - now.getTime();

if (diffMs <= 0) {
  // show "Time is up!"
} else {
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
}
```
Be ready to explain:
- Why we use `getTime()` (returns milliseconds since epoch — makes subtraction reliable across timezones)
- Why `Math.floor` and not `Math.round` (avoids showing "0 seconds" when 0.9s remain)
- Why modulo (`%`) is used to peel off each unit (86400s/day, 3600s/hour, 60s/minute)

### 3.2 The live update — `useEffect` + `setInterval`
```jsx
'use client';
import { useState, useEffect } from 'react';

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer); // cleanup — avoid memory leaks
  }, [targetDate]);

  return timeLeft.finished
    ? <p>Time is up!</p>
    : <TimerDisplay {...timeLeft} />;
}

function calculateTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    finished: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
```

Key interview talking points:
- `setInterval(fn, 1000)` re-runs the calculation every second — the countdown is *recomputed from real time*, not decremented manually. This prevents drift if the tab is backgrounded.
- `clearInterval` in the `useEffect` cleanup prevents multiple timers stacking up on re-render.
- Re-deriving from `Date.now()` each tick (rather than `seconds - 1`) keeps the timer accurate even if the browser throttles background tabs.

---

## 4. User Input — Date/Time Picker

Simplest reliable option: native HTML input, no extra library needed.

```jsx
<input
  type="datetime-local"
  onChange={(e) => setTargetDate(e.target.value)}
  className="rounded-full px-4 py-2 text-black"
/>
```
- `type="datetime-local"` gives you a native date+time picker on both desktop and mobile — satisfies "works on mobile phones" with zero extra dependencies.
- Store the value in state (`targetDate`), pass it down to `CountdownTimer`.
- Validate: if the picked date is in the past, immediately show "Time is up!"

Optional polish: default `targetDate` to something in the near future so the timer isn't blank on first load (matches the reference image, which shows a preset countdown, not an empty picker).

---

## 5. UI / Design (matching the reference screenshot)

Layout to replicate:
1. Full-bleed dark background image (forest photo), rounded-corner container, dark overlay for contrast.
2. Top nav: logo left, links right (About / Services / Products / News / Contact) — can be static for this task.
3. Center: big bold countdown numbers (`02 : 14 : 25 : 57`) with small uppercase labels underneath (Days / Hours / Minutes / Seconds).
4. Below: subscribe heading + pill-shaped email input with a blue "Subscribe" button.
5. Bottom: row of circular social icons.

Tailwind building blocks:
```jsx
<div className="relative rounded-3xl overflow-hidden bg-cover bg-center"
     style={{ backgroundImage: "url('/forest-bg.jpg')" }}>
  <div className="absolute inset-0 bg-black/40" /> {/* overlay */}
  <div className="relative z-10 p-6 md:p-10">
    {/* nav, timer, form here */}
  </div>
</div>
```

Mobile responsiveness:
- Use `flex-col md:flex-row` for the nav so links stack or collapse on small screens.
- Countdown numbers: `text-4xl sm:text-6xl md:text-7xl` so they scale down instead of overflowing.
- Test at 375px width (iPhone SE) minimum.

---

## 6. "Time is Up!" State

```jsx
{timeLeft.finished ? (
  <p className="text-4xl font-bold text-white">Time is up! 🎉</p>
) : (
  <TimerBlocks {...timeLeft} />
)}
```
Keep it simple — a clear text swap is enough per the requirements ("Show a message like...").

---

## 7. Deployment

```bash
git init
git add .
git commit -m "countdown timer"
git remote add origin <your-repo-url>
git push -u origin main
```
Then on [vercel.com](https://vercel.com):
1. Import the GitHub repo.
2. Framework preset auto-detects Next.js — no config needed.
3. Deploy → copy the live URL for the interview.

(Netlify works too: `netlify deploy` with Next.js runtime plugin, or just connect the repo via their dashboard.)

---

## 8. Pre-Interview Checklist

- [ ] Countdown updates every second without page refresh
- [ ] Date/time picker lets you set a custom target
- [ ] Picking a past date immediately shows "Time is up!"
- [ ] Layout doesn't break on mobile width (test in dev tools responsive mode)
- [ ] Live URL works and loads without console errors
- [ ] You can explain, from memory, without looking at code:
  - How `diffMs` is calculated
  - Why `setInterval` + `useEffect` cleanup is used
  - How days/hours/minutes/seconds are derived with `Math.floor` and `%`
- [ ] Code has no external countdown library (`react-countdown`, etc. are NOT allowed)

---

## 9. Stretch Goals (only if time allows)

- Persist the chosen target date in `localStorage` so it survives a refresh.
- Animate digit transitions (simple CSS transition on number change).
- Wire the "Subscribe" input to a real endpoint or just show a success toast on submit — task doesn't require backend, keep it front-end only.