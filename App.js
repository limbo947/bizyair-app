import { useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Animated,
} from 'react-native';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { TabBar } from './src/components/TabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { TAB_HOME, TAB_FADE_OUT_MS, TAB_FADE_IN_MS } from './src/constants/models';

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

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: TAB_FADE_OUT_MS,
      useNativeDriver: true,
    }).start(() => {
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
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {activeTab === TAB_HOME ? <HomeScreen /> : <HistoryScreen />}
      </Animated.View>
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
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1 },
});
