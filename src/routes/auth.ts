import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { signHS256, verifyHS256 } from '../lib/jwt';
import { createUser, getUserByEmail, getUserByRefreshToken, saveRefreshToken } from '../db/users';
import { verifyPassword } from '../lib/password';
import { User } from '../types/user';

dotenv.config();
const secret = process.env.SECRET_KEY;
if (!secret) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}
const SECRET_KEY: string = secret;

const refreshSecret = process.env.REFRESH_SECRET_KEY;
if (!refreshSecret) {
  throw new Error('REFRESH_SECRET_KEY is not defined in environment variables');
}
const REFRESH_SECRET_KEY: string = refreshSecret;

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  if (getUserByEmail(email)) return res.status(400).json({ error: 'User exists' });

  createUser(email, password);
  res.status(201).json({ message: 'User registered' });
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: ' password' });
  }

  const accessToken = signHS256({ email }, SECRET_KEY, { expiresInSeconds: 3600 });
  const refreshToken = signHS256({ email }, REFRESH_SECRET_KEY, {
    expiresInSeconds: 7 * 24 * 3600,
  });

  saveRefreshToken(user.email, refreshToken);

  res.status(200).json({ accessToken, refreshToken });
});

router.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

  const user = getUserByRefreshToken(refreshToken);
  if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

  try {
    verifyHS256<User>(refreshToken, REFRESH_SECRET_KEY);

    const accessToken = signHS256({ email: user.email }, SECRET_KEY, { expiresInSeconds: 3600 });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Refresh token expired or invalid' });
  }
});

export default router;
