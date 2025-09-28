import { Request, Response } from 'express';
import client from '../src/db/db';
import { ManagerController } from '../src/controllers/ManagerController';
import { ManagerService } from '../src/services/ManagerService';

const manager = { id: 1, name: 'Manager1' };

jest.mock('../src/services/ManagerService');

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

describe('ManagerController', () => {
  let mockReq: Partial<Request>;
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

  describe('getAll', () => {
    it('should return all managers', async () => {
      const managers = [manager];
      (ManagerService.getAll as jest.Mock).mockResolvedValueOnce(managers);

      await ManagerController.getAll(mockReq as Request, mockRes as Response);

      expect(ManagerService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(managers);
    });

    it('should return 500 if service fails', async () => {
      (ManagerService.getAll as jest.Mock).mockRejectedValueOnce(new Error());

      await ManagerController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch managers' });
    });
  });

  describe('getById', () => {
    it('should return a manager by id', async () => {
      mockReq.params = { id: '1' };
      (ManagerService.getById as jest.Mock).mockResolvedValueOnce(manager);

      await ManagerController.getById(mockReq as Request, mockRes as Response);

      expect(ManagerService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(manager);
    });

    it('should return 404 if manager not found', async () => {
      mockReq.params = { id: '1' };
      (ManagerService.getById as jest.Mock).mockResolvedValueOnce(null);

      await ManagerController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Manager not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (ManagerService.getById as jest.Mock).mockRejectedValueOnce(new Error());

      await ManagerController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch manager' });
    });
  });

  describe('create', () => {
    it('should create a manager', async () => {
      mockReq.body = { name: 'Manager1' };
      (ManagerService.create as jest.Mock).mockResolvedValueOnce(manager);

      await ManagerController.create(mockReq as Request, mockRes as Response);

      expect(ManagerService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(manager);
    });

    it('should return 500 if service fails', async () => {
      mockReq.body = { name: 'Manager1' };
      (ManagerService.create as jest.Mock).mockRejectedValueOnce(new Error());

      await ManagerController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create manager' });
    });
  });

  describe('update', () => {
    it('should update a manager', async () => {
      const manager = { id: 1, name: 'Manager Updated' };
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Manager Updated' };
      (ManagerService.update as jest.Mock).mockResolvedValueOnce(manager);

      await ManagerController.update(mockReq as Request, mockRes as Response);

      expect(ManagerService.update).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith(manager);
    });

    it('should return 404 if manager not found', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Manager Updated' };
      (ManagerService.update as jest.Mock).mockResolvedValueOnce(null);

      await ManagerController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Manager not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Manager Updated' };
      (ManagerService.update as jest.Mock).mockRejectedValueOnce(new Error());

      await ManagerController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update manager' });
    });
  });

  describe('delete', () => {
    it('should delete a manager', async () => {
      mockReq.params = { id: '1' };
      (ManagerService.delete as jest.Mock).mockResolvedValueOnce(true);

      await ManagerController.delete(mockReq as Request, mockRes as Response);

      expect(ManagerService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 if manager not found', async () => {
      mockReq.params = { id: '1' };
      (ManagerService.delete as jest.Mock).mockResolvedValueOnce(false);

      await ManagerController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Manager not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (ManagerService.delete as jest.Mock).mockRejectedValueOnce(new Error());

      await ManagerController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete manager' });
    });
  });
});
