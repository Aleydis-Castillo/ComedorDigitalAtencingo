import React, { useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import DashboardBackground from '../../components/backgrounds/DashboardBackground';

import { weeklyMenu } from '../../constants/mockData';

const days = [
  { key: 'LUN', label: 'Lun' },
  { key: 'MAR', label: 'Mar' },
  { key: 'MIE', label: 'Mié' },
  { key: 'JUE', label: 'Jue' },
  { key: 'VIE', label: 'Vie' },
  { key: 'SAB', label: 'Sáb' },
] as const;

type DayKey = typeof days[number]['key'];

interface Dish {
  id: number;
  name: string;
}

interface MenuSectionProps {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  iconBackground: string;
  dishes: Dish[];
}

function MenuSection({
  title,
  icon,
  iconColor,
  iconBackground,
  dishes,
}: MenuSectionProps) {
  const available = dishes.length > 0;

  return (
    <View style={styles.menuCard}>
      <View style={styles.menuCardHeader}>
        <View style={styles.menuTitleContainer}>
          <View
            style={[
              styles.menuIcon,
              {
                backgroundColor: iconBackground,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={icon}
              size={27}
              color={iconColor}
            />
          </View>

          <View>
            <Text style={styles.menuTitle}>
              {title}
            </Text>

            <Text style={styles.menuCount}>
              {available
                ? `${dishes.length} ${
                    dishes.length === 1
                      ? 'platillo'
                      : 'platillos'
                  }`
                : 'Sin platillos'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.availabilityBadge,
            available
              ? styles.availableBadge
              : styles.unavailableBadge,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: available
                  ? '#4A9A35'
                  : '#C2413A',
              },
            ]}
          />

          <Text
            style={[
              styles.availabilityText,
              {
                color: available
                  ? '#438B32'
                  : '#C2413A',
              },
            ]}
          >
            {available
              ? 'Disponible'
              : 'No disponible'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {available ? (
        dishes.map((dish, index) => (
          <View
            key={dish.id}
            style={[
              styles.dishRow,
              index !== dishes.length - 1 &&
                styles.dishRowBorder,
            ]}
          >
            <View
              style={[
                styles.dishNumber,
                {
                  backgroundColor: iconBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.dishNumberText,
                  {
                    color: iconColor,
                  },
                ]}
              >
                {index + 1}
              </Text>
            </View>

            <Text style={styles.dishName}>
              {dish.name}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="food-off-outline"
            size={36}
            color="#A2A8B2"
          />

          <Text style={styles.emptyTitle}>
            Sin menú registrado
          </Text>

          <Text style={styles.emptyText}>
            No hay platillos disponibles para este día.
          </Text>
        </View>
      )}
    </View>
  );
}

export default function WeeklyMenu() {
  const [selectedDay, setSelectedDay] =
    useState<DayKey>('LUN');

  const menu =
    weeklyMenu[
      selectedDay as keyof typeof weeklyMenu
    ];

  const selectedDayLabel =
    days.find(
      (day) => day.key === selectedDay
    )?.label ?? '';

  return (
    <DashboardBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={29}
              color="#4C8B32"
            />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Menú semanal
            </Text>

            <Text style={styles.subtitle}>
              Consulta los platillos disponibles de cada día.
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContent}
          style={styles.daysContainer}
        >
          {days.map((day) => {
            const selected =
              selectedDay === day.key;

            return (
              <Pressable
                key={day.key}
                onPress={() =>
                  setSelectedDay(day.key)
                }
                style={({ pressed }) => [
                  styles.dayButton,
                  selected &&
                    styles.selectedDayButton,
                  pressed &&
                    styles.dayButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    selected &&
                      styles.selectedDayText,
                  ]}
                >
                  {day.label}
                </Text>

                {selected && (
                  <View
                    style={styles.selectedIndicator}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.selectedDayHeader}>
          <View>
            <Text style={styles.selectedDayLabel}>
              MENÚ DEL DÍA
            </Text>

            <Text style={styles.selectedDayTitle}>
              {selectedDayLabel}
            </Text>
          </View>

          <MaterialCommunityIcons
            name="chef-hat"
            size={31}
            color="#F97316"
          />
        </View>

        <MenuSection
          title="Desayuno"
          icon="coffee-outline"
          iconColor="#D9632C"
          iconBackground="#FFF0E9"
          dishes={menu.breakfast}
        />

        <MenuSection
          title="Comida"
          icon="silverware-fork-knife"
          iconColor="#3679AD"
          iconBackground="#EAF3FA"
          dishes={menu.lunch}
        />
      </ScrollView>
    </DashboardBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 42,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  headerIcon: {
    width: 59,
    height: 59,
    borderRadius: 19,
    backgroundColor: '#EEF6E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 29,
    fontWeight: '900',
    color: '#121B2B',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#687284',
  },

  daysContainer: {
    marginHorizontal: -18,
    marginBottom: 24,
  },

  daysContent: {
    paddingHorizontal: 18,
    gap: 10,
  },

  dayButton: {
    minWidth: 67,
    height: 52,
    paddingHorizontal: 17,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEB',
    elevation: 2,

    shadowColor: '#1B2636',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  selectedDayButton: {
    backgroundColor: '#182334',
    borderColor: '#182334',
  },

  dayButtonPressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  dayText: {
    color: '#5E6878',
    fontSize: 15,
    fontWeight: '800',
  },

  selectedDayText: {
    color: '#FFFFFF',
  },

  selectedIndicator: {
    position: 'absolute',
    bottom: 7,
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F97316',
  },

  selectedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 3,
  },

  selectedDayLabel: {
    color: '#9A7170',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  selectedDayTitle: {
    marginTop: 2,
    color: '#182334',
    fontSize: 22,
    fontWeight: '900',
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: '#F0F0ED',
    elevation: 4,

    shadowColor: '#1B2636',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 9,
  },

  menuCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  menuTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  menuIcon: {
    width: 51,
    height: 51,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  menuTitle: {
    color: '#182334',
    fontSize: 19,
    fontWeight: '900',
  },

  menuCount: {
    marginTop: 3,
    color: '#8B929D',
    fontSize: 12,
    fontWeight: '500',
  },

  availabilityBadge: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  availableBadge: {
    backgroundColor: '#EEF6E9',
  },

  unavailableBadge: {
    backgroundColor: '#FDECEA',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  availabilityText: {
    fontSize: 11,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#ECEDEB',
    marginVertical: 16,
  },

  dishRow: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dishRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1EF',
  },

  dishNumber: {
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  dishNumberText: {
    fontSize: 13,
    fontWeight: '900',
  },

  dishName: {
    flex: 1,
    color: '#202938',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },

  emptyState: {
    paddingVertical: 18,
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 10,
    color: '#303A48',
    fontSize: 15,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 4,
    color: '#8A929E',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});