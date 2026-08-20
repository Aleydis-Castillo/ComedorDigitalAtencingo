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

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
    router,
} from 'expo-router';

import DashboardBackground from '../../components/backgrounds/DashboardBackground';

import {
    useAuth,
} from '../../context/AuthContext';

import {
    getUserOrders,
    UserOrder,
} from '../../services/orderApi';

function getNotificationData(
  order: UserOrder,
) {
  switch (order.status) {
    case 'READY':
      return {
        title:
          '¡Tu pedido está listo!',

        message:
          order.deliveryType ===
          'CAFETERIA'
            ? `Tu ${order.service === 'BREAKFAST' ? 'desayuno' : 'comida'}: ${order.dish.name}, ya está listo para recoger en el comedor.`
            : `Tu ${order.service === 'BREAKFAST' ? 'desayuno' : 'comida'}: ${order.dish.name}, ya está listo y será enviado a ${order.location || 'tu ubicación'}.`,

        icon:
          'check-circle-outline' as const,

        iconColor:
          '#2E7D32',

        backgroundColor:
          '#EAF7EC',
      };

    case 'PREPARING':
      return {
        title:
          'Tu pedido está en preparación',

        message:
          `Estamos preparando ${order.dish.name}. Te avisaremos cuando esté listo.`,

        icon:
          'chef-hat' as const,

        iconColor:
          '#D97706',

        backgroundColor:
          '#FFF4DF',
      };

    case 'PENDING':
      return {
        title:
          'Pedido recibido',

        message:
          `Tu pedido ${order.folio} fue recibido correctamente.`,

        icon:
          'clock-outline' as const,

        iconColor:
          '#3679AD',

        backgroundColor:
          '#EAF3FA',
      };

    case 'DELIVERED':
      return {
        title:
          'Pedido entregado',

        message:
          `Tu pedido ${order.folio} fue marcado como entregado.`,

        icon:
          'package-variant-closed-check' as const,

        iconColor:
          '#438B32',

        backgroundColor:
          '#EEF6E9',
      };

    case 'CANCELLED':
      return {
        title:
          'Pedido cancelado',

        message:
          `El pedido ${order.folio} fue cancelado.`,

        icon:
          'close-circle-outline' as const,

        iconColor:
          '#C2413A',

        backgroundColor:
          '#FDECEA',
      };
  }
}

function formatDate(
  value: string,
) {
  return new Date(
    value,
  ).toLocaleString(
    'es-MX',
    {
      day:
        '2-digit',

      month:
        'short',

      hour:
        '2-digit',

      minute:
        '2-digit',
    },
  );
}

function NotificationCard({
  order,
}: {
  order: UserOrder;
}) {
  const notification =
    getNotificationData(
      order,
    );

  return (
    <View
      style={
        styles.notificationCard
      }
    >
      <View
        style={[
          styles.notificationIcon,

          {
            backgroundColor:
              notification.backgroundColor,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={
            notification.icon
          }
          size={27}
          color={
            notification.iconColor
          }
        />
      </View>

      <View
        style={
          styles.notificationContent
        }
      >
        <Text
          style={
            styles.notificationTitle
          }
        >
          {notification.title}
        </Text>

        <Text
          style={
            styles.notificationMessage
          }
        >
          {notification.message}
        </Text>

        <View
          style={
            styles.notificationFooter
          }
        >
          <Text
            style={
              styles.folio
            }
          >
            {order.folio}
          </Text>

          <Text
            style={
              styles.date
            }
          >
            {formatDate(
              order.createdAt,
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const {
    user,
  } = useAuth();

  const [
    orders,
    setOrders,
  ] =
    useState<
      UserOrder[]
    >([]);

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

  const loadNotifications =
    useCallback(
      async (
        showLoading =
          true,
      ) => {
        if (!user?.id) {
          setOrders([]);
          setIsLoading(
            false,
          );

          return;
        }

        try {
          if (
            showLoading
          ) {
            setIsLoading(
              true,
            );
          }

          const data =
            await getUserOrders(
              user.id,
            );

          /*
           * Ordenamos del más
           * reciente al más antiguo.
           */
          const sorted =
            [...data].sort(
              (
                first,
                second,
              ) =>
                new Date(
                  second.createdAt,
                ).getTime() -
                new Date(
                  first.createdAt,
                ).getTime(),
            );

          setOrders(
            sorted,
          );
        } catch (error) {
          console.error(
            'Error al consultar notificaciones:',
            error,
          );

          Alert.alert(
            'No fue posible cargar las notificaciones',

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
      [
        user?.id,
      ],
    );

  useEffect(() => {
    loadNotifications();
  }, [
    loadNotifications,
  ]);

  const handleRefresh =
    () => {
      setIsRefreshing(
        true,
      );

      loadNotifications(
        false,
      );
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
            Consultando notificaciones...
          </Text>
        </View>
      </DashboardBackground>
    );
  }

  return (
    <DashboardBackground>
      <FlatList
        data={
          orders
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
          <View
            style={
              styles.header
            }
          >
            <View
              style={
                styles.headerTop
              }
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={27}
                color="#182334"
                onPress={() =>
                  router.back()
                }
              />

              <View
                style={
                  styles.headerIcon
                }
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={27}
                  color="#3679AD"
                />
              </View>
            </View>

            <Text
              style={
                styles.title
              }
            >
              Notificaciones
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Aquí podrás consultar los cambios de estado de tus pedidos.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyCard
            }
          >
            <MaterialCommunityIcons
              name="bell-sleep-outline"
              size={52}
              color="#A0A7B2"
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              Sin notificaciones
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Cuando haya novedades sobre tus pedidos aparecerán aquí.
            </Text>
          </View>
        }
        renderItem={({
          item,
        }) => (
          <NotificationCard
            order={item}
          />
        )}
      />
    </DashboardBackground>
  );
}

const styles =
  StyleSheet.create({
    content: {
      paddingHorizontal: 18,

      paddingTop: 48,

      paddingBottom: 40,
    },

    loadingContainer: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    loadingText: {
      marginTop: 12,

      color:
        '#687284',
    },

    header: {
      marginBottom: 24,
    },

    headerTop: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom: 17,
    },

    headerIcon: {
      width: 50,

      height: 50,

      borderRadius: 16,

      backgroundColor:
        '#EAF3FA',

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    title: {
      color:
        '#121B2B',

      fontSize: 30,

      fontWeight:
        '900',
    },

    subtitle: {
      marginTop: 5,

      color:
        '#687284',

      fontSize: 14,

      lineHeight: 20,
    },

    notificationCard: {
      flexDirection:
        'row',

      backgroundColor:
        '#FFFFFF',

      borderRadius: 21,

      padding: 16,

      marginBottom: 13,

      borderWidth: 1,

      borderColor:
        '#EFF0EE',
    },

    notificationIcon: {
      width: 52,

      height: 52,

      borderRadius: 17,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginRight: 13,
    },

    notificationContent: {
      flex: 1,
    },

    notificationTitle: {
      color:
        '#182334',

      fontSize: 15,

      fontWeight:
        '900',
    },

    notificationMessage: {
      marginTop: 5,

      color:
        '#687284',

      fontSize: 12,

      lineHeight: 18,
    },

    notificationFooter: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      marginTop: 10,
    },

    folio: {
      color:
        '#3679AD',

      fontSize: 10,

      fontWeight:
        '800',
    },

    date: {
      color:
        '#9AA1AB',

      fontSize: 10,
    },

    emptyCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 22,

      padding: 40,

      alignItems:
        'center',
    },

    emptyTitle: {
      marginTop: 13,

      color:
        '#182334',

      fontSize: 18,

      fontWeight:
        '800',
    },

    emptyText: {
      marginTop: 6,

      color:
        '#747E8D',

      textAlign:
        'center',

      fontSize: 13,

      lineHeight: 19,
    },
  });