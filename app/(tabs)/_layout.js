import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHistoryContext } from '../../src/context/HistoryContext';
import { useTheme } from '../../src/context/ThemeContext';

const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];

export default function TabLayout() {
  const { colors } = useTheme();
  const { history } = useHistoryContext();
  const insets = useSafeAreaInsets();

  const activeCount = Array.isArray(history)
    ? history.filter((h) => h && ACTIVE_STATUSES.includes(h.status)).length
    : 0;

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: {
        backgroundColor: colors.card,
        borderTopColor: colors.separator,
        borderTopWidth: 0.5,
        height: 60 + insets.bottom,
        paddingBottom: 6 + insets.bottom,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
        marginTop: -4,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '\u4E3B\u9875',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="webapp"
        options={{
          title: 'AI\u5E94\u7528',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '\u5386\u53F2',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.error },
        }}
      />
    </Tabs>
  );
}
