import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography, pressedOpacity } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

const createStyles = (colors) => ({
  container: {},
  currentModelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.xs,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  currentModelName: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.xs,
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
      <Pressable
        style={({ pressed }) => [styles.currentModelButton, pressed && pressedOpacity()]} onPress={onOpenFavorites} >
        <Ionicons
          name={currentModel.icon.name}
          size={18}
          color={currentModel.icon.color}
          style={{ paddingLeft: Spacing.xs }}
        />
        <Text style={styles.currentModelName}>{currentModel.name}</Text>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.textTertiary} style={{ paddingLeft: Spacing.xs, paddingRight: Spacing.xs }} />
      </Pressable>
    </View>
  );
}
