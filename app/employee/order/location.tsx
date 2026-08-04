import React, { useMemo } from 'react';
import {
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

export default function LocationScreen() {
  const {
    zone,
    location,
    setLocation,
  } = useOrder();

  const zoneInformation = useMemo(() => {
    switch (zone) {
      case 'Fábrica':
        return {
          icon: 'factory' as IconName,
          description: 'Área de producción',
          example:
            'Ej. Calderas, Elaboración o Laboratorio de fábrica.',
        };

      case 'Administración':
        return {
          icon: 'office-building-outline' as IconName,
          description: 'Oficinas administrativas',
          example:
            'Ej. Recursos Humanos, Sistemas o Contabilidad.',
        };

      case 'Campo':
        return {
          icon: 'sprout-outline' as IconName,
          description: 'Área de campo',
          example: 'Ej. Laboratorio de campo.',
        };

      default:
        return {
          icon: 'map-marker-outline' as IconName,
          description: 'Zona de trabajo',
          example: 'Escribe el nombre del área o lugar exacto.',
        };
    }
  }, [zone]);

  const isLocationValid = location.trim().length > 0;

  const handleContinue = () => {
    const cleanLocation = location.trim();

    if (!cleanLocation) return;

    setLocation(cleanLocation);
    router.push('/employee/order/obsservation');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepHeader
          title="Ubicación de entrega"
          subtitle="Escribe el lugar exacto dentro de tu zona de trabajo donde deseas recibir tu pedido."
          step={5}
          totalSteps={8}
        />

        <View style={styles.informationCard}>
          <View style={styles.informationIcon}>
            <MaterialCommunityIcons
              name="map-marker-radius-outline"
              size={28}
              color="#2871B8"
            />
          </View>

          <View style={styles.informationContent}>
            <Text style={styles.informationTitle}>
              ¿Por qué es importante?
            </Text>

            <Text style={styles.informationText}>
              Con esta información podremos entregar tu pedido en el lugar
              correcto sin contratiempos.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          Zona seleccionada
        </Text>

        <View style={styles.zoneCard}>
          <View style={styles.zoneIconContainer}>
            <MaterialCommunityIcons
              name={zoneInformation.icon}
              size={32}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.zoneContent}>
            <Text style={styles.zoneName}>
              {zone || 'Sin zona seleccionada'}
            </Text>

            <Text style={styles.zoneDescription}>
              {zoneInformation.description}
            </Text>
          </View>

          <View style={styles.checkContainer}>
            <MaterialCommunityIcons
              name="check"
              size={22}
              color={COLORS.primary}
            />
          </View>
        </View>

        <Text style={styles.inputLabel}>
          Área o ubicación de entrega
        </Text>

        <View
          style={[
            styles.inputContainer,
            isLocationValid && styles.inputContainerActive,
          ]}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={27}
            color={
              isLocationValid
                ? COLORS.primary
                : '#7B8491'
            }
          />

          <View style={styles.inputDivider} />

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Escribe el nombre del área o lugar exacto"
            placeholderTextColor="#9A9FA8"
            style={styles.input}
            returnKeyType="done"
            maxLength={80}
          />
        </View>

        <Text style={styles.exampleText}>
          {zoneInformation.example}
        </Text>

        <View style={styles.adviceCard}>
          <View style={styles.adviceIconContainer}>
            <MaterialCommunityIcons
              name="information-outline"
              size={27}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>
              Consejo
            </Text>

            <Text style={styles.adviceText}>
              Sé lo más específico posible para que tu pedido llegue
              exactamente a donde lo necesitas.
            </Text>
          </View>

          <MaterialCommunityIcons
            name="map-marker-path"
            size={38}
            color="#5FA96D"
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continuar"
            disabled={!isLocationValid}
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },

  topCircle: {
    position: 'absolute',
    top: -75,
    right: -85,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E2F3E6',
  },

  bottomCircle: {
    position: 'absolute',
    bottom: -85,
    left: -95,
    width: 215,
    height: 215,
    borderRadius: 108,
    backgroundColor: '#FFF0DD',
  },

  informationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    borderRadius: 22,
    padding: 18,
    marginTop: 8,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#D3E7FA',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  informationIcon: {
    width: 62,
    height: 62,
    borderRadius: 19,
    backgroundColor: '#D9EAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  informationContent: {
    flex: 1,
  },

  informationTitle: {
    color: '#2366A6',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 5,
  },

  informationText: {
    color: '#557794',
    fontSize: 14,
    lineHeight: 21,
  },

  sectionLabel: {
    color: '#6F7782',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },

  zoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 21,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E2E6E9',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  zoneIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#E8F5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  zoneContent: {
    flex: 1,
  },

  zoneName: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },

  zoneDescription: {
    color: '#7B8491',
    fontSize: 14,
  },

  checkContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EAF7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputLabel: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 11,
  },

  inputContainer: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#C7CCD3',
    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  inputContainerActive: {
    borderColor: COLORS.primary,
  },

  inputDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E4E7EA',
    marginHorizontal: 13,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 15,
  },

  exampleText: {
    color: '#7B8491',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 24,
  },

  adviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF8F1',
    borderRadius: 21,
    padding: 17,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E0F0E3',
  },

  adviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E1F2E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  adviceContent: {
    flex: 1,
    paddingRight: 10,
  },

  adviceTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },

  adviceText: {
    color: '#597362',
    fontSize: 13,
    lineHeight: 19,
  },

  buttonContainer: {
    marginTop: 'auto',
  },
});