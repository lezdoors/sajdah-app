import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  STREAK: 'alathan_streak',
  STREAK_DATES: 'alathan_streak_dates',
  BOOKMARKS: 'alathan_bookmarks',
  LAST_READ: 'alathan_last_read',
  NOTIFICATIONS: 'alathan_notifications',
  CALC_METHOD: 'alathan_calc_method',
  TASBIH_COUNT: 'alathan_tasbih',
  DAILY_GOALS: 'alathan_daily_goals',
};

export async function getStreak() {
  try {
    const data = await AsyncStorage.getItem(KEYS.STREAK_DATES);
    if (!data) return { count: 0, dates: [] };
    const dates = JSON.parse(data);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dates.includes(today)) {
      let count = 1;
      let checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - 1);
      while (dates.includes(checkDate.toISOString().split('T')[0])) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      return { count, dates: dates.slice(-7) };
    }
    if (dates.includes(yesterday)) {
      let count = 1;
      let checkDate = new Date(yesterday);
      while (dates.includes(checkDate.toISOString().split('T')[0])) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      return { count, dates: dates.slice(-7) };
    }
    return { count: 0, dates: dates.slice(-7) };
  } catch {
    return { count: 0, dates: [] };
  }
}

export async function recordDay() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await AsyncStorage.getItem(KEYS.STREAK_DATES);
    const dates = data ? JSON.parse(data) : [];
    if (!dates.includes(today)) {
      dates.push(today);
      await AsyncStorage.setItem(KEYS.STREAK_DATES, JSON.stringify(dates.slice(-365)));
    }
  } catch {}
}

export async function getLastRead() {
  try {
    const data = await AsyncStorage.getItem(KEYS.LAST_READ);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setLastRead(surahNumber, ayahNumber) {
  await AsyncStorage.setItem(KEYS.LAST_READ, JSON.stringify({ surahNumber, ayahNumber }));
}

export async function getCalcMethod() {
  try {
    return (await AsyncStorage.getItem(KEYS.CALC_METHOD)) || 'ISNA';
  } catch {
    return 'ISNA';
  }
}

export async function setCalcMethod(method) {
  await AsyncStorage.setItem(KEYS.CALC_METHOD, method);
}

export async function getNotificationSettings() {
  try {
    const data = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : {
      fajr: true, sunrise: false, dhuhr: true, asr: true, maghrib: true, isha: true, qiyam: false,
    };
  } catch {
    return { fajr: true, sunrise: false, dhuhr: true, asr: true, maghrib: true, isha: true, qiyam: false };
  }
}

export async function setNotificationSettings(settings) {
  await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(settings));
}

// Daily Goals - stored per day
export async function getDailyGoals() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await AsyncStorage.getItem(KEYS.DAILY_GOALS);
    if (!data) return {};
    const parsed = JSON.parse(data);
    return parsed[today] || {};
  } catch {
    return {};
  }
}

export async function toggleGoal(goalId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await AsyncStorage.getItem(KEYS.DAILY_GOALS);
    const parsed = data ? JSON.parse(data) : {};
    if (!parsed[today]) parsed[today] = {};
    parsed[today][goalId] = !parsed[today][goalId];
    // Keep only last 30 days of data
    const keys = Object.keys(parsed).sort();
    if (keys.length > 30) {
      for (const key of keys.slice(0, keys.length - 30)) {
        delete parsed[key];
      }
    }
    await AsyncStorage.setItem(KEYS.DAILY_GOALS, JSON.stringify(parsed));
    return parsed[today];
  } catch {
    return {};
  }
}

// Bookmarks
export async function getBookmarks() {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleBookmark(item) {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKMARKS);
    let bookmarks = data ? JSON.parse(data) : [];
    const idx = bookmarks.findIndex(b => b.id === item.id && b.type === item.type);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.unshift({ ...item, savedAt: Date.now() });
      bookmarks = bookmarks.slice(0, 100);
    }
    await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return bookmarks;
  } catch {
    return [];
  }
}

export async function isBookmarked(id, type) {
  try {
    const data = await AsyncStorage.getItem(KEYS.BOOKMARKS);
    if (!data) return false;
    const bookmarks = JSON.parse(data);
    return bookmarks.some(b => b.id === id && b.type === type);
  } catch {
    return false;
  }
}

// Tasbih
export async function getTasbihTotal() {
  try {
    const data = await AsyncStorage.getItem(KEYS.TASBIH_COUNT);
    return data ? parseInt(data, 10) : 0;
  } catch {
    return 0;
  }
}

export async function incrementTasbih(amount = 1) {
  try {
    const data = await AsyncStorage.getItem(KEYS.TASBIH_COUNT);
    const current = data ? parseInt(data, 10) : 0;
    const next = current + amount;
    await AsyncStorage.setItem(KEYS.TASBIH_COUNT, String(next));
    return next;
  } catch {
    return 0;
  }
}

export async function resetTasbihSession() {
  // Only resets the session counter, not the lifetime total
  return 0;
}
