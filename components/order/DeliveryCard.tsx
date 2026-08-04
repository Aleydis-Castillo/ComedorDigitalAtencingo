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
  description: string;
  helperText: string;
  selected: boolean;
  onPress: () => void;
}

export default function DeliveryCard({
  icon,
  title,
  description,
  helperText,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            selected && styles.selectedIconContainer,
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={31}
            color={selected ? '#FFFFFF' : '#268A4B'}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.description}>
            {description}
          </Text>
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

      <View
        style={[
          styles.helperContainer,
          selected && styles.selectedHelperContainer,
        ]}
      >
        <MaterialCommunityIcons
          name={
            selected
              ? 'check-circle-outline'
              : 'information-outline'
          }
          size={18}
          color={selected ? '#268A4B' : '#6B7280'}
        />

        <Text
          style={[
            styles.helperText,
            selected && styles.selectedHelperText,
          ]}
        >
          {helperText}
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
    marginBottom: 17,
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 19,
    backgroundColor: '#E3F3E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedIconContainer: {
    backgroundColor: '#268A4B',
  },

  titleContainer: {
    flex: 1,
    marginHorizontal: 14,
  },

  title: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '800',
  },

  description: {
    marginTop: 5,
    color: '#68707A',
    fontSize: 13,
    lineHeight: 19,
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

  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  selectedHelperContainer: {
    backgroundColor: '#DFF3E4',
  },

  helperText: {
    flex: 1,
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },

  selectedHelperText: {
    color: '#21713F',
  },
});