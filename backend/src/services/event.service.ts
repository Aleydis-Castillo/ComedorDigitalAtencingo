import prisma from '../config/prisma';

type ServiceValue =
  | 'BREAKFAST'
  | 'LUNCH';

type EventStatusValue =
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'FINISHED'
  | 'CANCELLED';

interface CreateEventInput {
  title: string;
  eventDate: string;
  eventTime: string;
  service: ServiceValue;
  people: number;
  location: string;
  observations?: string | null;
  createdById: string;
}

interface UpdateEventInput {
  title?: string;
  eventDate?: string;
  eventTime?: string;
  service?: ServiceValue;
  people?: number;
  location?: string;
  observations?: string | null;
  status?: EventStatusValue;
}

function parseDate(
  value: string,
) {
  return new Date(
    `${value}T00:00:00.000Z`,
  );
}

function parseTime(
  value: string,
) {
  return new Date(
    `1970-01-01T${value}:00.000Z`,
  );
}

export async function getEvents() {
  return prisma.event.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          employeeNumber: true,
          role: true,
        },
      },
    },

    orderBy: [
      {
        eventDate: 'asc',
      },
      {
        eventTime: 'asc',
      },
    ],
  });
}

export async function createEventRecord({
  title,
  eventDate,
  eventTime,
  service,
  people,
  location,
  observations,
  createdById,
}: CreateEventInput) {
  const creator =
    await prisma.user.findUnique({
      where: {
        id: createdById,
      },
    });

  if (!creator) {
    throw new Error(
      'El usuario que registra el evento no existe.',
    );
  }

  if (!creator.active) {
    throw new Error(
      'El usuario que registra el evento está inactivo.',
    );
  }

  if (
    creator.role !== 'COMEDOR' &&
    creator.role !== 'MANAGER'
  ) {
    throw new Error(
      'El usuario no tiene permisos para registrar eventos.',
    );
  }

  return prisma.event.create({
    data: {
      title: title.trim(),

      eventDate:
        parseDate(eventDate),

      eventTime:
        parseTime(eventTime),

      service,

      people,

      location:
        location.trim(),

      observations:
        observations?.trim() ||
        null,

      status:
        'SCHEDULED',

      createdById,
    },

    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          employeeNumber: true,
          role: true,
        },
      },
    },
  });
}

export async function updateEventRecord(
  eventId: string,
  input: UpdateEventInput,
) {
  const existingEvent =
    await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

  if (!existingEvent) {
    throw new Error(
      'El evento no existe.',
    );
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },

    data: {
      ...(input.title !== undefined
        ? {
            title:
              input.title.trim(),
          }
        : {}),

      ...(input.eventDate !== undefined
        ? {
            eventDate:
              parseDate(
                input.eventDate,
              ),
          }
        : {}),

      ...(input.eventTime !== undefined
        ? {
            eventTime:
              parseTime(
                input.eventTime,
              ),
          }
        : {}),

      ...(input.service !== undefined
        ? {
            service:
              input.service,
          }
        : {}),

      ...(input.people !== undefined
        ? {
            people:
              input.people,
          }
        : {}),

      ...(input.location !== undefined
        ? {
            location:
              input.location.trim(),
          }
        : {}),

      ...(input.observations !== undefined
        ? {
            observations:
              input.observations?.trim() ||
              null,
          }
        : {}),

      ...(input.status !== undefined
        ? {
            status:
              input.status,
          }
        : {}),
    },

    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          employeeNumber: true,
          role: true,
        },
      },
    },
  });
}

export async function deleteEventRecord(
  eventId: string,
) {
  const existingEvent =
    await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

  if (!existingEvent) {
    throw new Error(
      'El evento no existe.',
    );
  }

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return {
    message:
      'Evento eliminado correctamente.',
  };
}