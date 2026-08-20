import React, {
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
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

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { COLORS } from '../../constants/colors';
import { API_URL } from '../../services/api';

type ReportGroup =
  | 'EXTERNAL_PERSONNEL'
  | 'FACTORY_SUGAR_WAREHOUSE'
  | 'ADMINISTRATION_FIELD'
  | 'CORPORATE_PERSONNEL'
  | 'PRACTITIONERS'
  | 'FACTORY_LABORATORY'
  | 'HR_SAFETY_TRAINING';

type ExternalPersonnelType =
  | 'VISIT'
  | 'SCHEDULED'
  | 'OTHER_MILL';

interface GroupOption {
  value: ReportGroup;
  label: string;
  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;
}

interface SaveClassificationResponse {
  message: string;

  user: {
    id: string;
    reportGroup: ReportGroup;
    workLocation: string | null;
    externalType:
      | ExternalPersonnelType
      | null;
  };
}

const employeeGroups:
  GroupOption[] = [
    {
      value:
        'EXTERNAL_PERSONNEL',
      label:
        'Personal Externo',
      icon:
        'account-multiple-outline',
    },
    {
      value:
        'FACTORY_SUGAR_WAREHOUSE',
      label:
        'Fábrica y Bodega de Azúcar',
      icon:
        'factory',
    },
    {
      value:
        'ADMINISTRATION_FIELD',
      label:
        'Administración y Campo',
      icon:
        'office-building-outline',
    },
    {
      value:
        'CORPORATE_PERSONNEL',
      label:
        'Personal Corporativo',
      icon:
        'account-tie-outline',
    },
    {
      value:
        'FACTORY_LABORATORY',
      label:
        'Laboratorio de Fábrica',
      icon:
        'flask-outline',
    },
    {
      value:
        'HR_SAFETY_TRAINING',
      label:
        'Capital Humano, Seguridad Industrial y Capacitación',
      icon:
        'shield-account-outline',
    },
  ];

const externalTypes: {
  value:
    ExternalPersonnelType;
  label: string;
}[] = [
  {
    value:
      'VISIT',
    label:
      'Visitas',
  },
  {
    value:
      'SCHEDULED',
    label:
      'Por horarios',
  },
  {
    value:
      'OTHER_MILL',
    label:
      'Otros ingenios',
  },
];

export default function ClassificationScreen() {
  const {
    userId,
    name,
    role,
  } =
    useLocalSearchParams<{
      userId?: string;
      name?: string;
      role?: string;
    }>();

  const isPractitioner =
    role ===
    'PRACTITIONER';

  const [
    reportGroup,
    setReportGroup,
  ] =
    useState<
      ReportGroup | null
    >(
      isPractitioner
        ? 'PRACTITIONERS'
        : null,
    );

  const [
    externalType,
    setExternalType,
  ] =
    useState<
      ExternalPersonnelType | null
    >(null);

  const [
    workLocation,
    setWorkLocation,
  ] =
    useState('');

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const visibleGroups =
    useMemo(() => {
      if (
        isPractitioner
      ) {
        return [];
      }

      return employeeGroups;
    }, [
      isPractitioner,
    ]);

  const handleSelectGroup =
    (
      value:
        ReportGroup,
    ) => {
      if (
        isPractitioner
      ) {
        return;
      }

      setReportGroup(
        value,
      );

      if (
        value !==
        'EXTERNAL_PERSONNEL'
      ) {
        setExternalType(
          null,
        );
      }
    };

  const validate =
    () => {
      if (!userId) {
        Alert.alert(
          'Error',
          'No se encontró el usuario.',
        );

        return false;
      }

      if (
        !reportGroup
      ) {
        Alert.alert(
          'Selecciona tu área',
          'Debes seleccionar el grupo al que perteneces.',
        );

        return false;
      }

      if (
        reportGroup ===
          'EXTERNAL_PERSONNEL' &&
        !externalType
      ) {
        Alert.alert(
          'Selecciona una opción',
          'Indica el tipo de personal externo.',
        );

        return false;
      }

      if (
        !workLocation.trim()
      ) {
        Alert.alert(
          'Ubicación requerida',
          'Especifica tu ubicación habitual.',
        );

        return false;
      }

      return true;
    };

  const handleSave =
    async () => {
      if (
        isSaving ||
        !validate() ||
        !userId ||
        !reportGroup
      ) {
        return;
      }

      try {
        setIsSaving(
          true,
        );

        const response =
          await fetch(
            `${API_URL}/users/${userId}/classification`,
            {
              method:
                'PATCH',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  reportGroup,

                  workLocation:
                    workLocation.trim(),

                  externalType:
                    reportGroup ===
                    'EXTERNAL_PERSONNEL'
                      ? externalType
                      : null,
                }),
            },
          );

        const data =
          (await response.json()) as
            | SaveClassificationResponse
            | {
                message?: string;
              };

        if (
          !response.ok
        ) {
          const message =
            'message' in
              data &&
            data.message
              ? data.message
              : 'No fue posible guardar tu información.';

          throw new Error(
            message,
          );
        }

        Alert.alert(
          'Perfil completado',
          isPractitioner
            ? 'Tu ubicación quedó guardada correctamente.'
            : 'Tu área y ubicación quedaron guardadas correctamente.',
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
          'Error al guardar clasificación:',
          error,
        );

        Alert.alert(
          'No fue posible guardar',

          error instanceof
          Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setIsSaving(
          false,
        );
      }
    };

  return (
    <View
      style={
        styles.screen
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.headerIcon
            }
          >
            <MaterialCommunityIcons
              name={
                isPractitioner
                  ? 'school-outline'
                  : 'account-check-outline'
              }
              size={34}
              color={
                COLORS.primary
              }
            />
          </View>

          <Text
            style={
              styles.step
            }
          >
            Último paso
          </Text>

          <Text
            style={
              styles.title
            }
          >
            Completa tu perfil
          </Text>

          {!!name && (
            <Text
              style={
                styles.welcome
              }
            >
              Hola, {name}
            </Text>
          )}

          <Text
            style={
              styles.subtitle
            }
          >
            {isPractitioner
              ? 'Indica tu ubicación habitual para agilizar tus pedidos dentro del comedor digital.'
              : 'Esta información nos ayudará a agilizar tus pedidos y organizar correctamente los reportes.'}
          </Text>
        </View>

        {isPractitioner ? (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Tipo de usuario
            </Text>

            <View
              style={
                styles.practitionerCard
              }
            >
              <View
                style={
                  styles.practitionerIcon
                }
              >
                <MaterialCommunityIcons
                  name="school-outline"
                  size={28}
                  color="#FFFFFF"
                />
              </View>

              <View
                style={
                  styles.practitionerContent
                }
              >
                <Text
                  style={
                    styles.practitionerLabel
                  }
                >
                  Practicante
                </Text>

                <Text
                  style={
                    styles.practitionerDescription
                  }
                >
                  Tu cuenta ya pertenece al grupo de practicantes.
                </Text>
              </View>

              <MaterialCommunityIcons
                name="check-circle"
                size={27}
                color={
                  COLORS.primary
                }
              />
            </View>
          </>
        ) : (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Área a la que perteneces
            </Text>

            <View
              style={
                styles.groupsContainer
              }
            >
              {visibleGroups.map(
                option => {
                  const selected =
                    reportGroup ===
                    option.value;

                  return (
                    <TouchableOpacity
                      key={
                        option.value
                      }
                      activeOpacity={
                        0.85
                      }
                      style={[
                        styles.groupCard,

                        selected &&
                          styles.groupCardSelected,
                      ]}
                      onPress={() =>
                        handleSelectGroup(
                          option.value,
                        )
                      }
                    >
                      <View
                        style={[
                          styles.groupIcon,

                          selected &&
                            styles.groupIconSelected,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={
                            option.icon
                          }
                          size={27}
                          color={
                            selected
                              ? COLORS.white
                              : COLORS.primary
                          }
                        />
                      </View>

                      <Text
                        style={[
                          styles.groupLabel,

                          selected &&
                            styles.groupLabelSelected,
                        ]}
                      >
                        {
                          option.label
                        }
                      </Text>

                      <MaterialCommunityIcons
                        name={
                          selected
                            ? 'check-circle'
                            : 'circle-outline'
                        }
                        size={25}
                        color={
                          selected
                            ? COLORS.primary
                            : '#ADB5AE'
                        }
                      />
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </>
        )}

        {!isPractitioner &&
          reportGroup ===
            'EXTERNAL_PERSONNEL' && (
            <>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Tipo de personal externo
              </Text>

              <View
                style={
                  styles.externalContainer
                }
              >
                {externalTypes.map(
                  option => {
                    const selected =
                      externalType ===
                      option.value;

                    return (
                      <TouchableOpacity
                        key={
                          option.value
                        }
                        activeOpacity={
                          0.85
                        }
                        style={[
                          styles.externalButton,

                          selected &&
                            styles.externalButtonSelected,
                        ]}
                        onPress={() =>
                          setExternalType(
                            option.value,
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.externalText,

                            selected &&
                              styles.externalTextSelected,
                          ]}
                        >
                          {
                            option.label
                          }
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            </>
          )}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Ubicación habitual
        </Text>

        <Text
          style={
            styles.helperText
          }
        >
          {isPractitioner
            ? 'Escribe el área donde realizas normalmente tus actividades.'
            : 'Escribe el lugar específico donde trabajas normalmente.'}
        </Text>

        <View
          style={
            styles.locationCard
          }
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={24}
            color={
              COLORS.primary
            }
          />

          <TextInput
            value={
              workLocation
            }
            onChangeText={
              setWorkLocation
            }
            placeholder={
              isPractitioner
                ? 'Ej. Sistemas, Laboratorio, Administración...'
                : 'Ej. Elaboración, Sistemas, Calderas...'
            }
            placeholderTextColor={
              COLORS.gray
            }
            editable={
              !isSaving
            }
            autoCapitalize="sentences"
            maxLength={80}
            style={
              styles.input
            }
          />
        </View>

        <View
          style={
            styles.infoCard
          }
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color={
              COLORS.primary
            }
          />

          <Text
            style={
              styles.infoText
            }
          >
            Esta ubicación se utilizará automáticamente en tus pedidos para evitar que tengas que escribirla cada vez.
          </Text>
        </View>

        <TouchableOpacity
          disabled={
            isSaving
          }
          activeOpacity={
            0.85
          }
          style={[
            styles.saveButton,

            isSaving &&
              styles.saveButtonDisabled,
          ]}
          onPress={
            handleSave
          }
        >
          {isSaving ? (
            <>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.saveText
                }
              >
                Guardando...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={
                  styles.saveText
                }
              >
                Guardar y continuar
              </Text>

              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="#FFFFFF"
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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

    content: {
      width:
        '100%',

      maxWidth:
        720,

      alignSelf:
        'center',

      paddingHorizontal:
        24,

      paddingTop:
        45,

      paddingBottom:
        45,
    },

    header: {
      alignItems:
        'center',

      marginBottom:
        30,
    },

    headerIcon: {
      width: 72,

      height: 72,

      borderRadius:
        23,

      backgroundColor:
        '#E7F3E9',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom:
        15,
    },

    step: {
      color:
        COLORS.primary,

      fontSize:
        13,

      fontWeight:
        '900',
    },

    title: {
      marginTop:
        5,

      fontSize:
        31,

      fontWeight:
        '900',

      color:
        COLORS.text,

      textAlign:
        'center',
    },

    welcome: {
      marginTop:
        8,

      fontSize:
        17,

      fontWeight:
        '800',

      color:
        COLORS.primary,
    },

    subtitle: {
      marginTop:
        9,

      maxWidth:
        570,

      color:
        COLORS.gray,

      fontSize:
        14,

      lineHeight:
        21,

      textAlign:
        'center',
    },

    sectionTitle: {
      color:
        COLORS.text,

      fontSize:
        18,

      fontWeight:
        '900',

      marginBottom:
        11,

      marginTop:
        5,
    },

    groupsContainer: {
      marginBottom:
        25,
    },

    groupCard: {
      minHeight:
        72,

      backgroundColor:
        COLORS.white,

      borderRadius:
        19,

      borderWidth:
        1.5,

      borderColor:
        '#E0E7E1',

      paddingHorizontal:
        14,

      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom:
        10,
    },

    groupCardSelected: {
      borderColor:
        COLORS.primary,

      backgroundColor:
        '#EDF7EF',
    },

    groupIcon: {
      width:
        46,

      height:
        46,

      borderRadius:
        15,

      backgroundColor:
        '#EAF5EC',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight:
        12,
    },

    groupIconSelected: {
      backgroundColor:
        COLORS.primary,
    },

    groupLabel: {
      flex:
        1,

      paddingRight:
        10,

      color:
        COLORS.text,

      fontSize:
        14,

      lineHeight:
        19,

      fontWeight:
        '700',
    },

    groupLabelSelected: {
      color:
        COLORS.primary,

      fontWeight:
        '900',
    },

    practitionerCard: {
      minHeight:
        88,

      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#EDF7EF',

      borderRadius:
        20,

      paddingHorizontal:
        16,

      paddingVertical:
        14,

      marginBottom:
        27,

      borderWidth:
        1.5,

      borderColor:
        COLORS.primary,
    },

    practitionerIcon: {
      width:
        52,

      height:
        52,

      borderRadius:
        17,

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        COLORS.primary,

      marginRight:
        13,
    },

    practitionerContent: {
      flex:
        1,

      paddingRight:
        10,
    },

    practitionerLabel: {
      color:
        COLORS.primary,

      fontSize:
        16,

      fontWeight:
        '900',
    },

    practitionerDescription: {
      marginTop:
        3,

      color:
        '#647269',

      fontSize:
        12,

      lineHeight:
        17,
    },

    externalContainer: {
      flexDirection:
        'row',

      flexWrap:
        'wrap',

      gap:
        9,

      marginBottom:
        25,
    },

    externalButton: {
      paddingHorizontal:
        17,

      paddingVertical:
        12,

      borderRadius:
        17,

      backgroundColor:
        COLORS.white,

      borderWidth:
        1.5,

      borderColor:
        '#DFE6E0',
    },

    externalButtonSelected: {
      backgroundColor:
        COLORS.primary,

      borderColor:
        COLORS.primary,
    },

    externalText: {
      color:
        COLORS.text,

      fontSize:
        13,

      fontWeight:
        '700',
    },

    externalTextSelected: {
      color:
        COLORS.white,

      fontWeight:
        '900',
    },

    helperText: {
      marginTop:
        -4,

      marginBottom:
        10,

      color:
        COLORS.gray,

      fontSize:
        12,
    },

    locationCard: {
      minHeight:
        62,

      paddingHorizontal:
        15,

      backgroundColor:
        COLORS.white,

      borderWidth:
        1.5,

      borderColor:
        '#DCE5DD',

      borderRadius:
        18,

      flexDirection:
        'row',

      alignItems:
        'center',
    },

    input: {
      flex:
        1,

      height:
        60,

      marginLeft:
        10,

      color:
        COLORS.text,

      fontSize:
        15,
    },

    infoCard: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      marginTop:
        16,

      padding:
        14,

      backgroundColor:
        '#EAF5EC',

      borderRadius:
        16,
    },

    infoText: {
      flex:
        1,

      marginLeft:
        9,

      color:
        '#4C5B4E',

      fontSize:
        12,

      lineHeight:
        18,
    },

    saveButton: {
      minHeight:
        64,

      marginTop:
        28,

      borderRadius:
        21,

      backgroundColor:
        COLORS.primary,

      justifyContent:
        'center',

      alignItems:
        'center',

      flexDirection:
        'row',

      gap:
        9,
    },

    saveButtonDisabled: {
      opacity:
        0.6,
    },

    saveText: {
      color:
        '#FFFFFF',

      fontSize:
        17,

      fontWeight:
        '900',
    },
  });