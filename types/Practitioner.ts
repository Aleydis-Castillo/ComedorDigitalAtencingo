export interface Practitioner {
  id: number;
  code: string;
  name: string;
  email: string;
  university: string;
  department: string;

  startDate: string;
  endDate: string;

  active: boolean;
}