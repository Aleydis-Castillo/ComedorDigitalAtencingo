import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import { COLORS } from '../../constants/colors';

export type FilterType =
  | 'Todos'
  | 'Programado'
  | 'Activo'
  | 'Finalizado'
  | 'Cancelado';

interface Props {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

const filters: FilterType[] = [
  'Todos',
  'Programado',
  'Activo',
  'Finalizado',
  'Cancelado',
];

export default function EventFilter({
  selected,
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map(filter => {
        const isSelected = selected === filter;

        return (
          <TouchableOpacity
            key={filter}
            style={[
              styles.chip,
              isSelected && styles.selectedChip,
            ]}
            onPress={() => onSelect(filter)}
          >
            <Text
              style={[
                styles.text,
                isSelected && styles.selectedText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 18,
  },

  chip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E3EAE4',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  text: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  selectedText: {
    color: COLORS.white,
  },
});