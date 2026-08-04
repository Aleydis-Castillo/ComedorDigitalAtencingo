import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  name: string;
  description: string;
  selected: boolean;
  available?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
}

export default function DishCard({
  name,
  description,
  selected,
  available = true,
  icon = 'food-outline',
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={available ? 0.8 : 1}
      disabled={!available}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selectedCard,
        !available && styles.unavailableCard,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            selected && styles.selectedIconContainer,
            !available && styles.unavailableIconContainer,
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={31}
            color={
              !available
                ? '#9CA3AF'
                : selected
                  ? '#FFFFFF'
                  : '#268A4B'
            }
          />
        </View>

        <View style={styles.headerContent}>
          <Text
            style={[
              styles.name,
              !available && styles.unavailableName,
            ]}
          >
            {name}
          </Text>

          <View
            style={[
              styles.availabilityBadge,
              available
                ? styles.availableBadge
                : styles.unavailableBadge,
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
                styles.availabilityText,
                available
                  ? styles.availableText
                  : styles.unavailableText,
              ]}
            >
              {available ? 'Disponible' : 'Agotado'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.selectionCircle,
            selected && styles.selectedCircle,
          ]}
        >
          {selected && (
            <MaterialCommunityIcons
              name="check"
              size={19}
              color="#FFFFFF"
            />
          )}
        </View>
      </View>

      <Text
        style={[
          styles.description,
          !available && styles.unavailableDescription,
        ]}
      >
        {description}
      </Text>

      <View style={styles.footer}>
        <MaterialCommunityIcons
          name={selected ? 'check-circle' : 'gesture-tap'}
          size={18}
          color={
            selected
              ? '#268A4B'
              : available
                ? '#6B7280'
                : '#9CA3AF'
          }
        />

        <Text
          style={[
            styles.footerText,
            selected && styles.selectedFooterText,
          ]}
        >
          {selected
            ? 'Platillo seleccionado'
            : available
              ? 'Toca para seleccionar'
              : 'No disponible'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ECEEF1',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  selectedCard: {
    backgroundColor: '#EDF8F0',
    borderColor: '#268A4B',
  },

  unavailableCard: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.68,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#E3F3E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedIconContainer: {
    backgroundColor: '#268A4B',
  },

  unavailableIconContainer: {
    backgroundColor: '#E5E7EB',
  },

  headerContent: {
    flex: 1,
    marginHorizontal: 13,
  },

  name: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    color: '#1F2937',
  },

  unavailableName: {
    color: '#7A7F87',
  },

  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 7,
  },

  availableBadge: {
    backgroundColor: '#DFF3E4',
  },

  unavailableBadge: {
    backgroundColor: '#E5E7EB',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  availableDot: {
    backgroundColor: '#268A4B',
  },

  unavailableDot: {
    backgroundColor: '#9CA3AF',
  },

  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
  },

  availableText: {
    color: '#21713F',
  },

  unavailableText: {
    color: '#6B7280',
  },

  selectionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedCircle: {
    backgroundColor: '#268A4B',
    borderColor: '#268A4B',
  },

  description: {
    marginTop: 15,
    color: '#68707A',
    fontSize: 14,
    lineHeight: 21,
  },

  unavailableDescription: {
    color: '#9CA3AF',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#ECEEF1',
  },

  footerText: {
    marginLeft: 7,
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },

  selectedFooterText: {
    color: '#268A4B',
    fontWeight: '800',
  },
});