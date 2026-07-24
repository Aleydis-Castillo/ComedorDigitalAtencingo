import React from 'react';

import {
    StyleSheet,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  children: React.ReactNode;
}

interface Decoration {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  top: number;
  left?: number;
  right?: number;
  size: number;
  rotate: string;
}

const decorations: Decoration[] = [
  {
    icon: 'silverware-fork-knife',
    top: 110,
    right: 25,
    size: 50,
    rotate: '-18deg',
  },
  {
    icon: 'food-outline',
    top: 390,
    left: 10,
    size: 45,
    rotate: '12deg',
  },
  {
    icon: 'coffee-outline',
    top: 690,
    right: 18,
    size: 48,
    rotate: '-10deg',
  },
  {
    icon: 'leaf',
    top: 910,
    left: 14,
    size: 55,
    rotate: '20deg',
  },
];

export default function DashboardBackground({
  children,
}: Props) {
  return (
    <View style={styles.container}>
      <View
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.orangeCircle} />
        <View style={styles.greenCircle} />
        <View style={styles.blueCircle} />

        {decorations.map((item, index) => (
          <MaterialCommunityIcons
            key={`${item.icon}-${index}`}
            name={item.icon}
            size={item.size}
            color="rgba(232, 158, 78, 0.08)"
            style={[
              styles.decoration,
              {
                top: item.top,

                ...(item.left !== undefined
                  ? { left: item.left }
                  : {}),

                ...(item.right !== undefined
                  ? { right: item.right }
                  : {}),

                transform: [
                  {
                    rotate: item.rotate,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    position: 'relative',
  },

  decoration: {
    position: 'absolute',
  },

  orangeCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 126, 74, 0.045)',
    top: -55,
    right: -65,
  },

  greenCircle: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(100, 165, 85, 0.035)',
    top: 530,
    left: -120,
  },

  blueCircle: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(75, 139, 190, 0.03)',
    bottom: -60,
    right: -80,
  },
});