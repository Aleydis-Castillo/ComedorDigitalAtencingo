import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardBackground from '../../components/backgrounds/DashboardBackground';

import { useAuth } from '../../context/AuthContext';

import {
  getUserOrders,
  UserOrder,
} from '../../services/orderApi';

type DisplayStatus =
  | 'Pendiente'
  | 'Preparando'
  | 'Listo'
  | 'Entregado'
  | 'Cancelado';

function translateStatus(
  status: UserOrder['status'],
): DisplayStatus {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';

    case 'PREPARING':
      return 'Preparando';

    case 'READY':
      return 'Listo';

    case 'DELIVERED':
      return 'Entregado';

    case 'CANCELLED':
      return 'Cancelado';
  }
}

function getStatusStyle(
  status: DisplayStatus,
) {
  switch (status) {
    case 'Pendiente':
      return {
        color: '#D97706',
        backgroundColor: '#FFF4D8',
        icon:
          'clock-outline' as const,
      };

    case 'Preparando':
      return {
        color: '#C46A19',
        backgroundColor: '#FFF0DF',
        icon:
          'chef-hat' as const,
      };

    case 'Listo':
      return {
        color: '#2563A9',
        backgroundColor: '#EAF3FA',
        icon:
          'check-circle-outline' as const,
      };

    case 'Entregado':
      return {
        color: '#438B32',
        backgroundColor: '#EEF6E9',
        icon:
          'package-variant-closed-check' as const,
      };

    case 'Cancelado':
      return {
        color: '#C2413A',
        backgroundColor: '#FDECEA',
        icon:
          'close-circle-outline' as const,
      };
  }
}

function formatDate(
  dateValue: string,
) {
  const date = new Date(dateValue);

  return date.toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    },
  );
}

function OrderCard({
  order,
}: {
  order: UserOrder;
}) {
  const status =
    translateStatus(order.status);

  const statusStyle =
    getStatusStyle(status);

  const foodType =
    order.service === 'BREAKFAST'
      ? 'Desayuno'
      : 'Comida';

  const deliveryType =
    order.deliveryType ===
    'CAFETERIA'
      ? 'Comedor'
      : 'Oficina';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.folioContainer}>
          <Text style={styles.folioLabel}>
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
                statusStyle.backgroundColor,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={statusStyle.icon}
            size={16}
            color={statusStyle.color}
          />

          <Text
            style={[
              styles.statusText,
              {
                color:
                  statusStyle.color,
              },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={20}
            color="#576174"
          />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>
            Fecha
          </Text>

          <Text style={styles.infoValue}>
            {formatDate(
              order.orderedFor,
            )}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={
              order.service ===
              'BREAKFAST'
                ? 'coffee-outline'
                : 'silverware-fork-knife'
            }
            size={20}
            color="#576174"
          />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>
            Tipo de alimento
          </Text>

          <Text style={styles.infoValue}>
            {foodType}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="food-outline"
            size={20}
            color="#576174"
          />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>
            Platillo
          </Text>

          <Text style={styles.infoValue}>
            {order.dish.name}
          </Text>

          {!!order.dish.description && (
            <Text
              style={
                styles.description
              }
            >
              {order.dish.description}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={
              order.deliveryType ===
              'OFFICE'
                ? 'truck-delivery-outline'
                : 'storefront-outline'
            }
            size={20}
            color="#576174"
          />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>
            Entrega
          </Text>

          <Text style={styles.infoValue}>
            {deliveryType}
          </Text>
        </View>
      </View>

      {order.deliveryType ===
        'OFFICE' && (
        <>
          {!!order.zone && (
            <View style={styles.infoRow}>
              <View
                style={
                  styles.iconContainer
                }
              >
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={20}
                  color="#576174"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Zona
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {order.zone}
                </Text>
              </View>
            </View>
          )}

          {!!order.location && (
            <View style={styles.infoRow}>
              <View
                style={
                  styles.iconContainer
                }
              >
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={20}
                  color="#576174"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Ubicación
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {order.location}
                </Text>
              </View>
            </View>
          )}
        </>
      )}

      {!!order.observations && (
        <View
          style={
            styles.observationsCard
          }
        >
          <MaterialCommunityIcons
            name="message-text-outline"
            size={20}
            color="#697386"
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
    </View>
  );
}

export default function MyOrdersScreen() {
  const { user } = useAuth();

  const [orders, setOrders] =
    useState<UserOrder[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const loadOrders = useCallback(
    async (
      showLoading = true,
    ) => {
      if (!user?.id) {
        setOrders([]);
        setIsLoading(false);
        setIsRefreshing(false);

        return;
      }

      try {
        if (showLoading) {
          setIsLoading(true);
        }

        const userOrders =
          await getUserOrders(
            user.id,
          );

        setOrders(userOrders);
      } catch (error) {
        console.error(
          'Error al consultar pedidos:',
          error,
        );

        Alert.alert(
          'No fue posible cargar tus pedidos',
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.',
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadOrders(false);
  };

  if (isLoading) {
    return (
      <DashboardBackground>
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#3679AD"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Consultando tus pedidos...
          </Text>
        </View>
      </DashboardBackground>
    );
  }

  return (
    <DashboardBackground>
      <FlatList
        data={orders}
        keyExtractor={item =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={[
          styles.content,
          orders.length === 0 &&
            styles.emptyContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={
              handleRefresh
            }
            colors={['#3679AD']}
            tintColor="#3679AD"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View
              style={
                styles.headerIcon
              }
            >
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={28}
                color="#3679AD"
              />
            </View>

            <View
              style={
                styles.headerText
              }
            >
              <Text
                style={styles.title}
              >
                Mis pedidos
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Consulta el historial y el estado de tus pedidos.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyCard
            }
          >
            <MaterialCommunityIcons
              name="clipboard-text-off-outline"
              size={50}
              color="#A0A7B2"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              Aún no tienes pedidos
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Cuando realices uno aparecerá aquí.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
          />
        )}
      />
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 40,
  },

  emptyContent: {
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#687284',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#EAF3FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 29,
    fontWeight: '900',
    color: '#121B2B',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#687284',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: '#F0F0ED',
    elevation: 4,

    shadowColor: '#1B2636',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 9,
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
    fontSize: 10,
    fontWeight: '800',
    color: '#9198A3',
    letterSpacing: 1,
  },

  folio: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '900',
    color: '#182334',
  },

  statusBadge: {
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 11,
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
    backgroundColor: '#ECEDEB',
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F4F5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: '#9299A5',
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202938',
  },

  description: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: '#7A8390',
  },

  observationsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F8F6',
    borderRadius: 16,
    padding: 13,
    marginTop: 3,
  },

  observationsContent: {
    flex: 1,
    marginLeft: 10,
  },

  observationsLabel: {
    fontSize: 11,
    color: '#9299A5',
    marginBottom: 3,
  },

  observationsText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#465060',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingVertical: 42,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0ED',
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '800',
    color: '#182334',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#747E8D',
  },
});