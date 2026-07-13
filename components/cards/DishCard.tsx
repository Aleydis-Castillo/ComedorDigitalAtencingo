import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  name: string;
  available: number;
  totalPrepared: number;
  option?: string;
}

export default function DishCard({
  name,
  available,
  totalPrepared,
  option,
}: Props) {
  const percentage =
    totalPrepared > 0
      ? available / totalPrepared
      : 0;

  const getStatusColor = () => {
    if (available === 0) {
      return '#E53935';
    }

    if (percentage <= 0.30) {
      return '#F9A825';
    }

    return '#43A047';
  };

  return (
    <View style={styles.card}>
      {option && (
        <Text style={styles.option}>
          {option}
        </Text>
      )}

      <Text style={styles.name}>
        {name}
      </Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progress,
            {
              width: `${percentage * 100}%`,
              backgroundColor:
                getStatusColor(),
            },
          ]}
        />
      </View>

      <Text style={styles.available}>
        Disponibles: {available}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
  },

  option: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 5,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginTop: 12,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    borderRadius: 10,
  },

  available: {
    marginTop: 10,
    color: COLORS.gray,
  },
});