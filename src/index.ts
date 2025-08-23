import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/authMiddleware';
import { AuthRequest } from './types/express';

dotenv.config();

const port = process.env.PORT || 3000;
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
