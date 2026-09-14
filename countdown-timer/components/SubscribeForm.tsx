'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function validateEmail(e: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Simulate submission (no backend required per task spec)
    setStatus('success');
    setErrorMsg('');
    setEmail('');
  }

  return (
    <div className="subscribe-section">
      <p className="subscribe-heading">
        Subscribe to receive a notification upon our launch
      </p>

      <form
        onSubmit={handleSubmit}
        className="subscribe-form"
        noValidate
        aria-label="Launch notification subscription form"
      >
        <div className="subscribe-pill">
          <input
            id="subscribe-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="Your mail....."
            className="subscribe-input"
            aria-label="Email address"
            aria-describedby={status !== 'idle' ? 'subscribe-feedback' : undefined}
            aria-invalid={status === 'error'}
            disabled={status === 'success'}
          />
          <button
            type="submit"
            className="subscribe-btn"
            disabled={status === 'success'}
            aria-label="Subscribe for launch notification"
          >
            {status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </button>
        </div>

        {/* Inline feedback — shown near the input, not in a distant toast */}
        {status === 'error' && (
          <p id="subscribe-feedback" className="subscribe-feedback subscribe-feedback--error" role="alert">
            {errorMsg}
          </p>
        )}
        {status === 'success' && (
          <p id="subscribe-feedback" className="subscribe-feedback subscribe-feedback--success" role="status">
            🎉 You&apos;re on the list! We&apos;ll notify you at launch.
          </p>
        )}
      </form>
    </div>
  );
}
