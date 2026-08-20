import { API_URL } from './api';

export type ReportGroup =
  | 'EXTERNAL_PERSONNEL'
  | 'FACTORY_SUGAR_WAREHOUSE'
  | 'ADMINISTRATION_FIELD'
  | 'CORPORATE_PERSONNEL'
  | 'PRACTITIONERS'
  | 'FACTORY_LABORATORY'
  | 'HR_SAFETY_TRAINING';

export type ExternalPersonnelType =
  | 'VISIT'
  | 'SCHEDULED'
  | 'OTHER_MILL';

export interface WeeklyReportRow {
  reportGroup:
    | ReportGroup
    | null;

  groupName: string;

  externalType:
    | ExternalPersonnelType
    | null;

  department: string;

  workLocation: string;

  employeeNumber: string;

  name: string;

  service:
    | 'BREAKFAST'
    | 'LUNCH';

  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

export interface WeeklyReportGroup {
  key: ReportGroup;
  name: string;
  rows: WeeklyReportRow[];
}

export interface WeeklyReportGroupTotal {
  key: ReportGroup;
  name: string;

  people: number;
  breakfast: number;
  lunch: number;
  totalOrders: number;
}

export interface WeeklyReport {
  week: {
    startDate: string;
    endDate: string;

    days: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
  };

  totals: {
    employees: number;
    breakfast: number;
    lunch: number;
    totalOrders: number;
  };

  groupTotals:
    WeeklyReportGroupTotal[];

  rows:
    WeeklyReportRow[];

  groups:
    WeeklyReportGroup[];
}

interface WeeklyReportResponse {
  report: WeeklyReport;
}

export async function getWeeklyReport(
  startDate: string,
) {
  const response =
    await fetch(
      `${API_URL}/reports/weekly?startDate=${startDate}`,
    );

  const data =
    (await response.json()) as
      | WeeklyReportResponse
      | {
          message?: string;
        };

  if (!response.ok) {
    const message =
      'message' in data &&
      data.message
        ? data.message
        : 'No fue posible consultar el reporte semanal.';

    throw new Error(message);
  }

  return (
    data as WeeklyReportResponse
  ).report;
}