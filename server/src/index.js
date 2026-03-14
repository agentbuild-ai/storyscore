import express from 'express';
import cors from 'cors';
import scoreRoutes from './routes/score.js';
import feedbackRoutes from './routes/feedback.js';
import saveEmailRoutes from './routes/saveEmail.js';
import coachRoutes from './routes/coach.js';
import adminRoutes from './routes/admin.js';
import deleteMyDataRoutes from './routes/deleteMyData.js';
import { getProvider } from './services/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(null, false);
  },
}));
app.use(express.json());

app.use('/api/score', scoreRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/save-email', saveEmailRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delete-my-data', deleteMyDataRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ai_provider: getProvider(),
    langfuse: !!process.env.LANGFUSE_SECRET_KEY,
  });
});

app.listen(PORT, () => {
  console.log(`StoryScore server running on port ${PORT} [AI: ${getProvider()}]`);
});
