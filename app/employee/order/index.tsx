import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import FoodTypeCard from '../../../components/order/FoodTypeCard';

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
    >

      <Text style={styles.step}>
        Paso 1 de 6
      </Text>

      <Text style={styles.title}>
        ¿Qué deseas pedir hoy?
      </Text>

      <Text style={styles.subtitle}>
        Selecciona el tipo de servicio.
      </Text>

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
        onPress={() => {
          router.push('/employee/order/dish');
        }}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:COLORS.background,
  },

  content:{
    padding:20,
    paddingTop:50,
    paddingBottom:40,
  },

  step:{
    color:COLORS.gray,
    fontSize:16,
    marginBottom:10,
  },

  title:{
    fontSize:30,
    fontWeight:'bold',
    color:COLORS.primary,
  },

  subtitle:{
    marginTop:8,
    marginBottom:30,
    color:COLORS.gray,
    fontSize:16,
  },

});