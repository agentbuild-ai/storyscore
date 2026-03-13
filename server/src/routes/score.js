import { Router } from 'express';
import { randomUUID } from 'crypto';
import { score, buildPass3UserMessage } from '../services/scorer.js';
import { chat } from '../services/ai.js';
import { loadPrompt } from '../prompts/loader.js';
import { createSession } from '../services/supabase.js';
import { ipRateLimit } from '../middleware/rateLimit.js';

const SCORE_RATE_LIMIT = parseInt(process.env.SCORE_RATE_LIMIT || '20');
const MAX_WORDS = 3000;

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const router = Router();

const VALID_SCENARIOS = [
  'pitching_to_executives',
  'talking_to_manager',
  'explaining_to_stakeholders',
];

router.post('/', ipRateLimit({ limit: SCORE_RATE_LIMIT }), async (req, res) => {
  try {
    const { scenario, context = {}, text, conversation_history = [] } = req.body;

    if (!scenario || !VALID_SCENARIOS.includes(scenario)) {
      return res.status(400).json({
        success: false,
        error: `Invalid scenario. Must be one of: ${VALID_SCENARIOS.join(', ')}`,
      });
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'text is required.' });
    }

    const cleanText = text.trim();
    const wordCount = countWords(cleanText);

    if (wordCount > MAX_WORDS) {
      return res.status(400).json({
        success: false,
        error: `Text too long. Maximum is ${MAX_WORDS} words (yours is ${wordCount}).`,
      });
    }

    // Pass 1 + Pass 2 (sequential — Pass 2 needs Pass 1 output)
    const result = await score({ scenario, context, text: cleanText, conversationHistory: conversation_history });

    // Generate session ID now so we can fire-and-forget the DB write
    const sessionId = randomUUID();

    // Fire-and-forget: Supabase write leaves the critical path entirely
    createSession({
      session_id: sessionId,
      scenario,
      context_q1: context.q1 || 'skipped',
      context_q2: context.q2 || 'skipped',
      context_q3: context.q3 || 'skipped',
      input_text: cleanText,
      word_count: result.word_count,
      overall_score: result.pass1.overall_score,
      ifs_score: result.pass1.metrics.impact_first.score,
      nci_score: result.pass1.metrics.narrative_coherence.score,
      aas_score: result.pass1.metrics.audience_adaptation.score,
      scoring_response: result,
    }).catch(err => console.error('[session write failed]', err));

    // Pass 3 runs concurrently with the Supabase write above
    const pass3System = loadPrompt('pass3-coach');
    const pass3User = buildPass3UserMessage({
      scenario,
      context,
      text: cleanText,
      pass1Result: result.pass1,
      pass2Result: result.pass2,
      conversationHistory: conversation_history,
    });

    const coachReply = await chat({
      system: pass3System,
      messages: [{ role: 'user', content: pass3User }],
      temperature: 0.7,
      maxTokens: 600,
      jsonMode: false,
      model: process.env.CLAUDE_CHAT_MODEL || 'claude-haiku-4-5-20251001',
    });

    return res.json({
      success: true,
      data: {
        session_id: sessionId,
        ...result,
        coach_reply: coachReply.trim(),
      },
    });
  } catch (err) {
    console.error('[/api/score]', err);
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({
      success: false,
      error: isDev ? err.message : 'Scoring failed. Please try again.',
      ...(isDev && err._debug && { debug: err._debug }),
    });
  }
});

export default router;
