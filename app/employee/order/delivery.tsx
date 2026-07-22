import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import DeliveryCard from '../../../components/order/DeliveryCard';
import StepHeader from '../../../components/order/StepHeader';

import { useOrder } from '../../../context/OrderContext';

export default function DeliveryScreen() {

  const {
    deliveryType,
    setDeliveryType,
  } = useOrder();

  function handleContinue() {
    if (deliveryType === 'office') {
      router.push('/employee/order/office');
    } else {
      router.push('/employee/order/obsservation');
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <StepHeader
        title="¿Dónde deseas recibir tu pedido?"
        subtitle="Selecciona el lugar de entrega."
        step={3}
        totalSteps={5}
      />

      <DeliveryCard
        icon="🍽️"
        title="Comedor"
        description="Consumiré mi alimento en el comedor."
        selected={deliveryType === 'cafeteria'}
        onPress={() => setDeliveryType('cafeteria')}
      />

      <DeliveryCard
        icon="🛵"
        title="Oficina"
        description="Enviar mi pedido a mi área de trabajo."
        selected={deliveryType === 'office'}
        onPress={() => setDeliveryType('office')}
      />

      <PrimaryButton
        title="Continuar"
        disabled={!deliveryType}
        onPress={handleContinue}
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