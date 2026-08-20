import React, {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router } from 'expo-router';

import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../services/api';

type ServiceType =
  | 'BREAKFAST'
  | 'LUNCH';

type EventStatus =
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'FINISHED'
  | 'CANCELLED';

interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  eventTime: string;
  service: ServiceType;
  people: number;
  location: string;
  observations: string | null;
  status: EventStatus;

  createdBy?: {
    id: string;
    name: string;
    employeeNumber: string | null;
    role: string;
  };
}

interface EventsResponse {
  events: EventItem[];
}

interface CreateEventResponse {
  message: string;
  event: EventItem;
}

function getToday() {
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

function formatDate(
  value: string,
) {
  const date =
    value.slice(0, 10);

  const [
    year,
    month,
    day,
  ] = date.split('-');

  return `${day}/${month}/${year}`;
}

function formatTime(
  value: string,
) {
  if (!value) {
    return '';
  }

  /*
   * Prisma puede devolver algo como:
   *
   * 1970-01-01T13:30:00.000Z
   */
  if (value.includes('T')) {
    const time =
      value.split('T')[1];

    return time
      ?.slice(0, 5) ??
      '';
  }

  return value.slice(0, 5);
}

function getStatusConfig(
  status: EventStatus,
) {
  switch (status) {
    case 'SCHEDULED':
      return {
        label: 'Programado',
        icon:
          'calendar-clock-outline' as const,
        color: '#D97706',
        background:
          '#FFF4D8',
      };

    case 'ACTIVE':
      return {
        label: 'Activo',
        icon:
          'play-circle-outline' as const,
        color: '#2563A9',
        background:
          '#EAF3FA',
      };

    case 'FINISHED':
      return {
        label: 'Finalizado',
        icon:
          'check-circle-outline' as const,
        color: COLORS.primary,
        background:
          '#EAF5EC',
      };

    case 'CANCELLED':
      return {
        label: 'Cancelado',
        icon:
          'close-circle-outline' as const,
        color: '#C2413A',
        background:
          '#FDECEA',
      };
  }
}

export default function EventsScreen() {
  const { user } = useAuth();

  const [
    title,
    setTitle,
  ] = useState('');

  const [
    eventDate,
    setEventDate,
  ] = useState(
    getToday(),
  );

  const [
    eventTime,
    setEventTime,
  ] = useState('');

  const [
    service,
    setService,
  ] =
    useState<ServiceType>(
      'BREAKFAST',
    );

  const [
    people,
    setPeople,
  ] = useState('');

  const [
    location,
    setLocation,
  ] = useState('');

  const [
    observations,
    setObservations,
  ] = useState('');

  const [
    events,
    setEvents,
  ] = useState<EventItem[]>(
    [],
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  const loadEvents =
    useCallback(
      async () => {
        try {
          setIsLoading(true);

          const response =
            await fetch(
              `${API_URL}/events`,
            );

          const data =
            (await response.json()) as
              | EventsResponse
              | {
                  message?: string;
                };

          if (!response.ok) {
            const message =
              'message' in data &&
              data.message
                ? data.message
                : 'No fue posible consultar los eventos.';

            throw new Error(
              message,
            );
          }

          setEvents(
            (
              data as EventsResponse
            ).events ?? [],
          );
        } catch (error) {
          console.error(
            'Error al consultar eventos:',
            error,
          );

          Alert.alert(
            'No fue posible cargar los eventos',
            error instanceof Error
              ? error.message
              : 'Ocurrió un error inesperado.',
          );
        } finally {
          setIsLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const clearForm = () => {
    setTitle('');
    setEventDate(
      getToday(),
    );
    setEventTime('');
    setService(
      'BREAKFAST',
    );
    setPeople('');
    setLocation('');
    setObservations('');
  };

  const validateForm = () => {
    if (!user) {
      Alert.alert(
        'Sesión no disponible',
        'Inicia sesión nuevamente.',
      );

      return false;
    }

    if (!title.trim()) {
      Alert.alert(
        'Título obligatorio',
        'Escribe el nombre del evento.',
      );

      return false;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        eventDate,
      )
    ) {
      Alert.alert(
        'Fecha incorrecta',
        'Escribe la fecha con formato YYYY-MM-DD.',
      );

      return false;
    }

    if (
      !/^\d{2}:\d{2}$/.test(
        eventTime,
      )
    ) {
      Alert.alert(
        'Hora incorrecta',
        'Escribe la hora con formato HH:mm. Ejemplo: 14:30.',
      );

      return false;
    }

    const peopleNumber =
      Number(people);

    if (
      !Number.isInteger(
        peopleNumber,
      ) ||
      peopleNumber <= 0
    ) {
      Alert.alert(
        'Cantidad incorrecta',
        'Escribe una cantidad válida de personas.',
      );

      return false;
    }

    if (!location.trim()) {
      Alert.alert(
        'Ubicación obligatoria',
        'Escribe dónde se realizará el evento.',
      );

      return false;
    }

    return true;
  };

  const handleCreateEvent =
    async () => {
      if (isSaving) {
        return;
      }

      if (!validateForm()) {
        return;
      }

      if (!user) {
        return;
      }

      try {
        setIsSaving(true);

        const response =
          await fetch(
            `${API_URL}/events`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                title:
                  title.trim(),

                eventDate,

                eventTime,

                service,

                people:
                  Number(people),

                location:
                  location.trim(),

                observations:
                  observations.trim()
                    ? observations.trim()
                    : null,

                createdById:
                  user.id,
              }),
            },
          );

        const data =
          (await response.json()) as
            | CreateEventResponse
            | {
                message?: string;
              };

        if (!response.ok) {
          const message =
            'message' in data &&
            data.message
              ? data.message
              : 'No fue posible registrar el evento.';

          throw new Error(
            message,
          );
        }

        const result =
          data as CreateEventResponse;

        setEvents(previous =>
          [
            ...previous,
            result.event,
          ].sort(
            (a, b) =>
              new Date(
                a.eventDate,
              ).getTime() -
              new Date(
                b.eventDate,
              ).getTime(),
          ),
        );

        clearForm();

        Alert.alert(
          'Evento registrado',
          'El evento se guardó correctamente.',
        );
      } catch (error) {
        console.error(
          'Error al registrar evento:',
          error,
        );

        Alert.alert(
          'No fue posible registrar',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setIsSaving(false);
      }
    };

  const updateStatus =
    async (
      event: EventItem,
      status: EventStatus,
    ) => {
      try {
        setUpdatingId(
          event.id,
        );

        const response =
          await fetch(
            `${API_URL}/events/${event.id}`,
            {
              method: 'PATCH',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                status,
              }),
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ??
              'No fue posible actualizar el evento.',
          );
        }

        setEvents(previous =>
          previous.map(item =>
            item.id ===
            event.id
              ? data.event
              : item,
          ),
        );
      } catch (error) {
        Alert.alert(
          'No fue posible actualizar',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setUpdatingId(null);
      }
    };

  const handleDelete =
    (
      event: EventItem,
    ) => {
      Alert.alert(
        'Eliminar evento',
        `¿Deseas eliminar "${event.title}"?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },

          {
            text: 'Eliminar',
            style: 'destructive',

            onPress:
              async () => {
                try {
                  setUpdatingId(
                    event.id,
                  );

                  const response =
                    await fetch(
                      `${API_URL}/events/${event.id}`,
                      {
                        method:
                          'DELETE',
                      },
                    );

                  const data =
                    await response.json();

                  if (
                    !response.ok
                  ) {
                    throw new Error(
                      data?.message ??
                        'No fue posible eliminar el evento.',
                    );
                  }

                  setEvents(
                    previous =>
                      previous.filter(
                        item =>
                          item.id !==
                          event.id,
                      ),
                  );
                } catch (error) {
                  Alert.alert(
                    'No fue posible eliminar',
                    error instanceof
                      Error
                      ? error.message
                      : 'Ocurrió un error inesperado.',
                  );
                } finally {
                  setUpdatingId(
                    null,
                  );
                }
              },
          },
        ],
      );
    };

  const renderEvent = ({
    item,
  }: {
    item: EventItem;
  }) => {
    const status =
      getStatusConfig(
        item.status,
      );

    const isUpdating =
      updatingId ===
      item.id;

    return (
      <View style={styles.eventCard}>
        <View
          style={
            styles.eventHeader
          }
        >
          <View
            style={
              styles.eventTitleArea
            }
          >
            <Text
              style={
                styles.eventTitle
              }
            >
              {item.title}
            </Text>

            <Text
              style={
                styles.eventDate
              }
            >
              {formatDate(
                item.eventDate,
              )}
              {' · '}
              {formatTime(
                item.eventTime,
              )}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  status.background,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={status.icon}
              size={15}
              color={
                status.color
              }
            />

            <Text
              style={[
                styles.statusText,
                {
                  color:
                    status.color,
                },
              ]}
            >
              {status.label}
            </Text>
          </View>
        </View>

        <View
          style={styles.divider}
        />

        <InfoRow
          icon={
            item.service ===
            'BREAKFAST'
              ? 'coffee-outline'
              : 'silverware-fork-knife'
          }
          label="Servicio"
          value={
            item.service ===
            'BREAKFAST'
              ? 'Desayuno'
              : 'Comida'
          }
        />

        <InfoRow
          icon="account-group-outline"
          label="Personas"
          value={`${item.people}`}
        />

        <InfoRow
          icon="map-marker-outline"
          label="Ubicación"
          value={
            item.location
          }
        />

        {!!item.observations && (
          <InfoRow
            icon="message-text-outline"
            label="Observaciones"
            value={
              item.observations
            }
          />
        )}

        {item.status !==
          'FINISHED' &&
          item.status !==
            'CANCELLED' && (
            <View
              style={
                styles.actionsRow
              }
            >
              {item.status ===
                'SCHEDULED' && (
                <Pressable
                  disabled={
                    isUpdating
                  }
                  style={[
                    styles.smallButton,
                    styles.activeButton,
                  ]}
                  onPress={() =>
                    updateStatus(
                      item,
                      'ACTIVE',
                    )
                  }
                >
                  <Text
                    style={
                      styles.smallButtonText
                    }
                  >
                    Activar
                  </Text>
                </Pressable>
              )}

              {item.status ===
                'ACTIVE' && (
                <Pressable
                  disabled={
                    isUpdating
                  }
                  style={[
                    styles.smallButton,
                    styles.finishButton,
                  ]}
                  onPress={() =>
                    updateStatus(
                      item,
                      'FINISHED',
                    )
                  }
                >
                  <Text
                    style={
                      styles.smallButtonText
                    }
                  >
                    Finalizar
                  </Text>
                </Pressable>
              )}

              <Pressable
                disabled={
                  isUpdating
                }
                style={[
                  styles.smallButton,
                  styles.cancelButton,
                ]}
                onPress={() =>
                  updateStatus(
                    item,
                    'CANCELLED',
                  )
                }
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancelar
                </Text>
              </Pressable>
            </View>
          )}

        <Pressable
          disabled={isUpdating}
          style={
            styles.deleteButton
          }
          onPress={() =>
            handleDelete(item)
          }
        >
          {isUpdating ? (
            <ActivityIndicator
              size="small"
              color={
                COLORS.danger
              }
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={19}
                color={
                  COLORS.danger
                }
              />

              <Text
                style={
                  styles.deleteText
                }
              >
                Eliminar
              </Text>
            </>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={item =>
          item.id
        }
        renderItem={renderEvent}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            <View
              style={
                styles.header
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
                  size={25}
                  color={
                    COLORS.text
                  }
                />
              </TouchableOpacity>

              <View
                style={
                  styles.headerContent
                }
              >
                <Text
                  style={
                    styles.title
                  }
                >
                  Registrar eventos
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Programa servicios especiales del comedor.
                </Text>
              </View>
            </View>

            <View
              style={
                styles.formCard
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Nuevo evento
              </Text>

              <InputLabel
                title="Nombre del evento"
              />

              <TextInput
                value={title}
                onChangeText={
                  setTitle
                }
                placeholder="Ej. Reunión de producción"
                placeholderTextColor={
                  COLORS.gray
                }
                style={
                  styles.input
                }
              />

              <View
                style={
                  styles.twoColumns
                }
              >
                <View
                  style={
                    styles.column
                  }
                >
                  <InputLabel
                    title="Fecha"
                  />

                  <TextInput
                    value={
                      eventDate
                    }
                    onChangeText={
                      setEventDate
                    }
                    placeholder="2026-08-11"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    style={
                      styles.input
                    }
                  />
                </View>

                <View
                  style={
                    styles.column
                  }
                >
                  <InputLabel
                    title="Hora"
                  />

                  <TextInput
                    value={
                      eventTime
                    }
                    onChangeText={
                      setEventTime
                    }
                    placeholder="14:30"
                    placeholderTextColor={
                      COLORS.gray
                    }
                    style={
                      styles.input
                    }
                  />
                </View>
              </View>

              <InputLabel
                title="Servicio"
              />

              <View
                style={
                  styles.serviceRow
                }
              >
                <TouchableOpacity
                  style={[
                    styles.serviceButton,

                    service ===
                      'BREAKFAST' &&
                      styles.serviceSelected,
                  ]}
                  onPress={() =>
                    setService(
                      'BREAKFAST',
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name="coffee-outline"
                    size={20}
                    color={
                      service ===
                      'BREAKFAST'
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />

                  <Text
                    style={[
                      styles.serviceText,

                      service ===
                        'BREAKFAST' &&
                        styles.serviceTextSelected,
                    ]}
                  >
                    Desayuno
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.serviceButton,

                    service ===
                      'LUNCH' &&
                      styles.serviceSelected,
                  ]}
                  onPress={() =>
                    setService(
                      'LUNCH',
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name="silverware-fork-knife"
                    size={20}
                    color={
                      service ===
                      'LUNCH'
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />

                  <Text
                    style={[
                      styles.serviceText,

                      service ===
                        'LUNCH' &&
                        styles.serviceTextSelected,
                    ]}
                  >
                    Comida
                  </Text>
                </TouchableOpacity>
              </View>

              <InputLabel
                title="Cantidad de personas"
              />

              <TextInput
                value={people}
                onChangeText={
                  setPeople
                }
                placeholder="Ej. 50"
                placeholderTextColor={
                  COLORS.gray
                }
                keyboardType="number-pad"
                style={
                  styles.input
                }
              />

              <InputLabel
                title="Ubicación"
              />

              <TextInput
                value={location}
                onChangeText={
                  setLocation
                }
                placeholder="Ej. Sala de juntas"
                placeholderTextColor={
                  COLORS.gray
                }
                style={
                  styles.input
                }
              />

              <InputLabel
                title="Observaciones"
              />

              <TextInput
                value={
                  observations
                }
                onChangeText={
                  setObservations
                }
                placeholder="Información adicional..."
                placeholderTextColor={
                  COLORS.gray
                }
                multiline
                style={[
                  styles.input,
                  styles.textArea,
                ]}
              />

              <TouchableOpacity
                disabled={
                  isSaving
                }
                style={[
                  styles.saveButton,

                  isSaving &&
                    styles.disabledButton,
                ]}
                onPress={
                  handleCreateEvent
                }
              >
                {isSaving ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="calendar-plus"
                      size={22}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.saveButtonText
                      }
                    >
                      Registrar evento
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <Text
              style={
                styles.eventsTitle
              }
            >
              Eventos registrados
            </Text>

            {isLoading && (
              <View
                style={
                  styles.loader
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
                    styles.loaderText
                  }
                >
                  Consultando eventos...
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View
              style={
                styles.emptyCard
              }
            >
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={46}
                color="#9AA2AE"
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                Sin eventos
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Todavía no existen eventos registrados.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

function InputLabel({
  title,
}: {
  title: string;
}) {
  return (
    <Text style={styles.label}>
      {title}
    </Text>
  );
}

function InfoRow({
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
    <View style={styles.infoRow}>
      <View
        style={
          styles.infoIcon
        }
      >
        <MaterialCommunityIcons
          name={icon}
          size={19}
          color="#596273"
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
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
      paddingHorizontal: 18,
      paddingTop: 50,
      paddingBottom: 45,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 22,
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 15,
      backgroundColor:
        COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 13,
      elevation: 2,
    },

    headerContent: {
      flex: 1,
    },

    title: {
      fontSize: 26,
      fontWeight: '900',
      color: COLORS.text,
    },

    subtitle: {
      marginTop: 4,
      fontSize: 13,
      color: COLORS.gray,
    },

    formCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 24,
      padding: 18,
      marginBottom: 27,
      borderWidth: 1,
      borderColor: '#E5EAE6',
      elevation: 3,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: COLORS.text,
      marginBottom: 18,
    },

    label: {
      color: COLORS.text,
      fontSize: 13,
      fontWeight: '800',
      marginBottom: 7,
    },

    input: {
      minHeight: 52,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#DBE4DC',
      paddingHorizontal: 15,
      backgroundColor: '#FAFCFA',
      color: COLORS.text,
      fontSize: 14,
      marginBottom: 15,
    },

    textArea: {
      minHeight: 88,
      paddingTop: 14,
      textAlignVertical: 'top',
    },

    twoColumns: {
      flexDirection: 'row',
      gap: 10,
    },

    column: {
      flex: 1,
    },

    serviceRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 15,
    },

    serviceButton: {
      flex: 1,
      height: 52,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor:
        COLORS.primary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 7,
    },

    serviceSelected: {
      backgroundColor:
        COLORS.primary,
    },

    serviceText: {
      color: COLORS.primary,
      fontWeight: '800',
    },

    serviceTextSelected: {
      color: COLORS.white,
    },

    saveButton: {
      height: 58,
      borderRadius: 18,
      backgroundColor:
        COLORS.primary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 5,
    },

    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '900',
    },

    disabledButton: {
      opacity: 0.6,
    },

    eventsTitle: {
      fontSize: 21,
      fontWeight: '900',
      color: COLORS.text,
      marginBottom: 14,
    },

    loader: {
      paddingVertical: 40,
      alignItems: 'center',
    },

    loaderText: {
      marginTop: 10,
      color: COLORS.gray,
    },

    eventCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      padding: 17,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#E5EAE6',
      elevation: 2,
    },

    eventHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'flex-start',
      gap: 10,
    },

    eventTitleArea: {
      flex: 1,
    },

    eventTitle: {
      color: COLORS.text,
      fontSize: 17,
      fontWeight: '900',
    },

    eventDate: {
      marginTop: 4,
      color: COLORS.gray,
      fontSize: 12,
    },

    statusBadge: {
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 7,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },

    statusText: {
      fontSize: 10,
      fontWeight: '900',
    },

    divider: {
      height: 1,
      backgroundColor:
        '#EBEEEC',
      marginVertical: 14,
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },

    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      backgroundColor:
        '#F2F5F2',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },

    infoContent: {
      flex: 1,
    },

    infoLabel: {
      color: COLORS.gray,
      fontSize: 10,
    },

    infoValue: {
      marginTop: 2,
      color: COLORS.text,
      fontSize: 13,
      fontWeight: '700',
    },

    actionsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },

    smallButton: {
      flex: 1,
      minHeight: 42,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 8,
    },

    activeButton: {
      backgroundColor:
        '#2563A9',
    },

    finishButton: {
      backgroundColor:
        COLORS.primary,
    },

    cancelButton: {
      borderWidth: 1,
      borderColor:
        COLORS.danger,
      backgroundColor:
        '#FFF5F5',
    },

    smallButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '800',
    },

    cancelButtonText: {
      color: COLORS.danger,
      fontSize: 12,
      fontWeight: '800',
    },

    deleteButton: {
      height: 42,
      marginTop: 10,
      borderRadius: 14,
      backgroundColor:
        '#FFF2F2',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },

    deleteText: {
      color: COLORS.danger,
      fontWeight: '800',
      fontSize: 12,
    },

    emptyCard: {
      backgroundColor:
        COLORS.white,
      borderRadius: 22,
      padding: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E5EAE6',
    },

    emptyTitle: {
      marginTop: 11,
      fontSize: 17,
      fontWeight: '800',
      color: COLORS.text,
    },

    emptyText: {
      marginTop: 5,
      color: COLORS.gray,
      textAlign: 'center',
    },
  });