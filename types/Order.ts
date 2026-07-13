export interface Order {
  employeeId: number;
  employeeName: string;

  mealType: 'Desayuno' | 'Comida';

  dishName: string;

  deliveryType:
    | 'Comedor'
    | 'Oficina';

  date: string;

  signature?: string;
}