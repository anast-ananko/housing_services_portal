import { ServiceService } from '../src/services/ServiceService';
import client from '../src/db/db';
import { ServiceEntity } from '../src/entities/ServiceEntity';

const serviceExample: Omit<ServiceEntity, 'id'> = {
  name: 'cleaning',
  cost: 20,
  is_active: false,
};

const updatedServiceExample: Omit<ServiceEntity, 'id'> = {
  ...serviceExample,
  is_active: true,
};

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

const mockQuery = jest.fn();

describe('ServiceService', () => {
  beforeAll(() => {
    const mockClient = client as Partial<typeof client>;
    mockClient.query = mockQuery;
  });

  beforeEach(() => {
    mockQuery.mockReset();
  });

  afterAll(async () => {
    await client.end();
  });

  it('should create service', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...serviceExample }] });

    const result = await ServiceService.create(serviceExample);

    expect(result.id).toBe(1);
    expect(result.is_active).toBe(false);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Services'),
      expect.any(Array)
    );
  });

  it('should get service by id', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...serviceExample }] });

    const result = await ServiceService.getById(1);

    expect(result?.is_active).toBe(false);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
  });

  it('should return null if not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await ServiceService.getById(999);

    expect(result).toBeNull();
  });

  it('should get all services', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: 'cleaning',
          cost: 20,
          is_active: false,
        },
        {
          id: 2,
          name: 'ironing',
          cost: 20,
          is_active: false,
        },
      ],
    });

    const result = await ServiceService.getAll();

    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('ironing');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
  });

  it('should update service', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedServiceExample }] });

    const result = await ServiceService.update(1, {
      is_active: true,
    });

    expect(result?.is_active).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Services'),
      expect.arrayContaining([1])
    );
  });

  it('should delete service', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const result = await ServiceService.delete(1);

    expect(result).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Service'), [1]);
  });

  it('should return false if services not found on delete', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const result = await ServiceService.delete(999);

    expect(result).toBe(false);
  });
});
