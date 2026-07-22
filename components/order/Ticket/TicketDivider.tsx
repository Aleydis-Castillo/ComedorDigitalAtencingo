import {
  StyleSheet,
  Text,
} from 'react-native';


export default function TicketDivider() {
  return (
    <Text style={styles.divider}>
      • • • • • • • • • • • • • • • • • • • •
    </Text>
  );
}

const styles = StyleSheet.create({

  divider: {
    textAlign: 'center',
    color: '#C5CCD3',
    fontSize: 15,
    letterSpacing: 2,
    marginVertical: 10,
  },

});