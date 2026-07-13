export interface Consumption {
  id: string;

  employeeNumber: string;

  name: string;

  date: string;

  breakfast?: string;

  lunch?: string;

  location:
    | 'comedor'
    | 'oficina';

  createdBy:
    | 'mobile'
    | 'tablet';

  signature?: string;

  createdAt: string;
}