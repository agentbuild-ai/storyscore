-- StoryScore: sessions table
-- Run this in the Supabase SQL Editor for your project.

CREATE TABLE IF NOT EXISTS sessions (
  session_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Scenario
  scenario          TEXT        NOT NULL CHECK (scenario IN (
                                  'talking_to_manager',
                                  'pitching_to_executives',
                                  'explaining_to_stakeholders'
                                )),

  -- Context questions (optional — stored as "skipped" if user skips)
  context_q1        TEXT        NOT NULL DEFAULT 'skipped',
  context_q2        TEXT        NOT NULL DEFAULT 'skipped',
  context_q3        TEXT        NOT NULL DEFAULT 'skipped',

  -- Input
  input_text        TEXT        NOT NULL,
  word_count        INTEGER     NOT NULL,

  -- Scores
  overall_score     INTEGER     NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  ifs_score         INTEGER     NOT NULL CHECK (ifs_score BETWEEN 0 AND 100),
  nci_score         INTEGER     NOT NULL CHECK (nci_score BETWEEN 0 AND 100),
  aas_score         INTEGER     NOT NULL CHECK (aas_score BETWEEN 0 AND 100),

  -- Full AI response (both passes)
  scoring_response  JSONB       NOT NULL,

  -- Optional post-results fields
  email             TEXT,
  feedback_helpful  BOOLEAN,
  feedback_text     TEXT
);

-- Index for chronological queries
CREATE INDEX IF NOT EXISTS sessions_created_at_idx ON sessions (created_at DESC);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS sessions_email_idx ON sessions (email) WHERE email IS NOT NULL;

-- ── Row Level Security ──────────────────────────────────────────────────────
-- The backend uses the service role key, which bypasses RLS entirely.
-- RLS is enabled here as a safety net to prevent direct client access.

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- No public policies — all access goes through the backend service role.
-- If you ever need to expose data directly to the client, add policies here.
