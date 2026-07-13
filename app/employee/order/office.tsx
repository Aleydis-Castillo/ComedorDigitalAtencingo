import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';
import { officeAreas } from '../../../constants/officeAreas';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import OfficeCard from '../../../components/order/OfficeCard';

import { useOrder } from '../../../context/OrderContext';

export default function OfficeScreen() {

  const {
    officeArea,
    setOfficeArea,
  } = useOrder();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.step}>
        Paso 4 de 7
      </Text>

      <Text style={styles.title}>
        ¿A qué área deseas enviar tu pedido?
      </Text>

      <Text style={styles.subtitle}>
        Selecciona tu área de trabajo.
      </Text>

      <View style={styles.grid}>
        {officeAreas.map((area) => (
          <OfficeCard
            key={area.id}
            icon={area.icon}
            name={area.name}
            selected={officeArea === area.name}
            onPress={() => setOfficeArea(area.name)}
          />
        ))}
      </View>

      <PrimaryButton
        title="Continuar"
        disabled={!officeArea}
        onPress={() => {
          router.push('/employee/order/obsservation');
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
  },

  step: {
    color: COLORS.gray,
    fontSize: 16,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 25,
    color: COLORS.gray,
    fontSize: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

});