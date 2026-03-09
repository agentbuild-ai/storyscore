import { Router } from 'express';
import { saveFeedback } from '../services/supabase.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { session_id, helpful, feedback_text = null } = req.body;

    if (!session_id) {
      return res.status(400).json({ success: false, error: 'session_id is required.' });
    }
    if (typeof helpful !== 'boolean') {
      return res.status(400).json({ success: false, error: 'helpful must be a boolean.' });
    }

    await saveFeedback(session_id, helpful, feedback_text || null);
    return res.json({ success: true, data: {} });
  } catch (err) {
    console.error('[/api/feedback]', err);
    return res.status(500).json({ success: false, error: 'Failed to save feedback.' });
  }
});

export default router;
