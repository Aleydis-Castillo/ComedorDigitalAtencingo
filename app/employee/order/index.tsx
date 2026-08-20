import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import FoodTypeCard from '../../../components/order/FoodTypeCard';
import StepHeader from '../../../components/order/StepHeader';

import { COLORS } from '../../../constants/colors';
import { useOrder } from '../../../context/OrderContext';

import { getMenu } from '../../../services/menuApi';

import {
  createEmptyWeeklyMenu,
  FrontendDayKey,
  mapApiMenuToWeeklyMenu,
} from '../../../services/menuMapper';

type FoodType = 'breakfast' | 'lunch';

interface ServiceAvailability {
  breakfast: boolean;
  lunch: boolean;
}

function getCurrentDayKey(): FrontendDayKey | null {
  const currentDay = new Date().getDay();

  switch (currentDay) {
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

export default function OrderScreen() {
  const {
    foodType,
    setFoodType,
  } = useOrder();

  const [serviceAvailability, setServiceAvailability] =
    useState<ServiceAvailability>({
      breakfast: false,
      lunch: false,
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const currentDayKey = useMemo(
    () => getCurrentDayKey(),
    [],
  );

  const loadAvailableServices = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setIsLoading(true);
        }

        const apiMenu = await getMenu();

        const weeklyMenu =
          mapApiMenuToWeeklyMenu(
            apiMenu,
            true,
          );

        if (!currentDayKey) {
          setServiceAvailability({
            breakfast: false,
            lunch: false,
          });

          setFoodType(null);
          return;
        }

        const currentMenu =
          weeklyMenu[currentDayKey] ??
          createEmptyWeeklyMenu()[currentDayKey];

        const availability = {
          breakfast:
            currentMenu.breakfast.length > 0,

          lunch:
            currentMenu.lunch.length > 0,
        };

        setServiceAvailability(availability);

        const availableServices: FoodType[] = [];

        if (availability.breakfast) {
          availableServices.push('breakfast');
        }

        if (availability.lunch) {
          availableServices.push('lunch');
        }

        /*
         * Si solamente hay un servicio disponible,
         * lo seleccionamos automáticamente.
         */
        if (availableServices.length === 1) {
          setFoodType(availableServices[0] ?? null);
          return;
        }

        /*
         * Quitamos una selección anterior si el servicio
         * dejó de estar disponible.
         */
        if (
          foodType === 'breakfast' &&
          !availability.breakfast
        ) {
          setFoodType(null);
        }

        if (
          foodType === 'lunch' &&
          !availability.lunch
        ) {
          setFoodType(null);
        }
      } catch (error) {
        console.error(
          'Error al consultar los servicios:',
          error,
        );

        setServiceAvailability({
          breakfast: false,
          lunch: false,
        });

        setFoodType(null);

        Alert.alert(
          'No fue posible cargar el menú',
          error instanceof Error
            ? error.message
            : 'Revisa la conexión con el servidor.',
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      currentDayKey,
      foodType,
      setFoodType,
    ],
  );

  useEffect(() => {
    loadAvailableServices();
  }, [loadAvailableServices]);

  const hasAvailableService =
    serviceAvailability.breakfast ||
    serviceAvailability.lunch;

  const validSelection =
    (foodType === 'breakfast' &&
      serviceAvailability.breakfast) ||
    (foodType === 'lunch' &&
      serviceAvailability.lunch);

  const handleSelectService = (
    service: FoodType,
  ) => {
    const isAvailable =
      serviceAvailability[service];

    if (!isAvailable) {
      return;
    }

    /*
     * Permite seleccionar y quitar la selección.
     */
    setFoodType(
      foodType === service
        ? null
        : service,
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAvailableServices(false);
  };

  const handleContinue = () => {
    if (!validSelection) {
      Alert.alert(
        'Selecciona un servicio',
        'Elige desayuno o comida para continuar.',
      );

      return;
    }

    router.push('/employee/order/dish');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.loadingText}>
            Consultando servicios disponibles...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <StepHeader
          title="¿Qué deseas pedir hoy?"
          subtitle="Selecciona uno de los servicios disponibles."
          step={1}
          totalSteps={5}
        />

        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#3569A8"
            />
          </View>

          <Text style={styles.infoText}>
            La disponibilidad depende del menú publicado
            y de los platillos registrados para hoy.
          </Text>
        </View>

        <FoodTypeCard
          icon="coffee-outline"
          title="Desayuno"
          available={
            serviceAvailability.breakfast
          }
          selected={
            foodType === 'breakfast'
          }
          unavailableText="Sin menú disponible"
          onPress={() =>
            handleSelectService('breakfast')
          }
        />

        <FoodTypeCard
          icon="silverware-fork-knife"
          title="Comida"
          available={
            serviceAvailability.lunch
          }
          selected={foodType === 'lunch'}
          unavailableText="Sin menú disponible"
          onPress={() =>
            handleSelectService('lunch')
          }
        />

        {!hasAvailableService && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="food-off-outline"
              size={34}
              color="#7A7F87"
            />

            <Text style={styles.emptyStateTitle}>
              No hay servicios disponibles
            </Text>

            <Text style={styles.emptyStateText}>
              No existe un menú publicado con platillos
              disponibles para el día de hoy.
            </Text>
          </View>
        )}

        {!currentDayKey && (
          <View style={styles.weekendNotice}>
            <MaterialCommunityIcons
              name="calendar-remove-outline"
              size={22}
              color="#9B691A"
            />

            <Text style={styles.weekendNoticeText}>
              El servicio del comedor funciona de lunes
              a sábado.
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continuar"
            disabled={!validSelection}
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    flexGrow: 1,
  },

  decorativeCircleOne: {
    position: 'absolute',
    top: -70,
    right: -65,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E7F3E9',
  },

  decorativeCircleTwo: {
    position: 'absolute',
    bottom: 90,
    left: -90,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFF0DF',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 14,
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5FC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#DCEAF8',
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DDEBFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  infoText: {
    flex: 1,
    color: '#4B6179',
    fontSize: 13,
    lineHeight: 19,
  },

  emptyState: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 24,
    marginBottom: 20,
  },

  emptyStateTitle: {
    marginTop: 10,
    color: '#4B5563',
    fontSize: 17,
    fontWeight: '800',
  },

  emptyStateText: {
    marginTop: 7,
    color: '#7A7F87',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  weekendNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3DF',
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F5DFB8',
  },

  weekendNoticeText: {
    flex: 1,
    marginLeft: 10,
    color: '#8A641F',
    fontSize: 13,
    lineHeight: 18,
  },

  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 14,
  },
});