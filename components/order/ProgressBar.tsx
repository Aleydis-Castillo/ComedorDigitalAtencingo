import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  step: number;
  totalSteps: number;
}

export default function ProgressBar({
  step,
  totalSteps,
}: Props) {
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        Paso {step} de {totalSteps}
      </Text>

      <View style={styles.backgroundBar}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },

  stepText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
    fontWeight: '600',
  },

  backgroundBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
});    