import prisma from '../config/prisma';

type ReportGroupValue =
  | 'EXTERNAL_PERSONNEL'
  | 'FACTORY_SUGAR_WAREHOUSE'
  | 'ADMINISTRATION_FIELD'
  | 'CORPORATE_PERSONNEL'
  | 'PRACTITIONERS'
  | 'FACTORY_LABORATORY'
  | 'HR_SAFETY_TRAINING';

type ExternalPersonnelTypeValue =
  | 'VISIT'
  | 'SCHEDULED'
  | 'OTHER_MILL';

interface UpdateUserClassificationInput {
  reportGroup: ReportGroupValue;

  workLocation:
    | string
    | null;

  externalType:
    | ExternalPersonnelTypeValue
    | null;
}

function getTodayUtc() {
  const now = new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );
}

function normalizeIdentifier(
  value: string,
) {
  return value
    .trim()
    .toUpperCase();
}

export async function getUserByEmployeeNumber(
  employeeNumber: string,
) {
  return prisma.user.findUnique({
    where: {
      employeeNumber:
        employeeNumber.trim(),
    },

    select: {
      id: true,
      employeeNumber: true,
      name: true,
      department: true,
      role: true,
      active: true,

      reportGroup: true,
      workLocation: true,
      externalType: true,
    },
  });
}

export async function getUserById(
  userId: string,
) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      employeeNumber: true,
      name: true,
      department: true,
      role: true,
      active: true,

      reportGroup: true,
      workLocation: true,
      externalType: true,
    },
  });
}

export async function updateUserClassification(
  userId: string,
  {
    reportGroup,
    workLocation,
    externalType,
  }: UpdateUserClassificationInput,
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

  if (!user) {
    throw new Error(
      'El usuario no existe.',
    );
  }

  if (!user.active) {
    throw new Error(
      'El usuario se encuentra inactivo.',
    );
  }

  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      reportGroup,

      workLocation:
        workLocation?.trim() ||
        null,

      externalType:
        reportGroup ===
        'EXTERNAL_PERSONNEL'
          ? externalType
          : null,
    },

    select: {
      id: true,
      employeeNumber: true,
      name: true,
      department: true,
      role: true,

      reportGroup: true,
      workLocation: true,
      externalType: true,
    },
  });
}

/*
 * IDENTIFICACIÓN PARA TABLET
 *
 * 1001
 * → Empleado
 *
 * PRAC-123456
 * → Practicante
 *
 * EXT-123456
 * → Personal Externo
 */
export async function identifyTabletUser(
  identifier: string,
) {
  const normalized =
    normalizeIdentifier(
      identifier,
    );

  /*
   * 1. EMPLEADO
   */
  const employee =
    await prisma.user.findUnique({
      where: {
        employeeNumber:
          normalized,
      },

      select: {
        id: true,
        employeeNumber: true,
        name: true,
        department: true,
        role: true,
        active: true,

        reportGroup: true,
        workLocation: true,
        externalType: true,
      },
    });

  if (employee) {
    if (!employee.active) {
      throw new Error(
        'El trabajador se encuentra inactivo.',
      );
    }

    if (
      employee.role !==
      'EMPLOYEE'
    ) {
      throw new Error(
        'Este identificador no corresponde a un empleado.',
      );
    }

    return {
      personType:
        'EMPLOYEE' as const,

      user: employee,
    };
  }

  /*
   * 2. PRACTICANTE
   */
  const practitioner =
    await prisma
      .practitionerProfile
      .findUnique({
        where: {
          accessCode:
            normalized,
        },

        select: {
          id: true,
          accessCode: true,
          startDate: true,
          endDate: true,
          active: true,

          user: {
            select: {
              id: true,
              employeeNumber: true,
              name: true,
              department: true,
              role: true,
              active: true,

              reportGroup: true,
              workLocation: true,
              externalType: true,
            },
          },
        },
      });

  if (practitioner) {
    if (
      !practitioner.active ||
      !practitioner.user.active
    ) {
      throw new Error(
        'El acceso del practicante se encuentra inactivo.',
      );
    }

    const today =
      getTodayUtc();

    if (
      today <
      practitioner.startDate
    ) {
      throw new Error(
        'El acceso del practicante todavía no está vigente.',
      );
    }

    if (
      today >
      practitioner.endDate
    ) {
      throw new Error(
        'El código del practicante ha vencido.',
      );
    }

    if (
      practitioner.user.role !==
      'PRACTITIONER'
    ) {
      throw new Error(
        'El código no corresponde a un practicante.',
      );
    }

    return {
      personType:
        'PRACTITIONER' as const,

      user:
        practitioner.user,

      practitioner: {
        id:
          practitioner.id,

        accessCode:
          practitioner.accessCode,

        startDate:
          practitioner.startDate,

        endDate:
          practitioner.endDate,
      },
    };
  }

  /*
   * 3. PERSONAL EXTERNO
   */
  const external =
    await prisma
      .externalPersonnelProfile
      .findUnique({
        where: {
          accessCode:
            normalized,
        },

        select: {
          id: true,
          accessCode: true,
          type: true,
          startDate: true,
          endDate: true,
          active: true,

          user: {
            select: {
              id: true,
              employeeNumber: true,
              name: true,
              department: true,
              role: true,
              active: true,

              reportGroup: true,
              workLocation: true,
              externalType: true,
            },
          },
        },
      });

  if (!external) {
    throw new Error(
      'No se encontró un empleado, practicante o personal externo con ese identificador.',
    );
  }

  if (
    !external.active ||
    !external.user.active
  ) {
    throw new Error(
      'El acceso del personal externo se encuentra inactivo.',
    );
  }

  const today =
    getTodayUtc();

  if (
    today <
    external.startDate
  ) {
    throw new Error(
      'El acceso del personal externo todavía no está vigente.',
    );
  }

  if (
    today >
    external.endDate
  ) {
    throw new Error(
      'El código del personal externo ha vencido.',
    );
  }

  if (
    external.user.role !==
    'EXTERNAL'
  ) {
    throw new Error(
      'El código no corresponde a personal externo.',
    );
  }

  return {
    personType:
      'EXTERNAL' as const,

    user:
      external.user,

    external: {
      id:
        external.id,

      accessCode:
        external.accessCode,

      type:
        external.type,

      startDate:
        external.startDate,

      endDate:
        external.endDate,
    },
  };
}