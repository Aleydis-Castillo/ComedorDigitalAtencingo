import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';

interface StatusCardProps {
  breakfastAvailable: boolean;
  lunchAvailable: boolean;
  orderMade: boolean;
}

export default function StatusCard({
  breakfastAvailable,
  lunchAvailable,
  orderMade,
}: StatusCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Estado de hoy</Text>

      <View style={styles.row}>
        <Text style={styles.icon}>🍳</Text>
        <Text style={styles.text}>
          Desayuno {breakfastAvailable ? 'disponible' : 'no disponible'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.icon}>🍽️</Text>
        <Text style={styles.text}>
          Comida {lunchAvailable ? 'disponible' : 'no disponible'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.icon}>📦</Text>
        <Text
          style={[
            styles.text,
            {
              color: orderMade ? COLORS.success : COLORS.warning,
              fontWeight: 'bold',
            },
          ]}
        >
          {orderMade ? 'Pedido realizado' : 'Pedido pendiente'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    elevation: 3,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  icon: {
    fontSize: 20,
    width: 30,
  },

  text: {
    fontSize: 16,
    color: COLORS.text,
  },
});