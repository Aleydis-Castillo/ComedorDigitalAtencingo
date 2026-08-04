import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

interface Props extends TextInputProps {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function FormInput({
  label,
  icon,
  ...rest
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={COLORS.primary}
        />

        <TextInput
          {...rest}
          placeholderTextColor={COLORS.gray}
          style={[
            styles.input,
            rest.multiline && styles.multiline,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.white,

    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E3EAE4',

    paddingHorizontal: 16,
    paddingVertical: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },

  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
});