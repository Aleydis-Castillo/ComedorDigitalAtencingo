import prisma from '../config/prisma';

type ServiceValue = 'BREAKFAST' | 'LUNCH';

interface DishInput {
  name: string;
  description?: string;
}

interface SaveMenuInput {
  date: string;
  service: ServiceValue;
  dishes: DishInput[];
}

function parseDatabaseDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export async function getWeeklyMenu(
  startDate?: string,
  endDate?: string,
) {
  const dateFilter =
    startDate && endDate
      ? {
          gte: parseDatabaseDate(startDate),
          lte: parseDatabaseDate(endDate),
        }
      : undefined;

  return prisma.menuDay.findMany({
    where: dateFilter
      ? {
          date: dateFilter,
        }
      : undefined,

    include: {
      dishes: {
        orderBy: [
          {
            service: 'asc',
          },
          {
            position: 'asc',
          },
        ],
      },
    },

    orderBy: {
      date: 'asc',
    },
  });
}

export async function saveMenuService({
  date,
  service,
  dishes,
}: SaveMenuInput) {
  const menuDate = parseDatabaseDate(date);

  return prisma.$transaction(async transaction => {
    const menuDay = await transaction.menuDay.upsert({
      where: {
        date: menuDate,
      },

      update: {},

      create: {
        date: menuDate,
        published: false,
      },
    });

    for (let index = 0; index < dishes.length; index += 1) {
      const dish = dishes[index];
      const position = index + 1;

      if (!dish) {
        continue;
      }

      await transaction.dish.upsert({
        where: {
          menuDayId_service_position: {
            menuDayId: menuDay.id,
            service,
            position,
          },
        },

        update: {
          name: dish.name.trim(),
          description:
            dish.description?.trim() || null,
          available: true,
        },

        create: {
          menuDayId: menuDay.id,
          name: dish.name.trim(),
          description:
            dish.description?.trim() || null,
          service,
          position,
          available: true,
        },
      });
    }

    return transaction.menuDay.findUnique({
      where: {
        id: menuDay.id,
      },

      include: {
        dishes: {
          orderBy: [
            {
              service: 'asc',
            },
            {
              position: 'asc',
            },
          ],
        },
      },
    });
  });
}

export async function publishWeeklyMenu(
  startDate: string,
  endDate: string,
) {
  const result = await prisma.menuDay.updateMany({
    where: {
      date: {
        gte: parseDatabaseDate(startDate),
        lte: parseDatabaseDate(endDate),
      },
    },

    data: {
      published: true,
    },
  });

  return {
    updatedDays: result.count,
  };
}