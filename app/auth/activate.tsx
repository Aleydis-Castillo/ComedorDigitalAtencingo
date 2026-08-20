import React, {
  useState,
} from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import CustomInput from '../../components/inputs/CustomInput';

import {
  COLORS,
} from '../../constants/colors';

import {
  API_URL,
} from '../../services/api';

interface ActivationCheckResponse {
  message?: string;

  user?: {
    id: string;
    employeeNumber: string | null;
    name: string;
    role:
      | 'EMPLOYEE'
      | 'PRACTITIONER'
      | 'MANAGER'
      | 'COMEDOR';

    department: string | null;
  };
}

export default function Activate() {
  const [
    identifier,
    setIdentifier,
  ] =
    useState('');

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const handleContinue =
    async () => {
      const normalizedIdentifier =
        identifier
          .trim()
          .toUpperCase();

      if (!normalizedIdentifier) {
        Alert.alert(
          'Datos incompletos',
          'Escribe tu número de trabajador o código de practicante.',
        );

        return;
      }

      try {
        setIsLoading(
          true,
        );

        const response =
          await fetch(
            `${API_URL}/auth/activate/check`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  identifier:
                    normalizedIdentifier,
                }),
            },
          );

        const data =
          (await response.json()) as
            ActivationCheckResponse;

        if (!response.ok) {
          Alert.alert(
            'No fue posible continuar',

            data.message ||
              'El identificador no es válido.',
          );

          return;
        }

        router.push({
          pathname:
            '/auth/create-password',

          params: {
            identifier:
              normalizedIdentifier,
          },
        });
      } catch (error) {
        console.error(
          'Error al validar primer acceso:',
          error,
        );

        Alert.alert(
          'Error de conexión',
          'No fue posible comunicarse con el servidor. Revisa que el backend esté encendido.',
        );
      } finally {
        setIsLoading(
          false,
        );
      }
    };

  return (
    <View
      style={
        styles.container
      }
    >
      <TouchableOpacity
        style={
          styles.backButton
        }
        activeOpacity={0.7}
        disabled={
          isLoading
        }
        onPress={() =>
          router.back()
        }
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color={
            COLORS.text
          }
        />
      </TouchableOpacity>

      <View
        style={
          styles.content
        }
      >
        <View
          style={
            styles.iconContainer
          }
        >
          <Ionicons
            name="person-add-outline"
            size={38}
            color={
              COLORS.primary
            }
          />
        </View>

        <Text
          style={
            styles.title
          }
        >
          Primer acceso
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Ingresa tu número de trabajador o código de practicante para configurar tu acceso.
        </Text>

        <CustomInput
          placeholder="Número de trabajador o código"
          value={
            identifier
          }
          onChangeText={
            setIdentifier
          }
          autoCapitalize="characters"
          autoCorrect={false}
          editable={
            !isLoading
          }
          onSubmitEditing={
            handleContinue
          }
        />

        <View
          style={
            styles.infoCard
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#3974A8"
          />

          <Text
            style={
              styles.infoText
            }
          >
            Si eres empleado, utiliza tu número de trabajador. Si eres practicante, utiliza el código temporal que te proporcionaron.
          </Text>
        </View>

        <PrimaryButton
          title={
            isLoading
              ? 'Validando...'
              : 'Continuar'
          }
          disabled={
            isLoading
          }
          onPress={
            handleContinue
          }
        />
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,

      paddingHorizontal: 25,

      paddingTop: 50,

      paddingBottom: 35,
    },

    backButton: {
      width: 48,

      height: 48,

      borderRadius: 16,

      backgroundColor:
        COLORS.white,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    content: {
      flex: 1,

      justifyContent:
        'center',
    },

    iconContainer: {
      width: 72,

      height: 72,

      borderRadius: 24,

      backgroundColor:
        '#EAF5EC',

      justifyContent:
        'center',

      alignItems:
        'center',

      alignSelf:
        'center',

      marginBottom: 18,
    },

    title: {
      fontSize: 32,

      fontWeight:
        '900',

      color:
        COLORS.text,

      textAlign:
        'center',

      marginBottom: 10,
    },

    subtitle: {
      fontSize: 15,

      lineHeight: 22,

      color:
        COLORS.gray,

      textAlign:
        'center',

      marginBottom: 32,
    },

    infoCard: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      backgroundColor:
        '#EAF4FF',

      borderRadius: 17,

      padding: 14,

      marginTop: 3,

      marginBottom: 24,

      borderWidth: 1,

      borderColor:
        '#D5E7F7',
    },

    infoText: {
      flex: 1,

      marginLeft: 9,

      color:
        '#557594',

      fontSize: 12,

      lineHeight: 18,
    },
  });