import client from '../db/db';
import { verifyPassword } from '../lib/password';
import { User } from '../entities/UserEntity';

export class AuthService {
  static async verifyUser(email: string, password: string): Promise<User | null> {
    const result = await client.query(
      `SELECT * 
      FROM Users 
      WHERE email = $1`,
      [email]
    );
    const user = result.rows[0];
    if (!user) return null;

    return verifyPassword(password, user.password_hash) ? user : null;
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

  static async clearRefreshToken(email: string): Promise<void> {
    await client.query(
      `UPDATE Users 
      SET refresh_token = NULL 
      WHERE email = $1`,
      [email]
    );
  }
}
