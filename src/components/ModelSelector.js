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
  onOpenAllModels,
  onOpenFavorites,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onOpenFavorites}
          activeOpacity={0.7}
        >
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text style={styles.favoriteButtonText}>常用模型</Text>
          <Text style={styles.favoriteButtonArrow}>⌄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.allModelsButton}
          onPress={onOpenAllModels}
          activeOpacity={0.7}
        >
          <Ionicons name="grid-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.allModelsButtonText}>全部分类</Text>
          <Text style={styles.allModelsButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.currentModelRow}>
        <Text style={styles.currentLabel}>当前:</Text>
        <TouchableOpacity
          style={styles.currentModelButton}
          onPress={onOpenAllModels}
          activeOpacity={0.7}
        >
          <Ionicons
            name={currentModel.icon.name}
            size={18}
            color={currentModel.icon.color}
          />
          <Text style={styles.currentModelName}>{currentModel.name}</Text>
          <Text style={styles.currentModelArrow}>⌄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    flex: 1,
  },
  favoriteButtonText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButtonArrow: {
    fontSize: 16,
    color: '#92400E',
    marginTop: -4,
  },
  allModelsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
    flex: 1,
  },
  allModelsButtonText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  allModelsButtonArrow: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  currentModelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  currentLabel: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  currentModelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
  },
  currentModelName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  currentModelArrow: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: -4,
  },
});
