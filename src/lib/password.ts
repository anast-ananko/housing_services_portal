import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);

  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt') return false;

  const salt = Buffer.from(saltHex, 'hex');
  const expected = crypto.scryptSync(password, salt, 64);
  return expected.toString('hex') === hashHex;
}
