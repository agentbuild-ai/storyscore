import React, { useState } from 'react';

const CARDS = [
  {
    id: 'pitching_to_executives',
    label: 'Executive Presence',
    title: 'Talk to\nExecutives',
    hook: 'Make your case before they lose interest.',
    bullets: [
      'Board decks and budget requests',
      'Strategic proposals that stick',
      'Saying more with fewer words',
    ],
    color: '#B197FC',
    glow: 'rgba(177,151,252,0.45)',
    dim: 'rgba(177,151,252,0.10)',
    rotate: '-6deg',
    translateY: '14px',
    zIndex: 1,
  },
  {
    id: 'explaining_to_stakeholders',
    label: 'Cross-Functional',
    title: 'Pitch Your\nProject',
    hook: 'Turn your work into a story people fund.',
    bullets: [
      'Technical ideas for non-technical rooms',
      'Project pitches that get green-lit',
      'Cutting jargon without losing credibility',
    ],
    color: '#4ECCA3',
    glow: 'rgba(78,204,163,0.45)',
    dim: 'rgba(78,204,163,0.10)',
    rotate: '0deg',
    translateY: '0px',
    zIndex: 3,
  },
  {
    id: 'talking_to_manager',
    label: 'Managing Up',
    title: 'Talk to Your\nManager',
    hook: 'Get heard, get support, get promoted.',
    bullets: [
      'Status updates that actually land',
      'Escalations that don\'t backfire',
      'Asking for what you need with confidence',
    ],
    color: '#FF8FAB',
    glow: 'rgba(255,143,171,0.45)',
    dim: 'rgba(255,143,171,0.10)',
    rotate: '6deg',
    translateY: '14px',
    zIndex: 2,
  },
];

export default function LandingPage({ onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 24px 80px',
      overflowX: 'hidden',
    }}>

      {/* Top nav with logo */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '20px 0',
        marginBottom: 48,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo mark */}
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #B197FC, #9B7AFF)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(177,151,252,0.5)',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 3h12M2 6h8M2 9h10M2 12h6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Wordmark */}
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em',
            color: 'var(--text)',
          }}>
            Story<span style={{ color: '#B197FC' }}>Score</span>
          </span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 580, marginBottom: 72 }} className="animate-in">
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(177,151,252,0.10)',
          border: '1px solid rgba(177,151,252,0.25)',
          borderRadius: 999, padding: '5px 14px',
          marginBottom: 24,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#B197FC',
            boxShadow: '0 0 8px rgba(177,151,252,0.8)',
            display: 'inline-block',
          }} />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#B197FC',
          }}>
            AI Communication Coach
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2.4rem, 6vw, 3.5rem)',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          marginBottom: 20,
          background: 'linear-gradient(140deg, #F0EEFF 0%, #B197FC 55%, #FF8FAB 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Good ideas deserve<br />stories people follow.
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          maxWidth: 460,
          margin: '0 auto 16px',
        }}>
          Most professionals were never taught to communicate at work.
          StoryScore scores your writing, shows you where it loses people,
          and coaches you to tell stories anyone can understand.
        </p>

        {/* Trust line */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 8 }}>
          No account · No credit card · Results in seconds · Your data is never sold or shared
        </p>
      </div>

      {/* Card deck */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 20,
        width: '100%',
        maxWidth: 860,
        flexWrap: 'wrap',
      }}
        className="animate-in animate-in-delay-1"
      >
        {CARDS.map((card) => {
          const isHovered = hoveredId === card.id;
          return (
            <button
              key={card.id}
              onClick={() => onSelect(card.id)}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: isHovered ? `${card.dim}` : 'var(--surface)',
                border: `1px solid ${isHovered ? card.color : 'var(--border)'}`,
                borderRadius: 20,
                padding: '32px 28px 36px',
                width: 240,
                minHeight: 360,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                cursor: 'pointer',
                transform: isHovered
                  ? 'rotate(0deg) translateY(-16px)'
                  : `rotate(${card.rotate}) translateY(${card.translateY})`,
                zIndex: isHovered ? 10 : card.zIndex,
                boxShadow: isHovered
                  ? `0 20px 60px ${card.glow}, 0 0 0 1px ${card.color}40`
                  : '0 4px 24px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s, background 0.3s',
                flexShrink: 0,
              }}
            >
              {/* Label badge */}
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: card.color,
                background: `${card.color}15`,
                border: `1px solid ${card.color}35`,
                borderRadius: 6, padding: '3px 9px',
                marginBottom: 20,
              }}>
                {card.label}
              </span>

              {/* Title */}
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                marginBottom: 14,
                whiteSpace: 'pre-line',
              }}>
                {card.title}
              </h2>

              {/* Hook */}
              <p style={{
                fontSize: '0.875rem',
                color: card.color,
                fontWeight: 500,
                lineHeight: 1.5,
                marginBottom: 20,
              }}>
                {card.hook}
              </p>

              {/* Divider */}
              <div style={{
                width: '100%', height: 1,
                background: `linear-gradient(90deg, ${card.color}30, transparent)`,
                marginBottom: 18,
              }} />

              {/* Bullets */}
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 10,
                flex: 1,
              }}>
                {card.bullets.map((b) => (
                  <li key={b} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 9,
                    fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45,
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: card.color, flexShrink: 0,
                      marginTop: 5,
                      boxShadow: `0 0 6px ${card.glow}`,
                    }} />
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div style={{
                marginTop: 28,
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '0.8rem',
                color: card.color,
                opacity: isHovered ? 1 : 0.6,
                transition: 'opacity 0.2s',
              }}>
                Start coaching
                <span style={{
                  display: 'inline-block',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.2s',
                }}>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom hint */}
      <p style={{
        marginTop: 52,
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        textAlign: 'center',
      }}
        className="animate-in animate-in-delay-2"
      >
        Pick a scenario to begin your coaching session
      </p>
    </div>
  );
}
