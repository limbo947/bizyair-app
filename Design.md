# Design.md — UI 设计规范

> 本文档是项目统一的 UI 设计规范，所有功能修改或新增开发时必须严格遵循，以保持产品视觉风格和用户体验的一致性。
>
> 规范来源：从 `AGENTS.md` 提取并系统化整理，结合 `src/constants/theme.js` 与 `src/constants/sharedStyles.js` 的实际实现。

---

## 1. 设计原则

| 原则 | 说明 |
|:---|:---|
| **iOS HIG 对齐** | 项目遵循 iOS Human Interface Guidelines 设计规范，视觉风格对齐原生 iOS 体验 |
| **Design Token 优先** | 颜色/字号/间距/圆角一律使用 `theme.js` 中的令牌常量，**禁止在组件中硬编码** |
| **主题响应式** | 所有组件样式通过 `useThemedStyles(createStyles)` 创建，自动响应亮/暗主题切换 |
| **关注点分离** | 组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数 |
| **一致性** | 复用现有 UI 模式和共享样式，新增功能优先复用已有组件 |
| **最小改动** | 修改代码时遵循最小改动原则，尽量保持原有接口不变 |

---

## 2. 设计令牌（Design Tokens）

所有视觉令牌集中管理于 `src/constants/theme.js`，UI 组件必须引用令牌常量。

### 2.1 色彩系统

色彩通过 `SemanticColors(colors)` 函数按主题（亮/暗）动态提供，包含以下语义色：

| 类别 | 语义色 | 用途 |
|:---|:---|:---|
| **主色** | `primary` / `primaryHover` / `primaryLight` / `primaryBg` / `primaryBorder` / `primaryDisabled` | 主操作按钮、链接、选中态 |
| **功能色** | `success` / `warning` / `error` / `info` / `purple` | 状态指示（各含 `Bg` / `Border` 变体） |
| **背景** | `bg` / `card` / `inputBg` / `groupedBg` / `disabledBg` | 页面背景、卡片背景、输入框背景 |
| **文本** | `textPrimary` / `textSecondary` / `textTertiary` / `textPlaceholder` / `textInverse` / `textOnOverlay` | 主文本/次要文本/占位符/反色文本 |
| **边框** | `border` / `divider` / `separator` | 边框、分割线 |
| **遮罩** | `overlayLight` / `overlayMedium` / `overlayHeavy` | Modal 遮罩（20% / 50% / 85%） |
| **其他** | `star` / `disabled` | 收藏星标、禁用态 |

### 2.2 圆角（Radius）

统一使用 `borderCurve: 'continuous'`（iOS 连续圆角）。

| 令牌 | 值 | 使用场景 |
|:---|---:|:---|
| `Radius.xs` | 6 | 小按钮、标签 |
| `Radius.sm` | 8 | 次要按钮、输入框 |
| `Radius.md` | 10 | 卡片、主按钮 |
| `Radius.lg` | 14 | 大卡片、Modal |
| `Radius.xl` | 18 | 浮层、大 Modal |
| `Radius.xxl` | 22 | 特殊大圆角容器 |
| `Radius.full` | 999 | 头像、徽章、圆形按钮 |

可使用 `withBorderRadius(radius)` 辅助函数自动添加 `borderCurve: 'continuous'`。

### 2.3 间距（Spacing）

| 令牌 | 值 | 使用场景 |
|:---|---:|:---|
| `Spacing.xs` | 4 | 紧凑间距（图标与文字） |
| `Spacing.sm` | 8 | 小间距（标签间） |
| `Spacing.md` | 12 | 中间距（卡片内元素） |
| `Spacing.lg` | 16 | 标准间距（卡片内边距） |
| `Spacing.xl` | 20 | 大间距（区块间） |
| `Spacing.xxl` | 28 | 区段间距 |
| `Spacing.xxxl` | 32 | 页面级大间距 |

### 2.4 排版（Typography）

#### 字号（fontSize）

| 令牌 | 值 | 使用场景 |
|:---|---:|:---|
| `caption2` | 11 | 辅助说明、时间戳 |
| `caption1` | 12 | 次要标注 |
| `footnote` | 13 | 表单标签、脚注 |
| `subheadline` | 15 | 副标题 |
| `callout` | 16 | 选项文本 |
| `body` | 17 | 正文（默认） |
| `headline` | 17 | 标题（加粗） |
| `title3` | 20 | 小标题 |
| `title2` | 22 | 页面标题 |

#### 字重（fontWeight）

| 令牌 | 值 |
|:---|---:|
| `regular` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |

#### 行高（lineHeight）

| 令牌 | 值 |
|:---|---:|
| `tight` | 16 |
| `normal` | 22 |
| `relaxed` | 26 |

#### 字间距（letterSpacing）

| 令牌 | 值 |
|:---|---:|
| `tight` | -0.4 |
| `normal` | 0 |
| `wide` | 0.5 |

### 2.5 阴影（Shadow）

仅亮色主题可见，暗色主题阴影不可见。

| 令牌 | shadowOpacity | shadowRadius | elevation | 使用场景 |
|:---|---:|---:|---:|:---|
| `Shadow.sm` | 0.1 | 4 | 2 | 小卡片、按钮 |
| `Shadow.md` | 0.15 | 8 | 5 | 浮层、下拉菜单 |
| `Shadow.lg` | 0.2 | 12 | 8 | Modal、全屏弹窗 |

### 2.6 按钮变体（ButtonVariants）

| 变体 | paddingVertical | borderRadius | fontSize | fontWeight | 使用场景 |
|:---|:---|:---|:---|:---|:---|
| `primary` | `Spacing.lg` (16) | `Radius.md` (10) | `headline` (17) | `bold` (700) | 主操作按钮（生成、提交） |
| `secondary` | `Spacing.sm+2` (10) | `Radius.sm` (8) | `footnote` (13) | `semibold` (600) | 次要操作 |
| `ghost` | `Spacing.xs+2` (6) | `Radius.sm` (8) | `footnote` (13) | `medium` (500) | 幽灵按钮（透明背景） |
| `small` | 5 | `Radius.xs` (6) | `footnote` (13) | `semibold` (600) | 小型按钮 |

---

## 3. 主题系统

### 3.1 亮/暗主题色板

项目支持亮/暗双主题，通过 `ThemeProvider` 管理，持久化到 AsyncStorage。

#### 核心语义色对照

| 语义色 | 亮色 | 暗色 |
|:---|---:|---:|
| `bg`（背景） | `#F2F2F7` | `#000000` |
| `card`（卡片） | `#FFFFFF` | `#1C1C1E` |
| `primary`（主色） | `#007AFF` | `#0A84FF` |
| `textPrimary` | `#1C1C1E` | `#FFFFFF` |
| `textSecondary` | `#3C3C43` | `#EBEBF5` |
| `textTertiary` | `#636366` | `#8E8E93` |
| `separator` | `#C6C6C8` | `#38383A` |
| `border` | `#C6C6C8` | `#38383A` |

#### 功能色对照

| 功能色 | 亮色 | 暗色 |
|:---|---:|---:|
| `success` | `#34C759` | `#30D158` |
| `warning` | `#FF9500` | `#FF9F0A` |
| `error` | `#FF3B30` | `#FF453A` |
| `info` | `#5AC8FA` | `#64D2FF` |
| `purple` | `#AF52DE` | `#BF5AF2` |

### 3.2 主题响应式样式模式

**必须使用** `useThemedStyles(createStyles)` 模式，而非内联样式或 `StyleSheet.create`：

```js
// ✅ 正确：工厂函数 + useMemo 自动响应主题切换
const createStyles = (colors) => ({
  container: {
    backgroundColor: colors.bg,
    padding: Spacing.md,
  },
});
const styles = useThemedStyles(createStyles);

// ❌ 错误：硬编码颜色值
const styles = {
  container: { backgroundColor: '#F2F2F7' },
};

// ❌ 错误：使用 StyleSheet.create（不响应主题切换）
const styles = StyleSheet.create({
  container: { backgroundColor: '#F2F2F7' },
});
```

---

## 4. 交互反馈规范

### 4.1 按下反馈

所有 `Pressable` **必须**使用 `pressedOpacity()`（来自 `sharedStyles.js` / `theme.js`）作为 `pressed` 样式：

```js
import { pressedOpacity } from '../constants/theme';

<Pressable style={({ pressed }) => pressed ? pressedOpacity() : null}>
  {/* 内容 */}
</Pressable>;
```

`pressedOpacity()` 默认透明度为 0.7，可自定义：`pressedOpacity(0.5)`。

### 4.2 禁用态

不可点击元素必须设置：
- `opacity: 0.4`
- `pointerEvents: 'none'`

### 4.3 状态色语义

任务状态通过 `STATUS_COLORS` / `STATUS_BG` 映射（由 `createTheme()` 按主题生成）：

| 状态 | 颜色语义 | STATUS_COLORS | STATUS_BG |
|:---|:---|:---|:---|
| Pending（等待） | 橙色 | `colors.warning` | `colors.warningBg` |
| Queuing（排队） | 橙色 | `colors.warning` | `colors.warningBg` |
| Preparing（准备） | 蓝色 | `colors.info` | `colors.infoBg` |
| Running（运行中） | 主色 | `colors.primary` | `colors.primaryBg` |
| Saving（保存中） | 紫色 | `colors.purple` | `colors.purpleBg` |
| Success（成功） | 绿色 | `colors.success` | `colors.successBg` |
| Failed（失败） | 红色 | `colors.error` | `colors.errorBg` |

---

## 5. 共享样式

`src/constants/sharedStyles.js` 提供跨组件共享的基础样式，通过 `createSharedStyles(colors)` 工厂函数创建。

### 5.1 布局样式

| 样式名 | 说明 |
|:---|:---|
| `card` | 标准卡片样式（card 背景 + lg 内边距 + md 圆角 + md 下边距） |
| `label` | 表单标签（footnote 字号 + semibold 字重 + 次要文本色 + 大写字间距） |
| `selectorRow` | 选择器按钮行（横向排列 + 自动换行 + sm 间距） |
| `switchRow` | 开关行（横向排列 + 两端对齐） |
| `emptyContainer` | 空状态容器（居中 + 60 顶部内边距） |

### 5.2 基础常量

| 常量 | 值 | 说明 |
|:---|---:|:---|
| `badgeBase` | — | 徽章基础样式（full 圆角 + sm 水平内边距） |
| `avatarBase` | — | 头像基础样式（full 圆角） |
| `emptyIconSize` | 48 | 空状态图标尺寸 |
| `emptyPanelIconSize` | 36 | 面板空状态图标尺寸 |

---

## 6. 组件规范

### 6.1 基础要求

- **文件命名**：使用 kebab-case，与导出组件名一致
- **错误保护**：新增 UI 组件必须包裹 `ErrorBoundary`（`src/components/layout/ErrorBoundary.js`），防止单点崩溃影响整页
- **主题响应**：所有组件样式通过 `useThemedStyles(createStyles)` 创建
- **令牌引用**：颜色/字号/间距/圆角一律引用 Design Token，禁止硬编码

### 6.2 列表组件

| 规则 | 说明 |
|:---|:---|
| 虚拟化 | 长列表**必须**使用 `FlatList`（非 `ScrollView`） |
| 行组件缓存 | 扁平列表**必须**使用 `React.memo` 包裹行组件 |
| 布局优化 | 固定高度项建议设置 `getItemLayout` |
| 分页加载 | 使用 `PAN_SIZE=8` + `visibleCount` 状态控制分页 |

### 6.3 Modal 组件

项目提供两个统一 Modal 组件，新增浮层时优先复用：

| 组件 | 位置 | 使用场景 |
|:---|:---|:---|
| `DropdownModal` | `components/common/DropdownModal.js` | 对齐触发按钮的上拉浮层面板 |
| `PickerModal` | `components/common/PickerModal.js` | 居中选择器（带标题的选项列表） |

### 6.4 媒体组件

| 组件 | 位置 | 说明 |
|:---|:---|:---|
| `ImageViewer` | `components/media/ImageViewer.js` | 图片预览（PanResponder 双指缩放 + 左右划切换 + 下载） |
| `VideoPlayer` | `components/media/VideoPlayer.js` | 视频播放（expo-video） |
| `AudioPlayer` | `components/media/AudioPlayer.js` | 音频播放（expo-audio，带进度条） |
| `UploadCard` | `components/media/UploadCard.js` | 上传卡片（文件/图片/视频/音频，带预览 + 进度提示） |

### 6.5 图片规范

- **必须使用** `expo-image`（替代 RN Image），支持内存 + 磁盘双缓存
- 远程图片自动缓存，无需手动处理

---

## 7. 常见 UI 模式

项目中已沉淀以下重复使用的 UI 模式，新增功能时**优先复用**：

| 模式 | 实现 | 使用场景 |
|:---|:---|:---|
| 主题样式工厂 | `useThemedStyles(createStyles)` | 任何需要响应亮/暗主题的组件样式 |
| Pressable 反馈 | `pressedOpacity()` | 所有可点击元素的按下态 |
| 状态标记 | `STATUS_COLORS`（`theme.js`） | 任何异步状态展示（Pending/Running/Success/Failed） |
| 模型选择流程 | ModelSelector → ModelSelectScreen Modal | 更换 AI 模型 |
| 文件上传 + 预览 | `UploadCard` + `useFileUpload` | 图片/视频/音频/文件输入 |
| 结果查看 | ImageViewer / VideoPlayer / AudioPlayer / TextResultView | 不同媒体类型的输出展示 |
| 统一 Modal | `DropdownModal` / `PickerModal` | 下拉浮层 / 居中选择器 |
| 网络状态栏 | `NetworkStatusBar` + `useNetworkStatus` | 离线提示 |
| 参数预设 | `ParamPresetBar` + `usePresets` | 保存/复用参数组合 |
| 列表分页 | FlatList + `PAN_SIZE` + `visibleCount` | 历史记录等长列表场景 |

---

## 8. 性能优化（UI 相关）

新增功能时参照执行以下性能决策：

| 优化点 | 实现方式 | 适用范围 |
|:---|:---|:---|
| 列表虚拟化 | `FlatList`（非 ScrollView） | 模型列表、历史列表 |
| 行组件缓存 | `React.memo` | ModelCard、HistoryCard、WebappListItem |
| 样式缓存 | `useThemedStyles` + `useMemo` | 所有组件样式 |
| 图片缓存 | `expo-image`（内存 + 磁盘双缓存） | 所有远程图片 |
| 缩略图懒加载 | `expo-video-thumbnails` 异步生成 + 缓存 | 视频历史卡片 |
| 分页加载 | `PAN_SIZE=8` + `visibleCount` 状态 | 历史记录列表 |
| 布局优化 | `getItemLayout`（固定高度项） | 建议对固定高度 FlatList 添加 |
| 动画性能 | `useNativeDriver: true` | 所有 Animated 动画 |

---

## 9. UI 组件检查清单

创建新 UI 组件时需满足：

1. **主题响应式**：样式通过 `useThemedStyles(createStyles)` 创建，颜色/字号/间距引用 Design Token
2. **交互反馈**：可点击元素使用 `pressedOpacity()` 作为 pressed 样式
3. **错误保护**：页面级组件包裹 `ErrorBoundary`
4. **列表优化**：长列表使用 `FlatList` + `React.memo` 包裹行组件
5. **文件命名**：使用 kebab-case，与导出组件名一致
6. **令牌优先**：禁止硬编码颜色/字号/间距/圆角值，一律引用 `theme.js` 令牌
7. **模式复用**：优先复用已有 UI 模式和共享样式

---

## 10. 代码行数限制

- 单文件有效代码行数（不含空行/注释）不得超过 **800 行**
- 新建代码文件或修改后的代码文件预估超 **700 行** 时即拆分为多个文件
