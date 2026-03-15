import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Switch, Linking, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MapPin, Bell, Calculator, Moon, Sun, Smartphone, Info, ChevronRight, Star, Shield, Globe,
} from 'lucide-react-native';

import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/theme';
import { useApp } from '../../constants/AppContext';
import { getAvailableMethods } from '../../utils/prayer';

const CALC_METHOD_KEY = 'sajdah_calc_method';
const NOTIF_KEY = 'sajdah_notifications';

const METHOD_LABELS = {
  MWL: 'Muslim World League',
  ISNA: 'Islamic Society of North America',
  Egyptian: 'Egyptian General Authority',
  Karachi: 'University of Islamic Sciences, Karachi',
  Dubai: 'Dubai',
  Qatar: 'Qatar',
  Kuwait: 'Kuwait',
  Singapore: 'Singapore',
  Turkey: 'Turkey',
  Tehran: 'Institute of Geophysics, Tehran',
};

export default function SettingsScreen() {
  const { colors, shadows, isDark, themeMode, setTheme, locale, setLocale, t, isRTL } = useApp();

  const [calcMethod, setCalcMethod] = useState('ISNA');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const methods = getAvailableMethods();

  const rowDir = isRTL ? 'row-reverse' : 'row';

  useEffect(() => {
    AsyncStorage.getItem(CALC_METHOD_KEY).then((val) => { if (val) setCalcMethod(val); });
    AsyncStorage.getItem(NOTIF_KEY).then((val) => { if (val !== null) setNotificationsEnabled(val === 'true'); });
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

  function renderSectionHeader(title) {
    return (
      <Text style={[styles.sectionHeader, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
    );
  }

  function renderRow({ icon: Icon, label, value, onPress, rightElement, iconColor }) {
    return (
      <Pressable style={[styles.row, { flexDirection: rowDir }]} onPress={onPress}>
        <View style={[styles.rowIconCircle, { backgroundColor: colors.accentLight }]}>
          <Icon size={18} color={iconColor || colors.accent} strokeWidth={1.5} />
        </View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowLabel, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
          {value && <Text style={[styles.rowValue, { color: colors.textTertiary, textAlign: isRTL ? 'right' : 'left' }]}>{value}</Text>}
        </View>
        {rightElement || <ChevronRight size={18} color={colors.textTertiary} strokeWidth={1.5} style={isRTL ? { transform: [{ scaleX: -1 }] } : {}} />}
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
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}>{t('settings_title')}</Text>
          </View>

          {/* Prayer Settings */}
          {renderSectionHeader(t('prayer_section'))}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.soft]}>
            {renderRow({
              icon: Calculator,
              label: t('calc_method'),
              value: METHOD_LABELS[calcMethod] || calcMethod,
              onPress: () => setShowMethodPicker(!showMethodPicker),
            })}
            <View style={[styles.rowDivider, { backgroundColor: colors.divider }]} />
            {renderRow({
              icon: MapPin,
              label: t('location'),
              value: t('automatic'),
              onPress: () => {},
            })}
          </View>

          {/* Method Picker */}
          {showMethodPicker && (
            <View style={[styles.methodPicker, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.card]}>
              {methods.map((method) => (
                <Pressable
                  key={method}
                  style={[styles.methodOption, { borderBottomColor: colors.divider }, calcMethod === method && { backgroundColor: colors.accentLight }]}
                  onPress={() => handleMethodChange(method)}
                >
                  <Text style={[styles.methodOptionText, { color: colors.textPrimary }, calcMethod === method && { color: colors.accent, fontWeight: FontWeight.semibold }]}>
                    {METHOD_LABELS[method] || method}
                  </Text>
                  {calcMethod === method && (
                    <View style={[styles.methodCheck, { backgroundColor: colors.accent }]}>
                      <Text style={styles.methodCheckText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/* Notifications */}
          {renderSectionHeader(t('notifications_section'))}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.soft]}>
            {renderRow({
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

          {/* Appearance — Theme Toggle */}
          {renderSectionHeader(t('appearance_section'))}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.soft]}>
            <View style={styles.themeToggleContainer}>
              <View style={[styles.themeToggleRow, { backgroundColor: colors.backgroundSecondary, flexDirection: rowDir }]}>
                {themeOptions.map((opt) => {
                  const isActive = themeMode === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      style={[styles.themeOption, isActive && [styles.themeOptionActive, { backgroundColor: colors.surface }, shadows.soft]]}
                      onPress={() => setTheme(opt.key)}
                    >
                      <opt.Icon size={16} color={isActive ? colors.accent : colors.textTertiary} strokeWidth={1.5} />
                      <Text style={[styles.themeOptionText, { color: isActive ? colors.accent : colors.textTertiary }, isActive && { fontWeight: FontWeight.semibold }]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Language */}
          {renderSectionHeader(t('language_section'))}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.soft]}>
            <View style={styles.themeToggleContainer}>
              <View style={[styles.themeToggleRow, { backgroundColor: colors.backgroundSecondary, flexDirection: rowDir }]}>
                {langOptions.map((opt) => {
                  const isActive = locale === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      style={[styles.themeOption, isActive && [styles.themeOptionActive, { backgroundColor: colors.surface }, shadows.soft]]}
                      onPress={() => setLocale(opt.key)}
                    >
                      <Globe size={16} color={isActive ? colors.accent : colors.textTertiary} strokeWidth={1.5} />
                      <Text style={[styles.themeOptionText, { color: isActive ? colors.accent : colors.textTertiary }, isActive && { fontWeight: FontWeight.semibold }]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* About */}
          {renderSectionHeader(t('about_section'))}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.soft]}>
            {renderRow({
              icon: Star,
              label: t('rate_app'),
              iconColor: colors.gold,
              onPress: () => Linking.openURL('https://apps.apple.com'),
            })}
            <View style={[styles.rowDivider, { backgroundColor: colors.divider }]} />
            {renderRow({
              icon: Shield,
              label: t('privacy'),
              onPress: () => {},
            })}
            <View style={[styles.rowDivider, { backgroundColor: colors.divider }]} />
            {renderRow({
              icon: Info,
              label: t('version'),
              value: '1.0.0',
              onPress: () => {},
              rightElement: <View />,
            })}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: colors.accent }]}>Sajdah</Text>
            <Text style={[styles.appTagline, { color: colors.textTertiary }]}>{t('app_tagline')}</Text>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  header: { padding: Spacing.md },
  headerTitle: { fontSize: FontSize.h1, fontWeight: FontWeight.bold, letterSpacing: -0.5 },

  sectionHeader: { fontSize: FontSize.caption, fontWeight: FontWeight.semibold, letterSpacing: 1.5, paddingHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.xs },

  card: { marginHorizontal: Spacing.md, borderRadius: BorderRadius.xl, overflow: 'hidden', borderWidth: 1 },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: Spacing.md },
  rowIconCircle: { width: 36, height: 36, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: FontSize.body, fontWeight: FontWeight.medium },
  rowValue: { fontSize: FontSize.caption, marginTop: 2 },
  rowDivider: { height: 1, marginLeft: Spacing.md + 36 + Spacing.sm },

  methodPicker: { marginHorizontal: Spacing.md, marginTop: Spacing.xs, borderRadius: BorderRadius.xl, overflow: 'hidden', borderWidth: 1 },
  methodOption: { paddingVertical: 14, paddingHorizontal: Spacing.md, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  methodOptionText: { fontSize: FontSize.bodySmall },
  methodCheck: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  methodCheckText: { color: '#FFFFFF', fontSize: 12, fontWeight: FontWeight.bold },

  // Theme / Language toggle
  themeToggleContainer: { padding: Spacing.sm },
  themeToggleRow: { flexDirection: 'row', borderRadius: BorderRadius.lg, padding: 4 },
  themeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: BorderRadius.md },
  themeOptionActive: {},
  themeOptionText: { fontSize: FontSize.bodySmall },

  appInfo: { alignItems: 'center', marginTop: Spacing.xl },
  appName: { fontSize: FontSize.h3, fontWeight: FontWeight.bold },
  appTagline: { fontSize: FontSize.caption, marginTop: 4 },
});
