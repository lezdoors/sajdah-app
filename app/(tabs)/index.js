import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions,
  ActivityIndicator, AppState, Pressable, Animated, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import {
  Bell, Clock, BookOpen, ChevronRight, Heart, Check,
  Flame, Star, CircleDot, Compass as CompassIcon, CalendarDays,
  Sun, Sunset, Moon, CloudSun, CloudMoon,
} from 'lucide-react-native';

import { Spacing, FontSize, FontWeight, BorderRadius, Images } from '../../constants/theme';
import { useApp } from '../../constants/AppContext';
import { getPrayerTimes, getNextPrayer, getCurrentPrayer, formatTime, getCountdown } from '../../utils/prayer';
import { formatHijriDate } from '../../utils/hijri';
import { getDailyAyah } from '../../data/ayahs';
import { getDailyHadith } from '../../data/hadith';
import { DUA_CATEGORIES } from '../../data/duas';
import { getDailyGoals, toggleGoal, getStreak, recordDay, getLastRead, getPrayerLog, togglePrayerCompleted } from '../../utils/storage';
import { SURAHS } from '../../data/surahs';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRAYER_ICONS = { Fajr: Sun, Sunrise: CloudSun, Dhuhr: Sun, Asr: Sunset, Maghrib: CloudMoon, Isha: Moon };
const SERVICE_CARD_W = (SCREEN_WIDTH - Spacing.md * 2 - 12) / 2;
const PRAYER_GRID_GAP = 10;
const PRAYER_CARD_W = (SCREEN_WIDTH - Spacing.md * 2 - PRAYER_GRID_GAP * 2) / 3;

function useStaggerAnim(delay) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors, shadows, isDark, t, isRTL } = useApp();

  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [countdown, setCountdown] = useState({ text: '--:--' });
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [dailyAyah] = useState(() => getDailyAyah());
  const [dailyHadith] = useState(() => getDailyHadith());
  const [hijriDate, setHijriDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState({});
  const [streak, setStreak] = useState({ count: 0, dates: [] });
  const [lastRead, setLastRead] = useState(null);
  const [prayerLog, setPrayerLog] = useState({});
  const ringAnim = useRef(new Animated.Value(0)).current;

  const headerStyle = useStaggerAnim(0);
  const prayerRowStyle = useStaggerAnim(100);
  const heroStyle = useStaggerAnim(200);
  const servicesStyle = useStaggerAnim(300);
  const goalsStyle = useStaggerAnim(400);
  const contentStyle = useStaggerAnim(500);

  const intervalRef = useRef(null);

  useEffect(() => {
    async function loadUserData() {
      const [g, s, lr, pl] = await Promise.all([getDailyGoals(), getStreak(), getLastRead(), getPrayerLog()]);
      setGoals(g); setStreak(s); setLastRead(lr); setPrayerLog(pl);
      await recordDay();
      setStreak(await getStreak());
    }
    loadUserData();
  }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (mounted) { setHijriDate(formatHijriDate()); setLoading(false); }
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        const times = getPrayerTimes(latitude, longitude);
        if (!mounted) return;
        setPrayerTimes(times);
        const next = getNextPrayer(times);
        setNextPrayer(next);
        setCurrentPrayer(getCurrentPrayer(times));
        setCountdown(next ? getCountdown(next.time) : { text: '--:--' });
        setHijriDate(formatHijriDate());
        setLoading(false);
      } catch {
        if (mounted) { setHijriDate(formatHijriDate()); setLoading(false); }
      }
    }
    init();
    intervalRef.current = setInterval(() => {
      if (prayerTimes) {
        const next = getNextPrayer(prayerTimes);
        setNextPrayer(next);
        setCurrentPrayer(getCurrentPrayer(prayerTimes));
        if (next) setCountdown(getCountdown(next.time));
      }
    }, 30000);
    return () => { mounted = false; if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && prayerTimes) {
        const next = getNextPrayer(prayerTimes);
        setNextPrayer(next);
        setCurrentPrayer(getCurrentPrayer(prayerTimes));
        if (next) setCountdown(getCountdown(next.time));
      }
    });
    return () => sub.remove();
  }, [prayerTimes]);

  // Animate ring progress whenever prayer times change
  useEffect(() => {
    if (!prayerTimes || !nextPrayer || !currentPrayer) return;
    const now = new Date();
    const prevTime = currentPrayer.time.getTime();
    const nextTime = nextPrayer.time.getTime();
    const totalDuration = nextTime - prevTime;
    const elapsed = now.getTime() - prevTime;
    const progress = totalDuration > 0 ? Math.max(0, Math.min(1, elapsed / totalDuration)) : 0;
    Animated.timing(ringAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [prayerTimes, nextPrayer, currentPrayer, countdown]);

  async function handleToggleGoal(goalId) {
    setGoals(await toggleGoal(goalId));
  }

  async function handleTogglePrayer(prayerName) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrayerLog(await togglePrayerCompleted(prayerName));
  }

  if (loading) {
    return <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.accent} /></View>;
  }

  const today = new Date();
  const hour = today.getHours();
  const greetingKey = hour < 12 ? 'greeting_morning' : hour < 17 ? 'greeting_afternoon' : 'greeting_evening';
  const rowDir = isRTL ? 'row-reverse' : 'row';

  // Prayer times 3x2 grid (6 prayers including Sunrise)
  const prayerList = prayerTimes
    ? ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(name => ({
        name,
        time: formatTime(prayerTimes[name.toLowerCase()] || prayerTimes[name]),
        active: currentPrayer?.name === name,
        next: nextPrayer?.name === name,
        Icon: PRAYER_ICONS[name] || Sun,
      }))
    : [];

  // Ring SVG dimensions
  const RING_SIZE = 120;
  const RING_STROKE = 5;
  const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const ringStrokeDashoffset = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [RING_CIRCUMFERENCE, 0],
  });

  // Prayer completion count (exclude Sunrise from count, only 5 obligatory)
  const obligatoryPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const completedPrayers = obligatoryPrayers.filter(name => !!prayerLog[name]).length;

  const lastReadSurah = lastRead ? SURAHS.find(s => s.number === lastRead.surahNumber) : null;

  const services = [
    { title: t('feature_names'), icon: Star, route: '/names', image: Images.heroMacca },
    { title: t('feature_tasbih'), icon: CircleDot, route: '/tasbih', image: Images.heroOrange },
    { title: t('feature_qibla'), icon: CompassIcon, route: '/qibla', image: Images.heroWhite },
    { title: t('feature_calendar'), icon: CalendarDays, route: '/calendar', image: Images.heroPink },
  ];

  const completedGoals = Object.values(goals).filter(Boolean).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Header ── */}
          <Animated.View style={headerStyle}>
            <View style={[styles.header, { flexDirection: rowDir }]}>
              <View>
                <Text style={[styles.greeting, { color: colors.textPrimary }]}>{t(greetingKey)}</Text>
                <Text style={[styles.hijri, { color: colors.textTertiary }]}>{hijriDate}</Text>
              </View>
              <View style={[styles.headerRight, { flexDirection: rowDir }]}>
                {streak.count > 0 && (
                  <View style={[styles.streakBadge, { backgroundColor: colors.goldLight }]}>
                    <Flame size={14} color={colors.gold} />
                    <Text style={[styles.streakBadgeText, { color: colors.gold }]}>{streak.count}</Text>
                  </View>
                )}
                <Pressable style={[styles.bellBtn, { backgroundColor: colors.surfaceElevated }]}>
                  <Bell size={20} color={colors.textPrimary} strokeWidth={1.5} />
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* ── Circular Countdown Ring ── */}
          {nextPrayer && (
            <Animated.View style={prayerRowStyle}>
              <Pressable
                style={[styles.countdownRingCard, { backgroundColor: colors.surfaceElevated }]}
                onPress={() => router.push('/prayer')}
              >
                <View style={styles.countdownRingWrapper}>
                  <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
                    {/* Track (background ring) */}
                    <Circle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_RADIUS}
                      stroke={colors.surfaceBorder}
                      strokeWidth={RING_STROKE}
                      fill="transparent"
                    />
                    {/* Progress ring */}
                    <AnimatedCircle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_RADIUS}
                      stroke={colors.accent}
                      strokeWidth={RING_STROKE}
                      fill="transparent"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={ringStrokeDashoffset}
                      strokeLinecap="round"
                    />
                  </Svg>
                  {/* Center text overlay */}
                  <View style={styles.countdownRingCenter}>
                    <Text style={[styles.countdownPrayerName, { color: colors.textPrimary }]}>
                      {nextPrayer.name}
                    </Text>
                    <Text style={[styles.countdownTime, { color: colors.accent }]}>
                      {countdown.text}
                    </Text>
                    <Text style={[styles.countdownLabel, { color: colors.textTertiary }]}>
                      remaining
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          )}

          {/* ── Prayer Times Grid (3x2) ── */}
          <Animated.View style={heroStyle}>
            <View style={styles.prayerGridSection}>
              <View style={styles.prayerGrid}>
                {prayerList.map((p) => {
                  const isObligatory = obligatoryPrayers.includes(p.name);
                  const isCompleted = isObligatory && !!prayerLog[p.name];
                  const now = new Date();
                  const prayerRawTime = prayerTimes?.[p.name.toLowerCase()] || prayerTimes?.[p.name];
                  const hasPassed = prayerRawTime && now >= prayerRawTime;
                  return (
                    <Pressable
                      key={p.name}
                      style={[
                        styles.prayerCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: p.active ? colors.accent : colors.surfaceBorder,
                          borderWidth: p.active ? 2 : 1,
                        },
                      ]}
                      onPress={() => router.push('/prayer')}
                      onLongPress={isObligatory ? () => handleTogglePrayer(p.name) : undefined}
                    >
                      <View style={styles.prayerCardHeader}>
                        <Text style={[styles.prayerCardName, { color: p.active ? colors.accent : colors.textPrimary }]}>
                          {p.name}
                        </Text>
                        <p.Icon size={18} color={p.active ? colors.accent : colors.textTertiary} strokeWidth={1.5} />
                      </View>
                      <Text style={[styles.prayerCardTime, { color: p.active ? colors.textPrimary : colors.textSecondary }]}>
                        {p.time}
                      </Text>
                      {/* Check-in indicator */}
                      {isObligatory && isCompleted && (
                        <View style={[styles.checkIndicator, { backgroundColor: colors.success }]}>
                          <Check size={10} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                      {isObligatory && !isCompleted && hasPassed && (
                        <View style={[styles.checkIndicatorEmpty, { borderColor: colors.textTertiary }]} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
              {/* Prayer completion summary */}
              <Text style={[styles.prayerSummary, { color: colors.textTertiary }]}>
                {completedPrayers}/5 prayers today
              </Text>
            </View>
          </Animated.View>

          {/* ── Hero Image ── */}
          <Animated.View style={servicesStyle}>
            <Pressable style={styles.heroPadding} onPress={() => router.push('/prayer')}>
              <ImageBackground source={Images.heroYellow} style={styles.heroBanner} imageStyle={styles.heroBannerImage}>
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>{currentPrayer?.name || 'Prayer Times'}</Text>
                  <Text style={styles.heroSubtitle}>Tap to view all prayer times</Text>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          </Animated.View>

          {/* ── Services Grid ── */}
          <Animated.View style={servicesStyle}>
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { flexDirection: rowDir }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Services</Text>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[styles.viewAll, { color: colors.textTertiary }]}>View all</Text>
                </Pressable>
              </View>
              <View style={styles.servicesGrid}>
                {services.map((svc, i) => (
                  <Pressable key={i} onPress={() => router.push(svc.route)} style={({ pressed }) => [styles.serviceCard, { opacity: pressed ? 0.85 : 1 }]}>
                    <ImageBackground source={svc.image} style={styles.serviceCardBg} imageStyle={styles.serviceCardImage}>
                      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.serviceCardOverlay}>
                        <svc.icon size={20} color="#FFFFFF" strokeWidth={1.5} />
                        <Text style={styles.serviceCardTitle}>{svc.title}</Text>
                      </LinearGradient>
                    </ImageBackground>
                  </Pressable>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* ── Daily Goals ── */}
          <Animated.View style={goalsStyle}>
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { flexDirection: rowDir }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('daily_goals')}</Text>
                <Text style={[styles.viewAll, { color: colors.textTertiary }]}>{completedGoals}/8</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.goalsScroll}>
                {[
                  { id: 'fajr', label: t('goal_fajr') }, { id: 'quran', label: t('goal_quran') },
                  { id: 'dhikr', label: t('goal_dhikr') }, { id: 'dhuhr', label: t('goal_dhuhr') },
                  { id: 'charity', label: t('goal_charity') }, { id: 'asr', label: t('goal_asr') },
                  { id: 'maghrib', label: t('goal_maghrib') }, { id: 'isha', label: t('goal_isha') },
                ].map((g) => {
                  const done = !!goals[g.id];
                  return (
                    <Pressable key={g.id} style={[styles.goalChip, { backgroundColor: done ? colors.accent : colors.surfaceElevated }]} onPress={() => handleToggleGoal(g.id)}>
                      <Text style={[styles.goalChipText, { color: done ? '#FFFFFF' : colors.textSecondary }]}>{g.label}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </Animated.View>

          {/* ── Continue Reading ── */}
          {lastRead && lastReadSurah && (
            <Animated.View style={contentStyle}>
              <View style={styles.section}>
                <Pressable style={[styles.continueCard, { backgroundColor: colors.surfaceElevated }]} onPress={() => router.push('/(tabs)/quran')}>
                  <View style={[styles.continueRow, { flexDirection: rowDir }]}>
                    <BookOpen size={18} color={colors.accent} strokeWidth={1.5} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.continueLabel, { color: colors.textTertiary }]}>{t('continue_reading')}</Text>
                      <Text style={[styles.continueSurah, { color: colors.textPrimary }]}>{lastReadSurah.name} - Ayah {lastRead.ayahNumber}</Text>
                    </View>
                    <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.5} />
                  </View>
                </Pressable>
              </View>
            </Animated.View>
          )}

          {/* ── Daily Ayah ── */}
          {dailyAyah && (
            <Animated.View style={contentStyle}>
              <View style={styles.section}>
                <View style={[styles.sectionHeader, { flexDirection: rowDir }]}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('daily_ayah')}</Text>
                </View>
                <View style={[styles.contentCard, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.arabicText, { color: colors.textPrimary }]}>{dailyAyah.arabic}</Text>
                  <Text style={[styles.translationText, { color: colors.textSecondary }]}>{dailyAyah.english}</Text>
                  <Text style={[styles.sourceText, { color: colors.accent }]}>
                    {dailyAyah.surahName ? `Surah ${dailyAyah.surahName} ${dailyAyah.surahNumber}:${dailyAyah.number}` : 'Al-Quran'}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* ── Daily Hadith ── */}
          {dailyHadith && (
            <Animated.View style={contentStyle}>
              <View style={styles.section}>
                <View style={[styles.sectionHeader, { flexDirection: rowDir }]}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('daily_hadith')}</Text>
                </View>
                <View style={[styles.contentCard, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.arabicTextSmall, { color: colors.textPrimary }]}>{dailyHadith.arabic}</Text>
                  <Text style={[styles.translationText, { color: colors.textSecondary }]}>{dailyHadith.english}</Text>
                  <Text style={[styles.sourceText, { color: colors.textTertiary }]}>{dailyHadith.narrator} -- {dailyHadith.source}</Text>
                </View>
              </View>
            </Animated.View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 100 },

  // Header
  header: { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.xs },
  greeting: { fontSize: FontSize.h2, fontWeight: FontWeight.bold, letterSpacing: -0.5 },
  hijri: { fontSize: FontSize.caption, marginTop: 2 },
  headerRight: { alignItems: 'center', gap: Spacing.xs },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },
  streakBadgeText: { fontSize: FontSize.caption, fontWeight: FontWeight.bold },
  bellBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  // Circular Countdown Ring
  countdownRingCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  countdownRingWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownRingCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownPrayerName: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  countdownTime: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
  },
  countdownLabel: {
    fontSize: FontSize.caption,
    marginTop: 1,
  },

  // Prayer Grid (3x2)
  prayerGridSection: { paddingHorizontal: Spacing.md, marginTop: Spacing.sm },
  prayerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: PRAYER_GRID_GAP },
  prayerCard: { width: PRAYER_CARD_W, borderRadius: BorderRadius.md, padding: 12, gap: 4 },
  prayerCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prayerCardName: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.bold },
  prayerCardTime: { fontSize: FontSize.h3, fontWeight: FontWeight.semibold, marginTop: 2 },
  checkIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIndicatorEmpty: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  prayerSummary: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Hero Banner
  heroPadding: { paddingHorizontal: Spacing.md, marginTop: Spacing.lg },
  heroBanner: { height: 140, borderRadius: BorderRadius.lg, overflow: 'hidden' },
  heroBannerImage: { borderRadius: BorderRadius.lg },
  heroOverlay: { flex: 1, justifyContent: 'flex-end', padding: Spacing.md },
  heroTitle: { fontSize: FontSize.h2, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  heroSubtitle: { fontSize: FontSize.caption, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Section
  section: { marginTop: Spacing.lg, paddingHorizontal: Spacing.md },
  sectionHeader: { justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.h3, fontWeight: FontWeight.bold },
  viewAll: { fontSize: FontSize.caption, fontWeight: FontWeight.medium },

  // Services Grid
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceCard: { width: SERVICE_CARD_W, height: 100, borderRadius: BorderRadius.md, overflow: 'hidden' },
  serviceCardBg: { flex: 1 },
  serviceCardImage: { borderRadius: BorderRadius.md },
  serviceCardOverlay: { flex: 1, justifyContent: 'flex-end', padding: 12, gap: 4 },
  serviceCardTitle: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.bold, color: '#FFFFFF' },

  // Goals
  goalsScroll: { gap: 8 },
  goalChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.full },
  goalChipText: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.semibold },

  // Continue Reading
  continueCard: { borderRadius: BorderRadius.md, padding: Spacing.md },
  continueRow: { alignItems: 'center', gap: Spacing.sm },
  continueLabel: { fontSize: FontSize.caption },
  continueSurah: { fontSize: FontSize.body, fontWeight: FontWeight.semibold },

  // Content Cards (Ayah, Hadith)
  contentCard: { borderRadius: BorderRadius.md, padding: Spacing.md },
  arabicText: { fontSize: 22, textAlign: 'right', lineHeight: 40, marginBottom: Spacing.sm },
  arabicTextSmall: { fontSize: 20, textAlign: 'right', lineHeight: 36, marginBottom: Spacing.sm },
  translationText: { fontSize: FontSize.body, lineHeight: 24, marginBottom: Spacing.xs },
  sourceText: { fontSize: FontSize.caption, fontWeight: FontWeight.semibold, marginTop: Spacing.xs },
});
