import type {
  Request,
  Response,
} from 'express';

import {
  createExternalPersonnelRecord,
  getAllExternalPersonnel,
  renewExternalPersonnelRecord,
} from '../services/external.service';

type ExternalPersonnelTypeValue =
  | 'VISIT'
  | 'SCHEDULED'
  | 'OTHER_MILL';

const validExternalTypes:
  ExternalPersonnelTypeValue[] = [
    'VISIT',
    'SCHEDULED',
    'OTHER_MILL',
  ];

export async function createExternalPersonnel(
  request: Request,
  response: Response,
) {
  try {
    const {
      name,
      type,
      workLocation,
      startDate,
      endDate,
    } = request.body;

    if (
      typeof name !== 'string' ||
      !name.trim()
    ) {
      return response.status(400).json({
        message:
          'El nombre es obligatorio.',
      });
    }

    if (
      typeof type !== 'string' ||
      !validExternalTypes.includes(
        type as ExternalPersonnelTypeValue,
      )
    ) {
      return response.status(400).json({
        message:
          'El tipo de personal externo no es válido.',
      });
    }

    if (
      typeof workLocation !== 'string' ||
      !workLocation.trim()
    ) {
      return response.status(400).json({
        message:
          'Debes especificar la ubicación.',
      });
    }

    if (
      typeof startDate !== 'string' ||
      typeof endDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        startDate,
      ) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        endDate,
      )
    ) {
      return response.status(400).json({
        message:
          'Las fechas deben tener formato YYYY-MM-DD.',
      });
    }

    const result =
      await createExternalPersonnelRecord({
        name: name.trim(),

        type:
          type as ExternalPersonnelTypeValue,

        workLocation:
          workLocation.trim(),

        startDate,

        endDate,
      });

    return response.status(201).json({
      message:
        'Personal externo creado correctamente.',

      external:
        result.user,

      accessCode:
        result.accessCode,
    });
  } catch (error) {
    console.error(
      'Error al crear personal externo:',
      error,
    );

    return response.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'No fue posible crear el registro.',
    });
  }
}

export async function getExternalPersonnel(
  _request: Request,
  response: Response,
) {
  try {
    const external =
      await getAllExternalPersonnel();

    return response.status(200).json({
      external,
    });
  } catch (error) {
    console.error(
      'Error al consultar personal externo:',
      error,
    );

    return response.status(500).json({
      message:
        'No fue posible consultar el personal externo.',
    });
  }
}

export async function renewExternalPersonnel(
  request: Request,
  response: Response,
) {
  try {
    const externalId =
      request.params.id;

    const {
      endDate,
    } = request.body;

    if (
      typeof externalId !== 'string' ||
      !externalId.trim()
    ) {
      return response.status(400).json({
        message:
          'El registro es obligatorio.',
      });
    }

    if (
      typeof endDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        endDate,
      )
    ) {
      return response.status(400).json({
        message:
          'La nueva fecha debe tener formato YYYY-MM-DD.',
      });
    }

    const external =
      await renewExternalPersonnelRecord(
        externalId.trim(),
        {
          endDate,
        },
      );

    return response.status(200).json({
      message:
        'Vigencia actualizada correctamente.',

      external,
    });
  } catch (error) {
    console.error(
      'Error al renovar personal externo:',
      error,
    );

    return response.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : 'No fue posible renovar la vigencia.',
    });
  }
}