import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { QUALITY_LABELS, SIZE_PRESETS } from '../constants/models';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

function useStyles() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  return { styles, colors };
}

export function ResolutionRatioControls({ currentResolutions, currentRatios, resolution, aspectRatio, setResolution, setAspectRatio }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>分辨率</Text>
        <View style={styles.selectorRow}>
          {currentResolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {currentRatios.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>宽高比</Text>
          <View style={styles.aspectRatioGrid}>
            {currentRatios.map((r) => (
              <TouchableOpacity key={r} style={[styles.ratioButton, aspectRatio === r && styles.ratioButtonActive]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

export function WidthHeightQualityControls({ sizePreset, setSizePreset, customWidth, setCustomWidth, customHeight, setCustomHeight, quality, setQuality, modelQualities }) {
  const { styles, colors } = useStyles();
  const w = parseInt(customWidth) || 0;
  const h = parseInt(customHeight) || 0;
  const pixels = w * h;
  const ratioValid = w > 0 && h > 0 && w / h <= 3 && h / w <= 3;
  const pixelsValid = pixels >= 655360 && pixels <= 8294400;
  const stepValid = w % 16 === 0 && h % 16 === 0;
  const hasError = (w > 0 || h > 0) && (!ratioValid || !pixelsValid || !stepValid);
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>尺寸预设</Text>
        <View style={styles.presetGrid}>
          {SIZE_PRESETS.map((p, i) => (
            <TouchableOpacity key={i} style={[styles.presetButton, sizePreset === i && styles.presetButtonActive]}
              onPress={() => { setSizePreset(i); setCustomWidth(String(p.width)); setCustomHeight(String(p.height)); }}>
              <Text style={[styles.presetLabel, sizePreset === i && styles.presetLabelActive]}>{p.label}</Text>
              <Text style={[styles.presetDims, sizePreset === i && styles.presetDimsActive]}>{p.width}×{p.height}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>自定义尺寸</Text>
        <View style={styles.dimsRow}>
          <View style={styles.dimWrap}>
            <Text style={styles.dimLabel}>宽</Text>
            <TextInput style={styles.dimInput} value={customWidth} onChangeText={setCustomWidth} keyboardType="numeric" />
          </View>
          <Text style={styles.dimX}>×</Text>
          <View style={styles.dimWrap}>
            <Text style={styles.dimLabel}>高</Text>
            <TextInput style={styles.dimInput} value={customHeight} onChangeText={setCustomHeight} keyboardType="numeric" />
          </View>
        </View>
        {hasError && (
          <Text style={styles.errorHint}>
            {!stepValid ? '宽高须为16的倍数。' : ''}
            {!ratioValid ? '宽高比不能超过3:1。' : ''}
            {!pixelsValid ? '总像素须在655,360~8,294,400之间。' : ''}
          </Text>
        )}
        <Text style={styles.priceHint}>宽高范围: 480~3840，步进16，宽高比≤3:1</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>质量</Text>
        <View style={styles.selectorRow}>
          {(modelQualities || []).map((q) => (
            <TouchableOpacity key={q} style={[styles.selectorButton, quality === q && styles.selectorButtonActive]} onPress={() => setQuality(q)}>
              <Text style={[styles.selectorText, quality === q && styles.selectorTextActive]}>{QUALITY_LABELS[q] || q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

export function SizeOnlyControls({ currentResolutions, resolution, setResolution }) {
  const { styles, colors } = useStyles();
  return (
    <View style={styles.card}>
      <Text style={styles.label}>尺寸</Text>
      <View style={styles.selectorRow}>
        {currentResolutions.map((r) => (
          <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
            <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function FluxKontextControls({ currentRatios, aspectRatio, setAspectRatio }) {
  const { styles, colors } = useStyles();
  return (
    <View style={styles.card}>
      <Text style={styles.label}>宽高比</Text>
      <View style={styles.aspectRatioGrid}>
        {currentRatios.map((r) => (
          <TouchableOpacity key={r} style={[styles.ratioButton, aspectRatio === r && styles.ratioButtonActive]} onPress={() => setAspectRatio(r)}>
            <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function WanSizeControls({ currentResolutions, resolution, setResolution, customWidth, setCustomWidth, customHeight, setCustomHeight }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>尺寸</Text>
        <View style={styles.selectorRow}>
          {currentResolutions.map((r) => (
            <TouchableOpacity key={r} style={[styles.selectorButton, resolution === r && styles.selectorButtonActive]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r === 'Custom' ? '自定义' : r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {resolution === 'Custom' && (
        <View style={styles.card}>
          <Text style={styles.label}>自定义尺寸</Text>
          <View style={styles.dimsRow}>
            <View style={styles.dimWrap}>
              <Text style={styles.dimLabel}>宽</Text>
              <TextInput style={styles.dimInput} value={customWidth} onChangeText={setCustomWidth} keyboardType="numeric" />
            </View>
            <Text style={styles.dimX}>×</Text>
            <View style={styles.dimWrap}>
              <Text style={styles.dimLabel}>高</Text>
              <TextInput style={styles.dimInput} value={customHeight} onChangeText={setCustomHeight} keyboardType="numeric" />
            </View>
          </View>
          <Text style={styles.priceHint}>宽高范围: 768~4096，宽高比1:8~8:1</Text>
        </View>
      )}
    </>
  );
}

export function WidthHeightControls({ sizePreset, setSizePreset, customWidth, setCustomWidth, customHeight, setCustomHeight }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>尺寸预设</Text>
        <View style={styles.presetGrid}>
          {SIZE_PRESETS.map((p, i) => (
            <TouchableOpacity key={i} style={[styles.presetButton, sizePreset === i && styles.presetButtonActive]}
              onPress={() => { setSizePreset(i); setCustomWidth(String(p.width)); setCustomHeight(String(p.height)); }}>
              <Text style={[styles.presetLabel, sizePreset === i && styles.presetLabelActive]}>{p.label}</Text>
              <Text style={[styles.presetDims, sizePreset === i && styles.presetDimsActive]}>{p.width}×{p.height}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>自定义尺寸</Text>
        <View style={styles.dimsRow}>
          <View style={styles.dimWrap}>
            <Text style={styles.dimLabel}>宽</Text>
            <TextInput style={styles.dimInput} value={customWidth} onChangeText={setCustomWidth} keyboardType="numeric" />
          </View>
          <Text style={styles.dimX}>×</Text>
          <View style={styles.dimWrap}>
            <Text style={styles.dimLabel}>高</Text>
            <TextInput style={styles.dimInput} value={customHeight} onChangeText={setCustomHeight} keyboardType="numeric" />
          </View>
        </View>
      </View>
    </>
  );
}

const createStyles = (colors) => ({
  card: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  selectorRow: { flexDirection: 'row', gap: Spacing.sm },
  selectorButton: { flex: 1, paddingVertical: 10, borderRadius: Radius.sm, backgroundColor: colors.bg, alignItems: 'center' },
  selectorButtonActive: { backgroundColor: colors.primary },
  selectorText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  selectorTextActive: { color: colors.textInverse, fontWeight: '600' },
  priceHint: { fontSize: 12, color: colors.textTertiary, marginTop: Spacing.sm },
  errorHint: { fontSize: 12, color: '#FF3B30', marginTop: Spacing.sm },
  aspectRatioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ratioButton: { width: '22%', paddingVertical: 9, borderRadius: Radius.sm, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  ratioButtonActive: { backgroundColor: colors.primary },
  ratioText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  ratioTextActive: { color: colors.textInverse, fontWeight: '600' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  presetButton: { width: '30%', paddingVertical: 10, borderRadius: Radius.sm, backgroundColor: colors.bg, alignItems: 'center' },
  presetButtonActive: { backgroundColor: colors.primary },
  presetLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  presetLabelActive: { color: colors.textInverse, fontWeight: '600' },
  presetDims: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  presetDimsActive: { color: colors.primaryBg },
  dimsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dimWrap: { flex: 1, position: 'relative' },
  dimLabel: { position: 'absolute', left: 8, top: 0, bottom: 0, textAlignVertical: 'center', fontSize: 13, color: colors.textTertiary, fontWeight: '500', zIndex: 1, lineHeight: 40 },
  dimInput: { fontSize: 15, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, paddingLeft: 32, paddingRight: 10, paddingVertical: 10, textAlign: 'right', backgroundColor: colors.bg },
  dimX: { fontSize: 18, color: colors.textTertiary, fontWeight: '400', lineHeight: 40 },
});
