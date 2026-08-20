import type {
  Request,
  Response,
} from 'express';

import {
  createEventRecord,
  deleteEventRecord,
  getEvents,
  updateEventRecord,
} from '../services/event.service';

type ServiceValue =
  | 'BREAKFAST'
  | 'LUNCH';

type EventStatusValue =
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'FINISHED'
  | 'CANCELLED';

const validServices: ServiceValue[] = [
  'BREAKFAST',
  'LUNCH',
];

const validStatuses: EventStatusValue[] = [
  'SCHEDULED',
  'ACTIVE',
  'FINISHED',
  'CANCELLED',
];

function getParamId(
  value:
    | string
    | string[]
    | undefined,
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export async function listEvents(
  request: Request,
  response: Response,
) {
  try {
    const events =
      await getEvents();

    return response
      .status(200)
      .json({
        events,
      });
  } catch (error) {
    console.error(
      'Error al consultar eventos:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible consultar los eventos.',
      });
  }
}

export async function createEvent(
  request: Request,
  response: Response,
) {
  try {
    const {
      title,
      eventDate,
      eventTime,
      service,
      people,
      location,
      observations,
      createdById,
    } = request.body;

    if (
      typeof title !== 'string' ||
      !title.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'El título del evento es obligatorio.',
        });
    }

    if (
      typeof eventDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        eventDate,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'La fecha debe tener formato YYYY-MM-DD.',
        });
    }

    if (
      typeof eventTime !== 'string' ||
      !/^\d{2}:\d{2}$/.test(
        eventTime,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'La hora debe tener formato HH:mm.',
        });
    }

    if (
      typeof service !== 'string' ||
      !validServices.includes(
        service as ServiceValue,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'El servicio debe ser BREAKFAST o LUNCH.',
        });
    }

    if (
      typeof people !== 'number' ||
      !Number.isInteger(people) ||
      people <= 0
    ) {
      return response
        .status(400)
        .json({
          message:
            'La cantidad de personas debe ser un número entero mayor a 0.',
        });
    }

    if (
      typeof location !== 'string' ||
      !location.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'La ubicación es obligatoria.',
        });
    }

    if (
      typeof createdById !== 'string' ||
      !createdById.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'El usuario que registra el evento es obligatorio.',
        });
    }

    const event =
      await createEventRecord({
        title: title.trim(),

        eventDate,

        eventTime,

        service:
          service as ServiceValue,

        people,

        location:
          location.trim(),

        observations:
          typeof observations ===
            'string'
            ? observations.trim()
            : null,

        createdById:
          createdById.trim(),
      });

    return response
      .status(201)
      .json({
        message:
          'Evento registrado correctamente.',

        event,
      });
  } catch (error) {
    console.error(
      'Error al registrar evento:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible registrar el evento.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}

export async function updateEvent(
  request: Request,
  response: Response,
) {
  try {
    const id =
      getParamId(
        request.params.id,
      );

    if (!id) {
      return response
        .status(400)
        .json({
          message:
            'El id del evento es obligatorio.',
        });
    }

    const {
      title,
      eventDate,
      eventTime,
      service,
      people,
      location,
      observations,
      status,
    } = request.body;

    if (
      eventDate !== undefined &&
      (
        typeof eventDate !==
          'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(
          eventDate,
        )
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'La fecha debe tener formato YYYY-MM-DD.',
        });
    }

    if (
      eventTime !== undefined &&
      (
        typeof eventTime !==
          'string' ||
        !/^\d{2}:\d{2}$/.test(
          eventTime,
        )
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'La hora debe tener formato HH:mm.',
        });
    }

    if (
      service !== undefined &&
      (
        typeof service !==
          'string' ||
        !validServices.includes(
          service as ServiceValue,
        )
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Servicio no válido.',
        });
    }

    if (
      people !== undefined &&
      (
        typeof people !==
          'number' ||
        !Number.isInteger(
          people,
        ) ||
        people <= 0
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'La cantidad de personas debe ser mayor a 0.',
        });
    }

    if (
      status !== undefined &&
      (
        typeof status !==
          'string' ||
        !validStatuses.includes(
          status as EventStatusValue,
        )
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Estado de evento no válido.',
        });
    }

    const event =
      await updateEventRecord(
        id,
        {
          title:
            typeof title ===
              'string'
              ? title
              : undefined,

          eventDate:
            typeof eventDate ===
              'string'
              ? eventDate
              : undefined,

          eventTime:
            typeof eventTime ===
              'string'
              ? eventTime
              : undefined,

          service:
            typeof service ===
              'string'
              ? (
                  service as ServiceValue
                )
              : undefined,

          people:
            typeof people ===
              'number'
              ? people
              : undefined,

          location:
            typeof location ===
              'string'
              ? location
              : undefined,

          observations:
            typeof observations ===
              'string'
              ? observations
              : observations ===
                  null
                ? null
                : undefined,

          status:
            typeof status ===
              'string'
              ? (
                  status as EventStatusValue
                )
              : undefined,
        },
      );

    return response
      .status(200)
      .json({
        message:
          'Evento actualizado correctamente.',

        event,
      });
  } catch (error) {
    console.error(
      'Error al actualizar evento:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible actualizar el evento.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}

export async function deleteEvent(
  request: Request,
  response: Response,
) {
  try {
    const id =
      getParamId(
        request.params.id,
      );

    if (!id) {
      return response
        .status(400)
        .json({
          message:
            'El id del evento es obligatorio.',
        });
    }

    const result =
      await deleteEventRecord(
        id,
      );

    return response
      .status(200)
      .json(result);
  } catch (error) {
    console.error(
      'Error al eliminar evento:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible eliminar el evento.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}