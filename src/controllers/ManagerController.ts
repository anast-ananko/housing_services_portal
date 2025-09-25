import { Request, Response } from 'express';
import { ManagerService } from '../services/ManagerService';

export class ManagerController {
  static async getAll(req: Request, res: Response) {
    try {
      const managers = await ManagerService.getAll();
      res.json(managers);
    } catch {
      res.status(500).json({ error: 'Failed to fetch managers' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const manager = await ManagerService.getById(Number(req.params.id));
      if (!manager) return res.status(404).json({ error: 'Manager not found' });
      res.json(manager);
    } catch {
      res.status(500).json({ error: 'Failed to fetch manager' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const manager = await ManagerService.create(req.body);
      res.status(201).json(manager);
    } catch {
      res.status(500).json({ error: 'Failed to create manager' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const manager = await ManagerService.update(Number(req.params.id), req.body);
      if (!manager) return res.status(404).json({ error: 'Manager not found' });
      res.json(manager);
    } catch {
      res.status(500).json({ error: 'Failed to update manager' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ManagerService.delete(Number(req.params.id));
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete manager' });
    }
  }
}
