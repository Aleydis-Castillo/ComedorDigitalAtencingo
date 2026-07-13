import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}

export default function FoodTypeCard({
  icon,
  title,
  subtitle,
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
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 3,
  },

  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF7EC',
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  icon: {
    fontSize: 34,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 8,
    color: COLORS.gray,
    textAlign: 'center',
  },
});