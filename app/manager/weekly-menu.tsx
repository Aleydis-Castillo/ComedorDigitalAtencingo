import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '../../constants/colors';
import {
  getMenu,
  publishMenu,
  saveMenu,
} from '../../services/menuApi';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
type ServiceType = 'breakfast' | 'lunch';
type ApiServiceType = 'BREAKFAST' | 'LUNCH';
type DayId =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

interface DayOption {
  id: DayId;
  shortName: string;
  fullName: string;
}

interface Dish {
  id: number;
  name: string;
  description: string;
}

interface DayMenu {
  breakfast: Dish[];
  lunch: Dish[];
}

type WeeklyMenu = Record<DayId, DayMenu>;

interface ApiDish {
  id: string;
  name: string;
  description: string | null;
  service: ApiServiceType;
  position: number;
}

interface ApiMenuDay {
  id: string;
  date: string;
  published: boolean;
  dishes: ApiDish[];
}

const DAYS: DayOption[] = [
  {
    id: 'monday',
    shortName: 'LUN',
    fullName: 'Lunes',
  },
  {
    id: 'tuesday',
    shortName: 'MAR',
    fullName: 'Martes',
  },
  {
    id: 'wednesday',
    shortName: 'MIÉ',
    fullName: 'Miércoles',
  },
  {
    id: 'thursday',
    shortName: 'JUE',
    fullName: 'Jueves',
  },
  {
    id: 'friday',
    shortName: 'VIE',
    fullName: 'Viernes',
  },
  {
    id: 'saturday',
    shortName: 'SÁB',
    fullName: 'Sábado',
  },
];

const createEmptyDishes = (): Dish[] => [
  {
    id: 1,
    name: '',
    description: '',
  },
  {
    id: 2,
    name: '',
    description: '',
  },
];

const createEmptyWeeklyMenu = (): WeeklyMenu => ({
  monday: {
    breakfast: createEmptyDishes(),
    lunch: createEmptyDishes(),
  },
  tuesday: {
    breakfast: createEmptyDishes(),
    lunch: createEmptyDishes(),
  },
  wednesday: {
    breakfast: createEmptyDishes(),
    lunch: createEmptyDishes(),
  },
  thursday: {
    breakfast: createEmptyDishes(),
    lunch: createEmptyDishes(),
  },
  friday: {
    breakfast: createEmptyDishes(),
    lunch: createEmptyDishes(),
  },
  saturday: {
    breakfast: createEmptyDishes(),
    lunch: createEmptyDishes(),
  },
});

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getNextMonday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDay = today.getDay();
  const daysUntilMonday = currentDay === 0
    ? 1
    : 8 - currentDay;

  const monday = new Date(today);
  monday.setDate(today.getDate() + daysUntilMonday);

  return monday;
}

function getWeekDates() {
  const monday = getNextMonday();

  return DAYS.reduce<Record<DayId, Date>>(
    (dates, day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      dates[day.id] = date;
      return dates;
    },
    {} as Record<DayId, Date>,
  );
}

function normalizeApiDishes(
  dishes: ApiDish[],
  service: ApiServiceType,
): Dish[] {
  const serviceDishes = dishes
    .filter((dish) => dish.service === service)
    .sort((a, b) => a.position - b.position);

  return [1, 2].map((position) => {
    const dish = serviceDishes.find(
      (item) => item.position === position,
    );

    return {
      id: position,
      name: dish?.name ?? '',
      description: dish?.description ?? '',
    };
  });
}

interface ServiceButtonProps {
  title: string;
  subtitle: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
}

function ServiceButton({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: ServiceButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.serviceButton,
        selected && styles.serviceButtonSelected,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.serviceIconContainer,
          selected && styles.serviceIconContainerSelected,
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={selected ? COLORS.white : COLORS.primary}
        />
      </View>

      <View style={styles.serviceTextContainer}>
        <Text
          style={[
            styles.serviceTitle,
            selected && styles.serviceTitleSelected,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.serviceSubtitle,
            selected && styles.serviceSubtitleSelected,
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <MaterialCommunityIcons
        name={
          selected
            ? 'check-circle'
            : 'circle-outline'
        }
        size={23}
        color={selected ? COLORS.white : '#9EA6A0'}
      />
    </TouchableOpacity>
  );
}

interface DishEditorProps {
  index: number;
  dish: Dish;
  onChangeName: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onClear: () => void;
}

function DishEditor({
  index,
  dish,
  onChangeName,
  onChangeDescription,
  onClear,
}: DishEditorProps) {
  return (
    <View style={styles.dishCard}>
      <View style={styles.dishCardHeader}>
        <View style={styles.dishNumberContainer}>
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={22}
            color={COLORS.primary}
          />

          <Text style={styles.dishNumberText}>
            Platillo {index + 1}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.clearButton}
          onPress={onClear}
        >
          <MaterialCommunityIcons
            name="eraser"
            size={20}
            color={COLORS.danger}
          />

          <Text style={styles.clearButtonText}>
            Limpiar
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.inputLabel}>
        Nombre del platillo
      </Text>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="food-outline"
          size={22}
          color={COLORS.primary}
        />

        <TextInput
          value={dish.name}
          onChangeText={onChangeName}
          placeholder="Ej. Chilaquiles verdes"
          placeholderTextColor="#9DA49F"
          maxLength={60}
          style={styles.input}
        />
      </View>

      <Text style={styles.inputLabel}>
        Descripción o acompañamiento
      </Text>

      <View style={styles.descriptionContainer}>
        <MaterialCommunityIcons
          name="text-box-outline"
          size={22}
          color={COLORS.primary}
          style={styles.descriptionIcon}
        />

        <TextInput
          value={dish.description}
          onChangeText={onChangeDescription}
          placeholder="Ej. Con pollo, crema, queso y frijoles."
          placeholderTextColor="#9DA49F"
          multiline
          maxLength={120}
          textAlignVertical="top"
          style={styles.descriptionInput}
        />

        <Text style={styles.characterCounter}>
          {dish.description.length}/120
        </Text>
      </View>
    </View>
  );
}

export default function WeeklyMenuManagerScreen() {
  const [selectedDay, setSelectedDay] =
    useState<DayId>('monday');

  const [selectedService, setSelectedService] =
    useState<ServiceType>('breakfast');

  const [weeklyMenu, setWeeklyMenu] =
    useState<WeeklyMenu>(createEmptyWeeklyMenu);

  const [hasChanges, setHasChanges] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isPublishing, setIsPublishing] =
    useState(false);

  const weekDates = useMemo(
    () => getWeekDates(),
    [],
  );

  const selectedDayInformation = useMemo(
    () => DAYS.find((day) => day.id === selectedDay),
    [selectedDay],
  );

  const currentDishes =
    weeklyMenu[selectedDay][selectedService];

  const loadMenu = async () => {
    try {
      setIsLoading(true);

      const apiMenu = await getMenu() as ApiMenuDay[];
      const nextMenu = createEmptyWeeklyMenu();

      DAYS.forEach((day) => {
        const dateKey = formatDateForApi(
          weekDates[day.id],
        );

        const apiDay = apiMenu.find(
          (item) => item.date.slice(0, 10) === dateKey,
        );

        if (!apiDay) {
          return;
        }

        nextMenu[day.id] = {
          breakfast: normalizeApiDishes(
            apiDay.dishes,
            'BREAKFAST',
          ),
          lunch: normalizeApiDishes(
            apiDay.dishes,
            'LUNCH',
          ),
        };
      });

      setWeeklyMenu(nextMenu);
      setHasChanges(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible obtener el menú.';

      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleSelectDay = (day: DayId) => {
    if (hasChanges) {
      Alert.alert(
        'Cambios sin guardar',
        'Guarda los cambios actuales antes de seleccionar otro día.',
      );
      return;
    }

    setSelectedDay(day);
  };

  const handleSelectService = (service: ServiceType) => {
    if (hasChanges) {
      Alert.alert(
        'Cambios sin guardar',
        'Guarda los cambios actuales antes de cambiar de servicio.',
      );
      return;
    }

    setSelectedService(service);
  };

  const updateDish = (
    dishIndex: number,
    field: 'name' | 'description',
    value: string,
  ) => {
    setWeeklyMenu((previousMenu) => {
      const updatedDishes = previousMenu[selectedDay][
        selectedService
      ].map((dish, index) => {
        if (index !== dishIndex) {
          return dish;
        }

        return {
          ...dish,
          [field]: value,
        };
      });

      return {
        ...previousMenu,
        [selectedDay]: {
          ...previousMenu[selectedDay],
          [selectedService]: updatedDishes,
        },
      };
    });

    setHasChanges(true);
  };

  const clearDish = (dishIndex: number) => {
    Alert.alert(
      'Limpiar platillo',
      'Se eliminará el nombre y la descripción de este platillo.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            updateDish(dishIndex, 'name', '');
            updateDish(dishIndex, 'description', '');
          },
        },
      ],
    );
  };

  const validateMenu = () => {
    const incompleteDish = currentDishes.some(
      (dish) =>
        dish.name.trim().length === 0 ||
        dish.description.trim().length === 0,
    );

    if (incompleteDish) {
      Alert.alert(
        'Información incompleta',
        'Los dos platillos deben tener nombre y descripción antes de guardar.',
      );

      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) {
      return;
    }

    if (!validateMenu()) {
      return;
    }

    try {
      setIsSaving(true);

      const date = formatDateForApi(
        weekDates[selectedDay],
      );

      const apiService: ApiServiceType =
        selectedService === 'breakfast'
          ? 'BREAKFAST'
          : 'LUNCH';

      await saveMenu(
        date,
        apiService,
        currentDishes.map((dish) => ({
          name: dish.name.trim(),
          description: dish.description.trim(),
        })),
      );

      setHasChanges(false);

      Alert.alert(
        'Cambios guardados',
        `El menú del ${selectedDayInformation?.fullName.toLowerCase()} fue actualizado correctamente.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible guardar el menú.';

      Alert.alert('Error al guardar', message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmPublishMenu = async () => {
    try {
      setIsPublishing(true);

      const startDate = formatDateForApi(
        weekDates.monday,
      );
      const endDate = formatDateForApi(
        weekDates.saturday,
      );

      const result = await publishMenu(
        startDate,
        endDate,
      );

      Alert.alert(
        'Menú publicado',
        result.updatedDays > 0
          ? `Se publicaron ${result.updatedDays} días del menú semanal.`
          : 'No hay días guardados para publicar. Guarda primero los platillos de la semana.',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible publicar el menú.';

      Alert.alert('Error al publicar', message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishMenu = () => {
    if (hasChanges) {
      Alert.alert(
        'Cambios sin guardar',
        'Primero guarda los cambios realizados antes de publicar el menú.',
      );

      return;
    }

    Alert.alert(
      'Publicar menú semanal',
      'El menú guardado estará disponible para todos los empleados. ¿Deseas continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Publicar',
          onPress: confirmPublishMenu,
        },
      ],
    );
  };

  const handleGoBack = () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    Alert.alert(
      'Cambios sin guardar',
      'Tienes cambios que todavía no se han guardado.',
      [
        {
          text: 'Continuar editando',
          style: 'cancel',
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <View
        pointerEvents="none"
        style={styles.background}
      >
        <View style={styles.topCircle} />
        <View style={styles.bottomCircle} />

        <MaterialCommunityIcons
          name="chef-hat"
          size={62}
          color="#D7E8D8"
          style={styles.backgroundIconOne}
        />

        <MaterialCommunityIcons
          name="food-apple-outline"
          size={52}
          color="#EEDCC6"
          style={styles.backgroundIconTwo}
        />

        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={58}
          color="#D7E8D8"
          style={styles.backgroundIconThree}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Menú semanal
            </Text>

            <Text style={styles.headerSubtitle}>
              Modifica los platillos disponibles
            </Text>
          </View>

          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons
              name="calendar-edit"
              size={27}
              color={COLORS.primary}
            />
          </View>
        </View>

        <View style={styles.informationCard}>
          <View style={styles.informationIcon}>
            <MaterialCommunityIcons
              name="information-outline"
              size={27}
              color="#2E73B7"
            />
          </View>

          <View style={styles.informationContent}>
            <Text style={styles.informationTitle}>
              {isLoading
                ? 'Cargando menú...'
                : 'Edita el menú'}
            </Text>

            <Text style={styles.informationText}>
              {isLoading
                ? 'Estamos consultando los platillos guardados en PostgreSQL.'
                : 'Selecciona un día y un servicio para modificar sus dos platillos.'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Selecciona el día
            </Text>

            <Text style={styles.sectionSubtitle}>
              Próxima semana, de lunes a sábado
            </Text>
          </View>

          {hasChanges && (
            <View style={styles.pendingBadge}>
              <View style={styles.pendingDot} />

              <Text style={styles.pendingBadgeText}>
                Sin guardar
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {DAYS.map((day) => {
            const isSelected = selectedDay === day.id;

            return (
              <TouchableOpacity
                key={day.id}
                activeOpacity={0.8}
                disabled={isLoading || isSaving}
                style={[
                  styles.dayButton,
                  isSelected && styles.dayButtonSelected,
                ]}
                onPress={() => handleSelectDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayShortName,
                    isSelected &&
                      styles.dayShortNameSelected,
                  ]}
                >
                  {day.shortName}
                </Text>

                <Text
                  style={[
                    styles.dayNumber,
                    isSelected &&
                      styles.dayNumberSelected,
                  ]}
                >
                  {weekDates[day.id].getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.selectedDayCard}>
          <View style={styles.selectedDayIcon}>
            <MaterialCommunityIcons
              name="calendar-today"
              size={25}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.selectedDayContent}>
            <Text style={styles.selectedDayLabel}>
              Día seleccionado
            </Text>

            <Text style={styles.selectedDayTitle}>
              {selectedDayInformation?.fullName} ·{' '}
              {weekDates[selectedDay].toLocaleDateString(
                'es-MX',
                {
                  day: '2-digit',
                  month: 'short',
                },
              )}
            </Text>
          </View>

          <MaterialCommunityIcons
            name="check-circle"
            size={27}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.serviceSectionTitle}>
          Tipo de servicio
        </Text>

        <ServiceButton
          title="Desayuno"
          subtitle="Primer servicio del día"
          icon="food-croissant"
          selected={selectedService === 'breakfast'}
          onPress={() => handleSelectService('breakfast')}
        />

        <ServiceButton
          title="Comida"
          subtitle="Segundo servicio del día"
          icon="food-variant"
          selected={selectedService === 'lunch'}
          onPress={() => handleSelectService('lunch')}
        />

        <View style={styles.dishesHeader}>
          <View>
            <Text style={styles.dishesTitle}>
              Platillos disponibles
            </Text>

            <Text style={styles.dishesSubtitle}>
              {selectedService === 'breakfast'
                ? 'Desayuno'
                : 'Comida'}{' '}
              del {selectedDayInformation?.fullName}
            </Text>
          </View>

          <View style={styles.dishCountBadge}>
            <Text style={styles.dishCountText}>
              2 platillos
            </Text>
          </View>
        </View>

        {currentDishes.map((dish, index) => (
          <DishEditor
            key={`${selectedDay}-${selectedService}-${dish.id}`}
            index={index}
            dish={dish}
            onChangeName={(value) =>
              updateDish(index, 'name', value)
            }
            onChangeDescription={(value) =>
              updateDish(
                index,
                'description',
                value,
              )
            }
            onClear={() => clearDish(index)}
          />
        ))}

        <View style={styles.adviceCard}>
          <View style={styles.adviceIcon}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={28}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>
              Recomendación
            </Text>

            <Text style={styles.adviceText}>
              Guarda cada combinación de día y servicio antes de cambiarla. Después publica la semana completa.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={
            !hasChanges ||
            isLoading ||
            isSaving
          }
          style={[
            styles.saveButton,
            (!hasChanges || isLoading || isSaving) &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
        >
          <MaterialCommunityIcons
            name={
              isSaving
                ? 'progress-clock'
                : 'content-save-outline'
            }
            size={24}
            color={COLORS.white}
          />

          <Text style={styles.saveButtonText}>
            {isSaving
              ? 'Guardando...'
              : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={
            isLoading ||
            isSaving ||
            isPublishing
          }
          style={[
            styles.publishButton,
            (isLoading ||
              isSaving ||
              isPublishing) &&
              styles.saveButtonDisabled,
          ]}
          onPress={handlePublishMenu}
        >
          <MaterialCommunityIcons
            name={
              isPublishing
                ? 'progress-clock'
                : 'send-check-outline'
            }
            size={24}
            color={COLORS.primary}
          />

          <Text style={styles.publishButtonText}>
            {isPublishing
              ? 'Publicando...'
              : 'Publicar menú semanal'}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 38,
  },

  topCircle: {
    position: 'absolute',
    top: -95,
    right: -75,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E2F2E5',
  },

  bottomCircle: {
    position: 'absolute',
    bottom: -110,
    left: -95,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#FFF0DD',
  },

  backgroundIconOne: {
    position: 'absolute',
    top: 280,
    right: -10,
    opacity: 0.48,
    transform: [{ rotate: '15deg' }],
  },

  backgroundIconTwo: {
    position: 'absolute',
    top: 720,
    left: -10,
    opacity: 0.45,
    transform: [{ rotate: '-18deg' }],
  },

  backgroundIconThree: {
    position: 'absolute',
    bottom: 170,
    right: -8,
    opacity: 0.45,
    transform: [{ rotate: '13deg' }],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 4,
  },

  headerSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
  },

  headerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#E4F3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  informationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF4FF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#D5E7F8',
  },

  informationIcon: {
    width: 51,
    height: 51,
    borderRadius: 17,
    backgroundColor: '#D7E9FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  informationContent: {
    flex: 1,
  },

  informationTitle: {
    color: '#2467A6',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },

  informationText: {
    color: '#557995',
    fontSize: 13,
    lineHeight: 19,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },

  sectionSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
  },

  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3DF',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
    marginRight: 6,
  },

  pendingBadgeText: {
    color: '#9B691A',
    fontSize: 11,
    fontWeight: '800',
  },

  daysContainer: {
    paddingBottom: 18,
    paddingRight: 5,
  },

  dayButton: {
    width: 62,
    height: 79,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    borderWidth: 1,
    borderColor: '#E1E8E2',
  },

  dayButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 4,
  },

  dayShortName: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 7,
  },

  dayShortNameSelected: {
    color: '#E8F5E9',
  },

  dayNumber: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
  },

  dayNumberSelected: {
    color: COLORS.white,
  },

  selectedDayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 21,
    padding: 15,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2EAE3',
  },

  selectedDayIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E6F3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  selectedDayContent: {
    flex: 1,
  },

  selectedDayLabel: {
    color: COLORS.gray,
    fontSize: 12,
    marginBottom: 3,
  },

  selectedDayTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },

  serviceSectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 13,
  },

  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 21,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E9E3',
  },

  serviceButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  serviceIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#E6F3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  serviceIconContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  serviceTextContainer: {
    flex: 1,
  },

  serviceTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },

  serviceTitleSelected: {
    color: COLORS.white,
  },

  serviceSubtitle: {
    color: COLORS.gray,
    fontSize: 12,
  },

  serviceSubtitleSelected: {
    color: '#DCEEDD',
  },

  dishesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 15,
  },

  dishesTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },

  dishesSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
  },

  dishCountBadge: {
    backgroundColor: '#E4F3E7',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  dishCountText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  dishCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E9E3',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  dishCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },

  dishNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dishNumberText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 8,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  clearButtonText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 5,
  },

  inputLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },

  inputContainer: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#DDE5DE',
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    marginLeft: 10,
  },

  descriptionContainer: {
    minHeight: 115,
    flexDirection: 'row',
    backgroundColor: '#F8FAF8',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#DDE5DE',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 29,
  },

  descriptionIcon: {
    marginTop: 1,
  },

  descriptionInput: {
    flex: 1,
    minHeight: 65,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 10,
    paddingTop: 0,
  },

  characterCounter: {
    position: 'absolute',
    right: 13,
    bottom: 9,
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: '600',
  },

  adviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF8EF',
    borderRadius: 22,
    padding: 16,
    marginTop: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCEEE0',
  },

  adviceIcon: {
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
  },

  adviceTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },

  adviceText: {
    color: '#587160',
    fontSize: 12,
    lineHeight: 18,
  },

  saveButton: {
    height: 58,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },

  saveButtonDisabled: {
    opacity: 0.72,
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 9,
  },

  publishButton: {
    height: 57,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  publishButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 9,
  },
});