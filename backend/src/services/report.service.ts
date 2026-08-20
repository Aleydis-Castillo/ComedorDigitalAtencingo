import prisma from '../config/prisma';

type ReportService =
  | 'BREAKFAST'
  | 'LUNCH';

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

type UserRoleValue =
  | 'EMPLOYEE'
  | 'PRACTITIONER'
  | 'MANAGER'
  | 'COMEDOR'
  | 'EXTERNAL';

interface WeeklyReportRow {
  reportGroup:
    ReportGroupValue | null;

  groupName: string;

  externalType:
    | ExternalPersonnelTypeValue
    | null;

  department: string;

  workLocation: string;

  employeeNumber: string;

  name: string;

  service: ReportService;

  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

interface ReportGroupSection {
  key: ReportGroupValue;

  name: string;

  rows: WeeklyReportRow[];
}

const REPORT_GROUP_ORDER:
  ReportGroupValue[] = [
    'EXTERNAL_PERSONNEL',
    'FACTORY_SUGAR_WAREHOUSE',
    'ADMINISTRATION_FIELD',
    'CORPORATE_PERSONNEL',
    'PRACTITIONERS',
    'FACTORY_LABORATORY',
    'HR_SAFETY_TRAINING',
  ];

function parseDate(
  date: string,
) {
  return new Date(
    `${date}T00:00:00.000Z`,
  );
}

function formatDate(
  date: Date,
) {
  return date
    .toISOString()
    .slice(0, 10);
}

function addDays(
  date: Date,
  days: number,
) {
  const result =
    new Date(date);

  result.setUTCDate(
    result.getUTCDate() +
      days,
  );

  return result;
}

function getReportGroupName(
  group:
    | ReportGroupValue
    | null,
) {
  switch (group) {
    case 'EXTERNAL_PERSONNEL':
      return 'Personal Externo';

    case 'FACTORY_SUGAR_WAREHOUSE':
      return 'Fábrica y Bodega de Azúcar';

    case 'ADMINISTRATION_FIELD':
      return 'Administración y Campo';

    case 'CORPORATE_PERSONNEL':
      return 'Personal Corporativo';

    case 'PRACTITIONERS':
      return 'Practicantes';

    case 'FACTORY_LABORATORY':
      return 'Laboratorio de Fábrica';

    case 'HR_SAFETY_TRAINING':
      return 'Capital Humano, Seguridad Industrial y Capacitación';

    default:
      return 'Sin clasificación';
  }
}

function getExternalTypeName(
  type:
    | ExternalPersonnelTypeValue
    | null,
) {
  switch (type) {
    case 'VISIT':
      return 'Visitas';

    case 'SCHEDULED':
      return 'Por horarios';

    case 'OTHER_MILL':
      return 'Otros ingenios';

    default:
      return '';
  }
}

function resolveReportGroup(
  role: UserRoleValue,
  reportGroup:
    | ReportGroupValue
    | null,
): ReportGroupValue | null {
  if (
    role ===
    'PRACTITIONER'
  ) {
    return 'PRACTITIONERS';
  }

  if (
    role ===
    'EXTERNAL'
  ) {
    return 'EXTERNAL_PERSONNEL';
  }

  return reportGroup;
}

export async function getWeeklyReport(
  startDate: string,
) {
  const monday =
    parseDate(startDate);

  const saturday =
    addDays(
      monday,
      5,
    );

  const orders =
    await prisma.order.findMany({
      where: {
        orderedFor: {
          gte:
            monday,

          lte:
            saturday,
        },

        status: {
          in: [
            'DELIVERED',
          ],
        },
      },

      include: {
        user: {
          select: {
            id: true,

            employeeNumber:
              true,

            name:
              true,

            department:
              true,

            role:
              true,

            reportGroup:
              true,

            workLocation:
              true,

            externalType:
              true,
          },
        },

        signature: {
          select: {
            id: true,
            type: true,
            signedAt: true,
          },
        },
      },

      orderBy: [
        {
          orderedFor:
            'asc',
        },

        {
          service:
            'asc',
        },
      ],
    });

  const usersMap =
    new Map<
      string,
      {
        reportGroup:
          | ReportGroupValue
          | null;

        externalType:
          | ExternalPersonnelTypeValue
          | null;

        department:
          string;

        workLocation:
          string;

        employeeNumber:
          string;

        name:
          string;

        breakfast:
          Record<
            string,
            string
          >;

        lunch:
          Record<
            string,
            string
          >;
      }
    >();

  for (
    const order
    of orders
  ) {
    const userKey =
      order.user.id;

    const resolvedReportGroup =
      resolveReportGroup(
        order.user.role as
          UserRoleValue,

        order.user
          .reportGroup as
          | ReportGroupValue
          | null,
      );

    if (
      !usersMap.has(
        userKey,
      )
    ) {
      usersMap.set(
        userKey,
        {
          reportGroup:
            resolvedReportGroup,

          externalType:
            order.user.role ===
              'EXTERNAL'
              ? (
                  order.user
                    .externalType as
                    | ExternalPersonnelTypeValue
                    | null
                )
              : null,

          department:
            order.user
              .department ??
            'Sin área',

          workLocation:
            order.user
              .workLocation ??
            '',

          employeeNumber:
            order.user
              .employeeNumber ??
            '',

          name:
            order.user.name,

          breakfast:
            {},

          lunch:
            {},
        },
      );
    }

    const user =
      usersMap.get(
        userKey,
      );

    if (!user) {
      continue;
    }

    const dateKey =
      formatDate(
        order.orderedFor,
      );

    const mark =
      'X';

    if (
      order.service ===
      'BREAKFAST'
    ) {
      user.breakfast[
        dateKey
      ] = mark;
    }

    if (
      order.service ===
      'LUNCH'
    ) {
      user.lunch[
        dateKey
      ] = mark;
    }
  }

  const mondayKey =
    formatDate(
      monday,
    );

  const tuesdayKey =
    formatDate(
      addDays(
        monday,
        1,
      ),
    );

  const wednesdayKey =
    formatDate(
      addDays(
        monday,
        2,
      ),
    );

  const thursdayKey =
    formatDate(
      addDays(
        monday,
        3,
      ),
    );

  const fridayKey =
    formatDate(
      addDays(
        monday,
        4,
      ),
    );

  const saturdayKey =
    formatDate(
      saturday,
    );

  const rows:
    WeeklyReportRow[] =
      [];

  for (
    const user
    of usersMap.values()
  ) {
    const groupName =
      getReportGroupName(
        user.reportGroup,
      );

    rows.push({
      reportGroup:
        user.reportGroup,

      groupName,

      externalType:
        user.externalType,

      department:
        user.department,

      workLocation:
        user.workLocation,

      employeeNumber:
        user.employeeNumber,

      name:
        user.name,

      service:
        'BREAKFAST',

      monday:
        user.breakfast[
          mondayKey
        ] ?? '',

      tuesday:
        user.breakfast[
          tuesdayKey
        ] ?? '',

      wednesday:
        user.breakfast[
          wednesdayKey
        ] ?? '',

      thursday:
        user.breakfast[
          thursdayKey
        ] ?? '',

      friday:
        user.breakfast[
          fridayKey
        ] ?? '',

      saturday:
        user.breakfast[
          saturdayKey
        ] ?? '',
    });

    rows.push({
      reportGroup:
        user.reportGroup,

      groupName,

      externalType:
        user.externalType,

      department:
        user.department,

      workLocation:
        user.workLocation,

      employeeNumber:
        user.employeeNumber,

      name:
        user.name,

      service:
        'LUNCH',

      monday:
        user.lunch[
          mondayKey
        ] ?? '',

      tuesday:
        user.lunch[
          tuesdayKey
        ] ?? '',

      wednesday:
        user.lunch[
          wednesdayKey
        ] ?? '',

      thursday:
        user.lunch[
          thursdayKey
        ] ?? '',

      friday:
        user.lunch[
          fridayKey
        ] ?? '',

      saturday:
        user.lunch[
          saturdayKey
        ] ?? '',
    });
  }

  rows.sort(
    (
      a,
      b,
    ) => {
      const groupIndexA =
        a.reportGroup
          ? REPORT_GROUP_ORDER.indexOf(
              a.reportGroup,
            )
          : 999;

      const groupIndexB =
        b.reportGroup
          ? REPORT_GROUP_ORDER.indexOf(
              b.reportGroup,
            )
          : 999;

      if (
        groupIndexA !==
        groupIndexB
      ) {
        return (
          groupIndexA -
          groupIndexB
        );
      }

      if (
        a.externalType !==
        b.externalType
      ) {
        return (
          getExternalTypeName(
            a.externalType,
          ).localeCompare(
            getExternalTypeName(
              b.externalType,
            ),
            'es',
          )
        );
      }

      const employeeComparison =
        a.employeeNumber.localeCompare(
          b.employeeNumber,
          'es',
          {
            numeric: true,
          },
        );

      if (
        employeeComparison !==
        0
      ) {
        return employeeComparison;
      }

      const nameComparison =
        a.name.localeCompare(
          b.name,
          'es',
        );

      if (
        nameComparison !==
        0
      ) {
        return nameComparison;
      }

      if (
        a.service ===
          'BREAKFAST' &&
        b.service ===
          'LUNCH'
      ) {
        return -1;
      }

      if (
        a.service ===
          'LUNCH' &&
        b.service ===
          'BREAKFAST'
      ) {
        return 1;
      }

      return 0;
    },
  );

  const groups:
    ReportGroupSection[] =
      REPORT_GROUP_ORDER.map(
        group => ({
          key:
            group,

          name:
            getReportGroupName(
              group,
            ),

          rows:
            rows.filter(
              row =>
                row.reportGroup ===
                group,
            ),
        }),
      );

  const totals = {
    employees:
      usersMap.size,

    breakfast:
      orders.filter(
        order =>
          order.service ===
          'BREAKFAST',
      ).length,

    lunch:
      orders.filter(
        order =>
          order.service ===
          'LUNCH',
      ).length,

    totalOrders:
      orders.length,
  };

  const groupTotals =
    REPORT_GROUP_ORDER.map(
      group => {
        const groupOrders =
          orders.filter(
            order =>
              resolveReportGroup(
                order.user.role as
                  UserRoleValue,

                order.user
                  .reportGroup as
                  | ReportGroupValue
                  | null,
              ) ===
              group,
          );

        const uniqueUsers =
          new Set(
            groupOrders.map(
              order =>
                order.user.id,
            ),
          );

        return {
          key:
            group,

          name:
            getReportGroupName(
              group,
            ),

          people:
            uniqueUsers.size,

          breakfast:
            groupOrders.filter(
              order =>
                order.service ===
                'BREAKFAST',
            ).length,

          lunch:
            groupOrders.filter(
              order =>
                order.service ===
                'LUNCH',
            ).length,

          totalOrders:
            groupOrders.length,
        };
      },
    );

  return {
    week: {
      startDate:
        mondayKey,

      endDate:
        saturdayKey,

      days: {
        monday:
          mondayKey,

        tuesday:
          tuesdayKey,

        wednesday:
          wednesdayKey,

        thursday:
          thursdayKey,

        friday:
          fridayKey,

        saturday:
          saturdayKey,
      },
    },

    totals,

    groupTotals,

    rows,

    groups,
  };
}