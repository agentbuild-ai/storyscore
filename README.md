# StoryScore MVP — Task Backlog

## How to Use This Backlog

Each task is a single Claude Code session. Work through them in order — they have dependencies.

**To start a task in Claude Code**, say:
> "Read tasks/task-X.X-name.md and implement it."

**CLAUDE.md** is read automatically every session. Only reference additional files when the task needs them.

---

## Task Overview

### Phase 0: Project Setup
| Task | Owner | Status | Description |
|---|---|---|---|
| 0.1 | Claude Code | ⬜ | Initialize repo, React + Express scaffold, project structure |
| 0.2 | Claude Code | ⬜ | Set up Supabase database, sessions table, DB service |

### Phase 1: Scoring Engine (The Product — 40% of effort)
| Task | Owner | Status | Description |
|---|---|---|---|
| 1.1 | **HUMAN** | ⬜ | Write Pass 1 scoring prompt (rubrics, anchors, schema) |
| 1.2 | **HUMAN** | ⬜ | Write 3 calibration examples (Pitching to Executives) |
| 1.3 | Claude Code | ⬜ | Build scoring API endpoint (Pass 1 only) |
| 1.4 | Collab | ⬜ | Test scoring quality, build test harness, iterate prompts |
| 1.5 | **HUMAN** | ⬜ | Write Pass 2 coaching prompt |
| 1.6 | Claude Code | ⬜ | Integrate Pass 2 into scoring endpoint |
| 1.7 | **HUMAN** | ⬜ | Write remaining 6 calibration examples |
| 1.8 | Collab | ⬜ | Full calibration validation (10 texts, consistency, quality) |

### Phase 2: Frontend
| Task | Owner | Status | Description |
|---|---|---|---|
| 2.1 | Claude Code | ⬜ | Scenario selection screen |
| 2.2 | Claude Code | ⬜ | Context questions screen |
| 2.3 | Claude Code | ⬜ | Text input screen |
| 2.4 | Claude Code | ⬜ | Results dashboard |
| 2.5 | Claude Code | ⬜ | Feedback widget + email capture |
| 2.6 | Claude Code | ⬜ | End-to-end integration and testing |

### Phase 3: Polish & Deploy
| Task | Owner | Status | Description |
|---|---|---|---|
| 3.1 | Claude Code | ⬜ | Error handling and edge cases |
| 3.2 | Claude Code | ⬜ | Analytics event tracking |
| 3.3 | Claude Code | ⬜ | Deploy frontend + backend to production |
| 3.4 | **HUMAN** | ⬜ | Beta tester selection, onboarding, monitoring plan |

---

## Dependencies

```
0.1 → 0.2 → 1.3
1.1 → 1.3
1.2 → 1.3
1.3 → 1.4 → 1.6 → 1.8
1.5 → 1.6
1.7 → 1.8

0.1 → 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6
1.6 → 2.4

2.6 → 3.1 → 3.2 → 3.3 → 3.4
1.8 → 3.3
```

## Parallel Work

You can work on Phase 1 (scoring) and Phase 2 (frontend) in parallel:
- **You** work on Tasks 1.1, 1.2, 1.5, 1.7 (prompts and calibration)
- **Claude Code** works on Tasks 2.1–2.3 (frontend screens that don't need the API yet)
- They converge at Task 2.4 (results dashboard needs the scoring API)

## Status Key

- ⬜ Not Started
- 🔄 In Progress
- ✅ Complete
- ❌ Blocked