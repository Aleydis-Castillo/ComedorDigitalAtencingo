import React from 'react';

import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '../../constants/colors';

export default function TabletWelcomeScreen() {
  const handleStartOrder = () => {
    router.push('/tablet/order');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      {/* Decoración superior */}
      <View style={styles.topDecoration}>
        <View style={styles.smallCircle} />
        <View style={styles.largeCircle} />
      </View>

      {/* Logo / encabezado */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={34}
            color={COLORS.white}
          />
        </View>

        <Text style={styles.brand}>
          ZUCARMEX
        </Text>

        <Text style={styles.appName}>
          Comedor Digital
        </Text>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.foodIconContainer}>
          <MaterialCommunityIcons
            name="food"
            size={82}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.title}>
          ¡Bienvenido!
        </Text>

        <Text style={styles.subtitle}>
          Realiza tu pedido de forma rápida y sencilla.
        </Text>

        <Text style={styles.description}>
          Consulta el menú del día, selecciona tu platillo
          y registra tu pedido en pocos pasos.
        </Text>

        <TouchableOpacity
          style={styles.orderButton}
          activeOpacity={0.85}
          onPress={handleStartOrder}
        >
          <View style={styles.buttonIcon}>
            <MaterialCommunityIcons
              name="silverware"
              size={27}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>
              Realizar pedido
            </Text>

            <Text style={styles.buttonSubtitle}>
              Toca aquí para comenzar
            </Text>
          </View>

          <MaterialCommunityIcons
            name="arrow-right"
            size={28}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* Información inferior */}
      <View style={styles.footer}>
        <View style={styles.serviceItem}>
          <MaterialCommunityIcons
            name="coffee-outline"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.serviceText}>
            Desayuno
          </Text>
        </View>

        <View style={styles.dot} />

        <View style={styles.serviceItem}>
          <MaterialCommunityIcons
            name="food-outline"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.serviceText}>
            Comida
          </Text>
        </View>
      </View>

      <Text style={styles.footerText}>
        Servicio de Comedor
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 40,
    paddingTop: 45,
    paddingBottom: 30,
    overflow: 'hidden',
  },

  topDecoration: {
    position: 'absolute',
    top: -60,
    right: -40,
  },

  largeCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E2F1E4',
    position: 'absolute',
    top: 0,
    right: 0,
  },

  smallCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#CFE8D2',
    position: 'absolute',
    top: 80,
    right: 150,
  },

  header: {
    alignItems: 'center',
    zIndex: 2,
  },

  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
  },

  brand: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },

  appName: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },

  foodIconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E5F3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 12,
    fontSize: 21,
    lineHeight: 29,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },

  description: {
    maxWidth: 520,
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.gray,
    textAlign: 'center',
  },

  orderButton: {
    width: '100%',
    maxWidth: 520,
    minHeight: 86,
    marginTop: 35,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },

  buttonIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  buttonContent: {
    flex: 1,
  },

  buttonTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
  },

  buttonSubtitle: {
    marginTop: 3,
    color: '#DCEEDD',
    fontSize: 13,
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  serviceText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#B8C1B9',
    marginHorizontal: 20,
  },

  footerText: {
    marginTop: 13,
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: 12,
  },
});