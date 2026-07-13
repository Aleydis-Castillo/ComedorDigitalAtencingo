import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  placeholder: string;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
}

export default function CustomInput({
  placeholder,
  secureTextEntry = false,
  rightIcon,
}: Props) {
  return (
    <View style={styles.container}>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />

      {rightIcon}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    height: 58,
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
});