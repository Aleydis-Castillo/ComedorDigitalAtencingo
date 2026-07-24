import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export default function ActionCard({
  icon,
  title,
  subtitle,
  color,
  backgroundColor,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={31}
          color={color}
        />
      </View>

      <Text
        style={styles.title}
        numberOfLines={2}
      >
        {title}
      </Text>

      <Text
        style={styles.subtitle}
        numberOfLines={3}
      >
        {subtitle}
      </Text>

      <View
        style={[
          styles.arrowContainer,
          {
            backgroundColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={25}
          color={color}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#F0F0ED',
    paddingHorizontal: 10,
    paddingVertical: 17,
    alignItems: 'center',
    elevation: 4,

    shadowColor: '#1B2636',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 9,
  },

  cardPressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  iconContainer: {
    width: 63,
    height: 63,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  title: {
    color: '#121B2B',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    color: '#687284',
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 7,
    flex: 1,
  },

  arrowContainer: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
  },
});