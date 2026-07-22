import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '../../constants/colors';

interface Props {
  title: string;
  subtitle: string;
  step: number;
  totalSteps: number;
}

export default function StepHeader({
  title,
  subtitle,
  step,
  totalSteps,
}: Props) {

  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>

      <View style={styles.progressBackground}>

        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
            },
          ]}
        />

      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginBottom: 28,
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 22,
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
  },

});