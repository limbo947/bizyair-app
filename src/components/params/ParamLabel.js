import React from 'react';
import { Text } from 'react-native';
import { Typography, Spacing } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export function ParamLabel({ label, required, style }) {
  const { colors } = useTheme();
  return (
    <Text style={[{ fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: Typography.letterSpacing.wide }, style]}>
      {label}{required ? <Text style={{ color: colors.error }}> *</Text> : <Text style={{ color: colors.textTertiary, fontWeight: Typography.fontWeight.regular, textTransform: 'none' }}> (可选)</Text>}
    </Text>
  );
}
