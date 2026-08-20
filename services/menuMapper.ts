export type FrontendServiceType =
  | 'breakfast'
  | 'lunch';

export type FrontendDayKey =
  | 'LUN'
  | 'MAR'
  | 'MIE'
  | 'JUE'
  | 'VIE'
  | 'SAB';

export interface FrontendDish {
  id: string;
  name: string;
  description: string;
  available: boolean;
  position: number;
}

export interface FrontendDayMenu {
  breakfast: FrontendDish[];
  lunch: FrontendDish[];
  published: boolean;
  date: string | null;
}

export type FrontendWeeklyMenu = Record<
  FrontendDayKey,
  FrontendDayMenu
>;

interface ApiDish {
  id: string;
  name: string;
  description: string | null;
  service: 'BREAKFAST' | 'LUNCH';
  available: boolean;
  position: number;
}

interface ApiMenuDay {
  id: string;
  date: string;
  published: boolean;
  dishes: ApiDish[];
}

const EMPTY_DAY_MENU: FrontendDayMenu = {
  breakfast: [],
  lunch: [],
  published: false,
  date: null,
};

export function createEmptyWeeklyMenu(): FrontendWeeklyMenu {
  return {
    LUN: {
      ...EMPTY_DAY_MENU,
      breakfast: [],
      lunch: [],
    },
    MAR: {
      ...EMPTY_DAY_MENU,
      breakfast: [],
      lunch: [],
    },
    MIE: {
      ...EMPTY_DAY_MENU,
      breakfast: [],
      lunch: [],
    },
    JUE: {
      ...EMPTY_DAY_MENU,
      breakfast: [],
      lunch: [],
    },
    VIE: {
      ...EMPTY_DAY_MENU,
      breakfast: [],
      lunch: [],
    },
    SAB: {
      ...EMPTY_DAY_MENU,
      breakfast: [],
      lunch: [],
    },
  };
}

function getDayKeyFromDate(
  dateValue: string,
): FrontendDayKey | null {
  const date = new Date(dateValue);

  const dayNumber = date.getUTCDay();

  switch (dayNumber) {
    case 1:
      return 'LUN';

    case 2:
      return 'MAR';

    case 3:
      return 'MIE';

    case 4:
      return 'JUE';

    case 5:
      return 'VIE';

    case 6:
      return 'SAB';

    default:
      return null;
  }
}

function mapDish(
  dish: ApiDish,
): FrontendDish {
  return {
    id: dish.id,
    name: dish.name,
    description: dish.description ?? '',
    available: dish.available,
    position: dish.position,
  };
}

export function mapApiMenuToWeeklyMenu(
  apiMenu: ApiMenuDay[],
  onlyPublished = false,
): FrontendWeeklyMenu {
  const weeklyMenu = createEmptyWeeklyMenu();

  apiMenu.forEach(menuDay => {
    if (onlyPublished && !menuDay.published) {
      return;
    }

    const dayKey = getDayKeyFromDate(
      menuDay.date,
    );

    if (!dayKey) {
      return;
    }

    const breakfast = menuDay.dishes
      .filter(
        dish =>
          dish.service === 'BREAKFAST' &&
          dish.available,
      )
      .sort(
        (firstDish, secondDish) =>
          firstDish.position -
          secondDish.position,
      )
      .map(mapDish);

    const lunch = menuDay.dishes
      .filter(
        dish =>
          dish.service === 'LUNCH' &&
          dish.available,
      )
      .sort(
        (firstDish, secondDish) =>
          firstDish.position -
          secondDish.position,
      )
      .map(mapDish);

    weeklyMenu[dayKey] = {
      breakfast,
      lunch,
      published: menuDay.published,
      date: menuDay.date,
    };
  });

  return weeklyMenu;
}