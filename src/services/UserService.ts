import client from '../db/db';
import { hashPassword } from '../lib/password';
import { User } from '../entities/User';

export class UserService {
  static async createUser(
    email: string,
    password: string,
    role: User['role'],
    residentId?: number,
    managerId?: number
  ): Promise<User> {
    const passwordHash = hashPassword(password);

    const result = await client.query(
      `INSERT INTO Users (email, password_hash, role, resident_id, manager_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, password_hash, refresh_token, resident_id, manager_id`,
      [email, passwordHash, role, residentId || null, managerId || null]
    );

    return result.rows[0];
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await client.query(
      `SELECT id, email, role, password_hash, refresh_token, resident_id, manager_id
       FROM Users
       WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  static async saveRefreshToken(email: string, token: string): Promise<void> {
    await client.query(
      `UPDATE Users
       SET refresh_token = $1
       WHERE email = $2`,
      [token, email]
    );
  }

  static async getUserByRefreshToken(token: string): Promise<User | null> {
    const result = await client.query(
      `SELECT id, email, role, password_hash, refresh_token, resident_id, manager_id
       FROM Users
       WHERE refresh_token = $1`,
      [token]
    );
    return result.rows[0] || null;
  }
}
