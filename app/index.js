import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images, Palette } from '../constants/theme';
import { useApp } from '../constants/AppContext';

const ONBOARDING_KEY = 'sajdah_onboarded';

export default function Index() {
  const router = useRouter();
  const { t } = useApp();

  // Animation values
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const arabicOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered fade-in animations
    Animated.parallel([
      // Title fades in at 200ms
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      // Arabic subtitle fades in at 400ms
      Animated.timing(arabicOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
      // Tagline fades in at 600ms
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        delay: 600,
        useNativeDriver: true,
      }),
      // Subtle upward float on the entire text group
      Animated.timing(floatY, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 1200ms
    const timeout = setTimeout(() => {
      AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
        if (val === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={Images.mosqueNight}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Bottom gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {/* Centered content with upward float */}
        <Animated.View
          style={[
            styles.content,
            { transform: [{ translateY: floatY }] },
          ]}
        >
          {/* App name */}
          <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
            {t('app_name')}
          </Animated.Text>

          {/* Arabic subtitle */}
          <Animated.Text style={[styles.arabic, { opacity: arabicOpacity }]}>
            {t('app_name_arabic')}
          </Animated.Text>

          {/* Tagline */}
          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            {t('app_tagline')}
          </Animated.Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  arabic: {
    fontSize: 28,
    color: Palette.gold400,
    marginTop: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 12,
  },
});
