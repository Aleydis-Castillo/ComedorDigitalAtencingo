import React, { useState } from 'react';

import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

interface Props extends TextInputProps {
  isPassword?: boolean;
}

export default function CustomInput({
  isPassword = false,
  secureTextEntry = false,
  style,
  ...rest
}: Props) {
  const [
    passwordVisible,
    setPasswordVisible,
  ] = useState(false);

  const shouldHideText =
    isPassword &&
    secureTextEntry &&
    !passwordVisible;

  return (
    <View style={styles.container}>
      <TextInput
        {...rest}
        style={[
          styles.input,
          isPassword &&
            styles.passwordInput,
          style,
        ]}
        placeholderTextColor={
          COLORS.gray
        }
        secureTextEntry={
          shouldHideText
        }
      />

      {isPassword && (
        <TouchableOpacity
          style={styles.eyeButton}
          activeOpacity={0.7}
          onPress={() =>
            setPasswordVisible(
              previous => !previous,
            )
          }
        >
          <Ionicons
            name={
              passwordVisible
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={23}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },

  input: {
    width: '100%',
    height: 58,
    paddingHorizontal: 20,

    borderWidth: 1,
    borderColor:
      COLORS.border ??
      '#DDE5DE',

    borderRadius: 16,

    backgroundColor:
      COLORS.white,

    fontSize: 16,
    color: COLORS.text,
  },

  passwordInput: {
    paddingRight: 55,
  },

  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,

    width: 32,

    justifyContent: 'center',
    alignItems: 'center',
  },
});