import React, {
    useRef,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import SignatureScreen from 'react-native-signature-canvas';

import { COLORS } from '../../constants/colors';
import { API_URL } from '../../services/api';

interface CreateOrderResponse {
  message: string;

  order: {
    id: string;
    folio: string;
    status: string;
  };
}

function getCurrentDate() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function TabletSignatureScreen() {
  const signatureRef =
    useRef<any>(null);

  const {
    userId,
    employeeNumber,
    employeeName,
    department,
    dishId,
    dishName,
    service,
    observations,
  } = useLocalSearchParams<{
    userId?: string;
    employeeNumber?: string;
    employeeName?: string;
    department?: string;
    dishId?: string;
    dishName?: string;
    service?: string;
    observations?: string;
  }>();

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    hasSignature,
    setHasSignature,
  ] = useState(false);

  const validateData = () => {
    if (
      !userId ||
      !dishId ||
      (
        service !==
          'BREAKFAST' &&
        service !==
          'LUNCH'
      )
    ) {
      Alert.alert(
        'Pedido incompleto',
        'Falta información del pedido. Regresa e inténtalo nuevamente.',
      );

      return false;
    }

    return true;
  };

  const handleConfirm = () => {
    if (isSubmitting) {
      return;
    }

    if (!validateData()) {
      return;
    }

    /*
     * Solicitamos al componente
     * que convierta la firma en
     * una imagen base64.
     *
     * Después se ejecutará onOK.
     */
    signatureRef.current?.readSignature();
  };

  const handleSignature =
    async (
      signatureData: string,
    ) => {
      if (!validateData()) {
        return;
      }

      if (
        !signatureData ||
        !signatureData.trim()
      ) {
        Alert.alert(
          'Firma requerida',
          'Realiza tu firma antes de confirmar el pedido.',
        );

        return;
      }

      try {
        setIsSubmitting(true);

        const response =
          await fetch(
            `${API_URL}/orders`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                userId,

                dishId,

                service,

                /*
                 * El pedido se realiza
                 * directamente en comedor.
                 */
                deliveryType:
                  'CAFETERIA',

                zone: null,

                location: null,

                observations:
                  observations?.trim()
                    ? observations.trim()
                    : null,

                orderedFor:
                  getCurrentDate(),

                /*
                 * Firma dibujada en tablet.
                 */
                signatureData,
              }),
            },
          );

        const data =
          (await response.json()) as
            | CreateOrderResponse
            | {
                message?: string;
              };

        if (!response.ok) {
          const message =
            'message' in data &&
            data.message
              ? data.message
              : 'No fue posible registrar el pedido.';

          throw new Error(
            message,
          );
        }

        const result =
          data as CreateOrderResponse;

        Alert.alert(
          '¡Pedido registrado!',
          `Tu pedido fue registrado correctamente.\n\nFolio: ${result.order.folio}`,
          [
            {
              text: 'Finalizar',

              onPress: () => {
                /*
                 * Regresamos a la
                 * bienvenida para el
                 * siguiente trabajador.
                 */
                router.replace(
                  '/tablet',
                );
              },
            },
          ],
        );
      } catch (error) {
        console.error(
          'Error al registrar pedido desde tablet:',
          error,
        );

        Alert.alert(
          'No fue posible registrar el pedido',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleEmpty = () => {
    setHasSignature(false);

    Alert.alert(
      'Firma requerida',
      'Realiza tu firma dentro del recuadro.',
    );
  };

  const handleBegin = () => {
    setHasSignature(true);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();

    setHasSignature(false);
  };

  const serviceName =
    service === 'BREAKFAST'
      ? 'Desayuno'
      : 'Comida';

  const webStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
      margin: 0;
    }

    .m-signature-pad--body {
      border: none;
    }

    .m-signature-pad--footer {
      display: none;
      margin: 0;
    }

    body,
    html {
      width: 100%;
      height: 100%;
      background-color: #FFFFFF;
    }
  `;

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            disabled={isSubmitting}
            onPress={() =>
              router.back()
            }
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={27}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.step}>
              Último paso
            </Text>

            <Text style={styles.title}>
              Confirma tu pedido
            </Text>

            <Text style={styles.subtitle}>
              Revisa la información y firma para finalizar.
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View
            style={
              styles.employeeHeader
            }
          >
            <View
              style={
                styles.employeeIcon
              }
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={29}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.employeeContent}>
              <Text
                style={
                  styles.employeeLabel
                }
              >
                Trabajador
              </Text>

              <Text
                style={
                  styles.employeeName
                }
              >
                {employeeName ??
                  'Empleado'}
              </Text>

              <Text
                style={
                  styles.employeeDetails
                }
              >
                No.{' '}
                {employeeNumber ??
                  '—'}

                {department
                  ? ` · ${department}`
                  : ''}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <SummaryRow
            icon={
              service ===
              'BREAKFAST'
                ? 'coffee-outline'
                : 'silverware-fork-knife'
            }
            label="Servicio"
            value={serviceName}
          />

          <SummaryRow
            icon="food-outline"
            label="Platillo"
            value={
              dishName ??
              'Platillo seleccionado'
            }
          />

          <SummaryRow
            icon="storefront-outline"
            label="Entrega"
            value="Comedor"
          />

          <SummaryRow
            icon="message-text-outline"
            label="Observaciones"
            value={
              observations?.trim()
                ? observations
                : 'Sin observaciones'
            }
          />
        </View>

        <View style={styles.signatureSection}>
          <View
            style={
              styles.signatureTitleRow
            }
          >
            <View>
              <Text
                style={
                  styles.signatureTitle
                }
              >
                Firma
              </Text>

              <Text
                style={
                  styles.signatureSubtitle
                }
              >
                Firma dentro del recuadro.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              disabled={isSubmitting}
              onPress={handleClear}
            >
              <MaterialCommunityIcons
                name="eraser"
                size={20}
                color={COLORS.danger}
              />

              <Text
                style={
                  styles.clearText
                }
              >
                Limpiar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signatureCard}>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={handleEmpty}
              onBegin={handleBegin}
              descriptionText=""
              clearText=""
              confirmText=""
              autoClear={false}
              webStyle={webStyle}
            />

            {!hasSignature && (
              <View
                pointerEvents="none"
                style={
                  styles.signatureHint
                }
              >
                <MaterialCommunityIcons
                  name="draw-pen"
                  size={35}
                  color="#B6BDB7"
                />

                <Text
                  style={
                    styles.signatureHintText
                  }
                >
                  Firma aquí
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.signatureHelp}>
            Tu firma confirma la recepción y registro del pedido.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isSubmitting}
          style={[
            styles.confirmButton,

            isSubmitting &&
              styles.disabledButton,
          ]}
          onPress={
            handleConfirm
          }
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.confirmText
                }
              >
                Registrando pedido...
              </Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={26}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.confirmText
                }
              >
                Confirmar pedido
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;

  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={21}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.summaryContent}>
        <Text
          style={styles.summaryLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.summaryValue}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    container: {
      flex: 1,
      width: '100%',
      maxWidth: 780,
      alignSelf: 'center',
      paddingHorizontal: 34,
      paddingTop: 42,
      paddingBottom: 30,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 22,
    },

    backButton: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor:
        COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
      elevation: 2,
    },

    headerText: {
      flex: 1,
    },

    step: {
      color: COLORS.primary,
      fontSize: 14,
      fontWeight: '800',
    },

    title: {
      marginTop: 4,
      color: COLORS.text,
      fontSize: 30,
      fontWeight: '900',
    },

    subtitle: {
      marginTop: 5,
      color: COLORS.gray,
      fontSize: 15,
    },

    summaryCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 24,
      padding: 19,
      borderWidth: 1,
      borderColor: '#E2E8E3',
      elevation: 2,
    },

    employeeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    employeeIcon: {
      width: 52,
      height: 52,
      borderRadius: 17,
      backgroundColor:
        '#E8F4EA',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 13,
    },

    employeeContent: {
      flex: 1,
    },

    employeeLabel: {
      color: COLORS.gray,
      fontSize: 10,
    },

    employeeName: {
      marginTop: 2,
      color: COLORS.text,
      fontSize: 17,
      fontWeight: '900',
    },

    employeeDetails: {
      marginTop: 3,
      color: COLORS.gray,
      fontSize: 12,
    },

    divider: {
      height: 1,
      backgroundColor:
        '#E9ECEA',
      marginVertical: 15,
    },

    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 11,
    },

    summaryIcon: {
      width: 39,
      height: 39,
      borderRadius: 12,
      backgroundColor:
        '#F0F5F1',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },

    summaryContent: {
      flex: 1,
    },

    summaryLabel: {
      color: COLORS.gray,
      fontSize: 10,
    },

    summaryValue: {
      marginTop: 2,
      color: COLORS.text,
      fontSize: 13,
      fontWeight: '700',
    },

    signatureSection: {
      flex: 1,
      marginTop: 20,
    },

    signatureTitleRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },

    signatureTitle: {
      color: COLORS.text,
      fontSize: 20,
      fontWeight: '900',
    },

    signatureSubtitle: {
      marginTop: 3,
      color: COLORS.gray,
      fontSize: 12,
    },

    clearButton: {
      minHeight: 42,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor:
        '#FFF1F1',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },

    clearText: {
      color: COLORS.danger,
      fontSize: 12,
      fontWeight: '800',
    },

    signatureCard: {
      flex: 1,
      minHeight: 200,
      maxHeight: 280,
      backgroundColor:
        '#FFFFFF',
      borderRadius: 22,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#D8E2D9',
    },

    signatureHint: {
      ...StyleSheet.absoluteFillObject,

      justifyContent: 'center',
      alignItems: 'center',
    },

    signatureHintText: {
      marginTop: 7,
      color: '#A6AEA8',
      fontSize: 15,
      fontWeight: '700',
    },

    signatureHelp: {
      marginTop: 8,
      color: COLORS.gray,
      fontSize: 11,
      textAlign: 'center',
    },

    confirmButton: {
      minHeight: 66,
      borderRadius: 21,
      backgroundColor:
        COLORS.primary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 9,
      marginTop: 18,
    },

    disabledButton: {
      opacity: 0.6,
    },

    confirmText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '900',
    },
  });