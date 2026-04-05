// Sajdah Design System v3 — Bible App Grade
// Clean, high-contrast, warm ivory light / true black dark
// Accent: teal-green that pops. Gold for spiritual highlights.

// ── Shared Palette ──────────────────────────────────────
export const Palette = {
  teal900: '#0D3B2E',
  teal800: '#145C47',
  teal700: '#1A7A5E',
  teal600: '#1F9A76',
  teal500: '#2AB78D',
  teal400: '#4ECBA0',
  teal300: '#7EDDB8',
  teal200: '#B5ECD5',
  teal100: '#E0F7ED',
  teal50: '#F0FBF6',

  gold700: '#8A5D3B',
  gold600: '#A06B42',
  gold500: '#B5784D',
  gold400: '#C8895A',
  gold300: '#D9A57A',
  gold200: '#E8C4A0',
  gold100: '#F5E0CC',

  neutral950: '#0C0C0C',
  neutral900: '#1C1C1E',
  neutral800: '#2C2C2E',
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
  background: '#F6F6F8',
  backgroundSecondary: '#EDEDF0',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceBorder: 'rgba(0, 0, 0, 0.06)',
  cardBorder: 'rgba(0, 0, 0, 0.06)',

  accent: '#1A7A5E',
  accentMedium: '#1F9A76',
  accentLight: '#E0F7ED',
  accentDark: '#0D3B2E',

  sage: '#1F9A76',
  sageMuted: '#4ECBA0',
  sageLight: 'rgba(26, 122, 94, 0.06)',
  sageBright: '#2AB78D',

  gold: '#B5784D',
  goldMuted: '#A06B42',
  goldLight: 'rgba(181, 120, 77, 0.08)',
  goldBright: '#C8895A',

  textPrimary: '#000000',
  textSecondary: '#636366',
  textTertiary: '#8E8E93',
  textOnDark: '#FFFFFF',
  textOnDarkSecondary: 'rgba(255, 255, 255, 0.80)',
  textOnDarkTertiary: 'rgba(255, 255, 255, 0.50)',

  divider: '#E5E5EA',
  overlay: 'rgba(0, 0, 0, 0.03)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',

  danger: '#FF3B30',
  success: '#34C759',

  tabActive: '#1A7A5E',
  tabInactive: '#8E8E93',

  cardShadow: '#000000',
  switchTrack: '#E5E5EA',
  switchTrackActive: '#34C759',

  // Page gradient background
  gradientTop: '#FFFFFF',
  gradientMid: '#F8F8FA',
  gradientBottom: '#F2F2F5',
  // Glassmorphic cards
  cardGlass: '#FFFFFF',
  cardGlassBorder: 'rgba(0, 0, 0, 0.06)',
};

// ── Dark Theme ──────────────────────────────────────────
export const DarkColors = {
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',

  accent: '#4ECBA0',
  accentMedium: '#2AB78D',
  accentLight: 'rgba(78, 203, 160, 0.12)',
  accentDark: '#7EDDB8',

  sage: '#4ECBA0',
  sageMuted: '#2AB78D',
  sageLight: 'rgba(78, 203, 160, 0.10)',
  sageBright: '#7EDDB8',

  gold: '#C8895A',
  goldMuted: '#B5784D',
  goldLight: 'rgba(200, 137, 90, 0.12)',
  goldBright: '#D9A57A',

  textPrimary: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary: '#636366',
  textOnDark: '#FFFFFF',
  textOnDarkSecondary: 'rgba(255, 255, 255, 0.80)',
  textOnDarkTertiary: 'rgba(255, 255, 255, 0.50)',

  divider: '#3A3A3C',
  overlay: 'rgba(255, 255, 255, 0.05)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  danger: '#FF453A',
  success: '#30D158',

  tabActive: '#4ECBA0',
  tabInactive: '#636366',

  cardShadow: '#000000',
  switchTrack: '#3A3A3C',
  switchTrackActive: '#30D158',

  // Page gradient background
  gradientTop: '#0A1A14',
  gradientMid: '#060E0A',
  gradientBottom: '#000000',
  // Glassmorphic cards
  cardGlass: 'rgba(28, 28, 30, 0.75)',
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
  oliveGlow: {
    shadowColor: '#1A7A5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: '#C9A227',
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
  frosted: { backgroundColor: 'rgba(250, 248, 243, 0.92)', borderWidth: 1, borderColor: 'rgba(229, 224, 214, 0.5)' },
};

// ── Gradients ───────────────────────────────────────────
export const Gradients = {
  prayerCard: ['#0D3B2E', '#145C47'],
  prayerCardDark: ['#1C1C1E', '#2C2C2E'],
  heroMask: ['transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.8)', '#FFFFFF'],
  heroMaskDark: ['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)', '#000000'],
  heroMaskBlack: ['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)', '#000000'],
  splash: ['#0D3B2E', '#145C47'],
  goldSubtle: ['rgba(201, 162, 39, 0.06)', 'rgba(201, 162, 39, 0.0)'],
  oliveSubtle: ['rgba(26, 122, 94, 0.04)', 'rgba(26, 122, 94, 0.0)'],
  duasCard: ['#1A7A5E', '#0D3B2E'],
  duasCardDark: ['#2C2C2E', '#1C1C1E'],
  discoverCard: ['#1F9A76', '#0D3B2E'],
  discoverCardDark: ['#2C2C2E', '#1C1C1E'],
};

// ── Feature Gradients (replace card photos) ─────────────
export const FeatureGradients = {
  names:    { colors: ['#0A3D5C', '#1A7A8A'], icon: 'Star' },
  tasbih:   { colors: ['#5C3A0A', '#B8860B'], icon: 'CircleDot' },
  qibla:    { colors: ['#1A1A4E', '#3D3DA6'], icon: 'Compass' },
  calendar: { colors: ['#4A1942', '#8B3A7A'], icon: 'Calendar' },
};

export const HeroGradients = {
  discover: ['#0D3B2E', '#1A7A5E', '#0D3B2E'],
  duas:     ['#0A1628', '#1A3A5C', '#0D2240'],
  you:      ['#1A2A1A', '#2D4A2D'],
  prayer:   ['#1A1A2E', '#2D2D5C', '#0D0D1E'],
};

// ── Topic Colors (vibrant, Bible App style) ─────────────
export const TopicColors = {
  prayer: { bg: '#1A7A5E', text: '#FFFFFF' },
  faith: { bg: '#5856D6', text: '#FFFFFF' },
  manners: { bg: '#007AFF', text: '#FFFFFF' },
  charity: { bg: '#FF9500', text: '#FFFFFF' },
  patience: { bg: '#00838F', text: '#FFFFFF' },
  forgiveness: { bg: '#AF52DE', text: '#FFFFFF' },
  knowledge: { bg: '#34C759', text: '#FFFFFF' },
  remembrance: { bg: '#FF2D55', text: '#FFFFFF' },
  sincerity: { bg: '#FF6B35', text: '#FFFFFF' },
  family: { bg: '#5AC8FA', text: '#FFFFFF' },
};

export const TopicColorsDark = {
  prayer:      { bg: '#2AB78D', text: '#FFFFFF' },
  faith:       { bg: '#7B79E8', text: '#FFFFFF' },
  manners:     { bg: '#4DA3FF', text: '#FFFFFF' },
  charity:     { bg: '#FFB340', text: '#FFFFFF' },
  patience:    { bg: '#26A5B3', text: '#FFFFFF' },
  forgiveness: { bg: '#C77AE8', text: '#FFFFFF' },
  knowledge:   { bg: '#5DD87A', text: '#FFFFFF' },
  remembrance: { bg: '#FF5C7A', text: '#FFFFFF' },
  sincerity:   { bg: '#FF8F5C', text: '#FFFFFF' },
  family:      { bg: '#7AD6FA', text: '#FFFFFF' },
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
