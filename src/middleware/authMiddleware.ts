import { Response, NextFunction } from 'express';
import { verifyHS256 } from '../lib/jwt';
import { AuthRequest } from '../types/express';
import { SECRET_KEY } from '../config';
import { User } from 'types/types';

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyHS256<User>(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
