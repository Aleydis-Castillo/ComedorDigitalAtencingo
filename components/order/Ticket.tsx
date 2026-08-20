import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  COLORS,
} from '@/constants/colors';

import {
  useOrder,
} from '@/context/OrderContext';

import TicketDivider from './Ticket/TicketDivider';

import TicketHeader from './Ticket/TicketHeader';

import TicketInfo from './Ticket/TicketInfo';

interface Props {
  folio?: string;

  isConfirming?: boolean;

  /*
   * Lo dejamos opcional temporalmente
   * para no romper fingerprint.tsx
   * mientras terminamos el cambio.
   *
   * Ticket ya NO ejecuta la confirmación.
   */
  onConfirm?: () => void;
}

export default function Ticket({
  folio,
  isConfirming = false,
}: Props) {
  const {
    foodType,
    dish,

    deliveryType,

    location,

    observations,
  } = useOrder();

  const now =
    new Date();

  const date =
    now.toLocaleDateString(
      'es-MX',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    );

  const time =
    now.toLocaleTimeString(
      'es-MX',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );

  const foodTypeName =
    foodType ===
    'breakfast'
      ? 'Desayuno'
      : foodType ===
          'lunch'
        ? 'Comida'
        : '-';

  const deliveryTypeName =
    deliveryType ===
    'cafeteria'
      ? 'Comedor'
      : deliveryType ===
          'office'
        ? 'Oficina'
        : '-';

  return (
    <View
      style={
        styles.container
      }
    >
      <TicketHeader />

      <View
        style={
          styles.body
        }
      >
        <Text
          style={
            styles.title
          }
        >
          Pedido
        </Text>

        <Text
          style={
            styles.folioLabel
          }
        >
          FOLIO
        </Text>

        <Text
          style={[
            styles.number,

            !folio &&
              styles.pendingNumber,
          ]}
        >
          {folio
            ? folio
            : 'Se generará al confirmar'}
        </Text>

        <Text
          style={[
            styles.status,

            folio &&
              styles.statusConfirmed,
          ]}
        >
          {folio
            ? 'Estado: Pedido registrado'
            : isConfirming
              ? 'Estado: Registrando pedido...'
              : 'Estado: Pendiente de confirmación'}
        </Text>

        <View
          style={
            styles.dateRow
          }
        >
          <Text
            style={
              styles.date
            }
          >
            {date}
          </Text>

          <Text
            style={
              styles.time
            }
          >
            {time}
          </Text>
        </View>

        <TicketDivider />

        <TicketInfo
          foodType={
            foodTypeName
          }

          dish={
            dish ?? '-'
          }

          deliveryType={
            deliveryTypeName
          }
          location={
            deliveryType ===
            'office'
              ? location
              : ''
          }

          observations={
            observations.trim()
              ? observations.trim()
              : 'Sin observaciones'
          }
        />

        {folio && (
          <>
            <TicketDivider />

            <View
              style={
                styles.registeredCard
              }
            >
              <View
                style={
                  styles.registeredIcon
                }
              >
                <Text
                  style={
                    styles.check
                  }
                >
                  ✓
                </Text>
              </View>

              <View
                style={
                  styles.registeredContent
                }
              >
                <Text
                  style={
                    styles.registeredText
                  }
                >
                  Pedido registrado correctamente
                </Text>

                <Text
                  style={
                    styles.registeredSubtext
                  }
                >
                  Tu pedido fue enviado al comedor.
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      backgroundColor:
        COLORS.white,

      borderRadius: 24,

      overflow:
        'hidden',

      shadowColor:
        '#000',

      shadowOpacity:
        0.08,

      shadowRadius:
        10,

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

      fontWeight:
        'bold',

      color:
        COLORS.text,
    },

    folioLabel: {
      marginTop: 14,

      fontSize: 10,

      fontWeight:
        '800',

      letterSpacing: 1,

      color:
        COLORS.gray,
    },

    number: {
      marginTop: 4,

      fontSize: 18,

      fontWeight:
        '800',

      color:
        COLORS.primary,
    },

    pendingNumber: {
      fontSize: 15,

      fontWeight:
        '600',

      color:
        COLORS.gray,
    },

    status: {
      marginTop: 8,

      color:
        '#E67E22',

      fontWeight:
        '600',

      fontSize: 14,
    },

    statusConfirmed: {
      color:
        COLORS.primary,
    },

    dateRow: {
      marginTop: 12,
    },

    date: {
      fontSize: 14,

      color:
        COLORS.gray,
    },

    time: {
      marginTop: 4,

      marginBottom: 10,

      fontSize: 14,

      color:
        COLORS.gray,
    },

    registeredCard: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#EAF7EC',

      borderRadius: 16,

      paddingVertical: 14,

      paddingHorizontal: 16,
    },

    registeredIcon: {
      width: 36,

      height: 36,

      borderRadius: 18,

      backgroundColor:
        COLORS.primary,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 11,
    },

    check: {
      color:
        '#FFFFFF',

      fontSize: 20,

      fontWeight:
        '900',
    },

    registeredContent: {
      flex: 1,
    },

    registeredText: {
      color:
        COLORS.primary,

      fontSize: 14,

      fontWeight:
        '800',
    },

    registeredSubtext: {
      marginTop: 2,

      color:
        COLORS.gray,

      fontSize: 11,
    },
  });