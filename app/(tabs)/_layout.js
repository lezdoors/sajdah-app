import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Home, BookOpen, Heart, Search, User } from 'lucide-react-native';
import { useApp } from '../../constants/AppContext';
import { FontWeight, BorderRadius } from '../../constants/theme';

function TabIcon({ IconComponent, focused, label, isCenter, colors }) {
  if (isCenter) {
    return (
      <View style={styles.centerTab}>
        <View style={[
          styles.centerPill,
          { backgroundColor: focused ? colors.accent : 'transparent' },
        ]}>
          <IconComponent size={20} color={focused ? '#FFFFFF' : colors.tabInactive} strokeWidth={focused ? 2 : 1.5} />
        </View>
        <Text style={[
          styles.tabLabel,
          { color: focused ? colors.accent : colors.tabInactive },
          focused && { fontWeight: FontWeight.semibold },
        ]}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabItem}>
      <View style={[
        styles.activePill,
        focused && { backgroundColor: colors.accentLight },
      ]}>
        <IconComponent
          size={20}
          color={focused ? colors.accent : colors.tabInactive}
          strokeWidth={focused ? 2 : 1.5}
        />
      </View>
      <Text style={[
        styles.tabLabel,
        { color: focused ? colors.accent : colors.tabInactive },
        focused && { fontWeight: FontWeight.semibold },
      ]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { colors, t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, {
          backgroundColor: colors.surface,
          borderTopColor: colors.divider,
        }],
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Home} focused={focused} label={t('tab_home')} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={BookOpen} focused={focused} label={t('tab_quran')} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Heart} focused={focused} label={t('tab_duas')} isCenter colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Search} focused={focused} label={t('tab_discover')} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={User} focused={focused} label={t('tab_you')} colors={colors} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0.5,
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  activePill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.3,
  },
  centerTab: {
    alignItems: 'center',
    gap: 3,
  },
  centerPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
