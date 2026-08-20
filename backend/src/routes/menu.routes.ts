import { Router } from 'express';

import {
  getMenu,
  publishMenu,
  saveMenu,
} from '../controllers/menu.controller';

const menuRoutes = Router();

menuRoutes.get('/', getMenu);
menuRoutes.put('/day', saveMenu);
menuRoutes.patch('/publish', publishMenu);

export default menuRoutes;