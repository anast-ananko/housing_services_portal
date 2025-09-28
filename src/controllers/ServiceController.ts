import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';

export class ServiceController {
  static async getAll(req: Request, res: Response) {
    try {
      const services = await ServiceService.getAll();
      res.json(services);
    } catch {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const service = await ServiceService.getById(Number(req.params.id));
      if (!service) return res.status(404).json({ error: 'Service not found' });
      res.json(service);
    } catch {
      res.status(500).json({ error: 'Failed to fetch service' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const service = await ServiceService.create(req.body);
      res.status(201).json(service);
    } catch {
      res.status(500).json({ error: 'Failed to create service' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const service = await ServiceService.update(Number(req.params.id), req.body);
      if (!service) return res.status(404).json({ error: 'Service not found' });
      res.json(service);
    } catch {
      res.status(500).json({ error: 'Failed to update service' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await ServiceService.delete(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete service' });
    }
  }
}
