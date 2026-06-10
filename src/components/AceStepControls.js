import React from 'react';
import { Pressable, View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '../constants/theme';
import { createSharedStyles } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { ParamLabel } from './ParamLabel';

export function AceStepControls({
  lyrics, setLyrics,
  tags, setTags,
  duration, setDuration,
  seed, setSeed,
  durationRange,
  defaultDuration,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const minDur = durationRange?.[0] || 10;
  const maxDur = durationRange?.[1] || 300;

  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="歌词" required />
        <TextInput
          style={styles.promptInput}
          value={lyrics}
          onChangeText={setLyrics}
          multiline
          placeholder="输入歌词内容..."
          placeholderTextColor={colors.textPlaceholder}
          maxLength={5000}
        />
      </View>

      <View style={styles.card}>
        <ParamLabel label="风格标签" required={false} />
        <TextInput
          style={styles.singleInput}
          value={tags}
          onChangeText={setTags}
          placeholder="如: pop, rock, electronic..."
          placeholderTextColor={colors.textPlaceholder}
          maxLength={500}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.labelRow}>
          <ParamLabel label="时长 (秒)" required={false} style={{ marginBottom: 0 }} />
          <Text style={styles.rangeHint}>{minDur} ~ {maxDur}</Text>
        </View>
        <View style={styles.inputRow}>
          <Pressable
            style={({ pressed }) => [styles.stepBtn, pressed && styles.pressedStyle]}
            onPress={() => {
              const v = Math.max(minDur, (parseInt(duration) || defaultDuration || 30) - 5);
              setDuration(v);
            }}
          >
            <Ionicons name="remove" size={18} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.inputSingle}
            value={String(duration || defaultDuration || 30)}
            onChangeText={(t) => {
              const val = parseInt(t) || 0;
              if (val >= minDur && val <= maxDur) setDuration(val);
            }}
            keyboardType="numeric"
            selectTextOnFocus
          />
          <Pressable
            style={({ pressed }) => [styles.stepBtn, pressed && styles.pressedStyle]}
            onPress={() => {
              const v = Math.min(maxDur, (parseInt(duration) || defaultDuration || 30) + 5);
              setDuration(v);
            }}
          >
            <Ionicons name="add" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

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
    </>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  rangeHint: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs + 2 },
  inputSingle: { flex: 1, fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, textAlign: 'center', borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm + 2, backgroundColor: colors.bg },
  stepBtn: { width: 28, height: 28, borderRadius: 14, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.separator },
  singleInput: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: colors.bg },
  promptInput: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, lineHeight: Typography.lineHeight.normal, minHeight: 80, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: colors.bg },
});
