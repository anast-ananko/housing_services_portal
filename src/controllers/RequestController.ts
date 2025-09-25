import { Request, Response } from 'express';
import { RequestService } from '../services/RequestService';

export class RequestController {
  static async getAll(req: Request, res: Response) {
    try {
      const requests = await RequestService.getAll();
      res.json(requests);
    } catch {
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const request = await RequestService.getById(Number(req.params.id));
      if (!request) return res.status(404).json({ error: 'Request not found' });
      res.json(request);
    } catch {
      res.status(500).json({ error: 'Failed to fetch request' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const request = await RequestService.create(req.body);
      res.status(201).json(request);
    } catch {
      res.status(500).json({ error: 'Failed to create request' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const request = await RequestService.update(Number(req.params.id), req.body);
      if (!request) return res.status(404).json({ error: 'Request not found' });
      res.json(request);
    } catch {
      res.status(500).json({ error: 'Failed to update request' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await RequestService.delete(Number(req.params.id));
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete request' });
    }
  }
}
