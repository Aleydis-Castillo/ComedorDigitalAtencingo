import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  router,
} from 'expo-router';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import DashboardBackground from '../../components/backgrounds/DashboardBackground';

import StatusCard from '../../components/cards/StatusCard';

import DashboardHeader from '../../components/header/DashboardHeader';

import ActionCard from '../../components/home/ActionCard';

import {
  useAuth,
} from '../../context/AuthContext';

export default function Dashboard() {
  const {
    user,
  } = useAuth();

  const isExternal =
    user?.role === 'EXTERNAL';

  const sectionTitle =
    isExternal
      ? 'Opciones disponibles'
      : 'Accesos rápidos';

  return (
    <DashboardBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <DashboardHeader />

        <View
          style={
            styles.sectionHeader
          }
        >
          <View
            style={
              styles.sectionIconOrange
            }
          >
            <MaterialCommunityIcons
              name={
                isExternal
                  ? 'account-key-outline'
                  : 'lightning-bolt'
              }
              size={21}
              color="#F97316"
            />
          </View>

          <Text
            style={
              styles.sectionTitle
            }
          >
            {sectionTitle}
          </Text>
        </View>

        <View
          style={
            styles.actionsRow
          }
        >
          <ActionCard
            icon="silverware-fork-knife"
            title="Realizar pedido"
            subtitle={
              isExternal
                ? 'Solicita tu servicio de comedor.'
                : 'Solicita tu desayuno o comida.'
            }
            color="#F05A28"
            backgroundColor="#FFF0EA"
            onPress={() => {
              router.push(
                '/employee/order',
              );
            }}
          />

          <ActionCard
            icon="calendar-month-outline"
            title="Menú semanal"
            subtitle="Consulta el menú de lunes a sábado."
            color="#4C8B32"
            backgroundColor="#EEF6E9"
            onPress={() => {
              router.push(
                '/employee/weeklyMenu',
              );
            }}
          />

          <ActionCard
            icon="clipboard-text-outline"
            title="Mis pedidos"
            subtitle="Consulta tus pedidos realizados."
            color="#3679AD"
            backgroundColor="#EAF3FA"
            onPress={() => {
              router.push(
                '/employee/my-orders',
              );
            }}
          />
        </View>

        {isExternal && (
          <View
            style={
              styles.externalInfoCard
            }
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={23}
              color="#3679AD"
            />

            <Text
              style={
                styles.externalInfoText
              }
            >
              Tu acceso es temporal y estará disponible únicamente durante el periodo autorizado.
            </Text>
          </View>
        )}

        <View
          style={
            styles.statusSection
          }
        >
          <View
            style={
              styles.sectionHeader
            }
          >
            <View
              style={
                styles.sectionIconBlue
              }
            >
              <MaterialCommunityIcons
                name="chart-bar"
                size={20}
                color="#5966B8"
              />
            </View>

            <Text
              style={
                styles.sectionTitle
              }
            >
              Estado del día
            </Text>
          </View>

          <StatusCard
            breakfastAvailable
            lunchAvailable
            orderMade={false}
          />
        </View>
      </ScrollView>
    </DashboardBackground>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        'transparent',
    },

    content: {
      paddingHorizontal:
        17,

      paddingBottom:
        40,
    },

    sectionHeader: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom:
        15,
    },

    sectionIconOrange: {
      width:
        39,

      height:
        39,

      borderRadius:
        13,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight:
        10,

      elevation:
        3,

      shadowColor:
        '#000',

      shadowOffset: {
        width:
          0,

        height:
          2,
      },

      shadowOpacity:
        0.06,

      shadowRadius:
        5,
    },

    sectionIconBlue: {
      width:
        39,

      height:
        39,

      borderRadius:
        13,

      backgroundColor:
        '#F0F1FF',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight:
        10,
    },

    sectionTitle: {
      color:
        '#162033',

      fontSize:
        20,

      fontWeight:
        '800',
    },

    actionsRow: {
      flexDirection:
        'row',

      gap:
        10,
    },

    externalInfoCard: {
      marginTop:
        20,

      flexDirection:
        'row',

      alignItems:
        'flex-start',

      backgroundColor:
        '#EAF3FA',

      borderRadius:
        17,

      padding:
        14,

      borderWidth:
        1,

      borderColor:
        '#D7E5F0',
    },

    externalInfoText: {
      flex:
        1,

      marginLeft:
        9,

      color:
        '#55708A',

      fontSize:
        12,

      lineHeight:
        18,
    },

    statusSection: {
      marginTop:
        27,
    },
  });