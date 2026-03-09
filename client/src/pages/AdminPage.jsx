import React, { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

const SCENARIO_LABELS = {
  pitching_to_executives:    'Pitching to Executives',
  talking_to_manager:        'Talking to Manager',
  explaining_to_stakeholders:'Explaining to Stakeholders',
};

const SCENARIO_COLORS = {
  pitching_to_executives:    '#B197FC',
  talking_to_manager:        '#FF8FAB',
  explaining_to_stakeholders:'#4ECCA3',
};

const BAND_LABELS = {
  executive_ready: 'Executive Ready',
  strong:          'Strong',
  developing:      'Developing',
  needs_work:      'Needs Work',
};

const BAND_COLORS = {
  executive_ready: '#4ECCA3',
  strong:          '#B197FC',
  developing:      '#B197FC',
  needs_work:      '#FF8FAB',
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color = 'var(--violet)' }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
      flex: 1,
      minWidth: 160,
    }}>
      <p style={{ margin: '0 0 6px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, color }}>
        {value}
      </p>
      {sub && (
        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</p>
      )}
    </div>
  );
}

function ActivityChart({ sessionsByDay }) {
  if (!sessionsByDay?.length) return null;
  const max = Math.max(...sessionsByDay.map(d => d.count), 1);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
    }}>
      <p style={{ margin: '0 0 16px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
        Sessions — Last 30 Days
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
        {sessionsByDay.map(({ date, count }) => (
          <div
            key={date}
            title={`${date}: ${count} session${count !== 1 ? 's' : ''}`}
            style={{
              flex: 1,
              height: `${Math.max((count / max) * 80, count > 0 ? 4 : 1)}px`,
              background: count > 0 ? 'var(--violet)' : 'rgba(255,255,255,0.05)',
              borderRadius: '3px 3px 0 0',
              transition: 'background 0.2s',
              cursor: count > 0 ? 'default' : undefined,
              boxShadow: count > 0 ? '0 0 6px var(--violet-glow)' : 'none',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
          {sessionsByDay[0]?.date}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
          {sessionsByDay[sessionsByDay.length - 1]?.date}
        </span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.85rem', color }}>{value}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function ScenarioCard({ data }) {
  const color = SCENARIO_COLORS[data.scenario] || 'var(--violet)';
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${color}30`,
      borderRadius: 14,
      padding: '20px 24px',
      flex: 1,
      minWidth: 200,
    }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{
          display: 'inline-block',
          background: `${color}15`, border: `1px solid ${color}35`,
          borderRadius: 6, padding: '2px 9px',
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color,
        }}>
          {SCENARIO_LABELS[data.scenario] || data.scenario}
        </span>
      </div>
      <p style={{ margin: '0 0 14px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, color }}>
        {data.count} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 400 }}>sessions</span>
      </p>
      <ScoreBar label="Overall" value={data.avg_overall} color={color} />
      <ScoreBar label="Impact"  value={data.avg_impact}  color={color} />
      <ScoreBar label="Flow"    value={data.avg_flow}    color={color} />
      <ScoreBar label="Tone"    value={data.avg_tone}    color={color} />
    </div>
  );
}

function DistributionBar({ distribution }) {
  const total = Object.values(distribution).reduce((s, v) => s + v, 0);
  if (!total) return null;

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '20px 24px',
    }}>
      <p style={{ margin: '0 0 16px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
        Score Distribution
      </p>
      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
        {Object.entries(distribution).map(([band, count]) => (
          count > 0 && (
            <div
              key={band}
              title={`${BAND_LABELS[band]}: ${count}`}
              style={{
                width: `${(count / total) * 100}%`,
                background: BAND_COLORS[band],
                transition: 'width 0.4s',
              }}
            />
          )
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px' }}>
        {Object.entries(distribution).map(([band, count]) => (
          <div key={band} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: BAND_COLORS[band], flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {BAND_LABELS[band]} <span style={{ color: 'var(--text)', fontWeight: 600 }}>{count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Password gate ─────────────────────────────────────────────────────────────

function LoginGate({ onAuth }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!token.trim()) return;
    onAuth(token.trim());
    setError('Wrong token. Try again.');
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 360,
      }}>
        <p style={{ margin: '0 0 4px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
          Admin Dashboard
        </p>
        <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Enter your admin token to continue.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="input"
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={e => { setToken(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--rose)' }}>{error}</p>}
          <button className="btn-primary" type="submit" style={{ marginTop: 4 }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Sessions tab ──────────────────────────────────────────────────────────────

function SessionsTab({ token }) {
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`${BASE}/api/admin/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!json.success) { setError(json.error || 'Failed to load.'); return; }
        setSessions(json.data.sessions);
      } catch {
        setError('Could not reach the server.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading…</p>;
  if (error)   return <p style={{ color: 'var(--rose)', padding: 40, textAlign: 'center' }}>{error}</p>;

  const scenarios = ['all', ...Object.keys(SCENARIO_LABELS)];
  const visible = filter === 'all' ? sessions : sessions.filter(s => s.scenario === filter);

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: 4 }}>Filter:</span>
        {scenarios.map(s => {
          const active = filter === s;
          const color  = s === 'all' ? 'var(--violet)' : (SCENARIO_COLORS[s] || 'var(--violet)');
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                background: active ? `${color}20` : 'transparent',
                border: `1px solid ${active ? color : 'var(--border)'}`,
                borderRadius: 999, padding: '4px 12px',
                fontSize: '0.7rem', fontWeight: 600,
                color: active ? color : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {s === 'all' ? 'All' : SCENARIO_LABELS[s]}
            </button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {visible.length} session{visible.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Session cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visible.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: 40 }}>
            No sessions yet.
          </p>
        )}
        {visible.map((s, i) => {
          const color     = SCENARIO_COLORS[s.scenario] || 'var(--violet)';
          const isOpen    = expanded === i;
          const preview   = s.input_text ? s.input_text.slice(0, 280) + (s.input_text.length > 280 ? '…' : '') : null;
          const full      = s.input_text || '';
          const scoreColor = s.overall_score >= 70 ? '#4ECCA3' : s.overall_score >= 50 ? '#B197FC' : '#FF8FAB';

          return (
            <div key={s.session_id} style={{
              background: 'var(--surface)',
              border: `1px solid ${isOpen ? color + '50' : 'var(--border)'}`,
              borderRadius: 14,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Card header */}
              <div
                onClick={() => setExpanded(isOpen ? null : i)}
                style={{
                  padding: '14px 18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                }}
              >
                <span style={{
                  background: `${color}15`, border: `1px solid ${color}30`,
                  borderRadius: 6, padding: '2px 8px',
                  fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color, flexShrink: 0,
                }}>
                  {SCENARIO_LABELS[s.scenario] || s.scenario}
                </span>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {s.created_at.slice(0, 10)}
                </span>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', flexShrink: 0 }}>
                  {s.word_count} words
                </span>

                {/* Score chips */}
                <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
                  {[
                    { label: 'Impact', val: s.ifs_score, c: '#FF8FAB' },
                    { label: 'Flow',   val: s.nci_score, c: '#B197FC' },
                    { label: 'Tone',   val: s.aas_score, c: '#4ECCA3' },
                  ].map(({ label, val, c }) => val != null && (
                    <span key={label} style={{
                      fontSize: '0.65rem', fontWeight: 700, color: c,
                      background: `${c}15`, border: `1px solid ${c}30`,
                      borderRadius: 5, padding: '2px 7px',
                    }}>
                      {label} {val}
                    </span>
                  ))}
                  {s.overall_score != null && (
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800, fontSize: '0.85rem', color: scoreColor,
                    }}>
                      {s.overall_score}
                    </span>
                  )}
                </div>

                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', flexShrink: 0, marginLeft: 4 }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
                  {/* Context answers */}
                  {(s.context_q1 || s.context_q2 || s.context_q3) && (
                    <div style={{ marginTop: 14, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'Audience',    val: s.context_q1 },
                        { label: 'Goal',        val: s.context_q2 },
                        { label: 'Context',     val: s.context_q3 },
                      ].filter(r => r.val && r.val !== 'skipped').map(({ label, val }) => (
                        <div key={label} style={{ display: 'flex', gap: 10 }}>
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                            textTransform: 'uppercase', color: 'var(--text-dim)',
                            minWidth: 60, paddingTop: 2, flexShrink: 0,
                          }}>
                            {label}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submitted text */}
                  {full && (
                    <div style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 10, padding: '12px 14px',
                      fontSize: '0.82rem', color: 'var(--text-muted)',
                      lineHeight: 1.65, whiteSpace: 'pre-wrap',
                    }}>
                      {full}
                    </div>
                  )}
                </div>
              )}

              {/* Collapsed preview */}
              {!isOpen && preview && (
                <div style={{
                  padding: '0 18px 14px',
                  fontSize: '0.8rem', color: 'var(--text-dim)',
                  lineHeight: 1.55,
                }}>
                  {preview}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Email list tab ────────────────────────────────────────────────────────────

function EmailsTab({ token }) {
  const [emails, setEmails]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`${BASE}/api/admin/emails`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!json.success) { setError(json.error || 'Failed to load.'); return; }
        setEmails(json.data.emails);
      } catch {
        setError('Could not reach the server.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  function exportCSV() {
    if (!emails?.length) return;
    const header = 'Email,Scenario,Date,Overall Score';
    const rows = emails.map(e =>
      `${e.email},${e.scenario},${e.created_at.slice(0, 10)},${e.overall_score ?? ''}`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'storyscore-emails.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Loading…</p>;
  if (error)   return <p style={{ color: 'var(--rose)', padding: 40, textAlign: 'center' }}>{error}</p>;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {emails.length} address{emails.length !== 1 ? 'es' : ''} collected
        </p>
        <button
          className="btn-ghost"
          onClick={exportCSV}
          disabled={!emails.length}
          style={{ fontSize: '0.8rem', padding: '7px 16px' }}
        >
          Export CSV
        </button>
      </div>

      {emails.length === 0 ? (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '40px 24px', textAlign: 'center',
        }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No emails collected yet.
          </p>
        </div>
      ) : (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.4fr 1fr 80px',
            padding: '10px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-2)',
          }}>
            {['Email', 'Scenario', 'Date', 'Score'].map(h => (
              <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {emails.map((row, i) => {
            const color = SCENARIO_COLORS[row.scenario] || 'var(--violet)';
            const scoreColor = row.overall_score >= 70 ? '#4ECCA3' : row.overall_score >= 50 ? '#B197FC' : '#FF8FAB';
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.4fr 1fr 80px',
                  padding: '12px 20px',
                  borderBottom: i < emails.length - 1 ? '1px solid rgba(177,151,252,0.07)' : 'none',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.875rem', color: 'var(--text)', wordBreak: 'break-all' }}>
                  {row.email}
                </span>
                <span style={{
                  display: 'inline-block',
                  background: `${color}15`, border: `1px solid ${color}30`,
                  borderRadius: 6, padding: '2px 8px',
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color,
                  width: 'fit-content',
                }}>
                  {SCENARIO_LABELS[row.scenario] || row.scenario}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {row.created_at.slice(0, 10)}
                </span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '0.9rem',
                  color: row.overall_score != null ? scoreColor : 'var(--text-dim)',
                }}>
                  {row.overall_score != null ? row.overall_score : '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('ss_admin_token') || '');
  const [authed, setAuthed]   = useState(false);
  const [tab, setTab]         = useState('overview');
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function fetchStats(t) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 401) {
          setAuthed(false);
          localStorage.removeItem('ss_admin_token');
          setError('Invalid token.');
        } else {
          setError(json.error || 'Failed to load stats.');
        }
        return;
      }
      setStats(json.data);
      setAuthed(true);
      localStorage.setItem('ss_admin_token', t);
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchStats(token);
  }, []);

  function handleAuth(t) {
    setToken(t);
    fetchStats(t);
  }

  if (!authed && !loading) {
    return <LoginGate onAuth={handleAuth} />;
  }

  const TABS = [
    { id: 'overview',  label: 'Overview' },
    { id: 'emails',    label: 'Emails' },
    { id: 'sessions',  label: 'Sessions' },
  ];

  return (
    <div style={{ minHeight: '100dvh', padding: '32px 24px 64px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)' }}>
              Admin Dashboard
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>StoryScore — Usage Overview</p>
          </div>
          <button
            className="btn-ghost"
            onClick={() => { fetchStats(token); }}
            style={{ fontSize: '0.8rem', padding: '7px 16px' }}
          >
            Refresh
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: 4,
          borderBottom: '1px solid var(--border)',
          marginBottom: 24,
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 18px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600, fontSize: '0.875rem',
                color: tab === t.id ? 'var(--violet)' : 'var(--text-muted)',
                borderBottom: tab === t.id ? '2px solid var(--violet)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Loading…</p>
        )}
        {error && (
          <p style={{ color: 'var(--rose)', textAlign: 'center', padding: 40 }}>{error}</p>
        )}

        {/* Overview tab */}
        {tab === 'overview' && stats && (
          <>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 20 }}>
              <StatCard label="Total Sessions"    value={stats.total_sessions} sub="All time" color="var(--violet)" />
              <StatCard label="Email Opt-ins"     value={stats.sessions_with_email} sub={`${stats.email_opt_in_rate}% opt-in rate`} color="var(--mint)" />
              <StatCard label="Avg Overall Score" value={stats.avg_overall_score > 0 ? `${stats.avg_overall_score}/100` : '—'} sub="Across all sessions" color="var(--rose)" />
              <StatCard label="Avg Word Count"    value={stats.avg_word_count > 0 ? stats.avg_word_count : '—'} sub="Words per submission" color="var(--violet)" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <ActivityChart sessionsByDay={stats.sessions_by_day} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <DistributionBar distribution={stats.score_distribution} />
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Breakdown by Scenario
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {stats.by_scenario.length === 0
                ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No sessions yet.</p>
                : stats.by_scenario.map(s => <ScenarioCard key={s.scenario} data={s} />)
              }
            </div>
          </>
        )}

        {/* Emails tab */}
        {tab === 'emails' && authed && (
          <EmailsTab token={token} />
        )}

        {/* Sessions tab */}
        {tab === 'sessions' && authed && (
          <SessionsTab token={token} />
        )}
      </div>
    </div>
  );
}
