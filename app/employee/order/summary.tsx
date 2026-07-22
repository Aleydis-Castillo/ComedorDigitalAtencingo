import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';

import StepHeader from '../../../components/order/StepHeader';
import Ticket from '../../../components/order/Ticket';

export default function SummaryScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StepHeader
        title="Confirma tu pedido"
        subtitle="Verifica la información antes de confirmar."
        step={7}
        totalSteps={8}
      />

      <Ticket
        onConfirm={() => {
          router.push('/employee/order/fingerprint');
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
});