import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { STATUS_LABELS, STATUS_COLORS } from '../constants/models';

export function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  const color = STATUS_COLORS[status] || '#999';
  const isActive = ['Pending', 'Running', 'Saving'].includes(status);
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      {isActive && <ActivityIndicator size="small" color={color} style={styles.spinner} />}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, gap: 4 },
  spinner: { marginRight: 0 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
});
