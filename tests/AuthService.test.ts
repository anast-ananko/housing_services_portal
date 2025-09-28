import { AuthService } from '../src/services/AuthService';
import client from '../src/db/db';
import { UserEntity } from '../src/entities/UserEntity';
import { verifyPassword } from '../src/lib/password';

const userExample: UserEntity = {
  id: 1,
  email: 'test@example.com',
  role: 'resident',
  password_hash: 'hashed-pass',
  refresh_token: null,
  resident_id: null,
  manager_id: null,
};

jest.mock('../src/lib/password', () => ({
  verifyPassword: jest.fn(),
}));

const mockQuery = jest.fn();

describe('AuthService', () => {
  beforeAll(() => {
    const mockClient = client as Partial<typeof client>;
    mockClient.query = mockQuery;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await client.end();
  });

  describe('verifyUser', () => {
    it('should return user if password matches', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [userExample] });
      (verifyPassword as jest.Mock).mockReturnValueOnce(true);

      const result = await AuthService.verifyUser('test@example.com', '1234');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT *'), [
        'test@example.com',
      ]);
      expect(verifyPassword).toHaveBeenCalledWith('1234', 'hashed-pass');
      expect(result).toEqual(userExample);
    });

    it('should return null if user not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AuthService.verifyUser('notfound@example.com', '1234');

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [userExample] });
      (verifyPassword as jest.Mock).mockReturnValueOnce(false);

      const result = await AuthService.verifyUser('test@example.com', 'wrong');

      expect(result).toBeNull();
    });
  });

  describe('saveRefreshToken', () => {
    it('should update user refresh token', async () => {
      mockQuery.mockResolvedValueOnce({});

      await AuthService.saveRefreshToken('test@example.com', 'refresh123');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('UPDATE Users'), [
        'refresh123',
        'test@example.com',
      ]);
    });
  });

  describe('getUserByRefreshToken', () => {
    it('should return user if token found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [userExample] });

      const result = await AuthService.getUserByRefreshToken('refresh123');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT id, email'), [
        'refresh123',
      ]);
      expect(result).toEqual(userExample);
    });

    it('should return null if token not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AuthService.getUserByRefreshToken('invalid');

      expect(result).toBeNull();
    });
  });

  describe('clearRefreshToken', () => {
    it('should clear refresh token', async () => {
      mockQuery.mockResolvedValueOnce({});

      await AuthService.clearRefreshToken('test@example.com');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SET refresh_token = NULL'), [
        'test@example.com',
      ]);
    });
  });
});
