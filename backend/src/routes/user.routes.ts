import {
  Router,
} from 'express';

import {
  findUserByEmployeeNumber,
  findUserById,
  identifyUserForTablet,
  saveUserClassification,
} from '../controllers/user.controller';

const userRoutes =
  Router();

/*
 * Tablet:
 *
 * 1001
 * PRAC-123456
 */
userRoutes.get(
  '/tablet/identify/:identifier',
  identifyUserForTablet,
);

/*
 * Empleado por número.
 */
userRoutes.get(
  '/employee/:employeeNumber',
  findUserByEmployeeNumber,
);

/*
 * Usuario por ID.
 */
userRoutes.get(
  '/:id',
  findUserById,
);

/*
 * Clasificación y ubicación.
 */
userRoutes.patch(
  '/:id/classification',
  saveUserClassification,
);

export default userRoutes;