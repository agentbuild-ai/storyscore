import React, { useState } from 'react';

export default function CoachingCard({ point, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="coaching-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', padding: 0,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}
      >
        <span style={{
          flexShrink: 0,
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--violet-dim)',
          border: '1px solid var(--violet)',
          color: 'var(--violet)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.75rem', fontWeight: 700,
          boxShadow: '0 0 8px var(--violet-glow)',
          marginTop: 2,
        }}>
          {index + 1}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, fontSize: '0.9375rem',
            color: 'var(--text)', lineHeight: 1.4,
          }}>
            {point.headline}
          </p>
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', flexShrink: 0, marginTop: 4 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div style={{ marginTop: 14, paddingLeft: 36 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {point.detail}
          </p>
          {point.text_reference && (
            <blockquote className="evidence" style={{ marginTop: 12 }}>
              "{point.text_reference}"
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
}
