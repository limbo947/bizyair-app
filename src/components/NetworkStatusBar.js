import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Typography } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

export function NetworkStatusBar({ isConnected }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  if (isConnected) return null;

  return (
    <View style={styles.bar}>
      <Ionicons name="cloud-offline-outline" size={14} color={colors.textInverse} />
      <Text style={styles.text}>网络不可用</Text>
    </View>
  );
}

const createStyles = (colors) => ({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: colors.error,
    paddingVertical: Spacing.xs,
    width: '100%',
  },
  text: {
    fontSize: Typography.fontSize.caption1,
    color: colors.textInverse,
    fontWeight: Typography.fontWeight.semibold,
  },
});
