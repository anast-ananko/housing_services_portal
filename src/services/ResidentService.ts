import client from '../db/db';
import { ResidentEntity } from '../entities/ResidentEntity';

export class ResidentService {
  static async getAll(): Promise<ResidentEntity[]> {
    const result = await client.query(
      `SELECT id, name, email, phone, address, created_at 
       FROM Residents`
    );
    return result.rows;
  }

  static async getById(id: number): Promise<ResidentEntity | null> {
    const result = await client.query(
      `SELECT id, name, email, phone, address, created_at
       FROM Residents 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(data: Omit<ResidentEntity, 'id' | 'created_at'>): Promise<ResidentEntity> {
    const result = await client.query(
      `INSERT INTO Residents (name, email, phone, address)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, address, created_at`,
      [data.name, data.email, data.phone || null, data.address || null]
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<ResidentEntity>): Promise<ResidentEntity | null> {
    const result = await client.query(
      `UPDATE Residents
       SET name = COALESCE($2, name),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           address = COALESCE($5, address)
       WHERE id = $1
       RETURNING id, name, email, phone, address, created_at`,
      [id, data.name, data.email, data.phone, data.address]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await client.query(
      `DELETE FROM Residents 
       WHERE id = $1`, 
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
