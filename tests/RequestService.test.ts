import { RequestService } from '../src/services/RequestService';
import client from '../src/db/db';
import { RequestEntity } from '../src/entities/RequestEntity';

const requestExample: Omit<RequestEntity, 'id'> = {
  resident_id: 1,
  service_id: 1,
  status: 'pending',
  created_at: new Date('2023-01-01T10:00:00Z'),
  updated_at: new Date('2023-01-01T10:00:00Z'),
};
const updatedRequestExample: Omit<RequestEntity, 'id'> = {
  resident_id: 1,
  service_id: 1,
  status: 'approved',
  created_at: new Date('2023-01-01T10:00:00Z'),
  updated_at: new Date('2023-01-01T10:00:00Z'),
};

const mockQuery = jest.fn();

describe('RequestService', () => {
  beforeAll(() => {
    (client as any).query = mockQuery;
  });

  beforeEach(() => {
    mockQuery.mockReset();
  });

  it('should create request', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...requestExample }] });

    const result = await RequestService.create(requestExample);

    expect(result.id).toBe(1);
    expect(result.status).toBe(requestExample.status);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Requests'),
      expect.any(Array)
    );
  });

  it('should get request by id', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...requestExample }] });

    const result = await RequestService.getById(1);

    expect(result?.status).toBe(requestExample.status);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
  });

  it('should return null if not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await RequestService.getById(999);

    expect(result).toBeNull();
  });

  it('should get all requests', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          resident_id: 1,
          service_id: 1,
          status: 'pending',
          created_at: new Date('2023-01-01T10:00:00Z'),
          updated_at: new Date('2023-01-01T10:00:00Z'),
        },
        {
          id: 2,
          resident_id: 2,
          service_id: 2,
          status: 'pending',
          created_at: new Date('2023-01-01T10:00:00Z'),
          updated_at: new Date('2023-01-01T10:00:00Z'),
        },
      ],
    });

    const result = await RequestService.getAll();

    expect(result).toHaveLength(2);
    expect(result[1].status).toBe('pending');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
  });

  it('should update request', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedRequestExample }] });

    const result = await RequestService.update(1, {
      status: 'approved',
    });

    expect(result?.status).toBe('approved');
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Requests'),
      expect.arrayContaining([1])
    );
  });

  it('should delete request', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const result = await RequestService.delete(1);

    expect(result).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Requests'), [1]);
  });

  it('should return false if requests not found on delete', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const result = await RequestService.delete(999);

    expect(result).toBe(false);
  });

  afterAll(async () => {
    await client.end();
  });
});
