import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../constants/theme';

export function ModelSelector({
  currentModel,
  modelId,
  onSelectModel,
  onOpenFavorites,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.currentModelButton}
        onPress={onOpenFavorites}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentModel.icon.name}
          size={18}
          color={currentModel.icon.color}
          style={{ paddingLeft: 2 }}
        />
        <Text style={styles.currentModelName}>{currentModel.name}</Text>
        <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textTertiary} style={{ paddingLeft: 4, paddingRight: 4 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  currentModelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: Spacing.sm,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
    flex: 1,
  },
  currentModelName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    paddingLeft: 2,
    paddingRight: 2,
  },
});
