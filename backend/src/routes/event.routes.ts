import { Router } from 'express';

import {
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
} from '../controllers/event.controller';

const eventRoutes =
  Router();

eventRoutes.get(
  '/',
  listEvents,
);

eventRoutes.post(
  '/',
  createEvent,
);

eventRoutes.patch(
  '/:id',
  updateEvent,
);

eventRoutes.delete(
  '/:id',
  deleteEvent,
);

export default eventRoutes;