import { Router } from 'express';
import { UserController } from '../controllers/AuthController';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/refresh', UserController.refresh);

export default router;
