import crypto from 'crypto';
import { v4 as uuid } from 'uuid';

const base64url = {
  encode: (input: Buffer | string): string =>
    Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'),

  decode: (input: string): Buffer =>
    Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64'),
};

export function signHS256(
  payload: Record<string, unknown>,
  secret: string,
  options: { expiresInSeconds?: number } = {}
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload = {
    iat: now,
    ...(options.expiresInSeconds ? { exp: now + options.expiresInSeconds } : {}),
    jti: uuid(),
    ...payload,
  };

  const encodedHeader = base64url.encode(JSON.stringify(header));
  const encodedPayload = base64url.encode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac('sha256', secret).update(data).digest();
  const encodedSig = base64url.encode(signature);

  return `${data}.${encodedSig}`;
}

export function verifyHS256<T = Record<string, unknown>>(token: string, secret: string): T {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed JWT');

  const [h, p, s] = parts;

  const expected = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest();
  const sigBuf = base64url.decode(s);

  if (expected.length !== sigBuf.length || !crypto.timingSafeEqual(expected, sigBuf)) {
    throw new Error('Invalid signature');
  }

  const header = JSON.parse(base64url.decode(h).toString());
  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    throw new Error('Unsupported JWT header');
  }

  const payload = JSON.parse(base64url.decode(p).toString());
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && now > payload.exp) throw new Error('Token expired');

  return payload as T;
}
