import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  icon: string;
  title: string;
  value: string;
}

export default function SummaryItem({
  icon,
  title,
  value,
}: Props) {
  return (
    <View style={styles.card}>

      <Text style={styles.icon}>
        {icon}
      </Text>

      <View style={styles.info}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    fontSize: 26,
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  title: {
    color: COLORS.gray,
    fontSize: 14,
    marginBottom: 4,
  },

  value: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
  },

});