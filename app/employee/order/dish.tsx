import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { COLORS } from '../../../constants/colors';
import { weeklyMenu } from '../../../constants/mockData';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import DishCard from '../../../components/order/DishCard';
import StepHeader from '../../../components/order/StepHeader';

import { useOrder } from '../../../context/OrderContext';

export default function DishScreen() {
  const {
    foodType,
    dish,
    setDish,
  } = useOrder();

  const todayMenu = weeklyMenu.LUN;

  const dishes =
    foodType === 'breakfast'
      ? todayMenu.breakfast
      : todayMenu.lunch;

  const serviceName =
    foodType === 'breakfast'
      ? 'Desayuno'
      : 'Comida';

  const getDishIcon = (
    dishName: string,
  ): keyof typeof MaterialCommunityIcons.glyphMap => {
    const normalizedName = dishName.toLowerCase();

    if (
      normalizedName.includes('pollo') ||
      normalizedName.includes('pierna')
    ) {
      return 'food-drumstick-outline';
    }

    if (
      normalizedName.includes('carne') ||
      normalizedName.includes('res') ||
      normalizedName.includes('bistec')
    ) {
      return 'food-steak';
    }

    if (
      normalizedName.includes('pescado') ||
      normalizedName.includes('atún')
    ) {
      return 'fish';
    }

    if (
      normalizedName.includes('taco') ||
      normalizedName.includes('tacos')
    ) {
      return 'taco';
    }

    if (
      normalizedName.includes('pasta') ||
      normalizedName.includes('espagueti')
    ) {
      return 'pasta';
    }

    if (
      normalizedName.includes('sopa') ||
      normalizedName.includes('caldo')
    ) {
      return 'pot-steam-outline';
    }

    if (
      normalizedName.includes('huevo') ||
      normalizedName.includes('huevos')
    ) {
      return 'egg-fried';
    }

    if (
      normalizedName.includes('ensalada') ||
      normalizedName.includes('verdura')
    ) {
      return 'leaf';
    }

    if (
      normalizedName.includes('sandwich') ||
      normalizedName.includes('sándwich')
    ) {
      return 'food';
    }

    return 'silverware-fork-knife';
  };

  const handleContinue = () => {
    if (!dish) {
      return;
    }

    router.push('/employee/order/delivery');
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StepHeader
          title="Selecciona tu platillo"
          subtitle="Elige una opción disponible del menú."
          step={2}
          totalSteps={5}
        />

        <View style={styles.menuSummary}>
          <View style={styles.menuIconContainer}>
            <MaterialCommunityIcons
              name={
                foodType === 'breakfast'
                  ? 'coffee-outline'
                  : 'silverware-fork-knife'
              }
              size={24}
              color="#268A4B"
            />
          </View>

          <View style={styles.menuSummaryContent}>
            <Text style={styles.menuLabel}>
              Menú de hoy
            </Text>

            <Text style={styles.serviceName}>
              {serviceName}
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>
              {dishes.length}
            </Text>

            <Text style={styles.countText}>
              opciones
            </Text>
          </View>
        </View>

        {dishes.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>
              Platillos disponibles
            </Text>

            {dishes.map((item) => (
              <DishCard
                key={item.id}
                name={item.name}
                description={item.description}
                icon={getDishIcon(item.name)}
                available
                selected={dish === item.name}
                onPress={() => setDish(item.name)}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons
                name="food-off-outline"
                size={38}
                color="#7A7F87"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No hay platillos disponibles
            </Text>

            <Text style={styles.emptyText}>
              El comedor todavía no ha registrado opciones para
              este servicio.
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continuar"
            disabled={!dish}
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    flexGrow: 1,
  },

  decorativeCircleOne: {
    position: 'absolute',
    top: -75,
    right: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E7F3E9',
  },

  decorativeCircleTwo: {
    position: 'absolute',
    bottom: 80,
    left: -95,
    width: 185,
    height: 185,
    borderRadius: 93,
    backgroundColor: '#FFF0DF',
  },

  menuSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E9E7',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#E3F3E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuSummaryContent: {
    flex: 1,
    marginLeft: 13,
  },

  menuLabel: {
    color: '#7A7F87',
    fontSize: 13,
    fontWeight: '600',
  },

  serviceName: {
    marginTop: 2,
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '800',
  },

  countBadge: {
    alignItems: 'center',
    backgroundColor: '#EDF8F0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  countNumber: {
    color: '#268A4B',
    fontSize: 18,
    fontWeight: '900',
  },

  countText: {
    color: '#477257',
    fontSize: 10,
    fontWeight: '700',
  },

  sectionTitle: {
    marginBottom: 13,
    color: '#374151',
    fontSize: 16,
    fontWeight: '800',
  },

  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#F0F1F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 15,
    color: '#4B5563',
    fontSize: 18,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 8,
    color: '#7A7F87',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 15,
  },
});