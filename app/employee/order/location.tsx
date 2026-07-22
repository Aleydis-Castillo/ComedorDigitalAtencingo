import React, { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';
import { officeLocations } from '../../../constants/officeLocations';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import StepHeader from '../../../components/order/StepHeader';
import SuggestionChip from '../../../components/order/SuggestionChip';

import { useOrder } from '../../../context/OrderContext';

export default function LocationScreen() {
  const {
    zone,
    location,
    setLocation,
  } = useOrder();

  const suggestions = useMemo(() => {
    if (!zone) return [];

    if (zone === 'Fábrica') {
      return officeLocations.factory;
    }

    if (zone === 'Administración') {
      return officeLocations.administration;
    }

    return officeLocations.field;
  }, [zone]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StepHeader
        title="Ubicación de entrega"
        subtitle="Indica el lugar exacto donde deseas recibir tu pedido."
        step={5}
        totalSteps={8}
      />

      <View style={styles.card}>
        <Text style={styles.label}>
          Zona seleccionada
        </Text>

        <Text style={styles.zone}>
          {zone}
        </Text>
      </View>

      <Text style={styles.label}>
        Escribe la ubicación
      </Text>

      <TextInput
        placeholder="Ej. Elaboración"
        placeholderTextColor={COLORS.gray}
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Text style={styles.label}>
        Ubicaciones frecuentes
      </Text>
      <View style={styles.suggestions}>
  {suggestions.map((item) => (
    <SuggestionChip
      key={item}
      label={item}
      onPress={() => setLocation(item)}
    />
  ))}
</View>

<PrimaryButton
  title="Continuar"
  disabled={!location.trim()}
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
    flexGrow: 1,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },

  zone: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 24,
  },

  suggestions: {
    marginBottom: 30,
  },
});