import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { verifyHS256 } from '../lib/jwt';
import { AuthRequest } from '../types/express';
import { User } from '../types/user';

dotenv.config();
const secret = process.env.SECRET_KEY;
if (!secret) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}
const SECRET_KEY: string = secret;

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyHS256<User>(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
