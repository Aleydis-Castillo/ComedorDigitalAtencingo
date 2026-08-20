import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import CustomInput from '../../components/inputs/CustomInput';

import { COLORS } from '../../constants/colors';

import {
  UserRole,
  useAuth,
} from '../../context/AuthContext';

import { API_URL } from '../../services/api';

interface LoginResponse {
  token: string;

  user: {
    id: string;
    employeeNumber: string | null;
    name: string;
    role: UserRole;
    department: string | null;
  };
}

export default function Login() {
  const { setSession } = useAuth();

  const [
    identifier,
    setIdentifier,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    remember,
    setRemember,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const navigateByRole = (
    role: UserRole,
  ) => {
    switch (role) {
      case 'MANAGER':
        router.replace(
          '/manager/dashboard',
        );
        break;

      case 'COMEDOR':
        router.replace(
          '/comedor/dashboard',
        );
        break;

      case 'EMPLOYEE':
      case 'PRACTITIONER':
      case 'EXTERNAL':
        router.replace(
          '/employee/dashboard',
        );
        break;

      default:
        Alert.alert(
          'Rol no válido',
          'No se encontró una pantalla para este usuario.',
        );
    }
  };

  const handleLogin = async () => {
    const normalizedIdentifier =
      identifier
        .trim()
        .toUpperCase();

    if (
      !normalizedIdentifier ||
      !password
    ) {
      Alert.alert(
        'Datos incompletos',
        'Escribe tu número de trabajador o código y tu contraseña.',
      );

      return;
    }

    try {
      setIsLoading(true);

      const response =
        await fetch(
          `${API_URL}/auth/login`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              employeeNumber:
                normalizedIdentifier,

              password,
            }),
          },
        );

      const data =
        (await response.json()) as
          | LoginResponse
          | {
              message?: string;
            };

      if (!response.ok) {
        const errorMessage =
          'message' in data &&
          data.message
            ? data.message
            : 'No fue posible iniciar sesión.';

        Alert.alert(
          'Acceso denegado',
          errorMessage,
        );

        return;
      }

      const loginData =
        data as LoginResponse;

      setSession(
        loginData.user,
        loginData.token,
      );

      console.log(
        'Recordarme:',
        remember,
      );

      navigateByRole(
        loginData.user.role,
      );
    } catch (error) {
      console.error(
        'Error de conexión:',
        error,
      );

      Alert.alert(
        'Error de conexión',
        'No fue posible comunicarse con el servidor. Revisa que el backend esté encendido y que el teléfono esté conectado a la misma red Wi-Fi.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>
            ZUCARMEX
          </Text>

          <Text style={styles.title}>
            Comedor Digital
          </Text>

          <Text style={styles.subtitle}>
            Inicia sesión para continuar
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            placeholder="Número de trabajador o código"
            value={identifier}
            onChangeText={
              setIdentifier
            }
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!isLoading}
          />

          <CustomInput
            placeholder="Contraseña"
            value={password}
            onChangeText={
              setPassword
            }
            secureTextEntry
            isPassword
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            onSubmitEditing={
              handleLogin
            }
          />

          <View style={styles.options}>
            <TouchableOpacity
              style={
                styles.rememberContainer
              }
              activeOpacity={0.7}
              disabled={isLoading}
              onPress={() =>
                setRemember(
                  previous =>
                    !previous,
                )
              }
            >
              <Ionicons
                name={
                  remember
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={24}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.rememberText
                }
              >
                Recordarme
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isLoading}
              onPress={() =>
                Alert.alert(
                  'Recuperar contraseña',
                  'Esta función se habilitará cuando se configure la recuperación de acceso.',
                )
              }
            >
              <Text
                style={
                  styles.forgot
                }
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title={
              isLoading
                ? 'Ingresando...'
                : 'Ingresar'
            }
            disabled={
              isLoading
            }
            onPress={
              handleLogin
            }
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    keyboardView: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    content: {
      flexGrow: 1,

      paddingHorizontal: 25,

      paddingTop: 50,

      paddingBottom: 35,
    },

    backButton: {
      width: 48,

      height: 48,

      borderRadius: 16,

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        COLORS.white,
    },

    header: {
      marginTop: 38,

      marginBottom: 45,
    },

    logo: {
      fontSize: 38,

      fontWeight:
        '900',

      color:
        COLORS.primary,

      textAlign:
        'center',
    },

    title: {
      marginTop: 10,

      fontSize: 30,

      fontWeight:
        '800',

      color:
        COLORS.text,

      textAlign:
        'center',
    },

    subtitle: {
      marginTop: 8,

      fontSize: 16,

      color:
        COLORS.gray,

      textAlign:
        'center',
    },

    form: {
      width: '100%',
    },

    options: {
      marginBottom: 28,
    },

    rememberContainer: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom: 15,
    },

    rememberText: {
      marginLeft: 10,

      color:
        COLORS.text,
    },

    forgot: {
      color:
        COLORS.primary,

      fontWeight:
        '600',
    },
  });