import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRESETS_KEY = 'bizyair_param_presets';
const MAX_PRESETS = 20;

export function usePresets() {
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(PRESETS_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setPresets(parsed);
        } catch {}
      }
    });
  }, []);

  const persistPresets = useCallback(async (updated) => {
    setPresets(updated);
    try {
      await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('保存预设失败:', e);
    }
  }, []);

  const savePreset = useCallback(async (name, modelId, mode, params) => {
    const entry = {
      id: `preset_${Date.now()}`,
      name,
      modelId,
      mode,
      params,
      createdAt: Date.now(),
    };
    // 函数式更新读取最新列表，避免快速连续保存时闭包中的旧 presets 覆盖前一次保存
    let updated;
    setPresets((prev) => {
      updated = [entry, ...prev].slice(0, MAX_PRESETS);
      return updated;
    });
    await persistPresets(updated);
    return entry;
  }, [persistPresets]);

  const deletePreset = useCallback(async (id) => {
    let updated;
    setPresets((prev) => {
      updated = prev.filter((p) => p.id !== id);
      return updated;
    });
    await persistPresets(updated);
  }, [persistPresets]);

  return { presets, savePreset, deletePreset };
}
