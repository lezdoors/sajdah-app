import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ActivityIndicator, Pressable, Animated, Platform, ImageBackground, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { MapPin, Navigation, RotateCcw, ChevronLeft } from 'lucide-react-native';

import { Spacing, FontSize, FontWeight, BorderRadius, Images } from '../constants/theme';
import { useApp } from '../constants/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COMPASS_SIZE = Math.min(SCREEN_WIDTH - 80, 280);
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQiblaDirection(lat, lng) {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;
  const dLng = kaabaLngRad - lngRad;
  const x = Math.sin(dLng);
  const y = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);
  return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;
}

function getCardinalDirection(deg) {
  const names = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
  return names[Math.round(deg / 45) % 8];
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function QiblaScreen() {
  const { colors, shadows, isDark, t } = useApp();
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState('--');
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sensorAvailable, setSensorAvailable] = useState(true);

  const animatedRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const subscriptionRef = useRef(null);

  // Pulse animation for compass glow
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { if (mounted) setLoading(false); return; }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        setQiblaDirection(calculateQiblaDirection(latitude, longitude));
        setDistance(calculateDistance(latitude, longitude, KAABA_LAT, KAABA_LNG));
        try {
          const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (geo && mounted) setCityName(geo.city || geo.subregion || geo.region || '--');
        } catch {}
        setLoading(false);
      } catch { if (mounted) setLoading(false); }
    }
    init();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function startMag() {
      const available = await Magnetometer.isAvailableAsync();
      if (!available) { setSensorAvailable(false); return; }
      Magnetometer.setUpdateInterval(100);
      subscriptionRef.current = Magnetometer.addListener((data) => {
        if (!mounted) return;
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = (angle + 360) % 360;
        const h = Platform.OS === 'ios' ? (360 - angle) % 360 : angle;
        const needleAngle = qiblaDirection - h;
        Animated.spring(animatedRotation, {
          toValue: needleAngle, useNativeDriver: true, tension: 40, friction: 8,
        }).start();
      });
    }
    if (!loading && location) startMag();
    return () => { mounted = false; if (subscriptionRef.current) { subscriptionRef.current.remove(); subscriptionRef.current = null; } };
  }, [loading, location, qiblaDirection]);

  const rotation = animatedRotation.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('finding_location')}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <MapPin size={48} color={colors.textTertiary} strokeWidth={1.5} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>{t('location_needed')}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={Images.mosqueNight} style={[styles.container]} resizeMode="cover">
      <LinearGradient colors={isDark ? ['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)'] : ['rgba(250,248,243,0.92)', 'rgba(250,248,243,0.98)']} style={styles.overlay}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t('qibla_finder')}</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Location */}
          <View style={styles.locationInfo}>
            <View style={styles.locationBadge}>
              <MapPin size={14} color={colors.gold} strokeWidth={2} />
              <Text style={[styles.locationLabel, { color: colors.gold }]}>{t('current_location')}</Text>
            </View>
            <Text style={[styles.cityName, { color: colors.textPrimary }]}>{cityName}</Text>
          </View>

          {/* Compass */}
          <View style={styles.compassContainer}>
            <Animated.View style={[styles.compassGlow, {
              backgroundColor: isDark ? 'rgba(107, 145, 122, 0.08)' : 'rgba(45, 74, 62, 0.04)',
              transform: [{ scale: pulseAnim }],
            }]} />

            <View style={[styles.compassOuter, { borderColor: colors.surface }, shadows.depth3d]}>
              <View style={styles.cardinalN}><Text style={[styles.cardinalText, { color: colors.textTertiary }]}>N</Text></View>
              <View style={styles.cardinalS}><Text style={[styles.cardinalText, { color: colors.textTertiary }]}>S</Text></View>
              <View style={styles.cardinalE}><Text style={[styles.cardinalText, { color: colors.textTertiary }]}>E</Text></View>
              <View style={styles.cardinalW}><Text style={[styles.cardinalText, { color: colors.textTertiary }]}>W</Text></View>

              <View style={[styles.compassInner, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
                <Animated.View style={[styles.needleContainer, { transform: [{ rotate: rotation }] }]}>
                  <View style={[styles.needle, { backgroundColor: colors.sage }]} />
                  <View style={[styles.needleTip, { backgroundColor: colors.sage }]} />
                  <View style={styles.kaabaIcon}><Text style={styles.kaabaEmoji}>🕋</Text></View>
                </Animated.View>

                <View style={styles.centerDisplay}>
                  <Text style={[styles.degreesText, { color: colors.textPrimary }]}>{Math.round(qiblaDirection)}°</Text>
                  <Text style={[styles.directionText, { color: colors.gold }]}>{getCardinalDirection(qiblaDirection)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.card]}>
              <View style={[styles.infoIconCircle, { backgroundColor: colors.accentLight }]}>
                <Navigation size={18} color={colors.accent} strokeWidth={1.5} />
              </View>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>{t('distance')}</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{Math.round(distance).toLocaleString()} km</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.card]}>
              <View style={[styles.infoIconCircle, { backgroundColor: colors.goldLight }]}>
                <RotateCcw size={18} color={colors.gold} strokeWidth={1.5} />
              </View>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>{t('direction')}</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{t('towards_mecca')}</Text>
            </View>
          </View>

          {sensorAvailable && (
            <View style={[styles.calibrationTip, { backgroundColor: colors.accentLight, borderColor: colors.accent + '20' }]}>
              <RotateCcw size={16} color={colors.accent} strokeWidth={2} />
              <Text style={[styles.calibrationText, { color: colors.textSecondary }]}>{t('calibrate_tip')}</Text>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  loadingText: { fontSize: FontSize.body },
  errorText: { fontSize: FontSize.body, textAlign: 'center', paddingHorizontal: Spacing.xl, lineHeight: 24, marginTop: Spacing.sm },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.h3, fontWeight: FontWeight.bold, letterSpacing: -0.3 },

  locationInfo: { alignItems: 'center', marginBottom: Spacing.sm },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationLabel: { fontSize: FontSize.caption, fontWeight: FontWeight.semibold, letterSpacing: 2 },
  cityName: { fontSize: FontSize.h2, fontWeight: FontWeight.bold, marginTop: 4 },

  compassContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.md },
  compassGlow: { position: 'absolute', width: COMPASS_SIZE + 50, height: COMPASS_SIZE + 50, borderRadius: (COMPASS_SIZE + 50) / 2 },
  compassOuter: { width: COMPASS_SIZE, height: COMPASS_SIZE, borderRadius: COMPASS_SIZE / 2, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
  compassInner: { width: COMPASS_SIZE - 36, height: COMPASS_SIZE - 36, borderRadius: (COMPASS_SIZE - 36) / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  cardinalN: { position: 'absolute', top: 14, alignSelf: 'center' },
  cardinalS: { position: 'absolute', bottom: 14, alignSelf: 'center' },
  cardinalE: { position: 'absolute', right: 14, alignSelf: 'center' },
  cardinalW: { position: 'absolute', left: 14, alignSelf: 'center' },
  cardinalText: { fontSize: 10, fontWeight: FontWeight.bold },

  needleContainer: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center' },
  needle: { width: 3, height: '42%', borderRadius: 2, position: 'absolute', top: 8 },
  needleTip: { width: 14, height: 14, borderRadius: 7, position: 'absolute', top: -2, alignSelf: 'center' },
  kaabaIcon: { position: 'absolute', top: -4, alignSelf: 'center' },
  kaabaEmoji: { fontSize: 22 },

  centerDisplay: { zIndex: 10, alignItems: 'center' },
  degreesText: { fontSize: 36, fontWeight: FontWeight.bold, letterSpacing: -1 },
  directionText: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.bold, letterSpacing: 1.5, textTransform: 'uppercase' },

  infoCards: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, marginTop: Spacing.sm },
  infoCard: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.xl, alignItems: 'center', borderWidth: 1 },
  infoIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  infoLabel: { fontSize: 10, fontWeight: FontWeight.medium, letterSpacing: 1.5 },
  infoValue: { fontSize: FontSize.body, fontWeight: FontWeight.bold, marginTop: 4 },

  calibrationTip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, marginTop: Spacing.lg, marginHorizontal: Spacing.lg, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1 },
  calibrationText: { fontSize: FontSize.caption, fontWeight: FontWeight.medium },
});
