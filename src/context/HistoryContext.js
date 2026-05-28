import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryTaskResult, queryWebappTaskDetail, queryWebappTaskOutputs, cancelWebappTask, interruptWebappTask } from '../services/apiClient';
import {
  ENV_API_KEY,
  HISTORY_KEY,
  HOME_STATE_KEY,
  TOTAL_COINS_KEY,
  POLLING_INTERVAL_MS,
} from '../constants/models';
import { useApiKeyContext } from './ApiKeyContext';

const HistoryContext = createContext(null);

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

const MAX_POLL_FAILS = 5;

function extractTaskResult(result) {
  const outputs = result.outputs;
  if (!outputs) return {};

  if (outputs.videos?.length > 0) {
    return { outputType: 'video', videoUrl: outputs.videos[0], videoUrls: outputs.videos, resultUrl: outputs.videos[0] };
  }
  if (outputs.audios?.length > 0) {
    return { outputType: 'audio', audioUrl: outputs.audios[0], resultUrl: outputs.audios[0] };
  }
  if (outputs.texts?.length > 0) {
    return { outputType: 'text', textResult: outputs.texts[0], resultUrl: null };
  }
  if (outputs.images?.length > 0) {
    return {
      outputType: 'image',
      imageUrl: outputs.images[0],
      imageUrls: outputs.images,
      resultUrl: outputs.images[0],
    };
  }
  return {};
}

function extractWebappResult(outputs) {
  if (!Array.isArray(outputs) || outputs.length === 0) return {};
  const first = outputs[0];
  const ext = (first.output_ext || '').toLowerCase();
  const url = first.object_url || '';
  if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
    const videoUrls = outputs.filter(o => ['.mp4', '.mov', '.avi', '.webm'].includes((o.output_ext || '').toLowerCase())).map(o => o.object_url);
    return { outputType: 'video', videoUrl: url, resultUrl: url, videoUrls };
  }
  if (['.mp3', '.wav', '.ogg', '.flac', '.aac'].includes(ext)) {
    return { outputType: 'audio', audioUrl: url, resultUrl: url };
  }
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'].includes(ext)) {
    const imageUrls = outputs.filter(o => ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'].includes((o.output_ext || '').toLowerCase())).map(o => o.object_url);
    return { outputType: 'image', imageUrl: url, imageUrls, resultUrl: url };
  }
  if (url) {
    const imageUrls = outputs.map(o => o.object_url).filter(Boolean);
    return { outputType: 'image', imageUrl: url, imageUrls, resultUrl: url };
  }
  return {};
}

export function HistoryProvider({ children }) {
  const { apiKey } = useApiKeyContext();

  const [history, setHistory] = useState([]);
  const [homeState, setHomeState] = useState(DEFAULT_HOME_STATE);
  const [totalCoinsSpent, setTotalCoinsSpent] = useState(0);
  const pollingRef = useRef({});
  const historyRef = useRef(history);
  const resumeTimerRef = useRef(null);
  const homeStateRef = useRef(homeState);

  /* eslint-disable react-hooks/exhaustive-deps -- cleanup needs latest ref value at unmount time */
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
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    homeStateRef.current = homeState;
  }, [homeState]);

  const persistHistory = useCallback(async (updated) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  }, []);

  const addToHistory = useCallback(async (entry) => {
    setHistory((prev) => {
      const updated = [entry, ...prev];
      persistHistory(updated);
      return updated;
    });
  }, [persistHistory]);

  const removeHistoryItems = useCallback(async (predicate) => {
    const updated = history.filter((item) => !predicate(item));
    setHistory(updated);
    await persistHistory(updated);
  }, [history, persistHistory]);

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
  }, [persistHistory]);

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

  const startWebappPolling = useCallback((id, requestId, ak) => {
    if (pollingRef.current[id]) return;

    let failCount = 0;

    const mapStatus = (s) => {
      if (s === 'Queuing' || s === 'Preparing') return 'Pending';
      if (s === 'Canceled') return 'Canceled';
      return s;
    };

    const interval = setInterval(async () => {
      try {
        const detail = await queryWebappTaskDetail(ak, requestId);
        failCount = 0;
        const rawStatus = detail.status;
        const mappedStatus = mapStatus(rawStatus);
        updateHistoryItem(id, { status: mappedStatus, lastResponse: detail });

        if (rawStatus === 'Success') {
          clearInterval(interval);
          delete pollingRef.current[id];
          try {
            const outputData = await queryWebappTaskOutputs(ak, requestId);
            const taskResult = extractWebappResult(outputData.outputs);
            updateHistoryItem(id, {
              status: 'Success',
              ...taskResult,
              completedAt: Date.now(),
              lastResponse: { ...detail, outputs: outputData.outputs },
            });
          } catch (_outputErr) {
            updateHistoryItem(id, {
              status: 'Success',
              completedAt: Date.now(),
              lastResponse: detail,
            });
          }
        } else if (rawStatus === 'Failed' || rawStatus === 'Canceled') {
          clearInterval(interval);
          delete pollingRef.current[id];
          const isCanceled = rawStatus === 'Canceled' || mappedStatus === 'Canceled';
          updateHistoryItem(id, {
            status: isCanceled ? 'Canceled' : mappedStatus,
            errorMessage: detail.error_message || (isCanceled ? '任务已取消' : '任务失败'),
            completedAt: Date.now(),
            lastResponse: detail,
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
      (h) => h && (h.status === 'Running' || h.status === 'Pending') && h.requestId
    );
    running.forEach((item) => {
      const ak = item.taskApiKey || apiKey || ENV_API_KEY;
      if (ak) {
        if (item.source === 'webapp') {
          startWebappPolling(item.id, item.requestId, ak);
        } else {
          querySingleTask(item, ak);
          startPolling(item.id, item.requestId, ak);
        }
      }
    });
  }, [apiKey, querySingleTask, startPolling, startWebappPolling]);

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

  const stopPolling = useCallback(async (id) => {
    const item = historyRef.current.find((h) => h.id === id);
    if (!item) return;
    const ak = item.taskApiKey || apiKey || ENV_API_KEY;
    const requestId = item.requestId;

    if (!requestId || !ak || item.source !== 'webapp') {
      if (pollingRef.current[id]) {
        clearInterval(pollingRef.current[id]);
        delete pollingRef.current[id];
      }
      updateHistoryItem(id, {
        status: 'Failed',
        errorMessage: '任务已终止',
        completedAt: Date.now(),
      });
      return;
    }

    const MAX_RETRIES = 5;
    let lastError = null;

    let currentStatus = item.status;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const detail = await queryWebappTaskDetail(ak, requestId);
        if (detail.status) {
          currentStatus = detail.status;
          break;
        }
      } catch (err) {
        lastError = err;
      }
      if (i < MAX_RETRIES - 1) await new Promise((r) => setTimeout(r, 3000));
    }

    const shouldCancel = currentStatus === 'Queuing' || currentStatus === 'Preparing';
    const apiFn = shouldCancel ? cancelWebappTask : interruptWebappTask;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const result = await apiFn(ak, requestId);
        if (result.code === 20000) {
          updateHistoryItem(id, {
            status: 'Pending',
            errorMessage: '取消中...',
          });
          return;
        }
        lastError = new Error(`服务端返回错误码: ${result.code}`);
      } catch (err) {
        lastError = err;
      }
      if (i < MAX_RETRIES - 1) await new Promise((r) => setTimeout(r, 3000));
    }
    updateHistoryItem(id, {
      errorMessage: `取消失败: ${lastError?.message || '未知错误'}`,
    });
  }, [apiKey, updateHistoryItem]);

  const loadHistory = useCallback(async () => {
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
  }, [resumeRunningPolling]);

  const saveHomeState = useCallback(async (state) => {
    try {
      const updated = { ...homeStateRef.current, ...state };
      setHomeState(updated);
      await AsyncStorage.setItem(HOME_STATE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('保存主页状态失败:', e);
    }
  }, []);

  const loadHomeState = useCallback(async () => {
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
  }, []);

  const loadTotalCoins = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(TOTAL_COINS_KEY);
      if (stored) {
        setTotalCoinsSpent(parseInt(stored, 10) || 0);
      }
    } catch (e) {
      console.error('加载总金币失败:', e);
    }
  }, []);

  const addCoinsSpent = useCallback(async (amount) => {
    setTotalCoinsSpent((prev) => {
      const newTotal = prev + amount;
      AsyncStorage.setItem(TOTAL_COINS_KEY, String(newTotal)).catch(
        (e) => console.error('保存总金币失败:', e)
      );
      return newTotal;
    });
  }, []);

  useEffect(() => {
    loadHistory();
    loadHomeState();
    loadTotalCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    history,
    addToHistory,
    removeHistoryItems,
    persistHistory,
    updateHistoryItem,
    startPolling,
    startWebappPolling,
    stopPolling,
    refreshRunningTasks,
    resumeRunningPolling,
    homeState,
    saveHomeState,
    totalCoinsSpent,
    addCoinsSpent,
  }), [history, addToHistory, removeHistoryItems, persistHistory, updateHistoryItem, startPolling, startWebappPolling, stopPolling, refreshRunningTasks, resumeRunningPolling, homeState, saveHomeState, totalCoinsSpent, addCoinsSpent]);

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistoryContext() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryContext 必须在 HistoryProvider 内部使用');
  }
  return context;
}
