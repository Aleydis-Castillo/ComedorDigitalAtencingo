import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';
import { weeklyMenu } from '../../../constants/mockData';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import DishCard from '../../../components/order/DishCard';
import StepHeader from '../../../components/order/StepHeader';

import { useOrder } from '../../../context/OrderContext';

export default function DishScreen() {

  const {
    foodType,
    dish,
    setDish,
  } = useOrder();

  const todayMenu = weeklyMenu.LUN;

  const dishes =
    foodType === 'breakfast'
      ? todayMenu.breakfast
      : todayMenu.lunch;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <StepHeader
        title="Selecciona tu platillo"
        subtitle="Elige una opción del menú disponible."
        step={2}
        totalSteps={5}
      />

      {dishes.map((item) => (
        <DishCard
          key={item.id}
          name={item.name}
          description={item.description}
          selected={dish === item.name}
          onPress={() => setDish(item.name)}
        />
      ))}

      <PrimaryButton
        title="Continuar"
        disabled={!dish}
        onPress={() => router.push('/employee/order/delivery')}
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