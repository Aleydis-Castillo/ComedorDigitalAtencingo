import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import * as LocalAuthentication from 'expo-local-authentication';

import ConfettiCannon from 'react-native-confetti-cannon';

import FoodPatternBackground from '../../../components/backgrounds/FoodPatternBackground';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import OrderSuccessModal from '../../../components/modals/OrderSuccessModal';
import StepHeader from '../../../components/order/StepHeader';
import Ticket from '../../../components/order/Ticket';

import {
  COLORS,
} from '../../../constants/colors';

import {
  useAuth,
} from '../../../context/AuthContext';

import {
  useOrder,
} from '../../../context/OrderContext';

import {
  createOrder,
} from '../../../services/orderApi';

const {
  width: SCREEN_WIDTH,
} = Dimensions.get('window');

function getCurrentDate() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      '0',
    );

  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      '0',
    );

  return `${year}-${month}-${day}`;
}

export default function FingerprintScreen() {
  const {
    user,
  } = useAuth();

  const {
    foodType,
    dish,
    dishId,

    deliveryType,

    location,

    observations,

    resetOrder,
  } = useOrder();

  const timeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const [
    showConfetti,
    setShowConfetti,
  ] =
    useState(false);

  const [
    showSuccessModal,
    setShowSuccessModal,
  ] =
    useState(false);

  const [
    isConfirming,
    setIsConfirming,
  ] =
    useState(false);

  const [
    isAuthenticating,
    setIsAuthenticating,
  ] =
    useState(false);

  const [
    biometricAvailable,
    setBiometricAvailable,
  ] =
    useState<boolean | null>(
      null,
    );

  const [
    folio,
    setFolio,
  ] =
    useState('');

  useEffect(() => {
    checkBiometricAvailability();

    return () => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current,
        );
      }
    };
  }, []);

  const checkBiometricAvailability =
    async () => {
      try {
        const hasHardware =
          await LocalAuthentication
            .hasHardwareAsync();

        const isEnrolled =
          await LocalAuthentication
            .isEnrolledAsync();

        setBiometricAvailable(
          hasHardware &&
          isEnrolled,
        );
      } catch (error) {
        console.error(
          'Error al comprobar biometría:',
          error,
        );

        setBiometricAvailable(
          false,
        );
      }
    };

  const validateOrder =
    () => {
      if (!user) {
        Alert.alert(
          'Sesión no disponible',
          'Inicia sesión nuevamente para realizar tu pedido.',
        );

        return false;
      }

      if (
        !foodType ||
        !dish ||
        !dishId ||
        !deliveryType
      ) {
        Alert.alert(
          'Pedido incompleto',
          'Falta información del pedido. Regresa y verifica los pasos anteriores.',
        );

        return false;
      }

      if (
        deliveryType ===
          'office' &&
        !location.trim()
      ) {
        Alert.alert(
          'Ubicación incompleta',
          'Indica dónde deseas recibir tu pedido.',
        );

        return false;
      }

      return true;
    };

  async function authenticateUser() {
    try {
      setIsAuthenticating(
        true,
      );

      const hasHardware =
        await LocalAuthentication
          .hasHardwareAsync();

      if (!hasHardware) {
        Alert.alert(
          'Biometría no disponible',
          'Este dispositivo no cuenta con autenticación biométrica compatible.',
        );

        return false;
      }

      const isEnrolled =
        await LocalAuthentication
          .isEnrolledAsync();

      if (!isEnrolled) {
        Alert.alert(
          'Biometría no configurada',
          'Configura una huella o biometría en tu dispositivo para confirmar pedidos.',
        );

        return false;
      }

      const result =
        await LocalAuthentication
          .authenticateAsync({
            promptMessage:
              'Confirma tu pedido',

            cancelLabel:
              'Cancelar',

            fallbackLabel:
              'Usar método del dispositivo',

            disableDeviceFallback:
              false,
          });

      if (!result.success) {
        if (
          result.error !==
            'user_cancel' &&
          result.error !==
            'system_cancel' &&
          result.error !==
            'app_cancel'
        ) {
          Alert.alert(
            'No se pudo confirmar tu identidad',
            'La autenticación biométrica no fue válida. Inténtalo nuevamente.',
          );
        }

        return false;
      }

      return true;
    } catch (error) {
      console.error(
        'Error en autenticación biométrica:',
        error,
      );

      Alert.alert(
        'Error de autenticación',
        'No fue posible utilizar la biometría del dispositivo.',
      );

      return false;
    } finally {
      setIsAuthenticating(
        false,
      );
    }
  }

  async function createConfirmedOrder() {
    if (isConfirming) {
      return;
    }

    if (
      !validateOrder()
    ) {
      return;
    }

    if (
      !user ||
      !foodType ||
      !dishId ||
      !deliveryType
    ) {
      return;
    }

    try {
      setIsConfirming(
        true,
      );

      const response =
        await createOrder({
          userId:
            user.id,

          dishId,

          service:
            foodType ===
              'breakfast'
              ? 'BREAKFAST'
              : 'LUNCH',

          deliveryType:
            deliveryType ===
              'cafeteria'
              ? 'CAFETERIA'
              : 'OFFICE',

          zone:
            null,

          location:
            deliveryType ===
              'office'
              ? location.trim()
              : null,

          observations:
            observations.trim()
              ? observations.trim()
              : null,

          orderedFor:
            getCurrentDate(),
        });

      setFolio(
        response.order.folio,
      );

      setShowConfetti(
        true,
      );

      timeoutRef.current =
        setTimeout(
          () => {
            setShowSuccessModal(
              true,
            );
          },
          750,
        );
    } catch (error) {
      console.error(
        'Error al registrar el pedido:',
        error,
      );

      Alert.alert(
        'No fue posible registrar el pedido',

        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado.',
      );
    } finally {
      setIsConfirming(
        false,
      );
    }
  }

  async function handleConfirmOrder() {
    if (
      isConfirming ||
      isAuthenticating
    ) {
      return;
    }

    if (
      !validateOrder()
    ) {
      return;
    }

    const authenticated =
      await authenticateUser();

    if (!authenticated) {
      return;
    }

    await createConfirmedOrder();
  }

 

  function goToDashboard() {
    setShowSuccessModal(
      false,
    );

    setShowConfetti(
      false,
    );
    router.replace(
      '/employee/dashboard',
    );
  setTimeout(() => {
    resetOrder();
  }, 300);    
  }

  const isBusy =
    isConfirming ||
    isAuthenticating;

  return (
    <FoodPatternBackground>
      <View
        style={
          styles.screen
        }
      >
        <ScrollView
          style={
            styles.container
          }
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <StepHeader
            title="Confirmación del pedido"
            subtitle={
              isAuthenticating
                ? 'Esperando autenticación biométrica...'
                : isConfirming
                  ? 'Registrando tu pedido...'
                  : 'Revisa tu pedido y confirma tu identidad para finalizar.'
            }
            step={5}
            totalSteps={5}
          />


          <Ticket
            folio={folio}
            isConfirming={
              isBusy
            }
          />


          {!folio && (
            <View
              style={
                styles.biometricCard
              }
            >
              <View
                style={
                  styles.fingerprintCircle
                }
              >
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={62}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <Text
                style={
                  styles.biometricTitle
                }
              >
                Confirmación biométrica
              </Text>

              <Text
                style={
                  styles.biometricText
                }
              >
                Tu huella o biometría confirma que eres tú quien está realizando este pedido.
              </Text>

              {biometricAvailable ===
                false && (
                <View
                  style={
                    styles.warningCard
                  }
                >
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={21}
                    color="#B87916"
                  />

                  <Text
                    style={
                      styles.warningText
                    }
                  >
                    No detectamos una biometría configurada en este dispositivo.
                  </Text>
                </View>
              )}

              <View
                style={
                  styles.confirmButtonContainer
                }
              >
                <PrimaryButton
                  title={
                    isAuthenticating
                      ? 'Verificando...'
                      : isConfirming
                        ? 'Registrando...'
                        : 'Confirmar con biometría'
                  }
                  disabled={
                    isBusy
                  }
                  onPress={
                    handleConfirmOrder
                  }
                />
              </View>
            </View>
          )}
        </ScrollView>

        {showConfetti && (
          <View
            pointerEvents="none"
            style={
              styles.confettiLayer
            }
          >
            <ConfettiCannon
              count={200}
              origin={{
                x:
                  SCREEN_WIDTH /
                  2,

                y: -20,
              }}
              explosionSpeed={
                330
              }
              fallSpeed={
                2600
              }
              fadeOut
              onAnimationEnd={() => {
                setShowConfetti(
                  false,
                );
              }}
            />
          </View>
        )}

        <OrderSuccessModal
          visible={
            showSuccessModal
          }

          folio={
            folio
          }

          foodType={
            foodType
          }

          dish={
            dish
          }

          deliveryType={
            deliveryType
          }

          officeArea={
            deliveryType ===
              'office'
              ? location
              : null
          }

          onGoHome={
            goToDashboard
          }
        />
      </View>
    </FoodPatternBackground>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    container: {
      flex: 1,

      backgroundColor:
        'transparent',
    },

    content: {
      flexGrow: 1,

      paddingHorizontal: 16,

      paddingTop: 50,

      paddingBottom: 50,
    },



    biometricCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 24,

      padding: 22,

      alignItems:
        'center',

      borderWidth: 1,

      borderColor:
        '#E0E8E1',

      
      marginTop: 20,

      marginBottom: 20,

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,

        height: 4,
      },

      shadowOpacity:
        0.06,

      shadowRadius: 8,

      elevation: 3,
    },

    fingerprintCircle: {
      width: 105,

      height: 105,

      borderRadius: 53,

      backgroundColor:
        '#EAF6EC',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 17,
    },

    biometricTitle: {
      color:
        COLORS.text,

      fontSize: 21,

      fontWeight:
        '900',

      textAlign:
        'center',
    },

    biometricText: {
      marginTop: 8,

      color:
        COLORS.gray,

      fontSize: 13,

      lineHeight: 19,

      textAlign:
        'center',

      maxWidth: 320,
    },

    warningCard: {
      width: '100%',

      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#FFF7E8',

      borderRadius: 15,

      padding: 12,

      marginTop: 17,
    },

    warningText: {
      flex: 1,

      marginLeft: 8,

      color:
        '#8C6A32',

      fontSize: 11,

      lineHeight: 16,
    },

    confirmButtonContainer: {
      width: '100%',

      marginTop: 20,
    },

    confettiLayer: {
      ...StyleSheet.absoluteFillObject,

      zIndex: 200,

      elevation: 200,
    },
  });