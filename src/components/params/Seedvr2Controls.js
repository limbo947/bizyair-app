import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Radius, Spacing, Typography } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ParamLabel } from './ParamLabel';

const RESOLUTION_OPTIONS = [720, 1080, 1440, 2160];
const RESOLUTION_LABELS = { 720: '720p', 1080: '1080p', 1440: '1440p', 2160: '2160p (4K)' };
const RESOLUTION_PRICES = { 720: '1', 1080: '2', 1440: '3', 2160: '4' };

export function Seedvr2Controls({ resolution, setResolution, resolutions }) {
  const styles = useThemedStyles(createStyles);
  const options = resolutions || RESOLUTION_OPTIONS;

  return (
    <View style={styles.card}>
      <ParamLabel label="目标分辨率" required />
      <View style={styles.chipRow}>
        {options.map((r) => (
          <Pressable
            key={r}
            style={({ pressed }) => [
              styles.chip,
              resolution === r && styles.chipActive,
              pressed && styles.pressedStyle,
            ]}
            onPress={() => setResolution(r)}
          >
            <Text style={[styles.chipText, resolution === r && styles.chipTextActive]}>
              {RESOLUTION_LABELS[r] || `${r}p`}
            </Text>
            <Text style={[styles.chipPrice, resolution === r && styles.chipPriceActive]}>
              {RESOLUTION_PRICES[r] || '?'}币
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: Radius.sm, borderCurve: 'continuous',
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.separator,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  chipTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  chipPrice: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary },
  chipPriceActive: { color: colors.textInverse, opacity: 0.8 },
});
