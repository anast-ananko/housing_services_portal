import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { UserController } from '../controllers/AuthController';

dotenv.config();
const secret = process.env.SECRET_KEY;
if (!secret) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}
const SECRET_KEY: string = secret;

const refreshSecret = process.env.REFRESH_SECRET_KEY;
if (!refreshSecret) {
  throw new Error('REFRESH_SECRET_KEY is not defined in environment variables');
}
const REFRESH_SECRET_KEY: string = refreshSecret;

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/refresh', UserController.refresh);

export default router;
