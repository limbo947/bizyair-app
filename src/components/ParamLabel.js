import React from 'react';
import { Text } from 'react-native';
import { Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export function ParamLabel({ label, required, style }) {
  const { colors } = useTheme();
  return (
    <Text style={[{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }, style]}>
      {label}{required ? <Text style={{ color: colors.error }}> *</Text> : <Text style={{ color: colors.textTertiary, fontWeight: '400', textTransform: 'none' }}> (可选)</Text>}
    </Text>
  );
}
