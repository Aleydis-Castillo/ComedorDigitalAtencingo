import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../config/prisma';

interface LoginInput {
  employeeNumber: string;
  password: string;
}

interface CreatePasswordInput {
  identifier: string;
  password: string;
}

function normalizeIdentifier(
  identifier: string,
) {
  return identifier
    .trim()
    .toUpperCase();
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

async function findUserByIdentifier(
  identifier: string,
) {
  const normalizedIdentifier =
    normalizeIdentifier(
      identifier,
    );

  const employee =
    await prisma.user.findUnique({
      where: {
        employeeNumber:
          normalizedIdentifier,
      },

      select: {
        id: true,
        employeeNumber: true,
        name: true,
        passwordHash: true,
        role: true,
        department: true,
        active: true,
        reportGroup: true,
        workLocation: true,
        externalType: true,
      },
    });

  if (employee) {
    return {
      user: employee,

      userType:
        employee.role,

      practitionerProfile:
        null,

      externalProfile:
        null,
    };
  }

  const practitionerProfile =
    await prisma
      .practitionerProfile
      .findUnique({
        where: {
          accessCode:
            normalizedIdentifier,
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
              passwordHash: true,
              role: true,
              department: true,
              active: true,
              reportGroup: true,
              workLocation: true,
              externalType: true,
            },
          },
        },
      });

  if (practitionerProfile) {
    return {
      user:
        practitionerProfile.user,

      userType:
        'PRACTITIONER' as const,

      practitionerProfile,

      externalProfile:
        null,
    };
  }

  const externalProfile =
    await prisma
      .externalPersonnelProfile
      .findUnique({
        where: {
          accessCode:
            normalizedIdentifier,
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
              passwordHash: true,
              role: true,
              department: true,
              active: true,
              reportGroup: true,
              workLocation: true,
              externalType: true,
            },
          },
        },
      });

  if (externalProfile) {
    return {
      user:
        externalProfile.user,

      userType:
        'EXTERNAL' as const,

      practitionerProfile:
        null,

      externalProfile,
    };
  }

  return null;
}

function validatePractitionerAccess(
  profile: {
    active: boolean;
    startDate: Date;
    endDate: Date;
  },
) {
  if (!profile.active) {
    throw new Error(
      'El código del practicante está inactivo.',
    );
  }

  const today =
    getTodayUtc();

  if (
    today <
    profile.startDate
  ) {
    throw new Error(
      'El acceso del practicante todavía no está vigente.',
    );
  }

  if (
    today >
    profile.endDate
  ) {
    throw new Error(
      'El código del practicante ha vencido.',
    );
  }
}

function validateExternalAccess(
  profile: {
    active: boolean;
    startDate: Date;
    endDate: Date;
  },
) {
  if (!profile.active) {
    throw new Error(
      'El código de personal externo está inactivo.',
    );
  }

  const today =
    getTodayUtc();

  if (
    today <
    profile.startDate
  ) {
    throw new Error(
      'El acceso de personal externo todavía no está vigente.',
    );
  }

  if (
    today >
    profile.endDate
  ) {
    throw new Error(
      'El código de personal externo ha vencido.',
    );
  }
}

export async function loginUser({
  employeeNumber,
  password,
}: LoginInput) {
  const result =
    await findUserByIdentifier(
      employeeNumber,
    );

  if (
    !result ||
    !result.user.active
  ) {
    throw new Error(
      'Credenciales incorrectas.',
    );
  }

  if (
    result.user.role ===
      'PRACTITIONER' &&
    result.practitionerProfile
  ) {
    validatePractitionerAccess(
      result.practitionerProfile,
    );
  }

  if (
    result.user.role ===
      'EXTERNAL' &&
    result.externalProfile
  ) {
    validateExternalAccess(
      result.externalProfile,
    );
  }

  const passwordIsValid =
    await bcrypt.compare(
      password,
      result.user.passwordHash,
    );

  if (!passwordIsValid) {
    throw new Error(
      'Credenciales incorrectas.',
    );
  }

  const jwtSecret =
    process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(
      'JWT_SECRET no está configurado.',
    );
  }

  const token =
    jwt.sign(
      {
        userId:
          result.user.id,

        role:
          result.user.role,
      },

      jwtSecret,

      {
        expiresIn:
          '8h',
      },
    );

  return {
    token,

    user: {
      id:
        result.user.id,

      employeeNumber:
        result.user.employeeNumber,

      name:
        result.user.name,

      role:
        result.user.role,

      department:
        result.user.department,

      reportGroup:
        result.user.reportGroup,

      workLocation:
        result.user.workLocation,

      externalType:
        result.user.externalType,
    },
  };
}

export async function checkActivationIdentifier(
  identifier: string,
) {
  const normalizedIdentifier =
    normalizeIdentifier(
      identifier,
    );

  const result =
    await findUserByIdentifier(
      normalizedIdentifier,
    );

  if (
    !result ||
    !result.user.active
  ) {
    throw new Error(
      'No se encontró un usuario activo con ese número o código.',
    );
  }

  if (
    result.user.role !==
      'EMPLOYEE' &&
    result.user.role !==
      'PRACTITIONER' &&
    result.user.role !==
      'EXTERNAL'
  ) {
    throw new Error(
      'Esta cuenta no utiliza el proceso de primer acceso.',
    );
  }

  if (
    result.user.role ===
      'PRACTITIONER' &&
    result.practitionerProfile
  ) {
    validatePractitionerAccess(
      result.practitionerProfile,
    );
  }

  if (
    result.user.role ===
      'EXTERNAL' &&
    result.externalProfile
  ) {
    validateExternalAccess(
      result.externalProfile,
    );
  }

  return {
    message:
      'Usuario encontrado correctamente.',

    identifier:
      normalizedIdentifier,

    userType:
      result.user.role,

    user: {
      id:
        result.user.id,

      name:
        result.user.name,

      department:
        result.user.department,

      role:
        result.user.role,

      reportGroup:
        result.user.reportGroup,

      workLocation:
        result.user.workLocation,

      externalType:
        result.user.externalType,
    },
  };
}

export async function createUserPassword({
  identifier,
  password,
}: CreatePasswordInput) {
  const normalizedIdentifier =
    normalizeIdentifier(
      identifier,
    );

  const result =
    await findUserByIdentifier(
      normalizedIdentifier,
    );

  if (
    !result ||
    !result.user.active
  ) {
    throw new Error(
      'No se encontró un usuario válido.',
    );
  }

  if (
    result.user.role !==
      'EMPLOYEE' &&
    result.user.role !==
      'PRACTITIONER' &&
    result.user.role !==
      'EXTERNAL'
  ) {
    throw new Error(
      'Esta cuenta no puede utilizar el proceso de primer acceso.',
    );
  }

  if (
    result.user.role ===
      'PRACTITIONER' &&
    result.practitionerProfile
  ) {
    validatePractitionerAccess(
      result.practitionerProfile,
    );
  }

  if (
    result.user.role ===
      'EXTERNAL' &&
    result.externalProfile
  ) {
    validateExternalAccess(
      result.externalProfile,
    );
  }

  if (
    password.length < 6
  ) {
    throw new Error(
      'La contraseña debe tener al menos 6 caracteres.',
    );
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      10,
    );

  const user =
    await prisma.user.update({
      where: {
        id:
          result.user.id,
      },

      data: {
        passwordHash,
      },

      select: {
        id: true,
        employeeNumber: true,
        name: true,
        role: true,
        department: true,
        reportGroup: true,
        workLocation: true,
        externalType: true,
      },
    });

  return {
    message:
      'Contraseña creada correctamente.',

    user,
  };
}