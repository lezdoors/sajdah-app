import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/theme';

const ONBOARDING_KEY = 'sajdah_onboarded';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      if (val === 'true') {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    });
  }, []);

  return <View style={{ flex: 1, backgroundColor: Colors.accent }} />;
}
