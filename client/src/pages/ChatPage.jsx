import React, { useState, useRef, useEffect } from 'react';
import { submitScore, chatWithCoach, submitEmail } from '../utils/api.js';
import PrivacyBadge from '../components/PrivacyBadge.jsx';

const SCENARIO_LABELS = {
  pitching_to_executives: 'Pitching to Executives',
  talking_to_manager: 'Talking to Your Manager',
  explaining_to_stakeholders: 'Explaining to Stakeholders',
};

const MIN_WORDS = 100;

const SCORE_METRICS = [
  { key: 'impact', label: 'Impact', color: '#FF8FAB', glow: 'rgba(255,143,171,0.6)' },
  { key: 'flow',   label: 'Flow',   color: '#B197FC', glow: 'rgba(177,151,252,0.6)' },
  { key: 'tone',   label: 'Tone',   color: '#4ECCA3', glow: 'rgba(78,204,163,0.6)'  },
];

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Sparkline + Trend panel (inline, no floating) ────────────────────────────

function SparklineMini({ values, color }) {
  const W = 60, H = 30, P = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 10;

  const pts = values.map((v, i) => {
    const x = P + (i / Math.max(values.length - 1, 1)) * (W - 2 * P);
    const y = H - P - ((v - min) / range) * (H - 2 * P);
    return [x, y];
  });

  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
      <circle cx={lx} cy={ly} r={3} fill={color} />
    </svg>
  );
}

// Renders inline — sits above the score strip in normal document flow
function TrendPanel({ scoreHistory }) {
  const allMetrics = [
    ...SCORE_METRICS,
    { key: 'overall', label: 'Overall', color: '#9B96C0' },
  ];

  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderBottom: 'none',
      borderRadius: '12px 12px 0 0',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
    }}>
      {scoreHistory.length < 2 ? (
        <p style={{
          fontSize: '0.75rem', color: 'var(--text-muted)',
          margin: '0 auto', textAlign: 'center',
        }}>
          Submit a second scored message (100+ words) to see your trend
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 20, flex: 1 }}>
            {allMetrics.map(({ key, label, color }) => {
              const values = scoreHistory.map(h => h[key]);
              const delta = values[values.length - 1] - values[0];
              const trendColor = delta > 0 ? '#4ECCA3' : delta < 0 ? '#FF8FAB' : '#5A5680';
              const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
              return (
                <div key={key} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <span style={{
                    fontSize: '0.58rem', color: 'var(--text-dim)', fontWeight: 700,
                    letterSpacing: '0.08em', fontFamily: "'Space Grotesk', sans-serif",
                    textTransform: 'uppercase',
                  }}>
                    {label}
                  </span>
                  <SparklineMini values={values} color={color} />
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, color: trendColor,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {arrow} {values[values.length - 1]}
                  </span>
                </div>
              );
            })}
          </div>
          <span style={{
            fontSize: '0.65rem', color: 'var(--text-dim)',
            alignSelf: 'center', marginLeft: 12, whiteSpace: 'nowrap',
          }}>
            {scoreHistory.length} submissions
          </span>
        </>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--violet)',
          animation: `pulseGlow 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function CoachAvatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: 'var(--violet-dim)',
      border: '1px solid rgba(177,151,252,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.7rem', color: 'var(--violet)',
      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
      alignSelf: 'flex-start', marginTop: 4,
    }}>
      ◆
    </div>
  );
}

function EndSessionPanel({ latestResult, onContinue, onRestart }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSendScorecard(e) {
    e.preventDefault();
    if (!email || status !== 'idle' || !latestResult) return;
    setStatus('loading');
    try {
      await submitEmail({ session_id: latestResult.session_id, email });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <div
        onClick={onContinue}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(14,10,30,0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
        }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 51, display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: 680,
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          borderRadius: '20px 20px 0 0',
          padding: '24px 24px 48px',
          animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        }}>
          <div style={{
            width: 36, height: 4, background: 'var(--border)',
            borderRadius: 2, margin: '0 auto 24px',
          }} />

          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.25rem', fontWeight: 700,
            color: 'var(--text)', marginBottom: 8, textAlign: 'center',
          }}>
            Great session
          </h2>
          <p style={{
            color: 'var(--text-muted)', fontSize: '0.875rem',
            textAlign: 'center', marginBottom: 28, lineHeight: 1.6,
          }}>
            You can keep coaching or wrap up here.
          </p>

          {latestResult ? (
            status === 'done' ? (
              <div style={{
                textAlign: 'center', padding: '20px',
                background: 'var(--mint-dim)',
                border: '1px solid rgba(78,204,163,0.2)',
                borderRadius: 14, marginBottom: 20,
              }}>
                <span style={{ color: 'var(--mint)', fontSize: '1.5rem' }}>✓</span>
                <p style={{
                  color: 'var(--text)', fontSize: '0.9rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, marginTop: 8,
                }}>
                  Scorecard on its way
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                  We'll send your detailed results to {email}
                </p>
              </div>
            ) : (
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '20px', marginBottom: 20,
              }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: '0.9375rem',
                  color: 'var(--text)', marginBottom: 4,
                }}>
                  Want your full scorecard?
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: 16, lineHeight: 1.5 }}>
                  We'll email you a detailed breakdown with your scores and coaching notes.
                </p>
                <form onSubmit={handleSendScorecard} style={{ display: 'flex', gap: 10 }}>
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
                    {status === 'loading' ? '…' : 'Send it'}
                  </button>
                </form>
                {status === 'error' && (
                  <p style={{ color: 'var(--rose)', fontSize: '0.8rem', marginTop: 8 }}>
                    Something went wrong. Try again.
                  </p>
                )}
                <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.55 }}>
                  Your session is stored anonymously. Your email is only used to send this scorecard — we don't sell or share your data.
                  To delete your data, email <a href="mailto:support@agentbuild.ai" style={{ color: 'var(--violet)', textDecoration: 'none' }}>support@agentbuild.ai</a>.
                </p>
              </div>
            )
          ) : (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '16px 20px', marginBottom: 20, textAlign: 'center',
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Submit your first communication to get a scorecard.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-ghost" onClick={onContinue} style={{ width: '100%' }}>
              Continue coaching
            </button>
            <button
              onClick={onRestart}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-dim)', fontSize: '0.8rem',
                cursor: 'pointer', textAlign: 'center', padding: '8px',
              }}
            >
              Start a new session
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ChatPage({ scenario, context, onRestart }) {
  const welcome = {
    role: 'coach',
    text: `Hi — I'm your StoryScore coach for ${SCENARIO_LABELS[scenario]}.\n\nShare the communication you want me to score. Paste what you'd actually say or send — an email, a pitch, an update to your manager. The more real it is, the more useful the feedback.\n\nAim for at least 100 words.`,
  };

  const [messages, setMessages] = useState([welcome]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [stripHovered, setStripHovered] = useState(false);
  const [showEndSession, setShowEndSession] = useState(false);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const wordCount = countWords(input);

  async function handleSend() {
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput('');
    setIsSending(true);
    setMessages(m => [...m, { role: 'user', text: userText }]);

    const historyBeforeThis = [...conversationHistory];

    try {
      let coachReply;
      let newResult = null;

      if (wordCount >= MIN_WORDS) {
        const data = await submitScore({
          scenario,
          context,
          text: userText,
          conversationHistory: historyBeforeThis,
        });
        newResult = data;
        coachReply = data.coach_reply;
        setLatestResult(data);

        // Push snapshot to score history
        setScoreHistory(h => [...h, {
          impact:  data.pass1.metrics.impact_first.score,
          flow:    data.pass1.metrics.narrative_coherence.score,
          tone:    data.pass1.metrics.audience_adaptation.score,
          overall: data.pass1.overall_score,
        }]);
      } else {
        const data = await chatWithCoach({
          scenario,
          context,
          text: userText,
          conversationHistory: historyBeforeThis,
        });
        coachReply = data.coach_reply;
      }

      setMessages(m => [...m, {
        role: 'coach',
        text: coachReply,
        scored: !!newResult,
      }]);

      setConversationHistory(h => [
        ...h,
        { role: 'user', text: userText },
        { role: 'coach', text: coachReply },
      ]);

    } catch (err) {
      setMessages(m => [...m, {
        role: 'coach',
        text: `Something went wrong. ${err.message || 'Please try again.'}`,
      }]);
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 14, flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)',
          }}>
            StoryScore
          </span>
          <span style={{
            background: 'var(--violet-dim)',
            border: '1px solid rgba(177,151,252,0.3)',
            borderRadius: 999, padding: '3px 12px',
            fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--violet)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {SCENARIO_LABELS[scenario]}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {latestResult && (
            <button
              onClick={() => setShowEndSession(true)}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-dim)', fontSize: '0.8rem',
                cursor: 'pointer', padding: '6px 10px',
                fontFamily: 'inherit',
              }}
            >
              End session
            </button>
          )}
          <button
            className="btn-ghost"
            onClick={onRestart}
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Start over
          </button>
        </div>
      </div>

      {/* Chat thread */}
      <div
        ref={threadRef}
        style={{
          flex: 1, overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          gap: 14, paddingRight: 4,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 10,
          }}>
            {msg.role === 'coach' && <CoachAvatar />}
            <div
              className={msg.role === 'user' ? 'chat-user-bubble' : 'chat-coach-bubble'}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isSending && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <CoachAvatar />
            <div className="chat-coach-bubble" style={{ padding: '12px 16px' }}>
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Score area — inline trend panel + strip, hover-activated */}
      {latestResult && (
        <div
          style={{ flexShrink: 0, marginTop: 12 }}
          onMouseEnter={() => setStripHovered(true)}
          onMouseLeave={() => setStripHovered(false)}
        >
          {/* Trend panel appears above strip on hover — inline, no floating */}
          {stripHovered && <TrendPanel scoreHistory={scoreHistory} />}

          <div
            className="score-strip"
            style={{
              marginTop: 0,
              borderRadius: stripHovered ? '0 0 12px 12px' : '12px',
            }}
          >
            {SCORE_METRICS.map(({ key, label, color }) => {
              const scoreVal = key === 'impact'
                ? latestResult.pass1.metrics.impact_first.score
                : key === 'flow'
                ? latestResult.pass1.metrics.narrative_coherence.score
                : latestResult.pass1.metrics.audience_adaptation.score;

              const prevVal = scoreHistory.length > 1
                ? scoreHistory[scoreHistory.length - 2][key]
                : null;
              const delta = prevVal !== null ? scoreVal - prevVal : null;

              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.6rem', fontWeight: 700, color,
                    background: `${color}18`, border: `1px solid ${color}40`,
                    borderRadius: 5, padding: '2px 7px', letterSpacing: '0.05em',
                  }}>
                    {label}
                  </span>
                  <span
                    key={`${key}-${scoreVal}`}
                    className="score-flash"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700, fontSize: '0.95rem', color,
                      display: 'inline-block',
                    }}
                  >
                    {scoreVal}
                  </span>
                  {delta !== null && delta !== 0 && (
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600,
                      color: delta > 0 ? '#4ECCA3' : '#FF8FAB',
                    }}>
                      {delta > 0 ? `+${delta}` : `${delta}`}
                    </span>
                  )}
                </div>
              );
            })}

            <div style={{
              width: 1, height: 18, background: 'var(--border)',
              margin: '0 2px', flexShrink: 0,
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Overall
              </span>
              <span
                key={`overall-${latestResult.pass1.overall_score}`}
                className="score-flash"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '1rem', color: 'var(--text)',
                  display: 'inline-block',
                }}
              >
                {latestResult.pass1.overall_score}
              </span>
            </div>

            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
              {`Score #${scoreHistory.length} · hover for trend`}
            </span>
          </div>
        </div>
      )}

      {/* Input area */}
      <div style={{ paddingTop: 10, flexShrink: 0, paddingBottom: 8 }}>
        <PrivacyBadge />
        <div style={{ position: 'relative' }}>
          <textarea
            className="input"
            placeholder={latestResult
              ? 'Reply, try a rewrite, or ask a question… (⌘↵ to send)'
              : 'Paste your communication here… (⌘↵ to send)'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            style={{ minHeight: 96, paddingBottom: 38, resize: 'vertical' }}
          />
          <div style={{
            position: 'absolute', bottom: 11, left: 14,
            fontSize: '0.72rem', fontWeight: 600,
            color: wordCount === 0 ? 'var(--text-dim)'
              : wordCount < MIN_WORDS ? 'var(--rose)'
              : 'var(--mint)',
            fontFamily: "'Space Grotesk', sans-serif",
            pointerEvents: 'none',
          }}>
            {wordCount > 0
              ? `${wordCount} words${wordCount < MIN_WORDS ? ` · ${MIN_WORDS - wordCount} more to score` : ' · will be scored'}`
              : ''}
          </div>
          <button
            className="btn-primary"
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            style={{
              position: 'absolute', bottom: 10, right: 10,
              padding: '7px 20px', fontSize: '0.875rem',
            }}
          >
            {isSending ? '…' : 'Send'}
          </button>
        </div>
      </div>

      {/* End session panel */}
      {showEndSession && (
        <EndSessionPanel
          latestResult={latestResult}
          onContinue={() => setShowEndSession(false)}
          onRestart={onRestart}
        />
      )}
    </div>
  );
}
