import React, {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export default function LocationScreen() {
  const {
    deliveryType,

    location,
    setLocation,

    profileLocation,

    setUseProfileLocation,
  } = useOrder();

  /*
   * Usamos un estado temporal.
   *
   * Esto evita modificar location
   * mientras el usuario todavía
   * está escribiendo.
   */
  const [
    temporaryLocation,
    setTemporaryLocation,
  ] = useState('');

  /*
   * Al entrar a esta pantalla:
   *
   * Si existe una ubicación del pedido,
   * la mostramos como valor inicial.
   */
  useEffect(() => {
    if (location.trim()) {
      setTemporaryLocation(
        location,
      );
    }
  }, []);

  const cleanLocation =
    temporaryLocation.trim();

  const isLocationValid =
    cleanLocation.length > 0;

  /*
   * =====================================
   * GUARDAR UBICACIÓN TEMPORAL
   * =====================================
   */

  const handleContinue =
    () => {
      /*
       * Esta pantalla solamente debe
       * utilizarse cuando la modalidad
       * sea entrega en oficina.
       */
      if (
        deliveryType !==
        'office'
      ) {
        Alert.alert(
          'Modalidad incorrecta',
          'Esta pantalla solo se utiliza para entregas en oficina.',
          [
            {
              text: 'Regresar',

              onPress: () =>
                router.back(),
            },
          ],
        );

        return;
      }

      if (!cleanLocation) {
        Alert.alert(
          'Ubicación requerida',
          'Escribe el lugar exacto donde deseas recibir tu pedido.',
        );

        return;
      }

      /*
       * Guardamos únicamente la
       * ubicación de ESTE pedido.
       */
      setLocation(
        cleanLocation,
      );

      /*
       * Indicamos que NO estamos
       * utilizando la ubicación habitual.
       */
      setUseProfileLocation(
        false,
      );

      /*
       * Regresamos a delivery.tsx.
       *
       * Ahí aparecerá la ubicación
       * temporal seleccionada.
       */
      router.back();
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
        keyboardShouldPersistTaps="handled"
      >
        <StepHeader
          title="Cambiar ubicación"
          subtitle="Indica dónde deseas recibir este pedido."
          step={3}
          totalSteps={5}
        />

        {/* AVISO */}

        <View
          style={
            styles.informationCard
          }
        >
          <View
            style={
              styles.informationIcon
            }
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={27}
              color="#2871B8"
            />
          </View>

          <View
            style={
              styles.informationContent
            }
          >
            <Text
              style={
                styles.informationTitle
              }
            >
              Cambio solo para este pedido
            </Text>

            <Text
              style={
                styles.informationText
              }
            >
              Tu ubicación habitual no cambiará.
              Solo modificaremos el lugar donde
              recibirás este pedido.
            </Text>
          </View>
        </View>

        {/* UBICACIÓN HABITUAL */}

        {!!profileLocation && (
          <>
            <Text
              style={
                styles.sectionLabel
              }
            >
              Ubicación habitual
            </Text>

            <View
              style={
                styles.profileLocationCard
              }
            >
              <View
                style={
                  styles.profileLocationIcon
                }
              >
                <MaterialCommunityIcons
                  name="map-marker-check-outline"
                  size={27}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <View
                style={
                  styles.profileLocationContent
                }
              >
                <Text
                  style={
                    styles.profileLocationLabel
                  }
                >
                  Registrada en tu perfil
                </Text>

                <Text
                  style={
                    styles.profileLocationValue
                  }
                >
                  {profileLocation}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* NUEVA UBICACIÓN */}

        <Text
          style={
            styles.inputLabel
          }
        >
          Lugar de entrega
        </Text>

        <Text
          style={
            styles.inputDescription
          }
        >
          Escribe el sitio exacto donde deseas
          recibir este pedido.
        </Text>

        <View
          style={[
            styles.inputContainer,

            isLocationValid &&
              styles.inputContainerActive,
          ]}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={27}
            color={
              isLocationValid
                ? COLORS.primary
                : '#7B8491'
            }
          />

          <View
            style={
              styles.inputDivider
            }
          />

          <TextInput
            value={
              temporaryLocation
            }
            onChangeText={
              setTemporaryLocation
            }
            placeholder="Ej. Sistemas"
            placeholderTextColor="#9A9FA8"
            style={
              styles.input
            }
            returnKeyType="done"
            maxLength={80}
            autoCapitalize="sentences"
            onSubmitEditing={
              handleContinue
            }
          />
        </View>

        {/* VISTA PREVIA */}

        {isLocationValid && (
          <View
            style={
              styles.previewCard
            }
          >
            <View
              style={
                styles.previewIcon
              }
            >
              <MaterialCommunityIcons
                name="map-marker-check-outline"
                size={27}
                color={
                  COLORS.primary
                }
              />
            </View>

            <View
              style={
                styles.previewContent
              }
            >
              <Text
                style={
                  styles.previewLabel
                }
              >
                Entregar en
              </Text>

              <Text
                style={
                  styles.previewValue
                }
              >
                {cleanLocation}
              </Text>
            </View>
          </View>
        )}

        {/* EJEMPLOS */}

        <View
          style={
            styles.exampleCard
          }
        >
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={24}
            color="#B87916"
          />

          <Text
            style={
              styles.exampleText
            }
          >
            Ejemplos: Elaboración, Calderas,
            Sistemas, Crédito, Contadores,
            Laboratorio o alguna oficina específica.
          </Text>
        </View>

        {/* ACLARACIÓN */}

        <View
          style={
            styles.adviceCard
          }
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={24}
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.adviceText
            }
          >
            Este cambio no modificará la ubicación
            guardada en tu perfil.
          </Text>
        </View>

        {/* BOTÓN */}

        <View
          style={
            styles.buttonContainer
          }
        >
          <PrimaryButton
            title="Guardar ubicación"
            disabled={
              !isLocationValid
            }
            onPress={
              handleContinue
            }
          />
        </View>
      </ScrollView>
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
      flexGrow: 1,

      paddingHorizontal: 20,

      paddingTop: 50,

      paddingBottom: 40,
    },

    topCircle: {
      position: 'absolute',

      top: -75,

      right: -85,

      width: 200,

      height: 200,

      borderRadius: 100,

      backgroundColor:
        '#E2F3E6',
    },

    bottomCircle: {
      position: 'absolute',

      bottom: -85,

      left: -95,

      width: 215,

      height: 215,

      borderRadius: 108,

      backgroundColor:
        '#FFF0DD',
    },

    informationCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        '#EAF4FF',

      borderRadius: 22,

      padding: 18,

      marginTop: 8,

      marginBottom: 27,

      borderWidth: 1,

      borderColor:
        '#D3E7FA',
    },

    informationIcon: {
      width: 55,

      height: 55,

      borderRadius: 18,

      backgroundColor:
        '#D9EAFE',

      alignItems: 'center',

      justifyContent:
        'center',

      marginRight: 14,
    },

    informationContent: {
      flex: 1,
    },

    informationTitle: {
      color: '#2366A6',

      fontSize: 15,

      fontWeight: '800',

      marginBottom: 5,
    },

    informationText: {
      color: '#557794',

      fontSize: 13,

      lineHeight: 20,
    },

    sectionLabel: {
      color: '#6F7782',

      fontSize: 13,

      fontWeight: '700',

      marginBottom: 9,
    },

    profileLocationCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        '#EDF7EF',

      borderRadius: 19,

      padding: 15,

      marginBottom: 27,

      borderWidth: 1,

      borderColor:
        '#CEE5D2',
    },

    profileLocationIcon: {
      width: 48,

      height: 48,

      borderRadius: 15,

      backgroundColor:
        COLORS.white,

      alignItems: 'center',

      justifyContent:
        'center',

      marginRight: 12,
    },

    profileLocationContent: {
      flex: 1,
    },

    profileLocationLabel: {
      color: COLORS.gray,

      fontSize: 11,
    },

    profileLocationValue: {
      color: COLORS.text,

      fontSize: 16,

      fontWeight: '800',

      marginTop: 3,
    },

    inputLabel: {
      color: COLORS.text,

      fontSize: 18,

      fontWeight: '800',

      marginBottom: 5,
    },

    inputDescription: {
      color: COLORS.gray,

      fontSize: 13,

      lineHeight: 19,

      marginBottom: 13,
    },

    inputContainer: {
      minHeight: 72,

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        COLORS.white,

      borderRadius: 18,

      borderWidth: 1.5,

      borderColor:
        '#C7CCD3',

      paddingHorizontal: 16,
    },

    inputContainerActive: {
      borderColor:
        COLORS.primary,
    },

    inputDivider: {
      width: 1,

      height: 36,

      backgroundColor:
        '#E4E7EA',

      marginHorizontal: 13,
    },

    input: {
      flex: 1,

      color: COLORS.text,

      fontSize: 15,

      paddingVertical: 15,
    },

    previewCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        COLORS.white,

      borderRadius: 18,

      padding: 14,

      marginTop: 15,

      borderWidth: 1,

      borderColor:
        '#DCE9DF',
    },

    previewIcon: {
      width: 47,

      height: 47,

      borderRadius: 15,

      backgroundColor:
        '#E8F5EA',

      alignItems: 'center',

      justifyContent:
        'center',

      marginRight: 12,
    },

    previewContent: {
      flex: 1,
    },

    previewLabel: {
      color: COLORS.gray,

      fontSize: 11,
    },

    previewValue: {
      color: COLORS.text,

      fontSize: 16,

      fontWeight: '800',

      marginTop: 2,
    },

    exampleCard: {
      flexDirection: 'row',

      alignItems: 'flex-start',

      backgroundColor:
        '#FFF8E8',

      borderRadius: 18,

      padding: 15,

      marginTop: 17,

      gap: 10,
    },

    exampleText: {
      flex: 1,

      color: '#8C6A32',

      fontSize: 12,

      lineHeight: 18,
    },

    adviceCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor:
        '#EFF8F1',

      borderRadius: 18,

      padding: 15,

      marginTop: 14,

      gap: 10,
    },

    adviceText: {
      flex: 1,

      color: '#597362',

      fontSize: 12,

      lineHeight: 18,
    },

    buttonContainer: {
      marginTop: 'auto',

      paddingTop: 28,
    },
  });