import axios from 'axios';

const baseUrl = 'http://localhost:3000';
const email = `test${Date.now()}@example.com`;
const password = 'testpass';

describe('Auth API', () => {
  let accessToken: string;
  let refreshToken: string;

  it('should register a new user', async () => {
    const res = await axios.post(`${baseUrl}/auth/register`, { email, password });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('message', 'User registered');
  });

  it('should login and return a token', async () => {
    const res = await axios.post(`${baseUrl}/auth/login`, { email, password });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('accessToken');
    expect(res.data).toHaveProperty('refreshToken');

    accessToken = res.data.accessToken;
    refreshToken = res.data.refreshToken;
  });

  it('should access protected route with token', async () => {
    const res = await axios.get(`${baseUrl}/protected`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message', 'You accessed protected route!');
    expect(res.data).toHaveProperty('email');
    expect(typeof res.data.email).toBe('string');
  });

  it('should access public route without token', async () => {
    const res = await axios.get(`${baseUrl}/public`);

    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('should refresh access token using refresh token', async () => {
    const oldAccessToken = accessToken;

    const res = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('accessToken');

    const newAccessToken = res.data.accessToken;

    expect(newAccessToken).not.toBe(oldAccessToken);

    const protectedRes = await axios.get(`${baseUrl}/protected`, {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    expect(protectedRes.status).toBe(200);

    accessToken = newAccessToken;
  });
});
