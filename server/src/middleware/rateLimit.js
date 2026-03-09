/**
 * Simple in-memory IP rate limiter.
 * Usage: router.post('/', ipRateLimit({ limit: 20 }), handler)
 */

const windows = new Map();

export function ipRateLimit({ limit = 20, windowMs = 24 * 60 * 60 * 1000 } = {}) {
  return (req, res, next) => {
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();
    const entry = windows.get(ip) || { count: 0, resetAt: now + windowMs };
    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }
    entry.count++;
    windows.set(ip, entry);

    if (entry.count > limit) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again tomorrow.',
      });
    }

    next();
  };
}
