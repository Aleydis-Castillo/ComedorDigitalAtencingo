import {
  Router,
} from 'express';

import {
  createExternalPersonnel,
  getExternalPersonnel,
  renewExternalPersonnel,
} from '../controllers/external.controller';

const externalRoutes =
  Router();

externalRoutes.get(
  '/',
  getExternalPersonnel,
);

externalRoutes.post(
  '/',
  createExternalPersonnel,
);

externalRoutes.patch(
  '/:id/renew',
  renewExternalPersonnel,
);

export default externalRoutes;