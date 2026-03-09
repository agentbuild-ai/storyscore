import React, { useState } from 'react';
import StepDots from '../components/StepDots.jsx';

const SCENARIO_LABELS = {
  pitching_to_executives: 'Pitching to Executives',
  talking_to_manager: 'Talking to Your Manager',
  explaining_to_stakeholders: 'Explaining to Stakeholders',
};

const MIN_WORDS = 100;
const MAX_WORDS = 3000;

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function InputPage({ scenario, onSubmit, onBack, serverError }) {
  const [text, setText] = useState('');
  const wordCount = countWords(text);

  const wordCountColor =
    text.trim() === '' ? 'var(--text-dim)' :
    wordCount < MIN_WORDS ? 'var(--rose)' :
    wordCount > MAX_WORDS ? 'var(--rose)' :
    'var(--mint)';

  const canSubmit = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;

  return (
    <div className="animate-in">
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Back
      </button>

      <StepDots current="input" />

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
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

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.375rem', fontWeight: 700,
          color: 'var(--text)', marginBottom: 8,
        }}>
          Paste your communication
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Emails, scripts, presentations, Slack messages — paste exactly what you said or plan to say.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          className="input"
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ minHeight: 280 }}
        />
        <div style={{
          position: 'absolute', bottom: 12, right: 14,
          fontSize: '0.8rem', fontWeight: 600,
          color: wordCountColor,
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'color 0.3s',
        }}>
          {wordCount} / {MAX_WORDS}
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 8 }}>
        {wordCount > 0 && wordCount < MIN_WORDS
          ? `Add ${MIN_WORDS - wordCount} more words to unlock scoring`
          : wordCount > MAX_WORDS
          ? `${wordCount - MAX_WORDS} words over the limit — trim it down`
          : 'Minimum 100 words · Maximum 3,000 words'}
      </p>

      {serverError && (
        <div style={{
          color: 'var(--rose)', fontSize: '0.875rem',
          marginTop: 14, padding: '12px 16px',
          background: 'var(--rose-dim)',
          border: '1px solid rgba(255,143,171,0.25)',
          borderRadius: 10,
        }}>
          {serverError}
        </div>
      )}

      <button
        className="btn-primary"
        onClick={() => onSubmit(text.trim())}
        disabled={!canSubmit}
        style={{ width: '100%', marginTop: 20 }}
      >
        Score My Communication
      </button>
    </div>
  );
}
