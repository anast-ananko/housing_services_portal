import express from 'express';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/authMiddleware';
import { AuthRequest } from './types/express';
import { initDatabase } from './db/setup';
import { PORT } from './config';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route, no auth needed!' });
});

app.get('/protected', authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: 'You accessed protected route!',
    email: req.user?.email,
  });
});

(async () => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();
