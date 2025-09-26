import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  static async getAll(req: Request, res: Response) {
    try {
      const payments = await PaymentService.getAll();
      res.json(payments);
    } catch {
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const payment = await PaymentService.getById(Number(req.params.id));
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      res.json(payment);
    } catch {
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const payment = await PaymentService.create(req.body);
      res.status(201).json(payment);
    } catch {
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const payment = await PaymentService.update(Number(req.params.id), req.body);
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      res.json(payment);
    } catch {
      res.status(500).json({ error: 'Failed to update payment' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const deleted = await PaymentService.delete(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  }
}
