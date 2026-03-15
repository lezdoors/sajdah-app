import * as Notifications from 'expo-notifications';
import { getPrayerTimes, formatTime } from './prayer';
import { getNotificationSettings } from './storage';

// Configure how notifications appear when app is in foreground
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch {
  // Not available on web
}

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleAllPrayerNotifications(latitude, longitude) {
  // Cancel all existing prayer notifications first
  await cancelAllPrayerNotifications();

  const settings = await getNotificationSettings();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTimes = getPrayerTimes(latitude, longitude, today);
  const tomorrowTimes = getPrayerTimes(latitude, longitude, tomorrow);

  const prayers = [
    { key: 'fajr', label: 'Fajr' },
    { key: 'sunrise', label: 'Sunrise' },
    { key: 'dhuhr', label: 'Dhuhr' },
    { key: 'asr', label: 'Asr' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isha' },
  ];

  const now = new Date();

  for (const prayer of prayers) {
    if (!settings[prayer.key]) continue;

    // Schedule for today if time hasn't passed
    const todayTime = todayTimes[prayer.key];
    if (todayTime && todayTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.label} Prayer`,
          body: `It's time for ${prayer.label} - ${formatTime(todayTime)}`,
          sound: true,
          data: { prayer: prayer.key },
        },
        trigger: {
          type: 'date',
          date: todayTime,
        },
        identifier: `prayer_${prayer.key}_today`,
      });
    }

    // Always schedule for tomorrow
    const tomorrowTime = tomorrowTimes[prayer.key];
    if (tomorrowTime) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.label} Prayer`,
          body: `It's time for ${prayer.label} - ${formatTime(tomorrowTime)}`,
          sound: true,
          data: { prayer: prayer.key },
        },
        trigger: {
          type: 'date',
          date: tomorrowTime,
        },
        identifier: `prayer_${prayer.key}_tomorrow`,
      });
    }
  }
}

export async function cancelAllPrayerNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('prayer_')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

export async function scheduleSinglePrayer(prayerKey, prayerLabel, latitude, longitude) {
  // Cancel existing for this prayer
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith(`prayer_${prayerKey}`)) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTimes = getPrayerTimes(latitude, longitude, today);
  const tomorrowTimes = getPrayerTimes(latitude, longitude, tomorrow);
  const now = new Date();

  const todayTime = todayTimes[prayerKey];
  if (todayTime && todayTime > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${prayerLabel} Prayer`,
        body: `It's time for ${prayerLabel} - ${formatTime(todayTime)}`,
        sound: true,
        data: { prayer: prayerKey },
      },
      trigger: { type: 'date', date: todayTime },
      identifier: `prayer_${prayerKey}_today`,
    });
  }

  const tomorrowTime = tomorrowTimes[prayerKey];
  if (tomorrowTime) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${prayerLabel} Prayer`,
        body: `It's time for ${prayerLabel} - ${formatTime(tomorrowTime)}`,
        sound: true,
        data: { prayer: prayerKey },
      },
      trigger: { type: 'date', date: tomorrowTime },
      identifier: `prayer_${prayerKey}_tomorrow`,
    });
  }
}

export async function cancelSinglePrayer(prayerKey) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith(`prayer_${prayerKey}`)) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}
