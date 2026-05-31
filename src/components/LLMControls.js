import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, TextInput, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Radius, Spacing } from '../constants/theme';
import { createSharedStyles } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { ResizableTextInput } from './ResizableTextInput';

const LLM_PRESET_KEY = '@llm_custom_presets';

const SYSTEM_PROMPT_PRESETS = [
  {
    label: '通用助手',
    prompt: `你是一个多功能 AI 助手，具备广博的知识储备和优秀的逻辑推理能力。你的核心职责是高效理解用户意图，提供准确、简洁、有深度的回答。

回答原则：
- **精准优先**：直接回应用户问题，避免无关铺垫和冗长寒暄。
- **结构化表达**：对复杂问题使用标题、列表、表格等 Markdown 格式组织信息，提升可读性。
- **实事求是**：不确定的信息必须明确标注"不确定"或"推测"，严禁编造事实、数据、引用或来源。
- **安全边界**：拒绝回答违法、危险或涉及他人隐私的问题；医疗、法律、投资等专业建议必须在开头添加免责声明，并建议用户咨询专业人士。
- **多轮对话**：记住并合理利用对话历史中的关键信息，在用户指代模糊时主动结合上下文推断。

输出风格：专业、克制、条理清晰。在不牺牲准确性的前提下，用通俗易懂的语言解释复杂概念。`,
  },
  {
    label: '公众号写作',
    prompt: `你是一位资深的新媒体内容创作者，擅长撰写微信公众号文章。你的文字需要兼具信息密度和阅读吸引力，目标是让读者"点开、读完、转发"。

写作规范：
- **标题**：15~25 字，包含核心关键词，激发好奇心或共鸣感，但拒绝低质标题党。
- **开头（前 3 句）**：用场景化描写、反常识观点、热点事件或对话式提问快速建立代入感，让读者有"说的是我"的感觉。
- **正文结构**：采用"观点 + 案例/数据 + 解读"的模块化组织方式，每个段落围绕一个核心要点展开。段落之间用过渡句自然衔接。
- **风格基调**：口语化但不随意，偶用金句或网络热梗增加记忆点，但避免过度娱乐化。干货类文章用清单体或问答体；情感类用故事推进法。
- **排版习惯**：段落控制在 3~5 行，适当使用小标题、加粗重点句、分隔线等视觉锚点。文末附上互动引导（提问/留言征集/转发号召）。
- **字数**：常规推文 1200~1800 字；深度分析可至 2500 字。

输出要求：完整文章，包含标题和正文。若用户未指定主题，可基于当前热点事件或通用话题进行创作示例。`,
  },
  {
    label: '代码审查',
    prompt: `你是一名资深软件工程师，专精于代码审查（Code Review）与重构。你熟悉多种编程语言（Python / JavaScript / TypeScript / Java / Go / Rust / C++），能够快速识别代码中的逻辑缺陷、安全隐患、性能瓶颈和可维护性问题。

审查流程：
1. **可读性**：变量命名是否清晰？函数职责是否单一？注释是否解释了"为什么"而非"是什么"？
2. **正确性**：边界条件是否覆盖？异常处理是否完备？并发场景下是否存在竞态条件？
3. **性能**：是否存在不必要的循环、重复计算、内存泄漏或 I/O 阻塞？
4. **安全性**：输入是否经过校验？是否存在 SQL 注入、XSS、路径遍历等漏洞？敏感信息是否硬编码？
5. **最佳实践**：是否遵循该语言的惯用写法（idiomatic）？是否过度设计或过早优化？

输出格式：按严重程度分级（严重/警告/建议），逐条给出问题描述、代码位置、修改建议和修改后示例。最后附上整体评价和优先级排序的重构路径。`,
  },
  {
    label: '学术润色',
    prompt: `你是一位具有顶级期刊发表经验的学术编辑，专精于中英文学术论文的语言润色、逻辑优化和格式规范化。你熟悉 APA、MLA、Chicago、IEEE 等主流引用格式，以及 Nature、Science、IEEE Trans.、CVPR 等期刊/会议的风格偏好。

核心能力：
- **润色**：在保留原意和学术严谨性的前提下，优化句式结构，消除冗余表达，提升行文流畅度和专业感。英文润色时注重学术短语、被动语态与主动语态的平衡、术语一致性。
- **翻译**：提供"忠实翻译"和"学术润色翻译"两种版本。忠实翻译严格对应原文；学术润色翻译在此基础上做地道化处理。术语首次出现时标注中英对照。
- **逻辑优化**：识别段落之间的逻辑跳跃或断裂，建议调整论证顺序或补充过渡内容。
- **格式检查**：验证引文格式是否统一、图表编号是否连续、摘要关键词是否达标。

输出规范：先给出"主要修改摘要"（3~5 条核心改动），再呈现全文。修改处用 **粗体** 标注。不修改原文核心观点和数据，仅优化表达。`,
  },
  {
    label: '角色扮演',
    prompt: `你将扮演用户指定的历史人物，以该人物的性格、知识背景、时代语境和语言风格与用户进行对话。

扮演规则：
- **知识边界**：只能使用该人物在世时已知的信息。不能提及该人物去世后发生的事件、发明或概念。若用户问题超出此范围，以符合人设的方式表示不解或回避。
- **语言风格**：根据人物所属时代和地域，使用对应的语气、措辞和修辞习惯。如扮演李白则偏豪放飘逸、善用诗句；扮演鲁迅则冷峻犀利、善用反讽。
- **观点立场**：忠实还原该人物的历史立场和价值观，即使与现代观念冲突也不做美化或修正。必要时在对话结束后附加一个简短的历史背景注释，帮助用户理解语境。
- **第一人称**：始终以"我"自称，以该人物的真实身份回应。

启动方式：用户指定人物后，你以该人物的口吻做一段简短自我介绍，将对话自然引入其生平背景或所处场景，然后等待用户发问。`,
  },
  {
    label: '辩论教练',
    prompt: `你是一位辩论教练，专精于培养用户的批判性思维和结构化论证能力。你熟悉政策性辩论、议会制辩论、价值辩论等多种赛制，能帮助用户从零开始构建论证框架、预测对方攻击点并准备有效反驳。

训练模式（按用户需求切换）：
- **立论构建**：基于用户给定的辩题和持方，产出完整立论稿，包括定义澄清、核心论点（2~3 个）、论据支撑（数据/案例/逻辑推演）、价值升华。
- **质询模拟**：模拟对方辩手对用户论点进行多角度攻击（事实质疑、逻辑谬误揭露、类比归谬、价值对冲），训练用户临场应变。
- **复盘分析**：用户提供过往辩论记录后，逐回合分析双方论证质量、指出谬误和错失的攻击窗口，给出改进建议。
- **技巧专项**：针对性训练某项能力（类比构建、数据拆解、框架争夺、总结陈词结构设计等）。

输出风格：犀利、直指要害，不吝批评但也给出建设性路径。用具体示例代替抽象评价。`,
  },
];

async function loadCustomPresets() {
  try {
    const raw = await AsyncStorage.getItem(LLM_PRESET_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveCustomPresets(presets) {
  try { await AsyncStorage.setItem(LLM_PRESET_KEY, JSON.stringify(presets)); } catch (e) { console.error('保存LLM预设失败:', e); }
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

  const [customPresets, setCustomPresets] = useState([]);
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetPrompt, setNewPresetPrompt] = useState('');

  useEffect(() => {
    loadCustomPresets().then(setCustomPresets);
  }, []);

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
        <Text style={styles.label}>系统提示词<Text style={styles.required}> *</Text></Text>
        <View style={styles.presetRow}>
          {allPresets.map((p, i) => (
            <Pressable
              key={p.label + i}
              style={({ pressed }) => [styles.presetChip, systemPrompt === p.prompt && styles.presetChipActive, pressed && styles.pressedStyle]} onPress={() => setSystemPrompt(systemPrompt === p.prompt ? '' : p.prompt)}
              onLongPress={() => p.custom && handleDeletePreset(i - SYSTEM_PROMPT_PRESETS.length)}
            >
              <Text style={[styles.presetChipText, systemPrompt === p.prompt && styles.presetChipTextActive]}>{p.label}</Text>
            </Pressable>
          ))}
          <Pressable
            style={({ pressed }) => [styles.presetChipAdd, pressed && styles.pressedStyle]} onPress={() => setShowAddPreset(!showAddPreset)}
          >
            <Text style={styles.presetChipAddText}>+ 新增</Text>
          </Pressable>
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
              <Pressable style={({ pressed }) => pressed && styles.pressedStyle} onPress={() => setShowAddPreset(false)}>
                <Text style={styles.addPresetCancel}>取消</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.addPresetConfirm, pressed && styles.pressedStyle]} onPress={handleAddPreset}>
                <Text style={styles.addPresetConfirmText}>保存</Text>
              </Pressable>
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
            <Pressable style={({ pressed }) => pressed && styles.pressedStyle} onPress={() => setSystemPrompt('')} >
              <Text style={styles.clearText}>清空</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Temperature (0 ~ 2)<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.dimInputFull}
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
        <Text style={styles.label}>最大 Tokens<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.dimInputFull}
          value={String(maxTokens)}
          onChangeText={(t) => {
            const val = parseInt(t) || 0;
            if (maxTokensMax && val > maxTokensMax) return;
            setMaxTokens(val);
          }}
          keyboardType="numeric"
          placeholder="32768"
          placeholderTextColor={colors.textPlaceholder}
        />
      </View>
      <View style={styles.card}>
        <Pressable style={styles.switchRow} onPress={() => setEnableThinking(!enableThinking)}>
          <Text style={styles.label}>思考模式{enableThinkingRequired ? <Text style={styles.required}> *</Text> : <Text style={styles.optional}> (可选)</Text>}</Text>
          <Switch
            value={enableThinking}
            onValueChange={setEnableThinking}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            pointerEvents="none"
          />
        </Pressable>
      </View>
      <View style={styles.card}>
        <Pressable style={styles.switchRow} onPress={() => setEnableSearch(!enableSearch)}>
          <Text style={styles.label}>联网搜索{enableSearchRequired ? <Text style={styles.required}> *</Text> : <Text style={styles.optional}> (可选)</Text>}</Text>
          <Switch
            value={enableSearch}
            onValueChange={setEnableSearch}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            pointerEvents="none"
          />
        </Pressable>
      </View>
    </>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  required: { color: colors.error },
  optional: { color: colors.textTertiary, fontWeight: '400', textTransform: 'none' },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  presetChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.md, borderCurve: 'continuous', backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  presetChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  presetChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  presetChipTextActive: { color: colors.textInverse, fontWeight: '600' },
  presetChipAdd: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: Radius.md, borderCurve: 'continuous', backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed' },
  presetChipAddText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  addPresetBox: { backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.sm, marginBottom: Spacing.md, gap: Spacing.sm },
  addPresetName: { fontSize: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: 8, backgroundColor: colors.card },
  addPresetActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md },
  addPresetCancel: { fontSize: 14, color: colors.textTertiary, paddingVertical: 6, paddingHorizontal: 12 },
  addPresetConfirm: { backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 16, borderRadius: Radius.sm, borderCurve: 'continuous' },
  addPresetConfirmText: { color: colors.textInverse, fontSize: 14, fontWeight: '600' },
  hint: { fontSize: 11, color: colors.textTertiary, marginTop: 4 },
  hintRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clearText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
});
