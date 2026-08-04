import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '../../constants/colors';

interface Props {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export default function ManagerHeader({
  title,
  subtitle,
  showBackButton = true,
}: Props) {
  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={COLORS.text}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="chef-hat"
          size={28}
          color={COLORS.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  placeholder: {
    width: 48,
  },

  textContainer: {
    flex: 1,
    marginHorizontal: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.gray,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#E6F3E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});