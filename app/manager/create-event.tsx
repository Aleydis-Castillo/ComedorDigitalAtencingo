import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import EventForm from '../../components/manager/EventForm';
import { ServiceType } from '../../components/manager/ServiceSelector';

import { COLORS } from '../../constants/colors';

export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [service, setService] =
    useState<ServiceType>('Comida');
  const [people, setPeople] = useState('');
  const [location, setLocation] = useState('');
  const [observations, setObservations] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setTitle('');
    setEventDate(new Date());
    setEventTime(new Date());
    setService('Comida');
    setPeople('');
    setLocation('');
    setObservations('');
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert(
        'Nombre requerido',
        'Escribe el nombre del evento.',
      );

      return false;
    }

    if (!people.trim()) {
      Alert.alert(
        'Cantidad requerida',
        'Escribe el número de personas que asistirán.',
      );

      return false;
    }

    const peopleNumber = Number(people);

    if (
      Number.isNaN(peopleNumber) ||
      peopleNumber <= 0 ||
      !Number.isInteger(peopleNumber)
    ) {
      Alert.alert(
        'Cantidad no válida',
        'El número de personas debe ser un número entero mayor que cero.',
      );

      return false;
    }

    if (!location.trim()) {
      Alert.alert(
        'Lugar requerido',
        'Escribe el lugar donde se realizará el evento.',
      );

      return false;
    }

    return true;
  };

  const formatDateForStorage = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      '0',
    );
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatTimeForStorage = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(
      2,
      '0',
    );

    return `${hours}:${minutes}`;
  };

  const saveEvent = () => {
    setIsSaving(true);

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      date: formatDateForStorage(eventDate),
      time: formatTimeForStorage(eventTime),
      service,
      people: Number(people),
      location: location.trim(),
      observations: observations.trim(),
      status: 'Programado' as const,
    };

    /*
      Más adelante sustituiremos este bloque
      por una petición al backend conectado
      con PostgreSQL.

      Ejemplo:

      await eventService.create(newEvent);
    */

    console.log('Nuevo evento:', newEvent);

    setTimeout(() => {
      setIsSaving(false);

      Alert.alert(
        'Evento registrado',
        'El evento se guardó correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              resetForm();
              router.replace('/manager/events');
            },
          },
        ],
      );
    }, 600);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    Alert.alert(
      'Confirmar evento',
      `¿Deseas registrar el evento "${title.trim()}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Guardar',
          onPress: saveEvent,
        },
      ],
    );
  };

  const handleGoBack = () => {
    const hasInformation =
      Boolean(title.trim()) ||
      Boolean(people.trim()) ||
      Boolean(location.trim()) ||
      Boolean(observations.trim());

    if (!hasInformation) {
      router.back();
      return;
    }

    Alert.alert(
      'Descartar cambios',
      'Los datos escritos no se guardarán.',
      [
        {
          text: 'Continuar editando',
          style: 'cancel',
        },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.75}
            onPress={handleGoBack}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Crear evento
            </Text>

            <Text style={styles.headerSubtitle}>
              Registra un nuevo servicio especial
            </Text>
          </View>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.introductionCard}>
            <View style={styles.introductionIcon}>
              <MaterialCommunityIcons
                name="calendar-star"
                size={30}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.introductionText}>
              <Text style={styles.introductionTitle}>
                Información del evento
              </Text>

              <Text style={styles.introductionDescription}>
                Completa los datos para organizar el servicio
                especial del comedor.
              </Text>
            </View>
          </View>

          <EventForm
            title={title}
            eventDate={eventDate}
            eventTime={eventTime}
            people={people}
            location={location}
            observations={observations}
            service={service}
            setTitle={setTitle}
            setEventDate={setEventDate}
            setEventTime={setEventTime}
            setPeople={setPeople}
            setLocation={setLocation}
            setObservations={setObservations}
            setService={setService}
          />

          <View style={styles.informationCard}>
            <MaterialCommunityIcons
              name="information-outline"
              size={23}
              color="#1976D2"
            />

            <Text style={styles.informationText}>
              El evento se registrará inicialmente con estado
              Programado.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaving && styles.disabledButton,
            ]}
            activeOpacity={0.8}
            disabled={isSaving}
            onPress={handleSave}
          >
            <MaterialCommunityIcons
              name={
                isSaving
                  ? 'progress-clock'
                  : 'content-save-outline'
              }
              size={23}
              color={COLORS.white}
            />

            <Text style={styles.saveButtonText}>
              {isSaving
                ? 'Guardando evento...'
                : 'Guardar evento'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.75}
            disabled={isSaving}
            onPress={handleGoBack}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E4EAE5',
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F6F2',
  },

  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.text,
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },

  headerPlaceholder: {
    width: 46,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  introductionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6EC',
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D3EAD7',
  },

  introductionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  introductionText: {
    flex: 1,
    marginLeft: 14,
  },

  introductionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },

  introductionDescription: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.gray,
  },

  informationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF3FC',
    borderRadius: 18,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D5E7F8',
  },

  informationText: {
    flex: 1,
    marginLeft: 11,
    fontSize: 13,
    lineHeight: 19,
    color: '#31556F',
  },

  saveButton: {
    height: 60,
    marginTop: 24,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  disabledButton: {
    opacity: 0.65,
  },

  saveButtonText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
  },

  cancelButton: {
    height: 52,
    marginTop: 12,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray,
  },
});