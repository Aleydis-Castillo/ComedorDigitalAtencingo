import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  title: string;
  dishes: string[];
  available: boolean;
}

export default function TodayMenuCard({
  title,
  dishes,
  available,
}: Props) {

  return (

    <View style={styles.card}>

      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.line} />

      {dishes.map((dish, index) => (
        <Text
          key={index}
          style={styles.dish}
        >
          • {dish}
        </Text>
      ))}

      <View style={styles.footer}>

        <View
          style={[
            styles.dot,
            {
              backgroundColor: available
                ? COLORS.success
                : COLORS.danger,
            },
          ]}
        />

        <Text style={styles.status}>
          {available
            ? 'Disponible'
            : 'No disponible'}
        </Text>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  card:{
    backgroundColor:COLORS.white,

    borderRadius:20,

    padding:20,

    marginBottom:18,

    elevation:3,

    shadowColor:"#000",
    shadowOpacity:.08,
    shadowRadius:6
  },

  title:{
    fontSize:20,
    fontWeight:"700",
    color:COLORS.primary
  },

  line:{
    height:1,
    backgroundColor:"#ECECEC",
    marginVertical:15
  },

  dish:{
    fontSize:17,
    color:COLORS.text,
    marginBottom:10
  },

  footer:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:12
  },

  dot:{
    width:12,
    height:12,
    borderRadius:6
  },

  status:{
    marginLeft:10,
    fontWeight:"600",
    color:COLORS.gray
  }

});