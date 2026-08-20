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

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    router,
} from 'expo-router';

import { COLORS } from '../../constants/colors';
import { API_URL } from '../../services/api';

type ServiceType =
  | 'BREAKFAST'
  | 'LUNCH';

interface DishItem {
  id: string;
  name: string;
  description: string | null;
  service: ServiceType;
  position: number;
  available: boolean;
}

interface MenuDayResponse {
  id: string;
  date: string;
  published: boolean;
  dishes: DishItem[];
}

function getCurrentDate() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function TabletOrderScreen() {
  const [
    service,
    setService,
  ] =
    useState<ServiceType>(
      'BREAKFAST',
    );

  const [
    dishes,
    setDishes,
  ] = useState<DishItem[]>([]);

  const [
    selectedDish,
    setSelectedDish,
  ] =
    useState<DishItem | null>(
      null,
    );

  const [
    observations,
    setObservations,
  ] = useState('');

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const currentDate =
    useMemo(
      () => getCurrentDate(),
      [],
    );

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu =
    async () => {
      try {
        setIsLoading(true);

        const response =
          await fetch(
            `${API_URL}/menu?startDate=${currentDate}&endDate=${currentDate}`,
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

          throw new Error(
            message,
          );
        }

        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {
          setDishes([]);

          return;
        }

        const menuDay =
          data[0];

        if (
          !menuDay ||
          !menuDay.published
        ) {
          setDishes([]);

          return;
        }

        setDishes(
          menuDay.dishes.filter(
            dish =>
              dish.available,
          ),
        );
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
      } finally {
        setIsLoading(false);
      }
    };

  const serviceDishes =
    dishes.filter(
      dish =>
        dish.service ===
        service,
    );

  const handleServiceChange =
    (
      nextService:
        ServiceType,
    ) => {
      setService(
        nextService,
      );

      /*
       * Quitamos el platillo anterior
       * para evitar que quede seleccionado
       * un desayuno al cambiar a comida.
       */
      setSelectedDish(null);
    };

  const handleContinue =
    () => {
      if (!selectedDish) {
        Alert.alert(
          'Selecciona un platillo',
          'Elige el platillo que deseas ordenar.',
        );

        return;
      }

      router.push({
        pathname:
          '/tablet/identify',

        params: {
          dishId:
            selectedDish.id,

          dishName:
            selectedDish.name,

          service,

          observations:
            observations.trim(),
        },
      });
    };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              router.back()
            }
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={27}
              color={
                COLORS.text
              }
            />
          </TouchableOpacity>

          <View
            style={
              styles.headerText
            }
          >
            <Text
              style={
                styles.stepText
              }
            >
              Pedido rápido
            </Text>

            <Text
              style={
                styles.title
              }
            >
              ¿Qué deseas ordenar?
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Selecciona el servicio y tu platillo.
            </Text>
          </View>
        </View>

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
              handleServiceChange(
                'BREAKFAST',
              )
            }
          >
            <View
              style={[
                styles.serviceIcon,

                service ===
                  'BREAKFAST' &&
                  styles.serviceIconSelected,
              ]}
            >
              <MaterialCommunityIcons
                name="coffee-outline"
                size={30}
                color={
                  service ===
                  'BREAKFAST'
                    ? COLORS.primary
                    : COLORS.gray
                }
              />
            </View>

            <Text
              style={[
                styles.serviceTitle,

                service ===
                  'BREAKFAST' &&
                  styles.serviceTitleSelected,
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
              handleServiceChange(
                'LUNCH',
              )
            }
          >
            <View
              style={[
                styles.serviceIcon,

                service ===
                  'LUNCH' &&
                  styles.serviceIconSelected,
              ]}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={30}
                color={
                  service ===
                  'LUNCH'
                    ? COLORS.primary
                    : COLORS.gray
                }
              />
            </View>

            <Text
              style={[
                styles.serviceTitle,

                service ===
                  'LUNCH' &&
                  styles.serviceTitleSelected,
              ]}
            >
              Comida
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          Platillos disponibles
        </Text>

        {isLoading ? (
          <View
            style={styles.loader}
          >
            <ActivityIndicator
              size="large"
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.loaderText
              }
            >
              Cargando menú...
            </Text>
          </View>
        ) : serviceDishes.length ===
          0 ? (
          <View
            style={
              styles.emptyCard
            }
          >
            <MaterialCommunityIcons
              name="food-off-outline"
              size={50}
              color="#9AA2AE"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              Sin platillos disponibles
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              El menú de este servicio todavía no está disponible.
            </Text>
          </View>
        ) : (
          serviceDishes.map(
            dish => {
              const selected =
                selectedDish?.id ===
                dish.id;

              return (
                <TouchableOpacity
                  key={dish.id}
                  activeOpacity={
                    0.85
                  }
                  style={[
                    styles.dishCard,

                    selected &&
                      styles.dishCardSelected,
                  ]}
                  onPress={() =>
                    setSelectedDish(
                      dish,
                    )
                  }
                >
                  <View
                    style={
                      styles.dishIcon
                    }
                  >
                    <MaterialCommunityIcons
                      name="food-outline"
                      size={30}
                      color={
                        selected
                          ? COLORS.white
                          : COLORS.primary
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.dishContent
                    }
                  >
                    <Text
                      style={[
                        styles.dishName,

                        selected &&
                          styles.dishNameSelected,
                      ]}
                    >
                      {dish.name}
                    </Text>

                    {!!dish.description && (
                      <Text
                        style={[
                          styles.dishDescription,

                          selected &&
                            styles.dishDescriptionSelected,
                        ]}
                      >
                        {
                          dish.description
                        }
                      </Text>
                    )}
                  </View>

                  <MaterialCommunityIcons
                    name={
                      selected
                        ? 'check-circle'
                        : 'circle-outline'
                    }
                    size={27}
                    color={
                      selected
                        ? COLORS.white
                        : '#A2AAA4'
                    }
                  />
                </TouchableOpacity>
              );
            },
          )
        )}

        <Text
          style={
            styles.sectionTitle
          }
        >
          ¿Deseas agregar algo?
        </Text>

        <View
          style={
            styles.observationCard
          }
        >
          <MaterialCommunityIcons
            name="message-text-outline"
            size={25}
            color={
              COLORS.primary
            }
            style={
              styles.observationIcon
            }
          />

          <TextInput
            value={
              observations
            }
            onChangeText={
              setObservations
            }
            placeholder="Ej. Sin cebolla, agregar huevo..."
            placeholderTextColor={
              COLORS.gray
            }
            multiline
            maxLength={250}
            style={
              styles.observationInput
            }
          />
        </View>

        <Text
          style={
            styles.optionalText
          }
        >
          Este campo es opcional.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.continueButton,

            !selectedDish &&
              styles.continueButtonDisabled,
          ]}
          onPress={
            handleContinue
          }
        >
          <Text
            style={
              styles.continueText
            }
          >
            Continuar
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={26}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: 35,
    paddingTop: 45,
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },

  backButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor:
      COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 17,
    elevation: 2,
  },

  headerText: {
    flex: 1,
  },

  stepText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },

  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 6,
    color: COLORS.gray,
    fontSize: 16,
  },

  serviceContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 32,
  },

  serviceButton: {
    flex: 1,
    minHeight: 120,
    borderRadius: 24,
    backgroundColor:
      COLORS.white,
    borderWidth: 2,
    borderColor: '#E2E8E3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  serviceSelected: {
    borderColor:
      COLORS.primary,
    backgroundColor:
      '#EAF5EC',
  },

  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor:
      '#F3F5F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  serviceIconSelected: {
    backgroundColor:
      COLORS.white,
  },

  serviceTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },

  serviceTitleSelected: {
    color: COLORS.primary,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 14,
  },

  loader: {
    paddingVertical: 50,
    alignItems: 'center',
  },

  loaderText: {
    marginTop: 12,
    color: COLORS.gray,
  },

  emptyCard: {
    backgroundColor:
      COLORS.white,
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  emptyTitle: {
    marginTop: 12,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 6,
    color: COLORS.gray,
    textAlign: 'center',
  },

  dishCard: {
    minHeight: 95,
    backgroundColor:
      COLORS.white,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E3E9E4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    marginBottom: 13,
  },

  dishCardSelected: {
    backgroundColor:
      COLORS.primary,
    borderColor:
      COLORS.primary,
  },

  dishIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor:
      '#EAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  dishContent: {
    flex: 1,
    paddingRight: 10,
  },

  dishName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
  },

  dishNameSelected: {
    color: COLORS.white,
  },

  dishDescription: {
    marginTop: 5,
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 18,
  },

  dishDescriptionSelected: {
    color: '#E0EFE2',
  },

  observationCard: {
    minHeight: 100,
    borderRadius: 20,
    backgroundColor:
      COLORS.white,
    borderWidth: 1,
    borderColor: '#DDE5DE',
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  observationIcon: {
    marginTop: 4,
    marginRight: 10,
  },

  observationInput: {
    flex: 1,
    minHeight: 80,
    color: COLORS.text,
    fontSize: 15,
    textAlignVertical: 'top',
  },

  optionalText: {
    marginTop: 7,
    color: COLORS.gray,
    fontSize: 12,
  },

  continueButton: {
    minHeight: 66,
    borderRadius: 21,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 30,
  },

  continueButtonDisabled: {
    opacity: 0.55,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});