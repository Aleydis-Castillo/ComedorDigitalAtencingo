import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

const days = [
  { day: 'LUN', date: '07' },
  { day: 'MAR', date: '08' },
  { day: 'MIE', date: '09' },
  { day: 'JUE', date: '10' },
  { day: 'VIE', date: '11' },
  { day: 'SAB', date: '12' },
];

export default function WeekCalendar() {

  const [selectedDay, setSelectedDay] =
    useState('MAR');

  return (

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >

      {days.map((item) => {

        const selected =
          selectedDay === item.day;

        return (

          <TouchableOpacity
            key={item.day}
            onPress={() =>
              setSelectedDay(item.day)
            }
            style={[
              styles.card,
              selected && styles.selectedCard,
            ]}
          >

            <Text
              style={[
                styles.day,
                selected && styles.selectedText,
              ]}
            >
              {item.day}
            </Text>

            <Text
              style={[
                styles.date,
                selected && styles.selectedText,
              ]}
            >
              {item.date}
            </Text>

            <View
              style={[
                styles.status,
                {
                  backgroundColor: selected
                    ? COLORS.white
                    : COLORS.success,
                },
              ]}
            />

          </TouchableOpacity>

        );

      })}

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container:{
    paddingVertical:10
  },

  card:{
    width:72,
    height:95,

    borderRadius:20,

    backgroundColor:COLORS.white,

    marginRight:12,

    justifyContent:"center",
    alignItems:"center",

    elevation:3,

    shadowColor:"#000",
    shadowOpacity:.08,
    shadowRadius:6
  },

  selectedCard:{
    backgroundColor:COLORS.primary
  },

  day:{
    fontSize:16,
    fontWeight:"700",
    color:COLORS.text
  },

  date:{
    fontSize:24,
    fontWeight:"bold",
    color:COLORS.primary,
    marginTop:4
  },

  selectedText:{
    color:COLORS.white
  },

  status:{
    width:10,
    height:10,
    borderRadius:5,
    marginTop:8
  }

});