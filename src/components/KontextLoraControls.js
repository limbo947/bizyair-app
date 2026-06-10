import React from 'react';
import { View, TextInput } from 'react-native';
import { Radius, Spacing, Typography } from '../constants/theme';
import { createSharedStyles } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { ParamLabel } from './ParamLabel';

export function KontextLoraControls({ seed, setSeed }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.card}>
      <ParamLabel label="种子 (Seed)" required={false} />
      <TextInput
        style={styles.singleInput}
        value={seed}
        onChangeText={setSeed}
        placeholder="留空随机"
        placeholderTextColor={colors.textPlaceholder}
        keyboardType="numeric"
      />
    </View>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  singleInput: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: colors.bg },
});
