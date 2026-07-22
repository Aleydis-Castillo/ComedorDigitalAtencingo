import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { useOrder } from '@/context/OrderContext';
import PrimaryButton from '../buttons/PrimaryButton';

import TicketDivider from './Ticket/TicketDivider';
import TicketFingerprint from './Ticket/TicketFingerprint';
import TicketHeader from './Ticket/TicketHeader';
import TicketInfo from './Ticket/TicketInfo';

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

      <TicketHeader />

      <View style={styles.body}>

        <Text style={styles.title}>
          Pedido
        </Text>

        <Text style={styles.number}>
          Folio: TEMP-001
        </Text>

        <Text style={styles.status}>
          Estado: Pendiente de confirmación
        </Text>

        <Text style={styles.date}>
          {date}
        </Text>

        <Text style={styles.time}>
          {time}
        </Text>

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

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 6,
  },

  body: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  number: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },

  date: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
  },

  time: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 14,
    color: COLORS.gray,
  },
  
  status: {
  marginTop: 8,
  color: '#E67E22',
  fontWeight: '600',
  fontSize: 14,
},

});