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

app.use(cors());
app.use(express.json());

app.use('/api/score', scoreRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/save-email', saveEmailRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/delete-my-data', deleteMyDataRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ai_provider: getProvider() });
});

app.listen(PORT, () => {
  console.log(`StoryScore server running on port ${PORT} [AI: ${getProvider()}]`);
});
