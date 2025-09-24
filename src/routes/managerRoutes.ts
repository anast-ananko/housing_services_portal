import { Router } from 'express';
import { ManagerController } from '../controllers/ManagerController';

const router = Router();

router.get('/', ManagerController.getAll);
router.get('/:id', ManagerController.getById);
router.post('/', ManagerController.create);
router.put('/:id', ManagerController.update);
router.delete('/:id', ManagerController.delete);

export default router;