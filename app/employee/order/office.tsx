import React, {
  useState,
} from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router } from 'expo-router';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import StepHeader from '../../../components/order/StepHeader';

import { COLORS } from '../../../constants/colors';

import {
  useOrder,
} from '../../../context/OrderContext';

export default function OfficeScreen() {
  const {
    deliveryType,
    zone,
    location,
    setLocation,
  } = useOrder();

  const [
    temporaryLocation,
    setTemporaryLocation,
  ] = useState(location);

  const handleContinue = () => {
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

    if (
      !temporaryLocation.trim()
    ) {
      Alert.alert(
        'Ubicación requerida',
        'Escribe el lugar donde deseas recibir este pedido.',
      );

      return;
    }

    /*
     * IMPORTANTE:
     *
     * Solo modificamos location.
     *
     * zone sigue conservando el
     * grupo/área que ya viene
     * desde el perfil del usuario.
     */
    setLocation(
      temporaryLocation.trim(),
    );

    router.push(
      '/employee/order/obsservation',
    );
  };

  return (
    <View style={styles.container}>
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
          step={4}
          totalSteps={5}
        />

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
              size={25}
              color="#3274B9"
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
              Tu área registrada en el perfil no cambiará. Solo modificaremos el lugar donde recibirás este pedido.
            </Text>
          </View>
        </View>

        {!!zone && (
          <View
            style={
              styles.areaCard
            }
          >
            <View
              style={
                styles.areaIcon
              }
            >
              <MaterialCommunityIcons
                name="office-building-outline"
                size={25}
                color={
                  COLORS.primary
                }
              />
            </View>

            <View
              style={
                styles.areaContent
              }
            >
              <Text
                style={
                  styles.areaLabel
                }
              >
                Área registrada
              </Text>

              <Text
                style={
                  styles.areaValue
                }
              >
                {zone}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="lock-outline"
              size={21}
              color={
                COLORS.gray
              }
            />
          </View>
        )}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Lugar de entrega
        </Text>

        <Text
          style={
            styles.sectionSubtitle
          }
        >
          Escribe el sitio exacto donde deseas recibir tu pedido.
        </Text>

        <View
          style={
            styles.inputCard
          }
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={25}
            color={
              COLORS.primary
            }
          />

          <TextInput
            value={
              temporaryLocation
            }
            onChangeText={
              setTemporaryLocation
            }
            placeholder="Ej. Calderas, Sistemas, Crédito..."
            placeholderTextColor={
              COLORS.gray
            }
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={
              handleContinue
            }
            style={
              styles.input
            }
          />
        </View>

        {!!temporaryLocation.trim() && (
          <View
            style={
              styles.selectionCard
            }
          >
            <View
              style={
                styles.selectionIcon
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
                styles.selectionContent
              }
            >
              <Text
                style={
                  styles.selectionLabel
                }
              >
                Entregar en
              </Text>

              <Text
                style={
                  styles.selectionValue
                }
              >
                {
                  temporaryLocation
                }
              </Text>

              {!!zone && (
                <Text
                  style={
                    styles.selectionArea
                  }
                >
                  {zone}
                </Text>
              )}
            </View>
          </View>
        )}

        <View
          style={
            styles.exampleCard
          }
        >
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={21}
            color="#C47A16"
          />

          <Text
            style={
              styles.exampleText
            }
          >
            Ejemplos: Elaboración, Calderas, Sistemas, Crédito, Contadores, Laboratorio o alguna oficina específica.
          </Text>
        </View>

        <View
          style={
            styles.buttonContainer
          }
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={
              styles.cancelButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.cancelText
              }
            >
              Usar ubicación anterior
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Continuar"
            disabled={
              !temporaryLocation.trim()
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
      overflow: 'hidden',
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 40,
    },

    topCircle: {
      position: 'absolute',
      top: -70,
      right: -80,
      width: 190,
      height: 190,
      borderRadius: 95,
      backgroundColor:
        '#E2F3E6',
    },

    bottomCircle: {
      position: 'absolute',
      bottom: -90,
      left: -90,
      width: 210,
      height: 210,
      borderRadius: 105,
      backgroundColor:
        '#FFF0DD',
    },

    informationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#EAF4FF',
      borderRadius: 20,
      padding: 16,
      marginTop: 8,
      marginBottom: 22,
      borderWidth: 1,
      borderColor:
        '#D8EAFB',
    },

    informationIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor:
        '#D8EAFC',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 13,
    },

    informationContent: {
      flex: 1,
    },

    informationTitle: {
      color: '#245D93',
      fontSize: 15,
      fontWeight: '800',
      marginBottom: 4,
    },

    informationText: {
      color: '#52789D',
      fontSize: 13,
      lineHeight: 19,
    },

    areaCard: {
      minHeight: 82,
      backgroundColor:
        '#EDF7EF',
      borderRadius: 19,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        '#D3E7D6',
      marginBottom: 25,
    },

    areaIcon: {
      width: 47,
      height: 47,
      borderRadius: 15,
      backgroundColor:
        COLORS.white,
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 12,
    },

    areaContent: {
      flex: 1,
    },

    areaLabel: {
      color: COLORS.gray,
      fontSize: 11,
    },

    areaValue: {
      marginTop: 3,
      color: COLORS.text,
      fontSize: 14,
      lineHeight: 19,
      fontWeight: '800',
    },

    sectionTitle: {
      color: COLORS.text,
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 5,
    },

    sectionSubtitle: {
      color: COLORS.gray,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 13,
    },

    inputCard: {
      minHeight: 64,
      borderRadius: 19,
      backgroundColor:
        COLORS.white,
      borderWidth: 1.5,
      borderColor:
        '#DCE5DD',
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },

    input: {
      flex: 1,
      height: 62,
      marginLeft: 10,
      color: COLORS.text,
      fontSize: 16,
    },

    selectionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        COLORS.white,
      borderRadius: 20,
      padding: 16,
      marginTop: 15,
      borderWidth: 1,
      borderColor:
        '#DDEADF',
    },

    selectionIcon: {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor:
        '#E9F6EC',
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 12,
    },

    selectionContent: {
      flex: 1,
    },

    selectionLabel: {
      color: COLORS.gray,
      fontSize: 11,
    },

    selectionValue: {
      marginTop: 3,
      color: COLORS.text,
      fontSize: 16,
      fontWeight: '800',
    },

    selectionArea: {
      marginTop: 3,
      color: COLORS.primary,
      fontSize: 11,
      fontWeight: '700',
    },

    exampleCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor:
        '#FFF8E8',
      borderRadius: 16,
      padding: 14,
      marginTop: 16,
    },

    exampleText: {
      flex: 1,
      marginLeft: 9,
      color: '#806337',
      fontSize: 12,
      lineHeight: 18,
    },

    buttonContainer: {
      marginTop: 'auto',
      paddingTop: 25,
    },

    cancelButton: {
      minHeight: 50,
      alignItems: 'center',
      justifyContent:
        'center',
      marginBottom: 10,
    },

    cancelText: {
      color: COLORS.gray,
      fontSize: 13,
      fontWeight: '700',
    },
  });