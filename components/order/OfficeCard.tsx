import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

interface Props {
  icon: string;
  name: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function OfficeCard({
  icon,
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
      activeOpacity={0.8}
      onPress={onPress}
    >
      {selected && (
        <View style={styles.checkContainer}>
          <MaterialCommunityIcons
            name="check"
            size={15}
            color={COLORS.white}
          />
        </View>
      )}

      <View
        style={[
          styles.iconContainer,
          selected && styles.selectedIconContainer,
        ]}
      >
        <MaterialCommunityIcons
          name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
          size={31}
          color={selected ? COLORS.primary : '#556070'}
        />
      </View>

      <Text
        style={[
          styles.name,
          selected && styles.selectedName,
        ]}
      >
        {name}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 168,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E7E9ED',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 3,
  },

  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#EDF8EF',
  },

  checkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  selectedIconContainer: {
    backgroundColor: '#DDF1E1',
  },

  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },

  selectedName: {
    color: COLORS.primary,
  },

  description: {
    color: '#7B8491',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});