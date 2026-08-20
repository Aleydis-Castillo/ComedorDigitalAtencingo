import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';
import { API_URL } from '../../services/api';

type ServiceType =
  | 'BREAKFAST'
  | 'LUNCH';

interface DishForm {
  name: string;
  description: string;
}

interface DayOption {
  label: string;
  shortLabel: string;
  date: string;
}

interface MenuDishResponse {
  id?: string;
  name?: string;
  description?: string | null;
  service?: ServiceType;
  position?: number;
  available?: boolean;
}

interface MenuDayResponse {
  id?: string;
  date?: string;
  published?: boolean;
  dishes?: MenuDishResponse[];
}

const EMPTY_DISHES: DishForm[] = [
  {
    name: '',
    description: '',
  },
  {
    name: '',
    description: '',
  },
];

function formatDate(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMonday(date: Date) {
  const result = new Date(date);

  const day = result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + difference,
  );

  result.setHours(0, 0, 0, 0);

  return result;
}

function createWeek(
  monday: Date,
): DayOption[] {
  const names = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  const shortNames = [
    'LUN',
    'MAR',
    'MIÉ',
    'JUE',
    'VIE',
    'SÁB',
  ];

  return names.map(
    (name, index) => {
      const date = new Date(monday);

      date.setDate(
        monday.getDate() + index,
      );

      return {
        label: name,
        shortLabel:
          shortNames[index],
        date: formatDate(date),
      };
    },
  );
}

function formatDisplayDate(
  value: string,
) {
  if (!value) {
    return '';
  }

  const [
    year,
    month,
    day,
  ] = value.split('-');

  return `${day}/${month}/${year}`;
}

function cloneEmptyDishes() {
  return EMPTY_DISHES.map(
    dish => ({
      ...dish,
    }),
  );
}

export default function MenuScreen() {
  const initialMonday = useMemo(
    () => getMonday(new Date()),
    [],
  );

  const [monday, setMonday] =
    useState(initialMonday);

  const week = useMemo(
    () => createWeek(monday),
    [monday],
  );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    week[0]?.date ?? '',
  );

  const [
    service,
    setService,
  ] = useState<ServiceType>(
    'BREAKFAST',
  );

  const [dishes, setDishes] =
    useState<DishForm[]>(
      cloneEmptyDishes(),
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    isPublishing,
    setIsPublishing,
  ] = useState(false);

  const startDate =
    week[0]?.date ?? '';

  const endDate =
    week[5]?.date ?? '';

  useEffect(() => {
    if (week.length > 0) {
      setSelectedDate(
        week[0].date,
      );
    }
  }, [week]);

  useEffect(() => {
    loadSelectedMenu();
  }, [
    selectedDate,
    service,
  ]);

  const loadSelectedMenu =
    async () => {
      if (!selectedDate) {
        return;
      }

      try {
        setIsLoading(true);

        const response =
          await fetch(
            `${API_URL}/menu?startDate=${selectedDate}&endDate=${selectedDate}`,
          );

        const data =
          (await response.json()) as
            | MenuDayResponse[]
            | {
                message?: string;
              };

        if (!response.ok) {
          const message =
            !Array.isArray(data) &&
            data.message
              ? data.message
              : 'No fue posible consultar el menú.';

          throw new Error(message);
        }

        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {
          setDishes(
            cloneEmptyDishes(),
          );

          return;
        }

        const menuDay = data[0];

        if (
          !menuDay ||
          !Array.isArray(
            menuDay.dishes,
          )
        ) {
          setDishes(
            cloneEmptyDishes(),
          );

          return;
        }

        const serviceDishes =
          menuDay.dishes
            .filter(
              dish =>
                dish.service ===
                service,
            )
            .sort(
              (a, b) =>
                (a.position ?? 0) -
                (b.position ?? 0),
            );

        setDishes([
          {
            name:
              serviceDishes[0]
                ?.name ?? '',

            description:
              serviceDishes[0]
                ?.description ??
              '',
          },

          {
            name:
              serviceDishes[1]
                ?.name ?? '',

            description:
              serviceDishes[1]
                ?.description ??
              '',
          },
        ]);
      } catch (error) {
        console.error(
          'Error al cargar menú:',
          error,
        );

        Alert.alert(
          'No fue posible cargar el menú',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );

        setDishes(
          cloneEmptyDishes(),
        );
      } finally {
        setIsLoading(false);
      }
    };

  const updateDish = (
    index: number,
    field:
      | 'name'
      | 'description',
    value: string,
  ) => {
    setDishes(previous =>
      previous.map(
        (dish, dishIndex) =>
          dishIndex === index
            ? {
                ...dish,
                [field]: value,
              }
            : dish,
      ),
    );
  };

  const saveMenu = async () => {
    const normalized =
      dishes.map(dish => ({
        name: dish.name.trim(),
        description:
          dish.description.trim(),
      }));

    const incomplete =
      normalized.some(
        dish =>
          !dish.name ||
          !dish.description,
      );

    if (incomplete) {
      Alert.alert(
        'Información incompleta',
        'Escribe el nombre y la descripción de los dos platillos.',
      );

      return;
    }

    try {
      setIsSaving(true);

      const response =
        await fetch(
          `${API_URL}/menu/day`,
          {
            method: 'PUT',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              date: selectedDate,
              service,
              dishes: normalized,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ??
            'No fue posible guardar el menú.',
        );
      }

      Alert.alert(
        'Menú guardado',
        `${
          service ===
          'BREAKFAST'
            ? 'Desayuno'
            : 'Comida'
        } guardado correctamente para el ${formatDisplayDate(
          selectedDate,
        )}.`,
      );

      await loadSelectedMenu();
    } catch (error) {
      Alert.alert(
        'No fue posible guardar',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const publishMenu =
    async () => {
      if (
        !startDate ||
        !endDate
      ) {
        return;
      }

      try {
        setIsPublishing(true);

        const response =
          await fetch(
            `${API_URL}/menu/publish`,
            {
              method: 'PATCH',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                startDate,
                endDate,
              }),
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              'No fue posible publicar el menú.',
          );
        }

        Alert.alert(
          'Menú publicado',
          'El menú semanal ya está disponible para los empleados.',
        );
      } catch (error) {
        Alert.alert(
          'No fue posible publicar',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setIsPublishing(false);
      }
    };

  const changeWeek = (
    amount: number,
  ) => {
    const next =
      new Date(monday);

    next.setDate(
      next.getDate() +
        amount * 7,
    );

    setMonday(next);
  };

  const selectedDay =
    week.find(
      day =>
        day.date ===
        selectedDate,
    );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Menú semanal
          </Text>

          <Text style={styles.subtitle}>
            Administra los platillos disponibles
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.weekCard}>
          <View
            style={
              styles.weekNavigation
            }
          >
            <TouchableOpacity
              style={
                styles.weekButton
              }
              onPress={() =>
                changeWeek(-1)
              }
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={
                  COLORS.primary
                }
              />
            </TouchableOpacity>

            <View>
              <Text
                style={
                  styles.weekLabel
                }
              >
                Semana
              </Text>

              <Text
                style={
                  styles.weekRange
                }
              >
                {formatDisplayDate(
                  startDate,
                )}
                {' - '}
                {formatDisplayDate(
                  endDate,
                )}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.weekButton
              }
              onPress={() =>
                changeWeek(1)
              }
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={
                  COLORS.primary
                }
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.daysContainer
            }
          >
            {week.map(day => {
              const selected =
                day.date ===
                selectedDate;

              return (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dayButton,
                    selected &&
                      styles.dayButtonSelected,
                  ]}
                  onPress={() =>
                    setSelectedDate(
                      day.date,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.dayShort,
                      selected &&
                        styles.dayTextSelected,
                    ]}
                  >
                    {day.shortLabel}
                  </Text>

                  <Text
                    style={[
                      styles.dayNumber,
                      selected &&
                        styles.dayTextSelected,
                    ]}
                  >
                    {
                      day.date.split(
                        '-',
                      )[2]
                    }
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Text style={styles.dayTitle}>
          {selectedDay?.label}
        </Text>

        <Text style={styles.dateText}>
          {selectedDate
            ? formatDisplayDate(
                selectedDate,
              )
            : ''}
        </Text>

        <View
          style={
            styles.serviceContainer
          }
        >
          <TouchableOpacity
            style={[
              styles.serviceButton,
              service ===
                'BREAKFAST' &&
                styles.serviceSelected,
            ]}
            onPress={() =>
              setService(
                'BREAKFAST',
              )
            }
          >
            <Ionicons
              name="cafe-outline"
              size={22}
              color={
                service ===
                'BREAKFAST'
                  ? COLORS.white
                  : COLORS.primary
              }
            />

            <Text
              style={[
                styles.serviceText,
                service ===
                  'BREAKFAST' &&
                  styles.serviceTextSelected,
              ]}
            >
              Desayuno
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.serviceButton,
              service ===
                'LUNCH' &&
                styles.serviceSelected,
            ]}
            onPress={() =>
              setService('LUNCH')
            }
          >
            <Ionicons
              name="restaurant-outline"
              size={22}
              color={
                service ===
                'LUNCH'
                  ? COLORS.white
                  : COLORS.primary
              }
            />

            <Text
              style={[
                styles.serviceText,
                service ===
                  'LUNCH' &&
                  styles.serviceTextSelected,
              ]}
            >
              Comida
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View
            style={styles.loader}
          >
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />

            <Text
              style={styles.loaderText}
            >
              Cargando menú...
            </Text>
          </View>
        ) : (
          <>
            {dishes.map(
              (dish, index) => (
                <View
                  key={index}
                  style={
                    styles.dishCard
                  }
                >
                  <View
                    style={
                      styles.dishHeader
                    }
                  >
                    <View
                      style={
                        styles.dishNumber
                      }
                    >
                      <Text
                        style={
                          styles.dishNumberText
                        }
                      >
                        {index + 1}
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.dishTitle
                      }
                    >
                      Platillo{' '}
                      {index + 1}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.inputLabel
                    }
                  >
                    Nombre
                  </Text>

                  <TextInput
                    value={dish.name}
                    onChangeText={value =>
                      updateDish(
                        index,
                        'name',
                        value,
                      )
                    }
                    placeholder="Ej. Chilaquiles verdes"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    style={
                      styles.input
                    }
                  />

                  <Text
                    style={
                      styles.inputLabel
                    }
                  >
                    Descripción
                  </Text>

                  <TextInput
                    value={
                      dish.description
                    }
                    onChangeText={value =>
                      updateDish(
                        index,
                        'description',
                        value,
                      )
                    }
                    placeholder="Describe el platillo"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    multiline
                    style={[
                      styles.input,
                      styles.descriptionInput,
                    ]}
                  />
                </View>
              ),
            )}

            <TouchableOpacity
              style={[
                styles.saveButton,
                isSaving &&
                  styles.disabledButton,
              ]}
              disabled={isSaving}
              onPress={saveMenu}
            >
              <Ionicons
                name="save-outline"
                size={22}
                color={COLORS.white}
              />

              <Text
                style={
                  styles.saveButtonText
                }
              >
                {isSaving
                  ? 'Guardando...'
                  : 'Guardar cambios'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.publishButton,
                isPublishing &&
                  styles.disabledButton,
              ]}
              disabled={isPublishing}
              onPress={publishMenu}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.publishButtonText
                }
              >
                {isPublishing
                  ? 'Publicando...'
                  : 'Publicar menú semanal'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 18,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        COLORS.background,
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 15,
      backgroundColor:
        COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
      elevation: 2,
    },

    headerText: {
      flex: 1,
    },

    title: {
      fontSize: 25,
      fontWeight: '900',
      color: COLORS.text,
    },

    subtitle: {
      marginTop: 3,
      fontSize: 13,
      color: COLORS.gray,
    },

    content: {
      paddingHorizontal: 18,
      paddingBottom: 45,
    },

    weekCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      padding: 15,
      marginBottom: 22,
      elevation: 3,
    },

    weekNavigation: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },

    weekButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor:
        '#EAF5EB',
      alignItems: 'center',
      justifyContent: 'center',
    },

    weekLabel: {
      textAlign: 'center',
      color: COLORS.gray,
      fontSize: 12,
    },

    weekRange: {
      marginTop: 2,
      fontWeight: '800',
      color: COLORS.text,
      fontSize: 14,
    },

    daysContainer: {
      gap: 8,
    },

    dayButton: {
      width: 58,
      height: 70,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        '#F3F7F3',
    },

    dayButtonSelected: {
      backgroundColor:
        COLORS.primary,
    },

    dayShort: {
      fontSize: 10,
      fontWeight: '800',
      color: COLORS.gray,
    },

    dayNumber: {
      marginTop: 5,
      fontSize: 18,
      fontWeight: '900',
      color: COLORS.text,
    },

    dayTextSelected: {
      color: COLORS.white,
    },

    dayTitle: {
      fontSize: 23,
      fontWeight: '900',
      color: COLORS.text,
    },

    dateText: {
      color: COLORS.gray,
      fontSize: 13,
      marginTop: 3,
      marginBottom: 17,
    },

    serviceContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },

    serviceButton: {
      flex: 1,
      height: 54,
      borderRadius: 17,
      borderWidth: 1.5,
      borderColor:
        COLORS.primary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      backgroundColor:
        COLORS.white,
    },

    serviceSelected: {
      backgroundColor:
        COLORS.primary,
    },

    serviceText: {
      color: COLORS.primary,
      fontWeight: '800',
      fontSize: 14,
    },

    serviceTextSelected: {
      color: COLORS.white,
    },

    loader: {
      paddingVertical: 70,
      alignItems: 'center',
    },

    loaderText: {
      marginTop: 12,
      color: COLORS.gray,
    },

    dishCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      padding: 18,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#E5ECE5',
      elevation: 2,
    },

    dishHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 17,
    },

    dishNumber: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor:
        '#E5F3E7',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },

    dishNumberText: {
      color: COLORS.primary,
      fontWeight: '900',
    },

    dishTitle: {
      color: COLORS.text,
      fontSize: 17,
      fontWeight: '800',
    },

    inputLabel: {
      color: COLORS.text,
      fontWeight: '700',
      fontSize: 13,
      marginBottom: 7,
    },

    input: {
      minHeight: 52,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#DDE6DE',
      paddingHorizontal: 15,
      backgroundColor: '#FAFCFA',
      color: COLORS.text,
      fontSize: 14,
      marginBottom: 15,
    },

    descriptionInput: {
      minHeight: 82,
      paddingTop: 14,
      textAlignVertical: 'top',
      marginBottom: 0,
    },

    saveButton: {
      height: 58,
      borderRadius: 18,
      backgroundColor:
        COLORS.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      marginTop: 5,
    },

    saveButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '800',
    },

    publishButton: {
      height: 58,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor:
        COLORS.primary,
      backgroundColor:
        COLORS.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      marginTop: 12,
    },

    publishButtonText: {
      color: COLORS.primary,
      fontSize: 16,
      fontWeight: '800',
    },

    disabledButton: {
      opacity: 0.55,
    },
  });