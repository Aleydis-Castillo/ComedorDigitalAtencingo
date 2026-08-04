import React from 'react';

import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardBackground from '../../components/backgrounds/DashboardBackground';

interface Order {
  id: number;
  folio: string;
  date: string;
  foodType: 'Desayuno' | 'Comida';
  dish: string;
  deliveryType: 'Comedor' | 'Oficina';
  status: 'Pendiente' | 'Confirmado' | 'Entregado' | 'Cancelado';
}

const orders: Order[] = [
  {
    id: 1,
    folio: 'ATN-260723-4821',
    date: '23 de julio de 2026',
    foodType: 'Comida',
    dish: 'Pollo en salsa verde',
    deliveryType: 'Comedor',
    status: 'Pendiente',
  },
  {
    id: 2,
    folio: 'ATN-260722-3157',
    date: '22 de julio de 2026',
    foodType: 'Desayuno',
    dish: 'Huevos con frijoles',
    deliveryType: 'Oficina',
    status: 'Entregado',
  },
  {
    id: 3,
    folio: 'ATN-260721-9084',
    date: '21 de julio de 2026',
    foodType: 'Comida',
    dish: 'Mole poblano con arroz',
    deliveryType: 'Comedor',
    status: 'Confirmado',
  },
];

function getStatusStyle(status: Order['status']) {
  switch (status) {
    case 'Pendiente':
      return {
        color: '#D97706',
        backgroundColor: '#FFF4D8',
        icon: 'clock-outline' as const,
      };

    case 'Confirmado':
      return {
        color: '#2563A9',
        backgroundColor: '#EAF3FA',
        icon: 'check-circle-outline' as const,
      };

    case 'Entregado':
      return {
        color: '#438B32',
        backgroundColor: '#EEF6E9',
        icon: 'package-variant-closed-check' as const,
      };

    case 'Cancelado':
      return {
        color: '#C2413A',
        backgroundColor: '#FDECEA',
        icon: 'close-circle-outline' as const,
      };
  }
}

function OrderCard({
  order,
}: {
  order: Order;
}) {
  const statusStyle = getStatusStyle(order.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
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
                color: statusStyle.color,
              },
            ]}
          >
            {order.status}
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
            {order.date}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={
              order.foodType === 'Desayuno'
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
            {order.foodType}
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
            {order.dish}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={
              order.deliveryType === 'Oficina'
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
            {order.deliveryType}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function MyOrdersScreen() {
  return (
    <DashboardBackground>
      <FlatList
        data={orders}
        keyExtractor={(item) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={28}
                color="#3679AD"
              />
            </View>

            <View style={styles.headerText}>
              <Text style={styles.title}>
                Mis pedidos
              </Text>

              <Text style={styles.subtitle}>
                Consulta el historial y el estado de tus pedidos.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="clipboard-text-off-outline"
              size={50}
              color="#A0A7B2"
            />

            <Text style={styles.emptyTitle}>
              Aún no tienes pedidos
            </Text>

            <Text style={styles.emptyText}>
              Cuando realices uno aparecerá aquí.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard order={item} />
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
    justifyContent: 'space-between',
    gap: 10,
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