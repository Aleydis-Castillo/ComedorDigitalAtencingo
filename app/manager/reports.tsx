import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
} from 'react-native';

import { COLORS } from '../../constants/colors';

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reportes semanales</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
});