import axios from 'axios';

const baseUrl = 'http://localhost:3000';
const email = `test${Date.now()}@example.com`;
const password = 'testpass';

describe('Auth API', () => {
  let token: string;

  it('should register a new user', async () => {
    const res = await axios.post(`${baseUrl}/auth/register`, { email, password });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('message', 'User registered');
  });

  it('should login and return a token', async () => {
    const res = await axios.post(`${baseUrl}/auth/login`, { email, password });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('token');
    token = res.data.token;
  });

  it('should access protected route with token', async () => {
    const res = await axios.get(`${baseUrl}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('message', 'You accessed protected route!');
    expect(res.data).toHaveProperty('user');
    expect(res.data.user).toMatchObject({
      email: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('should access public route without token', async () => {
    const res = await axios.get(`${baseUrl}/public`);

    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });
});
