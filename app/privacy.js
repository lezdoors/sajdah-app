import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/theme';
import { useApp } from '../constants/AppContext';

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors, t, isRTL } = useApp();
  const textAlign = isRTL ? 'right' : 'left';

  const sections = [
    {
      title: t('privacy_data_title'),
      body: t('privacy_data_body'),
    },
    {
      title: t('privacy_location_title'),
      body: t('privacy_location_body'),
    },
    {
      title: t('privacy_storage_title'),
      body: t('privacy_storage_body'),
    },
    {
      title: t('privacy_analytics_title'),
      body: t('privacy_analytics_body'),
    },
    {
      title: t('privacy_children_title'),
      body: t('privacy_children_body'),
    },
    {
      title: t('privacy_changes_title'),
      body: t('privacy_changes_body'),
    },
    {
      title: t('privacy_contact_title'),
      body: t('privacy_contact_body'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <ArrowLeft size={24} color={colors.textPrimary} strokeWidth={2} style={isRTL ? { transform: [{ scaleX: -1 }] } : {}} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t('privacy')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.lastUpdated, { color: colors.textTertiary, textAlign }]}>
            {t('privacy_last_updated')}
          </Text>

          <Text style={[styles.intro, { color: colors.textSecondary, textAlign }]}>
            {t('privacy_intro')}
          </Text>

          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, textAlign }]}>
                {section.title}
              </Text>
              <Text style={[styles.sectionBody, { color: colors.textSecondary, textAlign }]}>
                {section.body}
              </Text>
            </View>
          ))}

          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  lastUpdated: {
    fontSize: FontSize.caption,
    marginBottom: Spacing.md,
  },
  intro: {
    fontSize: FontSize.body,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  sectionBody: {
    fontSize: FontSize.bodySmall,
    lineHeight: 22,
  },
});
