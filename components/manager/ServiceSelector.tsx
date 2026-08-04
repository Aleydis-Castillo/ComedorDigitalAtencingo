import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

export type ServiceType = 'Desayuno' | 'Comida';

interface Props {
  value: ServiceType;
  onChange: (service: ServiceType) => void;
  disabled?: boolean;
}

export default function ServiceSelector({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.card,
          value === 'Desayuno' && styles.selectedCard,
          disabled && styles.disabledCard,
        ]}
        onPress={() => onChange('Desayuno')}
      >
        <MaterialCommunityIcons
          name="coffee"
          size={32}
          color={
            value === 'Desayuno'
              ? COLORS.white
              : COLORS.primary
          }
        />

        <Text
          style={[
            styles.title,
            value === 'Desayuno' && styles.selectedText,
          ]}
        >
          Desayuno
        </Text>

        <Text
          style={[
            styles.subtitle,
            value === 'Desayuno' && styles.selectedSubtitle,
          ]}
        >
          Servicio matutino
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.card,
          value === 'Comida' && styles.selectedCard,
          disabled && styles.disabledCard,
        ]}
        onPress={() => onChange('Comida')}
      >
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={32}
          color={
            value === 'Comida'
              ? COLORS.white
              : COLORS.primary
          }
        />

        <Text
          style={[
            styles.title,
            value === 'Comida' && styles.selectedText,
          ]}
        >
          Comida
        </Text>

        <Text
          style={[
            styles.subtitle,
            value === 'Comida' && styles.selectedSubtitle,
          ]}
        >
          Servicio principal
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },

  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E4EAE5',
    paddingVertical: 22,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  selectedCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  disabledCard: {
    opacity: 0.6,
  },

  title: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },

  selectedText: {
    color: COLORS.white,
  },

  selectedSubtitle: {
    color: '#E8F5E9',
  },
});