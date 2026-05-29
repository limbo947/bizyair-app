import React from 'react';
import { Pressable, View,
  Text,
  TextInput, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

/** 参数标签：必选参数显示红色 *，可选参数显示灰色 (可选) */
function ParamLabel({ label, required, style }) {
  const { colors } = useTheme();
  return (
    <Text style={[{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }, style]}>
      {label}{required ? <Text style={{ color: '#E74C3C' }}> *</Text> : <Text style={{ color: colors.textTertiary, fontWeight: '400', textTransform: 'none' }}> (可选)</Text>}
    </Text>
  );
}

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
              style={({ pressed }) => [styles.chip, voice === v && styles.chipActive, pressed && { opacity: 0.7 }]} onPress={() => setVoice(v)}
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
              style={({ pressed }) => [styles.chip, responseFormat === f && styles.chipActive, pressed && { opacity: 0.7 }]} onPress={() => setResponseFormat(f)}
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
              style={({ pressed }) => [styles.chip, language === l && styles.chipActive, pressed && { opacity: 0.7 }]} onPress={() => setLanguage(l)}
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
              style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]} onPress={() => {
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
              style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]} onPress={() => {
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
            style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]} onPress={() => {
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
            style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.7 }]} onPress={() => {
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
  card: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  rangeHint: { fontSize: 12, color: colors.textTertiary },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  valueInput: { fontSize: 14, color: colors.primary, fontWeight: '600', borderWidth: 1, borderColor: colors.border, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, minWidth: 52, textAlign: 'center' },
  stepBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.separator },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.separator },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: colors.textInverse, fontWeight: '600' },
  promptInput: { fontSize: 14, color: colors.textPrimary, lineHeight: 20, minHeight: 60, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: colors.bg },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  inputSingle: { flex: 1, fontSize: 15, color: colors.textPrimary, textAlign: 'center', borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 10, backgroundColor: colors.bg },
});
