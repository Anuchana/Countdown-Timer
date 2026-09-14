# AGENTS.md — Design Direction for Countdown Timer

This file tells any agent (or dev) working on this repo how to design and animate the UI. The visual reference is a dark "coming soon" forest page with a live countdown. The motion/interaction standard is Apple's fluid-interface approach (springs, direct manipulation, interruptibility, translucent materials). Follow both together — the reference image gives the *layout*, this doc gives the *feel*.

Read `/mnt/skills/.../apple-design/SKILL.md` (or the pasted Apple Design skill) in full before writing animation code. This file only extracts what applies to *this* project.

---

## 1. What "fluid" means for a countdown timer

A countdown timer is mostly static digits, so most Apple-style gesture work (drag, rubber-band, momentum) doesn't apply here. What *does* apply:

- Digit changes should feel alive, not just re-rendered text.
- The subscribe button, email input, and social icons must respond instantly to touch/click.
- Any interactive surface (input focus, button press, hover) needs continuous, immediate feedback — not feedback only on completion.
- The card itself (the rounded dark panel) is a translucent material over the forest photo — treat it like Apple treats a sheet or toolbar, not a flat `<div>`.

Everything below maps a piece of the Apple Design skill to a concrete piece of this UI.

---

## 2. Component-by-component rules

### 2.1 Countdown digits (Days / Hours / Minutes / Seconds)

- On every second tick, animate the outgoing digit and incoming digit — don't just swap text content instantly. Use a **critically damped spring** (`damping: 1.0`, `response: 0.3–0.4`), not a CSS `@keyframes` fade, since spring output can be interrupted if the target time changes mid-animation (e.g. user edits the date picker while counting down).
- Never use `Math.round` when deriving units from milliseconds remaining — `Math.floor` only (see task's core logic doc). This is a correctness rule, not a design one, but it directly affects whether the animation trigger fires on the right boundary.
- Animate only `transform` and `opacity` for the digit roll — compositor-friendly, keeps 60fps on mobile.
- Respect `prefers-reduced-motion`: replace the digit-roll spring with a plain opacity cross-fade, no vertical motion.

```js
// Digit change, Motion/Framer Motion
animate(digitEl, { y: [-12, 0], opacity: [0, 1] }, {
  type: 'spring', bounce: 0, duration: 0.35
});
```

```css
@media (prefers-reduced-motion: reduce) {
  .digit { transition: opacity 200ms ease; transform: none !important; }
}
```

### 2.2 Date/time picker

- Feedback on focus and on value change must be immediate — highlight the input border the instant it's focused, not after `blur`.
- If the user changes the target date while a countdown is already animating, **don't let the running digit-roll animation complete on the old value first.** Recompute and re-target the current spring rather than queuing a second animation behind it. This is the "always animate from the presentation value, never the target value" rule applied to a data change instead of a drag.

### 2.3 Subscribe button + email input

- `:active` state (press) must render on pointer-down, not on click/release:

```css
.subscribe-btn:active {
  transform: scale(0.97);
  transition: transform 100ms ease-out;
}
```

- The pill-shaped input and button are one visual unit — keep a single shared radius and no gap that breaks the "pill" read on mobile widths.
- Error/success state on subscribe (invalid email, submitted) is a **status/completion/warning/error** moment per the Apple feedback taxonomy — surface it inline near the input, not as a toast far from the point of action.

### 2.4 Card / panel over the forest photo

Treat the rounded dark container as a **material**, following §12 of the Apple Design skill:

```css
.hero-card {
  background: rgba(10, 12, 10, 0.45);
  backdrop-filter: blur(20px) saturate(140%);
  border-top: 1px solid rgba(255, 255, 255, 0.08); /* faint light-catching edge */
  border-radius: 28px;
}
```

- This is a **heavier** material than the nav links or social icon chips inside it — if those get their own background treatment, keep them visually lighter so hierarchy reads correctly (structural region = heavier, interactive element = lighter).
- Never stack another translucent layer directly on top of this one (e.g. don't blur the subscribe input again on top of the already-blurred card) — legibility collapses per the skill's explicit warning.
- Text over this material needs the vibrancy treatment: slightly heavier weight and a touch of positive tracking on small labels ("Days", "Hours", …) rather than flat gray — the background photo changes brightness in different spots.

### 2.5 Social icons row

- Circular icon buttons: same pointer-down feedback rule as the subscribe button — scale down instantly on press, spring back on release (`damping ~0.8, response 0.3` — slight bounce is fine here since the tap itself is a quick, physical gesture).
- Add ~10px of hit-padding beyond the visible circle so small touch targets remain reliable on mobile, per the skill's gesture-design checklist.

---

## 3. Typography

Match Apple's optical-sizing rules (§15), applied to this page's two type scales:

| Element | Size role | Tracking | Leading |
| --- | --- | --- | --- |
| Countdown numbers (`02 : 14 : 25 : 57`) | Large display | negative (`-0.02em` to `-0.03em`) | tight (`1.0–1.05`) |
| Unit labels ("Days", "Hours", …) | Small caption | slightly positive (`+0.02em`) | normal (`1.4`) |
| Nav links, subscribe heading, button text | Body/UI | near `0` | `1.4–1.5` |

```css
.countdown-digit {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.02em;
}
.countdown-label {
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

Scale everything in `rem`, not fixed `px`, so the layout respects the user's text-size setting without breaking (Dynamic Type equivalent, §15).

---

## 4. Motion defaults for this repo

Use this table as the single source of truth — don't invent new spring values per component.

| Interaction | Damping | Response |
| --- | --- | --- |
| Digit roll on tick | `1.0` (no overshoot) | `0.35` |
| Button/icon press-release | `0.8` (slight bounce) | `0.3` |
| Input focus ring | `1.0` | `0.25` |
| Card entrance on page load | `1.0` | `0.4` |

Reserve bounce (`damping < 1.0`) only for the press/release micro-interactions, which carry a physical "tap" quality. Everything else — digit changes, entrance, focus — stays critically damped so the page reads as calm and precise, matching the reference image's minimal, high-contrast aesthetic rather than a playful one.

---

## 5. Accessibility checklist (don't skip)

- [ ] `prefers-reduced-motion: reduce` → digit roll becomes a plain cross-fade, card entrance loses any transform, button press keeps only the instant `:active` feedback (no spring bounce).
- [ ] `prefers-contrast: more` → `.hero-card` background goes near-solid, drop the blur, add a visible border.
- [ ] All interactive elements (input, button, social icons, nav links) have a visible focus state, not just a hover state — this page will be used with a keyboard on desktop.
- [ ] Color contrast of white text over the forest photo is checked at the darkest *and* lightest points the photo can show behind the scrim — the overlay opacity in §2.4 exists specifically to guarantee this.

---

## 6. What NOT to do

- Don't animate `top`/`left`/`width`/`height` for any of this — `transform`/`opacity` only.
- Don't use a countdown/animation library that hides the interval logic — the timer math must stay hand-written per the task brief; only the *visual transition* of the digit uses a spring library, not the underlying time calculation.
- Don't let the digit-roll animation block input — the date picker must remain editable at all times, even mid-tick.
- Don't add sound/haptics unless asked — this is a marketing landing page, not a place that earns extra feedback channels (Apple's "utility" rule: don't add feedback that isn't meaningful).