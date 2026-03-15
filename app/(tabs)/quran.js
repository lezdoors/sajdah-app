import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, ScrollView, StyleSheet, Dimensions,
  ActivityIndicator, Pressable, TextInput, ImageBackground, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import {
  Search, X, ChevronLeft, Play, Pause, User, Check, CloudOff,
} from 'lucide-react-native';

import {
  Spacing, FontSize, FontWeight, BorderRadius, Gradients, Images,
} from '../../constants/theme';
import { useApp } from '../../constants/AppContext';
import { SURAHS } from '../../data/surahs';
import { loadSurahAyahs } from '../../utils/quranLoader';
import { setLastRead } from '../../utils/storage';
import {
  getReciters, getSelectedReciter, setSelectedReciter,
  playSurah, togglePlayPause, stopPlayback,
} from '../../utils/audioPlayer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.28;
const reciters = getReciters();

// -- Surah List View --

function SurahListView({ searchQuery, setSearchQuery, activeTab, setActiveTab, onSelectSurah }) {
  const { colors, shadows, isDark, t, isRTL } = useApp();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const filtered = SURAHS.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.meaning.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    );
  });

  const rowDir = isRTL ? 'row-reverse' : 'row';

  function renderSurahRow({ item }) {
    return (
      <Pressable onPress={() => onSelectSurah(item.number)}>
        <View style={[styles.surahRow, { flexDirection: rowDir }]}>
          <View style={[styles.surahNumberCircle, { backgroundColor: colors.accent }]}>
            <Text style={styles.surahNumberText}>{item.number}</Text>
          </View>
          <View style={[styles.surahInfo, isRTL ? { marginLeft: Spacing.sm } : { marginRight: Spacing.sm }]}>
            <Text style={[styles.surahEnglish, { color: colors.textPrimary }]}>{item.name}</Text>
            <Text style={[styles.surahMetaText, { color: colors.textTertiary }]}>{item.meaning} - {item.ayahCount} {t('ayahs')}</Text>
          </View>
          <Text style={[styles.surahArabic, { color: colors.gold }]}>{item.arabic}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <StatusBar barStyle="light-content" />

      {/* Hero Header */}
      <ImageBackground source={Images.quran} style={styles.heroHeader} resizeMode="cover">
        <LinearGradient colors={Gradients.heroMaskDark} style={styles.heroGradient}>
          <SafeAreaView edges={['top']} style={styles.heroInner}>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>{t('quran_title')}</Text>
              <Text style={styles.heroSubtitle}>{t('surahs_count')}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      {/* Search Bar */}
      <Animated.View style={[styles.searchWrapper, shadows.card, { opacity: fadeAnim }]}>
        <View style={[styles.searchInner, { backgroundColor: isDark ? colors.surfaceElevated : 'rgba(255,255,255,0.9)', borderColor: colors.surfaceBorder, flexDirection: rowDir }]}>
          <Search size={18} color={colors.textTertiary} strokeWidth={1.5} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('search_surahs')}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X size={18} color={colors.textTertiary} strokeWidth={1.5} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={[styles.tabRow, { flexDirection: rowDir }]}>
        <Pressable
          style={[styles.tabButton, activeTab === 'surah' && { borderBottomColor: colors.accent }]}
          onPress={() => setActiveTab('surah')}
        >
          <Text style={[styles.tabText, { color: colors.textTertiary }, activeTab === 'surah' && { color: colors.accent, fontWeight: FontWeight.semibold }]}>{t('surah')}</Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeTab === 'juz' && { borderBottomColor: colors.accent }]}
          onPress={() => setActiveTab('juz')}
        >
          <Text style={[styles.tabText, { color: colors.textTertiary }, activeTab === 'juz' && { color: colors.accent, fontWeight: FontWeight.semibold }]}>{t('juz')}</Text>
        </Pressable>
      </View>

      {/* Surah List */}
      <FlatList
        data={filtered}
        renderItem={renderSurahRow}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{t('no_surahs')}</Text>
          </View>
        }
      />
    </View>
  );
}

// -- Reading View --

function ReadingView({ surahNumber, onBack }) {
  const { colors, shadows, isDark, t, isRTL } = useApp();
  const surah = SURAHS.find((s) => s.number === surahNumber);

  const [ayahs, setAyahs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioPosition, setAudioPosition] = useState(0);
  const [selectedReciter, setReciter] = useState('ar.alafasy');
  const [showReciterPicker, setShowReciterPicker] = useState(false);

  const rowDir = isRTL ? 'row-reverse' : 'row';

  useEffect(() => {
    let mounted = true;
    loadSurahAyahs(surahNumber)
      .then(({ ayahs: data }) => {
        if (mounted) {
          setAyahs(data);
          setLoading(false);
          // Track reading progress for "Continue Reading" on home screen
          setLastRead(surahNumber, 1);
        }
      })
      .catch(() => { if (mounted) { setError(t('load_error')); setLoading(false); } });
    return () => { mounted = false; };
  }, [surahNumber]);

  useEffect(() => {
    getSelectedReciter().then(setReciter);
    return () => { stopPlayback(); };
  }, []);

  function retry() {
    setLoading(true);
    setError(null);
    loadSurahAyahs(surahNumber)
      .then(({ ayahs: data }) => { setAyahs(data); setLoading(false); })
      .catch(() => { setError(t('load_error')); setLoading(false); });
  }

  async function handlePlayPause() {
    if (isPlaying) {
      await togglePlayPause();
      setIsPlaying(false);
    } else if (audioPosition > 0) {
      await togglePlayPause();
      setIsPlaying(true);
    } else {
      setIsAudioLoading(true);
      try {
        await playSurah(surahNumber, selectedReciter, (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setAudioProgress(status.durationMillis ? status.positionMillis / status.durationMillis : 0);
            setAudioDuration(status.durationMillis || 0);
            setAudioPosition(status.positionMillis || 0);
            if (status.didJustFinish) { setIsPlaying(false); setAudioProgress(0); setAudioPosition(0); }
          }
        });
        setIsAudioLoading(false);
      } catch { setIsAudioLoading(false); }
    }
  }

  async function handleReciterChange(reciterId) {
    setReciter(reciterId);
    await setSelectedReciter(reciterId);
    setShowReciterPicker(false);
    if (isPlaying || audioPosition > 0) {
      setAudioPosition(0);
      setAudioProgress(0);
      setIsPlaying(false);
      await stopPlayback();
    }
  }

  function formatDuration(millis) {
    if (!millis) return '0:00';
    const totalSec = Math.floor(millis / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Reading Header */}
      <View style={[styles.readingHeader, { backgroundColor: colors.surface, flexDirection: rowDir }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={28} color={colors.textPrimary} strokeWidth={1.5} />
        </Pressable>
        <View style={styles.readingHeaderCenter}>
          <Text style={[styles.readingTitle, { color: colors.textPrimary }]}>{surah?.name}</Text>
          <Text style={[styles.readingSubtitle, { color: colors.textSecondary }]}>{surah?.ayahCount} {t('ayahs')}</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <View style={[styles.headerDivider, { backgroundColor: colors.divider }]} />

      {/* Loading */}
      {loading && (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingStateText, { color: colors.textSecondary }]}>{t('loading_surah')}</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorState}>
          <CloudOff size={48} color={colors.textTertiary} strokeWidth={1.5} />
          <Text style={[styles.errorStateText, { color: colors.textSecondary }]}>{error}</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: colors.accent }]} onPress={retry}>
            <Text style={styles.retryText}>{t('try_again')}</Text>
          </Pressable>
        </View>
      )}

      {/* Ayahs */}
      {!loading && !error && ayahs && ayahs.length > 0 && (
        <ScrollView style={styles.readingScroll} contentContainerStyle={styles.readingContent} showsVerticalScrollIndicator={false}>
          {/* Bismillah */}
          {surahNumber !== 9 && surahNumber !== 1 && (
            <Text style={[styles.bismillah, { color: colors.gold }]}>
              {'\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650'}
            </Text>
          )}

          {ayahs.map((ayah) => (
            <View key={ayah.number} style={styles.ayahBlock}>
              <Text style={[styles.ayahArabic, { color: colors.textPrimary }]}>{ayah.arabic}</Text>
              <View style={[styles.ayahNumberBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.ayahNumberText}>{ayah.number}</Text>
              </View>
              <Text style={[styles.ayahEnglish, { color: colors.textSecondary }]}>{ayah.english}</Text>
              <View style={[styles.ayahDivider, { backgroundColor: colors.divider }]} />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Audio Player Bar */}
      <View style={[styles.audioBar, { backgroundColor: colors.surface, borderTopColor: colors.divider }]}>
        <View style={[styles.audioProgressBg, { backgroundColor: colors.divider }]}>
          <View style={[styles.audioProgressFill, { width: `${audioProgress * 100}%`, backgroundColor: colors.accent }]} />
        </View>
        <View style={[styles.audioControls, { flexDirection: rowDir }]}>
          <Pressable style={[styles.reciterButton, { flexDirection: rowDir }]} onPress={() => setShowReciterPicker(!showReciterPicker)}>
            <User size={16} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={[styles.reciterName, { color: colors.textSecondary }]} numberOfLines={1}>
              {reciters.find((r) => r.id === selectedReciter)?.name || 'Alafasy'}
            </Text>
          </Pressable>

          <Pressable style={[styles.playButton, { backgroundColor: colors.accent }]} onPress={handlePlayPause} disabled={isAudioLoading}>
            {isAudioLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : isPlaying ? (
              <Pause size={24} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </Pressable>

          <Text style={[styles.audioDuration, { color: colors.textTertiary, textAlign: isRTL ? 'left' : 'right' }]}>
            {formatDuration(audioPosition)} / {formatDuration(audioDuration)}
          </Text>
        </View>
      </View>

      {/* Reciter Picker */}
      {showReciterPicker && (
        <View style={[styles.reciterPicker, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }, shadows.cardLifted]}>
          {reciters.map((r) => (
            <Pressable
              key={r.id}
              style={[styles.reciterOption, { borderBottomColor: colors.divider }, selectedReciter === r.id && { backgroundColor: colors.accentLight }]}
              onPress={() => handleReciterChange(r.id)}
            >
              <Text style={[styles.reciterOptionText, { color: colors.textPrimary }, selectedReciter === r.id && { color: colors.accent, fontWeight: FontWeight.semibold }]}>
                {r.name}
              </Text>
              {selectedReciter === r.id && <Check size={18} color={colors.accent} strokeWidth={2} />}
            </Pressable>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

// -- Main Screen --

export default function QuranScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [activeTab, setActiveTab] = useState('surah');

  if (selectedSurah !== null) {
    return <ReadingView surahNumber={selectedSurah} onBack={() => setSelectedSurah(null)} />;
  }

  return (
    <SurahListView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onSelectSurah={setSelectedSurah}
    />
  );
}

// -- Styles --

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  heroHeader: { height: HEADER_HEIGHT, width: '100%' },
  heroGradient: { flex: 1, justifyContent: 'flex-end' },
  heroInner: { flex: 1, justifyContent: 'flex-end' },
  heroTextBlock: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  heroTitle: { fontSize: FontSize.h1, fontWeight: FontWeight.bold, color: '#FFFFFF', letterSpacing: -0.5 },
  heroSubtitle: { fontSize: FontSize.bodySmall, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  // Search
  searchWrapper: { marginTop: -28, marginHorizontal: Spacing.md, borderRadius: BorderRadius.full, overflow: 'hidden' },
  searchInner: { flexDirection: 'row', alignItems: 'center', height: 52, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: FontSize.body, height: '100%', marginLeft: Spacing.xs },

  // Tabs
  tabRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, marginTop: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.lg },
  tabButton: { paddingBottom: Spacing.xs, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: FontSize.body, fontWeight: FontWeight.medium },

  // Surah list
  listContent: { paddingBottom: 100 },
  surahRow: { flexDirection: 'row', alignItems: 'center', height: 80, paddingHorizontal: Spacing.md },
  surahNumberCircle: { width: 40, height: 40, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  surahNumberText: { fontSize: FontSize.bodySmall, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  surahInfo: { flex: 1, marginRight: Spacing.sm },
  surahEnglish: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, marginBottom: 4 },
  surahMetaText: { fontSize: FontSize.caption },
  surahArabic: { fontSize: FontSize.h3, fontWeight: FontWeight.bold, textAlign: 'right', letterSpacing: 1 },
  divider: { height: 1, marginLeft: Spacing.md + 40 + Spacing.sm, marginRight: Spacing.md },

  // Empty
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxl },
  emptyText: { fontSize: FontSize.body },

  // Reading header
  readingHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm },
  backButton: { width: Spacing.xxl, height: Spacing.xxl, alignItems: 'center', justifyContent: 'center' },
  readingHeaderCenter: { flex: 1, alignItems: 'center' },
  readingTitle: { fontSize: FontSize.h3, fontWeight: FontWeight.semibold, letterSpacing: -0.3 },
  readingSubtitle: { fontSize: FontSize.bodySmall, marginTop: 2 },
  headerDivider: { height: 1 },

  // Reading content
  readingScroll: { flex: 1 },
  readingContent: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: 120 },
  bismillah: { fontSize: FontSize.h3, textAlign: 'center', lineHeight: 48, marginBottom: Spacing.lg, fontWeight: FontWeight.medium },

  // Ayah
  ayahBlock: { alignItems: 'center', marginBottom: Spacing.md },
  ayahArabic: { fontSize: 24, textAlign: 'center', lineHeight: 48, marginBottom: Spacing.xs },
  ayahNumberBadge: { width: 24, height: 24, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  ayahNumberText: { fontSize: FontSize.nav, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  ayahEnglish: { fontSize: FontSize.bodySmall, textAlign: 'center', lineHeight: 22, paddingHorizontal: Spacing.sm },
  ayahDivider: { width: Spacing.xl, height: 0.5, marginTop: Spacing.sm },

  // Loading / Error
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  loadingStateText: { fontSize: FontSize.body },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  errorStateText: { fontSize: FontSize.body, textAlign: 'center', lineHeight: 24 },
  retryButton: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, marginTop: Spacing.xs },
  retryText: { fontSize: FontSize.body, fontWeight: FontWeight.semibold, color: '#FFFFFF' },

  // Audio bar
  audioBar: { borderTopWidth: 1, paddingBottom: Spacing.sm },
  audioProgressBg: { height: 3 },
  audioProgressFill: { height: 3, borderRadius: 2 },
  audioControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  reciterButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flex: 1 },
  reciterName: { fontSize: FontSize.caption, fontWeight: FontWeight.medium },
  playButton: { width: Spacing.xxl, height: Spacing.xxl, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center' },
  audioDuration: { fontSize: FontSize.caption, fontWeight: FontWeight.medium, flex: 1, textAlign: 'right' },

  // Reciter picker
  reciterPicker: { position: 'absolute', bottom: 72, left: Spacing.md, right: Spacing.md, borderRadius: BorderRadius.lg, overflow: 'hidden', borderWidth: 1 },
  reciterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  reciterOptionText: { fontSize: FontSize.bodySmall },
});
