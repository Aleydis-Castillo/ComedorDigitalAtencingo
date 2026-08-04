import React, {
  useEffect,
  useMemo,
} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import FoodTypeCard from '../../../components/order/FoodTypeCard';
import StepHeader from '../../../components/order/StepHeader';

import { useOrder } from '../../../context/OrderContext';

export default function OrderScreen() {
  const {
    foodType,
    setFoodType,
  } = useOrder();

  /*
   * DATOS TEMPORALES
   *
   * Después estos valores vendrán desde la API y PostgreSQL.
   * Un servicio estará disponible cuando tenga un menú activo
   * y al menos un platillo disponible.
   */
  const serviceAvailability = useMemo(
    () => ({
      breakfast: true,
      lunch: false,
    }),
    [],
  );

  /*
   * Seleccionamos automáticamente el único servicio disponible.
   *
   * Cuando ambos estén disponibles, el usuario podrá escoger
   * cualquiera de los dos.
   */
  useEffect(() => {
    const availableServices = [
      serviceAvailability.breakfast ? 'breakfast' : null,
      serviceAvailability.lunch ? 'lunch' : null,
    ].filter(Boolean);

    if (availableServices.length === 1) {
      setFoodType(
        availableServices[0] as 'breakfast' | 'lunch',
      );
      return;
    }

    if (
      foodType === 'breakfast' &&
      !serviceAvailability.breakfast
    ) {
      setFoodType(null);
    }

    if (
      foodType === 'lunch' &&
      !serviceAvailability.lunch
    ) {
      setFoodType(null);
    }
  }, [
    foodType,
    serviceAvailability,
    setFoodType,
  ]);

  const hasAvailableService =
    serviceAvailability.breakfast ||
    serviceAvailability.lunch;

  const validSelection =
    (foodType === 'breakfast' &&
      serviceAvailability.breakfast) ||
    (foodType === 'lunch' &&
      serviceAvailability.lunch);

  const handleContinue = () => {
    if (!validSelection) {
      return;
    }

    router.push('/employee/order/dish');
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
            La disponibilidad depende del menú y de los
            platillos registrados por el comedor.
          </Text>
        </View>

        <FoodTypeCard
          icon="coffee-outline"
          title="Desayuno"
          available={serviceAvailability.breakfast}
          selected={foodType === 'breakfast'}
          unavailableText="Servicio finalizado"
          onPress={() => setFoodType('breakfast')}
        />

        <FoodTypeCard
          icon="silverware-fork-knife"
          title="Comida"
          available={serviceAvailability.lunch}
          selected={foodType === 'lunch'}
          unavailableText="Disponible próximamente"
          onPress={() => setFoodType('lunch')}
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
              El comedor todavía no ha registrado platillos
              disponibles para realizar pedidos.
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

  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 14,
  },
});