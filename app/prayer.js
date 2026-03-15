import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions,
  ActivityIndicator, Pressable, ImageBackground, AppState, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import {
  MapPin, Sun, Sunrise, Sunset, Moon, Cloud, Clock, Check,
} from 'lucide-react-native';

import { Spacing, FontSize, FontWeight, BorderRadius, Gradients, Images } from '../constants/theme';
import { useApp } from '../constants/AppContext';
import { getPrayerTimes, getNextPrayer, getCurrentPrayer, formatTime, getCountdown } from '../utils/prayer';
import { formatHijriDate } from '../utils/hijri';
import { getPrayerLog, togglePrayerCompleted } from '../utils/storage';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.28;
const GRID_GAP = 10;
const GRID_PADDING = Spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * 2) / 3;

const PRAYER_ICONS = {
  Fajr: Sunrise, Sunrise: Sun, Dhuhr: Sun,
  Asr: Cloud, Maghrib: Sunset, Isha: Moon, Qiyam: Moon,
};

const PRAYER_KEYS = {
  Fajr: 'fajr', Sunrise: 'sunrise', Dhuhr: 'dhuhr',
  Asr: 'asr', Maghrib: 'maghrib', Isha: 'isha', Qiyam: 'qiyam',
};

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Qiyam'];

export default function PrayerScreen() {
  const { colors, shadows, isDark, t, isRTL } = useApp();

  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState('--');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [countdown, setCountdown] = useState({ text: '--:--' });
  const [hijriDate, setHijriDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [prayerLog, setPrayerLog] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const gridAnims = useRef(PRAYER_ORDER.map(() => new Animated.Value(0))).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { if (mounted) { setHijriDate(formatHijriDate()); setLoading(false); } return; }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        try {
          const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (geo && mounted) setCityName(geo.city || geo.subregion || geo.region || 'Unknown');
        } catch { if (mounted) setCityName('--'); }
        const times = getPrayerTimes(latitude, longitude);
        if (!mounted) return;
        setPrayerTimes(times);
        setNextPrayer(getNextPrayer(times));
        setCurrentPrayer(getCurrentPrayer(times));
        setHijriDate(formatHijriDate());
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        Animated.stagger(80, gridAnims.map(a => Animated.spring(a, { toValue: 1, friction: 8, tension: 50, useNativeDriver: true }))).start();
      } catch { if (mounted) { setHijriDate(formatHijriDate()); setLoading(false); } }
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

  useEffect(() => { if (nextPrayer) setCountdown(getCountdown(nextPrayer.time)); }, [nextPrayer]);

  // Load prayer completion log
  useEffect(() => {
    getPrayerLog().then(setPrayerLog);
  }, []);

  async function handlePrayerToggle(prayerName) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrayerLog(await togglePrayerCompleted(prayerName));
  }

  if (loading) {
    return <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.accent} /></View>;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  const rowDir = isRTL ? 'row-reverse' : 'row';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={{ opacity: fadeAnim }}>
        {/* Hero Header */}
        <ImageBackground source={Images.mosqueSilhouette} style={styles.heroHeader} resizeMode="cover">
          <LinearGradient colors={Gradients.heroMaskDark} style={styles.heroGradient}>
            <SafeAreaView edges={['top']} style={styles.heroInner}>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroTitle}>{t('prayer_times')}</Text>
                <View style={[styles.locationRow, { flexDirection: rowDir }]}>
                  <MapPin size={14} color={colors.gold} strokeWidth={2} />
                  <Text style={styles.locationText}>{cityName}</Text>
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        {/* Next Prayer Card */}
        {nextPrayer && (
          <View style={[styles.nextPrayerCard, shadows.depth3d]}>
            <LinearGradient colors={isDark ? Gradients.prayerCardDark : Gradients.prayerCard} style={styles.nextPrayerGradient}>
              <View style={styles.nextPrayerInner}>
                <Text style={styles.nextPrayerLabel}>{t('next_prayer')}</Text>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                <View style={[styles.nextPrayerTimeRow, { flexDirection: rowDir }]}>
                  <Clock size={16} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                  <Text style={styles.nextPrayerTime}>{formatTime(nextPrayer.time)}</Text>
                </View>
                <View style={styles.countdownPill}>
                  <Text style={styles.countdownText}>{countdown.text}</Text>
                </View>
              </View>
              <View style={styles.decorCircle1} />
              <View style={styles.decorCircle2} />
            </LinearGradient>
          </View>
        )}

        {/* Date Banner */}
        <View style={styles.dateBanner}>
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>{dateStr}</Text>
          {hijriDate ? <Text style={[styles.hijriText, { color: colors.gold }]}>{hijriDate}</Text> : null}
        </View>

        {/* Prayer Times Grid */}
        <View style={styles.prayerGrid}>
          {PRAYER_ORDER.map((name, idx) => {
            if (!prayerTimes) return null;
            const key = PRAYER_KEYS[name];
            const time = prayerTimes[key];
            const Icon = PRAYER_ICONS[name] || Clock;
            const isCurrent = currentPrayer?.name === name;
            const isCompleted = !!prayerLog[name];

            return (
              <Animated.View
                key={name}
                style={[
                  {
                    width: CARD_WIDTH,
                    opacity: gridAnims[idx],
                    transform: [{
                      translateY: gridAnims[idx].interpolate({
                        inputRange: [0, 1],
                        outputRange: [24, 0],
                      }),
                    }],
                  },
                ]}
              >
                <Pressable
                  onLongPress={() => handlePrayerToggle(name)}
                  delayLongPress={300}
                  style={({ pressed }) => [
                    styles.gridCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isCurrent ? colors.accent : colors.surfaceBorder,
                      borderWidth: isCurrent ? 2 : 1,
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                    shadows.card,
                  ]}
                >
                  <View style={styles.gridCardHeader}>
                    <Text
                      style={[
                        styles.gridPrayerName,
                        { color: isCurrent ? colors.accent : colors.textPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {t(key)}
                    </Text>
                    <Icon
                      size={16}
                      color={isCurrent ? colors.accent : colors.textTertiary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text
                    style={[
                      styles.gridPrayerTime,
                      { color: isCurrent ? colors.accent : colors.textSecondary },
                    ]}
                  >
                    {formatTime(time)}
                  </Text>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Prayer Completion Summary */}
        <View style={styles.completionSummary}>
          <Text style={[styles.completionText, { color: colors.textTertiary }]}>
            {Object.values(prayerLog).filter(Boolean).length}/5 {t('prayers_today')}
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 100 },

  heroHeader: { height: HEADER_HEIGHT, width: '100%' },
  heroGradient: { flex: 1, justifyContent: 'flex-end' },
  heroInner: { flex: 1, justifyContent: 'flex-end' },
  heroTextBlock: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  heroTitle: { fontSize: FontSize.h1, fontWeight: FontWeight.bold, color: '#FFFFFF', letterSpacing: -0.5 },
  locationRow: { alignItems: 'center', gap: 6, marginTop: 6 },
  locationText: { fontSize: FontSize.bodySmall, color: 'rgba(255,255,255,0.7)', fontWeight: FontWeight.medium },

  nextPrayerCard: { marginHorizontal: Spacing.md, marginTop: -28, borderRadius: BorderRadius.xl, overflow: 'hidden' },
  nextPrayerGradient: { padding: Spacing.lg, overflow: 'hidden' },
  nextPrayerInner: { position: 'relative', zIndex: 1 },
  nextPrayerLabel: { fontSize: 10, fontWeight: FontWeight.bold, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  nextPrayerName: { fontSize: 36, fontWeight: FontWeight.bold, color: '#FFFFFF', marginTop: 4, letterSpacing: -0.5 },
  nextPrayerTimeRow: { alignItems: 'center', gap: 8, marginTop: Spacing.sm },
  nextPrayerTime: { fontSize: FontSize.h3, fontWeight: FontWeight.semibold, color: '#FFFFFF' },
  countdownPill: { alignSelf: 'flex-start', marginTop: Spacing.sm, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 6 },
  countdownText: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  decorCircle1: { position: 'absolute', top: -32, right: -32, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.05)' },
  decorCircle2: { position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(0,0,0,0.1)' },

  dateBanner: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  dateText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold },
  hijriText: { fontSize: FontSize.caption, marginTop: 2 },

  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    gap: GRID_GAP,
  },
  gridCard: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 12,
    position: 'relative',
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridPrayerName: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.bold,
    flexShrink: 1,
  },
  gridPrayerTime: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
  },
  completedBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionSummary: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: Spacing.sm,
    alignItems: 'center',
  },
  completionText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
  },
});
