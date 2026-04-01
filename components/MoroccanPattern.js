import { useRef } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Path, Rect } from 'react-native-svg';

// 8-pointed Moroccan star (khatam) — classic zellige motif
// 32x32 cell, centered at (16,16), outer radius 10, inner radius 5
const STAR = 'M26,16 L20.6,14.1 L23.1,8.9 L17.9,11.4 L16,6 L14.1,11.4 L8.9,8.9 L11.4,14.1 L6,16 L11.4,17.9 L8.9,23.1 L14.1,20.6 L16,26 L17.9,20.6 L23.1,23.1 L20.6,17.9 Z';

export default function MoroccanPattern({ color = '#FFFFFF', opacity = 0.06 }) {
  const id = useRef(`z${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id={id} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <Path d={STAR} fill="none" stroke={color} strokeWidth={0.8} strokeOpacity={opacity} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
