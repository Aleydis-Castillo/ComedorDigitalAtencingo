export interface Dish {
  id: number;
  name: string;
  totalPrepared: number;
  available: number;
}

export interface DayMenu {
  breakfast: Dish[];
  lunch: Dish[];
}