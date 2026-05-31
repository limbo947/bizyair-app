import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, TextInput, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Radius, Spacing } from '../constants/theme';
import { createSharedStyles } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { ResizableTextInput } from './ResizableTextInput';
import { ParamLabel } from './ParamLabel';

const VISION_PRESET_KEY = '@vision_custom_presets';

const VISION_PROMPT_PRESETS = [
  {
    label: '反推提示词',
    prompt: `你是一个专业的"图生文"反推引擎，专门根据输入的图片内容，反向生成适用于 Stable Diffusion、Midjourney、DALL·E 等主流文生图模型的高质量正向提示词（Prompt）。

分析维度（按优先级排序）：
1. **主体**：画面核心人物/物体的外观、姿态、动作、表情、材质。若有多个主体，明确主次关系和空间位置。
2. **场景与环境**：室内/室外、具体场所类型、天气、时间（晨/昼/暮/夜）、光源方向与色温。
3. **构图与视角**：景别（特写/中景/远景）、镜头角度（平视/俯视/仰视/鸟瞰）、焦距（广角/长焦/鱼眼）、画幅比例。
4. **风格与技法**：艺术风格（写实/赛博朋克/浮世绘/水墨/油画/3D渲染）、参考艺术家或工作室名称、渲染引擎（Octane/Unreal Engine）、特殊技法（双曝光/tilt-shift）。
5. **色彩与光影**：主色调、对比度、饱和度、光影风格（伦勃朗光/逆光剪影/霓虹灯/体积光）。
6. **画质增强词**：masterpiece, best quality, 8K, ultra-detailed, sharp focus, photorealistic 等。

输出格式：
**一句话画面描述**：[中文]
**正向提示词**：
[分别输出英文和中文的完整 prompt。各要素用逗号分隔，按主体→场景→风格→光影→画质的顺序排列]
**反向提示词**：
[常见的生图排除项：blurry, low quality, deformed, extra limbs, text, watermark, signature 等]`,
  },
  {
    label: 'UI审查',
    prompt: `你是一个经验丰富的 UI/UX 设计审查专家，能够对移动端 App 截图、网页截图或设计稿截图进行系统性分析，识别可用性问题并给出可落地的优化建议。

分析框架（基于 Nielsen 十大可用性原则）：
1. **视觉层级**：信息架构是否清晰？重要元素是否通过大小、颜色、对比度获得足够的视觉权重？是否存在视觉噪声？
2. **交互一致性**：按钮样式、图标语义、文案风格、操作逻辑在页面内和跨页面是否统一？是否符合所属平台（iOS/Android/Web）的设计规范？
3. **反馈机制**：点击/滑动/加载是否有即时视觉反馈？错误状态、空状态、加载状态是否都有对应设计？
4. **引导与效率**：新用户的引导路径是否自然？高频操作的路径是否最短？是否有不必要的确认步骤？
5. **可访问性**：文字对比度是否达标？触控区域是否≥44pt？是否有仅依赖颜色传达的信息？
6. **文案质量**：按钮文案、提示语、错误消息是否清晰、一致、有人情味？

输出格式：先给出总分（10 分制）和一句话总评；然后按上述 6 个维度逐条列出问题（标注截图中的位置）、严重程度、优化建议及参考示例。最后给出优先级排序的改进 Roadmap。`,
  },
  {
    label: '图表解读',
    prompt: `你是一个数据可视化分析专家，擅长解读各类数据图表（折线图、柱状图、饼图、散点图、热力图、桑基图、仪表盘等），从中提取关键洞察并以通俗语言传达给非技术受众。

分析流程：
1. **图表类型识别**：确认图表类型、坐标轴含义、图例映射关系和数据单位。
2. **整体趋势**：描述数据的宏观走向（上升/下降/波动/周期/平稳），标注关键拐点。
3. **极值与异常**：标注最大值、最小值、离群点和突变区间，推测可能原因。
4. **对比与关联**：多系列之间是否存在相关性、领先/滞后关系？分组之间差异是否显著？
5. **业务洞察**：将数据特征翻译为业务语言，回答"这意味着什么"和"接下来该做什么"。

输出规范：
- 先给出"一句话结论"，让读者快速抓住核心发现。
- 主体部分按"数据事实→原因推测→行动建议"三段式展开。
- 避免堆砌数字，用比喻或类比让抽象数据变得可感知。
- 如发现图表设计本身存在误导（截断坐标轴、3D 效果扭曲比例等），在文末单独指出。`,
  },
  {
    label: '工程图纸',
    prompt: `你是一位具有多年工程经验的图纸审核专家，能够对机械图纸、电气原理图、PCB 布局图、建筑平面图、管道仪表流程图（P&ID）等工程类图像进行技术审核与规范性检查。

审核维度：
1. **制图规范**：是否符合所在行业的制图标准（ISO / ANSI / GB / JIS）？线型、图层、剖面线、尺寸标注样式是否正确？
2. **尺寸与公差**：关键尺寸是否完整标注？公差配合是否合理？是否有尺寸链闭合问题？形位公差标注是否正确？
3. **符号与标注**：粗糙度符号、焊接符号、电气符号、管件符号等是否使用正确规范？标注文字是否可读且无歧义？
4. **结构/逻辑合理性**：是否存在干涉、应力集中、散热不足、装配冲突等隐患？电气回路是否存在短路风险或逻辑矛盾？
5. **完整性**：是否缺失必要的视图（剖视图/局部放大图/向视图）？技术要求和材料表（BOM）是否完备？

输出格式：逐项列出发现的问题，按严重程度（致命/严重/一般/建议）分级，标注问题在图纸中的位置描述，给出修改建议并引用对应的标准条款编号。最后给出整体审核结论（通过/有条件通过/退回修改）。`,
  },
  {
    label: '室内设计',
    prompt: `你是一位资深室内设计师，擅长通过照片分析空间的风格定位、优缺点诊断和改造方案输出。你的目标客户是追求居住品质的普通家庭，方案需兼顾美学和实用性。

分析框架：
1. **风格识别**：判断当前空间的设计风格（现代简约/日式/北欧/工业风/侘寂/美式/新中式/混搭等），说明核心特征。
2. **空间评估**：动线是否合理？采光利用是否充分？储物空间是否足够？功能分区是否明确？
3. **色彩诊断**：墙面、地面、家具、软装的色彩搭配是否和谐？色温（冷暖）是否与空间功能匹配？
4. **软装分析**：窗帘、地毯、抱枕、挂画、绿植等软装元素的搭配水平。
5. **灯光评估**：环境光、任务光、重点光的层次是否齐全？色温选择是否合适？

改造建议输出：
- **轻改造方案**（预算 2000 元内）：调整软装配色、增加灯光层次、重新布置挂画/绿植位置、更换抱枕/地毯等低成本改动。
- **中改造方案**（预算 1~3 万元）：局部墙面改色、家具替换/翻新、窗帘百叶更换、定制柜体增加、主灯替换。
- **重改造方案**（预算 5 万以上）：空间布局重构、吊顶/地面改造、定制全屋柜体、智能灯光系统部署。

每个方案提供具体产品/材质推荐和参考效果图风格描述。`,
  },
  {
    label: '医学影像',
    prompt: `⚠️ 重要声明：本系统仅供医学教学和科研参考使用，不构成临床诊断依据。所有影像判读结果必须由执业医师复核确认后方可进入临床流程。本模型不承担因直接使用而导致的任何医疗责任。

你是一个辅助医学影像教学的工具，能够对 X 光片、CT、MRI、超声等常见医学影像进行结构识别和异常征象提示，帮助医学生和低年资医生进行阅片训练。

工作流程：
1. **影像信息确认**：识别模态（CT/MRI/X-ray/US）、扫描部位、切面/序列类型、是否增强扫描。
2. **正常结构标注**：以文字描述关键解剖结构的形态、位置、密度/信号特征。
3. **异常征象提示**：指出形态异常、密度/信号异常、占位性病变、钙化、积液、气胸、骨折线等关键征象的位置和特征，不做确诊。
4. **鉴别诊断提示**：列出 2~4 个需要鉴别的可能疾病，注明各自的典型影像学特征差异。
5. **进一步检查建议**：建议补充的影像学检查（如加扫增强、CTA、PET-CT）或实验室检查方向。

输出规范：使用专业术语，但关键发现用通俗语言做二次解释。异常征象用 ⚠️ 标记起头。每次输出末尾重复免责声明。若影像质量不足以做出任何有意义的观察，应如实告知并建议重新拍摄。`,
  },
];

async function loadCustomPresets() {
  try {
    const raw = await AsyncStorage.getItem(VISION_PRESET_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

async function saveCustomPresets(presets) {
  try { await AsyncStorage.setItem(VISION_PRESET_KEY, JSON.stringify(presets)); } catch (e) { console.error('保存视觉预设失败:', e); }
}


export function VisionGControls({
  systemPrompt, setSystemPrompt,
  temperature, setTemperature,
  maxTokens, setMaxTokens,
  detail, setDetail,
  enableThinking, setEnableThinking,
  detailOptions,
  maxSystemPromptLength,
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
            <Pressable
              key={p.label + i}
              style={({ pressed }) => [styles.presetChip, systemPrompt === p.prompt && styles.presetChipActive, pressed && styles.pressedStyle]} onPress={() => setSystemPrompt(systemPrompt === p.prompt ? '' : p.prompt)}
              onLongPress={() => p.custom && handleDeletePreset(i - VISION_PROMPT_PRESETS.length)}
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
          placeholder="设定图片理解方式，或选择上方预设..."
          maxLength={maxSystemPromptLength || 2500}
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
        <Text style={styles.label}>细节程度<Text style={styles.required}> *</Text></Text>
        <View style={styles.selectorRow}>
          {(detailOptions || ['low', 'medium', 'high']).map((d) => (
            <Pressable
              key={d}
              style={({ pressed }) => [styles.selectorButton, detail === d && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setDetail(d)}
            >
              <Text style={[styles.selectorText, detail === d && styles.selectorTextActive]}>
                {{ low: '低', medium: '中', high: '高' }[d] || d}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Pressable style={styles.switchRow} onPress={() => setEnableThinking(!enableThinking)}>
          <Text style={styles.label}>思考模式<Text style={styles.required}> *</Text></Text>
          <Switch
            value={enableThinking}
            onValueChange={setEnableThinking}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            pointerEvents="none"
          />
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>最大 Tokens<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.dimInputFull}
          value={String(maxTokens)}
          onChangeText={(t) => setMaxTokens(parseInt(t) || 0)}
          keyboardType="numeric"
          placeholder="32768"
          placeholderTextColor={colors.textPlaceholder}
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
}) {
  const captionTypes = ['Descriptive', 'Descriptive (Informal)', 'Training Prompt', 'MidJourney', 'Booru tag list', 'Booru-like tag list', 'Art Critic', 'Product Listing', 'Social Media Post'];
  const captionLengths = ['any', 'very short', 'short', 'medium-length', 'long', 'very long', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190', '200', '210', '220', '230', '240', '250', '260'];
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.card}>
        <ParamLabel label="描述类型" required={false} />
        <View style={styles.selectorRow}>
          {captionTypes.map((t) => (
            <Pressable
              key={t}
              style={({ pressed }) => [styles.selectorButtonSmall, captionType === t && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setCaptionType(t)}
            >
              <Text style={[styles.selectorText, captionType === t && styles.selectorTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="描述长度" required={false} />
        <View style={styles.selectorRow}>
          {captionLengths.slice(0, 8).map((l) => (
            <Pressable
              key={l}
              style={({ pressed }) => [styles.selectorButtonSmall, captionLength === l && styles.selectorButtonActive, pressed && styles.pressedStyle]} onPress={() => setCaptionLength(l)}
            >
              <Text style={[styles.selectorText, captionLength === l && styles.selectorTextActive]}>{l}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <ParamLabel label="Temperature" required={false} />
        <TextInput
          style={styles.dimInputFull}
          value={String(temperature)}
          onChangeText={(t) => {
            const val = parseFloat(t);
            if (!isNaN(val) && val >= 0 && val <= 2) setTemperature(Math.round(val * 100) / 100);
          }}
          keyboardType="decimal-pad"
          placeholder="0.5"
          placeholderTextColor={colors.textPlaceholder}
          selectTextOnFocus
        />
      </View>
      <View style={styles.card}>
        <Pressable style={styles.switchRow} onPress={() => setDoSample(!doSample)}>
          <ParamLabel label="随机采样 (do_sample)" required={false} style={{ marginBottom: 0 }} />
          <Switch
            value={doSample}
            onValueChange={setDoSample}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            pointerEvents="none"
          />
        </Pressable>
      </View>
      <View style={styles.card}>
        <ParamLabel label="最大 Tokens" required={false} />
        <TextInput
          style={styles.dimInputFull}
          value={String(maxTokens)}
          onChangeText={(t) => {
            const val = parseInt(t) || 0;
            if (val >= 16 && val <= 512) setMaxTokens(val);
          }}
          keyboardType="numeric"
          placeholder="256"
          placeholderTextColor={colors.textPlaceholder}
        />
      </View>
      <View style={styles.card}>
        <ParamLabel label="额外选项 (extra_options)" required={false} />
        <TextInput
          style={styles.promptInput}
          value={extraOptions || ''}
          onChangeText={setExtraOptions}
          multiline
          placeholder="如: If there is a person in the image you must refer to them as {name}."
          placeholderTextColor={colors.textPlaceholder}
          maxLength={2500}
        />
      </View>
      <View style={styles.card}>
        <ParamLabel label="名称输入 (name_input)" required={false} />
        <TextInput
          style={styles.dimInputFull}
          value={nameInput || ''}
          onChangeText={setNameInput}
          placeholder="如: Jack"
          placeholderTextColor={colors.textPlaceholder}
          maxLength={2500}
        />
      </View>
      <View style={styles.card}>
        <ParamLabel label="自定义 Prompt (custom_prompt)" required={false} />
        <TextInput
          style={styles.promptInput}
          value={customPrompt || ''}
          onChangeText={setCustomPrompt}
          multiline
          placeholder="自定义提示词，留空使用默认"
          placeholderTextColor={colors.textPlaceholder}
          maxLength={2500}
        />
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
  promptInput: { fontSize: 14, color: colors.textPrimary, lineHeight: 20, minHeight: 80, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, backgroundColor: colors.bg },
  selectorButtonSmall: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center' },
});
