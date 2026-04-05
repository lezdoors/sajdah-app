import { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useApp } from '../constants/AppContext';
import {
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Images,
} from '../constants/theme';
import {
  gregorianToHijri,
  formatHijriDate,
  getHijriMonthName,
} from '../utils/hijri';

const HERO_HEIGHT = 220;
const SECTION_COUNT = 3; // hero, today card, notable dates

const NOTABLE_DATES = [
  {
    month: 1,
    day: 1,
    name: 'Islamic New Year',
    nameAr: 'رأس السنة الهجرية',
    description: 'The beginning of a new Hijri year, a time for reflection and renewal.',
  },
  {
    month: 1,
    day: 10,
    name: 'Day of Ashura',
    nameAr: 'يوم عاشوراء',
    description: 'A day of fasting and remembrance, marking the deliverance of Musa (AS).',
  },
  {
    month: 3,
    day: 12,
    name: 'Mawlid an-Nabi',
    nameAr: 'المولد النبوي',
    description: 'Commemorating the birth of Prophet Muhammad (PBUH).',
  },
  {
    month: 7,
    day: 27,
    name: 'Isra and Mi\'raj',
    nameAr: 'الإسراء والمعراج',
    description: 'The night journey and ascension of the Prophet (PBUH).',
  },
  {
    month: 8,
    day: 15,
    name: 'Laylat al-Bara\'at',
    nameAr: 'ليلة البراءة',
    description: 'The night of forgiveness, mid-Shaban observance.',
  },
  {
    month: 9,
    day: 1,
    name: 'Start of Ramadan',
    nameAr: 'بداية رمضان',
    description: 'The blessed month of fasting, prayer, and spiritual growth.',
  },
  {
    month: 9,
    day: 27,
    name: 'Laylat al-Qadr',
    nameAr: 'ليلة القدر',
    description: 'The Night of Decree, better than a thousand months.',
  },
  {
    month: 10,
    day: 1,
    name: 'Eid al-Fitr',
    nameAr: 'عيد الفطر',
    description: 'The festival of breaking the fast, celebrating the end of Ramadan.',
  },
  {
    month: 12,
    day: 10,
    name: 'Eid al-Adha',
    nameAr: 'عيد الأضحى',
    description: 'The festival of sacrifice, honoring the devotion of Ibrahim (AS).',
  },
];

function getDaysUntilHijri(targetMonth, targetDay, currentHijriDate) {
  // Approximate: Hijri months are ~29.5 days
  const HIJRI_MONTH_DAYS = 29.5;
  let currentDayOfYear = (currentHijriDate.month - 1) * HIJRI_MONTH_DAYS + currentHijriDate.day;
  let targetDayOfYear = (targetMonth - 1) * HIJRI_MONTH_DAYS + targetDay;
  let diff = targetDayOfYear - currentDayOfYear;
  if (diff < 0) diff += Math.round(12 * HIJRI_MONTH_DAYS); // Next year
  return Math.round(diff);
}

export default function CalendarScreen() {
  const { colors, isDark, t, isRTL } = useApp();
  const router = useRouter();

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

  const hijriDate = useMemo(() => gregorianToHijri(), []);
  const formattedHijri = useMemo(() => formatHijriDate(), []);
  const hijriMonthName = useMemo(
    () => getHijriMonthName(hijriDate.month),
    [hijriDate.month]
  );

  const gregorianFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero Image Header */}
      <Animated.View style={getAnimStyle(0)}>
        <ImageBackground
          source={Images.hassan2Arch}
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
              <Text style={styles.heroTitle}>{t('hijri_calendar')}</Text>
              <Text style={styles.heroSubtitle}>{formattedHijri}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
          {/* Today's date card */}
          <Animated.View
            style={[
              styles.todayCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.surfaceBorder,
              },
              getAnimStyle(1),
            ]}
          >
            <Text
              style={[
                styles.todayLabel,
                { color: colors.textTertiary },
                isRTL && styles.textRTL,
              ]}
            >
              {t('today')}
            </Text>

            {/* Hijri day number */}
            <Text style={[styles.hijriDay, { color: colors.textPrimary }]}>
              {hijriDate.day}
            </Text>

            {/* Month name */}
            <Text
              style={[
                styles.hijriMonth,
                { color: colors.accent },
              ]}
            >
              {hijriMonthName}
            </Text>

            {/* Full Hijri date */}
            <Text
              style={[
                styles.hijriFullDate,
                { color: colors.textPrimary },
              ]}
            >
              {formattedHijri}
            </Text>

            {/* Gregorian date */}
            <Text
              style={[
                styles.gregorianDate,
                { color: colors.textSecondary },
                isRTL && styles.textRTL,
              ]}
            >
              {gregorianFormatted}
            </Text>
          </Animated.View>

          {/* Notable Dates */}
          <Animated.View style={[styles.section, getAnimStyle(2)]}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textPrimary },
                isRTL && styles.textRTL,
              ]}
            >
              {t('notable_dates')}
            </Text>

            {NOTABLE_DATES.map((event, index) => {
              const isCurrentMonth = event.month === hijriDate.month;
              return (
                <View
                  key={`${event.month}-${event.day}`}
                  style={[
                    styles.eventCard,
                    {
                      backgroundColor: isCurrentMonth
                        ? isDark
                          ? 'rgba(255, 0, 131, 0.06)'
                          : 'rgba(255, 0, 131, 0.04)'
                        : colors.surface,
                      borderColor: isCurrentMonth
                        ? isDark
                          ? 'rgba(255, 0, 131, 0.20)'
                          : 'rgba(255, 0, 131, 0.25)'
                        : colors.surfaceBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.eventRow,
                      isRTL && styles.eventRowRTL,
                    ]}
                  >
                    {/* Date badge */}
                    <View
                      style={[
                        styles.dateBadge,
                        {
                          borderColor: isCurrentMonth
                            ? isDark
                              ? '#FF4DAB'
                              : '#FF0083'
                            : colors.surfaceBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateBadgeDay,
                          {
                            color: isCurrentMonth
                              ? isDark
                                ? '#FF4DAB'
                                : '#FF0083'
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {event.day}
                      </Text>
                      <Text
                        style={[
                          styles.dateBadgeMonth,
                          {
                            color: isCurrentMonth
                              ? isDark
                                ? '#FF4DAB'
                                : '#CC0069'
                              : colors.textTertiary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {getHijriMonthName(event.month).split(' ')[0]}
                      </Text>
                    </View>

                    {/* Event details */}
                    <View
                      style={[
                        styles.eventContent,
                        isRTL && styles.eventContentRTL,
                      ]}
                    >
                      <Text
                        style={[
                          styles.eventName,
                          { color: colors.textPrimary },
                          isRTL && styles.textRTL,
                        ]}
                      >
                        {isRTL ? event.nameAr : event.name}
                      </Text>
                      {!isCurrentMonth && (
                        <Text style={[styles.eventDaysUntil, { color: colors.accent }, isRTL && styles.textRTL]}>
                          {getDaysUntilHijri(event.month, event.day, hijriDate) === 0
                            ? t('today')
                            : `${getDaysUntilHijri(event.month, event.day, hijriDate)} ${t('days_away')}`}
                        </Text>
                      )}
                      {isCurrentMonth && (
                        <Text style={[styles.eventDaysUntil, { color: isDark ? '#FF4DAB' : '#FF0083' }, isRTL && styles.textRTL]}>
                          {t('this_month')}
                        </Text>
                      )}
                      <Text
                        style={[
                          styles.eventDescription,
                          { color: colors.textSecondary },
                          isRTL && styles.textRTL,
                        ]}
                      >
                        {event.description}
                      </Text>
                    </View>
                  </View>

                  {/* Current month indicator */}
                  {isCurrentMonth && (
                    <View
                      style={[
                        styles.currentBadge,
                        isRTL && styles.currentBadgeRTL,
                      ]}
                    >
                      <View
                        style={[
                          styles.currentDot,
                          {
                            backgroundColor: isDark
                              ? '#FF4DAB'
                              : '#FF0083',
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </Animated.View>

          {/* Bottom spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
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
    // wraps back button at top
  },
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

  // Today card
  todayCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  todayLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  hijriDay: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    lineHeight: 64,
  },
  hijriMonth: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.semibold,
    marginTop: 4,
    marginBottom: Spacing.xs,
  },
  hijriFullDate: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    marginBottom: 4,
  },
  gregorianDate: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
  },

  // Section
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },

  // Event card
  eventCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  eventRowRTL: {
    flexDirection: 'row-reverse',
  },

  // Date badge
  dateBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dateBadgeDay: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
    lineHeight: 22,
  },
  dateBadgeMonth: {
    fontSize: 8,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 10,
  },

  // Event content
  eventContent: {
    flex: 1,
    gap: 2,
  },
  eventContentRTL: {
    alignItems: 'flex-end',
  },
  eventName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    lineHeight: 22,
  },
  eventDateLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    lineHeight: 16,
  },
  eventDaysUntil: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    lineHeight: 16,
  },
  eventDescription: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    marginTop: 2,
  },

  // Current month indicator
  currentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  currentBadgeRTL: {
    right: undefined,
    left: 8,
  },
  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // RTL
  textRTL: {
    textAlign: 'right',
  },

  // Bottom spacer
  bottomSpacer: {
    height: Spacing.xxl,
  },
});
