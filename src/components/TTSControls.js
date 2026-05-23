import React from 'react';
import { Text, View, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';

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
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>语音</Text>
        <View style={styles.chipRow}>
          {(voices || []).map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.chip, voice === v && styles.chipActive]}
              onPress={() => setVoice(v)}
            >
              <Text style={[styles.chipText, voice === v && styles.chipTextActive]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>输出格式</Text>
        <View style={styles.chipRow}>
          {(formats || []).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, responseFormat === f && styles.chipActive]}
              onPress={() => setResponseFormat(f)}
            >
              <Text style={[styles.chipText, responseFormat === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>语言</Text>
        <View style={styles.chipRow}>
          {(languages || []).map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, language === l && styles.chipActive]}
              onPress={() => setLanguage(l)}
            >
              <Text style={[styles.chipText, language === l && styles.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>语速</Text>
          <TextInput
            style={styles.valueInput}
            value={speed.toFixed(1)}
            onChangeText={(t) => {
              const val = parseFloat(t);
              if (!isNaN(val) && val >= 0.5 && val <= 2.0) setSpeed(Math.round(val * 10) / 10);
            }}
            keyboardType="decimal-pad"
            selectTextOnFocus
          />
        </View>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderMin}>0.5</Text>
          <View style={styles.sliderTrack}>
            {[0.5, 1.0, 1.5, 2.0].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.sliderDot, Math.abs(speed - v) < 0.01 && styles.sliderDotActive]}
                onPress={() => setSpeed(v)}
              >
                <Text style={[styles.sliderDotText, Math.abs(speed - v) < 0.01 && styles.sliderDotTextActive]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sliderMax}>2.0</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>最大 Tokens</Text>
        <TextInput
          style={styles.inputSingle}
          value={String(maxTokens)}
          onChangeText={(t) => {
            const val = parseInt(t) || 0;
            if (maxTokensMax && val > maxTokensMax) return;
            setMaxTokens(val);
          }}
          keyboardType="numeric"
          placeholder="1024"
          placeholderTextColor={Colors.textPlaceholder}
        />
      </View>

      {instructions !== undefined ? (
        <View style={styles.card}>
          <Text style={styles.label}>指令</Text>
          <TextInput
            style={styles.promptInput}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            placeholder="可选：指定语音风格、情感等..."
            placeholderTextColor={Colors.textPlaceholder}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  valueInput: { fontSize: 14, color: Colors.primary, fontWeight: '600', borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, minWidth: 60, textAlign: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.separator },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.textInverse, fontWeight: '600' },
  promptInput: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20, minHeight: 60, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: Colors.bg },
  inputSingle: { fontSize: 15, color: Colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 10, backgroundColor: Colors.bg },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sliderMin: { fontSize: 12, color: Colors.textTertiary },
  sliderMax: { fontSize: 12, color: Colors.textTertiary },
  sliderTrack: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  sliderDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  sliderDotActive: { backgroundColor: Colors.primary },
  sliderDotText: { fontSize: 10, color: Colors.textTertiary, fontWeight: '500' },
  sliderDotTextActive: { color: Colors.textInverse, fontWeight: '600' },
});
