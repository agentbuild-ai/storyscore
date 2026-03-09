import React, { useState } from 'react';
import { submitEmail } from '../utils/api.js';

export default function EmailCapture({ sessionId }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || status !== 'idle') return;
    setStatus('loading');
    try {
      await submitEmail({ session_id: sessionId, email });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <span style={{ color: 'var(--mint)', fontSize: '1.25rem' }}>✓</span>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 6 }}>
          Got it — we'll be in touch.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14, padding: '24px',
      marginTop: 32,
    }}>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600, fontSize: '0.9375rem',
        color: 'var(--text)', marginBottom: 6,
      }}>
        Want to keep this report?
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 16 }}>
        Enter your email and we'll send you a link to your results.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
        <input
          className="input"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="btn-primary"
          type="submit"
          disabled={!email || status === 'loading'}
          style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}
        >
          {status === 'loading' ? '...' : 'Send'}
        </button>
      </form>
      {status === 'error' && (
        <p style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: 8 }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
