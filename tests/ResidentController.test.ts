import { Request, Response } from 'express';
import client from '../src/db/db';
import { ResidentController } from '../src/controllers/ResidentController';
import { ResidentService } from '../src/services/ResidentService';

const resident = { id: 1, name: 'John Doe' };

jest.mock('../src/services/ResidentService');

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

describe('ResidentController', () => {
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
    it('should return all residents', async () => {
      const residents = [resident];
      (ResidentService.getAll as jest.Mock).mockResolvedValueOnce(residents);

      await ResidentController.getAll(mockReq as Request, mockRes as Response);

      expect(ResidentService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(residents);
    });

    it('should return 500 if service fails', async () => {
      (ResidentService.getAll as jest.Mock).mockRejectedValueOnce(new Error());

      await ResidentController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch residents' });
    });
  });

  describe('getById', () => {
    it('should return a resident by id', async () => {
      mockReq.params = { id: '1' };
      (ResidentService.getById as jest.Mock).mockResolvedValueOnce(resident);

      await ResidentController.getById(mockReq as Request, mockRes as Response);

      expect(ResidentService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(resident);
    });

    it('should return 404 if resident not found', async () => {
      mockReq.params = { id: '1' };
      (ResidentService.getById as jest.Mock).mockResolvedValueOnce(null);

      await ResidentController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (ResidentService.getById as jest.Mock).mockRejectedValueOnce(new Error());

      await ResidentController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch resident' });
    });
  });

  describe('create', () => {
    it('should create a resident', async () => {
      mockReq.body = { name: 'John Doe' };
      (ResidentService.create as jest.Mock).mockResolvedValueOnce(resident);

      await ResidentController.create(mockReq as Request, mockRes as Response);

      expect(ResidentService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(resident);
    });

    it('should return 500 if service fails', async () => {
      mockReq.body = { name: 'John Doe' };
      (ResidentService.create as jest.Mock).mockRejectedValueOnce(new Error());

      await ResidentController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create resident' });
    });
  });

  describe('update', () => {
    it('should update a resident', async () => {
      const resident = { id: 1, name: 'Updated Name' };
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Name' };
      (ResidentService.update as jest.Mock).mockResolvedValueOnce(resident);

      await ResidentController.update(mockReq as Request, mockRes as Response);

      expect(ResidentService.update).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith(resident);
    });

    it('should return 404 if resident not found', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Name' };
      (ResidentService.update as jest.Mock).mockResolvedValueOnce(null);

      await ResidentController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Name' };
      (ResidentService.update as jest.Mock).mockRejectedValueOnce(new Error());

      await ResidentController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update resident' });
    });
  });

  describe('delete', () => {
    it('should delete a resident', async () => {
      mockReq.params = { id: '1' };
      (ResidentService.delete as jest.Mock).mockResolvedValueOnce(true);

      await ResidentController.delete(mockReq as Request, mockRes as Response);

      expect(ResidentService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 if resident not found', async () => {
      mockReq.params = { id: '1' };
      (ResidentService.delete as jest.Mock).mockResolvedValueOnce(false);

      await ResidentController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Resident not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (ResidentService.delete as jest.Mock).mockRejectedValueOnce(new Error());

      await ResidentController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete resident' });
    });
  });
});
