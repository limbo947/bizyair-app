import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { STATUS_LABELS, STATUS_COLORS, STATUS_BG } from '../constants/models';
import { Radius, Spacing } from '../constants/theme';

export function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  const color = STATUS_COLORS[status] || '#8E8E93';
  const bg = STATUS_BG[status] || '#E5E5EA';
  const isActive = ['Pending', 'Running', 'Saving'].includes(status);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {isActive && <ActivityIndicator size="small" color={color} style={styles.spinner} />}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3, gap: 4 },
  spinner: { marginRight: 0 },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
