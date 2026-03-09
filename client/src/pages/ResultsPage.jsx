import React from 'react';
import ScoreRing from '../components/ScoreRing.jsx';
import MetricBar from '../components/MetricBar.jsx';
import CoachingCard from '../components/CoachingCard.jsx';
import EmailCapture from '../components/EmailCapture.jsx';

const SCENARIO_LABELS = {
  pitching_to_executives: 'Pitching to Executives',
  talking_to_manager: 'Talking to Your Manager',
  explaining_to_stakeholders: 'Explaining to Stakeholders',
};

const METRIC_KEYS = ['impact_first', 'narrative_coherence', 'audience_adaptation'];

function Divider() {
  return (
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
      margin: '32px 0',
    }} />
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '0.7rem', fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--text-dim)', marginBottom: 18,
    }}>
      {children}
    </p>
  );
}

export default function ResultsPage({ results, scenario, onRestart }) {
  const { pass1, pass2, session_id } = results;

  return (
    <div>
      {/* Header */}
      <div className="animate-in" style={{ textAlign: 'center', marginBottom: 36 }}>
        <span style={{
          background: 'var(--violet-dim)',
          border: '1px solid rgba(177,151,252,0.3)',
          borderRadius: 999, padding: '5px 14px',
          fontSize: '0.75rem', fontWeight: 600,
          color: 'var(--violet)',
          fontFamily: "'Space Grotesk', sans-serif",
          display: 'inline-block', marginBottom: 20,
        }}>
          {SCENARIO_LABELS[scenario]}
        </span>

        {/* Score ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <ScoreRing score={pass1.overall_score} label={pass1.overall_label} />
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: 12 }}>
          {pass1.scoring_notes}
        </p>
      </div>

      <Divider />

      {/* Metric bars */}
      <div className="animate-in animate-in-delay-1">
        <SectionLabel>Score Breakdown</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {METRIC_KEYS.map(key => (
            <MetricBar key={key} metricKey={key} data={pass1.metrics[key]} />
          ))}
        </div>
      </div>

      <Divider />

      {/* Strength acknowledgment */}
      <div className="animate-in animate-in-delay-2">
        <SectionLabel>What's Working</SectionLabel>
        <div style={{
          background: 'var(--mint-dim)',
          border: '1px solid rgba(78,204,163,0.2)',
          borderRadius: 14, padding: '18px 20px',
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>✦</span>
          <p style={{ color: 'var(--text)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {pass2.strength_acknowledgment}
          </p>
        </div>
      </div>

      <Divider />

      {/* Coaching points */}
      <div className="animate-in animate-in-delay-3">
        <SectionLabel>Your Top 3 Improvements</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pass2.coaching_points.map((point, i) => (
            <CoachingCard key={i} point={point} index={i} />
          ))}
        </div>
      </div>

      <Divider />

      {/* Rewrite suggestion */}
      <div className="animate-in">
        <SectionLabel>Suggested Rewrite</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--rose)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>ORIGINAL</p>
            <div className="rewrite-box original">"{pass2.rewrite_suggestion.original}"</div>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '1.25rem' }}>↓</div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--mint)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>IMPROVED</p>
            <div className="rewrite-box improved">"{pass2.rewrite_suggestion.improved}"</div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 4 }}>
            {pass2.rewrite_suggestion.explanation}
          </p>
        </div>
      </div>

      <Divider />

      {/* Scenario context note */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: '16px 20px',
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--violet)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em' }}>
          WHY THESE WEIGHTS?
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {pass2.scenario_context_note}
        </p>
      </div>

      {/* Email capture */}
      <EmailCapture sessionId={session_id} />

      {/* Restart */}
      <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 40 }}>
        <button className="btn-ghost" onClick={onRestart}>
          Score another communication
        </button>
      </div>
    </div>
  );
}
