import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <StepHeader
        title="¿Qué deseas pedir hoy?"
        subtitle="Selecciona el tipo de servicio."
        step={1}
        totalSteps={5}
      />

      <FoodTypeCard
        icon="🍳"
        title="Desayuno"
        subtitle="Horario: 7:00 a.m. - 10:00 a.m."
        selected={foodType === 'breakfast'}
        onPress={() => setFoodType('breakfast')}
      />

      <FoodTypeCard
        icon="🍽️"
        title="Comida"
        subtitle="Horario: 3:00 p.m. - 5:00 p.m."
        selected={foodType === 'lunch'}
        onPress={() => setFoodType('lunch')}
      />

      <PrimaryButton
        title="Continuar"
        disabled={!foodType}
        onPress={() => router.push('/employee/order/dish')}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    flexGrow: 1,
  },

});