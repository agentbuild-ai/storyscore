import { Router } from 'express';
import { saveEmail, getSession } from '../services/supabase.js';
import { sendScorecard } from '../services/email.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { session_id, email } = req.body;

    if (!session_id) {
      return res.status(400).json({ success: false, error: 'session_id is required.' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'email is required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Save email to Supabase and fetch the session concurrently
    const [session] = await Promise.all([
      getSession(session_id),
      saveEmail(session_id, cleanEmail),
    ]);

    // Send the scorecard email
    await sendScorecard(cleanEmail, session);

    return res.json({ success: true, data: {} });
  } catch (err) {
    console.error('[/api/save-email]', err);
    return res.status(500).json({ success: false, error: 'Failed to send scorecard. Please try again.' });
  }
});

export default router;
