import React, { useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import EventCard from '../../components/manager/EventCard';
import EventFilter, {
    FilterType,
} from '../../components/manager/EventFilter';
import EventSearchBar from '../../components/manager/EventSearchBar';
import EventSummary from '../../components/manager/EventSummary';

import { COLORS } from '../../constants/colors';
import { events } from '../../constants/events';

export default function EventsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] =
    useState<FilterType>('Todos');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === 'Todos'
          ? true
          : event.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalEvents = events.length;

  const activeEvents = events.filter(
    event => event.status === 'Activo',
  ).length;

  const totalPeople = events.reduce(
    (sum, event) => sum + event.people,
    0,
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={28}
                  color={COLORS.text}
                />
              </TouchableOpacity>

              <Text style={styles.title}>
                Eventos
              </Text>

              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={26}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Administra los eventos del comedor.
            </Text>

            <EventSummary
              total={totalEvents}
              active={activeEvents}
              nextEvent="25 Jul"
              people={totalPeople}
            />

            <EventSearchBar
              value={search}
              onChangeText={setSearch}
            />

            <EventFilter
              selected={filter}
              onSelect={setFilter}
            />
          </>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onView={() =>
              Alert.alert(
                'Evento',
                `Ver "${item.title}"`,
              )
            }
            onEdit={() =>
              Alert.alert(
                'Editar',
                `Editar "${item.title}"`,
              )
            }
            onDelete={() =>
              Alert.alert(
                'Eliminar',
                `Eliminar "${item.title}"`,
              )
            }
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push('/manager/create-event')
        }
      >
        <MaterialCommunityIcons
          name="plus"
          size={30}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 22,
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,

    width: 64,
    height: 64,
    borderRadius: 32,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});