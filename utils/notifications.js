import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPrayerTimes, formatTime } from './prayer';
import { getNotificationSettings, getPrayerAdhanSounds } from './storage';

const ADHAN_SOUND_KEY = 'sajdah_adhan_sound';

// Map adhan IDs to notification sound filenames and full audio files
// NOTE: Removed duplicates (nafees=default, zahrani=madinah, turkish=alaqsa)
const ADHAN_SOUND_MAP = {
  default: {
    notif: 'adhan-default-notif.caf',
    full: require('../assets/audio/adhan-default.mp3'),
    label: 'Default',
  },
  makkah: {
    notif: 'adhan-makkah-notif.caf',
    full: require('../assets/audio/adhan-makkah.mp3'),
    label: 'Makkah',
  },
  madinah: {
    notif: 'adhan-madinah-notif.caf',
    full: require('../assets/audio/adhan-madinah.mp3'),
    label: 'Madinah',
  },
  alaqsa: {
    notif: 'adhan-alaqsa-notif.caf',
    full: require('../assets/audio/adhan-alaqsa.mp3'),
    label: 'Al-Aqsa',
  },
  alafasy: {
    notif: 'adhan-alafasy-notif.caf',
    full: require('../assets/audio/adhan-alafasy.mp3'),
    label: 'Alafasy',
  },
  alafasy2: {
    notif: 'adhan-alafasy2-notif.caf',
    full: require('../assets/audio/adhan-alafasy2.mp3'),
    label: 'Alafasy 2',
  },
  silent: { notif: null, full: null, label: 'Silent' },
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

// Get notification sound for a specific prayer (per-prayer override or global)
async function getNotifSoundForPrayer(prayerKey) {
  const perPrayer = await getPrayerAdhanSounds();
  if (perPrayer && perPrayer[prayerKey]) {
    return ADHAN_SOUND_MAP[perPrayer[prayerKey]]?.notif || ADHAN_SOUND_MAP.default.notif;
  }
  return getNotifSoundName();
}

// Play full adhan audio (for foreground notifications)
export async function playFullAdhan(prayerKey) {
  try {
    await stopAdhan();
    // Check per-prayer sound first, fall back to global
    let id;
    if (prayerKey) {
      const perPrayer = await getPrayerAdhanSounds();
      id = (perPrayer && perPrayer[prayerKey]) || (await getSelectedAdhan());
    } else {
      id = await getSelectedAdhan();
    }
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
      const id = notification.request.identifier || '';
      // Only play full athan for actual prayer-time notifications (not reminders or daily)
      if (data?.prayer && !id.startsWith('reminder_') && !id.startsWith('daily_')) {
        playFullAdhan(data.prayer);
      }
      return {
        shouldShowAlert: true,
        shouldPlaySound: false,
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

  // Also schedule special reminders (qiyam, friday kahf)
  scheduleSpecialReminders(latitude, longitude).catch(() => {});

  // Schedule daily hadith & gentle reminders
  scheduleDailyReminders().catch(() => {});

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

    // Use per-prayer sound if set, otherwise global
    const soundName = await getNotifSoundForPrayer(prayer.key);
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

      // Pre-prayer reminder (15 min before)
      if (settings.pre_reminder && prayer.key !== 'sunrise') {
        const reminderTime = new Date(todayTime.getTime() - 15 * 60 * 1000);
        if (reminderTime > now) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayer.label} in 15 minutes`,
              body: `Prepare for ${prayer.label} prayer`,
              sound: true,
              data: { prayer: prayer.key, type: 'pre_reminder' },
            },
            trigger: { type: 'date', date: reminderTime },
            identifier: `reminder_${prayer.key}_today`,
          });
        }
      }
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

      // Pre-prayer reminder for tomorrow
      if (settings.pre_reminder && prayer.key !== 'sunrise') {
        const reminderTime = new Date(tomorrowTime.getTime() - 15 * 60 * 1000);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${prayer.label} in 15 minutes`,
            body: `Prepare for ${prayer.label} prayer`,
            sound: true,
            data: { prayer: prayer.key, type: 'pre_reminder' },
          },
          trigger: { type: 'date', date: reminderTime },
          identifier: `reminder_${prayer.key}_tomorrow`,
        });
      }
    }
  }
}

export async function cancelAllPrayerNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('prayer_') || notif.identifier.startsWith('reminder_') || notif.identifier.startsWith('daily_')) {
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

// ── Daily Reminders (Hadith + Gentle Nudges) ─────────────

const DAILY_REMINDERS = [
  { hour: 7, minute: 30, title: 'Morning Reflection', bodyKey: 'hadith' },
  { hour: 18, minute: 0, title: 'Evening Adhkar', body: 'Take a moment for evening remembrance — SubhanAllah, Alhamdulillah, Allahu Akbar.' },
];

const GENTLE_NUDGES = [
  'A moment of dhikr brings peace to the heart.',
  'The Prophet (PBUH) said: "The best of deeds are those done consistently, even if small."',
  'Have you read Quran today? Even a few verses bring reward.',
  'Sending salawat upon the Prophet (PBUH) is a form of worship.',
  'Remember to make dua — Allah is the Most Generous.',
  'Gratitude opens doors to more blessings. Say Alhamdulillah.',
  'A kind word is charity. Spread goodness today.',
];

export async function scheduleDailyReminders() {
  const settings = await getNotificationSettings();
  const now = new Date();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Cancel existing daily notifications
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('daily_')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  // Morning hadith notification
  if (settings.daily_hadith) {
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    for (const day of [today, tomorrow]) {
      const morningTime = new Date(day);
      morningTime.setHours(7, 30, 0, 0);

      if (morningTime > now) {
        // Pick hadith based on day of year for variety
        const hadithDay = Math.floor((day - new Date(day.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const nudge = GENTLE_NUDGES[hadithDay % GENTLE_NUDGES.length];

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Morning Reflection',
            body: nudge,
            sound: true,
            data: { type: 'daily_hadith' },
          },
          trigger: { type: 'date', date: morningTime },
          identifier: `daily_hadith_${day.toISOString().split('T')[0]}`,
        }).catch(() => {});
      }
    }
  }

  // Evening adhkar reminder
  if (settings.daily_reminders) {
    for (const day of [today, tomorrow]) {
      const eveningTime = new Date(day);
      eveningTime.setHours(18, 0, 0, 0);

      if (eveningTime > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Evening Adhkar',
            body: 'Take a moment for evening remembrance — SubhanAllah, Alhamdulillah, Allahu Akbar.',
            sound: true,
            data: { type: 'daily_reminder' },
          },
          trigger: { type: 'date', date: eveningTime },
          identifier: `daily_evening_${day.toISOString().split('T')[0]}`,
        }).catch(() => {});
      }
    }
  }
}

// ── Special Reminders (Qiyam + Friday Kahf) ─────────────

export async function scheduleSpecialReminders(latitude, longitude) {
  // Cancel existing special reminders
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('special_')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  const settings = await getNotificationSettings();
  const now = new Date();

  // ── Qiyam: ~2 hours before Fajr (last third of night) ──
  if (settings.qiyam) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTimes = getPrayerTimes(latitude, longitude, today);
    const tomorrowTimes = getPrayerTimes(latitude, longitude, tomorrow);

    // Calculate qiyam time: 2 hours before Fajr
    const scheduleQiyam = (fajrTime, dayLabel) => {
      if (!fajrTime) return;
      const qiyamTime = new Date(fajrTime.getTime() - 2 * 60 * 60 * 1000);
      if (qiyamTime > now) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Qiyam al-Layl',
            body: 'The last third of the night — a blessed time for prayer and dua.',
            data: { type: 'qiyam' },
          },
          trigger: { type: 'date', date: qiyamTime },
          identifier: `special_qiyam_${dayLabel}`,
        }).catch(() => {});
      }
    };

    scheduleQiyam(todayTimes.fajr, 'today');
    scheduleQiyam(tomorrowTimes.fajr, 'tomorrow');
  }

  // ── Friday Kahf: Friday morning at 9:00 AM local ──
  if (settings.friday_kahf) {
    // Find the next Friday
    const nextFriday = new Date();
    const dayOfWeek = nextFriday.getDay();
    const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + 7 - dayOfWeek;

    if (daysUntilFriday === 0 && now.getHours() < 9) {
      // It's Friday and before 9 AM — schedule for today
      nextFriday.setHours(9, 0, 0, 0);
    } else if (daysUntilFriday === 0) {
      // It's Friday but after 9 AM — schedule for next week
      nextFriday.setDate(nextFriday.getDate() + 7);
      nextFriday.setHours(9, 0, 0, 0);
    } else {
      nextFriday.setDate(nextFriday.getDate() + daysUntilFriday);
      nextFriday.setHours(9, 0, 0, 0);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Jumu\'ah Mubarak',
        body: 'It\'s Friday — read Surah Al-Kahf for light between two Fridays.',
        data: { type: 'friday_kahf' },
      },
      trigger: { type: 'date', date: nextFriday },
      identifier: 'special_friday_kahf',
    }).catch(() => {});
  }
}

export async function cancelSpecialReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('special_')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

// Re-schedule notifications when adhan sound changes
export async function refreshNotificationSounds(latitude, longitude) {
  await scheduleAllPrayerNotifications(latitude, longitude);
  await scheduleSpecialReminders(latitude, longitude);
}
