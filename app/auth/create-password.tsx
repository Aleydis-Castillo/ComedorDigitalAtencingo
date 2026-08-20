import React, {
  useState,
} from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import CustomInput from '../../components/inputs/CustomInput';

import { COLORS } from '../../constants/colors';
import { API_URL } from '../../services/api';

type UserRole =
  | 'EMPLOYEE'
  | 'PRACTITIONER'
  | 'EXTERNAL'
  | 'MANAGER'
  | 'COMEDOR';

interface CreatePasswordResponse {
  message: string;

  user: {
    id: string;
    employeeNumber: string | null;
    name: string;
    role: UserRole;
  };
}

export default function CreatePassword() {
  const {
    identifier,
  } = useLocalSearchParams<{
    identifier?: string;
  }>();

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const handleSave =
    async () => {
      if (!identifier) {
        Alert.alert(
          'Error',
          'No se encontró el identificador del usuario.',
        );

        router.replace(
          '/auth/activate',
        );

        return;
      }

      if (
        !password ||
        !confirmPassword
      ) {
        Alert.alert(
          'Datos incompletos',
          'Escribe y confirma tu contraseña.',
        );

        return;
      }

      if (
        password.length < 6
      ) {
        Alert.alert(
          'Contraseña muy corta',
          'La contraseña debe tener al menos 6 caracteres.',
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        Alert.alert(
          'Las contraseñas no coinciden',
          'Verifica la contraseña e inténtalo nuevamente.',
        );

        return;
      }

      try {
        setIsLoading(true);

        const response =
          await fetch(
            `${API_URL}/auth/activate/password`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  identifier:
                    identifier
                      .trim()
                      .toUpperCase(),

                  password,
                }),
            },
          );

        const data =
          (await response.json()) as
            | CreatePasswordResponse
            | {
                message?: string;
              };

        if (!response.ok) {
          const message =
            'message' in data &&
            data.message
              ? data.message
              : 'No fue posible guardar la contraseña.';

          Alert.alert(
            'No fue posible continuar',
            message,
          );

          return;
        }

        const result =
          data as
            CreatePasswordResponse;

        if (
          !result.user?.id
        ) {
          Alert.alert(
            'No fue posible continuar',
            'La contraseña se guardó, pero no se recibió la información del usuario.',
          );

          return;
        }

        if (
          result.user.role ===
          'EXTERNAL'
        ) {
          Alert.alert(
            'Contraseña creada',
            'Tu acceso quedó configurado correctamente.',
            [
              {
                text:
                  'Iniciar sesión',

                onPress:
                  () =>
                    router.replace(
                      '/auth/login',
                    ),
              },
            ],
          );

          return;
        }

        if (
          result.user.role ===
            'EMPLOYEE' ||
          result.user.role ===
            'PRACTITIONER'
        ) {
          router.replace({
            pathname:
              '/auth/classification',

            params: {
              userId:
                result.user.id,

              name:
                result.user.name,

              role:
                result.user.role,
            },
          });

          return;
        }

        Alert.alert(
          'Acceso configurado',
          'La contraseña fue creada correctamente.',
          [
            {
              text:
                'Iniciar sesión',

              onPress:
                () =>
                  router.replace(
                    '/auth/login',
                  ),
            },
          ],
        );
      } catch (error) {
        console.error(
          'Error al crear contraseña:',
          error,
        );

        Alert.alert(
          'Error de conexión',
          'No fue posible comunicarse con el servidor.',
        );
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.title
        }
      >
        Crear contraseña
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Crea una contraseña segura para futuros accesos.
      </Text>

      <CustomInput
        placeholder="Contraseña"
        value={
          password
        }
        onChangeText={
          setPassword
        }
        secureTextEntry
        isPassword
        editable={
          !isLoading
        }
        autoCapitalize="none"
        autoCorrect={
          false
        }
      />

      <CustomInput
        placeholder="Confirmar contraseña"
        value={
          confirmPassword
        }
        onChangeText={
          setConfirmPassword
        }
        secureTextEntry
        isPassword
        editable={
          !isLoading
        }
        autoCapitalize="none"
        autoCorrect={
          false
        }
        onSubmitEditing={
          handleSave
        }
      />

      <PrimaryButton
        title={
          isLoading
            ? 'Guardando...'
            : 'Continuar'
        }
        disabled={
          isLoading
        }
        onPress={
          handleSave
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        COLORS.background,

      padding: 25,

      justifyContent:
        'center',
    },

    title: {
      fontSize: 32,

      fontWeight:
        'bold',

      color:
        COLORS.text,

      marginBottom:
        10,
    },

    subtitle: {
      fontSize: 16,

      lineHeight:
        22,

      color:
        COLORS.gray,

      marginBottom:
        40,
    },
  });