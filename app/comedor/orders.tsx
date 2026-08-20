import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router } from 'expo-router';

import {
    ComedorOrder,
    getAllOrders,
    updateOrderStatus,
} from '../../services/orderApi';

import { COLORS } from '../../constants/colors';

type StatusFilter =
  | 'ALL'
  | 'PENDING'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED';

const filters: {
  key: StatusFilter;
  label: string;
}[] = [
  {
    key: 'ALL',
    label: 'Todos',
  },
  {
    key: 'PENDING',
    label: 'Pendientes',
  },
  {
    key: 'PREPARING',
    label: 'Preparando',
  },
  {
    key: 'READY',
    label: 'Listos',
  },
  {
    key: 'DELIVERED',
    label: 'Entregados',
  },
];

function formatDate(
  value: string,
) {
  const date = new Date(value);

  return date.toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    },
  );
}

function getStatusConfig(
  status: ComedorOrder['status'],
) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pendiente',
        color: '#D97706',
        backgroundColor:
          '#FFF4D8',
        icon:
          'clock-outline' as const,
      };

    case 'PREPARING':
      return {
        label: 'Preparando',
        color: '#C46A19',
        backgroundColor:
          '#FFF0DF',
        icon:
          'chef-hat' as const,
      };

    case 'READY':
      return {
        label: 'Listo',
        color: '#2563A9',
        backgroundColor:
          '#EAF3FA',
        icon:
          'check-circle-outline' as const,
      };

    case 'DELIVERED':
      return {
        label: 'Entregado',
        color: '#438B32',
        backgroundColor:
          '#EEF6E9',
        icon:
          'package-variant-closed-check' as const,
      };

    case 'CANCELLED':
      return {
        label: 'Cancelado',
        color: '#C2413A',
        backgroundColor:
          '#FDECEA',
        icon:
          'close-circle-outline' as const,
      };
  }
}

function getNextStatus(
  status: ComedorOrder['status'],
):
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | null {
  switch (status) {
    case 'PENDING':
      return 'PREPARING';

    case 'PREPARING':
      return 'READY';

    case 'READY':
      return 'DELIVERED';

    default:
      return null;
  }
}

function getNextButtonTitle(
  status: ComedorOrder['status'],
) {
  switch (status) {
    case 'PENDING':
      return 'Preparar pedido';

    case 'PREPARING':
      return 'Marcar como listo';

    case 'READY':
      return 'Entregar pedido';

    default:
      return null;
  }
}

function InfoRow({
  icon,
  label,
  value,
  secondary,
}: {
  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color="#576174"
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>

        {!!secondary && (
          <Text
            style={
              styles.infoSecondary
            }
          >
            {secondary}
          </Text>
        )}
      </View>
    </View>
  );
}

function OrderCard({
  order,
  onChangeStatus,
  isUpdating,
}: {
  order: ComedorOrder;

  onChangeStatus: (
    order: ComedorOrder,
  ) => void;

  isUpdating: boolean;
}) {
  const statusConfig =
    getStatusConfig(
      order.status,
    );

  const nextButtonTitle =
    getNextButtonTitle(
      order.status,
    );

  const serviceName =
    order.service ===
    'BREAKFAST'
      ? 'Desayuno'
      : 'Comida';

  const deliveryName =
    order.deliveryType ===
    'CAFETERIA'
      ? 'Comedor'
      : 'Oficina';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={
            styles.folioContainer
          }
        >
          <Text
            style={
              styles.folioLabel
            }
          >
            FOLIO
          </Text>

          <Text style={styles.folio}>
            {order.folio}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                statusConfig
                  .backgroundColor,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={statusConfig.icon}
            size={16}
            color={
              statusConfig.color
            }
          />

          <Text
            style={[
              styles.statusText,
              {
                color:
                  statusConfig.color,
              },
            ]}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.employeeRow}>
        <View
          style={
            styles.employeeIcon
          }
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={25}
            color={COLORS.primary}
          />
        </View>

        <View
          style={
            styles.employeeContent
          }
        >
          <Text
            style={
              styles.employeeName
            }
          >
            {order.user.name}
          </Text>

          <Text
            style={
              styles.employeeInfo
            }
          >
            {order.user
              .employeeNumber
              ? `No. ${order.user.employeeNumber}`
              : 'Sin número de trabajador'}

            {order.user.department
              ? ` · ${order.user.department}`
              : ''}
          </Text>
        </View>
      </View>

      <InfoRow
        icon={
          order.service ===
          'BREAKFAST'
            ? 'coffee-outline'
            : 'silverware-fork-knife'
        }
        label="Servicio"
        value={serviceName}
      />

      <InfoRow
        icon="food-outline"
        label="Platillo"
        value={order.dish.name}
        secondary={
          order.dish.description ??
          undefined
        }
      />

      <InfoRow
        icon={
          order.deliveryType ===
          'CAFETERIA'
            ? 'storefront-outline'
            : 'truck-delivery-outline'
        }
        label="Entrega"
        value={deliveryName}
      />

      {order.deliveryType ===
        'OFFICE' && (
        <>
          {!!order.zone && (
            <InfoRow
              icon="map-marker-radius-outline"
              label="Zona"
              value={order.zone}
            />
          )}

          {!!order.location && (
            <InfoRow
              icon="map-marker-outline"
              label="Ubicación"
              value={
                order.location
              }
            />
          )}
        </>
      )}

      <InfoRow
        icon="calendar-month-outline"
        label="Fecha"
        value={formatDate(
          order.orderedFor,
        )}
      />

      {!!order.observations && (
        <View
          style={
            styles.observationsCard
          }
        >
          <MaterialCommunityIcons
            name="message-text-outline"
            size={20}
            color="#687284"
          />

          <View
            style={
              styles.observationsContent
            }
          >
            <Text
              style={
                styles.observationsLabel
              }
            >
              Observaciones
            </Text>

            <Text
              style={
                styles.observationsText
              }
            >
              {order.observations}
            </Text>
          </View>
        </View>
      )}

      {nextButtonTitle && (
        <Pressable
          disabled={isUpdating}
          onPress={() =>
            onChangeStatus(order)
          }
          style={({ pressed }) => [
            styles.actionButton,

            isUpdating &&
              styles.actionButtonDisabled,

            pressed &&
              !isUpdating &&
              styles.actionButtonPressed,
          ]}
        >
          {isUpdating ? (
            <ActivityIndicator
              color="#FFFFFF"
              size="small"
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="arrow-right-circle-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.actionButtonText
                }
              >
                {nextButtonTitle}
              </Text>
            </>
          )}
        </Pressable>
      )}

      {order.status ===
        'DELIVERED' && (
        <View
          style={
            styles.deliveredCard
          }
        >
          <MaterialCommunityIcons
            name="check-decagram-outline"
            size={21}
            color={COLORS.primary}
          />

          <Text
            style={
              styles.deliveredText
            }
          >
            Pedido entregado
          </Text>
        </View>
      )}
    </View>
  );
}

export default function OrdersScreen() {
  const [orders, setOrders] =
    useState<ComedorOrder[]>(
      [],
    );

  const [
    selectedFilter,
    setSelectedFilter,
  ] =
    useState<StatusFilter>(
      'ALL',
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    updatingOrderId,
    setUpdatingOrderId,
  ] =
    useState<string | null>(
      null,
    );

  const loadOrders =
    useCallback(
      async (
        showLoading = true,
      ) => {
        try {
          if (showLoading) {
            setIsLoading(true);
          }

          /*
           * getAllOrders()
           * devuelve directamente
           * ComedorOrder[]
           */
          const data =
            await getAllOrders();

          setOrders(data);
        } catch (error) {
          console.error(
            'Error al cargar pedidos:',
            error,
          );

          Alert.alert(
            'No fue posible cargar los pedidos',
            error instanceof Error
              ? error.message
              : 'Ocurrió un error inesperado.',
          );
        } finally {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      },
      [],
    );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders =
    useMemo(() => {
      if (
        selectedFilter ===
        'ALL'
      ) {
        return orders;
      }

      return orders.filter(
        order =>
          order.status ===
          selectedFilter,
      );
    }, [
      orders,
      selectedFilter,
    ]);

  const pendingCount =
    orders.filter(
      order =>
        order.status ===
        'PENDING',
    ).length;

  const preparingCount =
    orders.filter(
      order =>
        order.status ===
        'PREPARING',
    ).length;

  const readyCount =
    orders.filter(
      order =>
        order.status ===
        'READY',
    ).length;

  const handleRefresh = () => {
    setIsRefreshing(true);

    loadOrders(false);
  };

  const handleChangeStatus =
    async (
      order: ComedorOrder,
    ) => {
      const nextStatus =
        getNextStatus(
          order.status,
        );

      if (!nextStatus) {
        return;
      }

      try {
        setUpdatingOrderId(
          order.id,
        );

        /*
         * updateOrderStatus()
         * devuelve directamente
         * el pedido actualizado.
         */
        const updatedOrder =
          await updateOrderStatus(
            order.id,
            nextStatus,
          );

        setOrders(previous =>
          previous.map(item =>
            item.id ===
            updatedOrder.id
              ? {
                  ...item,
                  ...updatedOrder,
                }
              : item,
          ),
        );
      } catch (error) {
        console.error(
          'Error al cambiar estado:',
          error,
        );

        Alert.alert(
          'No fue posible actualizar el pedido',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setUpdatingOrderId(
          null,
        );
      }
    };

  if (isLoading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Consultando pedidos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredOrders}
        keyExtractor={item =>
          item.id
        }
        renderItem={({
          item,
        }) => (
          <OrderCard
            order={item}
            isUpdating={
              updatingOrderId ===
              item.id
            }
            onChangeStatus={
              handleChangeStatus
            }
          />
        )}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={
              handleRefresh
            }
            colors={[
              COLORS.primary,
            ]}
            tintColor={
              COLORS.primary
            }
          />
        }
        ListHeaderComponent={
          <>
            <View
              style={styles.topRow}
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

              <Text
                style={
                  styles.topRowTitle
                }
              >
                Pedidos / Tickets
              </Text>
            </View>

            <View
              style={styles.header}
            >
              <View>
                <Text
                  style={
                    styles.greeting
                  }
                >
                  Comedor Digital
                </Text>

                <Text
                  style={styles.title}
                >
                  Pedidos
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Administra la preparación y entrega de los pedidos.
                </Text>
              </View>

              <View
                style={
                  styles.headerIcon
                }
              >
                <MaterialCommunityIcons
                  name="chef-hat"
                  size={30}
                  color={
                    COLORS.primary
                  }
                />
              </View>
            </View>

            <View
              style={
                styles.statsRow
              }
            >
              <StatCard
                label="Pendientes"
                value={
                  pendingCount
                }
                icon="clock-outline"
              />

              <StatCard
                label="Preparando"
                value={
                  preparingCount
                }
                icon="chef-hat"
              />

              <StatCard
                label="Listos"
                value={
                  readyCount
                }
                icon="check-circle-outline"
              />
            </View>

            <FlatList
              horizontal
              data={filters}
              keyExtractor={item =>
                item.key
              }
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.filtersContainer
              }
              renderItem={({
                item,
              }) => {
                const selected =
                  item.key ===
                  selectedFilter;

                return (
                  <Pressable
                    onPress={() =>
                      setSelectedFilter(
                        item.key,
                      )
                    }
                    style={[
                      styles.filterButton,

                      selected &&
                        styles.filterButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,

                        selected &&
                          styles.filterTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <Text
              style={
                styles.sectionTitle
              }
            >
              {selectedFilter ===
              'ALL'
                ? 'Todos los tickets'
                : filters.find(
                    item =>
                      item.key ===
                      selectedFilter,
                  )?.label}
            </Text>
          </>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyCard
            }
          >
            <MaterialCommunityIcons
              name="food-off-outline"
              size={48}
              color="#9AA2AE"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              No hay pedidos
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              No existen pedidos en esta categoría.
            </Text>
          </View>
        }
      />
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;

  icon:
    keyof typeof MaterialCommunityIcons.glyphMap;
}) {
  return (
    <View
      style={styles.statCard}
    >
      <MaterialCommunityIcons
        name={icon}
        size={21}
        color={COLORS.primary}
      />

      <Text
        style={styles.statValue}
      >
        {value}
      </Text>

      <Text
        style={styles.statLabel}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.background,
  },

  loadingText: {
    marginTop: 14,
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '700',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor:
      COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 2,
  },

  topRowTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 22,
  },

  greeting: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },

  title: {
    marginTop: 3,
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 5,
    maxWidth: 260,
    color: COLORS.gray,
    fontSize: 14,
  },

  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor:
      '#E4F3E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    minHeight: 96,
    backgroundColor:
      COLORS.white,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E6EAE7',
  },

  statValue: {
    marginTop: 5,
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
  },

  statLabel: {
    marginTop: 2,
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: '700',
  },

  filtersContainer: {
    gap: 9,
    paddingBottom: 20,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 17,
    backgroundColor:
      COLORS.white,
    borderWidth: 1,
    borderColor: '#E3E7E4',
  },

  filterButtonSelected: {
    backgroundColor:
      COLORS.primary,
    borderColor:
      COLORS.primary,
  },

  filterText: {
    color: '#667080',
    fontSize: 13,
    fontWeight: '700',
  },

  filterTextSelected: {
    color: '#FFFFFF',
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 14,
  },

  card: {
    backgroundColor:
      COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: '#E8ECE9',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 10,
  },

  folioContainer: {
    flex: 1,
  },

  folioLabel: {
    color: '#9198A3',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  folio: {
    marginTop: 4,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  statusBadge: {
    minHeight: 34,
    paddingHorizontal: 11,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor:
      '#EBEEEC',
    marginVertical: 15,
  },

  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  employeeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor:
      '#EAF5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  employeeContent: {
    flex: 1,
  },

  employeeName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },

  employeeInfo: {
    marginTop: 3,
    color: COLORS.gray,
    fontSize: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor:
      '#F4F5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    color: '#9299A5',
    fontSize: 11,
    marginBottom: 2,
  },

  infoValue: {
    color: '#202938',
    fontSize: 14,
    fontWeight: '700',
  },

  infoSecondary: {
    marginTop: 3,
    color: '#7A8390',
    fontSize: 12,
  },

  observationsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor:
      '#F7F8F6',
    borderRadius: 16,
    padding: 13,
    marginTop: 3,
    marginBottom: 14,
  },

  observationsContent: {
    flex: 1,
    marginLeft: 10,
  },

  observationsLabel: {
    color: '#9299A5',
    fontSize: 11,
    marginBottom: 3,
  },

  observationsText: {
    color: '#465060',
    fontSize: 13,
    lineHeight: 18,
  },

  actionButton: {
    minHeight: 50,
    borderRadius: 17,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 5,
  },

  actionButtonPressed: {
    opacity: 0.85,
  },

  actionButtonDisabled: {
    opacity: 0.6,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  deliveredCard: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor:
      '#EAF5EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 7,
  },

  deliveredText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingVertical: 42,
    borderWidth: 1,
    borderColor: '#E7EBE8',
  },

  emptyTitle: {
    marginTop: 14,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 6,
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
  },
});