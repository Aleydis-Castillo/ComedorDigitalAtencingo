import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
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
} from 'expo-router';

import {
  COLORS,
} from '../../constants/colors';

import {
  API_URL,
} from '../../services/api';

type AccessType =
  | 'PRACTITIONER'
  | 'EXTERNAL';

type ExternalType =
  | 'VISIT'
  | 'SCHEDULED'
  | 'OTHER_MILL';

interface Practitioner {
  id: string;
  accessCode: string;
  startDate: string;
  endDate: string;
  active: boolean;

  user: {
    id: string;
    name: string;
    department: string | null;
    active: boolean;
    workLocation: string | null;
  };
}

interface ExternalPersonnel {
  id: string;
  accessCode: string;
  type: ExternalType;
  startDate: string;
  endDate: string;
  active: boolean;

  user: {
    id: string;
    name: string;
    department: string | null;
    active: boolean;
    workLocation: string | null;
    externalType: ExternalType | null;
  };
}

interface GetPractitionersResponse {
  practitioners: Practitioner[];
}

interface GetExternalResponse {
  external: ExternalPersonnel[];
}

interface CreateAccessResponse {
  message: string;
  accessCode: string;
}

function getCurrentDate() {
  const date = new Date();

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

function formatDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    },
  );
}

function getExternalTypeName(
  type: ExternalType,
) {
  switch (type) {
    case 'VISIT':
      return 'Visita';

    case 'SCHEDULED':
      return 'Por horarios';

    case 'OTHER_MILL':
      return 'Otro ingenio';

    default:
      return 'Personal externo';
  }
}

export default function InternCodesScreen() {
  const [
    accessType,
    setAccessType,
  ] =
    useState<AccessType>(
      'PRACTITIONER',
    );

  const [
    practitioners,
    setPractitioners,
  ] =
    useState<
      Practitioner[]
    >([]);

  const [
    externalPersonnel,
    setExternalPersonnel,
  ] =
    useState<
      ExternalPersonnel[]
    >([]);

  const [
    name,
    setName,
  ] =
    useState('');

  const [
    department,
    setDepartment,
  ] =
    useState('');

  const [
    workLocation,
    setWorkLocation,
  ] =
    useState('');

  const [
    externalType,
    setExternalType,
  ] =
    useState<ExternalType>(
      'VISIT',
    );

  const [
    startDate,
    setStartDate,
  ] =
    useState(
      getCurrentDate(),
    );

  const [
    endDate,
    setEndDate,
  ] =
    useState('');

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] =
    useState(false);

  const [
    isCreating,
    setIsCreating,
  ] =
    useState(false);

  const [
    generatedCode,
    setGeneratedCode,
  ] =
    useState('');

  const [
    showCodeModal,
    setShowCodeModal,
  ] =
    useState(false);

  const loadData =
    useCallback(
      async (
        showLoading =
          true,
      ) => {
        try {
          if (
            showLoading
          ) {
            setIsLoading(
              true,
            );
          }

          const [
            practitionerResponse,
            externalResponse,
          ] =
            await Promise.all([
              fetch(
                `${API_URL}/practitioners`,
              ),

              fetch(
                `${API_URL}/external`,
              ),
            ]);

          const practitionerData =
            (await practitionerResponse.json()) as
              | GetPractitionersResponse
              | {
                  message?: string;
                };

          const externalData =
            (await externalResponse.json()) as
              | GetExternalResponse
              | {
                  message?: string;
                };

          if (
            !practitionerResponse.ok
          ) {
            throw new Error(
              'message' in
                  practitionerData &&
                practitionerData.message
                ? practitionerData.message
                : 'No fue posible consultar los practicantes.',
            );
          }

          if (
            !externalResponse.ok
          ) {
            throw new Error(
              'message' in
                  externalData &&
                externalData.message
                ? externalData.message
                : 'No fue posible consultar el personal externo.',
            );
          }

          setPractitioners(
            (
              practitionerData as
                GetPractitionersResponse
            ).practitioners,
          );

          setExternalPersonnel(
            (
              externalData as
                GetExternalResponse
            ).external,
          );
        } catch (error) {
          console.error(
            'Error al consultar accesos:',
            error,
          );

          Alert.alert(
            'No fue posible cargar los accesos',
            error instanceof Error
              ? error.message
              : 'Ocurrió un error inesperado.',
          );
        } finally {
          setIsLoading(
            false,
          );

          setIsRefreshing(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    loadData();
  }, [
    loadData,
  ]);

  const clearForm =
    () => {
      setName('');
      setDepartment('');
      setWorkLocation('');
      setExternalType(
        'VISIT',
      );
      setStartDate(
        getCurrentDate(),
      );
      setEndDate('');
    };

  const changeAccessType = (
    type: AccessType,
  ) => {
    setAccessType(
      type,
    );

    clearForm();
  };

  const validateForm =
    () => {
      if (
        !name.trim()
      ) {
        Alert.alert(
          'Nombre requerido',
          'Escribe el nombre completo.',
        );

        return false;
      }

      if (
        accessType ===
          'EXTERNAL' &&
        !workLocation.trim()
      ) {
        Alert.alert(
          'Ubicación requerida',
          'Especifica la ubicación del personal externo.',
        );

        return false;
      }

      const dateRegex =
        /^\d{4}-\d{2}-\d{2}$/;

      if (
        !dateRegex.test(
          startDate.trim(),
        ) ||
        !dateRegex.test(
          endDate.trim(),
        )
      ) {
        Alert.alert(
          'Fechas incorrectas',
          'Las fechas deben tener formato YYYY-MM-DD.',
        );

        return false;
      }

      if (
        endDate <
        startDate
      ) {
        Alert.alert(
          'Vigencia incorrecta',
          'La fecha final no puede ser anterior a la fecha de inicio.',
        );

        return false;
      }

      return true;
    };

  const handleCreate =
    async () => {
      if (
        !validateForm()
      ) {
        return;
      }

      try {
        setIsCreating(
          true,
        );

        const endpoint =
          accessType ===
          'PRACTITIONER'
            ? `${API_URL}/practitioners`
            : `${API_URL}/external`;

        const body =
          accessType ===
          'PRACTITIONER'
            ? {
                name:
                  name.trim(),

                department:
                  department.trim()
                    ? department.trim()
                    : null,

                startDate:
                  startDate.trim(),

                endDate:
                  endDate.trim(),
              }
            : {
                name:
                  name.trim(),

                type:
                  externalType,

                workLocation:
                  workLocation.trim(),

                startDate:
                  startDate.trim(),

                endDate:
                  endDate.trim(),
              };

        const response =
          await fetch(
            endpoint,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify(
                  body,
                ),
            },
          );

        const data =
          (await response.json()) as
            | CreateAccessResponse
            | {
                message?: string;
              };

        if (
          !response.ok
        ) {
          throw new Error(
            'message' in
                data &&
              data.message
              ? data.message
              : 'No fue posible generar el código.',
          );
        }

        const result =
          data as
            CreateAccessResponse;

        setGeneratedCode(
          result.accessCode,
        );

        setShowCodeModal(
          true,
        );

        clearForm();

        await loadData(
          false,
        );
      } catch (error) {
        console.error(
          'Error al generar acceso:',
          error,
        );

        Alert.alert(
          'No fue posible generar el código',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setIsCreating(
          false,
        );
      }
    };

  const handleRefresh =
    () => {
      setIsRefreshing(
        true,
      );

      loadData(
        false,
      );
    };

  const currentData =
    accessType ===
    'PRACTITIONER'
      ? practitioners
      : externalPersonnel;

  if (isLoading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={
            COLORS.primary
          }
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Consultando accesos...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles.screen
      }
    >
      <FlatList
        data={
          currentData
        }
        keyExtractor={
          item =>
            item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={
              handleRefresh
            }
          />
        }
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            <View
              style={
                styles.topRow
              }
            >
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
                  styles.headerIcon
                }
              >
                <MaterialCommunityIcons
                  name="account-key-outline"
                  size={27}
                  color={
                    COLORS.primary
                  }
                />
              </View>
            </View>

            <Text
              style={
                styles.title
              }
            >
              Accesos temporales
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Genera y administra códigos de acceso para practicantes y personal externo.
            </Text>

            <View
              style={
                styles.tabs
              }
            >
              <TouchableOpacity
                style={[
                  styles.tab,

                  accessType ===
                    'PRACTITIONER' &&
                    styles.activeTab,
                ]}
                onPress={() =>
                  changeAccessType(
                    'PRACTITIONER',
                  )
                }
              >
                <MaterialCommunityIcons
                  name="school-outline"
                  size={20}
                  color={
                    accessType ===
                    'PRACTITIONER'
                      ? '#FFFFFF'
                      : COLORS.primary
                  }
                />

                <Text
                  style={[
                    styles.tabText,

                    accessType ===
                      'PRACTITIONER' &&
                      styles.activeTabText,
                  ]}
                >
                  Practicantes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,

                  accessType ===
                    'EXTERNAL' &&
                    styles.activeTab,
                ]}
                onPress={() =>
                  changeAccessType(
                    'EXTERNAL',
                  )
                }
              >
                <MaterialCommunityIcons
                  name="account-tie-outline"
                  size={20}
                  color={
                    accessType ===
                    'EXTERNAL'
                      ? '#FFFFFF'
                      : COLORS.primary
                  }
                />

                <Text
                  style={[
                    styles.tabText,

                    accessType ===
                      'EXTERNAL' &&
                      styles.activeTabText,
                  ]}
                >
                  Personal externo
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={
                styles.formCard
              }
            >
              <View
                style={
                  styles.formHeader
                }
              >
                <View
                  style={
                    styles.formIcon
                  }
                >
                  <MaterialCommunityIcons
                    name={
                      accessType ===
                      'PRACTITIONER'
                        ? 'account-school-outline'
                        : 'account-tie-outline'
                    }
                    size={27}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                <View
                  style={
                    styles.formHeaderText
                  }
                >
                  <Text
                    style={
                      styles.formTitle
                    }
                  >
                    {accessType ===
                    'PRACTITIONER'
                      ? 'Nuevo practicante'
                      : 'Nuevo personal externo'}
                  </Text>

                  <Text
                    style={
                      styles.formSubtitle
                    }
                  >
                    Completa los datos para generar el acceso.
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.label
                }
              >
                Nombre completo
              </Text>

              <TextInput
                value={
                  name
                }
                onChangeText={
                  setName
                }
                placeholder="Nombre completo"
                placeholderTextColor={
                  COLORS.gray
                }
                style={
                  styles.input
                }
                editable={
                  !isCreating
                }
              />

              {accessType ===
                'PRACTITIONER' && (
                <>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Área o departamento
                  </Text>

                  <TextInput
                    value={
                      department
                    }
                    onChangeText={
                      setDepartment
                    }
                    placeholder="Ej. Sistemas"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    style={
                      styles.input
                    }
                    editable={
                      !isCreating
                    }
                  />
                </>
              )}

              {accessType ===
                'EXTERNAL' && (
                <>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Tipo de personal
                  </Text>

                  <View
                    style={
                      styles.typeContainer
                    }
                  >
                    <TypeButton
                      title="Visita"
                      selected={
                        externalType ===
                        'VISIT'
                      }
                      onPress={() =>
                        setExternalType(
                          'VISIT',
                        )
                      }
                    />

                    <TypeButton
                      title="Por horarios"
                      selected={
                        externalType ===
                        'SCHEDULED'
                      }
                      onPress={() =>
                        setExternalType(
                          'SCHEDULED',
                        )
                      }
                    />

                    <TypeButton
                      title="Otro ingenio"
                      selected={
                        externalType ===
                        'OTHER_MILL'
                      }
                      onPress={() =>
                        setExternalType(
                          'OTHER_MILL',
                        )
                      }
                    />
                  </View>

                  <Text
                    style={
                      styles.label
                    }
                  >
                    Ubicación
                  </Text>

                  <TextInput
                    value={
                      workLocation
                    }
                    onChangeText={
                      setWorkLocation
                    }
                    placeholder="Ej. Administración"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    style={
                      styles.input
                    }
                    editable={
                      !isCreating
                    }
                  />
                </>
              )}

              <View
                style={
                  styles.dateRow
                }
              >
                <View
                  style={
                    styles.dateColumn
                  }
                >
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Inicio
                  </Text>

                  <TextInput
                    value={
                      startDate
                    }
                    onChangeText={
                      setStartDate
                    }
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    style={
                      styles.input
                    }
                    editable={
                      !isCreating
                    }
                  />
                </View>

                <View
                  style={
                    styles.dateColumn
                  }
                >
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Finaliza
                  </Text>

                  <TextInput
                    value={
                      endDate
                    }
                    onChangeText={
                      setEndDate
                    }
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    style={
                      styles.input
                    }
                    editable={
                      !isCreating
                    }
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.createButton,

                  isCreating &&
                    styles.disabledButton,
                ]}
                disabled={
                  isCreating
                }
                onPress={
                  handleCreate
                }
              >
                {isCreating ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="key-plus"
                    size={23}
                    color="#FFFFFF"
                  />
                )}

                <Text
                  style={
                    styles.createButtonText
                  }
                >
                  {isCreating
                    ? 'Generando...'
                    : 'Generar código'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={
                styles.listHeader
              }
            >
              <Text
                style={
                  styles.listTitle
                }
              >
                {accessType ===
                'PRACTITIONER'
                  ? 'Practicantes registrados'
                  : 'Personal externo registrado'}
              </Text>

              <View
                style={
                  styles.counter
                }
              >
                <Text
                  style={
                    styles.counterText
                  }
                >
                  {
                    currentData.length
                  }
                </Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyCard
            }
          >
            <MaterialCommunityIcons
              name={
                accessType ===
                'PRACTITIONER'
                  ? 'account-school-outline'
                  : 'account-tie-outline'
              }
              size={48}
              color="#A4AAA5"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              Sin registros
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Los accesos que generes aparecerán aquí.
            </Text>
          </View>
        }
        renderItem={({
          item,
        }) => {
          const isExternal =
            accessType ===
            'EXTERNAL';

          const externalItem =
            isExternal
              ? item as ExternalPersonnel
              : null;

          return (
            <View
              style={
                styles.personCard
              }
            >
              <View
                style={
                  styles.cardTop
                }
              >
                <View
                  style={
                    styles.personIcon
                  }
                >
                  <MaterialCommunityIcons
                    name={
                      isExternal
                        ? 'account-tie-outline'
                        : 'school-outline'
                    }
                    size={25}
                    color={
                      COLORS.primary
                    }
                  />
                </View>

                <View
                  style={
                    styles.personContent
                  }
                >
                  <Text
                    style={
                      styles.personName
                    }
                  >
                    {
                      item.user.name
                    }
                  </Text>

                  <Text
                    style={
                      styles.personDepartment
                    }
                  >
                    {isExternal &&
                    externalItem
                      ? `${getExternalTypeName(
                          externalItem.type,
                        )} · ${
                          item.user
                            .workLocation ||
                          'Sin ubicación'
                        }`
                      : item.user
                          .department ||
                        'Sin área registrada'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,

                    item.active
                      ? styles.activeBadge
                      : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,

                      item.active
                        ? styles.activeText
                        : styles.inactiveText,
                    ]}
                  >
                    {item.active
                      ? 'Activo'
                      : 'Inactivo'}
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.codeCard
                }
              >
                <Text
                  style={
                    styles.codeLabel
                  }
                >
                  CÓDIGO DE ACCESO
                </Text>

                <Text
                  style={
                    styles.code
                  }
                >
                  {
                    item.accessCode
                  }
                </Text>
              </View>

              <View
                style={
                  styles.validityRow
                }
              >
                <View>
                  <Text
                    style={
                      styles.validityLabel
                    }
                  >
                    Inicio
                  </Text>

                  <Text
                    style={
                      styles.validityValue
                    }
                  >
                    {formatDate(
                      item.startDate,
                    )}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color="#A0A6A1"
                />

                <View
                  style={
                    styles.validityEnd
                  }
                >
                  <Text
                    style={
                      styles.validityLabel
                    }
                  >
                    Vigencia
                  </Text>

                  <Text
                    style={
                      styles.validityValue
                    }
                  >
                    {formatDate(
                      item.endDate,
                    )}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={
          showCodeModal
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowCodeModal(
            false,
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.modalCard
            }
          >
            <View
              style={
                styles.successIcon
              }
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={44}
                color={
                  COLORS.primary
                }
              />
            </View>

            <Text
              style={
                styles.modalTitle
              }
            >
              Código generado
            </Text>

            <Text
              style={
                styles.modalText
              }
            >
              Comparte este código únicamente con la persona registrada.
            </Text>

            <View
              style={
                styles.generatedCodeCard
              }
            >
              <Text
                style={
                  styles.generatedCode
                }
              >
                {
                  generatedCode
                }
              </Text>
            </View>

            <Pressable
              style={
                styles.modalButton
              }
              onPress={() =>
                setShowCodeModal(
                  false,
                )
              }
            >
              <Text
                style={
                  styles.modalButtonText
                }
              >
                Entendido
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface TypeButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

function TypeButton({
  title,
  selected,
  onPress,
}: TypeButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.typeButton,

        selected &&
          styles.selectedTypeButton,
      ]}
      onPress={
        onPress
      }
    >
      <Text
        style={[
          styles.typeButtonText,

          selected &&
            styles.selectedTypeButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
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
      paddingHorizontal: 20,
      paddingTop: 48,
      paddingBottom: 40,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
      backgroundColor:
        COLORS.background,
    },

    loadingText: {
      marginTop: 13,
      color: COLORS.gray,
      fontSize: 14,
    },

    topRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
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

    headerIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor:
        '#E6F3E8',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    title: {
      marginTop: 22,
      color: COLORS.text,
      fontSize: 30,
      fontWeight: '900',
    },

    subtitle: {
      marginTop: 6,
      marginBottom: 20,
      color: COLORS.gray,
      fontSize: 14,
      lineHeight: 20,
    },

    tabs: {
      flexDirection:
        'row',
      backgroundColor:
        '#EAF0EA',
      borderRadius: 18,
      padding: 4,
      marginBottom: 20,
      gap: 4,
    },

    tab: {
      flex: 1,
      minHeight: 50,
      borderRadius: 15,
      justifyContent:
        'center',
      alignItems:
        'center',
      flexDirection:
        'row',
      gap: 6,
      paddingHorizontal: 5,
    },

    activeTab: {
      backgroundColor:
        COLORS.primary,
    },

    tabText: {
      color:
        COLORS.primary,
      fontSize: 12,
      fontWeight: '800',
    },

    activeTabText: {
      color: '#FFFFFF',
    },

    formCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor:
        '#E1E7E2',
      marginBottom: 28,
    },

    formHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
      marginBottom: 20,
    },

    formHeaderText: {
      flex: 1,
    },

    formIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor:
        '#EAF5EC',
      justifyContent:
        'center',
      alignItems:
        'center',
      marginRight: 12,
    },

    formTitle: {
      color: COLORS.text,
      fontSize: 18,
      fontWeight: '900',
    },

    formSubtitle: {
      marginTop: 2,
      color: COLORS.gray,
      fontSize: 11,
    },

    label: {
      marginBottom: 7,
      color: '#4E5965',
      fontSize: 12,
      fontWeight: '700',
    },

    input: {
      minHeight: 54,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#DDE4DE',
      backgroundColor:
        '#FAFBFA',
      paddingHorizontal: 15,
      color: COLORS.text,
      fontSize: 14,
      marginBottom: 15,
    },

    typeContainer: {
      flexDirection:
        'row',
      gap: 7,
      marginBottom: 17,
    },

    typeButton: {
      flex: 1,
      minHeight: 45,
      borderRadius: 14,
      borderWidth: 1,
      borderColor:
        '#D8E2D9',
      backgroundColor:
        '#F8FAF8',
      justifyContent:
        'center',
      alignItems:
        'center',
      paddingHorizontal: 4,
    },

    selectedTypeButton: {
      backgroundColor:
        '#E7F3E9',
      borderColor:
        COLORS.primary,
    },

    typeButtonText: {
      color: COLORS.gray,
      fontSize: 10,
      fontWeight: '700',
      textAlign:
        'center',
    },

    selectedTypeButtonText: {
      color:
        COLORS.primary,
      fontWeight: '900',
    },

    dateRow: {
      flexDirection:
        'row',
      gap: 10,
    },

    dateColumn: {
      flex: 1,
    },

    createButton: {
      minHeight: 58,
      borderRadius: 18,
      backgroundColor:
        COLORS.primary,
      justifyContent:
        'center',
      alignItems:
        'center',
      flexDirection:
        'row',
      gap: 9,
      marginTop: 5,
    },

    disabledButton: {
      opacity: 0.6,
    },

    createButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '900',
    },

    listHeader: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      marginBottom: 13,
    },

    listTitle: {
      flex: 1,
      color: COLORS.text,
      fontSize: 19,
      fontWeight: '900',
    },

    counter: {
      minWidth: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        '#EAF5EC',
      justifyContent:
        'center',
      alignItems:
        'center',
      paddingHorizontal: 8,
    },

    counterText: {
      color:
        COLORS.primary,
      fontWeight: '900',
    },

    personCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 21,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor:
        '#E5E9E5',
    },

    cardTop: {
      flexDirection:
        'row',
      alignItems:
        'center',
    },

    personIcon: {
      width: 47,
      height: 47,
      borderRadius: 15,
      backgroundColor:
        '#EAF5EC',
      justifyContent:
        'center',
      alignItems:
        'center',
      marginRight: 11,
    },

    personContent: {
      flex: 1,
    },

    personName: {
      color: COLORS.text,
      fontSize: 15,
      fontWeight: '900',
    },

    personDepartment: {
      marginTop: 3,
      color: COLORS.gray,
      fontSize: 11,
    },

    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
    },

    activeBadge: {
      backgroundColor:
        '#E8F5EA',
    },

    inactiveBadge: {
      backgroundColor:
        '#FDECEC',
    },

    statusText: {
      fontSize: 10,
      fontWeight: '900',
    },

    activeText: {
      color:
        COLORS.primary,
    },

    inactiveText: {
      color: '#C2413A',
    },

    codeCard: {
      marginTop: 14,
      backgroundColor:
        '#F5F8F5',
      borderRadius: 15,
      padding: 13,
    },

    codeLabel: {
      color: COLORS.gray,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 1,
    },

    code: {
      marginTop: 4,
      color:
        COLORS.primary,
      fontSize: 20,
      fontWeight: '900',
      letterSpacing: 1.2,
    },

    validityRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      marginTop: 15,
    },

    validityLabel: {
      color: COLORS.gray,
      fontSize: 9,
    },

    validityValue: {
      marginTop: 3,
      color: COLORS.text,
      fontSize: 11,
      fontWeight: '700',
    },

    validityEnd: {
      alignItems:
        'flex-end',
    },

    emptyCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      padding: 35,
      alignItems:
        'center',
    },

    emptyTitle: {
      marginTop: 12,
      color: COLORS.text,
      fontSize: 17,
      fontWeight: '900',
    },

    emptyText: {
      marginTop: 5,
      color: COLORS.gray,
      fontSize: 12,
      textAlign:
        'center',
    },

    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,0.35)',
      justifyContent:
        'center',
      alignItems:
        'center',
      paddingHorizontal: 25,
    },

    modalCard: {
      width: '100%',
      maxWidth: 420,
      backgroundColor:
        '#FFFFFF',
      borderRadius: 26,
      padding: 24,
      alignItems:
        'center',
    },

    successIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor:
        '#EAF5EC',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    modalTitle: {
      marginTop: 15,
      color: COLORS.text,
      fontSize: 22,
      fontWeight: '900',
    },

    modalText: {
      marginTop: 7,
      color: COLORS.gray,
      fontSize: 13,
      lineHeight: 19,
      textAlign:
        'center',
    },

    generatedCodeCard: {
      width: '100%',
      marginTop: 20,
      backgroundColor:
        '#EDF7EF',
      borderRadius: 18,
      paddingVertical: 18,
      alignItems:
        'center',
      borderWidth: 1,
      borderColor:
        '#CFE5D3',
    },

    generatedCode: {
      color:
        COLORS.primary,
      fontSize: 26,
      fontWeight: '900',
      letterSpacing: 2,
    },

    modalButton: {
      width: '100%',
      minHeight: 55,
      borderRadius: 17,
      backgroundColor:
        COLORS.primary,
      justifyContent:
        'center',
      alignItems:
        'center',
      marginTop: 20,
    },

    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '900',
    },
  });