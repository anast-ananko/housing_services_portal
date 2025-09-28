import { ResidentService } from '../src/services/ResidentService';
import client from '../src/db/db';
import { ResidentEntity } from 'entities/ResidentEntity';

const residentExample: Omit<ResidentEntity, 'id'> = {
  name: 'John Doe',
  email: 'john@example.com',
  created_at: new Date('2023-01-01T10:00:00Z'),
};

const updatedResidentExample: Omit<ResidentEntity, 'id'> = {
  ...residentExample,
  name: 'Updated',
};

const mockQuery = jest.fn();

describe('ResidentService', () => {
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

  it('should create resident', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...residentExample }] });

    const result = await ResidentService.create(residentExample);

    expect(result.id).toBe(1);
    expect(result.name).toBe(residentExample.name);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Residents'),
      expect.any(Array)
    );
  });

  it('should get resident by id', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...residentExample }] });

    const result = await ResidentService.getById(1);

    expect(result?.name).toBe(residentExample.name);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
  });

  it('should return null if not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await ResidentService.getById(999);

    expect(result).toBeNull();
  });

  it('should get all residents', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'A', email: 'a@example.com' },
        { id: 2, name: 'B', email: 'b@example.com' },
      ],
    });

    const result = await ResidentService.getAll();

    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('B');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
  });

  it('should update resident', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedResidentExample }] });

    const result = await ResidentService.update(1, {
      name: 'Updated',
    });

    expect(result?.name).toBe('Updated');
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Residents'),
      expect.arrayContaining([1])
    );
  });

  it('should delete resident', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const result = await ResidentService.delete(1);

    expect(result).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Residents'), [1]);
  });

  it('should return false if residents not found on delete', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const result = await ResidentService.delete(999);

    expect(result).toBe(false);
  });
});
