import { Router } from 'express';
import { chat } from '../services/ai.js';
import { loadPrompt } from '../prompts/loader.js';
import { buildCoachOnlyMessage } from '../services/scorer.js';

const router = Router();

const MAX_TURNS = parseInt(process.env.CHAT_TURN_LIMIT || '8');
const MAX_WORDS = 1000;

const VALID_SCENARIOS = [
  'pitching_to_executives',
  'talking_to_manager',
  'explaining_to_stakeholders',
];

router.post('/', async (req, res) => {
  try {
    const { scenario, context = {}, conversation_history = [], text } = req.body;

    if (!scenario || !VALID_SCENARIOS.includes(scenario)) {
      return res.status(400).json({ success: false, error: 'Invalid scenario.' });
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, error: 'text is required.' });
    }

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > MAX_WORDS) {
      return res.status(400).json({
        success: false,
        error: `Message too long. Maximum is ${MAX_WORDS} words.`,
      });
    }

    if (conversation_history.length >= MAX_TURNS) {
      return res.status(429).json({
        success: false,
        error: `You've reached the ${MAX_TURNS}-message limit for this session. Start a new session to keep coaching.`,
      });
    }

    const system = loadPrompt('pass3-coach');
    const userMsg = buildCoachOnlyMessage({
      scenario,
      context,
      text: text.trim(),
      conversationHistory: conversation_history,
    });

    const reply = await chat({
      system,
      messages: [{ role: 'user', content: userMsg }],
      temperature: 0.7,
      maxTokens: 600,
      jsonMode: false,
      model: process.env.CLAUDE_CHAT_MODEL || 'claude-haiku-4-5-20251001',
    });

    return res.json({ success: true, data: { coach_reply: reply.trim() } });
  } catch (err) {
    console.error('[/api/coach]', err);
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({
      success: false,
      error: isDev ? err.message : 'Coach reply failed. Please try again.',
    });
  }
});

export default router;
