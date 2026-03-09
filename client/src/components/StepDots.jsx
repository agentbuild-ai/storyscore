import React from 'react';

const STEPS = ['context', 'chat'];

export default function StepDots({ current }) {
  const currentIndex = STEPS.indexOf(current);
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{
          width: i === currentIndex ? 24 : 8,
          height: 8,
          borderRadius: 999,
          background: i === currentIndex
            ? 'var(--violet)'
            : i < currentIndex
            ? 'rgba(177,151,252,0.4)'
            : 'rgba(255,255,255,0.1)',
          boxShadow: i === currentIndex ? '0 0 10px var(--violet-glow)' : 'none',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  );
}
