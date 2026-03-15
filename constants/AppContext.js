import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, Shadows, ShadowsDark } from './theme';
import { translations } from './i18n';

const THEME_KEY = 'sajdah_theme';   // 'light' | 'dark' | 'system'
const LOCALE_KEY = 'sajdah_locale'; // 'en' | 'ar'

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'
  const [locale, setLocaleState] = useState('en');
  const [loaded, setLoaded] = useState(false);

  // Load persisted preferences
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(THEME_KEY),
      AsyncStorage.getItem(LOCALE_KEY),
    ]).then(([savedTheme, savedLocale]) => {
      if (savedTheme) setThemeMode(savedTheme);
      if (savedLocale) setLocaleState(savedLocale);
      setLoaded(true);
    });
  }, []);

  // Resolve actual dark/light
  const isDark = useMemo(() => {
    if (themeMode === 'system') return systemScheme === 'dark';
    return themeMode === 'dark';
  }, [themeMode, systemScheme]);

  const colors = isDark ? DarkColors : LightColors;
  const shadows = isDark ? ShadowsDark : Shadows;

  const isRTL = locale === 'ar';

  // Translation function
  const t = useCallback((key) => {
    return translations[locale]?.[key] || translations.en[key] || key;
  }, [locale]);

  // Setters
  const setTheme = useCallback(async (mode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  const setLocale = useCallback(async (loc) => {
    setLocaleState(loc);
    await AsyncStorage.setItem(LOCALE_KEY, loc);
    // Handle RTL
    const shouldBeRTL = loc === 'ar';
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
    }
  }, []);

  const value = useMemo(() => ({
    colors,
    shadows,
    isDark,
    themeMode,
    setTheme,
    locale,
    setLocale,
    isRTL,
    t,
    loaded,
  }), [colors, shadows, isDark, themeMode, setTheme, locale, setLocale, isRTL, t, loaded]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
