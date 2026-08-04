import React from 'react';

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
import DeliveryCard from '../../../components/order/DeliveryCard';
import StepHeader from '../../../components/order/StepHeader';

import { useOrder } from '../../../context/OrderContext';

export default function DeliveryScreen() {
  const {
    deliveryType,
    setDeliveryType,
  } = useOrder();

  const handleContinue = () => {
    if (!deliveryType) {
      return;
    }

    if (deliveryType === 'office') {
      router.push('/employee/order/office');
      return;
    }

    router.push('/employee/order/obsservation');
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
          title="¿Dónde deseas recibir tu pedido?"
          subtitle="Selecciona la modalidad de entrega."
          step={3}
          totalSteps={5}
        />

        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="map-marker-path"
              size={21}
              color="#3569A8"
            />
          </View>

          <Text style={styles.infoText}>
            La ruta del pedido cambiará según el lugar que
            selecciones.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Opciones de entrega
        </Text>

        <DeliveryCard
          icon="silverware-fork-knife"
          title="Recoger en comedor"
          description="Recoge tu pedido directamente en el comedor cuando esté listo."
          helperText="No será necesario indicar una ubicación."
          selected={deliveryType === 'cafeteria'}
          onPress={() => setDeliveryType('cafeteria')}
        />

        <DeliveryCard
          icon="office-building-marker-outline"
          title="Entrega en oficina"
          description="Recibe tu pedido directamente en tu área de trabajo."
          helperText="En los siguientes pasos indicarás tu zona y ubicación."
          selected={deliveryType === 'office'}
          onPress={() => setDeliveryType('office')}
        />

        {deliveryType && (
          <View style={styles.selectionSummary}>
            <MaterialCommunityIcons
              name="check-circle"
              size={21}
              color="#268A4B"
            />

            <View style={styles.selectionSummaryContent}>
              <Text style={styles.selectionSummaryLabel}>
                Modalidad seleccionada
              </Text>

              <Text style={styles.selectionSummaryValue}>
                {deliveryType === 'cafeteria'
                  ? 'Recoger en comedor'
                  : 'Entrega en oficina'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continuar"
            disabled={!deliveryType}
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
    bottom: 85,
    left: -95,
    width: 185,
    height: 185,
    borderRadius: 93,
    backgroundColor: '#FFF0DF',
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF5FC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 23,
    borderWidth: 1,
    borderColor: '#DCEAF8',
  },

  infoIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
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

  sectionTitle: {
    marginBottom: 13,
    color: '#374151',
    fontSize: 16,
    fontWeight: '800',
  },

  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 14,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#DCE9DF',
  },

  selectionSummaryContent: {
    flex: 1,
    marginLeft: 10,
  },

  selectionSummaryLabel: {
    color: '#7A7F87',
    fontSize: 11,
    fontWeight: '600',
  },

  selectionSummaryValue: {
    marginTop: 2,
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
  },

  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
});