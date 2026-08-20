import type {
  Request,
  Response,
} from 'express';

import {
  checkActivationIdentifier,
  createUserPassword,
  loginUser,
} from '../services/auth.service';

/*
 * LOGIN
 */
export async function login(
  request: Request,
  response: Response,
) {
  try {
    const {
      employeeNumber,
      password,
    } = request.body;

    if (
      typeof employeeNumber !== 'string' ||
      typeof password !== 'string' ||
      !employeeNumber.trim() ||
      !password
    ) {
      return response.status(400).json({
        message:
          'El número de trabajador y la contraseña son obligatorios.',
      });
    }

    const result = await loginUser({
      employeeNumber:
        employeeNumber.trim(),
      password,
    });

    return response
      .status(200)
      .json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible iniciar sesión.';

    return response.status(401).json({
      message,
    });
  }
}

/*
 * PRIMER ACCESO
 */
export async function checkActivation(
  request: Request,
  response: Response,
) {
  try {
    const { identifier } =
      request.body;

    if (
      typeof identifier !==
        'string' ||
      !identifier.trim()
    ) {
      return response.status(400).json({
        message:
          'Debes proporcionar un número de trabajador o un código de practicante.',
      });
    }

    const result =
      await checkActivationIdentifier(
        identifier,
      );

    return response
      .status(200)
      .json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible validar el usuario.';

    return response.status(400).json({
      message,
    });
  }
}

/*
 * CREAR CONTRASEÑA
 */
export async function createPassword(
  request: Request,
  response: Response,
) {
  try {
    const {
      identifier,
      password,
    } = request.body;

    if (
      typeof identifier !==
        'string' ||
      !identifier.trim()
    ) {
      return response.status(400).json({
        message:
          'El identificador es obligatorio.',
      });
    }

    if (
      typeof password !==
        'string' ||
      password.length < 6
    ) {
      return response.status(400).json({
        message:
          'La contraseña debe tener al menos 6 caracteres.',
      });
    }

    const result =
      await createUserPassword({
        identifier,
        password,
      });

    return response
      .status(200)
      .json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No fue posible crear la contraseña.';

    return response.status(400).json({
      message,
    });
  }
}