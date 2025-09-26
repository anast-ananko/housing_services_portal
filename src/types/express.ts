import { Request } from 'express';
import { User } from './types';

export interface AuthRequest extends Request {
  user?: User;
}
