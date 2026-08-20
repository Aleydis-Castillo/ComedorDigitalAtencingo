import prisma from '../config/prisma';

interface CreateOrderInput {
  userId: string;
  dishId: string;
  service: 'BREAKFAST' | 'LUNCH';
  deliveryType: 'CAFETERIA' | 'OFFICE';
  zone: string | null;
  location: string | null;
  observations: string | null;
  orderedFor: string;
  signatureData?: string | null;
}

type OrderStatusValue =
  | 'PENDING'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

function createFolio() {
  const now = new Date();

  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');

  const randomPart = Math.floor(
    1000 + Math.random() * 9000,
  );

  return `PED-${datePart}-${randomPart}`;
}

export async function createOrderRecord({
  userId,
  dishId,
  service,
  deliveryType,
  zone,
  location,
  observations,
  orderedFor,
  signatureData,
}: CreateOrderInput) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!user || !user.active) {
    throw new Error(
      'El usuario no existe o está inactivo.',
    );
  }

  const dish =
    await prisma.dish.findUnique({
      where: {
        id: dishId,
      },

      include: {
        menuDay: true,
      },
    });

  if (!dish || !dish.available) {
    throw new Error(
      'El platillo seleccionado ya no está disponible.',
    );
  }

  if (dish.service !== service) {
    throw new Error(
      'El platillo no corresponde al servicio seleccionado.',
    );
  }

  if (!dish.menuDay.published) {
    throw new Error(
      'El menú de este platillo todavía no está publicado.',
    );
  }

  const orderDate = new Date(
    `${orderedFor}T00:00:00.000Z`,
  );

  if (
    Number.isNaN(
      orderDate.getTime(),
    )
  ) {
    throw new Error(
      'La fecha del pedido no es válida.',
    );
  }

  const dishDate =
    dish.menuDay.date
      .toISOString()
      .slice(0, 10);

  if (
    dishDate !==
    orderedFor
  ) {
    throw new Error(
      'El platillo no corresponde a la fecha del pedido.',
    );
  }

  return prisma.$transaction(
    async transaction => {
      const order =
        await transaction.order.create({
          data: {
            folio:
              createFolio(),

            userId,
            dishId,

            service,
            deliveryType,

            zone:
              deliveryType ===
              'OFFICE'
                ? zone
                : null,

            location:
              deliveryType ===
              'OFFICE'
                ? location
                : null,

            observations,

            orderedFor:
              orderDate,

            status:
              'PENDING',
          },

          include: {
            user: {
              select: {
                id: true,
                employeeNumber:
                  true,
                name: true,
                department:
                  true,
              },
            },

            dish: {
              select: {
                id: true,
                name: true,
                description:
                  true,
                service: true,
              },
            },
          },
        });

      /*
       * Si viene firma desde tablet,
       * la guardamos como DRAWN.
       */
      if (
        signatureData &&
        signatureData.trim()
      ) {
        await transaction
          .orderSignature
          .create({
            data: {
              orderId:
                order.id,

              type:
                'DRAWN',

              signatureData:
                signatureData.trim(),
            },
          });
      }

      return transaction.order.findUnique({
        where: {
          id: order.id,
        },

        include: {
          user: {
            select: {
              id: true,
              employeeNumber:
                true,
              name: true,
              department:
                true,
            },
          },

          dish: {
            select: {
              id: true,
              name: true,
              description:
                true,
              service: true,
            },
          },

          signature: {
            select: {
              type: true,
              signedAt:
                true,
            },
          },
        },
      });
    },
  );
}

export async function getOrdersByUser(
  userId: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        active: true,
      },
    });

  if (!user || !user.active) {
    throw new Error(
      'El usuario no existe o está inactivo.',
    );
  }

  return prisma.order.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: 'desc',
    },

    include: {
      dish: {
        select: {
          id: true,
          name: true,
          description:
            true,
          service: true,
        },
      },

      signature: {
        select: {
          type: true,
          signedAt: true,
        },
      },
    },
  });
}

export async function getAllOrders() {
  return prisma.order.findMany({
    orderBy: [
      {
        orderedFor:
          'asc',
      },
      {
        createdAt:
          'asc',
      },
    ],

    include: {
      user: {
        select: {
          id: true,
          employeeNumber:
            true,
          name: true,
          department:
            true,
        },
      },

      dish: {
        select: {
          id: true,
          name: true,
          description:
            true,
          service: true,
        },
      },

      signature: {
        select: {
          type: true,
          signedAt: true,
        },
      },
    },
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatusValue,
) {
  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

  if (!order) {
    throw new Error(
      'El pedido no existe.',
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      status,

      deliveredAt:
        status ===
        'DELIVERED'
          ? new Date()
          : null,
    },

    include: {
      user: {
        select: {
          id: true,
          employeeNumber:
            true,
          name: true,
          department:
            true,
        },
      },

      dish: {
        select: {
          id: true,
          name: true,
          description:
            true,
          service: true,
        },
      },

      signature: {
        select: {
          type: true,
          signedAt: true,
        },
      },
    },
  });
}