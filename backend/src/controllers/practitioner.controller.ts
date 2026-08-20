import type {
  Request,
  Response,
} from 'express';

import {
  createPractitionerRecord,
  getAllPractitioners,
  renewPractitionerRecord,
} from '../services/practitioner.service';

export async function createPractitioner(
  request: Request,
  response: Response,
) {
  try {
    const {
      name,
      department,
      startDate,
      endDate,
    } = request.body;

    if (
      typeof name !==
        'string' ||
      !name.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'El nombre del practicante es obligatorio.',
        });
    }

    if (
      typeof startDate !==
        'string' ||
      typeof endDate !==
        'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        startDate,
      ) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        endDate,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'Las fechas deben tener formato YYYY-MM-DD.',
        });
    }

    const result =
      await createPractitionerRecord({
        name:
          name.trim(),

        department:
          typeof department ===
            'string' &&
          department.trim()
            ? department.trim()
            : null,

        startDate,
        endDate,
      });

    return response
      .status(201)
      .json({
        message:
          'Practicante creado correctamente.',

        practitioner:
          result.user,

        accessCode:
          result.accessCode,
      });
  } catch (error) {
    console.error(
      'Error al crear practicante:',
      error,
    );

    return response
      .status(400)
      .json({
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible crear el practicante.',
      });
  }
}

export async function getPractitioners(
  _request: Request,
  response: Response,
) {
  try {
    const practitioners =
      await getAllPractitioners();

    return response
      .status(200)
      .json({
        practitioners,
      });
  } catch (error) {
    console.error(
      'Error al consultar practicantes:',
      error,
    );

    return response
      .status(500)
      .json({
        message:
          'No fue posible consultar los practicantes.',
      });
  }
}

export async function renewPractitioner(
  request: Request,
  response: Response,
) {
  try {
    const practitionerId =
      request.params.id;

    const {
      endDate,
    } = request.body;

    if (
      typeof practitionerId !==
        'string' ||
      !practitionerId.trim()
    ) {
      return response
        .status(400)
        .json({
          message:
            'El practicante es obligatorio.',
        });
    }

    if (
      typeof endDate !==
        'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        endDate,
      )
    ) {
      return response
        .status(400)
        .json({
          message:
            'La nueva fecha debe tener formato YYYY-MM-DD.',
        });
    }

    const practitioner =
      await renewPractitionerRecord(
        practitionerId.trim(),
        endDate,
      );

    return response
      .status(200)
      .json({
        message:
          'Vigencia actualizada correctamente.',

        practitioner,
      });
  } catch (error) {
    return response
      .status(400)
      .json({
        message:
          error instanceof Error
            ? error.message
            : 'No fue posible renovar la vigencia.',
      });
  }
}