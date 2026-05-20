import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryTaskResult } from '../services/apiClient';
import {
  ENV_API_KEY,
  HISTORY_KEY,
  API_KEY_STORAGE_KEY,
  ACTIVE_TAB_KEY,
  TAB_HOME,
  POLLING_INTERVAL_MS,
} from '../constants/models';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState(TAB_HOME);
  const [apiKey, setApiKey] = useState('');
  const [history, setHistory] = useState([]);
  const pollingRef = useRef({});
  const historyRef = useRef(history);

  useEffect(() => {
    loadApiKey();
    loadHistory();
    loadActiveTab();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(pollingRef.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const loadApiKey = async () => {
    try {
      const stored = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      if (stored) setApiKey(stored);
    } catch (e) {
      console.error('加载 API Key 失败:', e);
    }
  };

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        setTimeout(() => resumeRunningPolling(parsed), 500);
      }
    } catch (e) {
      console.error('加载历史记录失败:', e);
    }
  };

  const loadActiveTab = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACTIVE_TAB_KEY);
      if (stored === TAB_HOME || stored === 'history') setActiveTab(stored);
    } catch (e) {
      console.error('加载导航状态失败:', e);
    }
  };

  const saveApiKey = async (key) => {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key);
      setApiKey(key);
    } catch (e) {
      console.error('保存 API Key 失败:', e);
    }
  };

  const persistHistory = async (updated) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  };

  const updateHistoryItem = useCallback((id, updates) => {
    setHistory((prev) => {
      const idx = prev.findIndex((h) => h.id === id);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = { ...updated[idx], ...updates };
      if (
        (updates.status === 'Success' || updates.status === 'Failed') &&
        !updated[idx].completedAt
      ) {
        updated[idx].completedAt = Date.now();
      }
      persistHistory(updated);
      return updated;
    });
  }, []);

  const startPolling = useCallback((id, requestId, ak) => {
    if (pollingRef.current[id]) return;

    const interval = setInterval(async () => {
      try {
        const result = await queryTaskResult(ak, requestId);
        updateHistoryItem(id, { status: result.status, lastResponse: result });

        if (result.status === 'Success') {
          clearInterval(interval);
          delete pollingRef.current[id];
          const imgs = result.outputs?.images;
          updateHistoryItem(id, {
            status: 'Success',
            imageUrl: imgs?.length > 0 ? imgs[0] : null,
            completedAt: Date.now(),
            lastResponse: result,
          });
        } else if (result.status === 'Failed') {
          clearInterval(interval);
          delete pollingRef.current[id];
          updateHistoryItem(id, {
            status: 'Failed',
            errorMessage: result.message || '任务失败',
            completedAt: Date.now(),
            lastResponse: result,
          });
        }
      } catch (err) {
        clearInterval(interval);
        delete pollingRef.current[id];
        updateHistoryItem(id, {
          status: 'Failed',
          errorMessage: err.message || '轮询请求失败',
          completedAt: Date.now(),
          lastResponse: { status: 'Failed', error: err.message },
        });
      }
    }, POLLING_INTERVAL_MS);

    pollingRef.current[id] = interval;
  }, [updateHistoryItem]);

  const querySingleTask = useCallback(async (item, key) => {
    const ak = key || apiKey || ENV_API_KEY;
    if (!item.requestId || !ak) return;
    try {
      const result = await queryTaskResult(ak, item.requestId);
      updateHistoryItem(item.id, { status: result.status, lastResponse: result });
      if (result.status === 'Success') {
        const imgs = result.outputs?.images;
        updateHistoryItem(item.id, {
          status: 'Success',
          imageUrl: imgs?.length > 0 ? imgs[0] : null,
          completedAt: Date.now(),
          lastResponse: result,
        });
      } else if (result.status === 'Failed') {
        updateHistoryItem(item.id, {
          status: 'Failed',
          errorMessage: result.message || '任务失败',
          completedAt: Date.now(),
          lastResponse: result,
        });
      }
    } catch (err) {
      updateHistoryItem(item.id, {
        status: 'Failed',
        errorMessage: err.message || '轮询请求失败',
        completedAt: Date.now(),
        lastResponse: { status: 'Failed', error: err.message },
      });
    }
  }, [apiKey, updateHistoryItem]);

  const resumeRunningPolling = useCallback((historyItems) => {
    const items = historyItems || historyRef.current;
    const running = items.filter(
      (h) => h.status === 'Running' && h.requestId
    );
    running.forEach((item) => {
      const ak = item.taskApiKey || apiKey || ENV_API_KEY;
      if (ak) {
        querySingleTask(item, ak);
        startPolling(item.id, item.requestId, ak);
      }
    });
  }, [apiKey, querySingleTask, startPolling]);

  const refreshRunningTasks = useCallback(async () => {
    const running = historyRef.current.filter(
      (h) => h.status === 'Running' && h.requestId
    );
    const results = await Promise.allSettled(
      running.map((item) => {
        const ak = item.taskApiKey || apiKey || ENV_API_KEY;
        return ak ? querySingleTask(item, ak) : Promise.resolve();
      })
    );
    return results;
  }, [apiKey, querySingleTask]);

  const saveActiveTab = async (tab) => {
    try {
      await AsyncStorage.setItem(ACTIVE_TAB_KEY, tab);
    } catch (e) {
      console.error('保存导航状态失败:', e);
    }
  };

  const value = {
    activeTab,
    setActiveTab,
    saveActiveTab,
    apiKey,
    setApiKey,
    saveApiKey,
    history,
    setHistory,
    persistHistory,
    updateHistoryItem,
    startPolling,
    pollingRef,
    refreshRunningTasks,
    resumeRunningPolling,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext 必须在 AppProvider 内部使用');
  }
  return context;
}
