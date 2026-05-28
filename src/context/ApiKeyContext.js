import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserInfo, fetchWalletBalance } from '../services/apiClient';
import {
  ENV_API_KEY,
  API_KEY_STORAGE_KEY,
  API_KEYS_STORAGE_KEY,
  ACTIVE_KEY_ID_KEY,
} from '../constants/models';

const ApiKeyContext = createContext(null);

export function ApiKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [activeApiKeyId, setActiveApiKeyId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const refreshUserInfo = useCallback(async (key) => {
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
  }, [apiKey]);

  const saveApiKeys = useCallback(async (keys, activeId) => {
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
  }, []);

  const generateKeyId = useCallback(() => `key_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, []);

  const loadApiKeys = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(API_KEYS_STORAGE_KEY);
      let keys = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        keys = Array.isArray(parsed) ? parsed : [];
        if (!Array.isArray(parsed)) {
          console.warn('API Keys 数据异常（非数组），已重置');
        }
      } else {
        const legacyKey = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
        if (legacyKey) {
          keys = [{ id: 'default', key: legacyKey }];
        }
      }
      setApiKeys(keys);
      const activeId = await AsyncStorage.getItem(ACTIVE_KEY_ID_KEY);
      const active = activeId && Array.isArray(keys) && keys.find((k) => k && k.id === activeId)
        ? keys.find((k) => k && k.id === activeId)
        : (Array.isArray(keys) ? keys[0] : undefined);
      if (active) {
        setApiKey(active.key);
        setActiveApiKeyId(active.id);
        refreshUserInfo(active.key).catch(() => {});
      }
    } catch (e) {
      console.error('加载 API Keys 失败:', e);
    }
  }, [refreshUserInfo]);

  const addApiKey = useCallback(async (key, name) => {
    const id = generateKeyId();
    const newKeys = [...apiKeys, { id, key, name: name || `密钥 ${apiKeys.length + 1}` }];
    await saveApiKeys(newKeys, id);
    await refreshUserInfo(key);
  }, [apiKeys, saveApiKeys, generateKeyId, refreshUserInfo]);

  const renameApiKey = useCallback(async (id, name) => {
    const newKeys = apiKeys.map((k) => (k.id === id ? { ...k, name } : k));
    await saveApiKeys(newKeys, activeApiKeyId);
  }, [apiKeys, activeApiKeyId, saveApiKeys]);

  const removeApiKey = useCallback(async (id) => {
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
  }, [apiKeys, activeApiKeyId, saveApiKeys, refreshUserInfo]);

  const switchApiKey = useCallback(async (id) => {
    const key = apiKeys.find((k) => k.id === id);
    if (!key) return;
    await saveApiKeys(apiKeys, id);
    await refreshUserInfo(key.key);
  }, [apiKeys, saveApiKeys, refreshUserInfo]);

  const saveApiKey = useCallback(async (key) => {
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
  }, [apiKeys, saveApiKeys, addApiKey, refreshUserInfo]);

  useEffect(() => {
    loadApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    apiKey,
    setApiKey,
    saveApiKey,
    apiKeys,
    activeApiKeyId,
    addApiKey,
    removeApiKey,
    switchApiKey,
    renameApiKey,
    userInfo,
    walletBalance,
    refreshUserInfo,
  }), [apiKey, saveApiKey, apiKeys, activeApiKeyId, addApiKey, removeApiKey, switchApiKey, renameApiKey, userInfo, walletBalance, refreshUserInfo]);

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
}

export function useApiKeyContext() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKeyContext 必须在 ApiKeyProvider 内部使用');
  }
  return context;
}
