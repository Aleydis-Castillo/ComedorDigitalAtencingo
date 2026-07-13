import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

import { router } from 'expo-router';

import { COLORS } from '../../constants/colors';

import StatusCard from '../../components/cards/StatusCard';
import DashboardHeader from '../../components/header/DashboardHeader';
import ActionCard from '../../components/home/ActionCard';

export default function Dashboard() {

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <DashboardHeader />

      <Text style={styles.section}>
        Accesos rápidos
      </Text>

      <ActionCard
        icon="🍽️"
        title="Realizar pedido"
        subtitle="Solicita tu desayuno o comida."
        onPress={() =>
          router.push('/employee/order')
        }
      />

      <ActionCard
        icon="📅"
        title="Menú semanal"
        subtitle="Consulta el menú de lunes a sábado."
        onPress={() =>
          router.push('/employee/weeklyMenu')
        }
      />

      <ActionCard
        icon="📋"
        title="Mis pedidos"
        subtitle="Consulta tus pedidos realizados."
        onPress={() => {}}
      />

      <Text style={styles.section}>
        Estado del día
      </Text>

      <StatusCard
        breakfastAvailable={true}
        lunchAvailable={true}
        orderMade={false}
      />

    </ScrollView>

  );
  

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:COLORS.background,
  },

  content:{
    padding:20,
    paddingBottom:40,
  },

  section:{
    fontSize:22,
    fontWeight:'bold',
    color:COLORS.primary,
    marginBottom:15,
    marginTop:10,
  },

});