import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Palette } from '../constants/theme';
import { useApp } from '../constants/AppContext';
import MoroccanPattern from '../components/MoroccanPattern';

const ONBOARDING_KEY = 'sajdah_onboarded';

export default function Index() {
  const router = useRouter();
  const { t } = useApp();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(floatY, {
        toValue: 0,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
        if (val === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <LinearGradient
      colors={['#0A1A14', '#0D2B1F', '#0A1A14']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <MoroccanPattern color="#FFFFFF" opacity={0.04} />
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeIn, transform: [{ translateY: floatY }] },
        ]}
      >
        <Text style={styles.title}>{t('app_name')}</Text>
        <Text style={styles.arabic}>{t('app_name_arabic')}</Text>
        <Text style={styles.tagline}>{t('app_tagline')}</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  arabic: {
    fontSize: 26,
    color: Palette.gold400,
    marginTop: 8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 12,
  },
});
