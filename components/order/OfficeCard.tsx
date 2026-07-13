import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  icon: string;
  name: string;
  selected: boolean;
  onPress: () => void;
}

export default function OfficeCard({
  icon,
  name,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.icon}>
        {icon}
      </Text>

      <Text style={styles.name}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 3,
  },

  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF7EC',
  },

  icon: {
    fontSize: 30,
    marginBottom: 10,
  },

  name: {
    textAlign: 'center',
    fontWeight: '600',
    color: COLORS.text,
  },
});