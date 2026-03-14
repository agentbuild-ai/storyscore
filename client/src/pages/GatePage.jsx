import React, { useState } from 'react';

const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE;

export default function GatePage({ onUnlock }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim() === ACCESS_CODE) {
      localStorage.setItem('ss_access', ACCESS_CODE);
      onUnlock();
    } else {
      setError(true);
      setInput('');
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
      }}
        className="animate-in"
      >
        {/* Logo mark */}
        <div style={{
          width: 48, height: 48,
          background: 'linear-gradient(135deg, #B197FC, #9B7AFF)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(177,151,252,0.5)',
          margin: '0 auto 24px',
        }}>
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
            <path d="M2 3h12M2 6h8M2 9h10M2 12h6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1.5rem', fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          marginBottom: 8,
        }}>
          Story<span style={{ color: '#B197FC' }}>Score</span>
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          This is a private beta. Enter your access code to continue.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="input"
            type="password"
            placeholder="Access code"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            autoFocus
            style={{ textAlign: 'center', letterSpacing: '0.1em' }}
          />
          {error && (
            <p style={{ color: 'var(--rose)', fontSize: '0.85rem', margin: 0 }}>
              That code doesn't look right. Try again.
            </p>
          )}
          <button
            className="btn-primary"
            type="submit"
            disabled={!input.trim()}
            style={{ width: '100%' }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
