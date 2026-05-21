import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryTaskResult, fetchUserInfo, fetchWalletBalance } from '../services/apiClient';
import {
  ENV_API_KEY,
  HISTORY_KEY,
  API_KEY_STORAGE_KEY,
  ACTIVE_TAB_KEY,
  TAB_HOME,
  HOME_STATE_KEY,
  TOTAL_COINS_KEY,
  POLLING_INTERVAL_MS,
} from '../constants/models';

const AppContext = createContext(null);

const DEFAULT_HOME_STATE = {
  modelId: 'bza-image-b2-base',
  mode: 'text-to-image',
  prompt: '',
  imageUrls: [],
  resolution: '2K',
  aspectRatio: '4:3',
  quality: 'medium',
  sizePreset: 0,
  customWidth: '1024',
  customHeight: '1024',
};

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState(TAB_HOME);
  const [apiKey, setApiKey] = useState('');
  const [history, setHistory] = useState([]);
  const [homeState, setHomeState] = useState(DEFAULT_HOME_STATE);
  const [totalCoinsSpent, setTotalCoinsSpent] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const pollingRef = useRef({});
  const historyRef = useRef(history);

  useEffect(() => {
    loadApiKey();
    loadHistory();
    loadActiveTab();
    loadHomeState();
    loadTotalCoins();
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
      if (stored) {
        setApiKey(stored);
        refreshUserInfo(stored);
      }
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
      refreshUserInfo(key);
    } catch (e) {
      console.error('保存 API Key 失败:', e);
    }
  };

  const refreshUserInfo = async (key) => {
    const ak = key || apiKey || ENV_API_KEY;
    if (!ak) return;
    try {
      const [info, balance] = await Promise.allSettled([
        fetchUserInfo(ak),
        fetchWalletBalance(ak),
      ]);
      if (info.status === 'fulfilled') setUserInfo(info.value);
      if (balance.status === 'fulfilled') setWalletBalance(balance.value);
    } catch (e) {
      console.error('获取用户信息失败:', e);
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

  const loadHomeState = async () => {
    try {
      const stored = await AsyncStorage.getItem(HOME_STATE_KEY);
      if (stored) {
        setHomeState({ ...DEFAULT_HOME_STATE, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('加载主页状态失败:', e);
    }
  };

  const saveHomeState = async (state) => {
    try {
      const updated = { ...homeState, ...state };
      setHomeState(updated);
      await AsyncStorage.setItem(HOME_STATE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('保存主页状态失败:', e);
    }
  };

  const loadTotalCoins = async () => {
    try {
      const stored = await AsyncStorage.getItem(TOTAL_COINS_KEY);
      if (stored) {
        setTotalCoinsSpent(parseInt(stored, 10) || 0);
      }
    } catch (e) {
      console.error('加载总金币失败:', e);
    }
  };

  const saveTotalCoins = async (coins) => {
    try {
      await AsyncStorage.setItem(TOTAL_COINS_KEY, String(coins));
      setTotalCoinsSpent(coins);
    } catch (e) {
      console.error('保存总金币失败:', e);
    }
  };

  const addCoinsSpent = async (amount) => {
    const newTotal = totalCoinsSpent + amount;
    await saveTotalCoins(newTotal);
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
    homeState,
    saveHomeState,
    totalCoinsSpent,
    addCoinsSpent,
    userInfo,
    walletBalance,
    refreshUserInfo,
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
