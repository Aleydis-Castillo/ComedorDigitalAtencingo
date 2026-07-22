import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  verified: boolean;
}

export default function TicketStatus({
  verified,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        verified
          ? styles.successContainer
          : styles.pendingContainer,
      ]}
    >

      <MaterialCommunityIcons
        name={
          verified
            ? 'check-circle'
            : 'clock-outline'
        }
        size={18}
        color={
          verified
            ? '#2E7D32'
            : '#F57C00'
        }
      />

      <Text
        style={[
          styles.text,
          {
            color: verified
              ? '#2E7D32'
              : '#F57C00',
          },
        ]}
      >
        {
          verified
            ? 'Pedido verificado'
            : 'Pendiente de confirmación'
        }
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
    marginBottom: 10,
  },

  pendingContainer: {
    backgroundColor: '#FFF3E0',
  },

  successContainer: {
    backgroundColor: '#E8F5E9',
  },

  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
  },

});