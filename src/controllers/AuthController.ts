import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { signHS256, verifyHS256 } from '../lib/jwt';
import { REFRESH_SECRET_KEY, SECRET_KEY } from '../config';
import { AuthService } from '../services/AuthService';
import { User } from '../types/user';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password, role, residentId, managerId } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
      const existing = await UserService.getUserByEmail(email);
      if (existing) return res.status(400).json({ error: 'User exists' });

      const user = await UserService.createUser(email, password, role, residentId, managerId);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          residentId: user.resident_id,
          managerId: user.manager_id,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
      const user = await AuthService.verifyUser(email, password);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = signHS256({ email: user.email }, SECRET_KEY, { expiresInSeconds: 3600 });
      const refreshToken = signHS256({ email: user.email }, REFRESH_SECRET_KEY, {
        expiresInSeconds: 7 * 24 * 3600,
      });

      await AuthService.saveRefreshToken(user.email, refreshToken);

      res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    try {
      const payload = verifyHS256<User>(refreshToken, REFRESH_SECRET_KEY);
      const user = await UserService.getUserByEmail(payload.email);
      if (!user || user.refresh_token !== refreshToken)
        return res.status(401).json({ error: 'Invalid refresh token' });

      const accessToken = signHS256({ email: user.email }, SECRET_KEY, { expiresInSeconds: 3600 });
      res.status(200).json({ accessToken });
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: 'Refresh token expired or invalid' });
    }
  }
}
