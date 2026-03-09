import React from 'react';
import StepDots from '../components/StepDots.jsx';

const SCENARIOS = [
  {
    id: 'pitching_to_executives',
    icon: '🎯',
    title: 'Pitching to Executives',
    description: 'Board decks, budget requests, strategic proposals — make your case to decision-makers.',
  },
  {
    id: 'talking_to_manager',
    icon: '💬',
    title: 'Talking to Your Manager',
    description: 'Status updates, escalations, asks — communicate up with clarity and confidence.',
  },
  {
    id: 'explaining_to_stakeholders',
    icon: '🔍',
    title: 'Explaining to Stakeholders',
    description: 'Technical work translated for non-technical audiences — no jargon, full impact.',
  },
];

export default function ScenarioPage({ onSelect }) {
  return (
    <div className="animate-in">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '2.25rem', fontWeight: 700,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #F0EEFF 0%, #B197FC 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 10,
        }}>
          StoryScore
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Find out how your communication lands — before it matters.
        </p>
      </div>

      <StepDots current="scenario" />

      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600, fontSize: '1rem',
        color: 'var(--text)', marginBottom: 16, textAlign: 'center',
      }}>
        What's your communication scenario?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="card"
            style={{
              animationDelay: `${i * 0.08}s`,
              padding: '22px 24px',
              display: 'flex', alignItems: 'flex-start', gap: 18,
              cursor: 'pointer', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 16,
              textAlign: 'left', width: '100%',
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
            }}
          >
            <span style={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
            <div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: '1rem',
                color: 'var(--text)', marginBottom: 4,
              }}>
                {s.title}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {s.description}
              </p>
            </div>
            <span style={{ color: 'var(--text-dim)', marginLeft: 'auto', flexShrink: 0, alignSelf: 'center' }}>→</span>
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', marginTop: 28, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
        No account required · Results in under 30 seconds
      </p>
    </div>
  );
}
