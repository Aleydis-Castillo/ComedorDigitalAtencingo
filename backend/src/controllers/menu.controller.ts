import type {
  Request,
  Response,
} from 'express';

import {
  getWeeklyMenu,
  publishWeeklyMenu,
  saveMenuService,
} from '../services/menu.service';

type ServiceValue = 'BREAKFAST' | 'LUNCH';

interface DishRequest {
  name?: unknown;
  description?: unknown;
}

export async function getMenu(
  request: Request,
  response: Response,
) {
  try {
    const startDate =
      typeof request.query.startDate === 'string'
        ? request.query.startDate
        : undefined;

    const endDate =
      typeof request.query.endDate === 'string'
        ? request.query.endDate
        : undefined;

    const menu = await getWeeklyMenu(
      startDate,
      endDate,
    );

    return response.status(200).json(menu);
  } catch (error) {
    console.error(
      'Error al consultar el menú:',
      error,
    );

    return response.status(500).json({
      message:
        'No fue posible consultar el menú semanal.',
    });
  }
}

export async function saveMenu(
  request: Request,
  response: Response,
) {
  try {
    const {
      date,
      service,
      dishes,
    } = request.body;

    if (
      typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return response.status(400).json({
        message:
          'La fecha debe tener el formato YYYY-MM-DD.',
      });
    }

    const validServices: ServiceValue[] = [
      'BREAKFAST',
      'LUNCH',
    ];

    if (
      typeof service !== 'string' ||
      !validServices.includes(
        service as ServiceValue,
      )
    ) {
      return response.status(400).json({
        message:
          'El servicio debe ser BREAKFAST o LUNCH.',
      });
    }

    if (
      !Array.isArray(dishes) ||
      dishes.length !== 2
    ) {
      return response.status(400).json({
        message:
          'Debes enviar exactamente dos platillos.',
      });
    }

    const normalizedDishes = (
      dishes as DishRequest[]
    ).map(dish => ({
      name:
        typeof dish.name === 'string'
          ? dish.name.trim()
          : '',

      description:
        typeof dish.description === 'string'
          ? dish.description.trim()
          : '',
    }));

    const hasIncompleteDish =
      normalizedDishes.some(
        dish =>
          !dish.name ||
          !dish.description,
      );

    if (hasIncompleteDish) {
      return response.status(400).json({
        message:
          'Cada platillo debe tener nombre y descripción.',
      });
    }

    const savedMenu = await saveMenuService({
      date,
      service: service as ServiceValue,
      dishes: normalizedDishes,
    });

    return response.status(200).json({
      message: 'Menú guardado correctamente.',
      menu: savedMenu,
    });
  } catch (error) {
    console.error(
      'Error al guardar el menú:',
      error,
    );

    return response.status(500).json({
      message:
        'No fue posible guardar el menú.',
    });
  }
}

export async function publishMenu(
  request: Request,
  response: Response,
) {
  try {
    const {
      startDate,
      endDate,
    } = request.body;

    if (
      typeof startDate !== 'string' ||
      typeof endDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ) {
      return response.status(400).json({
        message:
          'Las fechas deben tener formato YYYY-MM-DD.',
      });
    }

    const result = await publishWeeklyMenu(
      startDate,
      endDate,
    );

    return response.status(200).json({
      message:
        'Menú semanal publicado correctamente.',
      ...result,
    });
  } catch (error) {
    console.error(
      'Error al publicar el menú:',
      error,
    );

    return response.status(500).json({
      message:
        'No fue posible publicar el menú semanal.',
    });
  }
}