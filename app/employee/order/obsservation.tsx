import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import StepHeader from '../../../components/order/StepHeader';

import { COLORS } from '../../../constants/colors';
import { useOrder } from '../../../context/OrderContext';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const MAX_CHARACTERS = 150;

interface BackgroundFoodIconProps {
  name: IconName;
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  rotate?: string;
}

function BackgroundFoodIcon({
  name,
  size,
  top,
  bottom,
  left,
  right,
  rotate = '0deg',
}: BackgroundFoodIconProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.backgroundFoodIcon,
        {
          top,
          bottom,
          left,
          right,
          transform: [{ rotate }],
        },
      ]}
    >
      <MaterialCommunityIcons
        name={name}
        size={size}
        color="#CFE2CD"
      />
    </View>
  );
}

export default function ObservationScreen() {
const {
  dishId,
  observations,
  setObservations,
} = useOrder();

const handleReviewOrder = () => {
  if (!dishId) {
    Alert.alert(
      'Pedido incompleto',
      'Primero selecciona un platillo antes de continuar.',
      [
        {
          text: 'Regresar',
          onPress: () => router.back(),
        },
      ],
    );

    return;
  }

  setObservations(observations.trim());

  router.push('/employee/order/summary');
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        pointerEvents="none"
        style={styles.background}
      >
        <View style={styles.topCircle} />
        <View style={styles.bottomCircle} />

        <BackgroundFoodIcon
          name="mushroom-outline"
          size={48}
          top={135}
          left={-12}
          rotate="-18deg"
        />

        <BackgroundFoodIcon
          name="food-apple-outline"
          size={45}
          top={175}
          right={10}
          rotate="18deg"
        />

        <BackgroundFoodIcon
          name="silverware-fork-knife"
          size={48}
          top={290}
          left={-13}
          rotate="-12deg"
        />

        <BackgroundFoodIcon
          name="bell"
          size={47}
          top={360}
          right={-8}
          rotate="15deg"
        />

        <BackgroundFoodIcon
          name="leaf"
          size={42}
          top={470}
          left={4}
          rotate="-22deg"
        />

        <BackgroundFoodIcon
          name="chef-hat"
          size={47}
          top={525}
          right={6}
          rotate="12deg"
        />

        <BackgroundFoodIcon
          name="carrot"
          size={49}
          top={640}
          left={-12}
          rotate="-28deg"
        />

        <BackgroundFoodIcon
          name="food-drumstick-outline"
          size={49}
          top={720}
          right={-10}
          rotate="20deg"
        />

        <BackgroundFoodIcon
          name="corn"
          size={45}
          top={830}
          left={7}
          rotate="-15deg"
        />

        <BackgroundFoodIcon
          name="food-croissant"
          size={45}
          top={900}
          right={5}
          rotate="15deg"
        />

        <BackgroundFoodIcon
          name="leaf"
          size={40}
          bottom={115}
          left={15}
          rotate="-20deg"
        />

        <BackgroundFoodIcon
          name="mushroom-outline"
          size={45}
          bottom={35}
          right={6}
          rotate="18deg"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepHeader
          title="Observaciones"
          subtitle=""
          step={6}
          totalSteps={8}
        />

        <View style={styles.informationCard}>
          <View style={styles.informationIconContainer}>
            <MaterialCommunityIcons
              name="information-outline"
              size={30}
              color="#2E73B7"
            />
          </View>

          <View style={styles.informationContent}>
            <Text style={styles.informationTitle}>
              ¿Para qué sirve?
            </Text>

            <Text style={styles.informationText}>
              Con tus observaciones podemos preparar tu pedido como lo
              necesitas.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <MaterialCommunityIcons
              name="chef-hat"
              size={26}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.sectionTitle}>
            Indicaciones para cocina
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={27}
            color={COLORS.primary}
            style={styles.pencilIcon}
          />

          <TextInput
            value={observations}
            onChangeText={setObservations}
            placeholder="Ej. Sin cebolla y con un huevo extra."
            placeholderTextColor="#959AA3"
            multiline
            maxLength={MAX_CHARACTERS}
            textAlignVertical="top"
            style={styles.input}
          />

          <Text style={styles.characterCounter}>
            {observations.length}/{MAX_CHARACTERS}
          </Text>
        </View>

        <View style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={29}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>
              Consejo
            </Text>

            <Text style={styles.adviceText}>
              Entre más específica sea tu indicación, mejor podremos preparar
              tu pedido.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="clipboard-check-outline"
            size={40}
            color="#55A665"
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Revisar pedido"
            onPress={handleReviewOrder}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,

    // Esto sube todos los elementos.
    paddingTop: 25,

    paddingBottom: 24,
  },

  topCircle: {
    position: 'absolute',
    top: -95,
    right: -80,
    width: 205,
    height: 205,
    borderRadius: 103,
    backgroundColor: '#E1F2E5',
  },

  bottomCircle: {
    position: 'absolute',
    bottom: -105,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFF0DD',
  },

  backgroundFoodIcon: {
    position: 'absolute',
    opacity: 0.52,
  },

  informationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    borderRadius: 22,
    padding: 17,

    // Reduce el espacio después del encabezado.
    marginTop: -3,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: '#D1E4F6',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  informationIconContainer: {
    width: 59,
    height: 59,
    borderRadius: 19,
    backgroundColor: '#D7E9FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  informationContent: {
    flex: 1,
  },

  informationTitle: {
    color: '#2467A6',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 5,
  },

  informationText: {
    color: '#557995',
    fontSize: 14,
    lineHeight: 21,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  sectionIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#E4F3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  sectionTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
  },

  inputContainer: {
    minHeight: 205,
    backgroundColor: COLORS.white,
    borderRadius: 23,
    borderWidth: 1.6,
    borderColor: COLORS.primary,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 41,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  pencilIcon: {
    position: 'absolute',
    top: 21,
    left: 18,
  },

  input: {
    flex: 1,
    minHeight: 145,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 23,
    paddingTop: 0,
    paddingLeft: 40,
    paddingRight: 0,
  },

  characterCounter: {
    position: 'absolute',
    right: 17,
    bottom: 13,
    color: '#737B86',
    fontSize: 14,
    fontWeight: '600',
  },

  adviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF8F0',
    borderRadius: 22,
    padding: 16,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: '#DCEDE0',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  adviceIconContainer: {
    width: 51,
    height: 51,
    borderRadius: 17,
    backgroundColor: '#DCEFE0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  adviceContent: {
    flex: 1,
    paddingRight: 9,
  },

  adviceTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },

  adviceText: {
    color: '#587160',
    fontSize: 13,
    lineHeight: 19,
  },

  buttonContainer: {
    marginTop: 0,
  },
});