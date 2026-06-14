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
    await AsyncStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
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
    const updated = [entry, ...presets].slice(0, MAX_PRESETS);
    await persistPresets(updated);
    return entry;
  }, [presets, persistPresets]);

  const deletePreset = useCallback(async (id) => {
    const updated = presets.filter((p) => p.id !== id);
    await persistPresets(updated);
  }, [presets, persistPresets]);

  return { presets, savePreset, deletePreset };
}
