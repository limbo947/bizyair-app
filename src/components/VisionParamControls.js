import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';
import { ResizableTextInput } from './ResizableTextInput';

const STORAGE_KEY = 'vision_custom_presets';

const VISION_PROMPT_PRESETS = [
  {
    label: '描述图片',
    prompt: `你是一个图片描述专家，请详细描述图片内容。

## 描述维度
- **场景**：整体环境、地点、时间、氛围
- **人物**：外貌、动作、表情、穿着、互动关系
- **物体**：位置、大小、颜色、材质、状态
- **构图**：视角、景深、光线、色调

## 输出要求
1. 先用一句话概括图片核心内容
2. 按空间顺序（从前景到背景）展开描述
3. 标注不确定的细节，如"似乎是……"`,
  },
  {
    label: '图文问答',
    prompt: `你是一个图片理解助手，根据图片内容准确回答用户的问题。

## 回答原则
- **基于事实**：回答必须来源于图片中的实际信息
- **诚实标注**：图片中无法确认的信息，明确说明"从图片中无法判断"
- **细节补充**：在回答问题时，补充相关的图片细节作为佐证

## 格式要求
1. 先给出直接答案
2. 再引用图片中的具体细节作为依据
3. 如有相关但未问到的信息，可主动补充`,
  },
  {
    label: 'OCR识别',
    prompt: `你是一个文字识别专家，请识别图片中的所有文字内容。

## 识别规则
- **排版还原**：按原始排版顺序输出，保持段落结构
- **表格保持**：如遇表格，使用 Markdown 表格格式
- **置信度标注**：模糊或不确定的文字用 [?] 标注

## 输出格式
1. 先输出完整识别文本
2. 再标注识别不确定的部分
3. 如有公式，使用 LaTeX 格式`,
  },
  {
    label: '图表分析',
    prompt: `你是一个数据分析专家，请分析图片中的图表数据。

## 分析框架
- **图表类型**：柱状图、折线图、饼图、散点图等
- **标题与坐标**：图表标题、X/Y 轴含义与单位
- **数据趋势**：上升、下降、波动、拐点
- **关键数值**：峰值、谷值、均值、占比

## 输出要求
1. 用文字总结图表的核心发现
2. 列出 3-5 个关键数据点
3. 给出数据背后的可能解读`,
  },
  {
    label: '代码解读',
    prompt: `你是一个代码识别与解读专家，请识别图片中的代码并解释。

## 识别规则
- **完整还原**：识别代码时保持缩进和结构
- **语言标注**：标注代码的编程语言
- **语法高亮**：使用 Markdown 代码块格式

## 解读要求
1. 先输出识别的完整代码
2. 解释代码的整体功能和目的
3. 逐段说明关键逻辑
4. 如有错误或可优化之处，指出并给出建议`,
  },
  {
    label: '创意描述',
    prompt: `你是一位诗人与散文家，请用富有文学性的语言描述这张图片。

## 写作风格
- **意境营造**：注重画面感与情感共鸣
- **修辞运用**：善用比喻、拟人、通感等手法
- **节奏把控**：长短句交替，形成韵律感

## 写作方式
1. 先感受图片的整体氛围与情绪
2. 从一个引人入胜的意象切入
3. 由近及远、由实到虚展开描写
4. 以余韵悠长的结尾收束`,
  },
];

function loadCustomPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCustomPresets(presets) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(presets)); } catch {}
}

export function VisionGControls({
  systemPrompt, setSystemPrompt,
  temperature, setTemperature, maxTokens, setMaxTokens,
  detail, setDetail, enableThinking, setEnableThinking,
}) {
  const [customPresets, setCustomPresets] = useState(loadCustomPresets);
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetPrompt, setNewPresetPrompt] = useState('');

  useEffect(() => { saveCustomPresets(customPresets); }, [customPresets]);

  const allPresets = [...VISION_PROMPT_PRESETS, ...customPresets];

  const handleAddPreset = () => {
    if (!newPresetName.trim() || !newPresetPrompt.trim()) return;
    setCustomPresets([...customPresets, { label: newPresetName.trim(), prompt: newPresetPrompt.trim(), custom: true }]);
    setNewPresetName('');
    setNewPresetPrompt('');
    setShowAddPreset(false);
  };

  const handleDeletePreset = (index) => {
    Alert.alert('删除预设', `确定删除"${customPresets[index].label}"？`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => setCustomPresets(customPresets.filter((_, i) => i !== index)) },
    ]);
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>系统提示词</Text>
        <View style={styles.presetRow}>
          {allPresets.map((p, i) => (
            <TouchableOpacity
              key={p.label + i}
              style={[styles.presetChip, systemPrompt === p.prompt && styles.presetChipActive]}
              onPress={() => setSystemPrompt(systemPrompt === p.prompt ? '' : p.prompt)}
              onLongPress={() => p.custom && handleDeletePreset(i - VISION_PROMPT_PRESETS.length)}
            >
              <Text style={[styles.presetChipText, systemPrompt === p.prompt && styles.presetChipTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.presetChipAdd}
            onPress={() => setShowAddPreset(!showAddPreset)}
          >
            <Text style={styles.presetChipAddText}>+ 新增</Text>
          </TouchableOpacity>
        </View>
        {showAddPreset && (
          <View style={styles.addPresetBox}>
            <TextInput
              style={styles.addPresetName}
              value={newPresetName}
              onChangeText={setNewPresetName}
              placeholder="预设名称"
              placeholderTextColor={Colors.textPlaceholder}
              maxLength={10}
            />
            <ResizableTextInput
              value={newPresetPrompt}
              onChangeText={setNewPresetPrompt}
              placeholder="输入预设内容..."
              minHeight={60}
            />
            <View style={styles.addPresetActions}>
              <TouchableOpacity onPress={() => setShowAddPreset(false)}>
                <Text style={styles.addPresetCancel}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addPresetConfirm} onPress={handleAddPreset}>
                <Text style={styles.addPresetConfirmText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <ResizableTextInput
          value={systemPrompt}
          onChangeText={setSystemPrompt}
          placeholder="设定图片理解方式，或选择上方预设..."
          maxLength={2500}
          hideClear
        />
        <View style={styles.hintRow}>
          <Text style={styles.hint}>长按自定义预设可删除</Text>
          {systemPrompt ? (
            <TouchableOpacity onPress={() => setSystemPrompt('')} activeOpacity={0.6}>
              <Text style={styles.clearText}>清空</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Temperature (0 ~ 2)</Text>
        <TextInput
          style={styles.inputSingle}
          value={String(temperature)}
          onChangeText={(t) => {
            const val = parseFloat(t);
            if (!isNaN(val) && val >= 0 && val <= 2) setTemperature(Math.round(val * 100) / 100);
          }}
          keyboardType="decimal-pad"
          placeholder="1.0"
          placeholderTextColor={Colors.textPlaceholder}
          selectTextOnFocus
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>细节程度</Text>
        <View style={styles.selectorRow}>
          {['low', 'medium', 'high', 'auto'].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.selectorButton, detail === d && styles.selectorButtonActive]}
              onPress={() => setDetail(d)}
            >
              <Text style={[styles.selectorText, detail === d && styles.selectorTextActive]}>
                {{ low: '低', medium: '中', high: '高', auto: '自动' }[d]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>思考模式</Text>
          <Switch
            value={enableThinking}
            onValueChange={setEnableThinking}
            trackColor={{ false: Colors.disabled, true: Colors.primary }}
          />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>最大 Tokens</Text>
        <TextInput
          style={styles.inputSingle}
          value={String(maxTokens)}
          onChangeText={(t) => setMaxTokens(parseInt(t) || 0)}
          keyboardType="numeric"
          placeholder="4096"
          placeholderTextColor={Colors.textPlaceholder}
        />
      </View>
    </>
  );
}

export function JoyCaptionControls({
  captionType, setCaptionType,
  captionLength, setCaptionLength,
  temperature, setTemperature,
  maxTokens, setMaxTokens,
  doSample, setDoSample,
  extraOptions, setExtraOptions,
  nameInput, setNameInput,
  customPrompt, setCustomPrompt,
  captionTypes, captionLengths,
}) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>描述类型</Text>
        <View style={styles.selectorRow}>
          {captionTypes.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.selectorButtonSmall, captionType === t && styles.selectorButtonActive]}
              onPress={() => setCaptionType(t)}
            >
              <Text style={[styles.selectorText, captionType === t && styles.selectorTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>描述长度</Text>
        <View style={styles.selectorRow}>
          {captionLengths.slice(0, 8).map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.selectorButtonSmall, captionLength === l && styles.selectorButtonActive]}
              onPress={() => setCaptionLength(l)}
            >
              <Text style={[styles.selectorText, captionLength === l && styles.selectorTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Temperature (0 ~ 2)</Text>
        <TextInput
          style={styles.inputSingle}
          value={String(temperature)}
          onChangeText={(t) => {
            const val = parseFloat(t);
            if (!isNaN(val) && val >= 0 && val <= 2) setTemperature(Math.round(val * 100) / 100);
          }}
          keyboardType="decimal-pad"
          placeholder="1.0"
          placeholderTextColor={Colors.textPlaceholder}
          selectTextOnFocus
        />
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>随机采样</Text>
          <Switch
            value={doSample}
            onValueChange={setDoSample}
            trackColor={{ false: Colors.disabled, true: Colors.primary }}
          />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>最大 Tokens</Text>
        <TextInput
          style={styles.inputSingle}
          value={String(maxTokens)}
          onChangeText={(t) => setMaxTokens(parseInt(t) || 0)}
          keyboardType="numeric"
          placeholder="4096"
          placeholderTextColor={Colors.textPlaceholder}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  presetChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.md, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border },
  presetChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  presetChipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  presetChipTextActive: { color: Colors.textInverse, fontWeight: '600' },
  presetChipAdd: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.md, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.primary, borderStyle: 'dashed' },
  presetChipAddText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  addPresetBox: { backgroundColor: Colors.bg, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.md, gap: Spacing.sm },
  addPresetName: { fontSize: 14, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 8, backgroundColor: Colors.card },
  addPresetActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md },
  addPresetCancel: { fontSize: 14, color: Colors.textTertiary, paddingVertical: 6, paddingHorizontal: 12 },
  addPresetConfirm: { backgroundColor: Colors.primary, paddingVertical: 6, paddingHorizontal: 16, borderRadius: Radius.sm },
  addPresetConfirmText: { color: Colors.textInverse, fontSize: 14, fontWeight: '600' },
  hint: { fontSize: 11, color: Colors.textTertiary, marginTop: 4 },
  hintRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clearText: { fontSize: 12, color: '#4A9EF5', fontWeight: '500' },
  promptInput: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20, minHeight: 80, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: Colors.bg },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputSingle: { fontSize: 15, color: Colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 10, backgroundColor: Colors.bg },
  selectorRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  selectorButton: { flex: 1, minWidth: 60, paddingVertical: 10, borderRadius: Radius.sm, backgroundColor: Colors.bg, alignItems: 'center' },
  selectorButtonSmall: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: Radius.sm, backgroundColor: Colors.bg, alignItems: 'center' },
  selectorButtonActive: { backgroundColor: Colors.primary },
  selectorText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  selectorTextActive: { color: Colors.textInverse, fontWeight: '600' },
});
