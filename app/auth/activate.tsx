import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import CustomInput from '../../components/inputs/CustomInput';
import { COLORS } from '../../constants/colors';

export default function Activate() {
  const [identifier, setIdentifier] =
    useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={30}
          color={COLORS.text}
        />
      </TouchableOpacity>

      <Text style={styles.title}>
        Primer acceso
      </Text>

      <Text style={styles.subtitle}>
        Ingresa tu número de trabajador
        o código de practicante
      </Text>

      <CustomInput
        placeholder="Número o código"
      />

      <PrimaryButton
        title="Continuar"
        onPress={() =>
          router.push(
            '/auth/create-password'
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 25,
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 40,
  },
});