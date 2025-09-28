import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from 'types/express';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const user = await UserService.getUserById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load profile' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(Number(req.params.id));
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const user = await UserService.updateUser(Number(req.params.id), req.body);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await UserService.delete(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(204).send();

      await UserService.delete(Number(req.params.id));
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}
