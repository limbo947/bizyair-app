import React from 'react';
import { Pressable, Text, View, TextInput, Switch } from 'react-native';
import { QUALITY_LABELS, SIZE_PRESETS } from '../constants/models';
import { Radius, Spacing, Typography } from '../constants/theme';
import { createSharedStyles } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { ParamLabel } from './ParamLabel';

function useStyles() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  return { styles, colors };
}

export function ResolutionRatioControls({ currentResolutions, currentRatios, resolution, aspectRatio, setResolution, setAspectRatio, seed, setSeed, webSearch, setWebSearch, temperature, setTemperature, topP, setTopP, maxTokens, setMaxTokens, supportsSeed, supportsWebSearch, supportsTemperature, supportsTopP, supportsMaxTokens, resolutionRequired }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="分辨率" required={resolutionRequired !== false} />
        <View style={styles.selectorRow}>
          {currentResolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.selectorButton, resolution === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {currentRatios.length > 0 && (
        <View style={styles.card}>
          <ParamLabel label="宽高比" required={false} />
          <View style={styles.aspectRatioGrid}>
            {currentRatios.map((r) => (
              <Pressable key={r} style={({ pressed }) => [styles.ratioButton, aspectRatio === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
                <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {supportsWebSearch && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setWebSearch(!webSearch)}>
            <ParamLabel label="联网搜索" required={false} style={{ marginBottom: 0 }} />
            <Switch value={webSearch} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsTemperature && (
        <View style={styles.card}>
          <ParamLabel label="温度" required={false} />
          <TextInput style={styles.dimInputFull} value={String(temperature)} onChangeText={(text) => setTemperature(parseFloat(text) || 0)} keyboardType="decimal-pad" placeholder="0 ~ 2，默认 0.95" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
      {supportsTopP && (
        <View style={styles.card}>
          <ParamLabel label="Top-P 采样" required={false} />
          <TextInput style={styles.dimInputFull} value={String(topP)} onChangeText={(text) => setTopP(parseFloat(text) || 0)} keyboardType="decimal-pad" placeholder="0 ~ 1，默认 0.95" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
      {supportsMaxTokens && (
        <View style={styles.card}>
          <ParamLabel label="最大输出 Token" required={false} />
          <TextInput style={styles.dimInputFull} value={String(maxTokens)} onChangeText={(text) => setMaxTokens(parseInt(text) || 1)} keyboardType="numeric" placeholder="1 ~ 32768，默认 1" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
      {supportsSeed && (
        <View style={styles.card}>
          <ParamLabel label="种子" required={false} />
          <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="0 ~ 2147483647，-1 为随机" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
    </>
  );
}

export function WidthHeightQualityControls({ sizePreset, setSizePreset, customWidth, setCustomWidth, customHeight, setCustomHeight, quality, setQuality, modelQualities }) {
  const { styles } = useStyles();
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
        <ParamLabel label="尺寸预设" required={false} />
        <View style={styles.presetGrid}>
          {SIZE_PRESETS.map((p, i) => (
            <Pressable key={i} style={({ pressed }) => [styles.presetButton, sizePreset === i && styles.presetButtonActive, pressed && styles.pressedStyle]} onPress={() => { setSizePreset(i); setCustomWidth(String(p.width)); setCustomHeight(String(p.height)); }}>
              <Text style={[styles.presetLabel, sizePreset === i && styles.presetLabelActive]}>{p.label}</Text>
              <Text style={[styles.presetDims, sizePreset === i && styles.presetDimsActive]}>{p.width}×{p.height}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="图片尺寸" required />
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
        <ParamLabel label="质量" required />
        <View style={styles.selectorRow}>
          {(modelQualities || []).map((q) => (
            <Pressable key={q} style={({ pressed }) => [styles.selectorButton, quality === q && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setQuality(q)}>
              <Text style={[styles.selectorText, quality === q && styles.selectorTextActive]}>{QUALITY_LABELS[q] || q}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
}

export function SizeOnlyControls({ currentResolutions, resolution, setResolution }) {
  const { styles } = useStyles();
  return (
    <View style={styles.card}>
      <ParamLabel label="尺寸" required={false} />
      <View style={styles.selectorRow}>
        {currentResolutions.map((r) => (
          <Pressable key={r} style={({ pressed }) => [styles.selectorButton, resolution === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
            <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function FluxKontextControls({ currentRatios, aspectRatio, setAspectRatio }) {
  const { styles } = useStyles();
  return (
    <View style={styles.card}>
      <ParamLabel label="宽高比" required={false} />
      <View style={styles.aspectRatioGrid}>
        {currentRatios.map((r) => (
          <Pressable key={r} style={({ pressed }) => [styles.ratioButton, aspectRatio === r && styles.ratioButtonActive, pressed && styles.pressedStyle]} onPress={() => setAspectRatio(r)}>
            <Text style={[styles.ratioText, aspectRatio === r && styles.ratioTextActive]}>{r}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function WanSizeControls({ currentResolutions, resolution, setResolution, customWidth, setCustomWidth, customHeight, setCustomHeight, seed, setSeed, watermark, setWatermark, enableSequential, setEnableSequential, thinkingMode, setThinkingMode, colorPalette, setColorPalette, supportsSeed, supportsWatermark, supportsEnableSequential, supportsThinkingMode, supportsColorPalette, supportsBboxList, bboxList, setBboxList, mode }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="尺寸" required />
        <View style={styles.selectorRow}>
          {currentResolutions.map((r) => (
            <Pressable key={r} style={({ pressed }) => [styles.selectorButton, resolution === r && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setResolution(r)}>
              <Text style={[styles.selectorText, resolution === r && styles.selectorTextActive]}>{r === 'Custom' ? '自定义' : r}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {resolution === 'Custom' && (
        <View style={styles.card}>
          <ParamLabel label="自定义尺寸" required />
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
          <Text style={styles.priceHint}>{mode === 'image-to-image' ? '宽高范围: 768~2048，总像素上限 2048×2048' : '宽高范围: 768~4096，宽高比1:8~8:1'}</Text>
        </View>
      )}
      {supportsEnableSequential && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setEnableSequential(!enableSequential)}>
            <ParamLabel label="组图模式" required={false} style={{ marginBottom: 0 }} />
            <Switch value={enableSequential} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsThinkingMode && mode !== 'image-to-image' && !enableSequential && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setThinkingMode(!thinkingMode)}>
            <ParamLabel label="增强推理" required={false} style={{ marginBottom: 0 }} />
            <Switch value={thinkingMode} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsWatermark && (
        <View style={styles.card}>
          <Pressable style={styles.switchRow} onPress={() => setWatermark(!watermark)}>
            <ParamLabel label="AI 水印" required={false} style={{ marginBottom: 0 }} />
            <Switch value={watermark} trackColor={{ false: colors.disabled, true: colors.primary }} pointerEvents="none" />
          </Pressable>
        </View>
      )}
      {supportsColorPalette && !enableSequential && (
        <View style={styles.card}>
          <ParamLabel label="调色板" required={false} />
          <TextInput style={styles.dimInputFull} value={colorPalette || ''} onChangeText={setColorPalette} placeholder="输入调色板 JSON 或留空" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
      {supportsBboxList && mode === 'image-to-image' && (
        <View style={styles.card}>
          <ParamLabel label="编辑区域" required={false} />
          <TextInput style={styles.dimInputFull} value={bboxList || ''} onChangeText={setBboxList} placeholder="输入 bbox JSON 数组或留空" placeholderTextColor={colors.textTertiary} multiline />
        </View>
      )}
      {supportsSeed && mode !== 'image-to-image' && (
        <View style={styles.card}>
          <ParamLabel label="种子" required={false} />
          <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9-]/g, ''))} keyboardType="numeric" placeholder="-1 为随机" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
    </>
  );
}

export function QwenImageControls({ customWidth, setCustomWidth, customHeight, setCustomHeight, steps, setSteps, guidanceScale, setGuidanceScale, negativePrompt, setNegativePrompt, seed, setSeed }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="图片尺寸" required={false} />
        <View style={styles.dimsRow}>
          <View style={styles.dimWrap}>
            <Text style={styles.dimLabel}>宽</Text>
            <TextInput style={styles.dimInput} value={customWidth} onChangeText={setCustomWidth} keyboardType="numeric" placeholder="1024" placeholderTextColor={colors.textTertiary} />
          </View>
          <Text style={styles.dimX}>×</Text>
          <View style={styles.dimWrap}>
            <Text style={styles.dimLabel}>高</Text>
            <TextInput style={styles.dimInput} value={customHeight} onChangeText={setCustomHeight} keyboardType="numeric" placeholder="1024" placeholderTextColor={colors.textTertiary} />
          </View>
        </View>
        <Text style={styles.priceHint}>宽高范围: 256~2048</Text>
      </View>
      <View style={styles.card}>
        <ParamLabel label="步数" required={false} />
        <TextInput style={styles.dimInputFull} value={steps !== undefined ? String(steps) : ''} onChangeText={(text) => setSteps(text ? parseInt(text) : undefined)} keyboardType="numeric" placeholder="6 ~ 50" placeholderTextColor={colors.textTertiary} />
      </View>
      <View style={styles.card}>
        <ParamLabel label="引导系数" required={false} />
        <TextInput style={styles.dimInputFull} value={guidanceScale !== undefined ? String(guidanceScale) : ''} onChangeText={(text) => setGuidanceScale(text ? parseFloat(text) : undefined)} keyboardType="decimal-pad" placeholder="0.1 ~ 10" placeholderTextColor={colors.textTertiary} />
      </View>
      <View style={styles.card}>
        <ParamLabel label="反向提示词" required={false} />
        <TextInput style={[styles.dimInputFull, { minHeight: 60 }]} value={negativePrompt || ''} onChangeText={setNegativePrompt} placeholder="描述不想要的元素" placeholderTextColor={colors.textTertiary} multiline numberOfLines={2} />
      </View>
      <View style={styles.card}>
        <ParamLabel label="种子" required={false} />
        <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="留空随机" placeholderTextColor={colors.textTertiary} />
      </View>
    </>
  );
}

export function WidthHeightControls({ sizePreset, setSizePreset, customWidth, setCustomWidth, customHeight, setCustomHeight, negativePrompt, setNegativePrompt, seed, setSeed, batchSize, setBatchSize, supportsNegativePrompt, supportsSeed, supportsBatchSize }) {
  const { styles, colors } = useStyles();
  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="尺寸预设" required={false} />
        <View style={styles.presetGrid}>
          {SIZE_PRESETS.map((p, i) => (
            <Pressable key={i} style={({ pressed }) => [styles.presetButton, sizePreset === i && styles.presetButtonActive, pressed && styles.pressedStyle]} onPress={() => { setSizePreset(i); setCustomWidth(String(p.width)); setCustomHeight(String(p.height)); }}>
              <Text style={[styles.presetLabel, sizePreset === i && styles.presetLabelActive]}>{p.label}</Text>
              <Text style={[styles.presetDims, sizePreset === i && styles.presetDimsActive]}>{p.width}×{p.height}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="自定义尺寸" required={false} />
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
      {supportsNegativePrompt && (
        <View style={styles.card}>
          <ParamLabel label="反向提示词" required={false} />
          <TextInput style={styles.dimInputFull} value={negativePrompt || ''} onChangeText={setNegativePrompt} placeholder="描述不想要的元素" placeholderTextColor={colors.textTertiary} multiline />
        </View>
      )}
      {supportsBatchSize && (
        <View style={styles.card}>
          <ParamLabel label="生成数量" required />
          <View style={styles.selectorRow}>
            {[1, 2, 3, 4].map((n) => (
              <Pressable key={n} style={({ pressed }) => [styles.selectorButton, batchSize === n && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setBatchSize(n)}>
                <Text style={[styles.selectorText, batchSize === n && styles.selectorTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {supportsSeed && (
        <View style={styles.card}>
          <ParamLabel label="种子" required={false} />
          <TextInput style={styles.dimInputFull} value={seed || ''} onChangeText={(text) => setSeed(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="1~2147483647，留空随机" placeholderTextColor={colors.textTertiary} />
        </View>
      )}
    </>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  priceHint: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, marginTop: Spacing.sm },
  errorHint: { fontSize: Typography.fontSize.caption1, color: colors.error, marginTop: Spacing.sm },
  aspectRatioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ratioButton: { width: '22%', paddingVertical: Spacing.sm + 1, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  ratioButtonActive: { backgroundColor: colors.primary },
  ratioText: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  ratioTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  presetButton: { width: '30%', paddingVertical: Spacing.sm + 2, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  presetButtonActive: { backgroundColor: colors.primary },
  presetLabel: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  presetLabelActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  presetDims: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary, marginTop: Spacing.xs },
  presetDimsActive: { color: colors.primaryBg },
  dimsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dimWrap: { flex: 1, position: 'relative' },
  dimLabel: { position: 'absolute', left: Spacing.sm, top: 0, bottom: 0, textAlignVertical: 'center', fontSize: Typography.fontSize.footnote, color: colors.textTertiary, fontWeight: Typography.fontWeight.medium, zIndex: 1, lineHeight: 40 },
  dimInput: { fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingLeft: Spacing.xxxl, paddingRight: Spacing.sm + 2, paddingVertical: Spacing.sm + 2, textAlign: 'right', backgroundColor: colors.bg },
  dimX: { fontSize: Typography.fontSize.title2, color: colors.textTertiary, fontWeight: Typography.fontWeight.regular, lineHeight: 40 },
});
