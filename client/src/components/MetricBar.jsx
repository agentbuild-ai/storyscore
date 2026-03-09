import React from 'react';

const METRIC_COLORS = {
  impact_first:        { color: '#FF8FAB', glow: 'rgba(255,143,171,0.6)',  label: 'Impact', name: 'Leading with the point' },
  narrative_coherence: { color: '#B197FC', glow: 'rgba(177,151,252,0.6)', label: 'Flow',   name: 'Structure & progression' },
  audience_adaptation: { color: '#4ECCA3', glow: 'rgba(78,204,163,0.6)',  label: 'Tone',   name: 'Audience fit' },
};

function bandColor(score) {
  if (score >= 85) return '#4ECCA3';
  if (score >= 70) return '#B197FC';
  if (score >= 55) return '#B197FC';
  if (score >= 40) return '#FF8FAB';
  return '#FF8FAB';
}

export default function MetricBar({ metricKey, data }) {
  const config = METRIC_COLORS[metricKey] || {};
  const { color, glow, label, name } = config;
  const score = data.score;
  const bc = bandColor(score);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '0.7rem',
            letterSpacing: '0.1em', color,
            background: `${color}18`,
            border: `1px solid ${color}40`,
            borderRadius: 6, padding: '2px 8px',
          }}>
            {label}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '1.25rem',
            color: bc, textShadow: `0 0 12px ${glow}`,
          }}>
            {score}
          </span>
          <span style={{
            fontSize: '0.7rem', color: bc,
            background: `${bc}15`,
            border: `1px solid ${bc}30`,
            borderRadius: 6, padding: '2px 8px',
            fontWeight: 600,
          }}>
            {data.band}
          </span>
        </div>
      </div>

      {/* Bar */}
      <div className="metric-bar-track">
        <div
          className="metric-bar-fill"
          style={{
            '--bar-width': `${score}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 10px ${glow}`,
          }}
        />
      </div>

      {/* Driver sentence */}
      {data.primary_driver && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          {data.primary_driver}
        </p>
      )}
    </div>
  );
}
