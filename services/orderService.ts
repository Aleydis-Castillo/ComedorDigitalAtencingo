import { Order } from '../types/Order';

let orders: Order[] = [];

export function saveOrder(
  order: Order
) {
  orders.push(order);
}

export function getOrders() {
  return orders;
}