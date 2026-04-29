import AsyncStorage from '@react-native-async-storage/async-storage';
import { AYAHS } from '../data/ayahs';
import { SURAHS } from '../data/surahs';

const CACHE_KEY_PREFIX = 'quran_surah_';

export async function loadSurahAyahs(surahNumber) {
  // 1. Check local static data first - but only if we have the COMPLETE surah
  const surahMeta = SURAHS.find(s => s.number === surahNumber);
  const expectedCount = surahMeta?.ayahCount || 0;

  if (AYAHS[surahNumber] && AYAHS[surahNumber].length === expectedCount) {
    return { ayahs: AYAHS[surahNumber], source: 'local' };
  }

  // 2. Check AsyncStorage cache
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY_PREFIX + surahNumber);
    if (cached) {
      return { ayahs: JSON.parse(cached), source: 'cache' };
    }
  } catch {}

  // 3. Fetch from API
  const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch surah');

  const json = await response.json();
  const arabicEdition = json.data.find(d => d.edition.identifier === 'quran-uthmani');
  const englishEdition = json.data.find(d => d.edition.identifier === 'en.sahih');

  if (!arabicEdition || !englishEdition) throw new Error('Invalid API response');

  const ayahs = arabicEdition.ayahs.map((ar, i) => ({
    number: ar.numberInSurah,
    arabic: ar.text,
    english: englishEdition.ayahs[i].text,
  }));

  // Cache for offline use
  try {
    await AsyncStorage.setItem(CACHE_KEY_PREFIX + surahNumber, JSON.stringify(ayahs));
  } catch {}

  return { ayahs, source: 'api' };
}
