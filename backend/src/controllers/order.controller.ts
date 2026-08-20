import type {
  Request,
  Response,
} from 'express';

import {
  createOrderRecord,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
} from '../services/order.service';

type OrderStatusValue =
  | 'PENDING'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export async function createOrder(
  request: Request,
  response: Response,
) {
  try {
    const {
      userId,
      dishId,
      service,
      deliveryType,
      zone,
      location,
      observations,
      orderedFor,
      signatureData,
    } = request.body;


    if (
      typeof userId !==
        'string' ||
      !userId.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'El usuario es obligatorio.',
        });
    }

    if (
      typeof dishId !==
        'string' ||
      !dishId.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'Debes seleccionar un platillo.',
        });
    }

    if (
      service !==
        'BREAKFAST' &&
      service !==
        'LUNCH'
    ) {
      return response
        .status(400)
        .json({
          message:
            'El servicio debe ser BREAKFAST o LUNCH.',
        });
    }

 
    if (
      deliveryType !==
        'CAFETERIA' &&
      deliveryType !==
        'OFFICE'
    ) {
      return response
        .status(400)
        .json({
          message:
            'El tipo de entrega no es válido.',
        });
    }

 
    if (
      deliveryType ===
        'OFFICE' &&
      (
        typeof location !==
          'string' ||
        !location.trim()
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'La ubicación es obligatoria para entrega en oficina.',
        });
    }

  
    const orderDate =
      typeof orderedFor ===
        'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        orderedFor,
      )
        ? orderedFor
        : new Date()
            .toISOString()
            .slice(0, 10);

  
    const cleanZone =
      deliveryType ===
        'OFFICE' &&
      typeof zone ===
        'string' &&
      zone.trim()
        ? zone.trim()
        : null;

  
    const cleanLocation =
      deliveryType ===
        'OFFICE' &&
      typeof location ===
        'string'
        ? location.trim()
        : null;

    const order =
      await createOrderRecord({
        userId:
          userId.trim(),

        dishId:
          dishId.trim(),

        service,

        deliveryType,

  
        zone:
          cleanZone,

        location:
          cleanLocation,

        observations:
          typeof observations ===
            'string' &&
          observations.trim()
            ? observations.trim()
            : null,

        orderedFor:
          orderDate,

        signatureData:
          typeof signatureData ===
            'string' &&
          signatureData.trim()
            ? signatureData.trim()
            : null,
      });

    return response
      .status(201)
      .json({
        message:
          'Pedido registrado correctamente.',

        order,
      });
  } catch (error) {
    console.error(
      'Error al registrar el pedido:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible registrar el pedido.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}


export async function getUserOrders(
  request: Request,
  response: Response,
) {
  try {
    const userId =
      request.params.userId;

    if (
      typeof userId !==
        'string' ||
      !userId.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'El usuario es obligatorio.',
        });
    }

    const orders =
      await getOrdersByUser(
        userId.trim(),
      );

    return response
      .status(200)
      .json({
        orders,
      });
  } catch (error) {
    console.error(
      'Error al consultar los pedidos:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible consultar los pedidos.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}


export async function getOrders(
  _request: Request,
  response: Response,
) {
  try {
    const orders =
      await getAllOrders();

    return response
      .status(200)
      .json({
        orders,
      });
  } catch (error) {
    console.error(
      'Error al consultar todos los pedidos:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible consultar los pedidos.',
      });
  }
}


export async function changeOrderStatus(
  request: Request,
  response: Response,
) {
  try {
    const orderId =
      request.params.id;

    const {
      status,
    } = request.body;

    if (
      typeof orderId !==
        'string' ||
      !orderId.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'El identificador del pedido es obligatorio.',
        });
    }

    const validStatuses:
      OrderStatusValue[] = [
        'PENDING',
        'PREPARING',
        'READY',
        'DELIVERED',
        'CANCELLED',
      ];

    if (
      typeof status !==
        'string' ||
      !validStatuses.includes(
        status as
          OrderStatusValue,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'El estado del pedido no es válido.',
        });
    }

    const order =
      await updateOrderStatus(
        orderId.trim(),

        status as
          OrderStatusValue,
      );

    return response
      .status(200)
      .json({
        message:
          'Estado actualizado correctamente.',

        order,
      });
  } catch (error) {
    console.error(
      'Error al actualizar el estado:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible actualizar el estado.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}