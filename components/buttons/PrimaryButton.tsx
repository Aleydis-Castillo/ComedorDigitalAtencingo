import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  disabledButton: {
    backgroundColor: '#CFCFCF',
  },

  text: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },

  disabledText: {
    color: '#7A7A7A',
  },
});