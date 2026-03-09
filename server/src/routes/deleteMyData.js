import { Router } from 'express';
import { deleteDataByEmail } from '../services/supabase.js';

const router = Router();

// Rate-limit: track requests per email to prevent enumeration abuse
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 3;

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'email is required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format.' });
    }

    const key = email.trim().toLowerCase();

    // Simple in-memory rate limit per email
    const now = Date.now();
    const entry = attempts.get(key) || { count: 0, resetAt: now + WINDOW_MS };
    if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + WINDOW_MS; }
    entry.count++;
    attempts.set(key, entry);
    if (entry.count > MAX_ATTEMPTS) {
      return res.status(429).json({ success: false, error: 'Too many requests. Try again later.' });
    }

    const count = await deleteDataByEmail(key);

    // Always return success — don't confirm whether the email exists
    console.log(`[delete-my-data] Wiped content for ${key} (${count} sessions affected)`);
    return res.json({
      success: true,
      data: { message: 'If we had data linked to that email, it has been deleted.' },
    });
  } catch (err) {
    console.error('[/api/delete-my-data]', err);
    return res.status(500).json({ success: false, error: 'Deletion failed. Please email support@agentbuild.ai.' });
  }
});

export default router;
