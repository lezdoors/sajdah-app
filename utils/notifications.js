import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPrayerTimes, formatTime } from './prayer';
import { getNotificationSettings } from './storage';

const ADHAN_SOUND_KEY = 'sajdah_adhan_sound';

// Map adhan IDs to notification sound filenames and full audio files
const ADHAN_SOUND_MAP = {
  default: {
    notif: 'adhan-default-notif.mp3',
    full: require('../assets/audio/adhan-default.mp3'),
  },
  makkah: {
    notif: 'adhan-makkah-notif.mp3',
    full: require('../assets/audio/adhan-makkah.mp3'),
  },
  madinah: {
    notif: 'adhan-madinah-notif.mp3',
    full: require('../assets/audio/adhan-madinah.mp3'),
  },
  alaqsa: {
    notif: 'adhan-alaqsa-notif.mp3',
    full: require('../assets/audio/adhan-alaqsa.mp3'),
  },
  alafasy: {
    notif: 'adhan-alafasy-notif.mp3',
    full: require('../assets/audio/adhan-alafasy.mp3'),
  },
  alafasy2: {
    notif: 'adhan-alafasy2-notif.mp3',
    full: require('../assets/audio/adhan-alafasy2.mp3'),
  },
  turkish: {
    notif: 'adhan-turkish-notif.mp3',
    full: require('../assets/audio/adhan-turkish.mp3'),
  },
  nafees: {
    notif: 'adhan-nafees-notif.mp3',
    full: require('../assets/audio/adhan-nafees.mp3'),
  },
  zahrani: {
    notif: 'adhan-zahrani-notif.mp3',
    full: require('../assets/audio/adhan-zahrani.mp3'),
  },
  silent: { notif: null, full: null },
};

let currentAdhanSound = null;

// Get the user's selected adhan sound ID
async function getSelectedAdhan() {
  const id = await AsyncStorage.getItem(ADHAN_SOUND_KEY);
  return id || 'default';
}

// Get notification sound filename for the selected adhan
async function getNotifSoundName() {
  const id = await getSelectedAdhan();
  return ADHAN_SOUND_MAP[id]?.notif || ADHAN_SOUND_MAP.default.notif;
}

// Play full adhan audio (for foreground notifications)
export async function playFullAdhan() {
  try {
    await stopAdhan();
    const id = await getSelectedAdhan();
    const entry = ADHAN_SOUND_MAP[id];
    if (!entry?.full) return;

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    const { sound } = await Audio.Sound.createAsync(entry.full);
    currentAdhanSound = sound;
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        if (currentAdhanSound === sound) currentAdhanSound = null;
      }
    });
  } catch (e) {
    console.warn('[ADHAN] playback error:', e);
  }
}

// Stop currently playing adhan
export async function stopAdhan() {
  if (currentAdhanSound) {
    try {
      await currentAdhanSound.stopAsync();
      await currentAdhanSound.unloadAsync();
    } catch {}
    currentAdhanSound = null;
  }
}

// Configure how notifications appear when app is in foreground
try {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const data = notification.request.content.data;
      // If it's a prayer notification and app is in foreground, play full adhan
      if (data?.prayer) {
        playFullAdhan();
      }
      return {
        shouldShowAlert: true,
        shouldPlaySound: false, // We play our own sound in foreground
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      };
    },
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
  const soundName = await getNotifSoundName();
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

    const soundConfig = soundName ? soundName : true;

    // Schedule for today if time hasn't passed
    const todayTime = todayTimes[prayer.key];
    if (todayTime && todayTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.label} Prayer`,
          body: `It's time for ${prayer.label} - ${formatTime(todayTime)}`,
          sound: soundConfig,
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
          sound: soundConfig,
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

  const soundName = await getNotifSoundName();
  const soundConfig = soundName ? soundName : true;
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
        sound: soundConfig,
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
        sound: soundConfig,
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

// Re-schedule notifications when adhan sound changes
export async function refreshNotificationSounds(latitude, longitude) {
  await scheduleAllPrayerNotifications(latitude, longitude);
}
