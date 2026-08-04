import React, { useMemo, useState } from 'react';
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

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;
type ServiceType = 'breakfast' | 'lunch';
type DayId = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

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

const INITIAL_MENU: WeeklyMenu = {
  monday: {
    breakfast: [
      {
        id: 1,
        name: 'Chilaquiles verdes',
        description: 'Con pollo, crema, queso y frijoles.',
      },
      {
        id: 2,
        name: 'Huevos con jamón',
        description: 'Acompañados de frijoles y tortillas.',
      },
    ],
    lunch: [
      {
        id: 1,
        name: 'Pollo en mole',
        description: 'Con arroz, frijoles y tortillas.',
      },
      {
        id: 2,
        name: 'Carne en salsa verde',
        description: 'Con arroz, frijoles y tortillas.',
      },
    ],
  },

  tuesday: {
    breakfast: [
      {
        id: 1,
        name: 'Enfrijoladas',
        description: 'Con queso, crema y pollo.',
      },
      {
        id: 2,
        name: 'Huevos a la mexicana',
        description: 'Con frijoles y tortillas.',
      },
    ],
    lunch: [
      {
        id: 1,
        name: 'Milanesa de pollo',
        description: 'Con ensalada, arroz y tortillas.',
      },
      {
        id: 2,
        name: 'Cerdo en adobo',
        description: 'Con arroz, frijoles y tortillas.',
      },
    ],
  },

  wednesday: {
    breakfast: [
      {
        id: 1,
        name: 'Molletes',
        description: 'Con pico de gallo y salsa.',
      },
      {
        id: 2,
        name: 'Hot cakes',
        description: 'Con fruta y miel.',
      },
    ],
    lunch: [
      {
        id: 1,
        name: 'Pollo a la jardinera',
        description: 'Con verduras, arroz y tortillas.',
      },
      {
        id: 2,
        name: 'Albóndigas',
        description: 'En salsa de jitomate con arroz.',
      },
    ],
  },

  thursday: {
    breakfast: [
      {
        id: 1,
        name: 'Quesadillas',
        description: 'Con queso, guisado y salsa.',
      },
      {
        id: 2,
        name: 'Huevos divorciados',
        description: 'Con frijoles y tortillas.',
      },
    ],
    lunch: [
      {
        id: 1,
        name: 'Tinga de pollo',
        description: 'Con arroz, frijoles y tostadas.',
      },
      {
        id: 2,
        name: 'Bistec encebollado',
        description: 'Con nopales, frijoles y tortillas.',
      },
    ],
  },

  friday: {
    breakfast: [
      {
        id: 1,
        name: 'Tacos dorados',
        description: 'Con lechuga, crema, queso y salsa.',
      },
      {
        id: 2,
        name: 'Omelette de jamón',
        description: 'Con frijoles y tortillas.',
      },
    ],
    lunch: [
      {
        id: 1,
        name: 'Pescado empanizado',
        description: 'Con ensalada y arroz.',
      },
      {
        id: 2,
        name: 'Pollo en salsa roja',
        description: 'Con arroz, frijoles y tortillas.',
      },
    ],
  },

  saturday: {
    breakfast: [
      {
        id: 1,
        name: 'Chilaquiles rojos',
        description: 'Con pollo, crema, queso y frijoles.',
      },
      {
        id: 2,
        name: 'Huevos rancheros',
        description: 'Con frijoles y tortillas.',
      },
    ],
    lunch: [
      {
        id: 1,
        name: 'Pozole',
        description: 'Con lechuga, rábano, cebolla y tostadas.',
      },
      {
        id: 2,
        name: 'Pollo asado',
        description: 'Con ensalada, arroz y tortillas.',
      },
    ],
  },
};

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
    useState<WeeklyMenu>(INITIAL_MENU);

  const [hasChanges, setHasChanges] =
    useState(false);

  const selectedDayInformation = useMemo(
    () =>
      DAYS.find((day) => day.id === selectedDay),
    [selectedDay],
  );

  const currentDishes =
    weeklyMenu[selectedDay][selectedService];

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

  const handleSave = () => {
    if (!validateMenu()) {
      return;
    }

    setHasChanges(false);

    Alert.alert(
      'Cambios guardados',
      `El menú del ${selectedDayInformation?.fullName.toLowerCase()} fue actualizado correctamente.`,
    );

    /*
      Más adelante sustituiremos esta alerta por una petición
      al backend de PostgreSQL.

      Ejemplo:

      await updateMenu({
        day: selectedDay,
        service: selectedService,
        dishes: currentDishes,
      });
    */
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
      'El menú estará disponible para todos los empleados. ¿Deseas continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Publicar',
          onPress: () => {
            Alert.alert(
              'Menú publicado',
              'El menú semanal está disponible para los empleados.',
            );
          },
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
              Edita el menú
            </Text>

            <Text style={styles.informationText}>
              Selecciona un día y un servicio para modificar sus dos platillos.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Selecciona el día
            </Text>

            <Text style={styles.sectionSubtitle}>
              Semana de lunes a sábado
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
            const isSelected =
              selectedDay === day.id;

            return (
              <TouchableOpacity
                key={day.id}
                activeOpacity={0.8}
                style={[
                  styles.dayButton,
                  isSelected &&
                    styles.dayButtonSelected,
                ]}
                onPress={() => setSelectedDay(day.id)}
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
                  {DAYS.findIndex(
                    (item) => item.id === day.id,
                  ) + 1}
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
              {selectedDayInformation?.fullName}
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
          selected={
            selectedService === 'breakfast'
          }
          onPress={() =>
            setSelectedService('breakfast')
          }
        />

        <ServiceButton
          title="Comida"
          subtitle="Segundo servicio del día"
          icon="food-variant"
          selected={selectedService === 'lunch'}
          onPress={() =>
            setSelectedService('lunch')
          }
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
              Escribe nombres y descripciones claras para que los empleados puedan elegir fácilmente.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.saveButton,
            !hasChanges &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
        >
          <MaterialCommunityIcons
            name="content-save-outline"
            size={24}
            color={COLORS.white}
          />

          <Text style={styles.saveButtonText}>
            Guardar cambios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.publishButton}
          onPress={handlePublishMenu}
        >
          <MaterialCommunityIcons
            name="send-check-outline"
            size={24}
            color={COLORS.primary}
          />

          <Text style={styles.publishButtonText}>
            Publicar menú semanal
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