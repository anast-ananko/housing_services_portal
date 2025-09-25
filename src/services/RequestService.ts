import client from '../db/db';
import { RequestEntity } from '../entities/RequestEntity';

export class RequestService {
  static async getAll(): Promise<RequestEntity[]> {
    const result = await client.query(
      `SELECT id, resident_id, service_id, manager_id, status, created_at, updated_at
       FROM Requests`
    );
    return result.rows;
  }

  static async getById(id: number): Promise<RequestEntity | null> {
    const result = await client.query(
      `SELECT id, resident_id, service_id, manager_id, status, created_at, updated_at
       FROM Requests WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(
    data: Omit<RequestEntity, 'id' | 'created_at' | 'updated_at'>
  ): Promise<RequestEntity> {
    const result = await client.query(
      `INSERT INTO Requests (resident_id, service_id, manager_id, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, resident_id, service_id, manager_id, status, created_at, updated_at`,
      [data.resident_id, data.service_id, data.manager_id || null, data.status || 'pending']
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<RequestEntity>): Promise<RequestEntity | null> {
    const result = await client.query(
      `UPDATE Requests
       SET manager_id = COALESCE($2, manager_id),
           status = COALESCE($3, status),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, resident_id, service_id, manager_id, status, created_at, updated_at`,
      [id, data.manager_id, data.status]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<void> {
    await client.query(
      `DELETE FROM Requests 
       WHERE id = $1`,
      [id]
    );
  }
}
