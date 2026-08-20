import { Router } from 'express';

import {
  changeOrderStatus,
  createOrder,
  getOrders,
  getUserOrders,
} from '../controllers/order.controller';

const orderRoutes = Router();

orderRoutes.get(
  '/',
  getOrders,
);

orderRoutes.get(
  '/user/:userId',
  getUserOrders,
);

orderRoutes.post(
  '/',
  createOrder,
);

orderRoutes.patch(
  '/:id/status',
  changeOrderStatus,
);

export default orderRoutes;