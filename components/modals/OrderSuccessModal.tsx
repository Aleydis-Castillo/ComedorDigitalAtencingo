import React, {
    useEffect,
    useRef,
} from 'react';

import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    MaterialCommunityIcons,
} from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

interface Props {
  visible: boolean;
  folio: string;
  foodType: 'breakfast' | 'lunch' | null;
  dish: string | null;
  deliveryType: 'cafeteria' | 'office' | null;
  officeArea?: string | null;
  location?: string | null;
  onGoHome: () => void;
}

export default function OrderSuccessModal({
  visible,
  folio,
  foodType,
  dish,
  deliveryType,
  officeArea,
  location,
  onGoHome,
}: Props) {
  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const scale = useRef(
    new Animated.Value(0.8)
  ).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      scale.setValue(0.8);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    visible,
    opacity,
    scale,
  ]);

  const foodTypeLabel =
    foodType === 'breakfast'
      ? 'Desayuno'
      : foodType === 'lunch'
        ? 'Comida'
        : 'Sin especificar';

    const deliveryLabel =
    deliveryType === 'cafeteria'
        ? 'Recoger en comedor'
        : deliveryType === 'office'
        ? location
            ? `${officeArea ?? 'Oficina'} - ${location}`
            : officeArea
            ? `Entrega en ${officeArea}`
            : 'Entrega en oficina'
        : 'Sin especificar';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {
        // Evita cerrar el modal con el botón
        // de retroceso sin finalizar el proceso.
      }}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [
                {
                  scale,
                },
              ],
            },
          ]}
        >
          <View style={styles.successIconContainer}>
            <MaterialCommunityIcons
              name="check"
              size={50}
              color={COLORS.white}
            />
          </View>

          <Text style={styles.title}>
            Pedido confirmado
          </Text>

          <Text style={styles.message}>
            Tu pedido fue enviado correctamente a cocina.
          </Text>

          <View style={styles.folioContainer}>
            <Text style={styles.folioLabel}>
              FOLIO DEL PEDIDO
            </Text>

            <Text style={styles.folio}>
              {folio}
            </Text>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <View style={styles.rowIcon}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={21}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>
                  Tipo de alimento
                </Text>

                <Text style={styles.rowValue}>
                  {foodTypeLabel}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <View style={styles.rowIcon}>
                <MaterialCommunityIcons
                  name="food-outline"
                  size={22}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>
                  Platillo
                </Text>

                <Text style={styles.rowValue}>
                  {dish ?? 'Sin especificar'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <View style={styles.rowIcon}>
                <MaterialCommunityIcons
                  name={
                    deliveryType === 'office'
                      ? 'truck-delivery-outline'
                      : 'storefront-outline'
                  }
                  size={22}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>
                  Entrega
                </Text>

                <Text style={styles.rowValue}>
                  {deliveryLabel}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={onGoHome}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="home-outline"
              size={22}
              color={COLORS.white}
            />

            <Text style={styles.buttonText}>
              Volver al inicio
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  card: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 34,
    paddingBottom: 22,
    alignItems: 'center',
    elevation: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  successIconContainer: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,

    shadowColor: COLORS.success,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },

  message: {
    marginTop: 9,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  folioContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 22,
  },

  folioLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray,
    letterSpacing: 1,
  },

  folio: {
    marginTop: 5,
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
  },

  summary: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginTop: 18,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  rowTextContainer: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 3,
  },

  rowValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  button: {
    width: '100%',
    height: 56,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    marginTop: 22,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
});