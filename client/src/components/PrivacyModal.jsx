import React, { useState } from 'react';

const SESSION_KEY = 'ss_privacy_seen';

export default function PrivacyModal() {
  const [visible, setVisible] = useState(
    () => !sessionStorage.getItem(SESSION_KEY)
  );

  if (!visible) return null;

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
  }

  const items = [
    {
      q: 'Does anyone read my submissions?',
      a: 'No. During beta, sessions may be reviewed anonymously to improve scoring accuracy. Post-beta, we don\'t read individual submissions.',
    },
    {
      q: 'Does the AI train on my text?',
      a: 'No. Your text is processed for scoring only and never used to train any model.',
    },
    {
      q: 'Is my text stored after scoring?',
      a: 'No. Submissions are scored and discarded. We store your scores and feedback, not your text.',
    },
    {
      q: 'Is my submission linked to my identity?',
      a: 'No. Scores are stored without the original text. Email is optional and only used to send your scorecard.',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10, 7, 24, 0.85)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 100,
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 101,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '32px 28px',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(177,151,252,0.10)',
              border: '1px solid rgba(177,151,252,0.25)',
              borderRadius: 999, padding: '4px 12px',
              marginBottom: 14,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B197FC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#B197FC',
              }}>
                How we handle your data
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.25rem', fontWeight: 800,
              color: 'var(--text)',
              lineHeight: 1.2, marginBottom: 6,
            }}>
              Your submissions stay private.
            </h2>
            <p style={{
              fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6,
            }}>
              Four quick answers before you start.
            </p>
          </div>

          {/* Q&A items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
            {items.map(({ q, a }) => (
              <div key={q} style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '13px 15px',
              }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '0.8rem',
                  color: 'var(--text)', marginBottom: 4,
                }}>
                  {q}
                </p>
                <p style={{
                  fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55,
                }}>
                  {a}
                </p>
              </div>
            ))}
          </div>

          {/* Placeholder tip */}
          <div style={{
            background: 'rgba(177,151,252,0.07)',
            border: '1px solid rgba(177,151,252,0.2)',
            borderRadius: 10,
            padding: '11px 14px',
            marginBottom: 22,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--text)' }}>Tip:</strong> You can replace sensitive details with placeholders like{' '}
              <code style={{
                background: 'rgba(177,151,252,0.15)', color: '#B197FC',
                borderRadius: 4, padding: '1px 5px', fontSize: '0.75rem',
              }}>[Company]</code>,{' '}
              <code style={{
                background: 'rgba(177,151,252,0.15)', color: '#B197FC',
                borderRadius: 4, padding: '1px 5px', fontSize: '0.75rem',
              }}>[$X]</code>,{' '}
              <code style={{
                background: 'rgba(177,151,252,0.15)', color: '#B197FC',
                borderRadius: 4, padding: '1px 5px', fontSize: '0.75rem',
              }}>[Product Name]</code>.{' '}
              Scoring works just as well.
            </p>
          </div>

          {/* CTA */}
          <button
            className="btn-primary"
            onClick={dismiss}
            style={{ width: '100%', padding: '14px', fontSize: '0.9375rem' }}
          >
            Got it, let's score
          </button>
        </div>
      </div>
    </>
  );
}
