import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          <View style={styles.valueRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => {
                const v = Math.round((speed - 0.1) * 10) / 10;
                if (v >= (speedRange?.[0] || 0.5)) setSpeed(v);
              }}
            >
              <Ionicons name="remove" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => {
                const v = Math.round((speed + 0.1) * 10) / 10;
                if (v <= (speedRange?.[1] || 2)) setSpeed(v);
              }}
            >
              <Ionicons name="add" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>最大 Tokens</Text>
          <Text style={styles.rangeHint}>1 ~ {maxTokensMax || 1024}</Text>
        </View>
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => {
              const v = Math.max(1, maxTokens - 128);
              setMaxTokens(v);
            }}
          >
            <Ionicons name="remove" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
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
            placeholderTextColor={Colors.textPlaceholder}
          />
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => {
              const v = Math.min(maxTokensMax || 1024, maxTokens + 128);
              setMaxTokens(v);
            }}
          >
            <Ionicons name="add" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
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
  rangeHint: { fontSize: 12, color: Colors.textTertiary },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  valueInput: { fontSize: 14, color: Colors.primary, fontWeight: '600', borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4, minWidth: 52, textAlign: 'center' },
  stepBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.separator },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.sm, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.separator },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.textInverse, fontWeight: '600' },
  promptInput: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20, minHeight: 60, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: Colors.bg },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  inputSingle: { flex: 1, fontSize: 15, color: Colors.textPrimary, textAlign: 'center', borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 10, backgroundColor: Colors.bg },
});
