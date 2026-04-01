import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Bell, MapPin, Sparkles, ArrowRight } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { Spacing, FontSize, FontWeight, BorderRadius, Images } from '../constants/theme';
import { useApp } from '../constants/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = 'sajdah_onboarded';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, shadows, isDark, t } = useApp();

  const [step, setStep] = useState(0);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [step]);

  const steps = [
    {
      type: 'welcome',
      Icon: Compass,
      image: Images.mosque,
      title: t('welcome_title'),
      titleAccent: t('welcome_accent'),
      description: t('welcome_desc'),
      button: t('get_started'),
    },
    {
      type: 'permissions',
      Icon: MapPin,
      image: Images.mosqueSilhouette,
      title: t('location_title'),
      titleAccent: t('location_accent'),
      description: t('location_desc'),
      button: t('allow_location'),
      action: async () => {
        try {
          // expo-location permissions are not supported the same way on web
          if (Platform.OS !== 'web') {
            await Location.requestForegroundPermissionsAsync();
          }
        } catch (e) {
          // Don't block onboarding if permissions fail
        }
      },
    },
    {
      type: 'setup',
      Icon: Sparkles,
      image: Images.mosqueNight,
      title: t('setup_title'),
      titleAccent: '',
      description: t('setup_desc'),
      button: t('finish_setup'),
      action: async () => {
        try {
          if (remindersEnabled && Platform.OS !== 'web') {
            await Notifications.requestPermissionsAsync();
          }
        } catch (e) {
          // Don't block onboarding if permissions fail
        }
      },
    },
  ];

  async function handleNext() {
    const currentStep = steps[step];
    if (currentStep.action) await currentStep.action();

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      } catch (e) {
        // Ignore storage failures
      }
      router.replace('/(tabs)');
    }
  }

  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Hero Image Area */}
        <View style={styles.heroArea}>
          <Image source={current.image} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient colors={['transparent', colors.background]} style={styles.heroGradient} />
          <View style={[styles.iconFloat, { backgroundColor: colors.accentLight }, shadows.card]}>
            <current.Icon size={28} color={colors.accent} strokeWidth={2} />
          </View>
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {current.title}
            {current.titleAccent ? (
              <Text style={[styles.titleAccent, { color: colors.gold }]}>{'\n'}{current.titleAccent}</Text>
            ) : null}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{current.description}</Text>

          {/* Setup preferences on last step */}
          {isLast && (
            <View style={styles.prefsSection}>
              <Text style={[styles.prefsTitle, { color: colors.textPrimary }]}>{t('preferences')}</Text>
              <Pressable
                style={[styles.prefRow, { borderBottomColor: colors.divider }]}
                onPress={() => setRemindersEnabled(!remindersEnabled)}
              >
                <View style={[styles.prefIcon, { backgroundColor: colors.accentLight }]}>
                  <Bell size={20} color={colors.accent} />
                </View>
                <View style={styles.prefInfo}>
                  <Text style={[styles.prefLabel, { color: colors.textPrimary }]}>{t('daily_reminders')}</Text>
                  <Text style={[styles.prefDesc, { color: colors.textSecondary }]}>{t('daily_reminders_desc')}</Text>
                </View>
                <View style={[styles.toggle, { backgroundColor: colors.switchTrack }, remindersEnabled && { backgroundColor: colors.switchTrackActive }]}>
                  <View style={[styles.toggleDot, remindersEnabled && styles.toggleDotActive]} />
                </View>
              </Pressable>
            </View>
          )}
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.button, { backgroundColor: colors.accent }, shadows.oliveGlow, pressed && styles.buttonPressed]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>{current.button}</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
          </Pressable>

          {/* Progress dots */}
          <View style={styles.dotsRow}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: colors.divider },
                  i === step && { backgroundColor: colors.accent, width: 24 },
                  i < step && { backgroundColor: colors.sage },
                ]}
              />
            ))}
          </View>

          {isFirst && (
            <Text style={[styles.footerNote, { color: colors.textTertiary }]}>{t('free_forever')}</Text>
          )}
          {!isFirst && !isLast && (
            <Pressable onPress={() => setStep(step + 1)}>
              <Text style={[styles.skipText, { color: colors.textTertiary }]}>{t('skip')}</Text>
            </Pressable>
          )}
          {isLast && (
            <Text style={[styles.settingsNote, { color: colors.textTertiary }]}>{t('settings_note')}</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  heroArea: { height: 280, position: 'relative' },
  heroImage: { width: SCREEN_WIDTH, height: 280, borderBottomLeftRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  iconFloat: {
    position: 'absolute', bottom: -20, alignSelf: 'center',
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  title: { fontSize: 28, fontWeight: FontWeight.bold, textAlign: 'center', lineHeight: 36 },
  titleAccent: { fontStyle: 'italic' },
  description: { fontSize: FontSize.body, textAlign: 'center', lineHeight: 24, marginTop: Spacing.sm },
  prefsSection: { marginTop: Spacing.lg },
  prefsTitle: { fontSize: FontSize.h3, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  prefRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  prefIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  prefInfo: { flex: 1 },
  prefLabel: { fontSize: FontSize.body, fontWeight: FontWeight.semibold },
  prefDesc: { fontSize: FontSize.caption, marginTop: 2 },
  toggle: { width: 48, height: 28, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 2 },
  toggleDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF' },
  toggleDotActive: { alignSelf: 'flex-end' },
  footer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, alignItems: 'center', gap: Spacing.sm },
  button: {
    width: '100%', height: 56, borderRadius: BorderRadius.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  buttonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  buttonText: { fontSize: FontSize.body, fontWeight: FontWeight.bold, color: '#FFFFFF', letterSpacing: 0.3 },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  footerNote: { fontSize: FontSize.bodySmall, marginTop: Spacing.xs },
  skipText: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.medium },
  settingsNote: { fontSize: FontSize.caption, textAlign: 'center' },
});
