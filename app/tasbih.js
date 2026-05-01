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
import { ChevronLeft, RotateCcw, Star } from 'lucide-react-native';
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
  { key: 'la_ilaha', i18nKey: 'la_ilaha_illallah', arabic: 'لا إله إلا الله' },
];

const TARGET_OPTIONS = [33, 99, Infinity];

const FATIMAH_PHASES = [
  { key: 'subhanallah', arabic: 'سبحان الله', target: 33 },
  { key: 'alhamdulillah', arabic: 'الحمد لله', target: 33 },
  { key: 'allahu_akbar', arabic: 'الله أكبر', target: 34 },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TasbihScreen() {
  const { colors, isDark, t, isRTL } = useApp();
  const router = useRouter();

  const [sessionCount, setSessionCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [activeDhikr, setActiveDhikr] = useState(DHIKR_PRESETS[0].key);
  const [target, setTarget] = useState(33);
  const [isFatimahMode, setIsFatimahMode] = useState(false);
  const [fatimahPhase, setFatimahPhase] = useState(0);
  const fatimahAdvancing = useRef(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const ringColorAnim = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(1)).current;
  const celebrationActive = useRef(false);

  // Load lifetime total on mount
  useEffect(() => {
    getTasbihTotal().then(setTotalCount);
  }, []);

  // Animate progress ring when session count changes
  useEffect(() => {
    const progress = target === Infinity ? 0 : Math.min(sessionCount / target, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [sessionCount, target]);

  // Completion celebration when target is reached
  useEffect(() => {
    if (target === Infinity || sessionCount === 0 || sessionCount < target) return;
    if (celebrationActive.current) return;
    celebrationActive.current = true;

    // Haptic for completion
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Gold flash on ring color
    Animated.sequence([
      Animated.timing(ringColorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(ringColorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    // Scale-up celebration on ring
    Animated.sequence([
      Animated.timing(celebrationScale, {
        toValue: 1.08,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-reset after 800ms (or advance Fatimah phase)
    const timer = setTimeout(() => {
      if (isFatimahMode && !fatimahAdvancing.current) {
        fatimahAdvancing.current = true;
        const nextPhase = fatimahPhase + 1;
        if (nextPhase < FATIMAH_PHASES.length) {
          // Advance to next phase
          setFatimahPhase(nextPhase);
          setSessionCount(0);
          setTarget(FATIMAH_PHASES[nextPhase].target);
        } else {
          // All 3 phases complete
          setSessionCount(0);
          setFatimahPhase(0);
          setTarget(FATIMAH_PHASES[0].target);
        }
        celebrationActive.current = false;
        fatimahAdvancing.current = false;
      } else if (!isFatimahMode) {
        setSessionCount(0);
        celebrationActive.current = false;
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [sessionCount, target, isFatimahMode, fatimahPhase]);

  const handleTap = useCallback(async () => {
    const nextCount = sessionCount + 1;

    // Milestone haptic feedback (distinct from normal tap)
    if (target !== Infinity && nextCount === target) {
      // Target reached — handled by celebration useEffect
    } else if (nextCount === 99) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (nextCount === 33) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

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

    setSessionCount(nextCount);
    const newTotal = await incrementTasbih(1);
    setTotalCount(newTotal);
  }, [sessionCount, target]);

  const handleReset = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSessionCount(0);
  }, []);

  const handleDhikrSelect = useCallback((key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFatimahMode(false);
    setFatimahPhase(0);
    setActiveDhikr(key);
    setSessionCount(0);
  }, []);

  const handleFatimahToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isFatimahMode) {
      // Deactivate
      setIsFatimahMode(false);
      setFatimahPhase(0);
      setActiveDhikr(DHIKR_PRESETS[0].key);
      setTarget(33);
      setSessionCount(0);
    } else {
      // Activate
      setIsFatimahMode(true);
      setFatimahPhase(0);
      setSessionCount(0);
      setTarget(FATIMAH_PHASES[0].target);
    }
  }, [isFatimahMode]);

  const handleTargetSelect = useCallback((val) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFatimahMode(false);
    setFatimahPhase(0);
    setTarget(val);
    setSessionCount(0);
  }, []);

  // Interpolate stroke offset for progress ring
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  // Interpolate ring stroke color for gold flash celebration
  const ringStrokeColor = ringColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF0083', '#FF4DAB'],
  });

  const activePreset = DHIKR_PRESETS.find((d) => d.key === activeDhikr);
  const currentFatimahPhase = isFatimahMode ? FATIMAH_PHASES[fatimahPhase] : null;
  const displayArabic = isFatimahMode ? currentFatimahPhase.arabic : activePreset?.arabic;
  const isInfinity = target === Infinity;

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
            {displayArabic}
          </Text>

          {/* Count ring */}
          <View style={styles.ringContainer}>
            <Pressable onPress={handleTap}>
              <Animated.View
                style={[
                  styles.ringOuter,
                  {
                    transform: [
                      { scale: Animated.multiply(scaleAnim, celebrationScale) },
                    ],
                  },
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
                    stroke={ringStrokeColor}
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
                  {!isInfinity && (
                    <Text style={styles.countTarget}>
                      / {target}
                    </Text>
                  )}
                </View>
              </Animated.View>
            </Pressable>
          </View>

          {/* Fatimah phase indicator */}
          {isFatimahMode && (
            <View style={styles.phaseIndicator}>
              {FATIMAH_PHASES.map((phase, idx) => (
                <View
                  key={phase.key}
                  style={[
                    styles.phaseDot,
                    idx === fatimahPhase && styles.phaseDotActive,
                    idx < fatimahPhase && styles.phaseDotCompleted,
                  ]}
                />
              ))}
              <Text style={styles.phaseText}>
                {fatimahPhase + 1}/3
              </Text>
            </View>
          )}

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

          {/* Tasbih Fatimah button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleFatimahToggle}
            style={[
              styles.fatimahButton,
              isFatimahMode && styles.fatimahButtonActive,
            ]}
          >
            <Star
              size={14}
              color={isFatimahMode ? '#FFF' : 'rgba(255, 191, 0, 0.9)'}
              fill={isFatimahMode ? '#FFF' : 'rgba(255, 191, 0, 0.9)'}
              strokeWidth={2}
            />
            <Text style={[
              styles.fatimahText,
              isFatimahMode && styles.fatimahTextActive,
            ]}>
              {isFatimahMode
                ? `${fatimahPhase + 1}/3  ${currentFatimahPhase.arabic}`
                : 'Tasbih Fatimah'}
            </Text>
          </TouchableOpacity>

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

          {/* Target selector pills (hidden in Fatimah mode) */}
          {!isFatimahMode && (
            <View style={styles.targetRow}>
              {TARGET_OPTIONS.map((val) => {
                const isActive = target === val;
                const label = val === Infinity ? '\u221E' : String(val);
                return (
                  <TouchableOpacity
                    key={label}
                    activeOpacity={0.7}
                    onPress={() => handleTargetSelect(val)}
                    style={[
                      styles.targetPill,
                      isActive && styles.targetPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.targetPillText,
                        isActive && styles.targetPillTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Reset button */}
          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.7}
            disabled={sessionCount === 0}
            style={[styles.resetButton, { opacity: sessionCount === 0 ? 0.3 : 1 }]}
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  presetButton: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(255, 0, 131, 0.15)',
    borderColor: '#FF0083',
  },
  presetText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  presetTextActive: {
    color: '#FF0083',
    fontWeight: FontWeight.semibold,
  },

  // Target selector
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  targetPill: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  targetPillActive: {
    backgroundColor: 'rgba(255, 0, 131, 0.15)',
    borderColor: '#FF0083',
  },
  targetPillText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  targetPillTextActive: {
    color: '#FF0083',
    fontWeight: FontWeight.semibold,
  },

  // Fatimah button
  fatimahButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 191, 0, 0.4)',
    backgroundColor: 'rgba(255, 191, 0, 0.08)',
    marginBottom: Spacing.sm,
    minWidth: 180,
  },
  fatimahButtonActive: {
    backgroundColor: 'rgba(255, 191, 0, 0.25)',
    borderColor: 'rgba(255, 191, 0, 0.7)',
  },
  fatimahText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.semibold,
    color: 'rgba(255, 191, 0, 0.9)',
  },
  fatimahTextActive: {
    color: '#FFFFFF',
  },

  // Phase indicator
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  phaseDotActive: {
    backgroundColor: 'rgba(255, 191, 0, 0.9)',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  phaseDotCompleted: {
    backgroundColor: 'rgba(255, 191, 0, 0.5)',
  },
  phaseText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 4,
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
