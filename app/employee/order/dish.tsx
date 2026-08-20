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
import DishCard from '../../../components/order/DishCard';
import StepHeader from '../../../components/order/StepHeader';

import { COLORS } from '../../../constants/colors';
import { useOrder } from '../../../context/OrderContext';

import { getMenu } from '../../../services/menuApi';

import {
  FrontendDayKey,
  FrontendDish,
  mapApiMenuToWeeklyMenu,
} from '../../../services/menuMapper';

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

export default function DishScreen() {
  const {
    foodType,
    dish,
    dishId,
    setDish,
    setDishId,
  } = useOrder();

  const [dishes, setDishes] =
    useState<FrontendDish[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const currentDayKey = useMemo(
    () => getCurrentDayKey(),
    [],
  );

  const serviceName =
    foodType === 'breakfast'
      ? 'Desayuno'
      : foodType === 'lunch'
        ? 'Comida'
        : 'Servicio';

  const loadDishes = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setIsLoading(true);
        }

        if (!foodType) {
          setDishes([]);
          return;
        }

        if (!currentDayKey) {
          setDishes([]);
          setDish(null);
          setDishId(null);
          return;
        }

        const apiMenu = await getMenu();

        const weeklyMenu =
          mapApiMenuToWeeklyMenu(
            apiMenu,
            true,
          );

        const todayMenu =
          weeklyMenu[currentDayKey];

        const availableDishes =
          foodType === 'breakfast'
            ? todayMenu.breakfast
            : todayMenu.lunch;

        setDishes(availableDishes);

        /*
         * Si el platillo seleccionado ya no existe
         * o dejó de estar disponible, limpiamos la selección.
         */
        if (
          dishId &&
          !availableDishes.some(
            item => item.id === dishId,
          )
        ) {
          setDish(null);
          setDishId(null);
        }
      } catch (error) {
        console.error(
          'Error al consultar los platillos:',
          error,
        );

        setDishes([]);
        setDish(null);
        setDishId(null);

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
      dishId,
      foodType,
      setDish,
      setDishId,
    ],
  );

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  const getDishIcon = (
    dishName: string,
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    const normalizedName =
      dishName.toLowerCase();

    if (
      normalizedName.includes('pollo') ||
      normalizedName.includes('pierna')
    ) {
      return 'food-drumstick-outline';
    }

    if (
      normalizedName.includes('carne') ||
      normalizedName.includes('res') ||
      normalizedName.includes('bistec')
    ) {
      return 'food-steak';
    }

    if (
      normalizedName.includes('pescado') ||
      normalizedName.includes('atún')
    ) {
      return 'fish';
    }

    if (
      normalizedName.includes('taco') ||
      normalizedName.includes('tacos')
    ) {
      return 'taco';
    }

    if (
      normalizedName.includes('pasta') ||
      normalizedName.includes('espagueti')
    ) {
      return 'pasta';
    }

    if (
      normalizedName.includes('sopa') ||
      normalizedName.includes('caldo') ||
      normalizedName.includes('pozole')
    ) {
      return 'pot-steam-outline';
    }

    if (
      normalizedName.includes('huevo') ||
      normalizedName.includes('huevos')
    ) {
      return 'egg-fried';
    }

    if (
      normalizedName.includes('ensalada') ||
      normalizedName.includes('verdura')
    ) {
      return 'leaf';
    }

    if (
      normalizedName.includes('sandwich') ||
      normalizedName.includes('sándwich')
    ) {
      return 'food';
    }

    if (
      normalizedName.includes('chilaquil') ||
      normalizedName.includes('enchilada')
    ) {
      return 'food-variant';
    }

    return 'silverware-fork-knife';
  };

  const handleSelectDish = (
    selectedDish: FrontendDish,
  ) => {
    const isSelected =
      dishId === selectedDish.id;

    if (isSelected) {
      setDish(null);
      setDishId(null);
      return;
    }

    setDish(selectedDish.name);
    setDishId(selectedDish.id);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDishes(false);
  };

  const handleContinue = () => {
    if (!dish || !dishId) {
      Alert.alert(
        'Selecciona un platillo',
        'Elige uno de los platillos disponibles para continuar.',
      );

      return;
    }

    router.push('/employee/order/delivery');
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
            Consultando los platillos disponibles...
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
          title="Selecciona tu platillo"
          subtitle="Elige una opción disponible del menú."
          step={2}
          totalSteps={5}
        />

        <View style={styles.menuSummary}>
          <View style={styles.menuIconContainer}>
            <MaterialCommunityIcons
              name={
                foodType === 'breakfast'
                  ? 'coffee-outline'
                  : 'silverware-fork-knife'
              }
              size={24}
              color="#268A4B"
            />
          </View>

          <View style={styles.menuSummaryContent}>
            <Text style={styles.menuLabel}>
              Menú publicado de hoy
            </Text>

            <Text style={styles.serviceName}>
              {serviceName}
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>
              {dishes.length}
            </Text>

            <Text style={styles.countText}>
              {dishes.length === 1
                ? 'opción'
                : 'opciones'}
            </Text>
          </View>
        </View>

        {dishes.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>
              Platillos disponibles
            </Text>

            {dishes.map(item => (
              <DishCard
                key={item.id}
                name={item.name}
                description={item.description}
                icon={getDishIcon(item.name)}
                available={item.available}
                selected={dishId === item.id}
                onPress={() =>
                  handleSelectDish(item)
                }
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons
                name="food-off-outline"
                size={38}
                color="#7A7F87"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No hay platillos disponibles
            </Text>

            <Text style={styles.emptyText}>
              No existe un menú publicado con opciones para
              este servicio en el día de hoy.
            </Text>
          </View>
        )}

        {!currentDayKey && (
          <View style={styles.weekendNotice}>
            <MaterialCommunityIcons
              name="calendar-remove-outline"
              size={23}
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
            disabled={!dishId}
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
    top: -75,
    right: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E7F3E9',
  },

  decorativeCircleTwo: {
    position: 'absolute',
    bottom: 80,
    left: -95,
    width: 185,
    height: 185,
    borderRadius: 93,
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

  menuSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E9E7',
    elevation: 2,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#E3F3E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuSummaryContent: {
    flex: 1,
    marginLeft: 13,
  },

  menuLabel: {
    color: '#7A7F87',
    fontSize: 13,
    fontWeight: '600',
  },

  serviceName: {
    marginTop: 2,
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '800',
  },

  countBadge: {
    alignItems: 'center',
    backgroundColor: '#EDF8F0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  countNumber: {
    color: '#268A4B',
    fontSize: 18,
    fontWeight: '900',
  },

  countText: {
    color: '#477257',
    fontSize: 10,
    fontWeight: '700',
  },

  sectionTitle: {
    marginBottom: 13,
    color: '#374151',
    fontSize: 16,
    fontWeight: '800',
  },

  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#F0F1F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 15,
    color: '#4B5563',
    fontSize: 18,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 8,
    color: '#7A7F87',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  weekendNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3DF',
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginTop: 18,
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
    paddingTop: 15,
  },
});