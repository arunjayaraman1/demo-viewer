'use client';

import { useState } from 'react';

export default function PortalPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [portalSlug, setPortalSlug] = useState('');

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
        setPortalSlug(data.slug);
        // Wait for successful transition glow to show before redirecting
        setTimeout(() => {
          window.location.href = `/projects/${data.slug}/index.html`;
        }, 1200);
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
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px' }}>
      <div 
        className={`np-fade ${isShake ? 'np-shake' : ''}`} 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          background: 'var(--surface-card)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-lifted)', 
          padding: '48px 40px', 
          textAlign: 'center',
          transition: 'all 0.3s var(--ease)'
        }}
      >
        {isSuccess ? (
          <div className="np-fade">
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--surface-tint)', display: 'flex', alignItems: 'center', justifycontent: 'center', margin: '0 auto 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--np-teal-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="np-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text-strong)', margin: '0 0 8px' }}>
              Access granted
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.55, margin: 0 }}>
              Redirecting you to <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-link)', fontSize: '13.5px' }}>/projects/{portalSlug}/index.html</code>
            </p>
          </div>
        ) : (
          <div>
            <svg className="np-icon" width="40" height="40" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 20px', display: 'block' }}>
              <path d="M10 20 L55 50 L10 80 L26 50 Z" fill="var(--np-teal)"/>
              <path d="M26 50 L55 50 L38 26 Z" fill="var(--np-deep-teal)"/>
              <path d="M26 50 L55 50 L38 74 Z" fill="var(--np-orange)"/>
              <path d="M55 50 L90 50 L72 30 Z" fill="var(--np-gold)"/>
            </svg>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--np-teal-700)', marginBottom: '10px' }}>
              Secure Access
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 600, letterSpacing: '-1px', color: 'var(--text-strong)', margin: '0 0 10px' }}>
              Demo portal
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.55, margin: '0 0 32px' }}>
              Enter your access code to view confidential client walkthroughs and pitch decks.
            </p>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              <div className="np-input-wrapper">
                <label className="np-input-label" htmlFor="access-code">Access code</label>
                <input
                  type="text"
                  id="access-code"
                  className="np-input-field"
                  placeholder="e.g. NP-8X2K9"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(209,75,75,0.08)', border: '1px solid rgba(209,75,75,0.25)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--np-danger)', fontSize: '13.5px', fontWeight: 500 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="np-btn-primary" 
                style={{ width: '100%', padding: '14px' }} 
                disabled={isLoading}
              >
                {isLoading && (
                  <span className="np-icon np-spin">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="6"/>
                      <line x1="12" y1="18" x2="12" y2="22"/>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                      <line x1="2" y1="12" x2="6" y2="12"/>
                      <line x1="18" y1="12" x2="22" y2="12"/>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                    </svg>
                  </span>
                )}
                {isSuccess ? 'Authorizing…' : isLoading ? 'Verifying' : 'Verify & Enter'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
