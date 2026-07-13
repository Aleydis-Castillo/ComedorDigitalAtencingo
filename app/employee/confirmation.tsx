import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

export default function Confirmation() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pedido Confirmado
      </Text>

      <Text style={styles.text}>
        ✔ Tu pedido fue registrado.
      </Text>

      <Text style={styles.text}>
        Folio:
      </Text>

      <Text style={styles.folio}>
        CDA-0001
      </Text>
    </View>
  );
}

const styles =
StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:
      'center',
    alignItems: 'center',
    backgroundColor:
      COLORS.background,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 30,
  },

  text: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 10,
  },

  folio: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
});