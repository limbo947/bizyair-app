import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryTaskResult, fetchUserInfo, fetchWalletBalance } from '../services/apiClient';
import {
  ENV_API_KEY,
  HISTORY_KEY,
  API_KEY_STORAGE_KEY,
  API_KEYS_STORAGE_KEY,
  ACTIVE_KEY_ID_KEY,
  ACTIVE_TAB_KEY,
  TAB_HOME,
  HOME_STATE_KEY,
  TOTAL_COINS_KEY,
  POLLING_INTERVAL_MS,
  MODELS,
} from '../constants/models';
import { STORAGE_KEYS, FAVORITES_MAX_COUNT } from '../constants/modelMeta';

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

const DEFAULT_FAVORITES = ['bza-image-b2-base', 'bza-image-b-pro-official', 'bza-image-o2-official'];

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState(TAB_HOME);
  const [apiKey, setApiKey] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [activeApiKeyId, setActiveApiKeyId] = useState(null);
  const [history, setHistory] = useState([]);
  const [homeState, setHomeState] = useState(DEFAULT_HOME_STATE);
  const [totalCoinsSpent, setTotalCoinsSpent] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
  const pollingRef = useRef({});
  const historyRef = useRef(history);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      const intervals = pollingRef.current;
      Object.keys(intervals).forEach((id) => {
        if (intervals[id]) clearInterval(intervals[id]);
        delete intervals[id];
      });
    };
  }, []);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const loadApiKeys = async () => {
    try {
      const stored = await AsyncStorage.getItem(API_KEYS_STORAGE_KEY);
      let keys = [];
      if (stored) {
        keys = JSON.parse(stored);
      } else {
        const legacyKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
        if (legacyKey) {
          keys = [{ id: 'default', key: legacyKey }];
        }
      }
      setApiKeys(keys);
      const activeId = await AsyncStorage.getItem(ACTIVE_KEY_ID_KEY);
      const active = activeId && keys.find((k) => k.id === activeId)
        ? keys.find((k) => k.id === activeId)
        : keys[0];
      if (active) {
        setApiKey(active.key);
        setActiveApiKeyId(active.id);
        refreshUserInfo(active.key).catch(() => {});
      }
    } catch (e) {
      console.error('加载 API Keys 失败:', e);
    }
  };

  const saveApiKeys = async (keys, activeId) => {
    try {
      await AsyncStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
      setApiKeys(keys);
      if (activeId) {
        await AsyncStorage.setItem(ACTIVE_KEY_ID_KEY, activeId);
        setActiveApiKeyId(activeId);
        const active = keys.find((k) => k.id === activeId);
        if (active) {
          setApiKey(active.key);
        }
      }
    } catch (e) {
      console.error('保存 API Keys 失败:', e);
      throw e;
    }
  };

  const generateKeyId = () => `key_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const addApiKey = async (key, name) => {
    const id = generateKeyId();
    const newKeys = [...apiKeys, { id, key, name: name || `密钥 ${apiKeys.length + 1}` }];
    await saveApiKeys(newKeys, id);
    await refreshUserInfo(key);
  };

  const renameApiKey = async (id, name) => {
    const newKeys = apiKeys.map((k) => (k.id === id ? { ...k, name } : k));
    await saveApiKeys(newKeys, activeApiKeyId);
  };

  const removeApiKey = async (id) => {
    const newKeys = apiKeys.filter((k) => k.id !== id);
    if (newKeys.length === 0) {
      await saveApiKeys([], null);
      setApiKey('');
      setUserInfo(null);
      setWalletBalance(null);
      return;
    }
    const newActiveId = activeApiKeyId === id ? newKeys[0].id : activeApiKeyId;
    await saveApiKeys(newKeys, newActiveId);
    const newActive = newKeys.find((k) => k.id === newActiveId);
    if (newActive) {
      await refreshUserInfo(newActive.key);
    }
  };

  const switchApiKey = async (id) => {
    const key = apiKeys.find((k) => k.id === id);
    if (!key) return;
    await saveApiKeys(apiKeys, id);
    await refreshUserInfo(key.key);
  };

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter((item) => item && typeof item === 'object' && item.id);
          if (validItems.length !== parsed.length) {
            console.warn(`历史记录数据异常，已过滤 ${parsed.length - validItems.length} 条无效记录`);
          }
          setHistory(validItems);
          resumeTimerRef.current = setTimeout(() => resumeRunningPolling(validItems), 500);
        } else {
          console.warn('历史记录数据异常（非数组），已重置');
        }
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
      const existing = apiKeys.find((k) => k.key === key);
      if (existing) {
        await saveApiKeys(apiKeys, existing.id);
        await refreshUserInfo(key);
      } else {
        await addApiKey(key, '默认密钥');
      }
    } catch (e) {
      console.error('保存 API Key 失败:', e);
      throw e;
    }
  };

  const refreshUserInfo = async (key) => {
    const ak = key || apiKey || ENV_API_KEY;
    if (!ak) return false;
    try {
      const [info, balance] = await Promise.allSettled([
        fetchUserInfo(ak),
        fetchWalletBalance(ak),
      ]);
      if (info.status === 'fulfilled') setUserInfo(info.value);
      if (balance.status === 'fulfilled') setWalletBalance(balance.value);
      if (info.status === 'rejected' && balance.status === 'rejected') {
        throw new Error('密钥验证失败，请检查密钥是否正确');
      }
      return true;
    } catch (e) {
      console.error('获取用户信息失败:', e);
      throw e;
    }
  };

  const persistHistory = async (updated) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  };

  const addToHistory = async (entry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev];
      persistHistory(updated);
      return updated;
    });
  };

  const removeHistoryItems = async (predicate) => {
    const updated = history.filter((item) => !predicate(item));
    setHistory(updated);
    await persistHistory(updated);
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

  const MAX_POLL_FAILS = 5;

  function extractTaskResult(result) {
    const outputs = result.outputs;
    if (!outputs) return {};

    if (outputs.videos?.length > 0) {
      return { outputType: 'video', videoUrl: outputs.videos[0], resultUrl: outputs.videos[0] };
    }
    if (outputs.audios?.length > 0) {
      return { outputType: 'audio', audioUrl: outputs.audios[0], resultUrl: outputs.audios[0] };
    }
    if (outputs.texts?.length > 0) {
      return { outputType: 'text', textResult: outputs.texts[0], resultUrl: null };
    }
    if (outputs.images?.length > 0) {
      return { outputType: 'image', imageUrl: outputs.images[0], resultUrl: outputs.images[0] };
    }
    return {};
  }

  const startPolling = useCallback((id, requestId, ak) => {
    if (pollingRef.current[id]) return;

    let failCount = 0;

    const interval = setInterval(async () => {
      try {
        const result = await queryTaskResult(ak, requestId);
        failCount = 0;
        updateHistoryItem(id, { status: result.status, lastResponse: result });

        if (result.status === 'Success') {
          clearInterval(interval);
          delete pollingRef.current[id];
          const taskResult = extractTaskResult(result);
          updateHistoryItem(id, {
            status: 'Success',
            ...taskResult,
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
        failCount++;
        if (failCount >= MAX_POLL_FAILS) {
          clearInterval(interval);
          delete pollingRef.current[id];
          updateHistoryItem(id, {
            status: 'Failed',
            errorMessage: `连续${MAX_POLL_FAILS}次轮询失败: ${err.message || '网络异常'}`,
            completedAt: Date.now(),
            lastResponse: { status: 'Failed', error: err.message },
          });
        }
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
        const taskResult = extractTaskResult(result);
        updateHistoryItem(item.id, {
          status: 'Success',
          ...taskResult,
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
    if (!Array.isArray(items)) return;
    const running = items.filter(
      (h) => h && h.status === 'Running' && h.requestId
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
    const current = historyRef.current;
    if (!Array.isArray(current)) return;
    const running = current.filter(
      (h) => h && h.status === 'Running' && h.requestId
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
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setHomeState({ ...DEFAULT_HOME_STATE, ...parsed });
        } else {
          console.warn('主页状态数据异常，已重置');
        }
      }
    } catch (e) {
      console.error('加载主页状态失败:', e);
    }
  };

  const homeStateRef = useRef(homeState);
  useEffect(() => {
    homeStateRef.current = homeState;
  }, [homeState]);

  const saveHomeState = useCallback(async (state) => {
    try {
      const updated = { ...homeStateRef.current, ...state };
      setHomeState(updated);
      await AsyncStorage.setItem(HOME_STATE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('保存主页状态失败:', e);
    }
  }, []);

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

  const addCoinsSpent = async (amount) => {
    setTotalCoinsSpent((prev) => {
      const newTotal = prev + amount;
      AsyncStorage.setItem(TOTAL_COINS_KEY, String(newTotal)).catch(
        (e) => console.error('保存总金币失败:', e)
      );
      return newTotal;
    });
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.favorites);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
          console.warn('常用模型数据异常（非数组），已重置');
          return;
        }
        const validModels = parsed.filter((modelId) => typeof modelId === 'string' && MODELS[modelId]);
        if (validModels.length > 0) {
          setFavorites(validModels);
        }
      }
    } catch (e) {
      console.error('加载常用模型失败:', e);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      const filtered = newFavorites.filter((modelId) => MODELS[modelId]);
      const limited = filtered.slice(0, FAVORITES_MAX_COUNT);
      setFavorites(limited);
      await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(limited));
    } catch (e) {
      console.error('保存常用模型失败:', e);
    }
  };

  useEffect(() => {
    loadApiKeys();
    loadHistory();
    loadActiveTab();
    loadHomeState();
    loadTotalCoins();
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFavorite = useCallback((modelId) => {
    if (!MODELS[modelId]) return;
    if (favorites.includes(modelId)) return;
    const newFavorites = [...favorites, modelId].slice(0, FAVORITES_MAX_COUNT);
    saveFavorites(newFavorites);
  }, [favorites]);

  const removeFavorite = useCallback((modelId) => {
    const newFavorites = favorites.filter((id) => id !== modelId);
    saveFavorites(newFavorites);
  }, [favorites]);

  const toggleFavorite = useCallback((modelId) => {
    if (!MODELS[modelId]) return;
    if (favorites.includes(modelId)) {
      removeFavorite(modelId);
    } else {
      addFavorite(modelId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((modelId) => {
    return favorites.includes(modelId);
  }, [favorites]);

  const value = {
    activeTab,
    setActiveTab,
    saveActiveTab,
    apiKey,
    setApiKey,
    saveApiKey,
    apiKeys,
    activeApiKeyId,
    addApiKey,
    removeApiKey,
    switchApiKey,
    renameApiKey,
    history,
    addToHistory,
    removeHistoryItems,
    persistHistory,
    updateHistoryItem,
    startPolling,
    refreshRunningTasks,
    resumeRunningPolling,
    homeState,
    saveHomeState,
    totalCoinsSpent,
    addCoinsSpent,
    userInfo,
    walletBalance,
    refreshUserInfo,
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    saveFavorites,
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
