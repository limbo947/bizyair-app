import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MODELS } from '../constants/models';
import { STORAGE_KEYS, FAVORITES_MAX_COUNT } from '../constants/modelMeta';

const FavoritesContext = createContext(null);

const DEFAULT_FAVORITES = ['bza-image-b2-base', 'bza-image-b-pro-official', 'bza-image-o2-official'];

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);

  const saveFavorites = useCallback(async (newFavorites) => {
    try {
      const filtered = newFavorites.filter((modelId) => MODELS[modelId]);
      const limited = filtered.slice(0, FAVORITES_MAX_COUNT);
      setFavorites(limited);
      await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(limited));
    } catch (e) {
      console.error('保存常用模型失败:', e);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFavorite = useCallback((modelId) => {
    if (!MODELS[modelId]) return;
    if (favorites.includes(modelId)) return;
    const newFavorites = [...favorites, modelId].slice(0, FAVORITES_MAX_COUNT);
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const removeFavorite = useCallback((modelId) => {
    const newFavorites = favorites.filter((id) => id !== modelId);
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

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

  const value = useMemo(() => ({
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    saveFavorites,
  }), [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, saveFavorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext 必须在 FavoritesProvider 内部使用');
  }
  return context;
}
