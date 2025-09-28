import { Request, Response } from 'express';
import client from '../src/db/db';
import { ServiceController } from '../src/controllers/ServiceController';
import { ServiceService } from '../src/services/ServiceService';

const service = { id: 1, name: 'Cleaning' };

jest.mock('../src/services/ServiceService');

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

describe('ServiceController', () => {
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
    it('should return all services', async () => {
      const services = [service];
      (ServiceService.getAll as jest.Mock).mockResolvedValueOnce(services);

      await ServiceController.getAll(mockReq as Request, mockRes as Response);

      expect(ServiceService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(services);
    });

    it('should return 500 if service fails', async () => {
      (ServiceService.getAll as jest.Mock).mockRejectedValueOnce(new Error());

      await ServiceController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch services' });
    });
  });

  describe('getById', () => {
    it('should return a service by id', async () => {
      mockReq.params = { id: '1' };
      (ServiceService.getById as jest.Mock).mockResolvedValueOnce(service);

      await ServiceController.getById(mockReq as Request, mockRes as Response);

      expect(ServiceService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(service);
    });

    it('should return 404 if service not found', async () => {
      mockReq.params = { id: '1' };
      (ServiceService.getById as jest.Mock).mockResolvedValueOnce(null);

      await ServiceController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (ServiceService.getById as jest.Mock).mockRejectedValueOnce(new Error());

      await ServiceController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch service' });
    });
  });

  describe('create', () => {
    it('should create a service', async () => {
      mockReq.body = { name: 'Cleaning' };
      (ServiceService.create as jest.Mock).mockResolvedValueOnce(service);

      await ServiceController.create(mockReq as Request, mockRes as Response);

      expect(ServiceService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(service);
    });

    it('should return 500 if service fails', async () => {
      mockReq.body = { name: 'Cleaning' };
      (ServiceService.create as jest.Mock).mockRejectedValueOnce(new Error());

      await ServiceController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create service' });
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const service = { id: 1, name: 'Updated Service' };
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Service' };
      (ServiceService.update as jest.Mock).mockResolvedValueOnce(service);

      await ServiceController.update(mockReq as Request, mockRes as Response);

      expect(ServiceService.update).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith(service);
    });

    it('should return 404 if service not found', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Service' };
      (ServiceService.update as jest.Mock).mockResolvedValueOnce(null);

      await ServiceController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'Updated Service' };
      (ServiceService.update as jest.Mock).mockRejectedValueOnce(new Error());

      await ServiceController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update service' });
    });
  });

  describe('delete', () => {
    it('should delete a service', async () => {
      mockReq.params = { id: '1' };
      (ServiceService.delete as jest.Mock).mockResolvedValueOnce(true);

      await ServiceController.delete(mockReq as Request, mockRes as Response);

      expect(ServiceService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 if service not found', async () => {
      mockReq.params = { id: '1' };
      (ServiceService.delete as jest.Mock).mockResolvedValueOnce(false);

      await ServiceController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Service not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (ServiceService.delete as jest.Mock).mockRejectedValueOnce(new Error());

      await ServiceController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete service' });
    });
  });
});
