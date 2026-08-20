import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { router } from 'expo-router';

import { COLORS } from '../../constants/colors';

type IconName =
  keyof typeof MaterialCommunityIcons.glyphMap;

interface ActionCardProps {
  title: string;
  description: string;
  icon: IconName;
  onPress: () => void;
}

function ActionCard({
  title,
  description,
  icon,
  onPress,
}: ActionCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.actionCard}
      onPress={onPress}
    >
      <View
        style={
          styles.actionIconContainer
        }
      >
        <MaterialCommunityIcons
          name={icon}
          size={30}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>
          {title}
        </Text>

        <Text
          style={
            styles.actionDescription
          }
        >
          {description}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={28}
        color={COLORS.gray}
      />
    </TouchableOpacity>
  );
}

export default function ComedorDashboardScreen() {
  return (
    <View style={styles.container}>
      <View
        pointerEvents="none"
        style={styles.background}
      >
        <View style={styles.topCircle} />

        <View
          style={styles.bottomCircle}
        />

        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={58}
          color="#D6E8D7"
          style={
            styles.backgroundIconOne
          }
        />

        <MaterialCommunityIcons
          name="chef-hat"
          size={54}
          color="#D6E8D7"
          style={
            styles.backgroundIconTwo
          }
        />

        <MaterialCommunityIcons
          name="food-outline"
          size={52}
          color="#F3DFC4"
          style={
            styles.backgroundIconThree
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.header}>
          <View
            style={
              styles.headerTextContainer
            }
          >
            <Text style={styles.greeting}>
              Buenos días
            </Text>

            <Text style={styles.title}>
              Administrador del comedor
            </Text>

            <Text style={styles.subtitle}>
              Gestiona el menú, pedidos y servicios del comedor.
            </Text>
          </View>

          <View
            style={styles.profileButton}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>
        </View>

        <View style={styles.statusCard}>
          <View
            style={
              styles.statusIconContainer
            }
          >
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={31}
              color={COLORS.primary}
            />
          </View>

          <View
            style={styles.statusContent}
          >
            <Text
              style={styles.statusLabel}
            >
              Menú semanal
            </Text>

            <Text
              style={styles.statusTitle}
            >
              Menú publicado
            </Text>

            <Text
              style={
                styles.statusDescription
              }
            >
              El menú actual está disponible para los empleados.
            </Text>
          </View>

          <View
            style={styles.statusBadge}
          >
            <Text
              style={
                styles.statusBadgeText
              }
            >
              Activo
            </Text>
          </View>
        </View>

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            Administración
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            Selecciona una opción
          </Text>
        </View>

        <ActionCard
          title="Modificar menú semanal"
          description="Agrega, edita o elimina los platillos de cada día."
          icon="calendar-edit"
          onPress={() =>
            router.push(
              '/comedor/menu',
            )
          }
        />

        <ActionCard
          title="Registrar eventos"
          description="Programa servicios especiales, fechas y cantidades."
          icon="calendar-star"
          onPress={() =>
            router.push(
              '/comedor/events',
            )
          }
        />

        <ActionCard
          title="Pedidos / Tickets"
          description="Consulta y administra los pedidos recibidos."
          icon="clipboard-text-outline"
          onPress={() =>
            router.push(
              '/comedor/orders',
            )
          }
        />

        <ActionCard
          title="Consultar reportes"
          description="Revisa y exporta los reportes semanales."
          icon="file-chart-outline"
          onPress={() =>
            router.push(
              '/comedor/reports',
            )
          }
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.logoutButton}
          onPress={() =>
            router.replace('/')
          }
        >
          <MaterialCommunityIcons
            name="logout"
            size={23}
            color={COLORS.danger}
          />

          <Text
            style={styles.logoutText}
          >
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 30,
  },

  topCircle: {
    position: 'absolute',
    top: -90,
    right: -75,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E1F2E5',
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
    top: 260,
    right: -8,
    opacity: 0.55,
    transform: [
      {
        rotate: '14deg',
      },
    ],
  },

  backgroundIconTwo: {
    position: 'absolute',
    top: 570,
    left: -10,
    opacity: 0.5,
    transform: [
      {
        rotate: '-17deg',
      },
    ],
  },

  backgroundIconThree: {
    position: 'absolute',
    bottom: 100,
    right: 6,
    opacity: 0.5,
    transform: [
      {
        rotate: '15deg',
      },
    ],
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  greeting: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },

  title: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 33,
    marginBottom: 7,
  },

  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 21,
  },

  profileButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor:
      COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 24,
    padding: 17,
    marginBottom: 27,
    borderWidth: 1,
    borderColor: '#E2ECE3',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 3,
  },

  statusIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#E6F3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  statusContent: {
    flex: 1,
  },

  statusLabel: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },

  statusTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 3,
  },

  statusDescription: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 17,
  },

  statusBadge: {
    backgroundColor: '#E2F3E5',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  statusBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 3,
  },

  sectionSubtitle: {
    color: COLORS.gray,
    fontSize: 13,
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7ECE7',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 2,
  },

  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E7F4E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  actionContent: {
    flex: 1,
    paddingRight: 8,
  },

  actionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },

  actionDescription: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 18,
  },

  logoutButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFF1F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFDCDC',
  },

  logoutText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 9,
  },
});