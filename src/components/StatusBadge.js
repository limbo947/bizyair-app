import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { STATUS_LABELS } from '../constants/models';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../constants/theme';
import { badgeBase } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';

const createStyles = (colors, theme) => ({
  badge: {
    ...badgeBase,
  },
  spinner: { marginRight: 0 },
  badgeText: {
    fontSize: Typography.fontSize.caption2,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export function StatusBadge({ status }) {
  const { theme, colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const label = STATUS_LABELS[status] || status;
  const color = theme.STATUS_COLORS[status] || colors.textTertiary;
  const bg = theme.STATUS_BG[status] || colors.card;
  const isActive = ['Pending', 'Running', 'Saving'].includes(status);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {isActive ? <ActivityIndicator size="small" color={color} style={styles.spinner} /> : null}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}
