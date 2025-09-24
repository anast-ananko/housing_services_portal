import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import residentRoutes from './residentRoutes';
import managerRoutes from './managerRoutes';
import serviceRoutes from './serviceRoutes';
import requestRoutes from './requestRoutes';
import paymentRoutes from './paymentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/residents', residentRoutes);
router.use('/managers', managerRoutes);
router.use('/services', serviceRoutes);
router.use('/requests', requestRoutes);
router.use('/payments', paymentRoutes);

export default router;