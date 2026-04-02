import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { User } from 'lucide-react-native';
import { MosqueIcon, MushafIcon, DuaHandsIcon, IslamicStarIcon } from '../../components/TabIcons';
import { useApp } from '../../constants/AppContext';
import { FontWeight, BorderRadius } from '../../constants/theme';

function TabIcon({ IconComponent, focused, label, colors }) {
  return (
    <View style={styles.tabItem}>
      <View style={[
        styles.activePill,
        focused && { backgroundColor: colors.accentLight },
      ]}>
        <IconComponent
          size={21}
          color={focused ? colors.accent : colors.tabInactive}
          strokeWidth={focused ? 2.2 : 1.5}
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

function FloatingTabBar({ isDark }) {
  return (
    <BlurView
      intensity={80}
      tint={isDark ? 'dark' : 'light'}
      style={styles.blurWrap}
    >
      <View style={[
        styles.blurInner,
        { backgroundColor: isDark ? 'rgba(28,28,30,0.65)' : 'rgba(255,255,255,0.72)' },
      ]} />
    </BlurView>
  );
}

export default function TabLayout() {
  const { colors, isDark, t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, {
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        }],
        tabBarBackground: () => <FloatingTabBar isDark={isDark} />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={MosqueIcon} focused={focused} label={t('tab_home')} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={MushafIcon} focused={focused} label={t('tab_quran')} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={DuaHandsIcon} focused={focused} label={t('tab_duas')} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={IslamicStarIcon} focused={focused} label={t('tab_discover')} colors={colors} />
          ),
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.youTabItem}>
              <View style={[
                styles.youIconCircle,
                { backgroundColor: focused ? colors.accent : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)') },
              ]}>
                <User
                  size={18}
                  color={focused ? '#FFFFFF' : colors.tabInactive}
                  strokeWidth={focused ? 2.2 : 1.5}
                />
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 22,
    borderTopWidth: 0,
    borderWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  blurWrap: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    overflow: 'hidden',
  },
  blurInner: {
    ...StyleSheet.absoluteFillObject,
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
    fontSize: 10,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.2,
  },
  // "You" tab — distinct circle style
  youTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  youIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
