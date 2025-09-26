import client from '../db/db';
import { PaymentEntity } from '../entities/PaymentEntity';

export class PaymentService {
  static async getAll(): Promise<PaymentEntity[]> {
    const result = await client.query(
      `SELECT id, request_id, amount, method, status, paid_at 
       FROM Payments`
    );
    return result.rows;
  }

  static async getById(id: number): Promise<PaymentEntity | null> {
    const result = await client.query(
      `SELECT id, request_id, amount, method, status, paid_at
       FROM Payments WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(data: Omit<PaymentEntity, 'id' | 'paid_at'>): Promise<PaymentEntity> {
    const result = await client.query(
      `INSERT INTO Payments (request_id, amount, method, status, paid_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, request_id, amount, method, status, paid_at`,
      [data.request_id, data.amount, data.method, data.status || 'pending']
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<PaymentEntity>): Promise<PaymentEntity | null> {
    const result = await client.query(
      `UPDATE Payments
       SET amount = COALESCE($2, amount),
           method = COALESCE($3, method),
           status = COALESCE($4, status),
           paid_at = COALESCE($5, paid_at)
       WHERE id = $1
       RETURNING id, request_id, amount, method, status, paid_at`,
      [id, data.amount, data.method, data.status, data.paid_at]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await client.query(
      `DELETE FROM Payments 
       WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
