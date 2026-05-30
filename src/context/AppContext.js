import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACTIVE_TAB_KEY, TAB_HOME, TAB_WEBAPP } from '../constants/models';
import { ApiKeyProvider } from './ApiKeyContext';
import { HistoryProvider } from './HistoryContext';
import { FavoritesProvider } from './FavoritesContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [_activeTab, setActiveTab] = useState(undefined);
  const activeTab = _activeTab ?? TAB_HOME;

  const loadActiveTab = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACTIVE_TAB_KEY);
      if (stored === TAB_HOME || stored === TAB_WEBAPP || stored === 'history') setActiveTab(stored);
    } catch (e) {
      console.error('加载导航状态失败:', e);
    }
  };

  const saveActiveTab = async (tab) => {
    try {
      await AsyncStorage.setItem(ACTIVE_TAB_KEY, tab);
    } catch (e) {
      console.error('保存导航状态失败:', e);
    }
  };

  useEffect(() => {
    loadActiveTab();
  }, []);

  const value = useMemo(() => ({
    activeTab,
    setActiveTab,
    saveActiveTab,
  }), [activeTab]);

  return (
    <AppContext.Provider value={value}>
      <ApiKeyProvider>
        <HistoryProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </HistoryProvider>
      </ApiKeyProvider>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext 必须在 AppProvider 内部使用');
  }
  return context;
}
