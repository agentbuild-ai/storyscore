import React, { useEffect } from 'react';
import MetricBar from './MetricBar.jsx';
import CoachingCard from './CoachingCard.jsx';

const METRIC_KEYS = ['impact_first', 'narrative_coherence', 'audience_adaptation'];

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '0.65rem', fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--text-dim)', marginBottom: 16,
    }}>
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
      margin: '28px 0',
    }} />
  );
}

export default function FeedbackPanel({ results, onClose }) {
  const { pass1, pass2 } = results;

  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(14,10,30,0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
        }}
      />

      {/* Sheet — slides up from bottom */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 51,
        display: 'flex', justifyContent: 'center',
      }}>
        <div
          className="feedback-panel"
          style={{ width: '100%', maxWidth: 680 }}
        >
          {/* Drag handle */}
          <div style={{
            width: 36, height: 4, background: 'var(--border)',
            borderRadius: 2, margin: '0 auto 20px',
          }} />

          {/* Title row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 24,
          }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)',
            }}>
              Detailed Feedback
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--text-muted)', cursor: 'pointer',
                borderRadius: 8, padding: '5px 12px', fontSize: '0.8rem',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Close ×
            </button>
          </div>

          {/* Overall score */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px', marginBottom: 28,
            background: 'var(--surface-2)', borderRadius: 14,
            border: '1px solid var(--border)',
          }}>
            <span style={{
              fontSize: '2.75rem', fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, color: 'var(--violet)',
              textShadow: '0 0 24px rgba(177,151,252,0.5)',
              lineHeight: 1,
            }}>
              {pass1.overall_score}
            </span>
            <div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)',
                marginBottom: 4,
              }}>
                {pass1.overall_label}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {pass1.scoring_notes}
              </p>
            </div>
          </div>

          {/* Score breakdown */}
          <SectionLabel>Score Breakdown</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {METRIC_KEYS.map(key => (
              <MetricBar key={key} metricKey={key} data={pass1.metrics[key]} />
            ))}
          </div>

          <Divider />

          {/* What's working */}
          <SectionLabel>What's Working</SectionLabel>
          <div style={{
            background: 'var(--mint-dim)',
            border: '1px solid rgba(78,204,163,0.2)',
            borderRadius: 14, padding: '16px 18px',
            display: 'flex', gap: 12, alignItems: 'flex-start',
            marginBottom: 4,
          }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>✦</span>
            <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              {pass2.strength_acknowledgment}
            </p>
          </div>

          <Divider />

          {/* Coaching points */}
          <SectionLabel>Top 3 Improvements</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pass2.coaching_points.map((point, i) => (
              <CoachingCard key={i} point={point} index={i} />
            ))}
          </div>

          <Divider />

          {/* Rewrite suggestion */}
          <SectionLabel>Suggested Rewrite</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <p style={{ fontSize: '0.68rem', color: 'var(--rose)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>
                ORIGINAL
              </p>
              <div className="rewrite-box original">"{pass2.rewrite_suggestion.original}"</div>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '1.1rem' }}>↓</div>
            <div>
              <p style={{ fontSize: '0.68rem', color: 'var(--mint)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>
                IMPROVED
              </p>
              <div className="rewrite-box improved">"{pass2.rewrite_suggestion.improved}"</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.65, marginTop: 4 }}>
              {pass2.rewrite_suggestion.explanation}
            </p>
          </div>

          <Divider />

          {/* Scenario context note */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12, padding: '14px 18px',
            marginBottom: 8,
          }}>
            <p style={{
              fontSize: '0.68rem', color: 'var(--violet)',
              fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em',
            }}>
              WHY THESE WEIGHTS?
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              {pass2.scenario_context_note}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
