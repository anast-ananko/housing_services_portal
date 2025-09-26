import { PaymentService } from '../src/services/PaymentService';
import client from '../src/db/db';
import { PaymentEntity } from '../src/entities/PaymentEntity';

const paymentExample: Omit<PaymentEntity, 'id'> = {
  request_id: 1,
  amount: 10,
  method: 'card',
  status: 'pending',
};
const updatedPaymentExample: Omit<PaymentEntity, 'id'> = {
  request_id: 1,
  amount: 10,
  method: 'card',
  status: 'paid',
};

const mockQuery = jest.fn();

describe('PaymentService', () => {
  beforeAll(() => {
    (client as any).query = mockQuery;
  });

  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('should create payment', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...paymentExample }] });

    const result = await PaymentService.create(paymentExample);

    expect(result.id).toBe(1);
    expect(result.status).toBe(paymentExample.status);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Payments'),
      expect.any(Array)
    );
  });

  it('should get payment by id', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...paymentExample }] });

    const result = await PaymentService.getById(1);

    expect(result?.status).toBe(paymentExample.status);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
  });

  it('should return null if not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await PaymentService.getById(999);

    expect(result).toBeNull();
  });

  it('should get all payments', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        { id: 1, request_id: 1, amount: 10, method: 'card', status: 'paid' },
        { id: 2, request_id: 3, amount: 20, method: 'card', status: 'paid' },
      ],
    });

    const result = await PaymentService.getAll();

    expect(result).toHaveLength(2);
    expect(result[1].amount).toBe(20);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
  });

  it('should update payment', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedPaymentExample }] });

    const result = await PaymentService.update(1, {
      status: 'paid',
    });

    expect(result?.status).toBe('paid');
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Payments'),
      expect.arrayContaining([1])
    );
  });

  it('should delete payment', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const result = await PaymentService.delete(1);

    expect(result).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Payments'), [1]);
  });

  it('should return false if payments not found on delete', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const result = await PaymentService.delete(999);

    expect(result).toBe(false);
  });

  afterAll(async () => {
    await client.end();
  });
});
