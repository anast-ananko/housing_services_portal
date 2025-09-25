import { Request, Response } from 'express';
import { ResidentService } from '../services/ResidentService';

export class ResidentController {
  static async getAll(req: Request, res: Response) {
    try {
      const residents = await ResidentService.getAll();
      res.json(residents);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch residents' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const resident = await ResidentService.getById(Number(req.params.id));
      if (!resident) return res.status(404).json({ error: 'Not found' });
      res.json(resident);
    } catch {
      res.status(500).json({ error: 'Failed to fetch resident' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const resident = await ResidentService.create(req.body);
      res.status(201).json(resident);
    } catch {
      res.status(500).json({ error: 'Failed to create resident' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const resident = await ResidentService.update(Number(req.params.id), req.body);
      if (!resident) return res.status(404).json({ error: 'Not found' });
      res.json(resident);
    } catch {
      res.status(500).json({ error: 'Failed to update resident' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ResidentService.delete(Number(req.params.id));
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete resident' });
    }
  }
}
