import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  label: string;
  onPress: () => void;
}

export default function SuggestionChip({
  label,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Text style={styles.icon}>📍</Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  label: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
});