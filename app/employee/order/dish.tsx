import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';
import { weeklyMenu } from '../../../constants/mockData';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import DishCard from '../../../components/order/DishCard';

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
    >

      <Text style={styles.step}>
        Paso 2 de 6
      </Text>

      <Text style={styles.title}>
        Selecciona tu platillo
      </Text>

      <Text style={styles.subtitle}>
        Elige una opción.
      </Text>

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
        onPress={() => {
          router.push('/employee/order/delivery');
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