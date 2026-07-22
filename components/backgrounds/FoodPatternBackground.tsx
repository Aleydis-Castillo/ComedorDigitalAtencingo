import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  children: React.ReactNode;
}

interface PatternIcon {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  top: number;
  left?: number;
  right?: number;
  rotate: string;
}

const icons: PatternIcon[] = [
  {
    name: 'food-apple-outline',
    top: 40,
    left: 18,
    rotate: '-15deg',
  },
  {
    name: 'coffee-outline',
    top: 150,
    right: 22,
    rotate: '12deg',
  },
  {
    name: 'silverware-fork-knife',
    top: 300,
    left: 24,
    rotate: '10deg',
  },
  {
    name: 'pizza',
    top: 460,
    right: 20,
    rotate: '-12deg',
  },
  {
    name: 'food-drumstick-outline',
    top: 620,
    left: 20,
    rotate: '15deg',
  },
  {
    name: 'cup-outline',
    top: 790,
    right: 28,
    rotate: '-8deg',
  },
  {
    name: 'food-croissant',
    top: 950,
    left: 24,
    rotate: '-12deg',
  },
  {
    name: 'food-outline',
    top: 1110,
    right: 20,
    rotate: '12deg',
  },
];

export default function FoodPatternBackground({
  children,
}: Props) {
  return (
    <View style={styles.container}>
      <View
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        {icons.map((item, index) => (
          <MaterialCommunityIcons
            key={`${item.name}-${index}`}
            name={item.name}
            size={54}
            color="rgba(0, 0, 0, 0.035)"
            style={[
              styles.icon,
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
    position: 'relative',
    backgroundColor: '#F8FBF8',
  },

  icon: {
    position: 'absolute',
  },
});