import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatusCardProps {
  breakfastAvailable: boolean;
  lunchAvailable: boolean;
  orderMade: boolean;
}

interface StatusItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  status: string;
  available: boolean;
  warning?: boolean;
}

function StatusItem({
  icon,
  title,
  status,
  available,
  warning = false,
}: StatusItemProps) {
  const mainColor = warning
    ? '#F59E0B'
    : available
      ? '#4A9A35'
      : '#9B4A43';

  const iconBackground = warning
    ? '#FFF1D6'
    : available
      ? '#EEF6E9'
      : '#FBE9E7';

  return (
    <View style={styles.item}>
      <View
        style={[
          styles.statusIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color="#50596A"
        />

        <View
          style={[
            styles.badge,
            {
              backgroundColor: mainColor,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={warning ? 'clock-outline' : 'check'}
            size={13}
            color="#FFFFFF"
          />
        </View>
      </View>

      <Text style={styles.itemTitle}>
        {title}
      </Text>

      <Text
        style={[
          styles.itemStatus,
          {
            color: mainColor,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

export default function StatusCard({
  breakfastAvailable,
  lunchAvailable,
  orderMade,
}: StatusCardProps) {
  return (
    <View style={styles.card}>
      <StatusItem
        icon="coffee-outline"
        title="Desayuno"
        status={
          breakfastAvailable
            ? 'Disponible'
            : 'No disponible'
        }
        available={breakfastAvailable}
      />

      <View style={styles.divider} />

      <StatusItem
        icon="silverware-fork-knife"
        title="Comida"
        status={
          lunchAvailable
            ? 'Disponible'
            : 'No disponible'
        }
        available={lunchAvailable}
      />

      <View style={styles.divider} />

      <StatusItem
        icon="package-variant-closed"
        title={orderMade ? 'Pedido realizado' : 'Pedido pendiente'}
        status={orderMade ? 'Confirmado' : 'Pendiente'}
        available={orderMade}
        warning={!orderMade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F0ED',
    paddingHorizontal: 8,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 35,
    elevation: 4,

    shadowColor: '#1B2636',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 9,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },

  badge: {
    position: 'absolute',
    right: -1,
    bottom: 1,
    width: 23,
    height: 23,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  itemTitle: {
    color: '#151D2B',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  itemStatus: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  divider: {
    width: 1,
    backgroundColor: '#E6E8E5',
    marginVertical: 8,
  },
});