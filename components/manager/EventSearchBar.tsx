import React from 'react';
import {
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function EventSearchBar({
  value,
  onChangeText,
}: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color={COLORS.gray}
      />

      <TextInput
        style={styles.input}
        placeholder="Buscar evento..."
        placeholderTextColor={COLORS.gray}
        value={value}
        onChangeText={onChangeText}
      />

      {value.length > 0 && (
        <MaterialCommunityIcons
          name="close-circle"
          size={20}
          color={COLORS.gray}
          onPress={() => onChangeText('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E3EAE4',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
});