import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../../constants/colors';
import { useOrder } from '../../../context/OrderContext';

import PrimaryButton from '../../buttons/PrimaryButton';

import TicketDivider from './TicketDivider';
import TicketFingerprint from './TicketFingerprint';
import TicketHeader from './TicketHeader';
import TicketInfo from './TicketInfo';
import TicketStatus from './TicketStatus';

interface Props {
  onConfirm: () => void;
}

export default function Ticket({
  onConfirm,
}: Props) {

  const {
    foodType,
    dish,
    deliveryType,
    zone,
    location,
    observations,
  } = useOrder();

  const [verified, setVerified] = useState(false);

  const now = new Date();

  const date = now.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const time = now.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>

      {/* Muescas superiores */}
      <View style={styles.leftTopNotch} />
      <View style={styles.rightTopNotch} />

      <TicketHeader />

      <View style={styles.body}>

        <Text style={styles.title}>
          Ticket de pedido
        </Text>

        <Text style={styles.number}>
          #TEMP-001
        </Text>

        <TicketStatus verified={verified} />

        <View style={styles.dateContainer}>

          <View style={styles.row}>

            <MaterialCommunityIcons
              name="calendar"
              size={18}
              color={COLORS.gray}
            />

            <Text style={styles.dateText}>
              {date}
            </Text>

          </View>

          <View style={styles.row}>

            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color={COLORS.gray}
            />

            <Text style={styles.dateText}>
              {time}
            </Text>

          </View>

        </View>

        <TicketDivider />

        <TicketInfo
          foodType={
            foodType === 'breakfast'
              ? 'Desayuno'
              : 'Comida'
          }
          dish={dish ?? '-'}
          deliveryType={
            deliveryType === 'cafeteria'
              ? 'Comedor'
              : 'Oficina'
          }
          zone={zone ?? ''}
          location={location}
          observations={
            observations.trim()
              ? observations
              : 'Sin observaciones'
          }
        />

        <TicketDivider />

        <TicketFingerprint
          verified={verified}
          onPress={() => setVerified(true)}
        />

        <PrimaryButton
          title={
            verified
              ? 'Confirmar pedido'
              : 'Verifica tu huella'
          }
          disabled={!verified}
          onPress={onConfirm}
        />

      </View>

      {/* Muescas inferiores */}
      <View style={styles.leftBottomNotch} />
      <View style={styles.rightBottomNotch} />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: COLORS.white,
    borderRadius: 26,
    overflow: 'hidden',
    marginHorizontal: 6,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },

  body: {
    paddingHorizontal: 18,
    paddingVertical: 16

  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },

  number: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },

  dateContainer: {
    marginTop: 18,
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  dateText: {
    marginLeft: 10,
    color: COLORS.gray,
    fontSize: 15,
  },

  leftTopNotch: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    left: -13,
    top: 155,
    zIndex: 50,
  },

  rightTopNotch: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    right: -13,
    top: 155,
    zIndex: 50,
  },

  leftBottomNotch: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    left: -13,
    bottom: 240,
    zIndex: 50,
  },

  rightBottomNotch: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    right: -13,
    bottom: 240,
    zIndex: 50,
  },

});