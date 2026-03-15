import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search } from 'lucide-react-native';
import { useApp } from '../constants/AppContext';
import {
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Images,
} from '../constants/theme';
import { NAMES_OF_ALLAH } from '../data/names';

const HERO_HEIGHT = 160;
const SECTION_COUNT = 3; // hero, search, list

export default function NamesScreen() {
  const { colors, isDark, t, isRTL } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Staggered entrance animations
  const animValues = useRef(
    Array.from({ length: SECTION_COUNT }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = animValues.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: i * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, []);

  const getAnimStyle = (index) => ({
    opacity: animValues[index],
    transform: [
      {
        translateY: animValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  });

  const filteredNames = useMemo(() => {
    if (!searchQuery.trim()) return NAMES_OF_ALLAH;
    const q = searchQuery.toLowerCase().trim();
    return NAMES_OF_ALLAH.filter(
      (name) =>
        name.transliteration.toLowerCase().includes(q) ||
        name.meaning.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const renderItem = useCallback(
    ({ item }) => (
      <View
        style={[
          styles.nameCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <View style={[styles.nameRow, isRTL && styles.nameRowRTL]}>
          {/* Number badge */}
          <View
            style={[
              styles.numberBadge,
              {
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.numberText,
                { color: colors.textTertiary },
              ]}
            >
              {item.number}
            </Text>
          </View>

          {/* Name content */}
          <View style={[styles.nameContent, isRTL && styles.nameContentRTL]}>
            <Text
              style={[
                styles.arabicName,
                { color: colors.textPrimary },
              ]}
            >
              {item.arabic}
            </Text>
            <Text
              style={[
                styles.transliteration,
                { color: colors.textPrimary },
                isRTL && styles.textRTL,
              ]}
            >
              {item.transliteration}
            </Text>
            <Text
              style={[
                styles.meaning,
                { color: colors.textSecondary },
                isRTL && styles.textRTL,
              ]}
            >
              {item.meaning}
            </Text>
          </View>
        </View>
      </View>
    ),
    [colors, isRTL]
  );

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  const keyExtractor = useCallback(
    (item) => String(item.number),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Image Header */}
      <Animated.View style={getAnimStyle(0)}>
        <ImageBackground
          source={Images.heroMacca}
          style={styles.hero}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.heroGradient}
          >
            <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
              {/* Back button overlay */}
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={[styles.heroBackButton, isRTL && styles.heroBackButtonRTL]}
              >
                <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </SafeAreaView>

            {/* Title at bottom of hero */}
            <View style={[styles.heroTitleContainer, isRTL && styles.heroTitleContainerRTL]}>
              <Text style={styles.heroTitle}>99 Names of Allah</Text>
              <Text style={styles.heroSubtitle}>Al-Asma ul-Husna</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>

      {/* Search bar */}
      <Animated.View style={[styles.searchContainer, getAnimStyle(1)]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
            },
            isRTL && styles.searchBarRTL,
          ]}
        >
          <Search
            size={18}
            color={colors.textTertiary}
            strokeWidth={1.5}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                color: colors.textPrimary,
              },
              isRTL && styles.searchInputRTL,
            ]}
            placeholder={t('names_search')}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      </Animated.View>

      {/* Count */}
      <View style={styles.countRow}>
        <Text
          style={[
            styles.countText,
            { color: colors.textTertiary },
            isRTL && styles.textRTL,
          ]}
        >
          {filteredNames.length} / {NAMES_OF_ALLAH.length}
        </Text>
      </View>

      {/* Names list */}
      <Animated.View style={[{ flex: 1 }, getAnimStyle(2)]}>
        <FlatList
          data={filteredNames}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={15}
          maxToRenderPerBatch={10}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Hero
  hero: {
    height: HERO_HEIGHT,
    width: '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroSafeArea: {
    // just wraps the back button at the top
  },
  heroBackButton: {
    position: 'absolute',
    top: 4,
    left: Spacing.sm,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroBackButtonRTL: {
    left: undefined,
    right: Spacing.sm,
  },
  heroTitleContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  heroTitleContainerRTL: {
    alignItems: 'flex-end',
  },
  heroTitle: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  // Search
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 44,
    gap: 8,
  },
  searchBarRTL: {
    flexDirection: 'row-reverse',
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    paddingVertical: 0,
  },
  searchInputRTL: {
    textAlign: 'right',
  },

  // Count
  countRow: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  countText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // Name card
  nameCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  nameRowRTL: {
    flexDirection: 'row-reverse',
  },

  // Number badge
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
  },

  // Name content
  nameContent: {
    flex: 1,
    gap: 2,
  },
  nameContentRTL: {
    alignItems: 'flex-end',
  },
  arabicName: {
    fontSize: 28,
    fontWeight: FontWeight.medium,
    textAlign: 'right',
    lineHeight: 40,
  },
  transliteration: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
  },
  meaning: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
  },

  // Separator
  separator: {
    height: Spacing.xs,
  },

  // RTL
  textRTL: {
    textAlign: 'right',
  },
});
