import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../../constants/colors';

export default function TicketHeader() {
  return (
    <View style={styles.container}>

      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          size={26}
          color={COLORS.white}
        />
      </View>

      <Text style={styles.title}>
        COMEDOR DIGITAL
      </Text>

      <Text style={styles.subtitle}>
        Ingenio Atencingo
      </Text>

      <View style={styles.line} />

      <Text style={styles.caption}>
        Ticket de pedido
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  subtitle: {
    color: COLORS.white,
    fontSize: 15,
    marginTop: 4,
    opacity: 0.95,
  },

  line: {
    width: '70%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.30)',
    marginVertical: 8,
  },

  caption: {
    color: COLORS.white,
    fontSize: 14,
    letterSpacing: 2,
    opacity: 0.9,
    textTransform: 'uppercase',
  },

});