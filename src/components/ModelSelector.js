import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

const createStyles = (colors) => ({
  container: {},
  currentModelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: Spacing.sm,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  currentModelName: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    paddingLeft: 2,
    paddingRight: 2,
  },
});

export function ModelSelector({
  currentModel,
  modelId,
  onSelectModel,
  onOpenFavorites,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

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
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.textTertiary} style={{ paddingLeft: 4, paddingRight: 4 }} />
      </TouchableOpacity>
    </View>
  );
}
