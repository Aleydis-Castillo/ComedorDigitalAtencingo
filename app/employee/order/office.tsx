import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';
import { officeAreas } from '../../../constants/officeAreas';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import OfficeCard from '../../../components/order/OfficeCard';
import StepHeader from '../../../components/order/StepHeader';

import { useOrder } from '../../../context/OrderContext';

export default function OfficeScreen() {
  const {
    zone,
    setZone,
  } = useOrder();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StepHeader
        title="Zona de entrega"
        subtitle="Selecciona la zona donde deseas recibir tu pedido."
        step={4}
        totalSteps={8}
      />

      <View style={styles.grid}>
        {officeAreas.map((area) => (
          <OfficeCard
            key={area.id}
            icon={area.icon}
            name={area.name}
            selected={zone === area.name}
            onPress={() => setZone(area.name)}
          />
        ))}
      </View>

      <PrimaryButton
        title="Continuar"
        disabled={!zone}
        onPress={() => {
          router.push('/employee/order/location');
        }}
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});