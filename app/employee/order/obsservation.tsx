import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import StepHeader from '../../../components/order/StepHeader';

import { useOrder } from '../../../context/OrderContext';

export default function ObservationScreen() {

  const {
    observations,
    setObservations,
  } = useOrder();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StepHeader
        title="Observaciones"
        subtitle="Si deseas modificar tu platillo, escríbelo aquí. Este paso es opcional."
        step={6}
        totalSteps={8}
      />

      <Text style={styles.label}>
        Indicaciones para cocina
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. Sin cebolla y con un huevo extra."
        placeholderTextColor={COLORS.gray}
        multiline
        maxLength={150}
        value={observations}
        onChangeText={setObservations}
        textAlignVertical="top"
      />

      <Text style={styles.counter}>
        {observations.length}/150 caracteres
      </Text>

      <PrimaryButton
        title="Continuar"
        onPress={() => {
          router.push('/employee/order/summary');
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

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    minHeight: 140,
    fontSize: 16,
    marginBottom: 8,
  },

  counter: {
    textAlign: 'right',
    color: COLORS.gray,
    marginBottom: 30,
  },
});