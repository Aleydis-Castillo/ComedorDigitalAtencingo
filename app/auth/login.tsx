import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import CustomInput from '../../components/inputs/CustomInput';
import { COLORS } from '../../constants/colors';

export default function Login() {
  const [remember, setRemember] = useState(false);

  return (
    <View style={styles.container}>
      {/* Regresar */}
      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={30}
          color={COLORS.text}
        />
      </TouchableOpacity>

      {/* Logo */}
      <Text style={styles.logo}>
        ZUCARMEX
      </Text>

      <Text style={styles.title}>
        Comedor Digital
      </Text>

      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>

      {/* Campos */}
      <CustomInput
        placeholder="Usuario"
      />

      <CustomInput
        placeholder="Contraseña"
        secureTextEntry
      />

      {/* Recordarme */}
      <View style={styles.options}>
        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() =>
            setRemember(!remember)
          }
        >
          <Ionicons
            name={
              remember
                ? 'checkbox'
                : 'square-outline'
            }
            size={24}
            color={COLORS.primary}
          />

          <Text style={styles.rememberText}>
            Recordarme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgot}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón */}
      <PrimaryButton
        title="Ingresar"
        onPress={() => {}}
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

  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 50,
  },

  options: {
    marginBottom: 30,
  },

  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  rememberText: {
    marginLeft: 10,
    color: COLORS.text,
  },

  forgot: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});