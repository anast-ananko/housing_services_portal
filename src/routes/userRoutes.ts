import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from 'middleware/authMiddleware';

const router = Router();

router.get('/me', authMiddleware, UserController.getProfile);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
