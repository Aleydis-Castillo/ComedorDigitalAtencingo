import { API_URL } from './api';

export interface PractitionerItem {
  id: string;
  accessCode: string;
  startDate: string;
  endDate: string;
  active: boolean;

  user: {
    id: string;
    name: string;
    department: string | null;
    active: boolean;
  };
}

interface PractitionerListResponse {
  practitioners: PractitionerItem[];
}

export async function getPractitioners() {
  const response = await fetch(
    `${API_URL}/practitioners`,
  );

  const data =
    (await response.json()) as
      | PractitionerListResponse
      | {
          message?: string;
        };

  if (!response.ok) {
    const message =
      'message' in data && data.message
        ? data.message
        : 'No fue posible consultar los practicantes.';

    throw new Error(message);
  }

  return (
    data as PractitionerListResponse
  ).practitioners;
}

export async function createPractitioner(data: {
  name: string;
  department: string;
  startDate: string;
  endDate: string;
}) {
  const response = await fetch(
    `${API_URL}/practitioners`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        'No fue posible crear el practicante.',
    );
  }

  return result;
}

export async function renewPractitioner(
  practitionerId: string,
  endDate: string,
) {
  const response = await fetch(
    `${API_URL}/practitioners/${practitionerId}/renew`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endDate,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        'No fue posible renovar la vigencia.',
    );
  }

  return result;
}