import client from '../db/db';
import { ManagerEntity } from '../entities/ManagerEntity';

export class ManagerService {
  static async getAll(): Promise<ManagerEntity[]> {
    const result = await client.query(
      `SELECT id, name, email, phone, role 
       FROM Managers`
    );
    return result.rows;
  }

  static async getById(id: number): Promise<ManagerEntity | null> {
    const result = await client.query(
      `SELECT id, name, email, phone, role 
       FROM Managers 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(data: Omit<ManagerEntity, 'id'>): Promise<ManagerEntity> {
    const result = await client.query(
      `INSERT INTO Managers (name, email, phone, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, role`,
      [data.name, data.email, data.phone || null, data.role]
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<ManagerEntity>): Promise<ManagerEntity | null> {
    const result = await client.query(
      `UPDATE Managers
       SET name = COALESCE($2, name),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           role = COALESCE($5, role)
       WHERE id = $1
       RETURNING id, name, email, phone, role`,
      [id, data.name, data.email, data.phone, data.role]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await client.query(
      `DELETE FROM Managers 
       WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
