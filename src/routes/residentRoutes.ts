import { Router } from 'express';
import { ResidentController } from '../controllers/ResidentController';

const router = Router();

router.get('/', ResidentController.getAll);
router.get('/:id', ResidentController.getById);
router.post('/', ResidentController.create);
router.put('/:id', ResidentController.update);
router.delete('/:id', ResidentController.delete);

export default router;
