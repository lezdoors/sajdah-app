import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Switch, Linking,
  Animated, Alert, Share, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Flame, Target, Bookmark, Calculator, MapPin, Bell, Moon, Sun, BookOpen,
  Smartphone, Globe, Star, Shield, Info, ChevronRight, Check, Share2, Volume2, Play, Square, VolumeX,
} from 'lucide-react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Audio, Video, ResizeMode } from 'expo-av';

import { Spacing, FontSize, FontWeight, BorderRadius, HeroGradients, Images } from '../../constants/theme';
import { useApp } from '../../constants/AppContext';
import { getAvailableMethods } from '../../utils/prayer';
import { getStreak, getDailyGoals, toggleGoal, getBookmarks, getPrayerStats } from '../../utils/storage';
import { refreshNotificationSounds, scheduleSpecialReminders, cancelSpecialReminders } from '../../utils/notifications';
import { getNotificationSettings, setNotificationSettings, getPrayerAdhanSounds, setPrayerAdhanSound } from '../../utils/storage';
import { scheduleDailyReminders } from '../../utils/notifications';

const CALC_METHOD_KEY = 'sajdah_calc_method';
const NOTIF_KEY = 'sajdah_notifications';
const ADHAN_SOUND_KEY = 'sajdah_adhan_sound';

const ADHAN_SOUNDS = [
  { id: 'default', labelKey: 'adhan_default', file: require('../../assets/audio/adhan-default.mp3') },
  { id: 'makkah', labelKey: 'adhan_makkah', file: require('../../assets/audio/adhan-makkah.mp3') },
  { id: 'madinah', labelKey: 'adhan_madinah', file: require('../../assets/audio/adhan-madinah.mp3') },
  { id: 'alaqsa', labelKey: 'adhan_alaqsa', file: require('../../assets/audio/adhan-alaqsa.mp3') },
  { id: 'alafasy', labelKey: 'adhan_alafasy', file: require('../../assets/audio/adhan-alafasy.mp3') },
  { id: 'alafasy2', labelKey: 'adhan_alafasy2', file: require('../../assets/audio/adhan-alafasy2.mp3') },
  { id: 'silent', labelKey: 'adhan_silent', file: null },
];

const appVersion = Constants.expoConfig?.version || '1.0.0';

const GOAL_ITEMS = [
  { id: 'fajr', labelKey: 'goal_fajr' },
  { id: 'quran', labelKey: 'goal_quran' },
  { id: 'dhikr', labelKey: 'goal_dhikr' },
  { id: 'dhuhr', labelKey: 'goal_dhuhr' },
  { id: 'charity', labelKey: 'goal_charity' },
  { id: 'asr', labelKey: 'goal_asr' },
  { id: 'maghrib', labelKey: 'goal_maghrib' },
  { id: 'isha', labelKey: 'goal_isha' },
];

// Number of animated sections
const SECTION_COUNT = 6;

export default function YouScreen() {
  const router = useRouter();
  const { colors, shadows, isDark, themeMode, setTheme, locale, setLocale, t, isRTL } = useApp();

  const [streak, setStreak] = useState({ count: 0, dates: [] });
  const [goals, setGoals] = useState({});
  const [bookmarks, setBookmarksList] = useState([]);
  const [calcMethod, setCalcMethod] = useState('ISNA');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [prayerStats, setPrayerStats] = useState({ totalPrayed: 0, daysTracked: 0, completeDays: 0 });
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [adhanSound, setAdhanSound] = useState('default');
  const [showAdhanPicker, setShowAdhanPicker] = useState(false);
  const [qiyamReminder, setQiyamReminder] = useState(false);
  const [fridayKahfReminder, setFridayKahfReminder] = useState(false);
  const [preReminderEnabled, setPreReminderEnabled] = useState(true);
  const [dailyHadithEnabled, setDailyHadithEnabled] = useState(true);
  const [dailyRemindersEnabled, setDailyRemindersEnabled] = useState(true);
  const [showPerPrayerSounds, setShowPerPrayerSounds] = useState(false);
  const [perPrayerSounds, setPerPrayerSounds] = useState(null);
  const [editingPrayerSound, setEditingPrayerSound] = useState(null);
  const [previewingId, setPreviewingId] = useState(null);
  const previewSoundRef = useRef(null);
  const methods = getAvailableMethods();

  const rowDir = isRTL ? 'row-reverse' : 'row';
  const textAlign = isRTL ? 'right' : 'left';

  const getMethodLabel = (method) => t(`calc_method_${method.toLowerCase()}`) || method;
  const getMethodLongLabel = (method) => t(`calc_method_long_${method.toLowerCase()}`) || getMethodLabel(method);

  // Staggered entrance animations
  const sectionAnims = useRef(
    Array.from({ length: SECTION_COUNT }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = sectionAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, []);

  // Hero entrance animation
  const heroAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Scale animation for active streak dots
  const dotScaleAnims = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(1))
  ).current;

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [streakData, goalsData, bookmarksData, statsData] = await Promise.all([
      getStreak(),
      getDailyGoals(),
      getBookmarks(),
      getPrayerStats(),
    ]);
    setStreak(streakData);
    setGoals(goalsData);
    setBookmarksList(bookmarksData);
    setPrayerStats(statsData);

    const savedMethod = await AsyncStorage.getItem(CALC_METHOD_KEY);
    if (savedMethod) setCalcMethod(savedMethod);

    const savedNotif = await AsyncStorage.getItem(NOTIF_KEY);
    if (savedNotif !== null) setNotificationsEnabled(savedNotif === 'true');

    const savedAdhan = await AsyncStorage.getItem(ADHAN_SOUND_KEY);
    if (savedAdhan) setAdhanSound(savedAdhan);

    const notifSettings = await getNotificationSettings();
    setQiyamReminder(!!notifSettings.qiyam);
    setFridayKahfReminder(!!notifSettings.friday_kahf);
    setPreReminderEnabled(notifSettings.pre_reminder !== false);
    setDailyHadithEnabled(notifSettings.daily_hadith !== false);
    setDailyRemindersEnabled(notifSettings.daily_reminders !== false);

    const pps = await getPrayerAdhanSounds();
    setPerPrayerSounds(pps);
  }

  // Animate active dots after streak loads
  useEffect(() => {
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(d.toISOString().split('T')[0]);
    }
    last7.forEach((date, index) => {
      if (streak.dates.includes(date)) {
        Animated.sequence([
          Animated.delay(600 + index * 80),
          Animated.spring(dotScaleAnims[index], {
            toValue: 1.15,
            friction: 3,
            tension: 200,
            useNativeDriver: true,
          }),
          Animated.spring(dotScaleAnims[index], {
            toValue: 1,
            friction: 5,
            tension: 120,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }, [streak.dates]);

  // Goal checkbox bounce animations
  const goalScaleAnims = useRef(
    GOAL_ITEMS.reduce((acc, g) => { acc[g.id] = new Animated.Value(1); return acc; }, {})
  ).current;

  const handleGoalToggle = useCallback(async (goalId) => {
    const updated = await toggleGoal(goalId);
    setGoals(updated);
    // Bounce animation on the checkbox
    const anim = goalScaleAnims[goalId];
    if (anim) {
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.8, duration: 80, useNativeDriver: true }),
        Animated.spring(anim, { toValue: 1.1, friction: 3, tension: 200, useNativeDriver: true }),
        Animated.spring(anim, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      ]).start();
    }
  }, []);

  async function handleMethodChange(method) {
    setCalcMethod(method);
    await AsyncStorage.setItem(CALC_METHOD_KEY, method);
    setShowMethodPicker(false);
  }

  async function handleNotifToggle(value) {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem(NOTIF_KEY, String(value));
  }

  async function handleAdhanChange(soundId) {
    setAdhanSound(soundId);
    await AsyncStorage.setItem(ADHAN_SOUND_KEY, soundId);
    // Re-schedule notifications with the new sound
    try {
      const loc = await import('expo-location');
      const pos = await loc.getCurrentPositionAsync({ accuracy: loc.Accuracy?.High || 4 });
      await refreshNotificationSounds(pos.coords.latitude, pos.coords.longitude);
    } catch {}
  }

  async function handleReminderToggle(key, value) {
    const settings = await getNotificationSettings();
    settings[key] = value;
    await setNotificationSettings(settings);

    if (key === 'qiyam') setQiyamReminder(value);
    if (key === 'friday_kahf') setFridayKahfReminder(value);

    try {
      const loc = await import('expo-location');
      const pos = await loc.getCurrentPositionAsync({ accuracy: loc.Accuracy?.High || 4 });
      if (value) {
        await scheduleSpecialReminders(pos.coords.latitude, pos.coords.longitude);
      } else {
        await cancelSpecialReminders();
        // Re-schedule only active ones
        await scheduleSpecialReminders(pos.coords.latitude, pos.coords.longitude);
      }
    } catch {}
  }

  async function handlePerPrayerSoundChange(prayerKey, soundId) {
    const updated = await setPrayerAdhanSound(prayerKey, soundId);
    setPerPrayerSounds(updated);
    setEditingPrayerSound(null);
    // Re-schedule notifications with the new per-prayer sound
    try {
      const loc = await import('expo-location');
      const pos = await loc.getCurrentPositionAsync({ accuracy: loc.Accuracy?.High || 4 });
      await refreshNotificationSounds(pos.coords.latitude, pos.coords.longitude);
    } catch {}
  }

  async function handlePreview(soundId) {
    // Stop any playing preview
    if (previewSoundRef.current) {
      try { await previewSoundRef.current.stopAsync(); await previewSoundRef.current.unloadAsync(); } catch {}
      previewSoundRef.current = null;
    }
    // If tapping same sound that's previewing, just stop
    if (previewingId === soundId) {
      setPreviewingId(null);
      return;
    }
    const selected = ADHAN_SOUNDS.find((s) => s.id === soundId);
    if (!selected?.file) return;
    setPreviewingId(soundId);
    const { sound } = await Audio.Sound.createAsync(selected.file);
    previewSoundRef.current = sound;
    await sound.playAsync();
    // Stop after 8 seconds
    setTimeout(async () => {
      try { await sound.stopAsync(); await sound.unloadAsync(); } catch {}
      if (previewSoundRef.current === sound) previewSoundRef.current = null;
      setPreviewingId((curr) => curr === soundId ? null : curr);
    }, 8000);
    // Also stop when playback finishes naturally
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setPreviewingId((curr) => curr === soundId ? null : curr);
        sound.unloadAsync().catch(() => {});
        if (previewSoundRef.current === sound) previewSoundRef.current = null;
      }
    });
  }

  // Cleanup preview sound on unmount
  useEffect(() => {
    return () => {
      if (previewSoundRef.current) {
        previewSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Build last 7 days array for streak dots
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }
  const todayISO = new Date().toISOString().split('T')[0];

  const completedGoals = GOAL_ITEMS.filter((g) => goals[g.id]).length;

  // Helper: animated section wrapper
  function AnimatedSection({ index, children, style }) {
    const anim = sectionAnims[index];
    return (
      <Animated.View
        style={[
          style,
          {
            opacity: anim,
            transform: [{
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  }

  // --- Render helpers ---

  function renderSectionTitle(title, icon) {
    const Icon = icon;
    return (
      <View style={[styles.sectionTitleRow, { flexDirection: rowDir }]}>
        {Icon && <Icon size={16} color={colors.textTertiary} strokeWidth={1.5} />}
        <Text style={[styles.sectionTitle, { color: colors.textTertiary, textAlign }]}>{title}</Text>
      </View>
    );
  }

  function renderSettingsRow({ icon: Icon, label, value, onPress, rightElement, iconColor }) {
    return (
      <Pressable style={[styles.settingsRow, { flexDirection: rowDir }]} onPress={onPress}>
        <View style={[styles.settingsRowLeft, { flexDirection: rowDir }]}>
          <Icon size={18} color={iconColor || colors.textSecondary} strokeWidth={1.5} />
          <Text style={[styles.settingsRowLabel, { color: colors.textPrimary, textAlign }]}>{label}</Text>
        </View>
        <View style={[styles.settingsRowRight, { flexDirection: rowDir }]}>
          {value && <Text style={[styles.settingsRowValue, { color: colors.textTertiary }]}>{value}</Text>}
          {rightElement || <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.5} style={isRTL ? { transform: [{ scaleX: -1 }] } : {}} />}
        </View>
      </Pressable>
    );
  }

  const themeOptions = [
    { key: 'light', label: t('theme_light'), Icon: Sun },
    { key: 'dark', label: t('theme_dark'), Icon: Moon },
    { key: 'system', label: t('theme_system'), Icon: Smartphone },
  ];

  const langOptions = [
    { key: 'en', label: t('english') },
    { key: 'ar', label: t('arabic') },
    { key: 'fr', label: t('french') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* -- 1. Hero Profile Header -- */}
        <Animated.View style={{
          opacity: heroAnim,
          transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }}>
          <View style={styles.heroHeader}>
            <Video
              source={require('../../assets/videos/hero-settings.mp4')}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
            <LinearGradient
              colors={['transparent', colors.background]}
              locations={[0.4, 1]}
              style={styles.heroGradientOverlay}
            >
              <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
                <View style={styles.heroGradient}>
                  <View style={styles.heroContent}>
                    <Text style={styles.heroAppName}>{t('app_name')}</Text>
                    <Text style={styles.heroTagline}>{t('app_tagline')}</Text>
                  </View>
                </View>
              </SafeAreaView>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* -- 2. Streak Stats Card -- */}
        <AnimatedSection index={0} style={styles.sectionSpacing}>
          {renderSectionTitle(t('your_streak'), Flame)}
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            <View style={[styles.streakTopRow, { flexDirection: rowDir }]}>
              <View style={[styles.streakIconRow, { flexDirection: rowDir }]}>
                <View style={[styles.streakIconCircle, { backgroundColor: colors.goldLight }]}>
                  <Flame size={20} color={colors.gold} strokeWidth={1.5} />
                </View>
                <View>
                  <Text style={[styles.streakCount, { color: colors.textPrimary }]}>{streak.count}</Text>
                  <Text style={[styles.streakLabel, { color: colors.textTertiary }]}>{t('streak_days')}</Text>
                </View>
              </View>
            </View>
            <View style={styles.streakDotsContainer}>
              <View style={[styles.streakDotsRow, { flexDirection: rowDir }]}>
                {last7Days.map((date, index) => {
                  const isActive = streak.dates.includes(date);
                  const isToday = date === todayISO;
                  return (
                    <View key={date} style={styles.streakDotWrapper}>
                      <Animated.View style={{ transform: [{ scale: dotScaleAnims[index] }] }}>
                        <View style={[
                          styles.streakDot,
                          { backgroundColor: isActive ? colors.gold : colors.backgroundSecondary },
                          isToday && { borderWidth: 2, borderColor: colors.gold },
                        ]} />
                      </Animated.View>
                      <Text style={[styles.streakDayLabel, { color: isToday ? colors.textPrimary : colors.textTertiary }]}>
                        {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
            {/* Prayer Stats Row */}
            <View style={[styles.statsDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{prayerStats.totalPrayed}</Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{t('total_prayers')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{prayerStats.daysTracked}</Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{t('days_tracked')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{prayerStats.completeDays}</Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{t('complete_days')}</Text>
              </View>
            </View>
          </View>
        </AnimatedSection>

        {/* -- 3. Daily Goals Section -- */}
        <AnimatedSection index={1} style={styles.sectionSpacing}>
          {renderSectionTitle(`${t('your_goals')} (${completedGoals}/${GOAL_ITEMS.length})`, Target)}
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {GOAL_ITEMS.map((goal, index) => {
              const isDone = !!goals[goal.id];
              return (
                <View key={goal.id}>
                  {index > 0 && <View style={[styles.goalDivider, { backgroundColor: colors.divider }]} />}
                  <Pressable
                    style={[styles.goalRow, { flexDirection: rowDir }]}
                    onPress={() => handleGoalToggle(goal.id)}
                  >
                    <Text style={[
                      styles.goalLabel,
                      { color: isDone ? colors.textTertiary : colors.textPrimary, textAlign },
                      isDone && styles.goalLabelDone,
                    ]}>
                      {t(goal.labelKey)}
                    </Text>
                    <Animated.View style={{ transform: [{ scale: goalScaleAnims[goal.id] }] }}>
                      <View style={[
                        styles.goalCheckbox,
                        { borderColor: isDone ? colors.accent : colors.textTertiary },
                        isDone && { backgroundColor: colors.accent, borderColor: colors.accent },
                      ]}>
                        {isDone && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </Animated.View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </AnimatedSection>

        {/* -- 4. Bookmarks Section -- */}
        <AnimatedSection index={2} style={styles.sectionSpacing}>
          {renderSectionTitle(t('bookmarks_title'), Bookmark)}
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {bookmarks.length === 0 ? (
              <View style={styles.emptyState}>
                <Bookmark size={24} color={colors.textTertiary} strokeWidth={1.5} />
                <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>{t('no_bookmarks')}</Text>
              </View>
            ) : (
              bookmarks.slice(0, 10).map((bm, index) => (
                <View key={`${bm.type}-${bm.id}-${index}`}>
                  {index > 0 && <View style={[styles.goalDivider, { backgroundColor: colors.divider }]} />}
                  <View style={[styles.bookmarkRow, { flexDirection: rowDir }]}>
                    <View style={[styles.bookmarkBadge, { backgroundColor: colors.accentLight }]}>
                      <Text style={[styles.bookmarkBadgeText, { color: colors.accent }]}>
                        {t(`bookmark_${bm.type}`) || bm.type}
                      </Text>
                    </View>
                    <Text
                      style={[styles.bookmarkContent, { color: colors.textPrimary, textAlign }]}
                      numberOfLines={1}
                    >
                      {bm.title || bm.text || bm.name || `${bm.type} ${bm.id}`}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </AnimatedSection>

        {/* -- 5. Settings Section -- */}
        <AnimatedSection index={3} style={styles.sectionSpacing}>
          {renderSectionTitle(t('all_settings'))}
        </AnimatedSection>

        {/* 5a. Prayer Settings */}
        <AnimatedSection index={3} style={styles.settingsGroupSpacing}>
          <Text style={[styles.settingsGroupLabel, { color: colors.textTertiary, textAlign }]}>{t('prayer_section')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {renderSettingsRow({
              icon: Calculator,
              label: t('calc_method'),
              value: getMethodLabel(calcMethod),
              onPress: () => setShowMethodPicker(!showMethodPicker),
            })}
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            {renderSettingsRow({
              icon: MapPin,
              label: t('location'),
              value: t('automatic'),
              onPress: () => Linking.openSettings(),
              rightElement: <View />,
            })}
          </View>
        </AnimatedSection>

        {/* Method Picker */}
        {showMethodPicker && (
          <View style={[styles.methodPicker, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {methods.map((method) => (
              <Pressable
                key={method}
                style={[
                  styles.methodOption,
                  { borderBottomColor: colors.divider },
                  calcMethod === method && { backgroundColor: colors.accentLight },
                ]}
                onPress={() => handleMethodChange(method)}
              >
                <Text style={[
                  styles.methodOptionText,
                  { color: colors.textPrimary },
                  calcMethod === method && { color: colors.accent, fontWeight: FontWeight.semibold },
                ]}>
                  {getMethodLongLabel(method)}
                </Text>
                {calcMethod === method && (
                  <View style={[styles.methodCheck, { backgroundColor: colors.accent }]}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* 5b. Notifications */}
        <AnimatedSection index={4} style={styles.settingsGroupSpacing}>
          <Text style={[styles.settingsGroupLabel, { color: colors.textTertiary, textAlign }]}>{t('notifications_section')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {renderSettingsRow({
              icon: Bell,
              label: t('prayer_reminders'),
              onPress: () => handleNotifToggle(!notificationsEnabled),
              rightElement: (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotifToggle}
                  trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                  thumbColor="#FFFFFF"
                />
              ),
            })}
          </View>
        </AnimatedSection>

        {/* 5b2. Special Reminders */}
        <AnimatedSection index={4} style={styles.settingsGroupSpacing}>
          <Text style={[styles.settingsGroupLabel, { color: colors.textTertiary, textAlign }]}>{t('reminders_section')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            <View style={[styles.settingsRow, { flexDirection: rowDir }]}>
              <View style={[styles.settingsRowLeft, { flexDirection: rowDir }]}>
                <Moon size={18} color={colors.textSecondary} strokeWidth={1.5} />
                <View>
                  <Text style={[styles.settingsRowLabel, { color: colors.textPrimary, textAlign }]}>{t('qiyam_reminder')}</Text>
                  <Text style={[styles.reminderDesc, { color: colors.textTertiary, textAlign }]}>{t('qiyam_reminder_desc')}</Text>
                </View>
              </View>
              <Switch
                value={qiyamReminder}
                onValueChange={(v) => handleReminderToggle('qiyam', v)}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            <View style={[styles.settingsRow, { flexDirection: rowDir }]}>
              <View style={[styles.settingsRowLeft, { flexDirection: rowDir }]}>
                <BookOpen size={18} color={colors.textSecondary} strokeWidth={1.5} />
                <View>
                  <Text style={[styles.settingsRowLabel, { color: colors.textPrimary, textAlign }]}>{t('friday_kahf_reminder')}</Text>
                  <Text style={[styles.reminderDesc, { color: colors.textTertiary, textAlign }]}>{t('friday_kahf_reminder_desc')}</Text>
                </View>
              </View>
              <Switch
                value={fridayKahfReminder}
                onValueChange={(v) => handleReminderToggle('friday_kahf', v)}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            <View style={[styles.settingsRow, { flexDirection: rowDir }]}>
              <View style={[styles.settingsRowLeft, { flexDirection: rowDir }]}>
                <Bell size={18} color={colors.textSecondary} strokeWidth={1.5} />
                <View>
                  <Text style={[styles.settingsRowLabel, { color: colors.textPrimary, textAlign }]}>15-min Pre-Reminder</Text>
                  <Text style={[styles.reminderDesc, { color: colors.textTertiary, textAlign }]}>Gentle nudge before each prayer</Text>
                </View>
              </View>
              <Switch
                value={preReminderEnabled}
                onValueChange={(v) => { setPreReminderEnabled(v); handleReminderToggle('pre_reminder', v); }}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            <View style={[styles.settingsRow, { flexDirection: rowDir }]}>
              <View style={[styles.settingsRowLeft, { flexDirection: rowDir }]}>
                <BookOpen size={18} color={colors.textSecondary} strokeWidth={1.5} />
                <View>
                  <Text style={[styles.settingsRowLabel, { color: colors.textPrimary, textAlign }]}>Morning Hadith</Text>
                  <Text style={[styles.reminderDesc, { color: colors.textTertiary, textAlign }]}>Daily reflection at 7:30 AM</Text>
                </View>
              </View>
              <Switch
                value={dailyHadithEnabled}
                onValueChange={(v) => { setDailyHadithEnabled(v); handleReminderToggle('daily_hadith', v); }}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            <View style={[styles.settingsRow, { flexDirection: rowDir }]}>
              <View style={[styles.settingsRowLeft, { flexDirection: rowDir }]}>
                <Moon size={18} color={colors.textSecondary} strokeWidth={1.5} />
                <View>
                  <Text style={[styles.settingsRowLabel, { color: colors.textPrimary, textAlign }]}>Evening Adhkar</Text>
                  <Text style={[styles.reminderDesc, { color: colors.textTertiary, textAlign }]}>Dhikr reminder at 6:00 PM</Text>
                </View>
              </View>
              <Switch
                value={dailyRemindersEnabled}
                onValueChange={(v) => { setDailyRemindersEnabled(v); handleReminderToggle('daily_reminders', v); }}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </AnimatedSection>

        {/* 5b3. Adhan Sound */}
        <AnimatedSection index={4} style={styles.settingsGroupSpacing}>
          <Text style={[styles.settingsGroupLabel, { color: colors.textTertiary, textAlign }]}>{t('adhan_section')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {renderSettingsRow({
              icon: Volume2,
              label: t('adhan_sound'),
              value: t(ADHAN_SOUNDS.find((s) => s.id === adhanSound)?.labelKey || 'adhan_default'),
              onPress: () => setShowAdhanPicker(!showAdhanPicker),
            })}
          </View>
        </AnimatedSection>

        {/* Adhan Picker */}
        {showAdhanPicker && (
          <View style={[styles.methodPicker, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {ADHAN_SOUNDS.map((sound) => (
              <View
                key={sound.id}
                style={[
                  styles.methodOption,
                  { borderBottomColor: colors.divider },
                  adhanSound === sound.id && { backgroundColor: colors.accentLight },
                ]}
              >
                <Pressable
                  style={[styles.adhanOptionRow, { flexDirection: rowDir, flex: 1 }]}
                  onPress={() => handleAdhanChange(sound.id)}
                >
                  {sound.file ? (
                    <Volume2 size={14} color={adhanSound === sound.id ? colors.accent : colors.textTertiary} strokeWidth={2} />
                  ) : (
                    <VolumeX size={14} color={colors.textTertiary} strokeWidth={2} />
                  )}
                  <Text style={[
                    styles.methodOptionText,
                    { color: colors.textPrimary, flex: 1 },
                    adhanSound === sound.id && { color: colors.accent, fontWeight: FontWeight.semibold },
                  ]}>
                    {t(sound.labelKey)}
                  </Text>
                  {adhanSound === sound.id && (
                    <View style={[styles.methodCheck, { backgroundColor: colors.accent }]}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
                {sound.file && (
                  <Pressable
                    style={[styles.previewBtn, { backgroundColor: previewingId === sound.id ? colors.accent : colors.overlay }]}
                    onPress={() => handlePreview(sound.id)}
                    hitSlop={8}
                  >
                    {previewingId === sound.id ? (
                      <Square size={12} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
                    ) : (
                      <Play size={12} color={colors.accent} fill={colors.accent} strokeWidth={0} />
                    )}
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Per-Prayer Sound Customization */}
        <AnimatedSection index={4} style={styles.settingsGroupSpacing}>
          <Pressable onPress={() => setShowPerPrayerSounds(!showPerPrayerSounds)}>
            <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder, flexDirection: rowDir, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }, shadows.card]}>
              <Text style={[styles.settingsRowLabel, { color: colors.textPrimary }]}>Customize Per Prayer</Text>
              <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.5} style={{ transform: [{ rotate: showPerPrayerSounds ? '90deg' : '0deg' }] }} />
            </View>
          </Pressable>
        </AnimatedSection>

        {showPerPrayerSounds && (
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder, marginHorizontal: Spacing.md, marginTop: -Spacing.xs }, shadows.card]}>
            {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((pKey, idx) => {
              const currentSound = perPrayerSounds?.[pKey] || null;
              const soundLabel = currentSound ? (ADHAN_SOUNDS.find(s => s.id === currentSound)?.labelKey || 'adhan_default') : 'Global';
              const isEditing = editingPrayerSound === pKey;
              return (
                <View key={pKey}>
                  {idx > 0 && <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />}
                  <Pressable
                    style={[styles.settingsRow, { flexDirection: rowDir }]}
                    onPress={() => setEditingPrayerSound(isEditing ? null : pKey)}
                  >
                    <Text style={[styles.settingsRowLabel, { color: colors.textPrimary, textAlign, flex: 1 }]}>{t(pKey)}</Text>
                    <Text style={[styles.settingsRowValue, { color: currentSound ? colors.accent : colors.textTertiary }]}>
                      {currentSound ? t(soundLabel) : 'Global'}
                    </Text>
                  </Pressable>
                  {isEditing && (
                    <View style={{ paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm }}>
                      <Pressable
                        style={[styles.perPrayerOption, !currentSound && { backgroundColor: colors.accentLight }]}
                        onPress={() => handlePerPrayerSoundChange(pKey, 'global')}
                      >
                        <Text style={[styles.perPrayerOptionText, { color: !currentSound ? colors.accent : colors.textSecondary }]}>Use Global</Text>
                        {!currentSound && <Check size={14} color={colors.accent} strokeWidth={2} />}
                      </Pressable>
                      {ADHAN_SOUNDS.map((sound) => (
                        <Pressable
                          key={sound.id}
                          style={[styles.perPrayerOption, currentSound === sound.id && { backgroundColor: colors.accentLight }]}
                          onPress={() => handlePerPrayerSoundChange(pKey, sound.id)}
                        >
                          <Text style={[styles.perPrayerOptionText, { color: currentSound === sound.id ? colors.accent : colors.textPrimary }]}>
                            {t(sound.labelKey)}
                          </Text>
                          {currentSound === sound.id && <Check size={14} color={colors.accent} strokeWidth={2} />}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* 5c. Appearance */}
        <AnimatedSection index={4} style={styles.settingsGroupSpacing}>
          <Text style={[styles.settingsGroupLabel, { color: colors.textTertiary, textAlign }]}>{t('appearance_section')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            <View style={styles.segmentContainer}>
              <View style={[styles.segmentRow, { backgroundColor: colors.backgroundSecondary, flexDirection: rowDir }]}>
                {themeOptions.map((opt) => {
                  const isActive = themeMode === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      style={[
                        styles.segmentOption,
                        isActive && [styles.segmentOptionActive, { backgroundColor: colors.surfaceElevated }, shadows.soft],
                      ]}
                      onPress={() => setTheme(opt.key)}
                    >
                      <opt.Icon size={16} color={isActive ? colors.accent : colors.textTertiary} strokeWidth={1.5} />
                      <Text style={[
                        styles.segmentOptionText,
                        { color: isActive ? colors.accent : colors.textTertiary },
                        isActive && { fontWeight: FontWeight.semibold },
                      ]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </AnimatedSection>

        {/* 5d. Language */}
        <AnimatedSection index={5} style={styles.settingsGroupSpacing}>
          <Text style={[styles.settingsGroupLabel, { color: colors.textTertiary, textAlign }]}>{t('language_section')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            <View style={styles.segmentContainer}>
              <View style={[styles.segmentRow, { backgroundColor: colors.backgroundSecondary, flexDirection: rowDir }]}>
                {langOptions.map((opt) => {
                  const isActive = locale === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      style={[
                        styles.segmentOption,
                        isActive && [styles.segmentOptionActive, { backgroundColor: colors.surfaceElevated }, shadows.soft],
                      ]}
                      onPress={() => setLocale(opt.key)}
                    >
                      <Globe size={16} color={isActive ? colors.accent : colors.textTertiary} strokeWidth={1.5} />
                      <Text style={[
                        styles.segmentOptionText,
                        { color: isActive ? colors.accent : colors.textTertiary },
                        isActive && { fontWeight: FontWeight.semibold },
                      ]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </AnimatedSection>

        {/* 5e. About */}
        <AnimatedSection index={5} style={styles.settingsGroupSpacing}>
          <Text style={[styles.settingsGroupLabel, { color: colors.textTertiary, textAlign }]}>{t('about_section')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.cardBorder }, shadows.card]}>
            {renderSettingsRow({
              icon: Star,
              label: t('rate_app'),
              iconColor: colors.gold,
              // TODO: Update with actual App Store URL once listing is live
              onPress: () => Linking.openURL('https://apps.apple.com'),
            })}
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            {renderSettingsRow({
              icon: Share2,
              label: t('share_app'),
              iconColor: colors.accent,
              onPress: () => Share.share({
                message: t('share_message'),
              }),
            })}
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            {renderSettingsRow({
              icon: Shield,
              label: t('privacy'),
              onPress: () => router.push('/privacy'),
            })}
            <View style={[styles.settingsDivider, { backgroundColor: colors.divider }]} />
            {renderSettingsRow({
              icon: Info,
              label: t('version'),
              value: appVersion,
              onPress: () => {},
              rightElement: <View />,
            })}
          </View>
        </AnimatedSection>

        {/* -- 6. App Footer -- */}
        <View style={styles.footer}>
          <Text style={[styles.footerAppName, { color: colors.accent }]}>{t('app_name')}</Text>
          <Text style={[styles.footerTagline, { color: colors.textTertiary }]}>{t('app_tagline')}</Text>
          <View style={styles.footerPrivacyRow}>
            <Shield size={12} color={colors.textTertiary} strokeWidth={1.5} />
            <Text style={[styles.footerPrivacy, { color: colors.textTertiary }]}>{t('ad_free_privacy')}</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // -- Hero Header --
  heroHeader: {
    height: 220,
    width: '100%',
    overflow: 'hidden',
  },
  heroGradientOverlay: {
    flex: 1,
  },
  heroSafeArea: {
    flex: 1,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  heroAppName: {
    fontSize: FontSize.h1,
    fontFamily: 'Amiri-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: FontSize.bodySmall,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },

  // -- Section Titles --
  sectionSpacing: {
    marginTop: Spacing.lg,
  },
  sectionTitleRow: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // -- Card --
  card: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
  },

  // -- Streak --
  streakTopRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  streakIconRow: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCount: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    marginTop: -2,
  },
  streakDotsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  streakDotsRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakDotWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  streakDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  streakDayLabel: {
    fontSize: FontSize.micro,
    fontWeight: FontWeight.medium,
  },

  // -- Prayer Stats --
  statsDivider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
  },
  statLabel: {
    fontSize: FontSize.caption,
    marginTop: 2,
  },

  // -- Goals --
  goalRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
  },
  goalLabel: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  goalLabelDone: {
    textDecorationLine: 'line-through',
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: FontWeight.bold,
    marginTop: -1,
  },
  goalDivider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },

  // -- Bookmarks --
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  emptyStateText: {
    fontSize: FontSize.bodySmall,
  },
  bookmarkRow: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
  },
  bookmarkBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  bookmarkBadgeText: {
    fontSize: FontSize.micro,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bookmarkContent: {
    flex: 1,
    fontSize: FontSize.bodySmall,
  },

  // -- Settings --
  settingsGroupSpacing: {
    marginTop: Spacing.md,
  },
  settingsGroupLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1.5,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  settingsRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
  },
  settingsRowLeft: {
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 0,
  },
  settingsRowLabel: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
  },
  settingsRowRight: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  settingsRowValue: {
    fontSize: FontSize.caption,
    textAlign: 'right',
    flexShrink: 1,
  },
  reminderDesc: {
    fontSize: FontSize.caption,
    marginTop: 1,
  },
  settingsDivider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },

  // -- Per-Prayer Sound Options --
  perPrayerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginVertical: 1,
  },
  perPrayerOptionText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
  },

  // -- Method Picker --
  methodPicker: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
  },
  methodOption: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodOptionText: {
    fontSize: FontSize.bodySmall,
  },
  methodCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adhanOptionRow: {
    alignItems: 'center',
    gap: 8,
  },
  previewBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  methodCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: FontWeight.bold,
  },

  // -- Segment Controls (Theme / Language) --
  segmentContainer: {
    padding: Spacing.sm,
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  segmentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  segmentOptionActive: {},
  segmentOptionText: {
    fontSize: FontSize.bodySmall,
  },

  // -- Footer --
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerAppName: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
  },
  footerTagline: {
    fontSize: FontSize.caption,
    marginTop: 4,
  },
  footerPrivacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  footerPrivacy: {
    fontSize: FontSize.caption,
  },
});
