import type {
  Request,
  Response,
} from 'express';

import {
  getUserByEmployeeNumber,
  getUserById,
  identifyTabletUser,
  updateUserClassification,
} from '../services/user.service';

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

const validReportGroups:
  ReportGroupValue[] = [
    'EXTERNAL_PERSONNEL',
    'FACTORY_SUGAR_WAREHOUSE',
    'ADMINISTRATION_FIELD',
    'CORPORATE_PERSONNEL',
    'PRACTITIONERS',
    'FACTORY_LABORATORY',
    'HR_SAFETY_TRAINING',
  ];

const validExternalTypes:
  ExternalPersonnelTypeValue[] = [
    'VISIT',
    'SCHEDULED',
    'OTHER_MILL',
  ];

function getParamValue(
  value:
    | string
    | string[]
    | undefined,
) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export async function findUserByEmployeeNumber(
  request: Request,
  response: Response,
) {
  try {
    const employeeNumber =
      getParamValue(
        request.params.employeeNumber,
      ).trim();

    if (!employeeNumber) {
      return response
        .status(400)
        .json({
          message:
            'Debes proporcionar el número de trabajador.',
        });
    }

    const user =
      await getUserByEmployeeNumber(
        employeeNumber,
      );

    if (!user) {
      return response
        .status(404)
        .json({
          message:
            'No se encontró un trabajador con ese número.',
        });
    }

    if (!user.active) {
      return response
        .status(403)
        .json({
          message:
            'Este trabajador no se encuentra activo.',
        });
    }

    if (
      user.role !==
      'EMPLOYEE'
    ) {
      return response
        .status(403)
        .json({
          message:
            'Este número no corresponde a un empleado.',
        });
    }

    return response
      .status(200)
      .json({
        id: user.id,
        employeeNumber:
          user.employeeNumber,
        name: user.name,
        department:
          user.department,
        role: user.role,
        reportGroup:
          user.reportGroup,
        workLocation:
          user.workLocation,
        externalType:
          user.externalType,
      });
  } catch (error) {
    console.error(
      'Error al buscar trabajador:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible consultar la información del trabajador.',
      });
  }
}

export async function findUserById(
  request: Request,
  response: Response,
) {
  try {
    const userId =
      getParamValue(
        request.params.id,
      ).trim();

    if (!userId) {
      return response
        .status(400)
        .json({
          message:
            'El usuario es obligatorio.',
        });
    }

    const user =
      await getUserById(
        userId,
      );

    if (!user) {
      return response
        .status(404)
        .json({
          message:
            'El usuario no existe.',
        });
    }

    if (!user.active) {
      return response
        .status(403)
        .json({
          message:
            'El usuario se encuentra inactivo.',
        });
    }

    return response
      .status(200)
      .json(user);
  } catch (error) {
    console.error(
      'Error al consultar usuario:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible consultar el usuario.',
      });
  }
}

export async function saveUserClassification(
  request: Request,
  response: Response,
) {
  try {
    const userId =
      getParamValue(
        request.params.id,
      ).trim();

    if (!userId) {
      return response
        .status(400)
        .json({
          message:
            'El usuario es obligatorio.',
        });
    }

    const {
      reportGroup,
      workLocation,
      externalType,
    } = request.body;

    if (
      typeof reportGroup !==
        'string' ||
      !validReportGroups.includes(
        reportGroup as
          ReportGroupValue,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'El grupo seleccionado no es válido.',
        });
    }

    if (
      typeof workLocation !==
        'string' ||
      !workLocation.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'Debes especificar tu ubicación habitual.',
        });
    }

    if (
      reportGroup ===
        'EXTERNAL_PERSONNEL'
    ) {
      if (
        typeof externalType !==
          'string' ||
        !validExternalTypes.includes(
          externalType as
            ExternalPersonnelTypeValue,
        )
      ) {
        return response
          .status(400)
          .json({
            message:
              'Selecciona el tipo de personal externo.',
          });
      }
    }

    const user =
      await updateUserClassification(
        userId,
        {
          reportGroup:
            reportGroup as
              ReportGroupValue,

          workLocation:
            workLocation.trim(),

          externalType:
            reportGroup ===
              'EXTERNAL_PERSONNEL'
              ? (
                  externalType as
                    ExternalPersonnelTypeValue
                )
              : null,
        },
      );

    return response
      .status(200)
      .json({
        message:
          'Información de área guardada correctamente.',
        user,
      });
  } catch (error) {
    console.error(
      'Error al guardar clasificación:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible guardar la información del usuario.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}

export async function identifyUserForTablet(
  request: Request,
  response: Response,
) {
  try {
    const identifier =
      getParamValue(
        request.params.identifier,
      ).trim();

    if (!identifier) {
      return response
        .status(400)
        .json({
          message:
            'Debes proporcionar un número de trabajador o código de practicante.',
        });
    }

    const result =
      await identifyTabletUser(
        identifier,
      );

    return response
      .status(200)
      .json(result);
  } catch (error) {
    console.error(
      'Error al identificar usuario para tablet:',
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible identificar al usuario.';

    return response
      .status(400)
      .json({
        message,
      });
  }
}