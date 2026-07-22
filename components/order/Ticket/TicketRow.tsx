import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../../constants/colors';

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  value: string;
}

export default function TicketRow({
  icon,
  title,
  value,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.left}>

        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={COLORS.primary}
        />

        <Text style={styles.title}>
          {title}
        </Text>

      </View>

      <Text
        style={styles.value}
        numberOfLines={2}
      >
        {value}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '42%',
  },

  title: {
    marginLeft: 10,
    color: COLORS.gray,
    fontSize: 15,
    fontWeight: '600',
  },

  value: {
    width: '54%',
    textAlign: 'right',
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },

});