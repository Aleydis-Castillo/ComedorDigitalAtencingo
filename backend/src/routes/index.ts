import { Router } from 'express';

import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import menuRoutes from './menu.routes';
import orderRoutes from './order.routes';
import practitionerRoutes from './practitioner.routes';
import reportRoutes from './report.routes';
import userRoutes from './user.routes';
import externalRoutes from './external.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/events', eventRoutes);
router.use('/practitioners', practitionerRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/external',externalRoutes,);

export default router;