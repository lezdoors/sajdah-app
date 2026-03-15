import { useState, useRef, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable,
  Dimensions, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Minus, Plus, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useApp } from '../constants/AppContext';
import {
  Spacing, FontSize, FontWeight, BorderRadius,
} from '../constants/theme';
import { getCategoryById } from '../data/duas';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DuaReaderScreen() {
  const { colors, isDark, t, isRTL } = useApp();
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();

  const category = getCategoryById(categoryId);
  const duas = category?.duas || [];
  const totalDuas = duas.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState(() => duas.map(() => 0));
  const flatListRef = useRef(null);

  const rowDir = isRTL ? 'row-reverse' : 'row';

  const handleIncrement = useCallback((index) => {
    setCounts((prev) => {
      const next = [...prev];
      const target = duas[index]?.count || 1;
      if (next[index] < target) {
        next[index] = next[index] + 1;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Auto-advance when count reaches target
        if (next[index] >= target && index < totalDuas - 1) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
            setCurrentIndex(index + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }, 400);
        } else if (next[index] >= target && index === totalDuas - 1) {
          // Last dua completed
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
      return next;
    });
  }, [duas, totalDuas]);

  const handleDecrement = useCallback((index) => {
    setCounts((prev) => {
      const next = [...prev];
      if (next[index] > 0) {
        next[index] = next[index] - 1;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return next;
    });
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  function renderDuaCard({ item, index }) {
    const target = item.count || 1;
    const current = counts[index] || 0;
    const isComplete = current >= target;

    return (
      <View style={[styles.duaPage, { width: SCREEN_WIDTH }]}>
        <View
          style={[
            styles.duaCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          {/* Arabic Text */}
          <View style={styles.arabicSection}>
            <Text
              style={[
                styles.arabicText,
                { color: colors.textPrimary },
              ]}
            >
              {item.arabic}
            </Text>
          </View>

          {/* Transliteration */}
          <Text
            style={[
              styles.transliterationText,
              { color: colors.sage },
            ]}
          >
            {item.transliteration}
          </Text>

          {/* Divider */}
          <View style={[styles.cardDivider, { backgroundColor: colors.divider }]} />

          {/* English Translation */}
          <Text
            style={[
              styles.englishText,
              { color: colors.textSecondary },
            ]}
          >
            {item.english}
          </Text>

          {/* Counter Section */}
          <View style={styles.counterSection}>
            {/* Counter Label */}
            <Text style={[styles.counterLabel, { color: colors.textTertiary }]}>
              {t('repetitions')}: {target}
            </Text>

            {/* Counter Controls */}
            <View style={[styles.counterControls, { flexDirection: rowDir }]}>
              <Pressable
                onPress={() => handleDecrement(index)}
                style={[
                  styles.counterButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.surfaceBorder,
                    opacity: current === 0 ? 0.4 : 1,
                  },
                ]}
                disabled={current === 0}
              >
                <Minus size={20} color={colors.textSecondary} strokeWidth={2} />
              </Pressable>

              <View
                style={[
                  styles.counterDisplay,
                  {
                    backgroundColor: isComplete ? colors.accent : colors.background,
                    borderColor: isComplete ? colors.accent : colors.surfaceBorder,
                  },
                ]}
              >
                {isComplete ? (
                  <Check size={24} color="#FFFFFF" strokeWidth={2.5} />
                ) : (
                  <Text
                    style={[
                      styles.counterNumber,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {current}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() => handleIncrement(index)}
                style={[
                  styles.counterButton,
                  {
                    backgroundColor: isComplete ? colors.accentLight : colors.accent,
                    borderColor: isComplete ? colors.surfaceBorder : colors.accent,
                  },
                ]}
                disabled={isComplete}
              >
                <Plus
                  size={20}
                  color={isComplete ? colors.textTertiary : '#FFFFFF'}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // No category found fallback
  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView edges={['top']} style={styles.fallback}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.textPrimary} strokeWidth={1.5} />
          </Pressable>
          <Text style={[styles.fallbackText, { color: colors.textSecondary }]}>
            Category not found
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rowDir }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <ChevronLeft size={28} color={colors.textPrimary} strokeWidth={1.5} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text
              style={[styles.headerTitle, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {category.name}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
              {currentIndex + 1} / {totalDuas}
            </Text>
          </View>

          {/* Spacer to balance the back button */}
          <View style={styles.backButton} />
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarBg, { backgroundColor: colors.divider }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: colors.accent,
                width: `${totalDuas > 0 ? ((currentIndex + 1) / totalDuas) * 100 : 0}%`,
              },
            ]}
          />
        </View>

        {/* Horizontal Dua Pager */}
        <FlatList
          ref={flatListRef}
          data={duas}
          renderItem={renderDuaCard}
          keyExtractor={(_, index) => `dua-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="start"
        />

        {/* Bottom Dots Indicator */}
        {totalDuas > 1 && (
          <View style={styles.dotsContainer}>
            <View style={[styles.dotsRow, { flexDirection: rowDir }]}>
              {duas.map((_, index) => {
                const isCurrent = index === currentIndex;
                const isDone = (counts[index] || 0) >= (duas[index]?.count || 1);
                return (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isDone
                          ? colors.accent
                          : isCurrent
                            ? colors.gold
                            : colors.divider,
                        width: isCurrent ? 24 : 8,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        )}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  backButton: {
    width: Spacing.xxl,
    height: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },

  // Progress bar
  progressBarBg: {
    height: 3,
    width: '100%',
  },
  progressBarFill: {
    height: 3,
    borderRadius: 2,
  },

  // Dua page
  duaPage: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  duaCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    maxHeight: '100%',
  },

  // Arabic
  arabicSection: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 52,
    fontWeight: FontWeight.regular,
    writingDirection: 'rtl',
  },

  // Transliteration
  transliterationText: {
    fontSize: FontSize.bodySmall,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  // Divider
  cardDivider: {
    height: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  // English
  englishText: {
    fontSize: FontSize.body,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  // Counter
  counterSection: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 0,
  },
  counterLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
    textTransform: 'capitalize',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  counterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  counterDisplay: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  counterNumber: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },

  // Dots
  dotsContainer: {
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.lg,
    paddingTop: Spacing.sm,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // Fallback
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: FontSize.body,
    marginTop: Spacing.sm,
  },
});
