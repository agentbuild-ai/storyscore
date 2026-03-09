import React, { useState } from 'react';
import StepDots from '../components/StepDots.jsx';

const SCENARIO_LABELS = {
  pitching_to_executives: 'Pitching to Executives',
  talking_to_manager: 'Talking to Your Manager',
  explaining_to_stakeholders: 'Explaining to Stakeholders',
};

const QUESTIONS = [
  { key: 'q1', label: 'Who is your audience?', placeholder: 'e.g. CFO, VP of Engineering, non-technical stakeholders' },
  { key: 'q2', label: 'What do you want them to do or decide?', placeholder: 'e.g. Approve $500K budget, greenlight the project, understand the delay' },
  { key: 'q3', label: 'Any additional context?', placeholder: 'e.g. 5-minute verbal pitch, async email, first time presenting to this group' },
];

export default function ContextPage({ scenario, onSubmit, onBack }) {
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });

  function handleSubmit() {
    onSubmit(answers);
  }

  return (
    <div className="animate-in">
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Back
      </button>

      <StepDots current="context" />

      {/* Scenario badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <span style={{
          background: 'var(--violet-dim)',
          border: '1px solid rgba(177,151,252,0.3)',
          borderRadius: 999, padding: '6px 16px',
          fontSize: '0.8125rem', fontWeight: 600,
          color: 'var(--violet)',
          fontFamily: "'Space Grotesk', sans-serif",
          boxShadow: '0 0 12px rgba(177,151,252,0.2)',
        }}>
          {SCENARIO_LABELS[scenario]}
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.375rem', fontWeight: 700,
          color: 'var(--text)', marginBottom: 8,
        }}>
          A little context helps us score better
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          All fields are optional — skip any that don't apply.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {QUESTIONS.map((q, i) => (
          <div key={q.key} className={`animate-in animate-in-delay-${i + 1}`}>
            <label style={{
              display: 'block', marginBottom: 8,
              fontSize: '0.875rem', fontWeight: 500,
              color: 'var(--text)',
            }}>
              {q.label}
              <span style={{ color: 'var(--text-dim)', fontWeight: 400, marginLeft: 8 }}>optional</span>
            </label>
            <input
              className="input"
              type="text"
              placeholder={q.placeholder}
              value={answers[q.key]}
              onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <button className="btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
          Continue →
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
        Your answers are used only for scoring — never stored without your permission.
      </p>
    </div>
  );
}
