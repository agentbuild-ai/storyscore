# StoryScore — Project Instructions

## What This Is

StoryScore is an AI-powered web app that scores technical professionals on their storytelling and executive communication. Users select a scenario, answer context questions, paste text, and receive structured scoring across three proprietary metrics with coaching feedback.

This is a **Thin MVP** for beta testing with 15–20 users. No auth, no accounts, no freemium gates, no payment.

## Tech Stack

- **Frontend**: React (Vite), single-page application
- **Backend**: Node.js with Express
- **AI Engine**: Claude API (Sonnet) — two-pass scoring architecture
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (frontend) + Railway or Render (backend)

## Project Structure

```
storyscore/
├── CLAUDE.md                  # This file — project-level instructions
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Step-by-step flow pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Helper functions
│   │   ├── styles/            # Global styles
│   │   └── App.jsx
│   └── package.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic (scoring engine, Supabase)
│   │   ├── prompts/           # Prompt loader utilities
│   │   └── index.js           # Express app entry point
│   └── package.json
├── prompts/                   # Scoring prompt templates (Markdown)
│   ├── pass1-scoring.md       # Pass 1: Analytical scoring system prompt
│   ├── pass2-coaching.md      # Pass 2: Coaching generation system prompt
│   └── calibration/           # Few-shot calibration examples (JSON)
│       ├── pitching-executives-strong.json
│       ├── pitching-executives-mid.json
│       ├── pitching-executives-weak.json
│       └── ...
├── tasks/                     # Task backlog for Claude Code sessions
├── docs/                      # Product documentation
│   └── mvp-spec.md            # Full MVP specification
├── tests/                     # Calibration test harness and integration tests
│   ├── calibration/           # Test texts with expected scores
│   └── integration/           # End-to-end API tests
└── .env.example               # Required environment variables
```

## Architecture Decisions

### Two-Pass Scoring
Every scoring request makes two sequential Claude API calls:
- **Pass 1 (Analytical Scoring)**: temperature=0, structured JSON output, rubric-anchored. Scores IFS, NCI, AAS independently with justifications.
- **Pass 2 (Coaching Generation)**: temperature=0.3, receives Pass 1 output as context. Generates coaching points, rewrite suggestion, scenario context note.

### Three Scenarios (MVP)
1. Talking to Your Manager
2. Pitching to Executives
3. Explaining to Stakeholders

### Three Metrics
1. **Impact-First Score (IFS)**: How quickly business value is established
2. **Narrative Coherence Index (NCI)**: Structure, flow, logical progression
3. **Audience Adaptation Score (AAS)**: Language and framing calibrated to audience

### Scenario-Specific Weighting
| Scenario | IFS | NCI | AAS |
|---|---|---|---|
| Talking to Your Manager | 35% | 30% | 35% |
| Pitching to Executives | 45% | 25% | 30% |
| Explaining to Stakeholders | 25% | 30% | 45% |

### Privacy-First Flow
1. Scenario selection (no identity)
2. Context questions (no identity, all optional)
3. Text input (no identity)
4. Results displayed (no identity)
5. Email capture (optional, post-results only)

Anonymous sessions are created on scoring. Email is linked retroactively only if user opts in.

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `POST /api/score` | POST | Accepts {scenario, context, text}. Runs two-pass scoring. Returns combined results. Writes session to Supabase. |
| `POST /api/feedback` | POST | Accepts {session_id, helpful, feedback_text}. Updates session. |
| `POST /api/save-email` | POST | Accepts {session_id, email}. Links email to session. |
| `GET /api/health` | GET | Health check. |

## Database Schema (Supabase)

### sessions table
| Field | Type | Notes |
|---|---|---|
| session_id | UUID (PK) | Generated on submission |
| created_at | Timestamp | Auto-generated |
| scenario | Text | talking_to_manager / pitching_to_executives / explaining_to_stakeholders |
| context_q1 | Text | First context answer (or "skipped") |
| context_q2 | Text | Second context answer (or "skipped") |
| context_q3 | Text | Third context answer (or "skipped") |
| input_text | Text | User's submitted text |
| word_count | Integer | Word count of input |
| overall_score | Integer | Weighted composite 0–100 |
| ifs_score | Integer | Impact-First Score 0–100 |
| nci_score | Integer | Narrative Coherence Index 0–100 |
| aas_score | Integer | Audience Adaptation Score 0–100 |
| scoring_response | JSONB | Full combined JSON from both passes |
| email | Text (nullable) | Added post-results if user opts in |
| feedback_helpful | Boolean (nullable) | Thumbs up/down |
| feedback_text | Text (nullable) | Optional free-text feedback |

## Coding Conventions

- Use ES modules (`import`/`export`) in both frontend and backend
- Use async/await, never raw promises
- Environment variables via `.env` file, never hardcoded
- All API responses follow shape: `{ success: true, data: {...} }` or `{ success: false, error: "message" }`
- Frontend state management: React useState/useReducer, no external state library
- CSS: Tailwind CSS via CDN or utility-first approach — keep it simple
- Error handling: every API call wrapped in try/catch, user-friendly error messages in the UI
- Scoring prompts live in `/prompts/` as Markdown files, loaded by the backend at startup

## AI Provider Strategy

| Environment | Provider | Config |
|---|---|---|
| Development | Ollama (local) | `AI_PROVIDER=ollama` |
| Testing / Production | Claude API | `AI_PROVIDER=claude` |

### Switching Providers
Set `AI_PROVIDER` in your `.env` file. The unified client is at `server/src/services/ai.js` — all scoring code calls `chat()` from there and never imports Anthropic or Ollama SDKs directly.

### Ollama Setup (development)
1. Install Ollama: https://ollama.com
2. Pull the default model: `ollama pull llama3.2`
3. Ollama runs automatically at `http://localhost:11434`

To use a different model, change `OLLAMA_MODEL` in `.env` (e.g. `mistral`, `qwen2.5`, `phi3`).

### Claude Setup (testing/production)
Set `ANTHROPIC_API_KEY` and `AI_PROVIDER=claude` in `.env`.

## Key Constraints

- Total time from submission to results: under 10 seconds
- Minimum text input: ~100 words
- Maximum text input: ~3,000 words
- Claude API model: `claude-sonnet-4-20250514` (set via `CLAUDE_MODEL` env var)
- Pass 1 temperature: 0
- Pass 2 temperature: 0.3
- All scoring prompts must instruct the model to reason BEFORE assigning numeric scores

## Reference Documents

- Full product spec: `docs/mvp-spec.md`
- Pass 1 scoring prompt: `prompts/pass1-scoring.md`
- Pass 2 coaching prompt: `prompts/pass2-coaching.md`
- Calibration examples: `prompts/calibration/*.json`
- Task backlog: `tasks/task-*.md`