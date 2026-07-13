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
  onPress: () => void;
}

export default function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {icon}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 28,
  },

  info: {
    marginLeft: 18,
    flex: 1,
  },

  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 4,
    color: COLORS.gray,
    fontSize: 14,
  },

});