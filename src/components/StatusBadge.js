import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { STATUS_LABELS } from '../constants/models';
import { useTheme } from '../context/ThemeContext';
import { Radius, Spacing } from '../constants/theme';

export function StatusBadge({ status }) {
  const { theme, colors } = useTheme();
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

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.full, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: 3, gap: 4 },
  spinner: { marginRight: 0 },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
