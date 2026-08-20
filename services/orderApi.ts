import { API_URL } from './api';

export interface CreateOrderRequest {
  userId: string;
  dishId: string;
  service: 'BREAKFAST' | 'LUNCH';
  deliveryType: 'CAFETERIA' | 'OFFICE';
  zone: string | null;
  location: string | null;
  observations: string | null;
  orderedFor: string;
}

export interface CreateOrderResponse {
  message: string;

  order: {
    id: string;
    folio: string;
    userId: string;
    dishId: string;
    service: 'BREAKFAST' | 'LUNCH';
    deliveryType: 'CAFETERIA' | 'OFFICE';
    zone: string | null;
    location: string | null;
    observations: string | null;
    status: string;
    orderedFor: string;
    createdAt: string;

    user: {
      id: string;
      employeeNumber: string | null;
      name: string;
    };

    dish: {
      id: string;
      name: string;
      description: string | null;
    };
  };
}

export async function createOrder(
  orderData: CreateOrderRequest,
) {
  const response = await fetch(
    `${API_URL}/orders`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(orderData),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'No fue posible registrar el pedido.',
    );
  }

  return data as CreateOrderResponse;
}

export interface UserOrder {
  id: string;
  folio: string;

  service: 'BREAKFAST' | 'LUNCH';

  deliveryType:
    | 'CAFETERIA'
    | 'OFFICE';

  zone: string | null;
  location: string | null;
  observations: string | null;

  status:
    | 'PENDING'
    | 'PREPARING'
    | 'READY'
    | 'DELIVERED'
    | 'CANCELLED';

  orderedFor: string;
  createdAt: string;

  dish: {
    id: string;
    name: string;
    description: string | null;
    service: 'BREAKFAST' | 'LUNCH';
  };

  signature: {
    type: 'BIOMETRIC' | 'DRAWN';
    signedAt: string;
  } | null;
}

interface GetUserOrdersResponse {
  orders: UserOrder[];
}

export async function getUserOrders(
  userId: string,
) {
  const response = await fetch(
    `${API_URL}/orders/user/${userId}`,
  );

  const data =
    (await response.json()) as
      | GetUserOrdersResponse
      | {
          message?: string;
        };

  if (!response.ok) {
    const message =
      'message' in data &&
      data.message
        ? data.message
        : 'No fue posible consultar los pedidos.';

    throw new Error(message);
  }

  return (
    data as GetUserOrdersResponse
  ).orders;
}

export interface ComedorOrder {
  id: string;
  folio: string;

  service: 'BREAKFAST' | 'LUNCH';

  deliveryType:
    | 'CAFETERIA'
    | 'OFFICE';

  zone: string | null;
  location: string | null;
  observations: string | null;

  status:
    | 'PENDING'
    | 'PREPARING'
    | 'READY'
    | 'DELIVERED'
    | 'CANCELLED';

  orderedFor: string;
  deliveredAt: string | null;
  createdAt: string;

  user: {
    id: string;
    employeeNumber: string | null;
    name: string;
    department: string | null;
  };

  dish: {
    id: string;
    name: string;
    description: string | null;
    service: 'BREAKFAST' | 'LUNCH';
  };
}

interface GetAllOrdersResponse {
  orders: ComedorOrder[];
}

interface UpdateOrderStatusResponse {
  message: string;
  order: ComedorOrder;
}

export async function getAllOrders() {
  const response = await fetch(
    `${API_URL}/orders`,
  );

  const data =
    (await response.json()) as
      | GetAllOrdersResponse
      | {
          message?: string;
        };

  if (!response.ok) {
    const message =
      'message' in data &&
      data.message
        ? data.message
        : 'No fue posible consultar los pedidos.';

    throw new Error(message);
  }

  return (
    data as GetAllOrdersResponse
  ).orders;
}

export async function updateOrderStatus(
  orderId: string,
  status:
    | 'PENDING'
    | 'PREPARING'
    | 'READY'
    | 'DELIVERED'
    | 'CANCELLED',
) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/status`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  const data =
    (await response.json()) as
      | UpdateOrderStatusResponse
      | {
          message?: string;
        };

  if (!response.ok) {
    const message =
      'message' in data &&
      data.message
        ? data.message
        : 'No fue posible actualizar el estado.';

    throw new Error(message);
  }

  return (
    data as UpdateOrderStatusResponse
  ).order;
}