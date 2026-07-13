import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../constants/colors';
import ProgressBar from './ProgressBar';

interface Props {
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
}

export default function StepHeader({
  title,
  subtitle,
  step,
  totalSteps,
}: Props) {
  return (
    <View style={styles.container}>
      <ProgressBar
        step={step}
        totalSteps={totalSteps}
      />

      <Text style={styles.title}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 22,
  },
});