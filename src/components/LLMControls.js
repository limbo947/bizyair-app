import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Switch, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { ResizableTextInput } from './ResizableTextInput';

const STORAGE_KEY = 'llm_custom_presets';

const SYSTEM_PROMPT_PRESETS = [
  {
    label: '通用助手',
    prompt: `你是一个智能助手，能够准确、清晰地回答各类问题。

## 核心能力
- **结构化回答**：使用标题、列表、表格等方式组织信息，层次分明
- **示例驱动**：在解释抽象概念时，提供具体可感的示例
- **追问澄清**：当问题模糊时，主动确认用户意图再作答

## 回答原则
1. 先给结论，再展开论述
2. 区分事实与观点，标注不确定性
3. 必要时提供多种方案并比较优劣`,
  },
  {
    label: '写作助手',
    prompt: `你是一位专业的写作助手，擅长各类文体创作与润色。

## 擅长领域
- **文体创作**：散文、小说、诗歌、评论、公文、商业文案
- **文本润色**：优化遣词造句，提升文采与逻辑连贯性
- **风格适配**：根据场景调整语气——正式、活泼、学术、口语化

## 工作方式
1. 明确写作目的与目标读者
2. 提供初稿后标注可优化之处
3. 尊重原文风格，不擅自改变作者意图`,
  },
  {
    label: '代码专家',
    prompt: `你是一位资深编程专家，精通多种编程语言与框架。

## 技术栈
- **语言**：Python、JavaScript/TypeScript、Java、Go、Rust、C++ 等
- **框架**：React、Vue、Django、Spring、Express 等
- **领域**：Web 开发、数据处理、系统编程、算法设计

## 回答规范
1. 给出**完整可运行**的代码示例，包含必要 import
2. 代码后附关键逻辑的简要解释
3. 标注潜在坑点（如边界条件、性能陷阱）
4. 如有多种实现，比较各自适用场景`,
  },
  {
    label: '翻译专家',
    prompt: `你是一位专业翻译，精通中英日韩等多种语言。

## 翻译原则
- **信**：准确传达原文含义，不遗漏不添加
- **达**：译文通顺自然，符合目标语言表达习惯
- **雅**：兼顾文化语境，必要时提供译注

## 工作方式
1. 先提供直译版本，再提供优化译本
2. 对一词多义或文化特有表达，附注释说明
3. 长文本分段翻译，保持术语一致性
4. 必要时提供多种译法供选择`,
  },
  {
    label: '分析顾问',
    prompt: `你是一位深度分析顾问，擅长从多维度拆解复杂问题。

## 分析框架
- **结构化拆解**：将大问题分解为可操作的子问题
- **多视角审视**：呈现正反观点与边界条件
- **证据导向**：基于数据与逻辑推理，标注假设前提

## 输出格式
1. **问题定义**：明确核心问题与约束条件
2. **分析过程**：逐层递进，每步给出推理依据
3. **结论判断**：给出有依据的判断，标注置信度
4. **风险提示**：列出可能的盲区与不确定性`,
  },
  {
    label: '创意策划',
    prompt: `你是一位创意策划师，善于发散思维与跨界联想。

## 思维方式
- **逆向思考**：从反面或极端情况切入，发现新视角
- **类比迁移**：将其他领域的成功模式迁移到当前问题
- **约束激发**：在限制条件下激发更创新的方案

## 输出方式
1. 先给出 3-5 个差异化创意方向
2. 每个方向包含核心概念、执行路径、预期效果
3. 评估可行性（高/中/低）与资源需求
4. 推荐最优方案并说明理由`,
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


export function LLMChatControls({
  systemPrompt, setSystemPrompt,
  temperature, setTemperature,
  maxTokens, setMaxTokens,
  enableThinking, setEnableThinking,
  enableSearch, setEnableSearch,
  enableThinkingRequired,
  enableSearchRequired,
  maxTokensMax,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  const [customPresets, setCustomPresets] = useState(loadCustomPresets);
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetPrompt, setNewPresetPrompt] = useState('');

  useEffect(() => { saveCustomPresets(customPresets); }, [customPresets]);

  const allPresets = [...SYSTEM_PROMPT_PRESETS, ...customPresets];

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
              onLongPress={() => p.custom && handleDeletePreset(i - SYSTEM_PROMPT_PRESETS.length)}
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
              placeholderTextColor={colors.textPlaceholder}
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
          placeholder="设定AI的角色和行为，或选择上方预设..."
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
          placeholderTextColor={colors.textPlaceholder}
          selectTextOnFocus
        />
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
          placeholder="4096"
          placeholderTextColor={colors.textPlaceholder}
        />
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>思考模式</Text>
          <Switch
            value={enableThinkingRequired ? true : enableThinking}
            onValueChange={enableThinkingRequired ? undefined : setEnableThinking}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            disabled={enableThinkingRequired}
          />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>联网搜索</Text>
          <Switch
            value={enableSearchRequired ? true : enableSearch}
            onValueChange={enableSearchRequired ? undefined : setEnableSearch}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            disabled={enableSearchRequired}
          />
        </View>
      </View>
    </>
  );
}

const createStyles = (colors) => ({
  card: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  presetChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.md, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  presetChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  presetChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  presetChipTextActive: { color: colors.textInverse, fontWeight: '600' },
  presetChipAdd: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.md, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed' },
  presetChipAddText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  addPresetBox: { backgroundColor: colors.bg, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.md, gap: Spacing.sm },
  addPresetName: { fontSize: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 8, backgroundColor: colors.card },
  addPresetActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md },
  addPresetCancel: { fontSize: 14, color: colors.textTertiary, paddingVertical: 6, paddingHorizontal: 12 },
  addPresetConfirm: { backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 16, borderRadius: Radius.sm },
  addPresetConfirmText: { color: colors.textInverse, fontSize: 14, fontWeight: '600' },
  hint: { fontSize: 11, color: colors.textTertiary, marginTop: 4 },
  hintRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clearText: { fontSize: 12, color: '#4A9EF5', fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputSingle: { fontSize: 15, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 10, backgroundColor: colors.bg },
});
