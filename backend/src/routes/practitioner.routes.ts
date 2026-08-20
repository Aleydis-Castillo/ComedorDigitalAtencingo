import { Router } from 'express';

import {
  createPractitioner,
  getPractitioners,
  renewPractitioner,
} from '../controllers/practitioner.controller';

const practitionerRoutes =
  Router();

practitionerRoutes.get(
  '/',
  getPractitioners,
);

practitionerRoutes.post(
  '/',
  createPractitioner,
);

practitionerRoutes.patch(
  '/:id/renew',
  renewPractitioner,
);

export default practitionerRoutes;