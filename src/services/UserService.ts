import client from '../db/db';
import { hashPassword } from '../lib/password';
import { UserEntity } from '../entities/UserEntity';

export class UserService {
  static async createUser(
    email: string,
    password: string,
    role: UserEntity['role'],
    residentId?: number,
    managerId?: number
  ): Promise<UserEntity> {
    const passwordHash = hashPassword(password);

    const result = await client.query(
      `INSERT INTO Users (email, password_hash, role, resident_id, manager_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, password_hash, refresh_token, resident_id, manager_id`,
      [email, passwordHash, role, residentId || null, managerId || null]
    );

    return result.rows[0];
  }

  static async getAll(): Promise<UserEntity[]> {
    const result = await client.query(
      `SELECT id, email, role, resident_id, manager_id
       FROM Users`
    );
    return result.rows;
  }

  static async getUserById(id: number): Promise<UserEntity | null> {
    const result = await client.query(
      `SELECT id, email, role, password_hash, refresh_token, resident_id, manager_id
       FROM Users
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async getUserByEmail(email: string): Promise<UserEntity | null> {
    const result = await client.query(
      `SELECT id, email, role, password_hash, refresh_token, resident_id, manager_id
       FROM Users
       WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  static async updateUser(id: number, data: Partial<UserEntity>): Promise<UserEntity | null> {
    const result = await client.query(
      `UPDATE Users
       SET email = COALESCE($2, email),
           role = COALESCE($3, role),
           resident_id = COALESCE($4, resident_id),
           manager_id = COALESCE($5, manager_id)
       WHERE id = $1
       RETURNING id, email, role, resident_id, manager_id`,
      [id, data.email, data.role, data.resident_id, data.manager_id]
    );
    return result.rows[0] || null;
  }

  static async updatePassword(email: string, newPassword: string): Promise<void> {
    const passwordHash = hashPassword(newPassword);
    await client.query(
      `UPDATE Users 
      SET password_hash = $1 
      WHERE email = $2`,
      [passwordHash, email]
    );
  }

  static async deleteUser(id: number): Promise<void> {
    await client.query(
      `DELETE FROM Users
       WHERE id = $1`,
      [id]
    );
  }
}
