import React from 'react';

import {
  Alert,
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

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import StepHeader from '../../../components/order/StepHeader';

import {
  COLORS,
} from '../../../constants/colors';

import {
  useOrder,
} from '../../../context/OrderContext';

export default function SummaryScreen() {
  const {
    foodType,
    dish,
    dishId,

    deliveryType,

    location,

    profileLocation,
    useProfileLocation,

    observations,
  } = useOrder();

  const serviceName =
    foodType === 'breakfast'
      ? 'Desayuno'
      : foodType === 'lunch'
        ? 'Comida'
        : 'No seleccionado';

  const deliveryName =
    deliveryType === 'cafeteria'
      ? 'Recoger en comedor'
      : deliveryType === 'office'
        ? 'Entrega en oficina'
        : 'No seleccionado';

  /*
   * El pedido ya no depende de zone.
   *
   * Para entrega en oficina solamente
   * necesitamos una ubicación válida.
   */
  const isOrderComplete =
    !!foodType &&
    !!dish &&
    !!dishId &&
    !!deliveryType &&
    (
      deliveryType === 'cafeteria' ||
      (
        deliveryType === 'office' &&
        location.trim().length > 0
      )
    );

  const isTemporaryLocation =
    deliveryType === 'office' &&
    !useProfileLocation &&
    !!location.trim();

  const handleConfirm =
    () => {
      if (!isOrderComplete) {
        Alert.alert(
          'Pedido incompleto',
          'Falta información del pedido. Regresa y verifica los pasos anteriores.',
        );

        return;
      }

      /*
       * El siguiente paso será
       * autenticación biométrica.
       */
      router.push(
        '/employee/order/fingerprint',
      );
    };

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.topCircle
        }
      />

      <View
        style={
          styles.bottomCircle
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <StepHeader
          title="Confirma tu pedido"
          subtitle="Verifica la información antes de confirmar."
          step={5}
          totalSteps={5}
        />

        <View
          style={
            styles.infoCard
          }
        >
          <MaterialCommunityIcons
            name="clipboard-check-outline"
            size={28}
            color="#2E73B7"
          />

          <Text
            style={
              styles.infoText
            }
          >
            Revisa que los datos sean correctos antes de continuar.
          </Text>
        </View>

        <View
          style={
            styles.ticket
          }
        >
          <View
            style={
              styles.ticketHeader
            }
          >
            <View>
              <Text
                style={
                  styles.ticketLabel
                }
              >
                RESUMEN DEL PEDIDO
              </Text>

              <Text
                style={
                  styles.ticketTitle
                }
              >
                Comedor Digital
              </Text>
            </View>

            <View
              style={
                styles.ticketIcon
              }
            >
              <MaterialCommunityIcons
                name="food-variant"
                size={29}
                color={
                  COLORS.primary
                }
              />
            </View>
          </View>

          <View
            style={
              styles.divider
            }
          />

          <SummaryRow
            icon={
              foodType ===
              'breakfast'
                ? 'coffee-outline'
                : 'silverware-fork-knife'
            }
            label="Servicio"
            value={
              serviceName
            }
          />

          <SummaryRow
            icon="food-outline"
            label="Platillo"
            value={
              dish ||
              'No seleccionado'
            }
          />

          <SummaryRow
            icon={
              deliveryType ===
              'cafeteria'
                ? 'silverware-fork-knife'
                : 'office-building-marker-outline'
            }
            label="Entrega"
            value={
              deliveryName
            }
          />

          {deliveryType ===
            'office' && (
            <>
              <SummaryRow
                icon="map-marker-outline"
                label="Ubicación"
                value={
                  location.trim() ||
                  'No especificada'
                }
              />

              <View
                style={
                  styles.locationInfoCard
                }
              >
                <MaterialCommunityIcons
                  name={
                    isTemporaryLocation
                      ? 'map-marker-path'
                      : 'map-marker-check-outline'
                  }
                  size={20}
                  color={
                    isTemporaryLocation
                      ? '#B87916'
                      : COLORS.primary
                  }
                />

                <View
                  style={
                    styles.locationInfoContent
                  }
                >
                  <Text
                    style={
                      styles.locationInfoTitle
                    }
                  >
                    {isTemporaryLocation
                      ? 'Ubicación modificada para este pedido'
                      : 'Ubicación habitual'}
                  </Text>

                  <Text
                    style={
                      styles.locationInfoText
                    }
                  >
                    {isTemporaryLocation
                      ? `Tu ubicación habitual sigue siendo ${
                          profileLocation ||
                          'la registrada en tu perfil'
                        }.`
                      : 'Usaremos la ubicación registrada en tu perfil.'}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View
            style={
              styles.observationSection
            }
          >
            <Text
              style={
                styles.observationLabel
              }
            >
              Observaciones
            </Text>

            <Text
              style={
                styles.observationText
              }
            >
              {observations.trim()
                ? observations
                : 'Sin observaciones'}
            </Text>
          </View>
        </View>

        <View
          style={
            styles.warningCard
          }
        >
          <MaterialCommunityIcons
            name="fingerprint"
            size={24}
            color="#9B691A"
          />

          <Text
            style={
              styles.warningText
            }
          >
            Al continuar confirmarás tu identidad con la biometría del dispositivo antes de registrar el pedido.
          </Text>
        </View>

        <View
          style={
            styles.buttonContainer
          }
        >
          <PrimaryButton
            title="Confirmar pedido"
            disabled={
              !isOrderComplete
            }
            onPress={
              handleConfirm
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

interface SummaryRowProps {
  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;

  label: string;

  value: string;
}

function SummaryRow({
  icon,
  label,
  value,
}: SummaryRowProps) {
  return (
    <View
      style={
        styles.row
      }
    >
      <View
        style={
          styles.rowIcon
        }
      >
        <MaterialCommunityIcons
          name={icon}
          size={23}
          color={
            COLORS.primary
          }
        />
      </View>

      <View
        style={
          styles.rowContent
        }
      >
        <Text
          style={
            styles.rowLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.rowValue
          }
        >
          {value}
        </Text>
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
    },

    content: {
      paddingHorizontal: 20,

      paddingTop: 50,

      paddingBottom: 40,

      flexGrow: 1,
    },

    topCircle: {
      position: 'absolute',

      top: -80,

      right: -75,

      width: 190,

      height: 190,

      borderRadius: 95,

      backgroundColor:
        '#E3F3E7',
    },

    bottomCircle: {
      position: 'absolute',

      bottom: -100,

      left: -90,

      width: 220,

      height: 220,

      borderRadius: 110,

      backgroundColor:
        '#FFF0DD',
    },

    infoCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        '#EAF4FF',

      borderRadius: 18,

      padding: 15,

      marginBottom: 20,

      borderWidth: 1,

      borderColor:
        '#D7E8F8',
    },

    infoText: {
      flex: 1,

      marginLeft: 11,

      color: '#547895',

      fontSize: 13,

      lineHeight: 19,
    },

    ticket: {
      backgroundColor:
        COLORS.white,

      borderRadius: 24,

      padding: 18,

      borderWidth: 1,

      borderColor:
        '#E2E8E3',

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,

        height: 4,
      },

      shadowOpacity:
        0.07,

      shadowRadius: 8,

      elevation: 3,
    },

    ticketHeader: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },

    ticketLabel: {
      color:
        COLORS.gray,

      fontSize: 11,

      fontWeight:
        '800',

      letterSpacing: 1,
    },

    ticketTitle: {
      marginTop: 3,

      color:
        COLORS.text,

      fontSize: 22,

      fontWeight:
        '900',
    },

    ticketIcon: {
      width: 52,

      height: 52,

      borderRadius: 17,

      backgroundColor:
        '#E6F3E8',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    divider: {
      height: 1,

      backgroundColor:
        '#E9ECE9',

      marginVertical: 17,
    },

    row: {
      flexDirection:
        'row',

      alignItems:
        'center',

      paddingVertical: 11,
    },

    rowIcon: {
      width: 44,

      height: 44,

      borderRadius: 14,

      backgroundColor:
        '#EDF7EF',

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 12,
    },

    rowContent: {
      flex: 1,
    },

    rowLabel: {
      color:
        COLORS.gray,

      fontSize: 12,

      marginBottom: 3,
    },

    rowValue: {
      color:
        COLORS.text,

      fontSize: 16,

      fontWeight:
        '800',
    },

    locationInfoCard: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      backgroundColor:
        '#F5F8F5',

      borderRadius: 15,

      padding: 12,

      marginTop: 5,
    },

    locationInfoContent: {
      flex: 1,

      marginLeft: 9,
    },

    locationInfoTitle: {
      color:
        COLORS.text,

      fontSize: 12,

      fontWeight:
        '800',
    },

    locationInfoText: {
      marginTop: 3,

      color:
        COLORS.gray,

      fontSize: 11,

      lineHeight: 16,
    },

    observationSection: {
      backgroundColor:
        '#F7F9F7',

      borderRadius: 17,

      padding: 15,

      marginTop: 12,
    },

    observationLabel: {
      color:
        COLORS.gray,

      fontSize: 12,

      fontWeight:
        '700',

      marginBottom: 5,
    },

    observationText: {
      color:
        COLORS.text,

      fontSize: 14,

      lineHeight: 20,
    },

    warningCard: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#FFF3DF',

      borderRadius: 18,

      padding: 15,

      marginTop: 20,

      borderWidth: 1,

      borderColor:
        '#F4DEB8',
    },

    warningText: {
      flex: 1,

      marginLeft: 10,

      color:
        '#85621F',

      fontSize: 13,

      lineHeight: 19,
    },

    buttonContainer: {
      marginTop: 'auto',

      paddingTop: 22,
    },
  });