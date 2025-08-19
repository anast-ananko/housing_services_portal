import { User } from '../types/user';
import { hashPassword } from '../lib/password';

export const users = new Map<string, User>();

export function createUser(email: string, password: string): void {
  const passwordHash = hashPassword(password);
  const user: User = { email, passwordHash };
  users.set(email, user);
}

export function getUserByEmail(email: string): User | undefined {
  return users.get(email);
}
