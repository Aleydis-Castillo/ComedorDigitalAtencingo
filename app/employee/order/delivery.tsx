import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';

import { router } from 'expo-router';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import DeliveryCard from '../../../components/order/DeliveryCard';

import { COLORS } from '../../../constants/colors';

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
    >
      <Text style={styles.step}>
        Paso 3 de 7
      </Text>

      <Text style={styles.title}>
        ¿Dónde deseas recibir tu pedido?
      </Text>

      <Text style={styles.subtitle}>
        Selecciona una opción.
      </Text>

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
  },

  step: {
    color: COLORS.gray,
    marginBottom: 10,
    fontSize: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    color: COLORS.gray,
    marginTop: 8,
    marginBottom: 30,
    fontSize: 16,
  },
});