import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  available: boolean;
  selected: boolean;
  unavailableText?: string;
  onPress: () => void;
}

export default function FoodTypeCard({
  icon,
  title,
  available,
  selected,
  unavailableText = 'No disponible',
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={available ? 0.8 : 1}
      disabled={!available}
      onPress={onPress}
      style={[
        styles.card,
        available ? styles.availableCard : styles.unavailableCard,
        selected && styles.selectedCard,
      ]}
    >
      <View style={styles.topSection}>
        <View
          style={[
            styles.iconContainer,
            available
              ? styles.availableIconContainer
              : styles.unavailableIconContainer,
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={34}
            color={available ? '#268A4B' : '#9CA3AF'}
          />
        </View>

        {selected && available && (
          <View style={styles.selectedBadge}>
            <MaterialCommunityIcons
              name="check"
              size={15}
              color="#FFFFFF"
            />

            <Text style={styles.selectedBadgeText}>
              Seleccionado
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.title,
          !available && styles.unavailableTitle,
        ]}
      >
        {title}
      </Text>

      <View
        style={[
          styles.statusContainer,
          available
            ? styles.availableStatus
            : styles.unavailableStatus,
        ]}
      >
        <View
          style={[
            styles.statusDot,
            available
              ? styles.availableDot
              : styles.unavailableDot,
          ]}
        />

        <Text
          style={[
            styles.statusText,
            available
              ? styles.availableStatusText
              : styles.unavailableStatusText,
          ]}
        >
          {available ? 'Disponible ahora' : unavailableText}
        </Text>
      </View>

      {available && (
        <Text style={styles.helperText}>
          Hay platillos disponibles para este servicio
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 190,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 2,
  },

  availableCard: {
    backgroundColor: '#F7FCF8',
    borderColor: '#D2EBD8',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  unavailableCard: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.72,
  },

  selectedCard: {
    backgroundColor: '#EAF7EE',
    borderColor: '#268A4B',
  },

  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  availableIconContainer: {
    backgroundColor: '#DDF3E3',
  },

  unavailableIconContainer: {
    backgroundColor: '#E5E7EB',
  },

  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#268A4B',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
  },

  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  title: {
    marginTop: 18,
    fontSize: 23,
    fontWeight: '800',
    color: '#1F2937',
  },

  unavailableTitle: {
    color: '#6B7280',
  },

  statusContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
  },

  availableStatus: {
    backgroundColor: '#DDF3E3',
  },

  unavailableStatus: {
    backgroundColor: '#E5E7EB',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  availableDot: {
    backgroundColor: '#268A4B',
  },

  unavailableDot: {
    backgroundColor: '#9CA3AF',
  },

  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },

  availableStatusText: {
    color: '#21713F',
  },

  unavailableStatusText: {
    color: '#6B7280',
  },

  helperText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6B7280',
  },
});