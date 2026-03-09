import { Router } from 'express';
import { getSessionsMetadata, getEmailList, getSessionsContent, purgeOldContent } from '../services/supabase.js';

const router = Router();

// ── Auth middleware ────────────────────────────────────────────────────────────
function requireAdminToken(req, res, next) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return res.status(503).json({ success: false, error: 'Admin access not configured.' });
  }
  const auth = req.headers.authorization || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (provided !== token) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }
  next();
}

router.use(requireAdminToken);

// ── Helpers ────────────────────────────────────────────────────────────────────

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length * 10) / 10;
}

function scoreBand(score) {
  if (score >= 85) return 'executive_ready';
  if (score >= 70) return 'strong';
  if (score >= 50) return 'developing';
  return 'needs_work';
}

// ── GET /api/admin/stats ───────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const sessions = await getSessionsMetadata();

    const total = sessions.length;
    const withEmail = sessions.filter(s => s.email).length;

    // ── By scenario ──────────────────────────────────────────────────────────
    const scenarioMap = {};
    for (const s of sessions) {
      if (!scenarioMap[s.scenario]) {
        scenarioMap[s.scenario] = { count: 0, scores: [], ifs: [], nci: [], aas: [] };
      }
      const g = scenarioMap[s.scenario];
      g.count++;
      if (s.overall_score != null) g.scores.push(s.overall_score);
      if (s.ifs_score != null)     g.ifs.push(s.ifs_score);
      if (s.nci_score != null)     g.nci.push(s.nci_score);
      if (s.aas_score != null)     g.aas.push(s.aas_score);
    }

    const byScenario = Object.entries(scenarioMap).map(([scenario, g]) => ({
      scenario,
      count: g.count,
      avg_overall: avg(g.scores),
      avg_impact:  avg(g.ifs),
      avg_flow:    avg(g.nci),
      avg_tone:    avg(g.aas),
    }));

    // ── Sessions by day (last 30 days) ────────────────────────────────────────
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 29);

    const dayMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(cutoff);
      d.setDate(d.getDate() + i);
      dayMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const s of sessions) {
      const day = s.created_at.slice(0, 10);
      if (day in dayMap) dayMap[day]++;
    }
    const sessionsByDay = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    // ── Score distribution ────────────────────────────────────────────────────
    const distribution = { executive_ready: 0, strong: 0, developing: 0, needs_work: 0 };
    const allScores = sessions.filter(s => s.overall_score != null).map(s => s.overall_score);
    for (const score of allScores) {
      distribution[scoreBand(score)]++;
    }

    // ── Overall averages ──────────────────────────────────────────────────────
    const wordCounts = sessions.filter(s => s.word_count != null).map(s => s.word_count);

    return res.json({
      success: true,
      data: {
        total_sessions: total,
        sessions_with_email: withEmail,
        email_opt_in_rate: total > 0 ? Math.round(withEmail / total * 1000) / 10 : 0,
        avg_overall_score: avg(allScores),
        avg_word_count: Math.round(avg(wordCounts)),
        by_scenario: byScenario,
        sessions_by_day: sessionsByDay,
        score_distribution: distribution,
      },
    });
  } catch (err) {
    console.error('[/api/admin/stats]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/admin/emails ──────────────────────────────────────────────────────
router.get('/emails', async (req, res) => {
  try {
    const rows = await getEmailList();
    return res.json({ success: true, data: { emails: rows, total: rows.length } });
  } catch (err) {
    console.error('[/api/admin/emails]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/admin/sessions ────────────────────────────────────────────────────
// email column is never returned — content and identity stay separate by design
router.get('/sessions', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const rows = await getSessionsContent(limit);
    return res.json({ success: true, data: { sessions: rows, total: rows.length } });
  } catch (err) {
    console.error('[/api/admin/sessions]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/admin/purge-old-content ─────────────────────────────────────────
// Strips input_text + context from sessions older than N days.
// Scores and metadata are preserved. Run this periodically to limit data exposure.
router.post('/purge-old-content', async (req, res) => {
  try {
    const days = parseInt(req.body?.older_than_days) || 30;
    const count = await purgeOldContent(days);
    console.log(`[admin/purge] Wiped content from ${count} sessions older than ${days} days`);
    return res.json({
      success: true,
      data: { sessions_purged: count, older_than_days: days },
    });
  } catch (err) {
    console.error('[/api/admin/purge-old-content]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
