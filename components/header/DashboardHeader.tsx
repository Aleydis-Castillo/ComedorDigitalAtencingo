import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UserData {
  name: string;
  role: string;
}

export default function DashboardHeader() {
  const user: UserData = {
    name: 'Paola Suárez',
    role: 'Empleado',
  };

  const currentDate = new Date();
  const hour = currentDate.getHours();

  let greeting = 'Buenos días';
  let greetingIcon:
    keyof typeof MaterialCommunityIcons.glyphMap =
    'weather-sunny';

  if (hour >= 12 && hour < 19) {
    greeting = 'Buenas tardes';
    greetingIcon = 'weather-partly-cloudy';
  }

  if (hour >= 19) {
    greeting = 'Buenas noches';
    greetingIcon = 'weather-night';
  }

  const formattedDate =
    currentDate.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const date =
    formattedDate.charAt(0).toUpperCase() +
    formattedDate.slice(1);

  const initials = user.name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <View style={styles.brandRow}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <MaterialCommunityIcons
              name="sprout-outline"
              size={27}
              color="#4E8F3A"
            />
          </View>

          <View>
            <Text style={styles.brandName}>
              ZUCARMEX
            </Text>

            <Text style={styles.brandSubtitle}>
              COMEDOR ZUCARMEX
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.notificationButton,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={25}
            color="#162033"
          />

          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.mainRow}>
          <View style={styles.userContent}>
            <View style={styles.greetingRow}>
              <MaterialCommunityIcons
                name={greetingIcon}
                size={23}
                color="#607088"
              />

              <Text style={styles.greeting}>
                {greeting}
              </Text>
            </View>

            <Text
              style={styles.name}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {user.name}
            </Text>

            <Text style={styles.message}>
              ¡Que tengas una excelente jornada!
            </Text>
          </View>

          <View style={styles.avatarBorder}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initials}
              </Text>
            </View>

            <View style={styles.avatarDecoration}>
              <MaterialCommunityIcons
                name="creation-outline"
                size={19}
                color="#F5A623"
              />
            </View>
          </View>
        </View>

        <View style={styles.informationRow}>
          <View style={styles.informationItem}>
            <View style={styles.informationIcon}>
              <MaterialCommunityIcons
                name="account-outline"
                size={19}
                color="#566235"
              />
            </View>

            <Text style={styles.informationText}>
              {user.role}
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.informationItem}>
            <View style={styles.informationIcon}>
              <MaterialCommunityIcons
                name="office-building-outline"
                size={19}
                color="#566235"
              />
            </View>

            <Text
              style={styles.informationText}
              numberOfLines={1}
            >
              Comedor Zucarmex
            </Text>
          </View>
        </View>

        <View style={styles.horizontalDivider} />

        <View style={styles.dateRow}>
          <View style={styles.informationIcon}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={19}
              color="#566235"
            />
          </View>

          <Text style={styles.date}>
            {date}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    marginTop: 46,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#EEF5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  brandName: {
    color: '#182334',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  brandSubtitle: {
    marginTop: 1,
    color: '#657083',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
  },

  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FF6638',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 27,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 19,
    borderWidth: 1,
    borderColor: '#F0F0ED',
    marginBottom: 25,
    elevation: 5,

    shadowColor: '#1D2735',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 11,
  },

  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  userContent: {
    flex: 1,
    paddingRight: 10,
  },

  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  greeting: {
    color: '#596477',
    fontSize: 16,
    fontWeight: '500',
  },

  name: {
    marginTop: 7,
    color: '#111B2B',
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '900',
  },

  message: {
    marginTop: 5,
    color: '#637083',
    fontSize: 13,
    lineHeight: 19,
  },

  avatarBorder: {
    width: 79,
    height: 79,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#FFE3D8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#FF7048',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },

  avatarDecoration: {
    position: 'absolute',
    top: -8,
    right: -8,
  },

  informationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  informationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  informationIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: '#F1F4E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  informationText: {
    color: '#202938',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },

  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E8E9E7',
    marginHorizontal: 12,
  },

  horizontalDivider: {
    height: 1,
    backgroundColor: '#EBECEA',
    marginTop: 17,
    marginBottom: 14,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  date: {
    color: '#626D7F',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },
});