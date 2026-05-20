import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { QUALITY_LABELS, SIZE_PRESETS } from '../constants/models';

export function ResolutionRatioControls({ currentResolutions, currentRatios, resolution, aspectRatio, setResolution, setAspectRatio }) {
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

export function WanSizeControls({ currentResolutions, resolution, setResolution, customWidth, setCustomWidth, customHeight, setCustomHeight }) {
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

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  selectorRow: { flexDirection: 'row', gap: 8 },
  selectorButton: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  selectorButtonActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  selectorText: { fontSize: 14, color: '#666' },
  selectorTextActive: { color: '#fff', fontWeight: 'bold' },
  priceHint: { fontSize: 12, color: '#999', marginTop: 6 },
  aspectRatioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  ratioButton: { width: '22%', paddingVertical: 9, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  ratioButtonActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  ratioText: { fontSize: 13, color: '#666' },
  ratioTextActive: { color: '#fff', fontWeight: 'bold' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetButton: { width: '30%', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  presetButtonActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  presetLabel: { fontSize: 14, color: '#666', fontWeight: '500' },
  presetLabelActive: { color: '#fff', fontWeight: 'bold' },
  presetDims: { fontSize: 11, color: '#999', marginTop: 2 },
  presetDimsActive: { color: '#E8F5E9' },
  dimsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dimWrap: { flex: 1 },
  dimLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  dimInput: { fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 10, textAlign: 'center' },
  dimX: { fontSize: 20, color: '#999', fontWeight: 'bold' },
});
