import { useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { TabBar } from './src/components/TabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { TAB_HOME, TAB_FADE_OUT_MS, TAB_FADE_IN_MS } from './src/constants/models';
import { Colors } from './src/constants/theme';

function AppNavigator() {
  const {
    activeTab,
    setActiveTab,
    saveActiveTab,
    history,
  } = useAppContext();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabRef = useRef(activeTab);

  const handleTabChange = useCallback((tab) => {
    if (tab === tabRef.current) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: TAB_FADE_OUT_MS,
        useNativeDriver: true,
      }),
    ]).start(() => {
      tabRef.current = tab;
      setActiveTab(tab);
      saveActiveTab(tab);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: TAB_FADE_IN_MS,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim, setActiveTab, saveActiveTab]);

  const activeCount = history.filter(
    (h) => ['Pending', 'Running', 'Saving'].includes(h.status)
  ).length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" backgroundColor={Colors.card} />
      <View style={styles.statusBarPadding} />
      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, overflow: 'hidden' }]}>
          {activeTab === TAB_HOME ? <HomeScreen /> : <HistoryScreen />}
        </Animated.View>
      </View>
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        historyBadge={activeCount}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  statusBarPadding: { 
    height: Platform.OS === 'android' ? 0 : 0,
    backgroundColor: Colors.card,
  },
  contentWrapper: { flex: 1, overflow: 'hidden' },
  content: { flex: 1 },
});
