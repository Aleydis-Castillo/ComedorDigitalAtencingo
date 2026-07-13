import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  name: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function DishCard({
  name,
  description,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>🍽️</Text>

        <Text style={styles.name}>
          {name}
        </Text>
      </View>

      <Text style={styles.description}>
        {description}
      </Text>

      <View style={styles.footer}>
        <Text
          style={[
            styles.status,
            selected && styles.selectedStatus,
          ]}
        >
          {selected ? '✓ Seleccionado' : 'Seleccionar'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF7EC',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 26,
    marginRight: 12,
  },

  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  description: {
    marginTop: 12,
    color: COLORS.gray,
    fontSize: 15,
    lineHeight: 22,
  },

  footer: {
    marginTop: 18,
    alignItems: 'flex-end',
  },

  status: {
    color: COLORS.gray,
    fontWeight: '600',
  },

  selectedStatus: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

});