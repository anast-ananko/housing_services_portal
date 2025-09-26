import { JwtPayload } from 'types/jwt';
import { signHS256, verifyHS256 } from '../src/lib/jwt';

const SECRET = 'super-secret-key';
const payloadExample = {
  email: 'test@example.com',
};

describe('JWT', () => {
  it('should sign and verify a token successfully', () => {
    const token = signHS256(payloadExample, SECRET, { expiresInSeconds: 60 });

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);

    const decoded = verifyHS256<JwtPayload & typeof payloadExample>(token, SECRET);

    expect(decoded).toHaveProperty('email', payloadExample.email);
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('jti');
    expect(decoded.exp).toBeGreaterThan(decoded.iat!);
  });

  it('should throw error if token is malformed', () => {
    expect(() => verifyHS256('invalid.token', SECRET)).toThrow('Malformed JWT');
  });

  it('should throw error if signature is invalid', () => {
    const token = signHS256(payloadExample, SECRET);
    const tampered = token.split('.').slice(0, 2).join('.') + '.abc';
    expect(() => verifyHS256(tampered, SECRET)).toThrow('Invalid signature');
  });

  it('should throw error if token expired', () => {
    const token = signHS256(payloadExample, SECRET, { expiresInSeconds: -1 });
    expect(() => verifyHS256(token, SECRET)).toThrow('Token expired');
  });

  it('should throw error if header is not HS256', () => {
    const token = signHS256(payloadExample, SECRET);
    const [h, p, s] = token.split('.');

    const badHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const tampered = `${badHeader}.${p}.${s}`;
    expect(() => verifyHS256(tampered, SECRET)).toThrow('Unsupported JWT header');
  });
});
