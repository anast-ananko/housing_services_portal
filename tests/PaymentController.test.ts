import { Request, Response } from 'express';
import client from '../src/db/db';
import { PaymentController } from '../src/controllers/PaymentController';
import { PaymentService } from '../src/services/PaymentService';

const payment = { id: 1, amount: 100 };

jest.mock('../src/services/PaymentService');

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

describe('PaymentController', () => {
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
    it('should return all payments', async () => {
      const payments = [payment];
      (PaymentService.getAll as jest.Mock).mockResolvedValueOnce(payments);

      await PaymentController.getAll(mockReq as Request, mockRes as Response);

      expect(PaymentService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(payments);
    });

    it('should return 500 if service fails', async () => {
      (PaymentService.getAll as jest.Mock).mockRejectedValueOnce(new Error());

      await PaymentController.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch payments' });
    });
  });

  describe('getById', () => {
    it('should return a payment by id', async () => {
      mockReq.params = { id: '1' };
      (PaymentService.getById as jest.Mock).mockResolvedValueOnce(payment);

      await PaymentController.getById(mockReq as Request, mockRes as Response);

      expect(PaymentService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(payment);
    });

    it('should return 404 if payment not found', async () => {
      mockReq.params = { id: '1' };
      (PaymentService.getById as jest.Mock).mockResolvedValueOnce(null);

      await PaymentController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Payment not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (PaymentService.getById as jest.Mock).mockRejectedValueOnce(new Error());

      await PaymentController.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch payment' });
    });
  });

  describe('create', () => {
    it('should create a payment', async () => {
      mockReq.body = { amount: 100 };
      (PaymentService.create as jest.Mock).mockResolvedValueOnce(payment);

      await PaymentController.create(mockReq as Request, mockRes as Response);

      expect(PaymentService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(payment);
    });

    it('should return 500 if service fails', async () => {
      mockReq.body = { amount: 100 };
      (PaymentService.create as jest.Mock).mockRejectedValueOnce(new Error());

      await PaymentController.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to create payment' });
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const payment = { id: 1, amount: 200 };
      mockReq.params = { id: '1' };
      mockReq.body = { amount: 200 };
      (PaymentService.update as jest.Mock).mockResolvedValueOnce(payment);

      await PaymentController.update(mockReq as Request, mockRes as Response);

      expect(PaymentService.update).toHaveBeenCalledWith(1, mockReq.body);
      expect(mockRes.json).toHaveBeenCalledWith(payment);
    });

    it('should return 404 if payment not found', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { amount: 200 };
      (PaymentService.update as jest.Mock).mockResolvedValueOnce(null);

      await PaymentController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Payment not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { amount: 200 };
      (PaymentService.update as jest.Mock).mockRejectedValueOnce(new Error());

      await PaymentController.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to update payment' });
    });
  });

  describe('delete', () => {
    it('should delete a payment', async () => {
      mockReq.params = { id: '1' };
      (PaymentService.delete as jest.Mock).mockResolvedValueOnce(true);

      await PaymentController.delete(mockReq as Request, mockRes as Response);

      expect(PaymentService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 if payment not found', async () => {
      mockReq.params = { id: '1' };
      (PaymentService.delete as jest.Mock).mockResolvedValueOnce(false);

      await PaymentController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Payment not found' });
    });

    it('should return 500 if service fails', async () => {
      mockReq.params = { id: '1' };
      (PaymentService.delete as jest.Mock).mockRejectedValueOnce(new Error());

      await PaymentController.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to delete payment' });
    });
  });
});
