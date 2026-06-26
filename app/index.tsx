 import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { COLORS } from '../constants/colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.circleTop} />

      <Image
        source={require('../assets/images/zucarmex-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Comedor Digital
        </Text>

        {/*comentario*/ }
        <Text style={styles.subtitle}>
          Atencingo
        </Text>

        <Text style={styles.description}>
          Alimentando tu día con eficiencia y tecnología
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            router.push('/auth/login')
          }
        >
          <Text style={styles.loginText}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() =>
            router.push('/auth/register')
          }
        >
          <Text style={styles.registerText}>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomWave} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🍽️ Menú variado
        </Text>

        <Text style={styles.footerText}>
          ⏱️ Rápido
        </Text>

        <Text style={styles.footerText}>
          ✔️ Seguro
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 40,
  },

  circleTop: {
    position: 'absolute',
    top: -150,
    width: 500,
    height: 300,
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
  },

  logo: {
    width: 500,
    height: 100,
    marginTop: 90,
  },

  textContainer: {
    alignItems: 'center',
  },

  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: COLORS.primary,
      marginTop: -70,
  },

  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 5,
  },

  description: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 20,
  },

  buttonsContainer: {
    width: '85%',
  },

  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  loginText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '600',
  },

  registerButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: 18,
  },

  registerText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '600',
  },

  bottomWave: {
    position: 'absolute',
    bottom: -150,
    width: 500,
    height: 300,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 250,
    borderTopRightRadius: 250,
  },

  footer: {
    flexDirection: 'row',
    gap: 20,
    zIndex: 1,
  },

  footerText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});