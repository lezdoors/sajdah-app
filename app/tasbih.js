import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '../constants/AppContext';
import {
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Images,
} from '../constants/theme';
import { getTasbihTotal, incrementTasbih } from '../utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = Math.min(SCREEN_WIDTH * 0.6, 260);
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DHIKR_PRESETS = [
  { key: 'subhanallah', i18nKey: 'subhanallah', arabic: 'سبحان الله' },
  { key: 'alhamdulillah', i18nKey: 'alhamdulillah', arabic: 'الحمد لله' },
  { key: 'allahu_akbar', i18nKey: 'allahu_akbar', arabic: 'الله أكبر' },
];

const TARGET = 33;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TasbihScreen() {
  const { colors, isDark, t, isRTL } = useApp();
  const router = useRouter();

  const [sessionCount, setSessionCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [activeDhikr, setActiveDhikr] = useState(DHIKR_PRESETS[0].key);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Load lifetime total on mount
  useEffect(() => {
    getTasbihTotal().then(setTotalCount);
  }, []);

  // Animate progress ring when session count changes
  useEffect(() => {
    const progress = Math.min(sessionCount / TARGET, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [sessionCount]);

  const handleTap = useCallback(async () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    setSessionCount((prev) => prev + 1);
    const newTotal = await incrementTasbih(1);
    setTotalCount(newTotal);
  }, []);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSessionCount(0);
  }, []);

  const handleDhikrSelect = useCallback((key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveDhikr(key);
    setSessionCount(0);
  }, []);

  // Interpolate stroke offset for progress ring
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const activePreset = DHIKR_PRESETS.find((d) => d.key === activeDhikr);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={Images.tasbih}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />

        <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
          {/* Header */}
          <View style={[styles.header, isRTL && styles.headerRTL]}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backButton}
            >
              <ChevronLeft
                size={24}
                color="#FFFFFF"
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {t('tasbih_counter')}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Active dhikr label */}
          <Text style={styles.dhikrArabic}>
            {activePreset?.arabic}
          </Text>

          {/* Count ring */}
          <View style={styles.ringContainer}>
            <Pressable onPress={handleTap}>
              <Animated.View
                style={[
                  styles.ringOuter,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                {/* SVG progress ring */}
                <Svg
                  width={RING_SIZE}
                  height={RING_SIZE}
                  style={styles.svgRing}
                >
                  {/* Background track */}
                  <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                  />
                  {/* Progress arc */}
                  <AnimatedCircle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke="#D4B76E"
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
                  />
                </Svg>

                {/* Center count */}
                <View style={styles.ringCenter}>
                  <Text style={styles.countNumber}>
                    {sessionCount}
                  </Text>
                  <Text style={styles.countTarget}>
                    / {TARGET}
                  </Text>
                </View>
              </Animated.View>
            </Pressable>
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, isRTL && styles.statsRowRTL]}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                {t('tasbih_session')}
              </Text>
              <Text style={styles.statValue}>
                {sessionCount}
              </Text>
            </View>
            <View style={[styles.statDivider]} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>
                {t('tasbih_total')}
              </Text>
              <Text style={styles.statValue}>
                {totalCount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Dhikr preset buttons */}
          <View style={styles.presetsContainer}>
            {DHIKR_PRESETS.map((preset) => {
              const isActive = activeDhikr === preset.key;
              return (
                <TouchableOpacity
                  key={preset.key}
                  activeOpacity={0.7}
                  onPress={() => handleDhikrSelect(preset.key)}
                  style={[
                    styles.presetButton,
                    isActive && styles.presetButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      isActive && styles.presetTextActive,
                    ]}
                  >
                    {t(preset.i18nKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Reset button */}
          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.7}
            style={styles.resetButton}
          >
            <RotateCcw size={16} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            <Text style={styles.resetText}>
              {t('tasbih_reset')}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    color: '#FFFFFF',
  },

  // Active dhikr
  dhikrArabic: {
    fontSize: 28,
    fontWeight: FontWeight.medium,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  // Ring
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  ringOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgRing: {
    position: 'absolute',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNumber: {
    fontSize: 64,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    lineHeight: 72,
  },
  countTarget: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: -4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  statsRowRTL: {
    flexDirection: 'row-reverse',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    color: '#FFFFFF',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: Spacing.md,
  },

  // Presets
  presetsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(212, 183, 110, 0.2)',
    borderColor: '#D4B76E',
  },
  presetText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  presetTextActive: {
    color: '#D4B76E',
    fontWeight: FontWeight.semibold,
  },

  // Reset
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.xs,
  },
  resetText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
