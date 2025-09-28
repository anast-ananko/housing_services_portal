import { ManagerService } from '../src/services/ManagerService';
import client from '../src/db/db';
import { ManagerEntity } from '../src/entities/ManagerEntity';

const managerExample: Omit<ManagerEntity, 'id'> = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
};

const updatedManagerExample: Omit<ManagerEntity, 'id'> = {
  ...managerExample,
  name: 'Updated',
};

jest.mock('../src/db/db', () => ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
}));

const mockQuery = jest.fn();

describe('ManagerService', () => {
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

  it('should create manager', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...managerExample }] });

    const result = await ManagerService.create(managerExample);

    expect(result.id).toBe(1);
    expect(result.name).toBe(managerExample.name);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Managers'),
      expect.any(Array)
    );
  });

  it('should get manager by id', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...managerExample }] });

    const result = await ManagerService.getById(1);

    expect(result?.name).toBe(managerExample.name);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
  });

  it('should return null if not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await ManagerService.getById(999);

    expect(result).toBeNull();
  });

  it('should get all managers', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'A', email: 'a@example.com', role: 'admin' },
        { id: 2, name: 'B', email: 'b@example.com', role: 'technician' },
      ],
    });

    const result = await ManagerService.getAll();

    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('B');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
  });

  it('should update manager', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedManagerExample }] });

    const result = await ManagerService.update(1, {
      name: 'Updated',
    });

    expect(result?.name).toBe('Updated');
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Managers'),
      expect.arrayContaining([1])
    );
  });

  it('should delete manager', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const result = await ManagerService.delete(1);

    expect(result).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Managers'), [1]);
  });

  it('should return false if managers not found on delete', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const result = await ManagerService.delete(999);

    expect(result).toBe(false);
  });
});
