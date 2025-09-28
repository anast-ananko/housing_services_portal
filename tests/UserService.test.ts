import { UserService } from '../src/services/UserService';
import client from '../src/db/db';
import { UserEntity } from '../src/entities/UserEntity';
import * as passwordLib from '../src/lib/password';

const userExample: Omit<UserEntity, 'id'> = {
  email: 'test@example.com',
  role: 'resident',
  password_hash: 'hashed-pass',
  refresh_token: null,
  resident_id: null,
  manager_id: null,
};

const updatedUserExample: Omit<UserEntity, 'id'> = {
  ...userExample,
  role: 'manager',
};

const mockQuery = jest.fn();
const mockHashPassword = jest.fn();

describe('UserService', () => {
  beforeAll(() => {
    const mockClient = client as Partial<typeof client>;
    mockClient.query = mockQuery;
    jest.spyOn(passwordLib, 'hashPassword').mockImplementation(mockHashPassword);
  });

  beforeEach(() => {
    mockQuery.mockReset();
    mockHashPassword.mockReset();
  });

  afterAll(async () => {
    await client.end();
  });

  it('should create user', async () => {
    mockHashPassword.mockReturnValue('hashed-pass');
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...userExample }] });

    const result = await UserService.createUser('test@example.com', 'password', 'resident');

    expect(result.id).toBe(1);
    expect(mockHashPassword).toHaveBeenCalledWith('password');
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Users'),
      expect.any(Array)
    );
  });

  it('should get all users', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...userExample }] });

    const result = await UserService.getAll();

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('test@example.com');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
  });

  it('should get user by id', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...userExample }] });

    const result = await UserService.getUserById(1);

    expect(result?.id).toBe(1);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
  });

  it('should return null if user by id not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await UserService.getUserById(999);

    expect(result).toBeNull();
  });

  it('should get user by email', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...userExample }] });

    const result = await UserService.getUserByEmail('test@example.com');

    expect(result?.email).toBe('test@example.com');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), ['test@example.com']);
  });

  it('should update user', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, ...updatedUserExample }] });

    const result = await UserService.updateUser(1, { role: 'manager' });

    expect(result?.role).toBe('manager');
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Users'),
      expect.arrayContaining([1])
    );
  });

  it('should update password', async () => {
    mockHashPassword.mockReturnValue('new-hash');
    mockQuery.mockResolvedValueOnce({});

    await UserService.updatePassword('test@example.com', 'newpass');

    expect(mockHashPassword).toHaveBeenCalledWith('newpass');
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('UPDATE Users'), [
      'new-hash',
      'test@example.com',
    ]);
  });

  it('should delete user', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });

    const result = await UserService.delete(1);

    expect(result).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Users'), [1]);
  });

  it('should return false if user not found on delete', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });

    const result = await UserService.delete(999);

    expect(result).toBe(false);
  });
});
