import crypto from 'crypto';

export type User = {
  email: string;
  passwordHash: string;
};

export const users = new Map<string, User>();

export function createUser(email: string, password: string): void {
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  const user: User = { email, passwordHash };
  users.set(email, user);
}

export function getUserByEmail(email: string): User | undefined {
  return users.get(email);
}

export function verifyPassword(user: User, password: string): boolean {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return user.passwordHash === hash;
}
