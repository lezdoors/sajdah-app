import { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Star, Circle, Compass, CalendarDays, ChevronRight } from 'lucide-react-native';
import { useApp } from '../../constants/AppContext';
import {
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Images,
  TopicColors,
  TopicColorsDark,
} from '../../constants/theme';
import { DAILY_HADITHS, getDailyHadith } from '../../data/hadith';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PADDING = Spacing.md;
const TOPIC_CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const FEATURE_CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const HERO_HEIGHT = 200;

// Number of animated sections for stagger
const SECTION_COUNT = 4;

export default function DiscoverScreen() {
  const { colors, isDark, t, isRTL } = useApp();
  const router = useRouter();
  const hadith = getDailyHadith();

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

  // Helper to get animated style for each section
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

  // Derive unique topics with counts
  const topicsData = useMemo(() => {
    const topicSet = [...new Set(DAILY_HADITHS.map((h) => h.topic))];
    return topicSet.map((topic) => ({
      key: topic,
      label: topic.charAt(0).toUpperCase() + topic.slice(1),
      count: DAILY_HADITHS.filter((h) => h.topic === topic).length,
    }));
  }, []);

  const featureCards = [
    {
      key: 'names',
      icon: Star,
      title: t('names_of_allah'),
      subtitle: t('names_subtitle'),
      route: '/names',
      image: Images.heroMacca,
    },
    {
      key: 'tasbih',
      icon: Circle,
      title: t('tasbih_title'),
      subtitle: t('tasbih_subtitle'),
      route: '/tasbih',
      image: Images.heroOrange,
    },
    {
      key: 'qibla',
      icon: Compass,
      title: t('qibla_title'),
      subtitle: t('qibla_subtitle'),
      route: '/qibla',
      image: Images.heroWhite,
    },
    {
      key: 'calendar',
      icon: CalendarDays,
      title: t('calendar_title'),
      subtitle: t('calendar_subtitle'),
      route: '/calendar',
      image: Images.heroPink,
    },
  ];

  const topicColorMap = isDark ? TopicColorsDark : TopicColors;
  const rowDir = isRTL ? 'row-reverse' : 'row';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Banner ── */}
          <Animated.View style={[styles.heroWrapper, getAnimStyle(0)]}>
            <ImageBackground
              source={Images.heroFinial}
              style={styles.heroBanner}
              imageStyle={styles.heroBannerImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.7)']}
                style={styles.heroOverlay}
              >
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>{t('discover_title')}</Text>
                  <Text style={styles.heroSubtitle}>
                    {t('browse_by_topic')}
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </Animated.View>

          {/* ── Featured Hadith ── */}
          <Animated.View style={[styles.section, getAnimStyle(1)]}>
            <View style={[styles.sectionHeader, { flexDirection: rowDir }]}>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: colors.textTertiary },
                  isRTL && styles.textRTL,
                ]}
              >
                {t('featured_hadith')}
              </Text>
            </View>
            <View
              style={[
                styles.hadithCard,
                {
                  backgroundColor: colors.surfaceElevated,
                },
              ]}
            >
              <Text
                style={[
                  styles.hadithArabic,
                  { color: colors.textPrimary },
                ]}
              >
                {hadith.arabic}
              </Text>
              <Text
                style={[
                  styles.hadithEnglish,
                  { color: colors.textSecondary },
                  isRTL && styles.textRTL,
                ]}
              >
                {hadith.english}
              </Text>
              <Text
                style={[
                  styles.hadithMeta,
                  { color: colors.textTertiary },
                  isRTL && styles.textRTL,
                ]}
              >
                {hadith.narrator} — {hadith.source}
              </Text>
            </View>
          </Animated.View>

          {/* ── Topics Grid ── */}
          <Animated.View style={[styles.section, getAnimStyle(2)]}>
            <View style={[styles.sectionHeader, { flexDirection: rowDir }]}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.textPrimary },
                  isRTL && styles.textRTL,
                ]}
              >
                {t('topics')}
              </Text>
              <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[styles.viewAll, { color: colors.textTertiary }]}>
                  {t('view_all')}
                </Text>
              </Pressable>
            </View>
            <View
              style={[
                styles.topicsGrid,
                isRTL && { flexDirection: 'row-reverse' },
              ]}
            >
              {topicsData.map((topic) => {
                const tc = topicColorMap[topic.key] || topicColorMap.faith;
                return (
                  <Pressable
                    key={topic.key}
                    onPress={() => {}}
                    style={({ pressed }) => [
                      styles.topicCard,
                      {
                        backgroundColor: tc.bg,
                        opacity: pressed ? 0.85 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                      },
                    ]}
                  >
                    <View style={styles.topicCardContent}>
                      <Text
                        style={[
                          styles.topicLabel,
                          { color: tc.text },
                          isRTL && styles.textRTL,
                        ]}
                      >
                        {topic.label}
                      </Text>
                      <Text
                        style={[
                          styles.topicCount,
                          { color: tc.text },
                          isRTL && styles.textRTL,
                        ]}
                      >
                        {topic.count} {topic.count === 1 ? t('hadith_singular') : t('hadith_plural')}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          {/* ── Features Grid ── */}
          <Animated.View style={[styles.section, getAnimStyle(3)]}>
            <View style={[styles.sectionHeader, { flexDirection: rowDir }]}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.textPrimary },
                  isRTL && styles.textRTL,
                ]}
              >
                {t('features')}
              </Text>
              <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[styles.viewAll, { color: colors.textTertiary }]}>
                  {t('view_all')}
                </Text>
              </Pressable>
            </View>
            <View
              style={[
                styles.featuresGrid,
                isRTL && { flexDirection: 'row-reverse' },
              ]}
            >
              {featureCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <Pressable
                    key={card.key}
                    onPress={() => router.push(card.route)}
                    style={({ pressed }) => [
                      styles.featureCard,
                      { opacity: pressed ? 0.85 : 1 },
                    ]}
                  >
                    <ImageBackground
                      source={card.image}
                      style={styles.featureCardBg}
                      imageStyle={styles.featureCardImage}
                    >
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.65)']}
                        style={styles.featureCardOverlay}
                      >
                        <IconComponent
                          size={20}
                          color="#FFFFFF"
                          strokeWidth={1.5}
                        />
                        <Text style={styles.featureCardTitle}>
                          {card.title}
                        </Text>
                      </LinearGradient>
                    </ImageBackground>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          {/* Bottom spacer for tab bar */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Hero Banner ──
  heroWrapper: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: Spacing.sm,
  },
  heroBanner: {
    height: HERO_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  heroBannerImage: {
    borderRadius: BorderRadius.lg,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  heroTextContainer: {},
  heroTitle: {
    fontSize: FontSize.h1,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: FontSize.body,
    color: 'rgba(255, 255, 255, 0.80)',
    marginTop: 4,
  },

  // ── Sections ──
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
  },
  viewAll: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
  },

  // ── Featured Hadith ──
  hadithCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  hadithArabic: {
    fontSize: 24,
    fontWeight: FontWeight.medium,
    lineHeight: 40,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  hadithEnglish: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  hadithMeta: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
  },

  // ── Topics Grid ──
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  topicCard: {
    width: TOPIC_CARD_WIDTH,
    height: 120,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  topicCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.sm,
  },
  topicLabel: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  topicCount: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    opacity: 0.8,
  },

  // ── Features Grid ──
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  featureCard: {
    width: FEATURE_CARD_WIDTH,
    height: 100,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  featureCardBg: {
    flex: 1,
  },
  featureCardImage: {
    borderRadius: BorderRadius.md,
  },
  featureCardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    gap: 4,
  },
  featureCardTitle: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },

  // ── RTL ──
  textRTL: {
    textAlign: 'right',
  },

  // ── Bottom spacer ──
  bottomSpacer: {
    height: Spacing.xxl,
  },
});
