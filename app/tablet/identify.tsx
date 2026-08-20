import React, {
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

type PersonType =
  | 'EMPLOYEE'
  | 'PRACTITIONER'
  | 'EXTERNAL';

type ExternalType =
  | 'VISIT'
  | 'SCHEDULED'
  | 'OTHER_MILL';

interface PersonUser {
  id: string;
  employeeNumber: string | null;
  name: string;
  department: string | null;
  role: string;

  reportGroup: string | null;
  workLocation: string | null;
  externalType: ExternalType | null;
}

interface TabletIdentifyResponse {
  personType: PersonType;

  user: PersonUser;

  practitioner?: {
    id: string;
    accessCode: string;
    startDate: string;
    endDate: string;
  };

  external?: {
    id: string;
    accessCode: string;
    type: ExternalType;
    startDate: string;
    endDate: string;
  };
}

function getExternalTypeLabel(
  value: ExternalType | null,
) {
  switch (value) {
    case 'VISIT':
      return 'Visita';

    case 'SCHEDULED':
      return 'Por horarios';

    case 'OTHER_MILL':
      return 'Otro ingenio';

    default:
      return '';
  }
}

export default function TabletIdentifyScreen() {
  const {
    dishId,
    dishName,
    service,
    observations,
  } = useLocalSearchParams<{
    dishId?: string;
    dishName?: string;
    service?: string;
    observations?: string;
  }>();

  const [
    personType,
    setPersonType,
  ] =
    useState<PersonType>(
      'EMPLOYEE',
    );

  const [
    identifier,
    setIdentifier,
  ] = useState('');

  const [
    person,
    setPerson,
  ] =
    useState<TabletIdentifyResponse | null>(
      null,
    );

  const [
    isSearching,
    setIsSearching,
  ] = useState(false);

  const handleChangeType = (
    type: PersonType,
  ) => {
    setPersonType(type);
    setIdentifier('');
    setPerson(null);
  };

  const handleSearch =
    async () => {
      const value =
        identifier
          .trim()
          .toUpperCase();

      if (!value) {
        let title =
          'Código requerido';

        let message =
          'Ingresa tu código de acceso.';

        if (
          personType ===
          'EMPLOYEE'
        ) {
          title =
            'Número requerido';

          message =
            'Ingresa tu número de trabajador.';
        }

        if (
          personType ===
          'PRACTITIONER'
        ) {
          message =
            'Ingresa tu código de practicante.';
        }

        if (
          personType ===
          'EXTERNAL'
        ) {
          message =
            'Ingresa tu código de personal externo.';
        }

        Alert.alert(
          title,
          message,
        );

        return;
      }

      try {
        setIsSearching(true);
        setPerson(null);

        const response =
          await fetch(
            `${API_URL}/users/tablet/identify/${encodeURIComponent(
              value,
            )}`,
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              'No fue posible identificar al usuario.',
          );
        }

        const result =
          data as TabletIdentifyResponse;

        if (
          result.personType !==
          personType
        ) {
          let message =
            'El identificador corresponde a otro tipo de usuario.';

          if (
            result.personType ===
            'EMPLOYEE'
          ) {
            message =
              'El identificador corresponde a un empleado. Selecciona la opción Empleado.';
          }

          if (
            result.personType ===
            'PRACTITIONER'
          ) {
            message =
              'El código corresponde a un practicante. Selecciona la opción Practicante.';
          }

          if (
            result.personType ===
            'EXTERNAL'
          ) {
            message =
              'El código corresponde a personal externo. Selecciona la opción Personal Externo.';
          }

          Alert.alert(
            'Tipo incorrecto',
            message,
          );

          return;
        }

        setPerson(result);
      } catch (error) {
        Alert.alert(
          'No fue posible identificarte',

          error instanceof Error
            ? error.message
            : 'No fue posible consultar los datos.',
        );
      } finally {
        setIsSearching(false);
      }
    };

  const handleContinue =
    () => {
      if (!person) {
        Alert.alert(
          'Identificación requerida',
          'Primero busca tus datos.',
        );

        return;
      }

      const personIdentifier =
        person.user.employeeNumber ??
        person.practitioner
          ?.accessCode ??
        person.external
          ?.accessCode ??
        '';

      router.push({
        pathname:
          '/tablet/signature',

        params: {
          userId:
            person.user.id,

          employeeNumber:
            personIdentifier,

          employeeName:
            person.user.name,

          department:
            person.user
              .workLocation ??
            person.user
              .department ??
            '',

          dishId:
            dishId ?? '',

          dishName:
            dishName ?? '',

          service:
            service ?? '',

          observations:
            observations ?? '',
        },
      });
    };

  const inputTitle =
    personType === 'EMPLOYEE'
      ? 'Número de trabajador'
      : personType ===
          'PRACTITIONER'
        ? 'Código de practicante'
        : 'Código de personal externo';

  const inputDescription =
    personType === 'EMPLOYEE'
      ? 'Ingresa el número asignado por la empresa.'
      : personType ===
          'PRACTITIONER'
        ? 'Ingresa el código temporal que te fue asignado.'
        : 'Ingresa el código temporal asignado para tu visita o acceso.';

  const inputPlaceholder =
    personType === 'EMPLOYEE'
      ? 'Ej. 1001'
      : personType ===
          'PRACTITIONER'
        ? 'Ej. PRAC-123456'
        : 'Ej. EXT-123456';

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              router.back()
            }
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={27}
              color={
                COLORS.text
              }
            />
          </TouchableOpacity>

          <View
            style={
              styles.headerText
            }
          >
            <Text
              style={styles.step}
            >
              Pedido rápido
            </Text>

            <Text
              style={styles.title}
            >
              Identifícate
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Selecciona tu tipo de acceso.
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          ¿Quién realiza el pedido?
        </Text>

        <View
          style={
            styles.typeContainer
          }
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.typeButton,

              personType ===
                'EMPLOYEE' &&
                styles.typeButtonSelected,
            ]}
            onPress={() =>
              handleChangeType(
                'EMPLOYEE',
              )
            }
          >
            <View
              style={[
                styles.typeIcon,

                personType ===
                  'EMPLOYEE' &&
                  styles.typeIconSelected,
              ]}
            >
              <MaterialCommunityIcons
                name="badge-account-outline"
                size={30}
                color={
                  personType ===
                  'EMPLOYEE'
                    ? COLORS.white
                    : COLORS.primary
                }
              />
            </View>

            <Text
              style={[
                styles.typeTitle,

                personType ===
                  'EMPLOYEE' &&
                  styles.typeTitleSelected,
              ]}
            >
              Empleado
            </Text>

            <Text
              style={
                styles.typeDescription
              }
            >
              Número de trabajador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.typeButton,

              personType ===
                'PRACTITIONER' &&
                styles.typeButtonSelected,
            ]}
            onPress={() =>
              handleChangeType(
                'PRACTITIONER',
              )
            }
          >
            <View
              style={[
                styles.typeIcon,

                personType ===
                  'PRACTITIONER' &&
                  styles.typeIconSelected,
              ]}
            >
              <MaterialCommunityIcons
                name="school-outline"
                size={30}
                color={
                  personType ===
                  'PRACTITIONER'
                    ? COLORS.white
                    : COLORS.primary
                }
              />
            </View>

            <Text
              style={[
                styles.typeTitle,

                personType ===
                  'PRACTITIONER' &&
                  styles.typeTitleSelected,
              ]}
            >
              Practicante
            </Text>

            <Text
              style={
                styles.typeDescription
              }
            >
              Código temporal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.typeButton,

              personType ===
                'EXTERNAL' &&
                styles.typeButtonSelected,
            ]}
            onPress={() =>
              handleChangeType(
                'EXTERNAL',
              )
            }
          >
            <View
              style={[
                styles.typeIcon,

                personType ===
                  'EXTERNAL' &&
                  styles.typeIconSelected,
              ]}
            >
              <MaterialCommunityIcons
                name="account-group-outline"
                size={30}
                color={
                  personType ===
                  'EXTERNAL'
                    ? COLORS.white
                    : COLORS.primary
                }
              />
            </View>

            <Text
              style={[
                styles.typeTitle,

                personType ===
                  'EXTERNAL' &&
                  styles.typeTitleSelected,
              ]}
            >
              Personal Externo
            </Text>

            <Text
              style={
                styles.typeDescription
              }
            >
              Código temporal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View
            style={
              styles.iconContainer
            }
          >
            <MaterialCommunityIcons
              name={
                personType ===
                'EMPLOYEE'
                  ? 'card-account-details-outline'
                  : personType ===
                      'PRACTITIONER'
                    ? 'key-outline'
                    : 'account-key-outline'
              }
              size={42}
              color={
                COLORS.primary
              }
            />
          </View>

          <Text
            style={
              styles.cardTitle
            }
          >
            {inputTitle}
          </Text>

          <Text
            style={
              styles.cardDescription
            }
          >
            {inputDescription}
          </Text>

          <TextInput
            value={identifier}
            onChangeText={value => {
              setIdentifier(
                personType ===
                'EMPLOYEE'
                  ? value
                  : value.toUpperCase(),
              );

              setPerson(null);
            }}
            placeholder={
              inputPlaceholder
            }
            placeholderTextColor={
              COLORS.gray
            }
            keyboardType={
              personType ===
              'EMPLOYEE'
                ? 'number-pad'
                : 'default'
            }
            autoCapitalize="characters"
            autoCorrect={false}
            editable={
              !isSearching
            }
            style={styles.input}
            onSubmitEditing={
              handleSearch
            }
          />

          <TouchableOpacity
            style={[
              styles.searchButton,

              isSearching &&
                styles.disabledButton,
            ]}
            disabled={
              isSearching
            }
            onPress={
              handleSearch
            }
          >
            {isSearching ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="magnify"
                  size={23}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.searchButtonText
                  }
                >
                  Buscar
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {person && (
          <View
            style={
              styles.personCard
            }
          >
            <View
              style={
                styles.successIcon
              }
            >
              <MaterialCommunityIcons
                name="check"
                size={30}
                color="#FFFFFF"
              />
            </View>

            <View
              style={
                styles.personContent
              }
            >
              <Text
                style={
                  styles.personLabel
                }
              >
                {person.personType ===
                'EMPLOYEE'
                  ? 'Empleado identificado'
                  : person.personType ===
                      'PRACTITIONER'
                    ? 'Practicante identificado'
                    : 'Personal externo identificado'}
              </Text>

              <Text
                style={
                  styles.personName
                }
              >
                {person.user.name}
              </Text>

              <View
                style={
                  styles.personInfoRow
                }
              >
                <MaterialCommunityIcons
                  name={
                    person.personType ===
                    'EMPLOYEE'
                      ? 'card-account-details-outline'
                      : 'key-outline'
                  }
                  size={18}
                  color={
                    COLORS.gray
                  }
                />

                <Text
                  style={
                    styles.personInfo
                  }
                >
                  {person.personType ===
                  'EMPLOYEE'
                    ? `No. ${
                        person.user
                          .employeeNumber ??
                        '—'
                      }`
                    : person.personType ===
                        'PRACTITIONER'
                      ? person
                          .practitioner
                          ?.accessCode ??
                        'Código válido'
                      : person.external
                          ?.accessCode ??
                        'Código válido'}
                </Text>
              </View>

              <View
                style={
                  styles.personInfoRow
                }
              >
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={18}
                  color={
                    COLORS.gray
                  }
                />

                <Text
                  style={
                    styles.personInfo
                  }
                >
                  {person.user
                    .workLocation ??
                    person.user
                      .department ??
                    'Sin ubicación registrada'}
                </Text>
              </View>

              {person.personType ===
                'EXTERNAL' &&
                person.user
                  .externalType && (
                  <View
                    style={
                      styles.personInfoRow
                    }
                  >
                    <MaterialCommunityIcons
                      name="account-details-outline"
                      size={18}
                      color={
                        COLORS.gray
                      }
                    />

                    <Text
                      style={
                        styles.personInfo
                      }
                    >
                      {getExternalTypeLabel(
                        person.user
                          .externalType,
                      )}
                    </Text>
                  </View>
                )}

              {person.personType ===
                'PRACTITIONER' &&
                person.practitioner && (
                  <View
                    style={
                      styles.validityCard
                    }
                  >
                    <MaterialCommunityIcons
                      name="calendar-check-outline"
                      size={18}
                      color={
                        COLORS.primary
                      }
                    />

                    <Text
                      style={
                        styles.validityText
                      }
                    >
                      Código vigente
                    </Text>
                  </View>
                )}

              {person.personType ===
                'EXTERNAL' &&
                person.external && (
                  <View
                    style={
                      styles.validityCard
                    }
                  >
                    <MaterialCommunityIcons
                      name="calendar-check-outline"
                      size={18}
                      color={
                        COLORS.primary
                      }
                    />

                    <Text
                      style={
                        styles.validityText
                      }
                    >
                      Acceso vigente
                    </Text>
                  </View>
                )}
            </View>
          </View>
        )}

        <View
          style={
            styles.orderSummary
          }
        >
          <Text
            style={
              styles.summaryTitle
            }
          >
            Tu pedido
          </Text>

          <View
            style={
              styles.summaryRow
            }
          >
            <MaterialCommunityIcons
              name={
                service ===
                'BREAKFAST'
                  ? 'coffee-outline'
                  : 'silverware-fork-knife'
              }
              size={23}
              color={
                COLORS.primary
              }
            />

            <View
              style={
                styles.summaryText
              }
            >
              <Text
                style={
                  styles.summaryLabel
                }
              >
                {service ===
                'BREAKFAST'
                  ? 'Desayuno'
                  : 'Comida'}
              </Text>

              <Text
                style={
                  styles.summaryValue
                }
              >
                {dishName ??
                  'Platillo seleccionado'}
              </Text>
            </View>
          </View>

          {!!observations && (
            <View
              style={
                styles.observationBox
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
                {observations}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,

            !person &&
              styles.continueDisabled,
          ]}
          disabled={!person}
          onPress={
            handleContinue
          }
          activeOpacity={0.85}
        >
          <Text
            style={
              styles.continueText
            }
          >
            Continuar
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={25}
            color="#FFFFFF"
          />
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

    container: {
      width: '100%',
      maxWidth: 750,
      alignSelf: 'center',
      paddingHorizontal: 30,
      paddingTop: 45,
      paddingBottom: 40,
    },

    header: {
      flexDirection: 'row',
      alignItems:
        'flex-start',
      marginBottom: 27,
    },

    backButton: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor:
        COLORS.white,
      justifyContent:
        'center',
      alignItems: 'center',
      marginRight: 17,
      elevation: 2,
    },

    headerText: {
      flex: 1,
    },

    step: {
      color: COLORS.primary,
      fontSize: 15,
      fontWeight: '800',
    },

    title: {
      marginTop: 4,
      color: COLORS.text,
      fontSize: 32,
      fontWeight: '900',
    },

    subtitle: {
      marginTop: 6,
      color: COLORS.gray,
      fontSize: 16,
    },

    sectionTitle: {
      color: COLORS.text,
      fontSize: 18,
      fontWeight: '900',
      marginBottom: 12,
    },

    typeContainer: {
      flexDirection: 'row',
      gap: 9,
      marginBottom: 22,
    },

    typeButton: {
      flex: 1,
      minHeight: 125,
      backgroundColor:
        COLORS.white,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor:
        '#DFE6E0',
      alignItems: 'center',
      justifyContent:
        'center',
      paddingHorizontal: 7,
      paddingVertical: 10,
    },

    typeButtonSelected: {
      borderColor:
        COLORS.primary,
      backgroundColor:
        '#EDF7EF',
    },

    typeIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor:
        '#EAF5EC',
      justifyContent:
        'center',
      alignItems: 'center',
      marginBottom: 8,
    },

    typeIconSelected: {
      backgroundColor:
        COLORS.primary,
    },

    typeTitle: {
      color: COLORS.text,
      fontSize: 13,
      fontWeight: '800',
      textAlign: 'center',
    },

    typeTitleSelected: {
      color: COLORS.primary,
    },

    typeDescription: {
      marginTop: 3,
      color: COLORS.gray,
      fontSize: 9,
      textAlign: 'center',
    },

    card: {
      backgroundColor:
        COLORS.white,
      borderRadius: 25,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        '#E1E8E2',
      elevation: 3,
    },

    iconContainer: {
      width: 75,
      height: 75,
      borderRadius: 24,
      backgroundColor:
        '#E8F4EA',
      alignItems: 'center',
      justifyContent:
        'center',
      marginBottom: 15,
    },

    cardTitle: {
      color: COLORS.text,
      fontSize: 20,
      fontWeight: '900',
      textAlign: 'center',
    },

    cardDescription: {
      marginTop: 6,
      color: COLORS.gray,
      fontSize: 13,
      textAlign: 'center',
    },

    input: {
      width: '100%',
      height: 62,
      marginTop: 21,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor:
        '#DCE5DD',
      backgroundColor:
        '#FAFCFA',
      paddingHorizontal: 20,
      color: COLORS.text,
      fontSize: 18,
      fontWeight: '700',
    },

    searchButton: {
      width: '100%',
      height: 58,
      marginTop: 14,
      borderRadius: 18,
      backgroundColor:
        COLORS.primary,
      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems: 'center',
      gap: 8,
    },

    searchButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
    },

    disabledButton: {
      opacity: 0.6,
    },

    personCard: {
      marginTop: 20,
      backgroundColor:
        '#EDF7EF',
      borderRadius: 22,
      padding: 19,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor:
        '#CFE5D2',
    },

    successIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor:
        COLORS.primary,
      justifyContent:
        'center',
      alignItems: 'center',
      marginRight: 14,
    },

    personContent: {
      flex: 1,
    },

    personLabel: {
      color: COLORS.primary,
      fontSize: 11,
      fontWeight: '800',
    },

    personName: {
      marginTop: 3,
      color: COLORS.text,
      fontSize: 19,
      fontWeight: '900',
    },

    personInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 7,
      gap: 6,
    },

    personInfo: {
      color: COLORS.gray,
      fontSize: 13,
    },

    validityCard: {
      marginTop: 10,
      alignSelf:
        'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor:
        COLORS.white,
      borderRadius: 13,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },

    validityText: {
      color: COLORS.primary,
      fontSize: 11,
      fontWeight: '800',
    },

    orderSummary: {
      marginTop: 20,
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor:
        '#E3E8E4',
    },

    summaryTitle: {
      color: COLORS.text,
      fontSize: 17,
      fontWeight: '900',
      marginBottom: 14,
    },

    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    summaryText: {
      marginLeft: 11,
      flex: 1,
    },

    summaryLabel: {
      color: COLORS.gray,
      fontSize: 11,
    },

    summaryValue: {
      marginTop: 2,
      color: COLORS.text,
      fontWeight: '800',
      fontSize: 15,
    },

    observationBox: {
      marginTop: 14,
      padding: 13,
      borderRadius: 14,
      backgroundColor:
        '#F7F8F6',
    },

    observationLabel: {
      color: COLORS.gray,
      fontSize: 10,
      fontWeight: '700',
    },

    observationText: {
      marginTop: 4,
      color: COLORS.text,
      fontSize: 13,
    },

    continueButton: {
      height: 66,
      marginTop: 24,
      borderRadius: 21,
      backgroundColor:
        COLORS.primary,
      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems: 'center',
      gap: 9,
    },

    continueDisabled: {
      opacity: 0.45,
    },

    continueText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '900',
    },
  });