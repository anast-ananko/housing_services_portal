import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { signHS256 } from '../lib/jwt';
import { createUser, getUserByEmail } from '../db/users';
import { verifyPassword } from '../lib/password';

dotenv.config();
const secret = process.env.SECRET_KEY;
if (!secret) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}
const SECRET_KEY: string = secret;

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

  const token = signHS256({ email }, SECRET_KEY, { expiresInSeconds: 3600 });
  res.status(200).json({ token });
});

export default router;
