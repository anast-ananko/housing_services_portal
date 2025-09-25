import client from '../db/db';
import { ServiceEntity } from '../entities/ServiceEntity';

export class ServiceService {
  static async getAll(): Promise<ServiceEntity[]> {
    const result = await client.query(
      `SELECT id, name, description, cost, is_active 
       FROM Services`
    );
    return result.rows;
  }

  static async getById(id: number): Promise<ServiceEntity | null> {
    const result = await client.query(
      `SELECT id, name, description, cost, is_active 
       FROM Services WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(data: Omit<ServiceEntity, 'id'>): Promise<ServiceEntity> {
    const result = await client.query(
      `INSERT INTO Services (name, description, cost, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, cost, is_active`,
      [data.name, data.description || null, data.cost, data.is_active ?? true]
    );
    return result.rows[0];
  }

  static async update(id: number, data: Partial<ServiceEntity>): Promise<ServiceEntity | null> {
    const result = await client.query(
      `UPDATE Services
       SET name = COALESCE($2, name),
           description = COALESCE($3, description),
           cost = COALESCE($4, cost),
           is_active = COALESCE($5, is_active)
       WHERE id = $1
       RETURNING id, name, description, cost, is_active`,
      [id, data.name, data.description, data.cost, data.is_active]
    );
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<void> {
    await client.query(
      `DELETE FROM Services 
       WHERE id = $1`,
      [id]
    );
  }
}
