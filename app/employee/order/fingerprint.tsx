import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { router } from 'expo-router';

import ConfettiCannon from 'react-native-confetti-cannon';

import FoodPatternBackground from '../../../components/backgrounds/FoodPatternBackground';

import OrderSuccessModal from '../../../components/modals/OrderSuccessModal';

import StepHeader from '../../../components/order/StepHeader';

import Ticket from '../../../components/order/Ticket';

import { useOrder } from '../../../context/OrderContext';

const { width: SCREEN_WIDTH } =
  Dimensions.get('window');

export default function FingerprintScreen() {
  const {
    foodType,
    dish,
    deliveryType,
    zone,
    resetOrder,
  } = useOrder();

  const timeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const [showConfetti, setShowConfetti] =
    useState(false);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const [isConfirming, setIsConfirming] =
    useState(false);

  const [folio, setFolio] =
    useState('');

  const totalSteps =
    deliveryType === 'office'
      ? 7
      : 5;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function generateFolio() {
    const date = new Date();

    const year = date
      .getFullYear()
      .toString()
      .slice(-2);

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    return `ATN-${year}${month}${day}-${randomNumber}`;
  }

  function finishOrder() {
    if (isConfirming) {
      return;
    }

    setIsConfirming(true);
    setFolio(generateFolio());
    setShowConfetti(true);

    timeoutRef.current = setTimeout(() => {
      setShowSuccessModal(true);
      setIsConfirming(false);
    }, 750);
  }

  function goToDashboard() {
    setShowSuccessModal(false);
    setShowConfetti(false);

    resetOrder();

    router.replace(
      '/employee/dashboard'
    );
  }

  return (
    <FoodPatternBackground>
      <View style={styles.screen}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <StepHeader
            title="Confirmación del pedido"
            subtitle="Revisa la información y verifica tu huella para finalizar."
            step={totalSteps}
            totalSteps={totalSteps}
          />

          <Ticket
            onConfirm={finishOrder}
          />
        </ScrollView>

        {showConfetti && (
          <View
            pointerEvents="none"
            style={styles.confettiLayer}
          >
            <ConfettiCannon
              count={200}
              origin={{
                x: SCREEN_WIDTH / 2,
                y: -20,
              }}
              explosionSpeed={330}
              fallSpeed={2600}
              fadeOut
              onAnimationEnd={() => {
                setShowConfetti(false);
              }}
            />
          </View>
        )}

        <OrderSuccessModal
          visible={showSuccessModal}
          folio={folio}
          foodType={foodType}
          dish={dish}
          deliveryType={deliveryType}
          officeArea={zone}
          onGoHome={goToDashboard}
        />
      </View>
    </FoodPatternBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 50,
  },

  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    elevation: 200,
  },
});