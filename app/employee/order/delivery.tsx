import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router } from 'expo-router';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import DeliveryCard from '../../../components/order/DeliveryCard';
import StepHeader from '../../../components/order/StepHeader';

import { COLORS } from '../../../constants/colors';

import {
  useOrder,
} from '../../../context/OrderContext';

import {
  useAuth,
} from '../../../context/AuthContext';

import {
  API_URL,
} from '../../../services/api';

type DeliveryType =
  | 'cafeteria'
  | 'office';

type ReportGroup =
  | 'EXTERNAL_PERSONNEL'
  | 'FACTORY_SUGAR_WAREHOUSE'
  | 'ADMINISTRATION_FIELD'
  | 'CORPORATE_PERSONNEL'
  | 'PRACTITIONERS'
  | 'FACTORY_LABORATORY'
  | 'HR_SAFETY_TRAINING';

interface UserProfile {
  id: string;

  employeeNumber:
    | string
    | null;

  name: string;

  department:
    | string
    | null;

  role: string;

  reportGroup:
    | ReportGroup
    | null;

  workLocation:
    | string
    | null;

  externalType:
    | 'VISIT'
    | 'SCHEDULED'
    | 'OTHER_MILL'
    | null;
}

function getReportGroupLabel(
  value:
    | ReportGroup
    | null,
) {
  switch (value) {
    case 'EXTERNAL_PERSONNEL':
      return 'Personal Externo';

    case 'FACTORY_SUGAR_WAREHOUSE':
      return 'Fábrica y Bodega de Azúcar';

    case 'ADMINISTRATION_FIELD':
      return 'Administración y Campo';

    case 'CORPORATE_PERSONNEL':
      return 'Personal Corporativo';

    case 'PRACTITIONERS':
      return 'Practicantes';

    case 'FACTORY_LABORATORY':
      return 'Laboratorio de Fábrica';

    case 'HR_SAFETY_TRAINING':
      return 'Capital Humano, Seguridad Industrial y Capacitación';

    default:
      return '';
  }
}

export default function DeliveryScreen() {
  const {
    user,
  } = useAuth();

  const {
    deliveryType,
    setDeliveryType,

    zone,
    setZone,

    location,
    setLocation,

    profileLocation,
    setProfileLocation,

    useProfileLocation,
    setUseProfileLocation,

    applyProfileLocation,
  } = useOrder();

  const [
    profile,
    setProfile,
  ] =
    useState<UserProfile | null>(
      null,
    );

  const [
    isLoadingProfile,
    setIsLoadingProfile,
  ] =
    useState(false);

  /*
   * =====================================
   * CARGAR PERFIL
   * =====================================
   */

  const loadProfile =
    useCallback(
      async () => {
        if (!user?.id) {
          return;
        }

        try {
          setIsLoadingProfile(
            true,
          );

          const response =
            await fetch(
              `${API_URL}/users/${user.id}`,
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.message ??
                'No fue posible consultar tu información.',
            );
          }

          const currentProfile =
            data as UserProfile;

          setProfile(
            currentProfile,
          );

          /*
           * Guardamos la ubicación habitual
           * en OrderContext.
           */
          const savedLocation =
            currentProfile
              .workLocation
              ?.trim() ?? '';

          setProfileLocation(
            savedLocation,
          );

          /*
           * La zona se obtiene de la
           * clasificación administrativa.
           */
          const groupLabel =
            getReportGroupLabel(
              currentProfile.reportGroup,
            );

          if (groupLabel) {
            setZone(
              groupLabel,
            );
          }

          /*
           * Si todavía no se eligió una
           * ubicación temporal, usamos
           * automáticamente la habitual.
           */
          if (
            savedLocation &&
            useProfileLocation
          ) {
            setLocation(
              savedLocation,
            );
          }
        } catch (error) {
          console.error(
            'Error al consultar perfil:',
            error,
          );
        } finally {
          setIsLoadingProfile(
            false,
          );
        }
      },
      [
        user?.id,
        setLocation,
        setProfileLocation,
        setZone,
        useProfileLocation,
      ],
    );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /*
   * =====================================
   * APLICAR UBICACIÓN HABITUAL
   * =====================================
   */

  const useSavedLocation =
    () => {
      if (!profile) {
        return false;
      }

      const savedLocation =
        profile.workLocation
          ?.trim();

      const groupLabel =
        getReportGroupLabel(
          profile.reportGroup,
        );

      if (
        !savedLocation ||
        !groupLabel
      ) {
        return false;
      }

      setProfileLocation(
        savedLocation,
      );

      setZone(
        groupLabel,
      );

      setLocation(
        savedLocation,
      );

      setUseProfileLocation(
        true,
      );

      return true;
    };

  /*
   * =====================================
   * SELECCIONAR MODALIDAD
   * =====================================
   */

  const handleSelectDelivery =
    (
      type: DeliveryType,
    ) => {
      /*
       * Si toca nuevamente la misma
       * opción, la deseleccionamos.
       */
      if (
        deliveryType === type
      ) {
        setDeliveryType(
          null,
        );

        if (
          type === 'office'
        ) {
          setLocation('');
          setUseProfileLocation(
            true,
          );
        }

        return;
      }

      setDeliveryType(
        type,
      );

      /*
       * RECOGER EN COMEDOR
       *
       * No necesita ubicación.
       */
      if (
        type === 'cafeteria'
      ) {
        setLocation('');

        setUseProfileLocation(
          true,
        );

        return;
      }

      /*
       * ENTREGA EN OFICINA
       *
       * Intentamos utilizar
       * automáticamente la ubicación
       * habitual del perfil.
       */
      if (
        type === 'office'
      ) {
        const success =
          useSavedLocation();

        /*
         * profileLocation puede estar
         * disponible en el contexto aunque
         * el perfil se esté recargando.
         */
        if (
          !success &&
          profileLocation
        ) {
          applyProfileLocation();
        }
      }
    };

  /*
   * =====================================
   * CAMBIAR UBICACIÓN
   * =====================================
   */

  const handleChangeLocation =
    () => {
      /*
       * Muy importante:
       *
       * Esto NO modifica workLocation
       * del perfil.
       *
       * Solo cambia la ubicación
       * del pedido actual.
       */
      setUseProfileLocation(
        false,
      );

      router.push(
        '/employee/order/location',
      );
    };

  /*
   * =====================================
   * RESTAURAR UBICACIÓN HABITUAL
   * =====================================
   */

  const handleUseSavedLocation =
    () => {
      const success =
        useSavedLocation();

      if (
        !success &&
        profileLocation
      ) {
        applyProfileLocation();

        return;
      }

      if (!success) {
        Alert.alert(
          'Ubicación no disponible',
          'Tu perfil todavía no tiene una ubicación habitual registrada.',
        );
      }
    };

  /*
   * =====================================
   * CONTINUAR
   * =====================================
   */

  const handleContinue =
    () => {
      if (!deliveryType) {
        Alert.alert(
          'Selecciona una modalidad',
          'Elige dónde deseas recibir tu pedido.',
        );

        return;
      }

      /*
       * RECOGER EN COMEDOR
       *
       * Va directamente a observaciones.
       */
      if (
        deliveryType ===
        'cafeteria'
      ) {
        setLocation('');

        router.push(
          '/employee/order/obsservation',
        );

        return;
      }

      /*
       * ENTREGA EN OFICINA
       *
       * Ya no pasamos por office.tsx.
       */
      if (
        deliveryType ===
        'office'
      ) {
        if (
          !location.trim()
        ) {
          Alert.alert(
            'Ubicación requerida',
            'No encontramos una ubicación habitual. Indica dónde deseas recibir este pedido.',
            [
              {
                text:
                  'Cancelar',
                style:
                  'cancel',
              },
              {
                text:
                  'Indicar ubicación',
                onPress:
                  handleChangeLocation,
              },
            ],
          );

          return;
        }

        router.push(
          '/employee/order/obsservation',
        );
      }
    };

  const hasOfficeLocation =
    deliveryType ===
      'office' &&
    !!location.trim();

  /*
   * Determina si actualmente
   * estamos utilizando una ubicación
   * diferente a la habitual.
   */
  const isTemporaryLocation =
    deliveryType ===
      'office' &&
    !useProfileLocation &&
    !!location.trim();

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.decorativeCircleOne
        }
      />

      <View
        style={
          styles.decorativeCircleTwo
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
          title="¿Dónde deseas recibir tu pedido?"
          subtitle="Selecciona la modalidad de entrega."
          step={3}
          totalSteps={5}
        />

        {/* INFORMACIÓN */}

        <View
          style={
            styles.infoContainer
          }
        >
          <View
            style={
              styles.infoIcon
            }
          >
            <MaterialCommunityIcons
              name="map-marker-check-outline"
              size={21}
              color="#3569A8"
            />
          </View>

          <Text
            style={
              styles.infoText
            }
          >
            Si eliges entrega en oficina utilizaremos automáticamente tu ubicación habitual.
          </Text>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          Opciones de entrega
        </Text>

        {/* COMEDOR */}

        <DeliveryCard
          icon="silverware-fork-knife"
          title="Recoger en comedor"
          description="Recoge tu pedido directamente en el comedor cuando esté listo."
          helperText="No será necesario indicar una ubicación."
          selected={
            deliveryType ===
            'cafeteria'
          }
          onPress={() =>
            handleSelectDelivery(
              'cafeteria',
            )
          }
        />

        {/* OFICINA */}

        <DeliveryCard
          icon="office-building-marker-outline"
          title="Entrega en oficina"
          description="Recibe tu pedido directamente en tu área de trabajo."
          helperText="Usaremos tu ubicación habitual."
          selected={
            deliveryType ===
            'office'
          }
          onPress={() =>
            handleSelectDelivery(
              'office',
            )
          }
        />

        {/* UBICACIÓN */}

        {deliveryType ===
          'office' && (
          <View
            style={
              styles.locationSection
            }
          >
            {isLoadingProfile &&
            !hasOfficeLocation ? (
              <View
                style={
                  styles.loadingLocation
                }
              >
                <ActivityIndicator
                  color={
                    COLORS.primary
                  }
                />

                <Text
                  style={
                    styles.loadingLocationText
                  }
                >
                  Consultando tu ubicación...
                </Text>
              </View>
            ) : hasOfficeLocation ? (
              <>
                <View
                  style={[
                    styles.savedLocationCard,

                    isTemporaryLocation &&
                      styles.temporaryLocationCard,
                  ]}
                >
                  <View
                    style={
                      styles.locationIcon
                    }
                  >
                    <MaterialCommunityIcons
                      name={
                        isTemporaryLocation
                          ? 'map-marker-outline'
                          : 'map-marker-check-outline'
                      }
                      size={25}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.locationContent
                    }
                  >
                    <Text
                      style={
                        styles.locationLabel
                      }
                    >
                      {isTemporaryLocation
                        ? 'Ubicación para este pedido'
                        : 'Tu ubicación habitual'}
                    </Text>

                    <Text
                      style={
                        styles.locationValue
                      }
                    >
                      {location}
                    </Text>

                    {isTemporaryLocation && (
                      <Text
                        style={
                          styles.temporaryText
                        }
                      >
                        Tu perfil no será modificado.
                      </Text>
                    )}
                  </View>

                  <MaterialCommunityIcons
                    name="check-circle"
                    size={26}
                    color="#268A4B"
                  />
                </View>

                <TouchableOpacity
                  style={
                    styles.changeButton
                  }
                  activeOpacity={
                    0.8
                  }
                  onPress={
                    handleChangeLocation
                  }
                >
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.changeButtonText
                    }
                  >
                    Cambiar ubicación para este pedido
                  </Text>
                </TouchableOpacity>

                {isTemporaryLocation &&
                  !!profileLocation && (
                    <TouchableOpacity
                      style={
                        styles.restoreButton
                      }
                      activeOpacity={
                        0.8
                      }
                      onPress={
                        handleUseSavedLocation
                      }
                    >
                      <MaterialCommunityIcons
                        name="backup-restore"
                        size={19}
                        color={
                          COLORS.primary
                        }
                      />

                      <Text
                        style={
                          styles.restoreButtonText
                        }
                      >
                        Usar nuevamente {profileLocation}
                      </Text>
                    </TouchableOpacity>
                  )}
              </>
            ) : (
              <>
                <View
                  style={
                    styles.noLocationCard
                  }
                >
                  <MaterialCommunityIcons
                    name="map-marker-alert-outline"
                    size={25}
                    color="#C97716"
                  />

                  <View
                    style={
                      styles.noLocationContent
                    }
                  >
                    <Text
                      style={
                        styles.noLocationTitle
                      }
                    >
                      Sin ubicación habitual
                    </Text>

                    <Text
                      style={
                        styles.noLocationText
                      }
                    >
                      Indica dónde deseas recibir este pedido.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={
                    styles.changeButton
                  }
                  activeOpacity={
                    0.8
                  }
                  onPress={
                    handleChangeLocation
                  }
                >
                  <MaterialCommunityIcons
                    name="map-marker-plus-outline"
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.changeButtonText
                    }
                  >
                    Indicar ubicación
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* RESUMEN */}

        {deliveryType && (
          <View
            style={
              styles.selectionSummary
            }
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={21}
              color="#268A4B"
            />

            <View
              style={
                styles.selectionSummaryContent
              }
            >
              <Text
                style={
                  styles.selectionSummaryLabel
                }
              >
                Modalidad seleccionada
              </Text>

              <Text
                style={
                  styles.selectionSummaryValue
                }
              >
                {deliveryType ===
                'cafeteria'
                  ? 'Recoger en comedor'
                  : 'Entrega en oficina'}
              </Text>
            </View>
          </View>
        )}

        <View
          style={
            styles.buttonContainer
          }
        >
          <PrimaryButton
            title="Continuar"
            disabled={
              !deliveryType ||
              (
                deliveryType ===
                  'office' &&
                isLoadingProfile &&
                !location.trim()
              )
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
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 40,
      flexGrow: 1,
    },

    decorativeCircleOne: {
      position: 'absolute',
      top: -75,
      right: -70,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor:
        '#E7F3E9',
    },

    decorativeCircleTwo: {
      position: 'absolute',
      bottom: 85,
      left: -95,
      width: 185,
      height: 185,
      borderRadius: 93,
      backgroundColor:
        '#FFF0DF',
    },

    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#EEF5FC',
      borderRadius: 18,
      padding: 14,
      marginBottom: 23,
      borderWidth: 1,
      borderColor:
        '#DCEAF8',
    },

    infoIcon: {
      width: 39,
      height: 39,
      borderRadius: 20,
      backgroundColor:
        '#DDEBFA',
      justifyContent:
        'center',
      alignItems:
        'center',
      marginRight: 11,
    },

    infoText: {
      flex: 1,
      color: '#4B6179',
      fontSize: 13,
      lineHeight: 19,
    },

    sectionTitle: {
      marginBottom: 13,
      color: '#374151',
      fontSize: 16,
      fontWeight: '800',
    },

    locationSection: {
      marginTop: 3,
      marginBottom: 13,
    },

    loadingLocation: {
      minHeight: 85,
      backgroundColor:
        COLORS.white,
      borderRadius: 18,
      justifyContent:
        'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 9,
    },

    loadingLocationText: {
      color: COLORS.gray,
      fontSize: 13,
    },

    savedLocationCard: {
      minHeight: 90,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#EDF7EF',
      borderRadius: 19,
      padding: 15,
      borderWidth: 1,
      borderColor:
        '#CEE5D2',
    },

    temporaryLocationCard: {
      backgroundColor:
        '#F3F8F4',
    },

    locationIcon: {
      width: 47,
      height: 47,
      borderRadius: 15,
      backgroundColor:
        COLORS.white,
      justifyContent:
        'center',
      alignItems:
        'center',
      marginRight: 12,
    },

    locationContent: {
      flex: 1,
    },

    locationLabel: {
      color: COLORS.gray,
      fontSize: 11,
    },

    locationValue: {
      marginTop: 3,
      color: COLORS.text,
      fontSize: 16,
      fontWeight: '800',
    },

    temporaryText: {
      marginTop: 3,
      color: COLORS.gray,
      fontSize: 11,
    },

    noLocationCard: {
      minHeight: 80,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#FFF8E8',
      borderRadius: 18,
      padding: 14,
    },

    noLocationContent: {
      flex: 1,
      marginLeft: 10,
    },

    noLocationTitle: {
      color: '#8A5A12',
      fontSize: 13,
      fontWeight: '800',
    },

    noLocationText: {
      marginTop: 3,
      color: '#8C7553',
      fontSize: 12,
    },

    changeButton: {
      minHeight: 47,
      marginTop: 10,
      borderRadius: 16,
      backgroundColor:
        COLORS.white,
      borderWidth: 1,
      borderColor:
        '#D9E4DB',
      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems:
        'center',
      gap: 7,
    },

    changeButtonText: {
      color:
        COLORS.primary,
      fontSize: 12,
      fontWeight: '800',
    },

    restoreButton: {
      minHeight: 44,
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 6,
    },

    restoreButtonText: {
      color:
        COLORS.primary,
      fontSize: 12,
      fontWeight: '700',
    },

    selectionSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#FFFFFF',
      borderRadius: 17,
      padding: 14,
      marginTop: 2,
      borderWidth: 1,
      borderColor:
        '#DCE9DF',
    },

    selectionSummaryContent: {
      flex: 1,
      marginLeft: 10,
    },

    selectionSummaryLabel: {
      color: '#7A7F87',
      fontSize: 11,
      fontWeight: '600',
    },

    selectionSummaryValue: {
      marginTop: 2,
      color: '#1F2937',
      fontSize: 14,
      fontWeight: '800',
    },

    buttonContainer: {
      marginTop: 'auto',
      paddingTop: 20,
    },
  });