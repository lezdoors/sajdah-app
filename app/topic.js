import { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useApp } from '../constants/AppContext';
import {
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Images,
} from '../constants/theme';
import { DAILY_HADITHS } from '../data/hadith';

const HERO_HEIGHT = 220;
const SECTION_COUNT = 2; // hero, list

export default function TopicScreen() {
  const { colors, t, isRTL } = useApp();
  const router = useRouter();
  const { topic } = useLocalSearchParams();

  // Filter hadiths by the topic param
  const hadiths = useMemo(() => {
    if (!topic) return [];
    return DAILY_HADITHS.filter((h) => h.topic === topic);
  }, [topic]);

  const topicLabel = topic
    ? topic.charAt(0).toUpperCase() + topic.slice(1)
    : '';

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

  // Stagger each card with its own animation
  const cardAnimValues = useRef(
    hadiths.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Start card animations after hero settles
    const timer = setTimeout(() => {
      const cardAnimations = cardAnimValues.map((anim, i) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: i * 80,
          useNativeDriver: true,
        })
      );
      Animated.stagger(80, cardAnimations).start();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getCardAnimStyle = (index) => ({
    opacity: cardAnimValues[index] || 0,
    transform: [
      {
        translateY: (cardAnimValues[index] || new Animated.Value(0)).interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  const renderHadith = ({ item, index }) => (
    <Animated.View style={[styles.hadithCard, { backgroundColor: colors.surfaceElevated }, getCardAnimStyle(index)]}>
      <Text style={[styles.hadithArabic, { color: colors.textPrimary }]}>
        {item.arabic}
      </Text>
      <Text
        style={[
          styles.hadithEnglish,
          { color: colors.textSecondary },
          isRTL && styles.textRTL,
        ]}
      >
        {item.english}
      </Text>
      <Text
        style={[
          styles.hadithMeta,
          { color: colors.textTertiary },
          isRTL && styles.textRTL,
        ]}
      >
        {item.narrator} — {item.source}
      </Text>
    </Animated.View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const keyExtractor = (item, index) => `${item.source}-${index}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Image Header */}
      <Animated.View style={getAnimStyle(0)}>
        <ImageBackground
          source={Images.mosqueArch}
          style={styles.hero}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.heroGradient}
          >
            <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={[styles.heroBackButton, isRTL && styles.heroBackButtonRTL]}
              >
                <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </SafeAreaView>

            <View style={[styles.heroTitleContainer, isRTL && styles.heroTitleContainerRTL]}>
              <Text style={styles.heroTitle}>{topicLabel}</Text>
              <Text style={styles.heroSubtitle}>
                {hadiths.length} {hadiths.length === 1 ? t('hadith_singular') : t('hadith_plural')}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>

      {/* Section label */}
      <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textTertiary },
            isRTL && styles.textRTL,
          ]}
        >
          {t('hadiths_on_topic')} {topicLabel}
        </Text>
      </View>

      {/* Hadiths list */}
      <Animated.View style={[{ flex: 1 }, getAnimStyle(1)]}>
        <FlatList
          data={hadiths}
          renderItem={renderHadith}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
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
  heroSafeArea: {},
  heroBackButton: {
    position: 'absolute',
    top: 48,
    left: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    fontFamily: 'Amiri-Bold',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.regular,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  sectionLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // Hadith card
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

  // Separator
  separator: {
    height: Spacing.sm,
  },

  // RTL
  textRTL: {
    textAlign: 'right',
  },
});
