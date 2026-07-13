import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';
import { weeklyMenu } from '../../constants/mockData';

const days = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

export default function WeeklyMenu() {

  const [selectedDay, setSelectedDay] = useState('LUN');

  const menu = weeklyMenu[selectedDay as keyof typeof weeklyMenu];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Menú semanal
      </Text>

      <Text style={styles.subtitle}>
        Consulta el menú de cualquier día.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysContainer}
      >

        {days.map((day) => (

          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDay,
            ]}
            onPress={() => setSelectedDay(day)}
          >

            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.selectedText,
              ]}
            >
              {day}
            </Text>

          </TouchableOpacity>

        ))}

      </ScrollView>

      <View style={styles.card}>

        <Text style={styles.section}>
          🍳 Desayuno
        </Text>

        {menu.breakfast.length === 0 ? (
          <Text style={styles.empty}>
            Sin menú registrado.
          </Text>
        ) : (
          menu.breakfast.map((dish) => (
            <Text key={dish.id} style={styles.item}>
              • {dish.name}
            </Text>
          ))
        )}

        <Text style={styles.section}>
          🍽️ Comida
        </Text>

        {menu.lunch.length === 0 ? (
          <Text style={styles.empty}>
            Sin menú registrado.
          </Text>
        ) : (
          menu.lunch.map((dish) => (
            <Text key={dish.id} style={styles.item}>
              • {dish.name}
            </Text>
          ))
        )}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    color: COLORS.gray,
    marginTop: 6,
    marginBottom: 25,
    fontSize: 16,
  },

  daysContainer: {
    marginBottom: 25,
  },

  dayButton: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 10,
  },

  selectedDay: {
    backgroundColor: COLORS.primary,
  },

  dayText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },

  selectedText: {
    color: COLORS.white,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  section: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    marginTop: 10,
  },

  item: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },

  empty: {
    color: COLORS.gray,
    fontStyle: 'italic',
    marginBottom: 8,
  },

});