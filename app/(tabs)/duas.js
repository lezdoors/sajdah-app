import { useState, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, TextInput,
  Dimensions, StatusBar, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useApp } from '../../constants/AppContext';
import {
  Spacing, FontSize, FontWeight, BorderRadius, HeroGradients,
} from '../../constants/theme';
import { DUA_CATEGORIES } from '../../data/duas';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = Spacing.sm;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - CARD_GAP) / 2;

const FILTERS = [
  { key: 'all', label: 'all_categories' },
  { key: 'athkar', label: 'athkar_filter' },
  { key: 'daily', label: 'daily_filter' },
];

// Stagger delay between animated sections
const STAGGER_MS = 100;

export default function DuasScreen() {
  const { colors, shadows, isDark, t, isRTL } = useApp();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Staggered entrance animations — 4 sections
  const heroAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;

  const heroSlide = useRef(new Animated.Value(18)).current;
  const searchSlide = useRef(new Animated.Value(18)).current;
  const filterSlide = useRef(new Animated.Value(18)).current;
  const gridSlide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    const sections = [
      { opacity: heroAnim, translate: heroSlide },
      { opacity: searchAnim, translate: searchSlide },
      { opacity: filterAnim, translate: filterSlide },
      { opacity: gridAnim, translate: gridSlide },
    ];

    const animations = sections.map((s, i) =>
      Animated.parallel([
        Animated.timing(s.opacity, {
          toValue: 1,
          duration: 450,
          delay: i * STAGGER_MS,
          useNativeDriver: true,
        }),
        Animated.timing(s.translate, {
          toValue: 0,
          duration: 450,
          delay: i * STAGGER_MS,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(animations).start();
  }, []);

  const filteredCategories = useMemo(() => {
    let cats = DUA_CATEGORIES;

    // Filter by type
    if (activeFilter !== 'all') {
      cats = cats.filter((c) => c.type === activeFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cats = cats.filter((c) => {
        // Match category name
        if (c.name.toLowerCase().includes(q)) return true;
        // Match any dua content
        return c.duas.some(
          (d) =>
            d.english.toLowerCase().includes(q) ||
            d.transliteration.toLowerCase().includes(q) ||
            d.arabic.includes(searchQuery)
        );
      });
    }

    return cats;
  }, [activeFilter, searchQuery]);

  const totalDuas = useMemo(
    () => DUA_CATEGORIES.reduce((sum, c) => sum + c.duas.length, 0),
    []
  );

  // Pick a "daily dua" based on the day of the year
  const dailyDua = useMemo(() => {
    const allDuas = DUA_CATEGORIES.flatMap((c) => c.duas);
    if (allDuas.length === 0) return null;
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return allDuas[dayOfYear % allDuas.length];
  }, []);

  const rowDir = isRTL ? 'row-reverse' : 'row';

  function handleCategoryPress(category) {
    router.push({ pathname: '/dua-reader', params: { categoryId: category.id } });
  }

  function renderCategoryCard({ item, index }) {
    return (
      <Pressable
        onPress={() => handleCategoryPress(item)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.surface,
            width: CARD_WIDTH,
            marginLeft: index % 2 === 0 ? 0 : CARD_GAP,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.9 : 1,
          },
          shadows.card,
        ]}
      >
        {/* Colored left accent stripe */}
        <View
          style={[
            styles.cardAccentStripe,
            { backgroundColor: colors.accent },
            isRTL && { left: undefined, right: 0 },
          ]}
        />

        <View
          style={[
            styles.cardContent,
            { paddingLeft: isRTL ? Spacing.sm : Spacing.sm + 4 },
            isRTL && { paddingRight: Spacing.sm + 4, paddingLeft: Spacing.sm },
          ]}
        >
          <Text
            style={[
              styles.cardName,
              { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' },
            ]}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <View style={[styles.cardFooter, { flexDirection: rowDir }]}>
            <View style={[styles.duaCountBadge, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.duaCountText, { color: colors.accent }]}>
                {item.duas.length} {t('duas_count')}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Hero Banner */}
              <Animated.View
                style={[
                  styles.heroBannerWrapper,
                  { opacity: heroAnim, transform: [{ translateY: heroSlide }] },
                ]}
              >
                <LinearGradient
                  colors={HeroGradients.duas}
                  style={styles.heroBanner}
                  start={{x:0,y:0}}
                  end={{x:1,y:1}}
                >
                  <View style={styles.heroGradient}>
                    <Text style={styles.heroTitle}>{t('duas_title')}</Text>
                    <Text style={styles.heroSubtitle}>
                      {totalDuas} {t('duas_count')}
                    </Text>
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Daily Dua Card */}
              {dailyDua && (
                <Animated.View
                  style={[
                    styles.dailyDuaWrapper,
                    { opacity: heroAnim, transform: [{ translateY: heroSlide }] },
                  ]}
                >
                  <View style={[styles.dailyDuaCard, { backgroundColor: colors.accent }]}>
                    <Text style={styles.dailyDuaLabel}>{t('daily_dua') || 'Daily Dua'}</Text>
                    <Text style={styles.dailyDuaArabic} numberOfLines={2}>
                      {dailyDua.arabic}
                    </Text>
                    <Text style={styles.dailyDuaEnglish} numberOfLines={3}>
                      {dailyDua.english}
                    </Text>
                  </View>
                </Animated.View>
              )}

              {/* Search Bar */}
              <Animated.View
                style={[
                  styles.searchWrapper,
                  { opacity: searchAnim, transform: [{ translateY: searchSlide }] },
                ]}
              >
                <View
                  style={[
                    styles.searchInner,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.surfaceBorder,
                      flexDirection: rowDir,
                    },
                    shadows.soft,
                  ]}
                >
                  <Search size={18} color={colors.textTertiary} strokeWidth={1.5} />
                  <TextInput
                    style={[
                      styles.searchInput,
                      {
                        color: colors.textPrimary,
                        textAlign: isRTL ? 'right' : 'left',
                      },
                    ]}
                    placeholder={t('search_duas')}
                    placeholderTextColor={colors.textTertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                      <X size={18} color={colors.textTertiary} strokeWidth={1.5} />
                    </Pressable>
                  )}
                </View>
              </Animated.View>

              {/* Filter Chips */}
              <Animated.View
                style={[
                  styles.filterRow,
                  {
                    flexDirection: rowDir,
                    opacity: filterAnim,
                    transform: [{ translateY: filterSlide }],
                  },
                ]}
              >
                {FILTERS.map((filter) => {
                  const isActive = activeFilter === filter.key;
                  return (
                    <Pressable
                      key={filter.key}
                      onPress={() => setActiveFilter(filter.key)}
                      style={({ pressed }) => [
                        styles.filterChip,
                        {
                          backgroundColor: isActive ? colors.accent : colors.surface,
                          borderColor: isActive ? colors.accent : colors.surfaceBorder,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: isActive ? '#FFFFFF' : colors.textSecondary },
                        ]}
                      >
                        {t(filter.label)}
                      </Text>
                    </Pressable>
                  );
                })}
              </Animated.View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                {t('no_duas_found')}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Hero Banner
  heroBannerWrapper: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  heroBanner: {
    height: 160,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  heroTitle: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  // Daily Dua Card
  dailyDuaWrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  dailyDuaCard: {
    borderRadius: 16,
    padding: 20,
  },
  dailyDuaLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.bold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dailyDuaArabic: {
    fontSize: 22,
    fontWeight: FontWeight.medium,
    color: '#FFFFFF',
    textAlign: 'right',
    lineHeight: 36,
    marginBottom: 8,
  },
  dailyDuaEnglish: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },

  // Search
  searchWrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.body,
    height: '100%',
    marginHorizontal: Spacing.xs,
  },

  // Filter chips
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.medium,
  },

  // Grid
  gridContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 120,
  },
  gridRow: {
    marginBottom: CARD_GAP,
  },

  // Card
  card: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  cardAccentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius.md,
  },
  cardContent: {
    padding: Spacing.sm,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  cardName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    lineHeight: 22,
  },
  cardFooter: {
    marginTop: Spacing.xs,
    alignItems: 'flex-start',
  },
  duaCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  duaCountText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
  },

  // Empty
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.body,
  },
});
