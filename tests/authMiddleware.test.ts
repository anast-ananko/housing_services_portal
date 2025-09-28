import { authMiddleware } from '../src/middleware/authMiddleware';
import * as jwtLib from '../src/lib/jwt';
import { AuthRequest } from '../src/types/express';
import { Response, NextFunction } from 'express';

describe('authMiddleware', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no Authorization header', () => {
    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header does not start with Bearer', () => {
    mockReq.headers = { authorization: 'Basic abc123' };

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if verifyHS256 throws', () => {
    mockReq.headers = { authorization: 'Bearer invalidtoken' };
    jest.spyOn(jwtLib, 'verifyHS256').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next and set req.user if token is valid', () => {
    const fakePayload = { id: 1, email: 'test@example.com', role: 'resident' };
    mockReq.headers = { authorization: 'Bearer validtoken' };
    jest.spyOn(jwtLib, 'verifyHS256').mockReturnValue(fakePayload);

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockReq.user).toEqual(fakePayload);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
