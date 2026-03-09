import React from 'react';

export default function PrivacyBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      marginBottom: 6,
    }}>
      {/* Inline shield-check SVG — no lucide dependency */}
      <svg
        width="13" height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-dim)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
      <span style={{
        fontSize: '0.72rem',
        color: 'var(--text-dim)',
        lineHeight: 1.4,
      }}>
        Your submission is scored and not stored. We never train AI on your text.{' '}
        <span style={{ color: 'var(--text-muted)' }}>
          Tip: Replace sensitive details with [placeholders].
        </span>
      </span>
    </div>
  );
}
