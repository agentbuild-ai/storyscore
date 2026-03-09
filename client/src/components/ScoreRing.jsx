import React, { useEffect, useState } from 'react';

const TIER_CONFIG = {
  'Executive-Ready':           { color: '#4ECCA3', glow: 'rgba(78,204,163,0.7)'  },
  'Strong Foundation':         { color: '#B197FC', glow: 'rgba(177,151,252,0.7)' },
  'Developing':                { color: '#B197FC', glow: 'rgba(177,151,252,0.5)' },
  'Needs Significant Work':    { color: '#FF8FAB', glow: 'rgba(255,143,171,0.6)' },
  'Fundamental Revision Required': { color: '#FF8FAB', glow: 'rgba(255,143,171,0.4)' },
};

export default function ScoreRing({ score, label }) {
  const [animated, setAnimated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const { color, glow } = TIER_CONFIG[label] || TIER_CONFIG['Developing'];
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const offset = animated ? circumference - (score / 100) * circumference : circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Count-up animation
  useEffect(() => {
    if (!animated) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = score / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) { setDisplayScore(score); clearInterval(timer); }
      else setDisplayScore(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [animated, score]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ position: 'relative', width: 200, height: 200 }}>
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="100" cy="100" r={radius} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
          {/* Progress arc */}
          <circle cx="100" cy="100" r={radius} fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.3s cubic-bezier(0.16,1,0.3,1)',
              filter: `drop-shadow(0 0 8px ${glow}) drop-shadow(0 0 16px ${glow})`,
            }}
          />
        </svg>
        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '3.25rem', fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            color, lineHeight: 1,
            textShadow: `0 0 24px ${glow}, 0 0 48px ${glow}`,
          }}>
            {displayScore}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.1em', marginTop: 4 }}>
            OUT OF 100
          </span>
        </div>
      </div>

      {/* Tier badge */}
      <div className="tier-badge" style={{ color, borderColor: color, boxShadow: `0 0 16px ${glow}` }}>
        <span style={{ fontSize: '1rem' }}>
          {label === 'Executive-Ready' ? '★' :
           label === 'Strong Foundation' ? '◆' :
           label === 'Developing' ? '▲' :
           label === 'Needs Significant Work' ? '●' : '○'}
        </span>
        {label}
      </div>
    </div>
  );
}
