'use client';

import { useState } from 'react';

export default function PortalPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShake, setIsShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsShake(false);
    setIsSuccess(false);

    const cleanCode = accessCode.trim();
    if (!cleanCode) {
      triggerError('Please enter an access code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: cleanCode }),
      });

      const data = await res.json();

      // Add a small artificial delay for security/premium experience feel
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (res.ok && data.success) {
        setIsSuccess(true);
        // Wait for successful transition glow to show before redirecting
        setTimeout(() => {
          window.location.href = `/projects/${data.slug}/index.html`;
        }, 600);
      } else {
        triggerError(data.error || 'Invalid access code. Please try again.');
      }
    } catch (err) {
      console.error(err);
      triggerError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerError = (msg) => {
    setError(msg);
    setIsShake(true);
    // Remove shake class after animation completes so it can be re-triggered
    setTimeout(() => {
      setIsShake(false);
    }, 500);
  };

  return (
    <main className="portal-container">
      <div className={`glass-card ${isShake ? 'shake' : ''} ${isSuccess ? 'success-state' : ''}`}>
        <div className="card-header">
          <div className="logo-container">
            <svg className="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" stroke="url(#logo-grad)" strokeWidth="8" strokeDasharray="180 60" />
              <path d="M35 50L45 60L65 40" stroke="url(#logo-grad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="portal-title">Client Demo Portal</h1>
          <p className="portal-subtitle">
            Enter your secure access code to view custom decks and walkthroughs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="access-form" noValidate>
          <div className="input-wrapper">
            <label htmlFor="access-code" className="input-label">Access Code</label>
            <input
              type="text"
              id="access-code"
              name="access-code"
              placeholder="e.g. ARUN-X92F8"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={isLoading || isSuccess}
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            <div className="input-glow"></div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading || isSuccess}>
            <span className="btn-text">
              {isSuccess ? 'Authorizing...' : isLoading ? 'Verifying' : 'Verify & Enter'}
            </span>
            {isLoading && <span className="btn-loader"></span>}
          </button>

          {error && (
            <div className="error-message" role="alert" aria-live="polite">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
