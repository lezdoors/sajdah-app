import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Mosque dome with minaret — Home tab
export function MosqueIcon({ size = 24, color = '#000', strokeWidth = 1.5 }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {/* Main dome */}
      <Path
        d="M6 16V13C6 9.5 8.5 7 12 7C15.5 7 18 9.5 18 13V16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Base platform */}
      <Path
        d="M4 16H20V18H4V16Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crescent finial */}
      <Path
        d="M12 7V5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="4" r="1" stroke={color} strokeWidth={strokeWidth * 0.8} />
      {/* Left minaret */}
      <Path
        d="M5 16V12.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right minaret */}
      <Path
        d="M19 16V12.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Door arch */}
      <Path
        d="M10 18V15.5C10 14.67 10.9 14 12 14C13.1 14 14 14.67 14 15.5V18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Open Mushaf — Quran tab
export function MushafIcon({ size = 24, color = '#000', strokeWidth = 1.5 }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {/* Left page */}
      <Path
        d="M12 6C10 4 7 4 4 5V18C7 17 10 17 12 19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <Path
        d="M12 6C14 4 17 4 20 5V18C17 17 14 17 12 19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spine */}
      <Path
        d="M12 6V19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bookmark ribbon */}
      <Path
        d="M16 5V8L17 7.2L18 8V5"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Raised hands making dua — Duas tab
export function DuaHandsIcon({ size = 24, color = '#000', strokeWidth = 1.5 }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {/* Left hand */}
      <Path
        d="M7 18C6 18 5 17.5 5 16V10C5 8.5 6 7 7 7C8 7 8.5 8 8.5 9V13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left fingers */}
      <Path
        d="M7 7V5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M5.5 8V6"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
      {/* Right hand */}
      <Path
        d="M17 18C18 18 19 17.5 19 16V10C19 8.5 18 7 17 7C16 7 15.5 8 15.5 9V13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right fingers */}
      <Path
        d="M17 7V5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M18.5 8V6"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
      {/* Connection at wrists */}
      <Path
        d="M8.5 18H15.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Light sparkle above */}
      <Path
        d="M12 3V4.5"
        stroke={color}
        strokeWidth={strokeWidth * 0.7}
        strokeLinecap="round"
      />
      <Path
        d="M10 4L10.5 5"
        stroke={color}
        strokeWidth={strokeWidth * 0.7}
        strokeLinecap="round"
      />
      <Path
        d="M14 4L13.5 5"
        stroke={color}
        strokeWidth={strokeWidth * 0.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Islamic geometric star — Discover tab
export function IslamicStarIcon({ size = 24, color = '#000', strokeWidth = 1.5 }) {
  const s = size;
  // 8-pointed star (Rub el Hizb style)
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {/* Outer rotated square 1 */}
      <Path
        d="M12 3L17 8L22 12L17 16L12 21L7 16L2 12L7 8L12 3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner rotated square (45 degrees offset) */}
      <Rect
        x="8"
        y="8"
        width="8"
        height="8"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center dot */}
      <Circle cx="12" cy="12" r="1.2" fill={color} />
    </Svg>
  );
}
