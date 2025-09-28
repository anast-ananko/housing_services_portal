import { Request, Response } from 'express';
import client from '../src/db/db';
import { UserController } from '../src/controllers/UserController';
import { UserService } from '../src/services/UserService';
import { AuthRequest } from 'types/express';
import { UserEntity } from 'entities/UserEntity';

export const userExample: UserEntity = {
  id: 1,
  email: 'test@example.com',
  role: 'admin',
  password_hash: 'hashed123',
  refresh_token: null,
  resident_id: null,
  manager_id: null,
};

export const updatedUserExample: UserEntity = {
  ...userExample,
  email: 'updated@example.com',
};

jest.mock('../src/services/UserService');

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

describe('UserController', () => {
  let mockReq: Partial<Request & AuthRequest>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await client.end();
  });

  describe('getProfile', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockReq.user = undefined;

      await UserController.getProfile(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return user profile if authenticated', async () => {
      mockReq.user = userExample;
      (UserService.getUserById as jest.Mock).mockResolvedValueOnce(userExample);

      await UserController.getProfile(mockReq as AuthRequest, mockRes as Response);

      expect(UserService.getUserById).toHaveBeenCalledWith(userExample.id);
      expect(mockRes.json).toHaveBeenCalledWith(userExample);
    });

    it('should return 404 if user not found', async () => {
      mockReq.user = userExample;
      (UserService.getUserById as jest.Mock).mockResolvedValueOnce(null);

      await UserController.getProfile(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.user = userExample;
      (UserService.getUserById as jest.Mock).mockRejectedValueOnce(new Error());

      await UserController.getProfile(mockReq as AuthRequest, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to load profile' });
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'John' }];
      (UserService.getAll as jest.Mock).mockResolvedValueOnce(users);

      await UserController.getAll(mockReq as Request, mockRes as Response);

      expect(UserService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(users);
    });

    it('should return 500 if service fails', async () => {
      (UserService.getAll as jest.Mock).mockRejectedValueOnce(new Error());

      await UserController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch users' });
    });
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'John' };
      mockReq.params = { id: '1' };
      (UserService.getUserById as jest.Mock).mockResolvedValueOnce(user);

      await UserController.getById(mockReq as Request, mockRes as Response);

      expect(UserService.getUserById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: '1' };
      (UserService.getUserById as jest.Mock).mockResolvedValueOnce(null);

      await UserController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (UserService.getUserById as jest.Mock).mockRejectedValueOnce(new Error());

      await UserController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch user' });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = { id: 1, name: 'John Updated' };
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'John Updated' };
      (UserService.updateUser as jest.Mock).mockResolvedValueOnce(user);

      await UserController.update(mockReq as Request, mockRes as Response);

      expect(UserService.updateUser).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'John Updated' };
      (UserService.updateUser as jest.Mock).mockResolvedValueOnce(null);

      await UserController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'John Updated' };
      (UserService.updateUser as jest.Mock).mockRejectedValueOnce(new Error());

      await UserController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update user' });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockReq.params = { id: '1' };
      (UserService.delete as jest.Mock).mockResolvedValueOnce(true);

      await UserController.delete(mockReq as Request, mockRes as Response);

      expect(UserService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: '1' };
      (UserService.delete as jest.Mock).mockResolvedValueOnce(false);

      await UserController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (UserService.delete as jest.Mock).mockRejectedValueOnce(new Error());

      await UserController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete user' });
    });
  });
});
