import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { COLORS } from '../../../constants/colors';

interface Props {
  verified: boolean;
  onPress: () => void;
}

export default function TicketFingerprint({
  verified,
  onPress,
}: Props) {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Verificación biométrica
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        disabled={verified}
        onPress={onPress}
        style={[
          styles.card,
          verified && styles.cardVerified,
        ]}
      >

        <MaterialCommunityIcons
          name={
            verified
              ? 'check-decagram'
              : 'fingerprint'
          }
          size={50}
          color={
            verified
              ? COLORS.success
              : COLORS.primary
          }
        />

        <Text style={styles.status}>
          {
            verified
              ? 'Huella verificada'
              : 'Toca para verificar tu huella'
          }
        </Text>

        <Text style={styles.description}>
          {
            verified
              ? 'Ya puedes confirmar tu pedido.'
              : 'Esta acción autoriza el envío de tu pedido.'
          }
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginTop: 8,
    marginBottom: 20,
    alignItems: 'center',
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 14,
  },

  card: {
    width: '100%',
    backgroundColor: COLORS.white,

    borderRadius: 20,

    borderWidth: 1.5,
    borderColor: '#D9E2EC',

    paddingVertical: 14,
    paddingHorizontal: 20,

    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  cardVerified: {
    backgroundColor: '#EAF8EC',
    borderColor: COLORS.success,
  },

  status: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },

  description: {
    marginTop: 6,
    textAlign: 'center',
    color: COLORS.gray,
    lineHeight: 21,
    fontSize: 15,
    paddingHorizontal: 10,
  },
});