import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

import DateTimeField from './DateTimeField';
import FormInput from './FormInput';

import ServiceSelector, {
    ServiceType,
} from './ServiceSelector';

interface EventFormProps {
  title: string;
  eventDate: Date;
  eventTime: Date;
  people: string;
  location: string;
  observations: string;
  service: ServiceType;

  setTitle: (value: string) => void;
  setEventDate: (value: Date) => void;
  setEventTime: (value: Date) => void;
  setPeople: (value: string) => void;
  setLocation: (value: string) => void;
  setObservations: (value: string) => void;
  setService: (value: ServiceType) => void;

  disabled?: boolean;
}

export default function EventForm({
  title,
  eventDate,
  eventTime,
  people,
  location,
  observations,
  service,
  setTitle,
  setEventDate,
  setEventTime,
  setPeople,
  setLocation,
  setObservations,
  setService,
  disabled = false,
}: EventFormProps) {
  const handlePeopleChange = (text: string) => {
    const onlyNumbers = text.replace(/[^0-9]/g, '');

    setPeople(onlyNumbers);
  };

  return (
    <View style={styles.formCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={23}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.sectionHeaderText}>
          <Text style={styles.sectionTitle}>
            Datos del evento
          </Text>

          <Text style={styles.sectionDescription}>
            Ingresa la información necesaria para organizar el
            servicio.
          </Text>
        </View>
      </View>

      <FormInput
        label="Nombre del evento"
        icon="party-popper"
        placeholder="Ej. Día del Trabajador"
        value={title}
        onChangeText={setTitle}
        maxLength={80}
        autoCapitalize="sentences"
        editable={!disabled}
      />

      <View style={styles.dateTimeRow}>
        <View style={styles.dateTimeColumn}>
          <DateTimeField
            label="Fecha"
            mode="date"
            value={eventDate}
            onChange={setEventDate}
            disabled={disabled}
          />
        </View>

        <View style={styles.dateTimeSpacing} />

        <View style={styles.dateTimeColumn}>
          <DateTimeField
            label="Hora"
            mode="time"
            value={eventTime}
            onChange={setEventTime}
            disabled={disabled}
          />
        </View>
      </View>

      <View style={styles.serviceSection}>
        <View style={styles.serviceTitleRow}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={21}
            color={COLORS.primary}
          />

          <Text style={styles.serviceTitle}>
            Tipo de servicio
          </Text>
        </View>

        <Text style={styles.serviceDescription}>
          Selecciona el servicio que se proporcionará.
        </Text>

        <ServiceSelector
          value={service}
          onChange={setService}
          disabled={disabled}
        />
      </View>

      <FormInput
        label="Número de personas"
        icon="account-group-outline"
        placeholder="Ej. 180"
        value={people}
        onChangeText={handlePeopleChange}
        keyboardType="numeric"
        maxLength={5}
        editable={!disabled}
      />

      <FormInput
        label="Lugar del evento"
        icon="map-marker-outline"
        placeholder="Ej. Comedor principal"
        value={location}
        onChangeText={setLocation}
        maxLength={100}
        autoCapitalize="sentences"
        editable={!disabled}
      />

      <FormInput
        label="Observaciones"
        icon="text-box-outline"
        placeholder="Agrega indicaciones especiales, alimentos requeridos o información adicional..."
        value={observations}
        onChangeText={setObservations}
        multiline
        numberOfLines={5}
        maxLength={350}
        autoCapitalize="sentences"
        editable={!disabled}
      />

      <Text style={styles.characterCounter}>
        {observations.length}/350 caracteres
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E1E8E2',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF6EC',
  },

  sectionHeaderText: {
    flex: 1,
    marginLeft: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },

  sectionDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.gray,
  },

  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  dateTimeColumn: {
    flex: 1,
  },

  dateTimeSpacing: {
    width: 12,
  },

  serviceSection: {
    marginBottom: 18,
  },

  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  serviceTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  serviceDescription: {
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.gray,
  },

  characterCounter: {
    marginTop: -10,
    fontSize: 12,
    textAlign: 'right',
    color: COLORS.gray,
  },
});