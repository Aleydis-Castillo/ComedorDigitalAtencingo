import { API_URL } from './api';

export interface DishRequest {
  name: string;
  description: string;
}

function formatDate(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      '0',
    );

  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      '0',
    );

  return `${year}-${month}-${day}`;
}

function getCurrentWeekRange() {
  const today =
    new Date();

  const day =
    today.getDay();

  const differenceToMonday =
    day === 0
      ? -6
      : 1 - day;

  const monday =
    new Date(today);

  monday.setDate(
    today.getDate() +
      differenceToMonday,
  );

  monday.setHours(
    0,
    0,
    0,
    0,
  );

  const saturday =
    new Date(monday);

  saturday.setDate(
    monday.getDate() + 5,
  );

  return {
    startDate:
      formatDate(monday),

    endDate:
      formatDate(saturday),
  };
}

export async function saveMenu(
  date: string,
  service:
    | 'BREAKFAST'
    | 'LUNCH',
  dishes:
    DishRequest[],
) {
  const response =
    await fetch(
      `${API_URL}/menu/day`,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            date,
            service,
            dishes,
          }),
      },
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Error al guardar el menú.',
    );
  }

  return data;
}

export async function getMenu() {
  const {
    startDate,
    endDate,
  } =
    getCurrentWeekRange();

  const response =
    await fetch(
      `${API_URL}/menu?startDate=${startDate}&endDate=${endDate}`,
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Error al consultar el menú.',
    );
  }

  return data;
}

export async function publishMenu(
  startDate: string,
  endDate: string,
) {
  const response =
    await fetch(
      `${API_URL}/menu/publish`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            startDate,
            endDate,
          }),
      },
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Error al publicar.',
    );
  }

  return data;
}