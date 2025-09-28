import { Request, Response } from 'express';
import client from '../src/db/db';
import { RequestController } from '../src/controllers/RequestController';
import { RequestService } from '../src/services/RequestService';

const request = { id: 1, description: 'Test request' };

jest.mock('../src/services/RequestService');

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

describe('RequestController', () => {
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
    it('should return all requests', async () => {
      const requests = [request];
      (RequestService.getAll as jest.Mock).mockResolvedValueOnce(requests);

      await RequestController.getAll(mockReq as Request, mockRes as Response);

      expect(RequestService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(requests);
    });

    it('should return 500 if service fails', async () => {
      (RequestService.getAll as jest.Mock).mockRejectedValueOnce(new Error());

      await RequestController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch requests' });
    });
  });

  describe('getById', () => {
    it('should return a request by id', async () => {
      mockReq.params = { id: '1' };
      (RequestService.getById as jest.Mock).mockResolvedValueOnce(request);

      await RequestController.getById(mockReq as Request, mockRes as Response);

      expect(RequestService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(request);
    });

    it('should return 404 if request not found', async () => {
      mockReq.params = { id: '1' };
      (RequestService.getById as jest.Mock).mockResolvedValueOnce(null);

      await RequestController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Request not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (RequestService.getById as jest.Mock).mockRejectedValueOnce(new Error());

      await RequestController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch request' });
    });
  });

  describe('create', () => {
    it('should create a request', async () => {
      mockReq.body = { description: 'Test request' };
      (RequestService.create as jest.Mock).mockResolvedValueOnce(request);

      await RequestController.create(mockReq as Request, mockRes as Response);

      expect(RequestService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(request);
    });

    it('should return 500 if service fails', async () => {
      mockReq.body = { description: 'New request' };
      (RequestService.create as jest.Mock).mockRejectedValueOnce(new Error());

      await RequestController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create request' });
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      const request = { id: 1, description: 'Updated request' };
      mockReq.params = { id: '1' };
      mockReq.body = { description: 'Updated request' };
      (RequestService.update as jest.Mock).mockResolvedValueOnce(request);

      await RequestController.update(mockReq as Request, mockRes as Response);

      expect(RequestService.update).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith(request);
    });

    it('should return 404 if request not found', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { description: 'Updated request' };
      (RequestService.update as jest.Mock).mockResolvedValueOnce(null);

      await RequestController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Request not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { description: 'Updated request' };
      (RequestService.update as jest.Mock).mockRejectedValueOnce(new Error());

      await RequestController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update request' });
    });
  });

  describe('delete', () => {
    it('should delete a request', async () => {
      mockReq.params = { id: '1' };
      (RequestService.delete as jest.Mock).mockResolvedValueOnce(true);

      await RequestController.delete(mockReq as Request, mockRes as Response);

      expect(RequestService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 if request not found', async () => {
      mockReq.params = { id: '1' };
      (RequestService.delete as jest.Mock).mockResolvedValueOnce(false);

      await RequestController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Request not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (RequestService.delete as jest.Mock).mockRejectedValueOnce(new Error());

      await RequestController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete request' });
    });
  });
});
