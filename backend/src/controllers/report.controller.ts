import type {
  Request,
  Response,
} from 'express';

import {
  generateWeeklyExcel,
  generateWeeklyPdf,
} from '../services/report-export.service';

import {
  getWeeklyReport,
} from '../services/report.service';

type ReportGroupValue =
  | 'EXTERNAL_PERSONNEL'
  | 'FACTORY_SUGAR_WAREHOUSE'
  | 'ADMINISTRATION_FIELD'
  | 'CORPORATE_PERSONNEL'
  | 'PRACTITIONERS'
  | 'FACTORY_LABORATORY'
  | 'HR_SAFETY_TRAINING';

const validReportGroups:
  ReportGroupValue[] = [
    'EXTERNAL_PERSONNEL',
    'FACTORY_SUGAR_WAREHOUSE',
    'ADMINISTRATION_FIELD',
    'CORPORATE_PERSONNEL',
    'PRACTITIONERS',
    'FACTORY_LABORATORY',
    'HR_SAFETY_TRAINING',
  ];

/*
 * Valida YYYY-MM-DD
 */
function validateStartDate(
  value: unknown,
): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  );
}

/*
 * Valida grupo de reporte.
 */
function validateReportGroup(
  value: unknown,
): value is ReportGroupValue {
  return (
    typeof value === 'string' &&
    validReportGroups.includes(
      value as ReportGroupValue,
    )
  );
}

/*
 * Nombre corto utilizado
 * para descargar archivos.
 */
function getReportGroupFileName(
  group: ReportGroupValue,
) {
  switch (group) {
    case 'EXTERNAL_PERSONNEL':
      return 'personal-externo';

    case 'FACTORY_SUGAR_WAREHOUSE':
      return 'fabrica-bodega-azucar';

    case 'ADMINISTRATION_FIELD':
      return 'administracion-campo';

    case 'CORPORATE_PERSONNEL':
      return 'personal-corporativo';

    case 'PRACTITIONERS':
      return 'practicantes';

    case 'FACTORY_LABORATORY':
      return 'laboratorio-fabrica';

    case 'HR_SAFETY_TRAINING':
      return 'capital-humano-seguridad-capacitacion';
  }
}

/*
 * =================================
 * REPORTE SEMANAL
 * =================================
 *
 * GET
 * /api/reports/weekly
 *
 * ?startDate=2026-08-10
 */
export async function weeklyReport(
  request: Request,
  response: Response,
) {
  try {
    const startDate =
      request.query.startDate;

    if (
      !validateStartDate(
        startDate,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Debes proporcionar startDate con formato YYYY-MM-DD.',
        });
    }

    /*
     * Después de validateStartDate,
     * TypeScript ya sabe que
     * startDate es string.
     */
    const report =
      await getWeeklyReport(
        startDate,
      );

    return response
      .status(200)
      .json({
        report,
      });
  } catch (error) {
    console.error(
      'Error al generar reporte semanal:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible generar el reporte semanal.',
      });
  }
}

/*
 * =================================
 * EXCEL
 * =================================
 *
 * GET
 * /api/reports/weekly/excel
 *
 * ?startDate=2026-08-10
 * &reportGroup=PRACTITIONERS
 */
export async function weeklyExcel(
  request: Request,
  response: Response,
) {
  try {
    const startDate =
      request.query.startDate;

    const reportGroup =
      request.query.reportGroup;

    if (
      !validateStartDate(
        startDate,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Debes proporcionar startDate con formato YYYY-MM-DD.',
        });
    }

    if (
      !validateReportGroup(
        reportGroup,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Debes proporcionar un reportGroup válido.',
        });
    }

    const buffer =
      await generateWeeklyExcel(
        startDate,
        reportGroup,
      );

    const groupFileName =
      getReportGroupFileName(
        reportGroup,
      );

    const fileName =
      `reporte-${groupFileName}-${startDate}.xlsx`;

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`,
    );

    response.setHeader(
      'Content-Length',
      buffer.length,
    );

    return response.send(
      buffer,
    );
  } catch (error) {
    console.error(
      'Error al generar Excel:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible generar el archivo Excel.',
      });
  }
}

export async function weeklyPdf(
  request: Request,
  response: Response,
) {
  try {
    const startDate =
      request.query.startDate;

    const reportGroup =
      request.query.reportGroup;

    if (
      !validateStartDate(
        startDate,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Debes proporcionar startDate con formato YYYY-MM-DD.',
        });
    }

    if (
      !validateReportGroup(
        reportGroup,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Debes proporcionar un reportGroup válido.',
        });
    }

    const buffer =
      await generateWeeklyPdf(
        startDate,
        reportGroup,
      );

    const groupFileName =
      getReportGroupFileName(
        reportGroup,
      );

    const fileName =
      `reporte-${groupFileName}-${startDate}.pdf`;

    response.setHeader(
      'Content-Type',
      'application/pdf',
    );

    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`,
    );

    response.setHeader(
      'Content-Length',
      buffer.length,
    );

    return response.send(
      buffer,
    );
  } catch (error) {
    console.error(
      'Error al generar PDF:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible generar el archivo PDF.',
      });
  }
}