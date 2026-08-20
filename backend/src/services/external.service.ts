import bcrypt from 'bcryptjs';

import prisma from '../config/prisma';

type ExternalPersonnelTypeValue =
  | 'VISIT'
  | 'SCHEDULED'
  | 'OTHER_MILL';

interface CreateExternalPersonnelInput {
  name: string;
  type: ExternalPersonnelTypeValue;
  workLocation: string;
  startDate: string;
  endDate: string;
}

interface RenewExternalPersonnelInput {
  endDate: string;
}

function generateAccessCode() {
  const random = Math.floor(
    100000 + Math.random() * 900000,
  );

  return `EXT-${random}`;
}

function parseDate(
  value: string,
) {
  const date = new Date(
    `${value}T00:00:00.000Z`,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    throw new Error(
      'La fecha proporcionada no es válida.',
    );
  }

  return date;
}

/*
 * Crear personal externo.
 */
export async function createExternalPersonnelRecord({
  name,
  type,
  workLocation,
  startDate,
  endDate,
}: CreateExternalPersonnelInput) {
  const parsedStartDate =
    parseDate(startDate);

  const parsedEndDate =
    parseDate(endDate);

  if (
    parsedEndDate <
    parsedStartDate
  ) {
    throw new Error(
      'La fecha de finalización no puede ser anterior a la fecha de inicio.',
    );
  }

  /*
   * Generamos un código temporal.
   */
  const accessCode =
    generateAccessCode();

  /*
   * Aunque Personal Externo no
   * iniciará sesión normalmente,
   * User requiere passwordHash.
   *
   * Guardamos un hash del código
   * para no almacenar una contraseña
   * sin protección.
   */
  const passwordHash =
    await bcrypt.hash(
      accessCode,
      10,
    );

  const user =
    await prisma.user.create({
      data: {
        employeeNumber: null,

        name:
          name.trim(),

        passwordHash,

        role: 'EXTERNAL',

        department:
          'Personal Externo',

        active: true,

        reportGroup:
          'EXTERNAL_PERSONNEL',

        workLocation:
          workLocation.trim(),

        externalType:
          type,

        externalProfile: {
          create: {
            accessCode,

            type,

            startDate:
              parsedStartDate,

            endDate:
              parsedEndDate,

            active: true,
          },
        },
      },

      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        active: true,

        reportGroup: true,
        workLocation: true,
        externalType: true,

        externalProfile: {
          select: {
            id: true,
            accessCode: true,
            type: true,
            startDate: true,
            endDate: true,
            active: true,
          },
        },
      },
    });

  return {
    user,
    accessCode,
  };
}

/*
 * Consultar todo el personal
 * externo registrado.
 */
export async function getAllExternalPersonnel() {
  return prisma
    .externalPersonnelProfile
    .findMany({
      orderBy: [
        {
          active: 'desc',
        },
        {
          endDate: 'asc',
        },
      ],

      include: {
        user: {
          select: {
            id: true,
            name: true,
            department: true,
            active: true,

            reportGroup: true,
            workLocation: true,
            externalType: true,
          },
        },
      },
    });
}

/*
 * Renovar vigencia.
 */
export async function renewExternalPersonnelRecord(
  externalId: string,
  {
    endDate,
  }: RenewExternalPersonnelInput,
) {
  const external =
    await prisma
      .externalPersonnelProfile
      .findUnique({
        where: {
          id: externalId,
        },

        include: {
          user: true,
        },
      });

  if (!external) {
    throw new Error(
      'El registro de personal externo no existe.',
    );
  }

  const newEndDate =
    parseDate(endDate);

  if (
    newEndDate <
    external.startDate
  ) {
    throw new Error(
      'La nueva fecha de vencimiento no puede ser anterior a la fecha de inicio.',
    );
  }

  return prisma
    .externalPersonnelProfile
    .update({
      where: {
        id: externalId,
      },

      data: {
        endDate:
          newEndDate,

        active: true,

        user: {
          update: {
            active: true,
          },
        },
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            department: true,
            active: true,

            reportGroup: true,
            workLocation: true,
            externalType: true,
          },
        },
      },
    });
}