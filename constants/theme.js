// Sajdah Design System v4 — Lemonade-grade
// Bold pink accent, pure black + white core, premium minimalism
// Pink used as strategic punctuation — not everywhere

// ── Shared Palette ──────────────────────────────────────
export const Palette = {
  pink900: '#990050',
  pink800: '#CC0069',
  pink700: '#E60076',
  pink600: '#FF0083',  // PRIMARY — Lemonade signature
  pink500: '#FF1A93',
  pink400: '#FF4DAB',
  pink300: '#FF80C3',
  pink200: '#FFB3DA',
  pink100: '#FFE0F0',
  pink50:  '#FFF5FA',

  rose700: '#9E4B6C',
  rose600: '#B85A7E',
  rose500: '#D16B90',
  rose400: '#E07FA2',
  rose300: '#ECA3BC',
  rose200: '#F5CADB',
  rose100: '#FBE8F0',

  neutral950: '#0C0C0C',
  neutral900: '#161616',
  neutral800: '#1C1C1E',
  neutral700: '#3A3A3C',
  neutral600: '#636366',
  neutral500: '#8E8E93',
  neutral400: '#AEAEB2',
  neutral300: '#C7C7CC',
  neutral200: '#E5E5EA',
  neutral100: '#F2F2F7',
  neutral50: '#FAFAFA',
};

// ── Light Theme ─────────────────────────────────────────
export const LightColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F7F7F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceBorder: 'rgba(0, 0, 0, 0.06)',
  cardBorder: 'rgba(0, 0, 0, 0.06)',

  accent: '#FF0083',
  accentMedium: '#FF1A93',
  accentLight: '#FFF0F7',
  accentDark: '#CC0069',

  sage: '#FF4DAB',
  sageMuted: '#FF80C3',
  sageLight: 'rgba(255, 0, 131, 0.05)',
  sageBright: '#FF1A93',

  gold: '#D16B90',
  goldMuted: '#B85A7E',
  goldLight: 'rgba(209, 107, 144, 0.08)',
  goldBright: '#E07FA2',

  textPrimary: '#161616',
  textSecondary: '#4A4A4A',
  textTertiary: '#8E8E93',
  textOnDark: '#FFFFFF',
  textOnDarkSecondary: 'rgba(255, 255, 255, 0.80)',
  textOnDarkTertiary: 'rgba(255, 255, 255, 0.50)',

  divider: '#EFEFEF',
  overlay: 'rgba(0, 0, 0, 0.03)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',

  danger: '#FF3B30',
  success: '#34C759',

  tabActive: '#FF0083',
  tabInactive: '#AEAEB2',

  cardShadow: '#000000',
  switchTrack: '#E5E5EA',
  switchTrackActive: '#FF0083',

  // Page gradient background
  gradientTop: '#FFFFFF',
  gradientMid: '#FAFAFA',
  gradientBottom: '#F7F7F7',
  // Glassmorphic cards
  cardGlass: '#FFFFFF',
  cardGlassBorder: 'rgba(0, 0, 0, 0.06)',
};

// ── Dark Theme ──────────────────────────────────────────
export const DarkColors = {
  background: '#000000',
  backgroundSecondary: '#161616',
  surface: '#161616',
  surfaceElevated: '#1C1C1E',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',

  accent: '#FF4DAB',
  accentMedium: '#FF1A93',
  accentLight: 'rgba(255, 0, 131, 0.12)',
  accentDark: '#FF80C3',

  sage: '#FF4DAB',
  sageMuted: '#FF1A93',
  sageLight: 'rgba(255, 0, 131, 0.10)',
  sageBright: '#FF80C3',

  gold: '#E07FA2',
  goldMuted: '#D16B90',
  goldLight: 'rgba(224, 127, 162, 0.12)',
  goldBright: '#ECA3BC',

  textPrimary: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary: '#636366',
  textOnDark: '#FFFFFF',
  textOnDarkSecondary: 'rgba(255, 255, 255, 0.80)',
  textOnDarkTertiary: 'rgba(255, 255, 255, 0.50)',

  divider: '#2C2C2E',
  overlay: 'rgba(255, 255, 255, 0.05)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  danger: '#FF453A',
  success: '#30D158',

  tabActive: '#FF4DAB',
  tabInactive: '#636366',

  cardShadow: '#000000',
  switchTrack: '#3A3A3C',
  switchTrackActive: '#FF4DAB',

  // Page gradient background
  gradientTop: '#0C0C0C',
  gradientMid: '#060606',
  gradientBottom: '#000000',
  // Glassmorphic cards
  cardGlass: 'rgba(22, 22, 22, 0.85)',
  cardGlassBorder: 'rgba(255, 255, 255, 0.08)',
};

// Static export for backward compatibility (light mode default)
export const Colors = LightColors;

// ── Spacing (8-point grid) ──────────────────────────────
export const Spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 36,
  xl: 44,
  xxl: 52,
  xxxl: 60,
  huge: 72,
};

export const FontSize = {
  display: 56,
  hero: 48,
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
  nav: 10,
  micro: 9,
};

export const FontWeight = {
  bold: '700',
  semibold: '600',
  medium: '500',
  regular: '400',
  light: '300',
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 999,
};

// ── Elevation Scale (3D depth) ──────────────────────────
export const Shadows = {
  none: {},
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLifted: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  float: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 12,
  },
  depth3d: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 16,
  },
  pinkGlow: {
    shadowColor: '#FF0083',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
  // Keep old name as alias for backward compat
  oliveGlow: {
    shadowColor: '#FF0083',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: '#FF0083',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const ShadowsDark = {
  ...Shadows,
  soft: { ...Shadows.soft, shadowColor: '#000000', shadowOpacity: 0.35 },
  card: { ...Shadows.card, shadowColor: '#000000', shadowOpacity: 0.45 },
  cardLifted: { ...Shadows.cardLifted, shadowColor: '#000000', shadowOpacity: 0.55 },
  float: { ...Shadows.float, shadowColor: '#000000', shadowOpacity: 0.65 },
};

// ── Glass System ────────────────────────────────────────
export const Glass = {
  light: { backgroundColor: 'rgba(255, 255, 255, 0.88)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  medium: { backgroundColor: 'rgba(255, 255, 255, 0.65)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  dark: { backgroundColor: 'rgba(0, 0, 0, 0.35)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)' },
  frosted: { backgroundColor: 'rgba(247, 247, 247, 0.92)', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.06)' },
};

// ── Gradients ───────────────────────────────────────────
export const Gradients = {
  prayerCard: ['#161616', '#2C2C2E'],
  prayerCardDark: ['#1C1C1E', '#2C2C2E'],
  heroMask: ['transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.8)', '#FFFFFF'],
  heroMaskDark: ['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)', '#000000'],
  heroMaskBlack: ['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)', '#000000'],
  splash: ['#161616', '#000000'],
  pinkSubtle: ['rgba(255, 0, 131, 0.04)', 'rgba(255, 0, 131, 0.0)'],
  goldSubtle: ['rgba(255, 0, 131, 0.04)', 'rgba(255, 0, 131, 0.0)'],
  oliveSubtle: ['rgba(255, 0, 131, 0.04)', 'rgba(255, 0, 131, 0.0)'],
  duasCard: ['#161616', '#000000'],
  duasCardDark: ['#1C1C1E', '#000000'],
  discoverCard: ['#161616', '#000000'],
  discoverCardDark: ['#1C1C1E', '#000000'],
};

// ── Feature Gradients (replace card photos) ─────────────
export const FeatureGradients = {
  names:    { colors: ['#161616', '#2C2C2E'], icon: 'Star' },
  tasbih:   { colors: ['#1C1C1E', '#3A3A3C'], icon: 'CircleDot' },
  qibla:    { colors: ['#0C0C0C', '#1C1C1E'], icon: 'Compass' },
  calendar: { colors: ['#2C2C2E', '#161616'], icon: 'Calendar' },
};

export const HeroGradients = {
  discover: ['#161616', '#000000'],
  duas:     ['#161616', '#0C0C0C'],
  you:      ['#161616', '#000000'],
  prayer:   ['#161616', '#0C0C0C'],
};

// ── Topic Colors (monochrome with pink accents) ──────────
export const TopicColors = {
  prayer:      { bg: '#FF0083', text: '#FFFFFF' },
  faith:       { bg: '#161616', text: '#FFFFFF' },
  manners:     { bg: '#4A4A4A', text: '#FFFFFF' },
  charity:     { bg: '#FF4DAB', text: '#FFFFFF' },
  patience:    { bg: '#2C2C2E', text: '#FFFFFF' },
  forgiveness: { bg: '#CC0069', text: '#FFFFFF' },
  knowledge:   { bg: '#3A3A3C', text: '#FFFFFF' },
  remembrance: { bg: '#FF0083', text: '#FFFFFF' },
  sincerity:   { bg: '#636366', text: '#FFFFFF' },
  family:      { bg: '#FF80C3', text: '#FFFFFF' },
};

export const TopicColorsDark = {
  prayer:      { bg: '#FF0083', text: '#FFFFFF' },
  faith:       { bg: '#2C2C2E', text: '#FFFFFF' },
  manners:     { bg: '#3A3A3C', text: '#FFFFFF' },
  charity:     { bg: '#FF4DAB', text: '#FFFFFF' },
  patience:    { bg: '#4A4A4A', text: '#FFFFFF' },
  forgiveness: { bg: '#CC0069', text: '#FFFFFF' },
  knowledge:   { bg: '#636366', text: '#FFFFFF' },
  remembrance: { bg: '#FF1A93', text: '#FFFFFF' },
  sincerity:   { bg: '#4A4A4A', text: '#FFFFFF' },
  family:      { bg: '#FF80C3', text: '#FFFFFF' },
};

// ── Image References ────────────────────────────────────
export const Images = {
  mosque: require('../assets/images/mosque.jpg'),
  mosqueNight: require('../assets/images/mosque-night.jpg'),
  mosqueSilhouette: require('../assets/images/mosque-silhouette.jpg'),
  quran: require('../assets/images/quran.jpg'),
  tasbih: require('../assets/images/tasbih.jpg'),
  mosqueEntrance: require('../assets/images/mosque-entrance.jpg'),
  heroMacca: require('../assets/images/hero-macca.jpg'),
  heroPink: require('../assets/images/hero-pink.jpg'),
  heroFinial: require('../assets/images/hero-finial.jpg'),
  heroWhite: require('../assets/images/hero-white.jpg'),
  heroOrange: require('../assets/images/hero-orange.jpg'),
  heroYellow: require('../assets/images/hero-yellow.jpg'),
  quranCover: require('../assets/images/quran-cover.jpg'),
  quranOpen: require('../assets/images/quran-open.jpg'),
  // Per-section hero images
  hassan2Night: require('../assets/images/hassan2-night.jpg'),
  mosqueWhite: require('../assets/images/mosque-white.jpg'),
  mosqueArch: require('../assets/images/mosque-arch.jpg'),
  hassan2Arch: require('../assets/images/hassan2-arch.jpg'),
  hassan2Door: require('../assets/images/hassan2-door.jpg'),
  istanbulNight: require('../assets/images/istanbul-night.jpg'),
  quranMadinah: require('../assets/images/quran-madinah.jpg'),
  hassanTower: require('../assets/images/hassan-tower.jpg'),
};
