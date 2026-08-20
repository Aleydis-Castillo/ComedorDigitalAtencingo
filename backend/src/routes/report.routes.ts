import { Router } from 'express';

import {
  weeklyExcel,
  weeklyPdf,
  weeklyReport,
} from '../controllers/report.controller';

const reportRoutes =
  Router();

/*
 * Datos JSON
 */
reportRoutes.get(
  '/weekly',
  weeklyReport,
);

/*
 * Excel
 */
reportRoutes.get(
  '/weekly/excel',
  weeklyExcel,
);

/*
 * PDF
 */
reportRoutes.get(
  '/weekly/pdf',
  weeklyPdf,
);

export default reportRoutes;