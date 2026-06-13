import React from 'react';
import { Pressable, View,
  Text,
  TextInput, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { ParamLabel } from './ParamLabel';

export function TTSControls({
  voice, setVoice,
  responseFormat, setResponseFormat,
  instructions, setInstructions,
  language, setLanguage,
  speed, setSpeed,
  maxTokens, setMaxTokens,
  voices,
  formats,
  languages,
  speedRange,
  maxTokensMax,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="语音" required />
        <View style={styles.chipRow}>
          {(voices || []).map((v) => (
            <Pressable
              key={v}
              style={({ pressed }) => [styles.chip, voice === v && styles.chipActive, pressed && styles.pressedStyle]} onPress={() => setVoice(v)}
            >
              <Text style={[styles.chipText, voice === v && styles.chipTextActive]}>{v}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <ParamLabel label="输出格式" required={false} />
        <View style={styles.chipRow}>
          {(formats || []).map((f) => (
            <Pressable
              key={f}
              style={({ pressed }) => [styles.chip, responseFormat === f && styles.chipActive, pressed && styles.pressedStyle]} onPress={() => setResponseFormat(f)}
            >
              <Text style={[styles.chipText, responseFormat === f && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <ParamLabel label="语言" required={false} />
        <View style={styles.chipRow}>
          {(languages || []).map((l) => (
            <Pressable
              key={l}
              style={({ pressed }) => [styles.chip, language === l && styles.chipActive, pressed && styles.pressedStyle]} onPress={() => setLanguage(l)}
            >
              <Text style={[styles.chipText, language === l && styles.chipTextActive]}>{l}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.labelRow}>
          <ParamLabel label="语速" required={false} style={{ marginBottom: 0 }} />
          <View style={styles.valueRow}>
            <Pressable
              style={({ pressed }) => [styles.stepBtn, pressed && styles.pressedStyle]} onPress={() => {
                const v = Math.round((speed - 0.1) * 10) / 10;
                if (v >= (speedRange?.[0] || 0.5)) setSpeed(v);
              }}
            >
              <Ionicons name="remove" size={18} color={colors.textSecondary} />
            </Pressable>
            <TextInput
              style={styles.valueInput}
              value={speed.toFixed(1)}
              onChangeText={(t) => {
                const val = parseFloat(t);
                const lo = speedRange?.[0] || 0.5;
                const hi = speedRange?.[1] || 2;
                if (!isNaN(val) && val >= lo && val <= hi) setSpeed(Math.round(val * 10) / 10);
              }}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
            <Pressable
              style={({ pressed }) => [styles.stepBtn, pressed && styles.pressedStyle]} onPress={() => {
                const v = Math.round((speed + 0.1) * 10) / 10;
                if (v <= (speedRange?.[1] || 2)) setSpeed(v);
              }}
            >
              <Ionicons name="add" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.labelRow}>
          <ParamLabel label="最大 Tokens" required={false} style={{ marginBottom: 0 }} />
          <Text style={styles.rangeHint}>1 ~ {maxTokensMax || 1024}</Text>
        </View>
        <View style={styles.inputRow}>
          <Pressable
            style={({ pressed }) => [styles.stepBtn, pressed && styles.pressedStyle]} onPress={() => {
              const v = Math.max(1, maxTokens - 128);
              setMaxTokens(v);
            }}
          >
            <Ionicons name="remove" size={18} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.inputSingle}
            value={String(maxTokens)}
            onChangeText={(t) => {
              const val = parseInt(t) || 0;
              if (maxTokensMax && val > maxTokensMax) return;
              setMaxTokens(Math.max(1, val));
            }}
            keyboardType="numeric"
            placeholder={String(maxTokensMax || 1024)}
            placeholderTextColor={colors.textPlaceholder}
          />
          <Pressable
            style={({ pressed }) => [styles.stepBtn, pressed && styles.pressedStyle]} onPress={() => {
              const v = Math.min(maxTokensMax || 1024, maxTokens + 128);
              setMaxTokens(v);
            }}
          >
            <Ionicons name="add" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <ParamLabel label="指令 (instructions)" required={false} />
        <TextInput
          style={styles.promptInput}
          value={instructions}
          onChangeText={setInstructions}
          multiline
          placeholder="可选：指定语音风格、情感等..."
          placeholderTextColor={colors.textPlaceholder}
          maxLength={2500}
        />
      </View>
    </>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  rangeHint: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs + 2 },
  valueInput: { fontSize: Typography.fontSize.footnote, color: colors.primary, fontWeight: Typography.fontWeight.semibold, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, minWidth: 52, textAlign: 'center' },
  stepBtn: { width: 28, height: 28, borderRadius: 14, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.separator },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.separator },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  chipTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  promptInput: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, lineHeight: Typography.lineHeight.normal, minHeight: 60, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: colors.bg },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs + 2 },
  inputSingle: { flex: 1, fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, textAlign: 'center', borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm + 2, backgroundColor: colors.bg },
});
