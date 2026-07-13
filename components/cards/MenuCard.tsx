import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../constants/colors';
import DishCard from './DishCard';

interface Dish {
  id: number;
  name: string;
  totalPrepared: number;
  available: number;
}

interface Props {
  breakfast: Dish[];
  lunch: Dish[];
}

export default function MenuCard({
  breakfast,
  lunch,
}: Props) {
  return (
    <View style={styles.container}>
      {/* DESAYUNO */}
      <Text style={styles.section}>
        🍳 Desayuno
      </Text>

      {breakfast.length > 0 ? (
        breakfast.map((item) => (
          <DishCard
            key={item.id}
            name={item.name}
            available={item.available}
            totalPrepared={item.totalPrepared}
          />
        ))
      ) : (
        <Text style={styles.empty}>
          No disponible
        </Text>
      )}

      {/* COMIDA */}
      <Text style={styles.section}>
        🍽️ Comida
      </Text>

      {lunch.length > 0 ? (
        lunch.map((item, index) => (
          <DishCard
            key={item.id}
            option={`Opción ${index + 1}`}
            name={item.name}
            available={item.available}
            totalPrepared={item.totalPrepared}
          />
        ))
      ) : (
        <Text style={styles.empty}>
          No disponible
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  section: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    marginTop: 20,
  },

  empty: {
    fontSize: 16,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginBottom: 15,
  },
});