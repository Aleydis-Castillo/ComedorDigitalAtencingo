import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import * as WebBrowser from 'expo-web-browser';

import {
  COLORS,
} from '../../constants/colors';

import {
  API_URL,
} from '../../services/api';

import {
  getWeeklyReport,
  ReportGroup,
  WeeklyReport,
  WeeklyReportRow,
} from '../../services/reportApi';

interface WeekOption {
  startDate: string;
  endDate: string;
  current: boolean;
}

interface AreaOption {
  key: ReportGroup;
  name: string;
  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;
}

const AREA_OPTIONS: AreaOption[] = [
  {
    key:
      'EXTERNAL_PERSONNEL',
    name:
      'Personal Externo',
    icon:
      'account-group-outline',
  },
  {
    key:
      'FACTORY_SUGAR_WAREHOUSE',
    name:
      'Fábrica y Bodega de Azúcar',
    icon:
      'factory',
  },
  {
    key:
      'ADMINISTRATION_FIELD',
    name:
      'Administración y Campo',
    icon:
      'office-building-outline',
  },
  {
    key:
      'CORPORATE_PERSONNEL',
    name:
      'Personal Corporativo',
    icon:
      'briefcase-account-outline',
  },
  {
    key:
      'PRACTITIONERS',
    name:
      'Practicantes',
    icon:
      'school-outline',
  },
  {
    key:
      'FACTORY_LABORATORY',
    name:
      'Laboratorio de Fábrica',
    icon:
      'flask-outline',
  },
  {
    key:
      'HR_SAFETY_TRAINING',
    name:
      'Capital Humano, Seguridad Industrial y Capacitación',
    icon:
      'shield-account-outline',
  },
];

function formatDatabaseDate(
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

function getMonday(
  value: Date,
) {
  const date =
    new Date(value);

  const day =
    date.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  date.setDate(
    date.getDate() +
      difference,
  );

  date.setHours(
    0,
    0,
    0,
    0,
  );

  return date;
}

function getMondayDate() {
  return formatDatabaseDate(
    getMonday(
      new Date(),
    ),
  );
}

function createWeekOptions():
  WeekOption[] {
  const currentMonday =
    getMonday(
      new Date(),
    );

  const weeks:
    WeekOption[] = [];

  for (
    let index = 0;
    index < 12;
    index += 1
  ) {
    const monday =
      new Date(
        currentMonday,
      );

    monday.setDate(
      monday.getDate() -
        index * 7,
    );

    const saturday =
      new Date(
        monday,
      );

    saturday.setDate(
      saturday.getDate() +
        5,
    );

    weeks.push({
      startDate:
        formatDatabaseDate(
          monday,
        ),

      endDate:
        formatDatabaseDate(
          saturday,
        ),

      current:
        index === 0,
    });
  }

  return weeks;
}

function formatShortDate(
  value: string,
) {
  const date =
    new Date(
      `${value}T00:00:00`,
    );

  return date.toLocaleDateString(
    'es-MX',
    {
      day:
        '2-digit',
      month:
        'short',
    },
  );
}

function formatWeekDate(
  value: string,
) {
  const date =
    new Date(
      `${value}T00:00:00`,
    );

  return date.toLocaleDateString(
    'es-MX',
    {
      day:
        '2-digit',
      month:
        'short',
      year:
        'numeric',
    },
  );
}

function formatReportDate(
  value: string,
) {
  const date =
    new Date(
      `${value}T00:00:00`,
    );

  return date.toLocaleDateString(
    'es-MX',
    {
      day:
        '2-digit',
      month:
        '2-digit',
      year:
        'numeric',
    },
  );
}

function serviceName(
  service:
    WeeklyReportRow['service'],
) {
  return service ===
    'BREAKFAST'
    ? 'Desayuno'
    : 'Comida';
}

function DayCell({
  value,
}: {
  value: string;
}) {
  return (
    <View
      style={
        styles.dayCell
      }
    >
      <Text
        style={[
          styles.dayValue,

          value
            ? styles.dayValueMarked
            : undefined,
        ]}
      >
        {value || '—'}
      </Text>
    </View>
  );
}

function ReportRow({
  row,
}: {
  row:
    WeeklyReportRow;
}) {
  return (
    <View
      style={
        styles.reportRow
      }
    >
      <View
        style={
          styles.numberSection
        }
      >
        <Text
          style={
            styles.numberText
          }
        >
          {row.employeeNumber ||
            '—'}
        </Text>
      </View>

      <View
        style={
          styles.nameSection
        }
      >
        <Text
          style={
            styles.nameText
          }
          numberOfLines={
            2
          }
        >
          {row.name}
        </Text>

        {row.externalType && (
          <Text
            style={
              styles.externalTypeText
            }
          >
            {row.externalType ===
            'VISIT'
              ? 'Visita'
              : row.externalType ===
                  'SCHEDULED'
                ? 'Por horarios'
                : 'Otro ingenio'}
          </Text>
        )}
      </View>

      <View
        style={
          styles.serviceSection
        }
      >
        <Text
          style={
            styles.serviceText
          }
        >
          {serviceName(
            row.service,
          )}
        </Text>
      </View>

      <DayCell
        value={
          row.monday
        }
      />

      <DayCell
        value={
          row.tuesday
        }
      />

      <DayCell
        value={
          row.wednesday
        }
      />

      <DayCell
        value={
          row.thursday
        }
      />

      <DayCell
        value={
          row.friday
        }
      />

      <DayCell
        value={
          row.saturday
        }
      />
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;

  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;
}) {
  return (
    <View
      style={
        styles.statCard
      }
    >
      <MaterialCommunityIcons
        name={icon}
        size={21}
        color={
          COLORS.primary
        }
      />

      <Text
        style={
          styles.statValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.statLabel
        }
      >
        {label}
      </Text>
    </View>
  );
}

export default function ReportsScreen() {
  const [
    report,
    setReport,
  ] =
    useState<WeeklyReport | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] =
    useState(false);

  const [
    startDate,
    setStartDate,
  ] =
    useState(
      getMondayDate(),
    );

  const [
    selectedArea,
    setSelectedArea,
  ] =
    useState<ReportGroup>(
      'EXTERNAL_PERSONNEL',
    );

  const [
    weekModalVisible,
    setWeekModalVisible,
  ] =
    useState(false);

  const [
    areaModalVisible,
    setAreaModalVisible,
  ] =
    useState(false);

  const weekOptions =
    useMemo(
      () =>
        createWeekOptions(),
      [],
    );

  const selectedAreaOption =
    useMemo(
      () =>
        AREA_OPTIONS.find(
          area =>
            area.key ===
            selectedArea,
        ) ??
        AREA_OPTIONS[0],
      [
        selectedArea,
      ],
    );

  const loadReport =
    useCallback(
      async (
        showLoading = true,
      ) => {
        try {
          if (
            showLoading
          ) {
            setIsLoading(
              true,
            );
          }

          const data =
            await getWeeklyReport(
              startDate,
            );

          setReport(
            data,
          );
        } catch (error) {
          console.error(
            'Error al consultar reporte:',
            error,
          );

          Alert.alert(
            'No fue posible cargar el reporte',

            error instanceof Error
              ? error.message
              : 'Ocurrió un error inesperado.',
          );
        } finally {
          setIsLoading(
            false,
          );

          setIsRefreshing(
            false,
          );
        }
      },
      [
        startDate,
      ],
    );

  useEffect(() => {
    loadReport();
  }, [
    loadReport,
  ]);

  const selectedGroup =
    useMemo(
      () => {
        if (!report) {
          return null;
        }

        return (
          report.groups.find(
            group =>
              group.key ===
              selectedArea,
          ) ?? null
        );
      },
      [
        report,
        selectedArea,
      ],
    );

  const selectedGroupTotal =
    useMemo(
      () => {
        if (!report) {
          return null;
        }

        return (
          report.groupTotals.find(
            group =>
              group.key ===
              selectedArea,
          ) ?? null
        );
      },
      [
        report,
        selectedArea,
      ],
    );

  const groupedRows =
    selectedGroup
      ?.rows ??
    [];

  const handleRefresh =
    () => {
      setIsRefreshing(
        true,
      );

      loadReport(
        false,
      );
    };

  const handleSelectWeek =
    (
      week:
        WeekOption,
    ) => {
      setWeekModalVisible(
        false,
      );

      if (
        week.startDate ===
        startDate
      ) {
        return;
      }

      setStartDate(
        week.startDate,
      );
    };

  const handleSelectArea =
    (
      area:
        AreaOption,
    ) => {
      setAreaModalVisible(
        false,
      );

      setSelectedArea(
        area.key,
      );
    };

  const handleDownloadExcel =
    async () => {
      try {
        const url =
          `${API_URL}/reports/weekly/excel?startDate=${startDate}&reportGroup=${selectedArea}`;

        await WebBrowser
          .openBrowserAsync(
            url,
          );
      } catch (error) {
        console.error(
          'Error al abrir Excel:',
          error,
        );

        Alert.alert(
          'No fue posible abrir Excel',
          'Inténtalo nuevamente.',
        );
      }
    };

  const handleDownloadPdf =
    async () => {
      try {
        const url =
          `${API_URL}/reports/weekly/pdf?startDate=${startDate}&reportGroup=${selectedArea}`;

        await WebBrowser
          .openBrowserAsync(
            url,
          );
      } catch (error) {
        console.error(
          'Error al abrir PDF:',
          error,
        );

        Alert.alert(
          'No fue posible abrir PDF',
          'Inténtalo nuevamente.',
        );
      }
    };

  if (
    isLoading
  ) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={
            COLORS.primary
          }
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Generando reporte semanal...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <FlatList
        data={
          groupedRows
        }
        renderItem={({
          item,
        }) => (
          <ReportRow
            row={item}
          />
        )}
        keyExtractor={(
          item,
          index,
        ) =>
          `${
            item.employeeNumber ||
            item.name
          }-${item.service}-${index}`
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={
              handleRefresh
            }
            colors={[
              COLORS.primary,
            ]}
            tintColor={
              COLORS.primary
            }
          />
        }
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            <View
              style={
                styles.header
              }
            >
              <View
                style={
                  styles.headerTextContainer
                }
              >
                <Text
                  style={
                    styles.title
                  }
                >
                  Reporte semanal
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Consumo de lunes a sábado
                </Text>
              </View>

              <View
                style={
                  styles.headerIcon
                }
              >
                <MaterialCommunityIcons
                  name="file-chart-outline"
                  size={30}
                  color={
                    COLORS.primary
                  }
                />
              </View>
            </View>

            {report && (
              <>
                <TouchableOpacity
                  activeOpacity={
                    0.85
                  }
                  style={
                    styles.selectorCard
                  }
                  onPress={() =>
                    setWeekModalVisible(
                      true,
                    )
                  }
                >
                  <View
                    style={
                      styles.selectorIcon
                    }
                  >
                    <MaterialCommunityIcons
                      name="calendar-range-outline"
                      size={25}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.selectorContent
                    }
                  >
                    <Text
                      style={
                        styles.selectorLabel
                      }
                    >
                      Semana
                    </Text>

                    <Text
                      style={
                        styles.selectorValue
                      }
                    >
                      {formatShortDate(
                        report.week
                          .startDate,
                      )}

                      {' - '}

                      {formatShortDate(
                        report.week
                          .endDate,
                      )}
                    </Text>

                    <Text
                      style={
                        styles.selectorHint
                      }
                    >
                      Toca para consultar otra semana
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={27}
                    color={
                      COLORS.primary
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={
                    0.85
                  }
                  style={
                    styles.selectorCard
                  }
                  onPress={() =>
                    setAreaModalVisible(
                      true,
                    )
                  }
                >
                  <View
                    style={
                      styles.selectorIcon
                    }
                  >
                    <MaterialCommunityIcons
                      name={
                        selectedAreaOption
                          ?.icon ??
                        'map-marker-outline'
                      }
                      size={25}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.selectorContent
                    }
                  >
                    <Text
                      style={
                        styles.selectorLabel
                      }
                    >
                      Área
                    </Text>

                    <Text
                      style={
                        styles.selectorValue
                      }
                      numberOfLines={
                        2
                      }
                    >
                      {selectedAreaOption
                        ?.name}
                    </Text>

                    <Text
                      style={
                        styles.selectorHint
                      }
                    >
                      Toca para consultar otro reporte
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={27}
                    color={
                      COLORS.primary
                    }
                  />
                </TouchableOpacity>

                <View
                  style={
                    styles.statsRow
                  }
                >
                  <StatCard
                    label="Personas"
                    value={
                      selectedGroupTotal
                        ?.people ??
                      0
                    }
                    icon="account-group-outline"
                  />

                  <StatCard
                    label="Desayunos"
                    value={
                      selectedGroupTotal
                        ?.breakfast ??
                      0
                    }
                    icon="coffee-outline"
                  />

                  <StatCard
                    label="Comidas"
                    value={
                      selectedGroupTotal
                        ?.lunch ??
                      0
                    }
                    icon="silverware-fork-knife"
                  />
                </View>

                <View
                  style={
                    styles.reportHeaderCard
                  }
                >
                  <Text
                    style={
                      styles.companyName
                    }
                  >
                    INDUSTRIAL AZUCARERA ATENCINGO, S.A. DE C.V.
                  </Text>

                  <Text
                    style={
                      styles.systemName
                    }
                  >
                    COMEDOR DIGITAL ATENCINGO
                  </Text>

                  <View
                    style={
                      styles.reportInfoDivider
                    }
                  />

                  <View
                    style={
                      styles.reportInfoRow
                    }
                  >
                    <Text
                      style={
                        styles.reportInfoLabel
                      }
                    >
                      ÁREA:
                    </Text>

                    <Text
                      style={
                        styles.reportInfoValue
                      }
                    >
                      {selectedAreaOption
                        ?.name}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.reportInfoRow
                    }
                  >
                    <Text
                      style={
                        styles.reportInfoLabel
                      }
                    >
                      PERIODO:
                    </Text>

                    <Text
                      style={
                        styles.reportInfoValue
                      }
                    >
                      {formatReportDate(
                        report.week
                          .startDate,
                      )}

                      {' AL '}

                      {formatReportDate(
                        report.week
                          .endDate,
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.exportRow
                  }
                >
                  <Pressable
                    style={
                      styles.exportButton
                    }
                    onPress={
                      handleDownloadExcel
                    }
                  >
                    <MaterialCommunityIcons
                      name="file-excel-outline"
                      size={21}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.exportText
                      }
                    >
                      Excel
                    </Text>
                  </Pressable>

                  <Pressable
                    style={
                      styles.exportButton
                    }
                    onPress={
                      handleDownloadPdf
                    }
                  >
                    <MaterialCommunityIcons
                      name="file-pdf-box"
                      size={21}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.exportText
                      }
                    >
                      PDF
                    </Text>
                  </Pressable>
                </View>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Registro semanal
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={
                    styles.tableScrollContent
                  }
                >
                  <View>
                    <View
                      style={
                        styles.tableHeader
                      }
                    >
                      <View
                        style={
                          styles.numberHeader
                        }
                      >
                        <Text
                          style={
                            styles.headerText
                          }
                        >
                          Núm.
                        </Text>
                      </View>

                      <View
                        style={
                          styles.nameHeader
                        }
                      >
                        <Text
                          style={
                            styles.headerText
                          }
                        >
                          Nombre
                        </Text>
                      </View>

                      <View
                        style={
                          styles.serviceHeader
                        }
                      >
                        <Text
                          style={
                            styles.headerText
                          }
                        >
                          Des./Com.
                        </Text>
                      </View>

                      {[
                        'L',
                        'M',
                        'X',
                        'J',
                        'V',
                        'S',
                      ].map(
                        (
                          day,
                          index,
                        ) => (
                          <View
                            key={`${day}-${index}`}
                            style={
                              styles.dayHeader
                            }
                          >
                            <Text
                              style={
                                styles.headerText
                              }
                            >
                              {day}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyCard
            }
          >
            <MaterialCommunityIcons
              name="file-document-outline"
              size={48}
              color="#9AA2AE"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              Sin registros
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              No existen servicios entregados para esta área durante la semana seleccionada.
            </Text>
          </View>
        }
      />

      <Modal
        visible={
          weekModalVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setWeekModalVisible(
            false,
          )
        }
      >
        <Pressable
          style={
            styles.modalOverlay
          }
          onPress={() =>
            setWeekModalVisible(
              false,
            )
          }
        >
          <Pressable
            style={
              styles.modalCard
            }
            onPress={() => {}}
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Seleccionar semana
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  Consulta reportes anteriores
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.closeButton
                }
                onPress={() =>
                  setWeekModalVisible(
                    false,
                  )
                }
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={
                    COLORS.text
                  }
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              {weekOptions.map(
                week => {
                  const selected =
                    week.startDate ===
                    startDate;

                  return (
                    <TouchableOpacity
                      key={
                        week.startDate
                      }
                      activeOpacity={
                        0.8
                      }
                      style={[
                        styles.modalOption,

                        selected &&
                          styles.modalOptionSelected,
                      ]}
                      onPress={() =>
                        handleSelectWeek(
                          week,
                        )
                      }
                    >
                      <View
                        style={[
                          styles.radioOuter,

                          selected &&
                            styles.radioOuterSelected,
                        ]}
                      >
                        {selected && (
                          <View
                            style={
                              styles.radioInner
                            }
                          />
                        )}
                      </View>

                      <View
                        style={
                          styles.modalOptionContent
                        }
                      >
                        <Text
                          style={[
                            styles.modalOptionTitle,

                            selected &&
                              styles.modalOptionTitleSelected,
                          ]}
                        >
                          {formatWeekDate(
                            week.startDate,
                          )}

                          {' - '}

                          {formatWeekDate(
                            week.endDate,
                          )}
                        </Text>

                        {week.current && (
                          <Text
                            style={
                              styles.currentWeekText
                            }
                          >
                            Semana actual
                          </Text>
                        )}
                      </View>

                      {selected && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color={
                            COLORS.primary
                          }
                        />
                      )}
                    </TouchableOpacity>
                  );
                },
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={
          areaModalVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setAreaModalVisible(
            false,
          )
        }
      >
        <Pressable
          style={
            styles.modalOverlay
          }
          onPress={() =>
            setAreaModalVisible(
              false,
            )
          }
        >
          <Pressable
            style={
              styles.modalCard
            }
            onPress={() => {}}
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Seleccionar área
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  Elige el reporte que deseas consultar
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.closeButton
                }
                onPress={() =>
                  setAreaModalVisible(
                    false,
                  )
                }
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={
                    COLORS.text
                  }
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              {AREA_OPTIONS.map(
                area => {
                  const selected =
                    area.key ===
                    selectedArea;

                  const total =
                    report?.groupTotals.find(
                      item =>
                        item.key ===
                        area.key,
                    );

                  return (
                    <TouchableOpacity
                      key={
                        area.key
                      }
                      activeOpacity={
                        0.8
                      }
                      style={[
                        styles.areaOption,

                        selected &&
                          styles.areaOptionSelected,
                      ]}
                      onPress={() =>
                        handleSelectArea(
                          area,
                        )
                      }
                    >
                      <View
                        style={[
                          styles.areaOptionIcon,

                          selected &&
                            styles.areaOptionIconSelected,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={
                            area.icon
                          }
                          size={24}
                          color={
                            selected
                              ? '#FFFFFF'
                              : COLORS.primary
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.modalOptionContent
                        }
                      >
                        <Text
                          style={[
                            styles.areaOptionTitle,

                            selected &&
                              styles.areaOptionTitleSelected,
                          ]}
                        >
                          {area.name}
                        </Text>

                        <Text
                          style={
                            styles.areaOptionSubtitle
                          }
                        >
                          {total
                            ?.people ??
                            0}{' '}
                          personas ·{' '}
                          {total
                            ?.totalOrders ??
                            0}{' '}
                          servicios
                        </Text>
                      </View>

                      {selected && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color={
                            COLORS.primary
                          }
                        />
                      )}
                    </TouchableOpacity>
                  );
                },
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 40,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
      backgroundColor:
        COLORS.background,
    },

    loadingText: {
      marginTop: 12,
      color:
        COLORS.gray,
    },

    header: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      marginBottom: 20,
    },

    headerTextContainer: {
      flex: 1,
      paddingRight: 15,
    },

    title: {
      fontSize: 30,
      fontWeight:
        '900',
      color:
        COLORS.text,
    },

    subtitle: {
      marginTop: 4,
      fontSize: 14,
      color:
        COLORS.gray,
    },

    headerIcon: {
      width: 58,
      height: 58,
      borderRadius: 19,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#E8F4EA',
    },

    selectorCard: {
      flexDirection:
        'row',
      alignItems:
        'center',
      backgroundColor:
        COLORS.white,
      borderRadius: 20,
      padding: 15,
      marginBottom: 12,
      borderWidth: 1,
      borderColor:
        '#DFE9E1',
      elevation: 2,
    },

    selectorIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        '#E8F4EA',
    },

    selectorContent: {
      flex: 1,
      marginLeft: 11,
    },

    selectorLabel: {
      color:
        COLORS.gray,
      fontSize: 11,
    },

    selectorValue: {
      marginTop: 2,
      fontWeight:
        '800',
      color:
        COLORS.text,
      fontSize: 14,
    },

    selectorHint: {
      marginTop: 3,
      color:
        COLORS.primary,
      fontSize: 10,
      fontWeight:
        '600',
    },

    statsRow: {
      flexDirection:
        'row',
      gap: 9,
      marginTop: 6,
      marginBottom: 18,
    },

    statCard: {
      flex: 1,
      minHeight: 92,
      borderRadius: 17,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        COLORS.white,
    },

    statValue: {
      marginTop: 4,
      fontSize: 21,
      fontWeight:
        '900',
      color:
        COLORS.text,
    },

    statLabel: {
      marginTop: 2,
      fontSize: 10,
      fontWeight:
        '700',
      color:
        COLORS.gray,
    },

    reportHeaderCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      borderWidth: 1,
      borderColor:
        '#DDE6DF',
      padding: 20,
      marginBottom: 16,
      elevation: 2,
    },

    companyName: {
      textAlign:
        'center',
      fontSize: 15,
      lineHeight: 21,
      fontWeight:
        '900',
      color:
        COLORS.text,
    },

    systemName: {
      marginTop: 5,
      textAlign:
        'center',
      fontSize: 14,
      fontWeight:
        '800',
      color:
        COLORS.primary,
    },

    reportInfoDivider: {
      height: 1,
      backgroundColor:
        '#E3E8E4',
      marginVertical: 16,
    },

    reportInfoRow: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      marginBottom: 8,
    },

    reportInfoLabel: {
      width: 75,
      color:
        COLORS.gray,
      fontSize: 11,
      fontWeight:
        '900',
    },

    reportInfoValue: {
      flex: 1,
      color:
        COLORS.text,
      fontSize: 12,
      lineHeight: 18,
      fontWeight:
        '800',
    },

    exportRow: {
      flexDirection:
        'row',
      gap: 10,
      marginBottom: 24,
    },

    exportButton: {
      flex: 1,
      height: 50,
      borderRadius: 16,
      backgroundColor:
        COLORS.primary,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap: 7,
    },

    exportText: {
      color:
        '#FFFFFF',
      fontWeight:
        '800',
    },

    sectionTitle: {
      color:
        COLORS.text,
      fontSize: 19,
      fontWeight:
        '900',
      marginBottom: 12,
    },

    tableScrollContent: {
      minWidth: 720,
    },

    tableHeader: {
      minWidth: 720,
      flexDirection:
        'row',
      backgroundColor:
        '#E7F3E9',
      borderTopLeftRadius:
        13,
      borderTopRightRadius:
        13,
      paddingVertical: 11,
    },

    numberHeader: {
      width: 70,
      paddingHorizontal: 6,
      justifyContent:
        'center',
    },

    nameHeader: {
      width: 180,
      paddingHorizontal: 8,
      justifyContent:
        'center',
    },

    serviceHeader: {
      width: 90,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    dayHeader: {
      width: 60,
      alignItems:
        'center',
      justifyContent:
        'center',
    },

    headerText: {
      fontSize: 10,
      fontWeight:
        '900',
      color:
        COLORS.primary,
      textAlign:
        'center',
    },

    reportRow: {
      minWidth: 720,
      flexDirection:
        'row',
      alignItems:
        'stretch',
      minHeight: 64,
      backgroundColor:
        COLORS.white,
      borderBottomWidth: 1,
      borderBottomColor:
        '#EBEEEC',
    },

    numberSection: {
      width: 70,
      paddingHorizontal: 6,
      justifyContent:
        'center',
    },

    numberText: {
      fontSize: 11,
      color:
        COLORS.text,
      fontWeight:
        '700',
      textAlign:
        'center',
    },

    nameSection: {
      width: 180,
      paddingHorizontal: 8,
      justifyContent:
        'center',
    },

    nameText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight:
        '800',
      color:
        COLORS.text,
    },

    externalTypeText: {
      marginTop: 3,
      fontSize: 9,
      color:
        COLORS.gray,
    },

    serviceSection: {
      width: 90,
      justifyContent:
        'center',
      alignItems:
        'center',
      paddingHorizontal: 4,
    },

    serviceText: {
      fontSize: 10,
      fontWeight:
        '700',
      color:
        COLORS.text,
      textAlign:
        'center',
    },

    dayCell: {
      width: 60,
      alignItems:
        'center',
      justifyContent:
        'center',
    },

    dayValue: {
      fontSize: 11,
      color:
        '#C4C8CD',
    },

    dayValueMarked: {
      fontSize: 16,
      fontWeight:
        '900',
      color:
        COLORS.primary,
    },

    emptyCard: {
      alignItems:
        'center',
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      padding: 35,
      marginTop: 20,
    },

    emptyTitle: {
      marginTop: 12,
      fontSize: 18,
      fontWeight:
        '800',
      color:
        COLORS.text,
    },

    emptyText: {
      marginTop: 6,
      textAlign:
        'center',
      color:
        COLORS.gray,
      lineHeight: 19,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,0.40)',
      justifyContent:
        'center',
      paddingHorizontal: 22,
    },

    modalCard: {
      width:
        '100%',
      maxWidth: 540,
      maxHeight:
        '78%',
      alignSelf:
        'center',
      backgroundColor:
        COLORS.white,
      borderRadius: 25,
      padding: 19,
    },

    modalHeader: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      marginBottom: 17,
    },

    modalTitle: {
      color:
        COLORS.text,
      fontSize: 21,
      fontWeight:
        '900',
    },

    modalSubtitle: {
      marginTop: 3,
      color:
        COLORS.gray,
      fontSize: 12,
    },

    closeButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        '#F2F5F2',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    modalOption: {
      minHeight: 70,
      flexDirection:
        'row',
      alignItems:
        'center',
      borderRadius: 17,
      paddingHorizontal: 14,
      marginBottom: 9,
      borderWidth: 1,
      borderColor:
        '#E4E9E5',
      backgroundColor:
        '#FAFCFA',
    },

    modalOptionSelected: {
      backgroundColor:
        '#EAF5EC',
      borderColor:
        COLORS.primary,
    },

    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor:
        '#AEB6AF',
      justifyContent:
        'center',
      alignItems:
        'center',
      marginRight: 12,
    },

    radioOuterSelected: {
      borderColor:
        COLORS.primary,
    },

    radioInner: {
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor:
        COLORS.primary,
    },

    modalOptionContent: {
      flex: 1,
    },

    modalOptionTitle: {
      color:
        COLORS.text,
      fontSize: 13,
      fontWeight:
        '700',
    },

    modalOptionTitleSelected: {
      color:
        COLORS.primary,
      fontWeight:
        '900',
    },

    currentWeekText: {
      marginTop: 4,
      color:
        COLORS.primary,
      fontSize: 10,
      fontWeight:
        '700',
    },

    areaOption: {
      minHeight: 78,
      flexDirection:
        'row',
      alignItems:
        'center',
      borderRadius: 18,
      paddingHorizontal: 13,
      paddingVertical: 10,
      marginBottom: 9,
      borderWidth: 1,
      borderColor:
        '#E4E9E5',
      backgroundColor:
        '#FAFCFA',
    },

    areaOptionSelected: {
      backgroundColor:
        '#EAF5EC',
      borderColor:
        COLORS.primary,
    },

    areaOptionIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      backgroundColor:
        '#E9F5EB',
      alignItems:
        'center',
      justifyContent:
        'center',
      marginRight: 11,
    },

    areaOptionIconSelected: {
      backgroundColor:
        COLORS.primary,
    },

    areaOptionTitle: {
      color:
        COLORS.text,
      fontSize: 13,
      lineHeight: 17,
      fontWeight:
        '800',
    },

    areaOptionTitleSelected: {
      color:
        COLORS.primary,
    },

    areaOptionSubtitle: {
      marginTop: 4,
      color:
        COLORS.gray,
      fontSize: 10,
    },
  });