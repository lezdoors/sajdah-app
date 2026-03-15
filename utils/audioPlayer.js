import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify' },
  { id: 'ar.minshawi', name: 'Al-Minshawi' },
];

const RECITER_KEY = 'alathan_reciter';
let soundInstance = null;

export function getReciters() {
  return RECITERS;
}

export async function getSelectedReciter() {
  try {
    const id = await AsyncStorage.getItem(RECITER_KEY);
    return id || 'ar.alafasy';
  } catch {
    return 'ar.alafasy';
  }
}

export async function setSelectedReciter(reciterId) {
  await AsyncStorage.setItem(RECITER_KEY, reciterId);
}

function getSurahAudioUrl(surahNumber, reciterId) {
  const padded = String(surahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${padded}.mp3`;
}

export async function playSurah(surahNumber, reciterId, onStatusUpdate) {
  // Stop any existing playback
  await stopPlayback();

  // Set audio mode for background playback
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });

  const url = getSurahAudioUrl(surahNumber, reciterId);

  const { sound } = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true },
    (status) => {
      if (onStatusUpdate) onStatusUpdate(status);
    }
  );

  soundInstance = sound;
  return sound;
}

export async function togglePlayPause() {
  if (!soundInstance) return;
  const status = await soundInstance.getStatusAsync();
  if (status.isLoaded) {
    if (status.isPlaying) {
      await soundInstance.pauseAsync();
    } else {
      await soundInstance.playAsync();
    }
  }
}

export async function seekTo(positionMillis) {
  if (!soundInstance) return;
  await soundInstance.setPositionAsync(positionMillis);
}

export async function stopPlayback() {
  if (soundInstance) {
    try {
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
    } catch {}
    soundInstance = null;
  }
}
