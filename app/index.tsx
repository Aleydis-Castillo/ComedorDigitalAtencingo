import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { COLORS } from '../constants/colors';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        ZUCARMEX
      </Text>

      <Text style={styles.title}>
        Comedor Digital
      </Text>

      <Text style={styles.subtitle}>
        Atencingo
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push('/auth/login')
        }
      >
        <Text style={styles.buttonText}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outline}
        onPress={() =>
          router.push('/auth/activate')
        }
      >
        <Text style={styles.outlineText}>
          Primer acceso
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 30,
  },

  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
  },

  subtitle: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 80,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
  },

  outline: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },

  outlineText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
});