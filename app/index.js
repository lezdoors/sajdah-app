import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Palette, Images } from '../constants/theme';
import { useApp } from '../constants/AppContext';

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
    <ImageBackground
      source={Images.mosqueNight}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      >
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 44,
    fontFamily: 'Amiri-Bold',
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
