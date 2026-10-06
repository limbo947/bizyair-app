import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryTaskResult, queryWebappTaskDetail, queryWebappTaskOutputs, cancelWebappTask, interruptWebappTask } from '../../services/apiClient';
import { ENV_API_KEY, POLLING_INTERVAL_MS } from '../../constants/apiConfig';
import {
  HISTORY_KEY,
  HOME_STATE_KEY,
  TOTAL_COINS_KEY,
  MODELS,
} from '../../constants/models';
import { MODEL_ID_MIGRATIONS } from '../../constants/modelIdMigrations';
import { useApiKeyContext } from '../ApiKeyContext';
import { HistoryListContext, HomeStateContext, PollingContext, DEFAULT_HOME_STATE, MAX_POLL_FAILS, MAX_NOT_FOUND_RETRIES, ACTIVE_STATUSES, getPollingInterval, extractTaskResult, extractWebappResult } from './contexts';
import { cacheTaskResults, deleteCachedFiles } from '../../utils/resultCache';
import { ERROR_CODES } from '../../utils/errorMessages';

/** 判断是否为"任务未找到"类的暂时性错误（服务端尚未就绪） */
function isTaskNotFoundError(err) {
  // httpClient 挂载 apiCode 后优先读业务码，message 正则保留作兜底
  if (err?.apiCode === 30009 || err?.apiCode === 20011) return true;
  if (err.code === ERROR_CODES.NOT_FOUND) return true;
  const msg = err.message || '';
  // 匹配 [404]{"code":30009,...} 或包含 30009 的错误
  if (/\[404\]/.test(msg) || /"code"\s*:\s*30009/.test(msg)) return true;
  return false;
}

export function HistoryProvider({ children }) {
  const { apiKey } = useApiKeyContext();

  const [_history, setHistory] = useState(undefined);
  const history = useMemo(() => _history ?? [], [_history]);
  const [homeState, setHomeState] = useState(DEFAULT_HOME_STATE);
  const [totalCoinsSpent, setTotalCoinsSpent] = useState(0);
  const pollingRef = useRef({});
  const historyRef = useRef(history);
  const resumeTimerRef = useRef(null);
  const homeStateRef = useRef(homeState);

  // "任务未找到"共享计数 map：三处轮询分支（modelzoo 轮询 / webapp 轮询 / 单次查询）
  // 共用一份上限逻辑，避免各写一份计数导致行为漂移（迁移方案 §3.9）
  const notFoundCountsRef = useRef({});
  const recordNotFound = useCallback((taskId) => {
    const counts = notFoundCountsRef.current;
    counts[taskId] = (counts[taskId] || 0) + 1;
    return counts[taskId];
  }, []);
  const clearNotFound = useCallback((taskId) => {
    delete notFoundCountsRef.current[taskId];
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      const intervals = pollingRef.current;
      Object.keys(intervals).forEach((id) => {
        if (intervals[id]) clearTimeout(intervals[id]);
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

  // 轮询高频更新（每任务每 3 秒）时的防抖持久化：避免每次状态变化
  // 都全量 JSON.stringify 整个历史数组写存储；pending 数据存 ref 供卸载时兜底 flush
  const persistTimerRef = useRef(null);
  const pendingHistoryRef = useRef(null);
  const flushHistory = useCallback(() => {
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
      persistTimerRef.current = null;
    }
    const data = pendingHistoryRef.current;
    if (data) {
      pendingHistoryRef.current = null;
      return AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(data)).catch(
        (e) => console.error('保存历史记录失败:', e)
      );
    }
    return Promise.resolve();
  }, []);

  const persistHistory = useCallback((updated, immediate = false) => {
    pendingHistoryRef.current = updated;
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    // 新增/删除等低频关键操作立即落盘；轮询状态高频更新走防抖
    if (immediate) {
      flushHistory();
      return;
    }
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null;
      flushHistory();
    }, 800);
  }, [flushHistory]);

  // 卸载兜底：防抖窗口内未落盘的最后一次变更立即写入
  useEffect(() => {
    return () => { flushHistory(); };
  }, [flushHistory]);

  const addToHistory = useCallback(async (entry) => {
    setHistory((prev) => {
      const updated = [entry, ...(prev ?? [])];
      persistHistory(updated, true);
      return updated;
    });
  }, [persistHistory]);

  const removeHistoryItems = useCallback(async (predicate) => {
    setHistory((prev) => {
      const arr = prev ?? [];
      const removed = arr.filter(predicate);
      const updated = arr.filter((item) => !predicate(item));
      // 停止已删除项的轮询定时器，避免资源泄漏
      removed.forEach((item) => {
        if (pollingRef.current[item.id]) {
          clearTimeout(pollingRef.current[item.id]);
          delete pollingRef.current[item.id];
        }
      });
      // 异步清理已删除项的本地缓存
      removed.forEach((item) => deleteCachedFiles(item.id));
      persistHistory(updated, true);
      return updated;
    });
  }, [persistHistory]);

  const updateHistoryItem = useCallback((id, updates) => {
    setHistory((prev) => {
      const arr = prev ?? [];
      const idx = arr.findIndex((h) => h.id === id);
      if (idx === -1) return arr;
      const updated = [...arr];
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
    const startTime = Date.now();

    const pollOnce = async () => {
      try {
        const result = await queryTaskResult(ak, requestId);
        failCount = 0;
        clearNotFound(id);
        updateHistoryItem(id, { status: result.status, lastResponse: result });

        if (result.status === 'Success') {
          delete pollingRef.current[id];
          const taskResult = extractTaskResult(result);
          updateHistoryItem(id, {
            status: 'Success',
            ...taskResult,
            completedAt: Date.now(),
            lastResponse: result,
          });
          // 异步缓存结果文件到本地（不阻塞 UI）
          cacheTaskResults(taskResult, id).then((localPaths) => {
            if (Object.keys(localPaths).length > 0) {
              updateHistoryItem(id, localPaths);
            }
          }).catch((err) => {
            console.warn('[HistoryProvider] 缓存结果失败:', err?.message || err);
          });
          return;
        } else if (result.status === 'Failed') {
          delete pollingRef.current[id];
          updateHistoryItem(id, {
            status: 'Failed',
            errorMessage: result.message || '任务失败',
            completedAt: Date.now(),
            lastResponse: result,
          });
          return;
        } else if (result.status === 'Canceled') {
          // 服务端侧取消/超时或共享 Key 的他端操作可产生 Canceled 终态，
          // 不补分支会永久轮询（官方 quickstart 通用终态枚举）
          delete pollingRef.current[id];
          updateHistoryItem(id, {
            status: 'Canceled',
            errorMessage: '任务已取消',
            completedAt: Date.now(),
            lastResponse: result,
          });
          return;
        }
      } catch (err) {
        // "任务未找到"是暂时性错误（服务端尚未就绪），但必须有上限：
        // URL 形态错误会让 404 永久返回，超限标记 Failed 避免静默死循环
        if (isTaskNotFoundError(err)) {
          if (recordNotFound(id) >= MAX_NOT_FOUND_RETRIES) {
            delete pollingRef.current[id];
            clearNotFound(id);
            updateHistoryItem(id, {
              status: 'Failed',
              errorMessage: '任务不存在或接口不匹配，已停止轮询',
              completedAt: Date.now(),
              lastResponse: { status: 'Failed', error: err.message },
            });
            return;
          }
          console.warn('[HistoryProvider] 任务尚未就绪，继续轮询:', err.message);
        } else {
          failCount++;
        }
        if (failCount >= MAX_POLL_FAILS) {
          delete pollingRef.current[id];
          clearNotFound(id);
          updateHistoryItem(id, {
            status: 'Failed',
            errorMessage: `连续${MAX_POLL_FAILS}次轮询失败: ${err.message || '网络异常'}`,
            completedAt: Date.now(),
            lastResponse: { status: 'Failed', error: err.message },
          });
          return;
        }
      }
      const elapsed = Date.now() - startTime;
      const nextInterval = getPollingInterval(elapsed);
      pollingRef.current[id] = setTimeout(pollOnce, nextInterval);
    };

    pollingRef.current[id] = setTimeout(pollOnce, POLLING_INTERVAL_MS);
  }, [updateHistoryItem, recordNotFound, clearNotFound]);

  const startWebappPolling = useCallback((id, requestId, ak) => {
    if (pollingRef.current[id]) return;

    let failCount = 0;
    const startTime = Date.now();

    const mapStatus = (s) => {
      if (s === 'Queuing' || s === 'Preparing') return 'Pending';
      if (s === 'Canceled') return 'Canceled';
      return s;
    };

    const pollOnce = async () => {
      try {
        const detail = await queryWebappTaskDetail(ak, requestId);
        failCount = 0;
        clearNotFound(id);
        const rawStatus = detail.status;
        const mappedStatus = mapStatus(rawStatus);

        if (rawStatus === 'Success') {
          delete pollingRef.current[id];
          clearNotFound(id);
          // 先尝试获取产物，再一次性更新状态+产物，避免中间态"已完成但无产物"
          try {
            const outputData = await queryWebappTaskOutputs(ak, requestId);
            const taskResult = extractWebappResult(outputData.outputs);
            updateHistoryItem(id, {
              status: 'Success',
              ...taskResult,
              completedAt: Date.now(),
              lastResponse: { ...detail, outputs: outputData.outputs },
            });
            // 异步缓存结果文件到本地
            cacheTaskResults(taskResult, id).then((localPaths) => {
              if (Object.keys(localPaths).length > 0) {
                updateHistoryItem(id, localPaths);
              }
            }).catch((err) => {
              console.warn('[HistoryProvider] 缓存 webapp 结果失败:', err?.message || err);
            });
          } catch (_outputErr) {
            console.warn('获取 webapp 输出失败，使用 detail 作为 lastResponse:', _outputErr?.message || _outputErr);
            updateHistoryItem(id, {
              status: 'Success',
              completedAt: Date.now(),
              lastResponse: detail,
            });
          }
          return;
        } else if (rawStatus === 'Failed' || rawStatus === 'Canceled') {
          delete pollingRef.current[id];
          clearNotFound(id);
          const isCanceled = rawStatus === 'Canceled' || mappedStatus === 'Canceled';
          updateHistoryItem(id, {
            status: isCanceled ? 'Canceled' : mappedStatus,
            errorMessage: detail.error_message || (isCanceled ? '任务已取消' : '任务失败'),
            completedAt: Date.now(),
            lastResponse: detail,
          });
          return;
        }

        // 非终态才更新中间状态
        updateHistoryItem(id, { status: mappedStatus, lastResponse: detail });
      } catch (err) {
        // "任务未找到"是暂时性错误（服务端尚未就绪），但必须有上限：
        // URL 形态错误会让 404 永久返回，超限标记 Failed 避免静默死循环
        if (isTaskNotFoundError(err)) {
          if (recordNotFound(id) >= MAX_NOT_FOUND_RETRIES) {
            delete pollingRef.current[id];
            clearNotFound(id);
            updateHistoryItem(id, {
              status: 'Failed',
              errorMessage: '任务不存在或接口不匹配，已停止轮询',
              completedAt: Date.now(),
              lastResponse: { status: 'Failed', error: err.message },
            });
            return;
          }
          console.warn('[HistoryProvider] Webapp任务尚未就绪，继续轮询:', err.message);
        } else {
          failCount++;
        }
        if (failCount >= MAX_POLL_FAILS) {
          delete pollingRef.current[id];
          clearNotFound(id);
          updateHistoryItem(id, {
            status: 'Failed',
            errorMessage: `连续${MAX_POLL_FAILS}次轮询失败: ${err.message || '网络异常'}`,
            completedAt: Date.now(),
            lastResponse: { status: 'Failed', error: err.message },
          });
          return;
        }
      }
      const elapsed = Date.now() - startTime;
      const nextInterval = getPollingInterval(elapsed);
      pollingRef.current[id] = setTimeout(pollOnce, nextInterval);
    };

    pollingRef.current[id] = setTimeout(pollOnce, POLLING_INTERVAL_MS);
  }, [updateHistoryItem, recordNotFound, clearNotFound]);

  const querySingleTask = useCallback(async (item, key) => {
    const ak = key || apiKey || ENV_API_KEY;
    if (!item.requestId || !ak) return;
    try {
      const result = await queryTaskResult(ak, item.requestId);
      updateHistoryItem(item.id, { status: result.status, lastResponse: result });
      if (result.status === 'Success') {
        clearNotFound(item.id);
        const taskResult = extractTaskResult(result);
        updateHistoryItem(item.id, {
          status: 'Success',
          ...taskResult,
          completedAt: Date.now(),
          lastResponse: result,
        });
        // 异步缓存结果文件到本地
        cacheTaskResults(taskResult, item.id).then((localPaths) => {
          if (Object.keys(localPaths).length > 0) {
            updateHistoryItem(item.id, localPaths);
          }
        }).catch((err) => {
          console.warn('[HistoryProvider] 缓存结果失败:', err?.message || err);
        });
      } else if (result.status === 'Failed') {
        updateHistoryItem(item.id, {
          status: 'Failed',
          errorMessage: result.message || '任务失败',
          completedAt: Date.now(),
          lastResponse: result,
        });
      } else if (result.status === 'Canceled') {
        // 与 startPolling 同理：Canceled 为通用终态，避免每次刷新都重复查询
        updateHistoryItem(item.id, {
          status: 'Canceled',
          errorMessage: '任务已取消',
          completedAt: Date.now(),
          lastResponse: result,
        });
      }
    } catch (err) {
      // "任务未找到"是暂时性错误，保持当前状态不标记失败，等轮询继续查询；
      // 但与轮询分支共享同一计数上限，超限说明任务确实不存在（或接口形态错误）
      if (isTaskNotFoundError(err)) {
        if (recordNotFound(item.id) >= MAX_NOT_FOUND_RETRIES) {
          clearNotFound(item.id);
          updateHistoryItem(item.id, {
            status: 'Failed',
            errorMessage: '任务不存在或接口不匹配，已停止追踪',
            completedAt: Date.now(),
            lastResponse: { status: 'Failed', error: err.message },
          });
          return;
        }
        console.warn('[HistoryProvider] 查询任务未找到，保持当前状态:', err.message);
        return;
      }
      updateHistoryItem(item.id, {
        status: 'Failed',
        errorMessage: err.message || '轮询请求失败',
        completedAt: Date.now(),
        lastResponse: { status: 'Failed', error: err.message },
      });
    }
  }, [apiKey, updateHistoryItem, recordNotFound, clearNotFound]);

  const resumeRunningPolling = useCallback((historyItems) => {
    const items = historyItems || historyRef.current;
    if (!Array.isArray(items)) return;
    const running = items.filter(
      (h) => h && (h.status === 'Running' || h.status === 'Pending') && h.requestId
    );

    const BATCH_SIZE = 3;
    let batchIndex = 0;

    const processBatch = () => {
      const batch = running.slice(batchIndex, batchIndex + BATCH_SIZE);
      if (batch.length === 0) return;

      batch.forEach((item) => {
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

      batchIndex += BATCH_SIZE;
      if (batchIndex < running.length) {
        setTimeout(processBatch, 1000);
      }
    };

    processBatch();
  }, [apiKey, querySingleTask, startPolling, startWebappPolling]);

  const refreshRunningTasks = useCallback(async () => {
    const current = historyRef.current;
    if (!Array.isArray(current)) return;
    const running = current.filter(
      (h) => h && ACTIVE_STATUSES.includes(h.status) && h.requestId
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
        clearTimeout(pollingRef.current[id]);
        delete pollingRef.current[id];
      }
      updateHistoryItem(id, {
        status: 'Failed',
        errorMessage: '任务已终止',
        completedAt: Date.now(),
      });
      return;
    }

    // 局部 MAX_RETRIES（取消前重查/重试上限，=5）与 apiConfig.js 的 MAX_RETRIES（HTTP 重试，=3）同名异义
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
          // 只提示取消中，不强制回写 status：轮询保留用于收尾最终状态，
          // 且避免竞态下把恰好已进入终态的任务打回 Pending
          updateHistoryItem(id, {
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
      homeStateRef.current = updated; // 同步更新 ref，确保后续调用能读到最新值
      setHomeState(updated);
      await AsyncStorage.setItem(HOME_STATE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('保存主页状态失败:', e);
      return false;
    }
  }, []);

  const resubmitTask = useCallback(async (historyItem) => {
    if (!historyItem) return false;
    // 下架模型禁止重跑（重跑会命中 404/60014 等错误）：历史可查看，但参数不可恢复（§5.8）
    if (!historyItem.modelId || !MODELS[historyItem.modelId]) return false;

    const updates = {
      modelId: historyItem.modelId,
      mode: historyItem.mode || 'text-to-image',
      prompt: historyItem.prompt || '',
    };

    // 图片/视频 URL
    // 任务完成后 imageUrls/videoUrls 会被输出结果覆盖，不再恢复
    const isCompleted = historyItem.status === 'Success' || historyItem.status === 'Failed' || historyItem.status === 'Canceled';
    if (!isCompleted && historyItem.imageUrls && historyItem.imageUrls.length > 0) {
      updates.imageUrls = historyItem.imageUrls;
    }
    if (!isCompleted && historyItem.videoUrls && historyItem.videoUrls.length > 0) {
      updates.videoUrls = historyItem.videoUrls;
    }
    // 以下字段不会被输出结果覆盖，可安全恢复
    if (historyItem.firstFrameUrls && historyItem.firstFrameUrls.length > 0) {
      updates.firstFrameUrls = historyItem.firstFrameUrls;
    }
    if (historyItem.lastFrameUrls && historyItem.lastFrameUrls.length > 0) {
      updates.lastFrameUrls = historyItem.lastFrameUrls;
    }
    if (historyItem.firstClipUrls && historyItem.firstClipUrls.length > 0) {
      updates.firstClipUrls = historyItem.firstClipUrls;
    }
    if (historyItem.refImages && historyItem.refImages.length > 0) {
      updates.refImages = historyItem.refImages;
    }

    // 生成参数
    if (historyItem.resolution) updates.resolution = historyItem.resolution;
    if (historyItem.aspectRatio) updates.aspectRatio = historyItem.aspectRatio;
    if (historyItem.quality) updates.quality = historyItem.quality;
    if (historyItem.duration != null) updates.duration = historyItem.duration;
    if (historyItem.seed) updates.seed = historyItem.seed;
    if (historyItem.negativePrompt) updates.negativePrompt = historyItem.negativePrompt;
    if (historyItem.systemPrompt) updates.systemPrompt = historyItem.systemPrompt;
    if (historyItem.temperature != null) updates.temperature = historyItem.temperature;
    if (historyItem.maxTokens) updates.maxTokens = historyItem.maxTokens;
    if (historyItem.voice) updates.voice = historyItem.voice;
    if (historyItem.style) updates.style = historyItem.style;

    await saveHomeState(updates);
    return true;
  }, [saveHomeState]);
  const loadHomeState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(HOME_STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const normalized = {
            ...parsed,
            imageUrls: Array.isArray(parsed.imageUrls) ? parsed.imageUrls : [],
            videoUrls: Array.isArray(parsed.videoUrls) ? parsed.videoUrls : [],
            firstFrameUrls: Array.isArray(parsed.firstFrameUrls) ? parsed.firstFrameUrls : [],
            lastFrameUrls: Array.isArray(parsed.lastFrameUrls) ? parsed.lastFrameUrls : [],
            firstClipUrls: Array.isArray(parsed.firstClipUrls) ? parsed.firstClipUrls : [],
            refImages: Array.isArray(parsed.refImages) ? parsed.refImages : [],
          };
          // 存量 homeState 的 modelId 过一次迁移表（如 bza-image-b2-base → nano-banana-2-channel），
          // 与收藏列表共用同一张表；否则持久化的旧默认模型不会自愈
          normalized.modelId = MODEL_ID_MIGRATIONS[normalized.modelId] || normalized.modelId;
          setHomeState({ ...DEFAULT_HOME_STATE, ...normalized });
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

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadHistory();
    loadHomeState();
    loadTotalCoins();
  }, [loadHistory, loadHomeState, loadTotalCoins]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const historyListValue = useMemo(() => ({
    history,
    addToHistory,
    removeHistoryItems,
    persistHistory,
    updateHistoryItem,
    totalCoinsSpent,
    addCoinsSpent,
  }), [history, addToHistory, removeHistoryItems, persistHistory, updateHistoryItem, totalCoinsSpent, addCoinsSpent]);

  const homeStateValue = useMemo(() => ({
    homeState,
    saveHomeState,
    resubmitTask,
  }), [homeState, saveHomeState, resubmitTask]);

  const pollingValue = useMemo(() => ({
    startPolling,
    startWebappPolling,
    stopPolling,
    refreshRunningTasks,
    resumeRunningPolling,
  }), [startPolling, startWebappPolling, stopPolling, refreshRunningTasks, resumeRunningPolling]);

  return (
    <HistoryListContext.Provider value={historyListValue}>
      <HomeStateContext.Provider value={homeStateValue}>
        <PollingContext.Provider value={pollingValue}>
          {children}
        </PollingContext.Provider>
      </HomeStateContext.Provider>
    </HistoryListContext.Provider>
  );
}
