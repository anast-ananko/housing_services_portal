import { hashPassword, verifyPassword } from '../src/lib/password';

const password = 'SuperSecret123!';

describe('Password', () => {
  let hashed: string;

  beforeAll(() => {
    hashed = hashPassword(password);
  });

  it('should hash a password', () => {
    expect(typeof hashed).toBe('string');
    expect(hashed.startsWith('scrypt$')).toBe(true);

    const parts = hashed.split('$');
    expect(parts).toHaveLength(3);
    expect(parts[1]).toHaveLength(32);
    expect(parts[2]).toHaveLength(128);
  });

  it('should verify correct password', () => {
    const result = verifyPassword(password, hashed);
    expect(result).toBe(true);
  });

  it('should fail verification for incorrect password', () => {
    const result = verifyPassword('WrongPassword', hashed);
    expect(result).toBe(false);
  });

  it('should return false for invalid scheme', () => {
    const badHash = hashed.replace(/^scrypt/, 'bcrypt');
    const result = verifyPassword(password, badHash);
    expect(result).toBe(false);
  });

  it('should return false for malformed stored string', () => {
    const result = verifyPassword(password, 'invalid$hash');
    expect(result).toBe(false);
  });
});
