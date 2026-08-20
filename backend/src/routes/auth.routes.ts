import { Router } from 'express';

import {
  checkActivation,
  createPassword,
  login,
} from '../controllers/auth.controller';

const authRoutes = Router();

/*
 * Login
 */
authRoutes.post(
  '/login',
  login,
);

/*
 * Primer acceso
 */
authRoutes.post(
  '/activate/check',
  checkActivation,
);

/*
 * Crear contraseña
 */
authRoutes.post(
  '/activate/password',
  createPassword,
);

export default authRoutes;