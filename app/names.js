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
  LayoutAnimation,
  UIManager,
  Platform,
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

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Brief descriptions for each of the 99 Names
const NAME_DESCRIPTIONS = {
  1: 'The Most Gracious — His mercy encompasses all of creation. He bestows countless blessings upon every living thing, believer and non-believer alike.',
  2: 'The Most Merciful — His special mercy is reserved for the believers. He shows compassion and kindness to those who turn to Him in faith.',
  3: 'The King — The absolute sovereign and ruler over all that exists. His dominion is complete and unchallenged.',
  4: 'The Most Holy — Free from every imperfection and deficiency. He is pure, sacred, and blessed beyond measure.',
  5: 'The Source of Peace — He grants safety, security, and tranquility. He is free from all faults and the bestower of peace upon His creation.',
  6: 'The Guardian of Faith — He grants security and confirms the truth of His messengers through signs and miracles.',
  7: 'The Protector — He watches over and preserves all things. Nothing escapes His vigilant care and guardianship.',
  8: 'The Almighty — Possessor of absolute might and power. None can overcome Him, and He prevails over all things.',
  9: 'The Compeller — He restores all of creation to soundness. His will is irresistible and cannot be opposed.',
  10: 'The Supreme — He is greater than all of creation. His greatness and majesty are beyond comparison.',
  11: 'The Creator — He brings everything into existence from nothing. He determines and plans all of creation.',
  12: 'The Evolver — He shapes and fashions creation in perfect harmony. He brings forth what He creates in the best form.',
  13: 'The Fashioner — He designs and gives form to all living things. Each creation bears His unique artistic imprint.',
  14: 'The Forgiver — He repeatedly pardons and covers the sins of His servants. His forgiveness is boundless for those who repent.',
  15: 'The Subduer — He dominates all things and overcomes every obstacle. None can resist His overwhelming power.',
  16: 'The Bestower — He gives freely without expectation of return. His generosity flows endlessly to His creation.',
  17: 'The Provider — He sustains all living things with what they need. Every provision comes solely from His bounty.',
  18: 'The Opener — He opens the doors of mercy, sustenance, and guidance. He resolves all difficulties for His servants.',
  19: 'The All-Knowing — His knowledge encompasses everything, seen and unseen, past, present, and future. Nothing is hidden from Him.',
  20: 'The Constrictor — He withholds and restricts provision as He wills. He tests His servants through scarcity to bring them closer to Him.',
  21: 'The Expander — He grants abundance and amplifies blessings. He opens the hearts of His servants to receive guidance.',
  22: 'The Abaser — He lowers the arrogant and brings down the oppressors. He humbles those who transgress beyond bounds.',
  23: 'The Exalter — He raises the humble and elevates the righteous. He bestows honor and high rank upon whomever He wills.',
  24: 'The Bestower of Honor — He grants dignity, respect, and strength. He elevates those who are sincere in worship.',
  25: 'The Humiliator — He debases the proud and the unjust. Those who oppose His will face abasement in this life and the next.',
  26: 'The All-Hearing — He hears every sound, whisper, and prayer. No call goes unheard, whether spoken aloud or held in the heart.',
  27: 'The All-Seeing — He sees all things, both manifest and concealed. No action, however small, escapes His sight.',
  28: 'The Judge — He makes the final ruling in all matters with perfect justice. His judgment is absolute and cannot be overturned.',
  29: 'The Just — He treats all creation with perfect fairness. He never wrongs anyone, even by the weight of an atom.',
  30: 'The Subtle One — He is kind in ways beyond perception. He arranges matters for His servants in ways they cannot fathom.',
  31: 'The All-Aware — He knows the innermost secrets of every heart. Nothing can be concealed from His awareness.',
  32: 'The Forbearing — He does not hasten punishment for the sinners. He gives time and opportunity for repentance with great patience.',
  33: 'The Magnificent — His greatness is beyond all comprehension. He is vast in His attributes and infinite in His majesty.',
  34: 'The Forgiving — He conceals the faults and sins of His servants. He covers their shortcomings with His generous pardon.',
  35: 'The Grateful — He appreciates the smallest good deed and rewards it abundantly. He multiplies the reward of the sincere.',
  36: 'The Most High — He is exalted above all creation in every way. Nothing is above Him in rank, power, or authority.',
  37: 'The Most Great — His greatness surpasses all understanding. He is incomparably grand in His essence and attributes.',
  38: 'The Preserver — He guards and protects all that He has created. He preserves the heavens, the earth, and everything in between.',
  39: 'The Nourisher — He sustains and maintains every living being. He provides strength and nourishment to all of creation.',
  40: 'The Reckoner — He takes account of every deed, great or small. He suffices as a trustee and keeper of accounts.',
  41: 'The Majestic — His majesty fills creation with awe. He possesses grandeur, nobility, and supreme glory.',
  42: 'The Generous — His generosity knows no bounds. He gives more than what is asked and rewards beyond expectation.',
  43: 'The Watchful — He observes all things at all times. He is aware of every action, thought, and intention.',
  44: 'The Responsive — He answers the call of those who supplicate. He responds to every sincere prayer with His wisdom.',
  45: 'The All-Encompassing — His knowledge and mercy encompass all things. His capacity is vast and without limit.',
  46: 'The Wise — He places everything in its rightful place. Every decree, law, and creation reflects His infinite wisdom.',
  47: 'The Most Loving — His love for His creation is tender and genuine. He bestows affection upon the righteous and the repentant.',
  48: 'The Most Glorious — He is magnificent and full of honor. His glory illuminates all of creation.',
  49: 'The Resurrector — He will raise all creation from the dead on the Day of Judgment. He brings to life what was once lifeless.',
  50: 'The Witness — He is present and sees all events as they unfold. He testifies to all that occurs in creation.',
  51: 'The Truth — He is the absolute reality. His existence is certain, His promises are true, and His words are never false.',
  52: 'The Trustee — He is the ultimate disposer of all affairs. Those who rely on Him find the best of guardians.',
  53: 'The Most Strong — His strength is perfect and inexhaustible. He never tires, weakens, or falters.',
  54: 'The Firm — He is steadfast and unwavering in His power. His strength is solid, resolute, and unbreakable.',
  55: 'The Protecting Friend — He is near to His devoted servants. He supports, aids, and defends those who turn to Him.',
  56: 'The Praiseworthy — He is deserving of all praise and gratitude. Every form of thanks ultimately belongs to Him.',
  57: 'The Appraiser — He counts and knows the number of all things. Nothing in creation is beyond His reckoning.',
  58: 'The Originator — He initiates creation without any prior model. He brings things into being for the first time.',
  59: 'The Restorer — He brings back creation after its end. He repeats and restores what He has originated.',
  60: 'The Giver of Life — He grants life to all living things. He revives the dead earth, hearts, and souls.',
  61: 'The Taker of Life — He decrees death upon every living creature. Every soul shall taste death at its appointed time.',
  62: 'The Ever Living — He is alive in the most perfect sense. His life has no beginning and no end.',
  63: 'The Self-Existing — He sustains and maintains all of creation. Everything depends on Him, while He depends on nothing.',
  64: 'The Finder — He possesses all things and lacks nothing. He perceives and obtains whatever He wills.',
  65: 'The Glorious — Full of nobility, grandeur, and majesty. His glory is vast and resplendent.',
  66: 'The One — He is uniquely One in His essence, attributes, and actions. There is nothing comparable to Him.',
  67: 'The Eternal Refuge — All of creation depends upon Him for their needs. He is self-sufficient and is sought by all.',
  68: 'The Able — He has complete power over all things. Nothing is impossible for Him to accomplish.',
  69: 'The Powerful — He creates and determines all power. His ability prevails over all, and none can resist Him.',
  70: 'The Expediter — He brings forward whomever and whatever He wills. He advances things to their proper time.',
  71: 'The Delayer — He postpones things to their proper time. He puts back whomever and whatever He wills.',
  72: 'The First — He existed before all of creation. There is nothing that preceded Him in existence.',
  73: 'The Last — He will remain after all of creation has perished. There is nothing that will outlast Him.',
  74: 'The Manifest — His existence is evident through His signs. His power and creation are apparent to all who reflect.',
  75: 'The Hidden — He is veiled from human perception in this life. His essence cannot be grasped by mortal senses.',
  76: 'The Governor — He governs and manages all the affairs of creation. He is in charge of everything that exists.',
  77: 'The Most Exalted — He is supremely high above all creation. His transcendence is beyond all comparison.',
  78: 'The Doer of Good — He treats His creation with kindness and benevolence. His goodness extends to all that exists.',
  79: 'The Acceptor of Repentance — He repeatedly accepts the repentance of those who return to Him. His door of forgiveness is always open.',
  80: 'The Avenger — He justly punishes the oppressors and wrongdoers. His vengeance comes to support the oppressed.',
  81: 'The Pardoner — He erases sins as if they never existed. He wipes the slate clean for those who seek His forgiveness.',
  82: 'The Clement — He shows the utmost compassion and tenderness. His kindness exceeds what any heart can imagine.',
  83: 'Owner of Sovereignty — All dominion and authority belong to Him alone. He bestows and removes kingdoms as He wills.',
  84: 'Lord of Majesty and Generosity — He possesses both awe-inspiring greatness and abundant grace. He is honored and revered.',
  85: 'The Equitable — He acts with perfect justice and fairness. He gives every being exactly what it deserves.',
  86: 'The Gatherer — He will gather all of creation on the Day of Judgment. He assembles all things as He wills.',
  87: 'The Self-Sufficient — He is free of all needs and wants. He is rich beyond measure and independent of all creation.',
  88: 'The Enricher — He enriches whomever He wills with material and spiritual wealth. His gifts remove all poverty.',
  89: 'The Preventer — He prevents harm and withholds what is not beneficial. He protects His servants from what would damage them.',
  90: 'The Distresser — He creates conditions that test and try His servants. Through hardship, He guides them toward patience and growth.',
  91: 'The Propitious — He creates all that brings benefit and advantage. Every good that reaches creation comes through Him.',
  92: 'The Light — He illuminates the heavens, the earth, and the hearts of believers. He is the source of all light and guidance.',
  93: 'The Guide — He shows the straight path to those who seek it. He leads hearts out of darkness into light.',
  94: 'The Originator — He creates unprecedented, wonderful things. His creation is always new and filled with marvel.',
  95: 'The Everlasting — He remains forever while all else perishes. His existence has no end.',
  96: 'The Inheritor — He is the ultimate heir of all creation. After everything passes away, only He remains.',
  97: 'The Guide to the Right Path — He directs His servants to what is correct and beneficial. His guidance leads to righteousness.',
  98: 'The Patient — He does not rush to punish. He gives His servants ample time to repent and return to the right way.',
  99: 'God — The greatest name encompassing all divine attributes. He is the one true God, the Creator and Sustainer of all that exists.',
};

export default function NamesScreen() {
  const { colors, isDark, t, isRTL } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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

  const handleToggleExpand = useCallback((number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === number ? null : number));
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      const isExpanded = expandedId === item.number;
      const description = NAME_DESCRIPTIONS[item.number];

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleToggleExpand(item.number)}
          style={[
            styles.nameCard,
            {
              backgroundColor: isExpanded ? colors.accentLight : colors.surface,
              borderColor: isExpanded ? colors.accent : colors.surfaceBorder,
            },
          ]}
        >
          <View style={[styles.nameRow, isRTL && styles.nameRowRTL]}>
            {/* Number badge */}
            <View
              style={[
                styles.numberBadge,
                {
                  borderColor: isExpanded ? colors.accent : colors.surfaceBorder,
                  backgroundColor: isExpanded ? colors.accent : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.numberText,
                  { color: isExpanded ? '#FFFFFF' : colors.textTertiary },
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
                  isExpanded ? styles.meaningExpanded : styles.meaning,
                  { color: isExpanded ? colors.accent : colors.textSecondary },
                  isRTL && styles.textRTL,
                ]}
              >
                {item.meaning}
              </Text>
            </View>

            {/* Number badge top-right */}
            <View
              style={[
                styles.cornerBadge,
                { backgroundColor: isExpanded ? colors.accent : colors.surfaceBorder },
                isRTL && styles.cornerBadgeRTL,
              ]}
            >
              <Text
                style={[
                  styles.cornerBadgeText,
                  { color: isExpanded ? '#FFFFFF' : colors.textTertiary },
                ]}
              >
                #{item.number}
              </Text>
            </View>
          </View>

          {/* Expanded content */}
          {isExpanded && description ? (
            <View style={styles.expandedSection}>
              <View style={[styles.expandedDivider, { backgroundColor: colors.divider }]} />
              <Text
                style={[
                  styles.descriptionText,
                  { color: colors.textSecondary },
                  isRTL && styles.textRTL,
                ]}
              >
                {description}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      );
    },
    [colors, isRTL, expandedId, handleToggleExpand]
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
              <Text style={styles.heroTitle}>{t('names_of_allah')}</Text>
              <Text style={styles.heroSubtitle}>{t('names_subtitle')}</Text>
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
          extraData={expandedId}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Search size={32} color={colors.textTertiary} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                {t('no_names_found')}
              </Text>
            </View>
          }
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
  meaningExpanded: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    lineHeight: 22,
  },

  // Corner badge (top-right number)
  cornerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: BorderRadius.sm,
    borderTopRightRadius: BorderRadius.md - 1,
  },
  cornerBadgeRTL: {
    right: undefined,
    left: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: BorderRadius.sm,
    borderTopRightRadius: 0,
    borderTopLeftRadius: BorderRadius.md - 1,
  },
  cornerBadgeText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
  },

  // Expanded section
  expandedSection: {
    marginTop: Spacing.xs,
  },
  expandedDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: Spacing.xs,
  },
  descriptionText: {
    fontSize: FontSize.bodySmall,
    fontWeight: FontWeight.regular,
    lineHeight: 22,
  },

  // Separator
  separator: {
    height: Spacing.xs,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.body,
  },

  // RTL
  textRTL: {
    textAlign: 'right',
  },
});
