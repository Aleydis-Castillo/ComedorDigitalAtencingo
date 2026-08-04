import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';
import { Event } from '../../constants/events';

interface Props {
  event: Event;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EventCard({
  event,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const getStatusColor = () => {
    switch (event.status) {
      case 'Activo':
        return '#4CAF50';

      case 'Programado':
        return '#2196F3';

      case 'Finalizado':
        return '#757575';

      case 'Cancelado':
        return '#F44336';

      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="calendar-star"
            size={28}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            {event.title}
          </Text>

          <Text style={styles.subtitle}>
            Evento especial
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {event.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="calendar"
          size={18}
          color={COLORS.primary}
        />

        <Text style={styles.infoText}>
          {event.date}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={18}
          color={COLORS.primary}
        />

        <Text style={styles.infoText}>
          {event.time}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={18}
          color={COLORS.primary}
        />

        <Text style={styles.infoText}>
          {event.service}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="account-group-outline"
          size={18}
          color={COLORS.primary}
        />

        <Text style={styles.infoText}>
          {event.people} personas
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={18}
          color={COLORS.primary}
        />

        <Text style={styles.infoText}>
          {event.location}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onView}
        >
          <MaterialCommunityIcons
            name="eye-outline"
            size={22}
            color="#2196F3"
          />

          <Text style={styles.actionText}>
            Ver
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={22}
            color="#FF9800"
          />

          <Text style={styles.actionText}>
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={22}
            color="#F44336"
          />

          <Text style={styles.actionText}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: '#E3EAE4',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E7F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerText: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: COLORS.gray,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },

  actionButton: {
    alignItems: 'center',
  },

  actionText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray,
  },
});