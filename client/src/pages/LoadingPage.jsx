import React, { useEffect, useState } from 'react';

const MESSAGES = [
  'Reading your communication…',
  'Scoring impact and structure…',
  'Evaluating audience calibration…',
  'Generating coaching feedback…',
  'Almost there…',
];

export default function LoadingPage() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 32 }}>
      {/* Loading ring */}
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        {/* Spinning ring */}
        <svg width="100" height="100" style={{ animation: 'spin 2s linear infinite' }}>
          <circle cx="50" cy="50" r="40" fill="none"
            stroke="rgba(177,151,252,0.15)" strokeWidth="4" />
          <circle cx="50" cy="50" r="40" fill="none"
            stroke="var(--violet)" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="60 190"
            style={{ filter: 'drop-shadow(0 0 8px var(--violet-glow))' }}
          />
        </svg>
        {/* Orbiting dot */}
        <div className="orbit-dot" />
      </div>

      {/* Messages */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1rem', fontWeight: 600,
          color: 'var(--text)', marginBottom: 8,
          transition: 'opacity 0.4s',
        }}>
          {MESSAGES[msgIndex]}
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          Two-pass AI analysis in progress
        </p>
      </div>

      {/* Pulsing dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--violet)',
            boxShadow: '0 0 8px var(--violet-glow)',
            animation: `pulseGlow 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
