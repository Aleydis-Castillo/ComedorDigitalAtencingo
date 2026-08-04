import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import OfficeCard from '../../../components/order/OfficeCard';
import StepHeader from '../../../components/order/StepHeader';

import { COLORS } from '../../../constants/colors';
import { officeAreas } from '../../../constants/officeAreas';

import { useOrder } from '../../../context/OrderContext';

export default function OfficeScreen() {
  const {
    zone,
    setZone,
  } = useOrder();

  const selectedArea = officeAreas.find(
    (area) => area.name === zone,
  );

  const handleContinue = () => {
    if (!zone) return;

    router.push('/employee/order/location');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StepHeader
          title="Zona de entrega"
          subtitle="Selecciona el área donde deseas recibir tu pedido."
          step={4}
          totalSteps={8}
        />

        <View style={styles.informationCard}>
          <View style={styles.informationIcon}>
            <MaterialCommunityIcons
              name="map-marker-radius-outline"
              size={25}
              color="#3274B9"
            />
          </View>

          <View style={styles.informationContent}>
            <Text style={styles.informationTitle}>
              ¿Dónde entregaremos tu pedido?
            </Text>

            <Text style={styles.informationText}>
              Selecciona tu área de trabajo para facilitar la entrega.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Selecciona tu zona
            </Text>

            <Text style={styles.sectionSubtitle}>
              {officeAreas.length} zonas disponibles
            </Text>
          </View>

          <View style={styles.locationIcon}>
            <MaterialCommunityIcons
              name="office-building-marker-outline"
              size={22}
              color={COLORS.primary}
            />
          </View>
        </View>

        <View style={styles.grid}>
          {officeAreas.map((area) => (
            <OfficeCard
              key={area.id}
              icon={area.icon}
              name={area.name}
              description={area.description}
              selected={zone === area.name}
              onPress={() => setZone(area.name)}
            />
          ))}
        </View>

        {selectedArea && (
          <View style={styles.selectionCard}>
            <View style={styles.selectionIcon}>
              <MaterialCommunityIcons
                name="check-circle"
                size={25}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.selectionContent}>
              <Text style={styles.selectionLabel}>
                Zona seleccionada
              </Text>

              <Text style={styles.selectionValue}>
                {selectedArea.name}
              </Text>
            </View>

            <MaterialCommunityIcons
              name={
                selectedArea.icon as keyof typeof MaterialCommunityIcons.glyphMap
              }
              size={26}
              color={COLORS.primary}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continuar"
            disabled={!zone}
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
    top: -70,
    right: -80,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#E2F3E6',
  },

  bottomCircle: {
    position: 'absolute',
    bottom: -90,
    left: -90,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#FFF0DD',
  },

  informationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#D8EAFB',
  },

  informationIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#D8EAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  informationContent: {
    flex: 1,
  },

  informationTitle: {
    color: '#245D93',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  informationText: {
    color: '#52789D',
    fontSize: 13,
    lineHeight: 19,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },

  sectionSubtitle: {
    color: '#7B8491',
    fontSize: 13,
  },

  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E9F6EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DDEADF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  selectionIcon: {
    marginRight: 12,
  },

  selectionContent: {
    flex: 1,
  },

  selectionLabel: {
    color: '#7B8491',
    fontSize: 12,
    marginBottom: 3,
  },

  selectionValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },

  buttonContainer: {
    marginTop: 'auto',
  },
});