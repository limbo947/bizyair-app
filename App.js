import { useRef, useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  StatusBar as RNStatusBar,
  BackHandler,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { TabBar } from './src/components/TabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ModelSelectScreen } from './src/screens/ModelSelectScreen';
import { TAB_HOME, TAB_FADE_OUT_MS, TAB_FADE_IN_MS } from './src/constants/models';

const PAGE_HOME = 'home';
const PAGE_HISTORY = 'history';
const PAGE_MODEL_SELECT = 'model-select';

function PageContainer({ page, homeState, handleSelectModel, handleCloseModelSelect, handleOpenModelSelect, activeTab }) {
  if (page === PAGE_MODEL_SELECT) {
    return (
      <ModelSelectScreen
        currentModelId={homeState.modelId}
        onSelectModel={handleSelectModel}
        onBack={handleCloseModelSelect}
      />
    );
  }
  if (activeTab === TAB_HOME) {
    return <HomeScreen onOpenModelSelect={handleOpenModelSelect} />;
  }
  return <HistoryScreen />;
}

function AppNavigator() {
  const {
    activeTab,
    setActiveTab,
    saveActiveTab,
    history,
    homeState,
    saveHomeState,
  } = useAppContext();
  const { colors, themeMode } = useTheme();

  const [currentPage, setCurrentPage] = useState(PAGE_HOME);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabRef = useRef(activeTab);

  useEffect(() => {
    const page = activeTab === TAB_HOME ? PAGE_HOME : PAGE_HISTORY;
    setCurrentPage(page);
    tabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(RNStatusBar.currentHeight || 0);
    }
  }, []);

  const handleTabChange = useCallback((tab) => {
    if (tab === tabRef.current) {
      const page = tab === TAB_HOME ? PAGE_HOME : PAGE_HISTORY;
      if (currentPage !== page) setCurrentPage(page);
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: TAB_FADE_OUT_MS,
      useNativeDriver: true,
    }).start(() => {
      tabRef.current = tab;
      setActiveTab(tab);
      saveActiveTab(tab);
      setCurrentPage(tab === TAB_HOME ? PAGE_HOME : PAGE_HISTORY);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: TAB_FADE_IN_MS,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim, setActiveTab, saveActiveTab, currentPage]);

  const handleOpenModelSelect = useCallback(() => {
    setCurrentPage(PAGE_MODEL_SELECT);
  }, []);

  const handleCloseModelSelect = useCallback(() => {
    setCurrentPage(tabRef.current === TAB_HOME ? PAGE_HOME : PAGE_HISTORY);
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (currentPage === PAGE_MODEL_SELECT) {
        handleCloseModelSelect();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      } else {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }
    };
  }, [currentPage, handleCloseModelSelect]);

  const handleSelectModel = useCallback((modelId, mode) => {
    saveHomeState({ modelId, ...(mode ? { mode } : {}) });
    handleCloseModelSelect();
  }, [saveHomeState, handleCloseModelSelect]);

  const activeCount = Array.isArray(history)
    ? history.filter(
        (h) => h && ['Pending', 'Running', 'Saving'].includes(h.status)
      ).length
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['bottom']}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.card} />
      <View style={{ height: statusBarHeight, backgroundColor: colors.card }} />
      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <PageContainer
            page={currentPage}
            activeTab={activeTab}
            homeState={homeState}
            handleSelectModel={handleSelectModel}
            handleCloseModelSelect={handleCloseModelSelect}
            handleOpenModelSelect={handleOpenModelSelect}
          />
        </Animated.View>
      </View>

      {currentPage !== PAGE_MODEL_SELECT && (
        <TabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          historyBadge={activeCount}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1, overflow: 'hidden' },
  content: { flex: 1 },
});
