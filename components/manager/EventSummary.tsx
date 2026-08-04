import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

interface Props {
  total: number;
  active: number;
  nextEvent: string;
  people: number;
}

interface SummaryItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string | number;
}

function SummaryItem({
  icon,
  label,
  value,
}: SummaryItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

export default function EventSummary({
  total,
  active,
  nextEvent,
  people,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Resumen de eventos
      </Text>

      <View style={styles.row}>
        <SummaryItem
          icon="calendar-multiple"
          label="Total"
          value={total}
        />

        <SummaryItem
          icon="check-circle-outline"
          label="Activos"
          value={active}
        />
      </View>

      <View style={styles.row}>
        <SummaryItem
          icon="calendar-clock"
          label="Próximo"
          value={nextEvent}
        />

        <SummaryItem
          icon="account-group-outline"
          label="Personas"
          value={people}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 22,

    borderWidth: 1,
    borderColor: '#E3EAE4',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 18,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  item: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    borderRadius: 18,
    paddingVertical: 18,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#E7F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 5,
  },

  value: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
});