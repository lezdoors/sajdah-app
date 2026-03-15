import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { AppProvider } from '../constants/AppContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(() => {});
    return () => sub.remove();
  }, []);

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="prayer" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="qibla" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="dua-reader" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="tasbih" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="names" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="calendar" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="topic" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AppProvider>
  );
}
