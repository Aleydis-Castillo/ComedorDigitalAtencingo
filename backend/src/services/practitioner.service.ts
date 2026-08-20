import bcrypt from 'bcryptjs';

import prisma from '../config/prisma';

interface CreatePractitionerInput {
  name: string;
  department: string | null;
  startDate: string;
  endDate: string;
}

function generateAccessCode() {
  const random = Math.floor(
    100000 +
      Math.random() * 900000,
  );

  return `PRAC-${random}`;
}

export async function createPractitionerRecord({
  name,
  department,
  startDate,
  endDate,
}: CreatePractitionerInput) {
  const accessCode =
    generateAccessCode();

  const passwordHash =
    await bcrypt.hash(
      accessCode,
      10,
    );

  const user =
    await prisma.user.create({
      data: {
        employeeNumber:
          null,

        name,

        passwordHash,

        role:
          'PRACTITIONER',

        department,

        active:
          true,

        /*
         * Clasificación automática
         * para reportes.
         */
        reportGroup:
          'PRACTITIONERS',

        workLocation:
          department?.trim() ||
          null,

        externalType:
          null,

        practitionerProfile: {
          create: {
            accessCode,

            startDate:
              new Date(
                `${startDate}T00:00:00.000Z`,
              ),

            endDate:
              new Date(
                `${endDate}T00:00:00.000Z`,
              ),

            active:
              true,
          },
        },
      },

      include: {
        practitionerProfile:
          true,
      },
    });

  return {
    user,
    accessCode,
  };
}

export async function getAllPractitioners() {
  return prisma
    .practitionerProfile
    .findMany({
      orderBy: {
        endDate:
          'asc',
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            department:
              true,
            active: true,

            reportGroup:
              true,

            workLocation:
              true,
          },
        },
      },
    });
}

export async function renewPractitionerRecord(
  practitionerId: string,
  endDate: string,
) {
  const practitioner =
    await prisma
      .practitionerProfile
      .findUnique({
        where: {
          id:
            practitionerId,
        },

        include: {
          user: true,
        },
      });

  if (!practitioner) {
    throw new Error(
      'El practicante no existe.',
    );
  }

  return prisma
    .practitionerProfile
    .update({
      where: {
        id:
          practitionerId,
      },

      data: {
        endDate:
          new Date(
            `${endDate}T00:00:00.000Z`,
          ),

        active:
          true,

        user: {
          update: {
            active:
              true,

            /*
             * Nos aseguramos de que
             * conserve su clasificación.
             */
            reportGroup:
              'PRACTITIONERS',

            externalType:
              null,
          },
        },
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            department:
              true,
            active: true,

            reportGroup:
              true,

            workLocation:
              true,
          },
        },
      },
    });
}