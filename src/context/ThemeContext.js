import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme, updateColors } from '../constants/theme';

const THEME_MODE_KEY = 'theme_mode';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light');
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (stored === 'dark' || stored === 'light') {
          setThemeMode(stored);
          updateColors(stored);
        }
      } catch (e) {
        console.error('加载主题模式失败:', e);
      }
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    updateColors(next);
    setThemeKey((k) => k + 1);
    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, next);
    } catch (e) {
      console.error('保存主题模式失败:', e);
    }
  }, [themeMode]);

  const theme = useMemo(() => createTheme(themeMode), [themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      toggleTheme,
      colors: theme.colors,
      theme,
      themeKey,
    }),
    [themeMode, toggleTheme, theme, themeKey]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用');
  }
  return context;
}
