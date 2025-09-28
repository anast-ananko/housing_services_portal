import { AuthRequest } from '../src/types/express';
import client from '../src/db/db';
import { AuthController } from '../src/controllers/AuthController';
import { UserService } from '../src/services/UserService';
import { Response } from 'express';

jest.mock('../src/services/UserService');

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

const mockCreateUser = UserService.createUser as jest.Mock;

describe('AuthController', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await client.end();
  });

  it('should register a user successfully', async () => {
    mockReq.body = { email: 'test@example.com', password: '1234', role: 'resident' };

    mockCreateUser.mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      role: 'resident',
      resident_id: null,
      manager_id: null,
    });

    await AuthController.register(mockReq as AuthRequest, mockRes as Response);

    expect(mockCreateUser).toHaveBeenCalledWith(
      'test@example.com',
      '1234',
      'resident',
      undefined,
      undefined
    );
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User registered successfully',
      })
    );
  });

  it('should return 400 if email or password missing', async () => {
    mockReq.body = { role: 'resident' };

    await AuthController.register(mockReq as AuthRequest, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email and password required' });
  });
});
