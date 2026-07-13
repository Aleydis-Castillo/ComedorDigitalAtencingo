import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function DeliveryCard({
  icon,
  title,
  description,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:{
    backgroundColor:COLORS.white,
    borderRadius:20,
    padding:20,
    alignItems:'center',
    marginBottom:20,
    borderWidth:2,
    borderColor:'transparent',
    elevation:3,
  },

  selectedCard:{
    borderColor:COLORS.primary,
    backgroundColor:'#EAF7EC',
  },

  iconContainer:{
    width:70,
    height:70,
    borderRadius:35,
    backgroundColor:COLORS.accent,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:15,
  },

  icon:{
    fontSize:34,
  },

  title:{
    fontSize:22,
    fontWeight:'bold',
    color:COLORS.primary,
  },

  description:{
    textAlign:'center',
    marginTop:8,
    color:COLORS.gray,
  },
});