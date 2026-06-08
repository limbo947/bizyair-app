import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * 根据当前主题动态生成样式。
 * @param {(colors: object, theme: object) => object} createStyles - 接收 colors 和 theme 返回样式对象的工厂函数
 * @returns {object} 带主题的样式对象，主题切换时自动更新
 */
export function useThemedStyles(createStyles) {
  const { theme } = useTheme();
  return useMemo(() => createStyles(theme.colors, theme), [theme, createStyles]);
}
