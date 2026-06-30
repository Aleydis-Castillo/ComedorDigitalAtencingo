import React, { useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      {/* Curva superior */}
      <View style={styles.topWave} />

      {/* Logo */}
      <Image
        source={require('../../assets/images/zucarmex-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Títulos */}
      <Text style={styles.title}>
        Comedor Digital
      </Text>

      <Text style={styles.subtitle}>
        Bienvenido de nuevo
      </Text>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.replace('/dashboard')
          }
        >
          <Text style={styles.buttonText}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Regresar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  topWave: {
    position: 'absolute',
    top: -180,
    width: 500,
    height: 300,
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
  },

  logo: {
    width: 250,
    height: 90,
    marginTop: 80,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 15,
  },

  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 10,
    marginBottom: 40,
  },

  form: {
    width: '100%',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 18,
    fontSize: 16,

    elevation: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  forgot: {
    color: COLORS.primary,
    textAlign: 'right',
    marginBottom: 30,
    fontWeight: '600',
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  back: {
    textAlign: 'center',
    marginTop: 25,
    color: COLORS.gray,
    fontSize: 16,
  },
});