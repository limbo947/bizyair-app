# AGENTS.md

## 常用命令

- **安装依赖**: `npm install`
- **启动 Web 预览**: `npx expo start --web --port 8081`
- **启动开发服务器**: `npx expo start`
- **静态导出 Web**: `npx expo export --platform web`，然后用 `npx serve dist -l 3000` 预览
- **构建 APK（一键脚本，推荐）**: `.\build-android.ps1 -Clean`（全量构建）；`.\build-android.ps1`（增量构建）
- **增量 Gradle 构建（已有 android/ 目录时）**: `cd android && .\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a`
- **EAS Build（兜底方案）**: `npx eas build --platform android --profile preview --local`
- **配置 API 密钥**: 复制 `.env.example` 为 `.env`，填入 `EXPO_PUBLIC_BIZYAIR_API_KEY=你的密钥`
- **Lint 检查**: `npx eslint .`

## 技术栈与版本
- Expo SDK 56，参考文档：https://docs.expo.dev/versions/v56.0.0/
- React Native 0.85.3 + React 19.2，Hermes v1 引擎 + 新架构（New Arch）默认启用
- 目标架构：Android arm64-v8a / Web
- expo-router 文件路由（原生 Tab 导航 + Modal 路由）
- expo-image（替代 RN Image，内存/磁盘双缓存）
- expo-file-system OOP API（File/Paths，替代 legacy downloadAsync）
- AsyncStorage 本地存储，expo-audio 音频播放，expo-video 视频播放，react-native-markdown-display Markdown 渲染
- jssha（阿里云 OSS HMAC-SHA1 签名）

## 项目结构
  *新增文件或修改文件后，及时更新本章节，保持与项目结构一致。*
```
├── App.js                    # expo-router 入口（import 'expo-router/entry'）
├── app/                      # expo-router 文件路由
│   ├── _layout.js            # 根布局（SafeAreaProvider → ThemeProvider → AppProvider → Stack）
│   ├── model-select.js       # 模型选择 Modal 路由（presentation: 'modal'）
│   └── (tabs)/               # Tab 导航组
│       ├── _layout.js        # Tab 配置（主页 / AI应用 / 历史，含活跃任务角标）
│       ├── index.js          # 主页 → HomeScreen
│       ├── webapp.js         # AI应用 → WebappScreen
│       └── history.js        # 历史 → HistoryScreen
├── api.js                    # API 兼容层（重新导出 services/utils/constants 的公共接口）
├── package.json              # 依赖配置（main: expo-router/entry）
├── app.json                  # Expo 配置（scheme: bizyair）
├── eas.json                  # EAS Build 配置
├── build-android.ps1         # APK 一键构建脚本（prebuild → 修补 → Gradle）
├── scripts/                  # 构建辅助脚本
│   ├── patch-android-build.ps1  # post-prebuild 配置修补（签名/ProGuard/allowBackup）
│   └── upload-proxy.mjs         # 上传代理（Node.js 中转服务，用于调试 OSS 直传）
├── src/
│   ├── context/              # 全局状态管理（Provider 链：ApiKey → History → Favorites）
│   │   ├── ApiKeyContext.js  # API 密钥、多密钥切换、钱包余额
│   │   ├── HistoryContext.js # 历史记录、轮询、homeState
│   │   ├── FavoritesContext.js # 收藏模型管理
│   │   ├── AppContext.js     # 组合 Provider + activeTab 导航状态
│   │   ├── ThemeContext.js   # 亮/暗主题，持久化 AsyncStorage，提供 colors + theme
│   │   └── ToastContext.js   # 全局 Toast 通知管理（自动消失 + 手动关闭）
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js    # 主页（useReducer + expo-image + Pressable + KeyboardAvoidingView）
│   │   ├── home/            # 主页子模块
│   │   │   ├── homeReducer.js  # reducer + initialState + MODE_LABELS + dispatch helpers
│   │   │   └── useHomeSubmit.js # 提交逻辑自定义 Hook（表单校验 + API 调用 + 错误处理）
│   │   ├── HistoryScreen.js # 历史（HistoryCard memo + DurationDisplay 独立定时器 + FlatList 分页）
│   │   ├── ModelSelectScreen.js # 模型选择（FlatList 虚拟化 + ModelCard memo + 左侧分类栏）
│   │   └── WebappScreen.js  # AI 应用（Combo 下拉浮层 + Toggle 控件）
│   ├── components/           # UI 组件（28 个，按职责分为 4 类）
│   │   │
│   │   │ # 参数控件（9 个，由 HomeParamControls.js 按 paramType 路由分发）
│   │   ├── HomeParamControls.js   # paramType 路由分发入口
│   │   ├── ParamControls.js       # 图片模型参数（6 种：分辨率/比例/画质/数量/去水印/种子）
│   │   ├── VideoParamControls.js  # 视频模型参数（10 种，Switch 用 Pressable 包裹）
│   │   ├── LLMControls.js         # LLM 参数（温度/MaxTokens/Thinking/Speed）
│   │   ├── VisionParamControls.js # 视觉理解参数
│   │   ├── TTSControls.js         # TTS 参数（音色选择/语速/情感/音量）
│   │   ├── AceStepControls.js     # AceStep 模型专用参数
│   │   ├── BirefnetControls.js    # Birefnet 背景移除模型专用参数
│   │   ├── FluxKleinControls.js   # Flux Klein 模型专用参数
│   │   ├── KontextLoraControls.js # Kontext LoRA 模型专用参数
│   │   ├── Seedvr2Controls.js     # SeedVR2 视频修复模型专用参数
│   │   │
│   │   │ # 通用 UI 组件（10 个）
│   │   ├── UploadCard.js          # 上传卡片（文件/图片/视频/音频，带预览 + 进度提示）
│   │   ├── ModelSelector.js       # 模型选择器（首页顶部下拉按钮）
│   │   ├── FavoriteModelsLayer.js # 收藏模型浮层（Modal + FlatList）
│   │   ├── ApiKeyDropdown.js      # 密钥管理下拉（多密钥切换 + 余额显示）
│   │   ├── AppHeader.js           # 共享头部组件（用户信息/余额/主题切换/密钥）
│   │   ├── ResizableTextInput.js  # 自适应输入框（多行，跟随内容撑高）
│   │   ├── ParamLabel.js          # 参数标签组件（标题 + 说明文本）
│   │   ├── Toast.js               # Toast 通知组件（成功/错误/警告/信息，自动消失）
│   │   ├── StatusBadge.js         # 状态徽章（Pending/Running/Success/Failed）
│   │   └── ErrorBoundary.js       # 错误边界（React Error Boundary 包裹子组件）
│   │   │
│   │   │ # 结果展示组件（6 个）
│   │   ├── ImageViewer.js         # 图片预览（PanResponder 双指缩放 + 左右划切换 + 下载）
│   │   ├── VideoPlayer.js         # 视频播放（expo-video）
│   │   ├── AudioPlayer.js         # 音频播放（expo-audio，带进度条）
│   │   ├── TextResultView.js      # 文本结果展示（复制按钮 + 滚动查看）
│   │   ├── MarkdownRenderer.js    # Markdown 渲染（react-native-markdown-display）
│   │   │
│   │   │ # 页面辅助组件（3 个）
│   │   ├── HistoryFilters.js      # 历史筛选（类型/状态/日期多条件筛选）
│   │   └── HistoryModals.js       # 历史弹窗（日志查看 / 详情 / 操作确认）
│   ├── constants/            # 常量定义
│   │   ├── models.js         # MODELS 对象 + paramType + 价格配置
│   │   ├── modelMeta.js      # CATEGORIES / MANUFACTURERS / FAVORITES_MAX_COUNT
│   │   ├── theme.js          # Design Token：Radius / Spacing / Typography / Shadow / ButtonVariants / STATUS_COLORS
│   │   ├── sharedStyles.js   # 跨组件共享样式（pressedOpacity / 通用布局）
│   │   └── ratios.js         # 图片比例预设（1:1 / 4:3 / 16:9 等）
│   ├── hooks/                # 自定义 Hooks（2 个）
│   │   ├── useFileUpload.js  # 文件上传（选文件 → OSS 直传 → commitResource，含进度/取消/错误）
│   │   └── useThemedStyles.js # 主题响应式样式工厂（createStyles + useMemo）
│   ├── utils/                # 纯函数工具（4 个）
│   │   ├── modelHelpers.js   # 价格计算 / 模型过滤 / 参数默认值
│   │   ├── payloadBuilder.js # 参数映射（camelCase → snake_case）+ 请求体构建
│   │   ├── helpers.js        # 通用辅助函数（时间格式化 / 字符串处理）
│   │   └── download.js       # 文件下载（expo-file-system + MediaLibrary）
│   └── services/             # API 服务层
│       └── apiClient.js      # request() 封装（15s 超时 / 指数退避重试 / 错误分类）
├── assets/                   # 图标资源
├── reference/                # 参考文档（API 文档 / 构建指南）
├── apk/                      # 构建产物（APK 安装包）
├── keystore-backup/          # 签名密钥备份
└── .env.example              # 环境变量模板（EXPO_PUBLIC_BIZYAIR_API_KEY）
```

## 设计体系（Design System）

项目遵循 iOS HIG 对齐的设计规范，通过 `src/constants/theme.js` 集中管理所有视觉令牌。

### 设计令牌（Design Tokens）
所有 UI 组件必须引用令牌常量，**禁止在组件中硬编码颜色/字号/间距值**：

| 令牌类别 | 导出名 | 包含内容 |
|:---|:---|:---|
| 色彩 | `SemanticColors(colors)` | `bg` / `card` / `textPrimary` / `textSecondary` / `textTertiary` / `textOnOverlay` / `primary` / `primaryBg` / `success` / `warning` / `error` / `separator` / `border` / `star` / `overlayBg` |
| 圆角 | `Radius` | `xs(4)` / `sm(6)` / `md(10)` / `lg(14)` / `xl(18)` / `full(9999)`，统一使用 `borderCurve: 'continuous'` |
| 间距 | `Spacing` | `xs(4)` / `sm(8)` / `md(12)` / `lg(16)` / `xl(20)` / `xxl(24)` / `xxxl(32)` |
| 排版 | `Typography` | `fontSize`(caption2~title2) / `fontWeight` / `lineHeight` / `letterSpacing` |
| 阴影 | `Shadow` | `sm` / `md` / `lg`（仅亮色主题，暗色主题阴影不可见） |
| 按钮 | `ButtonVariants` | `primary` / `secondary` / `danger` / `ghost`，含 default / pressed / disabled 三态 |

### 主题响应式样式
使用 `useThemedStyles(createStyles)` 模式，而不是内联样式或 `StyleSheet.create`：
```js
// ✅ 正确：工厂函数 + useMemo 自动响应主题切换
const createStyles = (colors) => ({ container: { backgroundColor: colors.bg, padding: Spacing.md } });
const styles = useThemedStyles(createStyles);

// ❌ 错误：硬编码颜色值
const styles = { container: { backgroundColor: '#F2F2F7' } };
```

### 交互反馈规范
- **按下反馈**：所有 `Pressable` 必须使用 `pressedOpacity()`（来自 `sharedStyles.js`）作为 pressed 样式
- **禁用态**：不可点击元素必须设置 `opacity: 0.4` + `pointerEvents: 'none'`
- **状态色语义**：`STATUS_COLORS` / `STATUS_BG` 映射（Pending=蓝、Running=橙、Success=绿、Failed=红、Cancelled=灰）

### 亮/暗主题色板

| 语义色 | 亮色 | 暗色 |
|:---|---:|:---|
| `bg` (背景) | `#F2F2F7` | `#000000` |
| `card` (卡片) | `#FFFFFF` | `#1C1C1E` |
| `primary` (主色) | `#007AFF` | `#0A84FF` |
| `textPrimary` | `#000000` | `#FFFFFF` |
| `textSecondary` | `#3C3C43` (60%) | `#EBEBF5` (60%) |
| `textTertiary` | `#3C3C43` (30%) | `#EBEBF5` (30%) |
| `separator` | `#3C3C43` (20%) | `#545458` (60%) |

## 代码生成规则
- 新建文件严格按上述目录存放，文件名使用 kebab-case
- **关注点分离**：组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数
- **Design Token 优先**：颜色/字号/间距/圆角一律使用 `theme.js` 中的令牌，禁止硬编码
- **主题响应式**：组件样式通过 `useThemedStyles(createStyles)` 创建，不使用内联颜色值
- 修改和新增功能优先复用现有模块
- 修改代码时遵循最小改动原则，尽量保持原有接口不变
- 单文件有效代码行数（不含空行/注释）不得超过 **800 行**，*新建代码文件*或*修改后的代码文件* 预估超 **700 行** 时即拆分为多个文件
- **新增 UI 组件必须包裹 `ErrorBoundary`** 防止单点崩溃影响整页
- **所有 Pressable 必须有 `pressed` 反馈**（使用 `pressedOpacity()`）
- **扁平列表必须使用 `React.memo`** 包裹行组件，必要时设置 `getItemLayout`

## 架构概览

### Provider 链与路由
```
expo-router entry → app/_layout.js
SafeAreaProvider → ThemeProvider → AppProvider → ToastProvider → Stack
AppProvider = ApiKeyProvider → HistoryProvider → FavoritesProvider
```
- `ThemeProvider` — 亮/暗主题（`useTheme()`），持久化到 AsyncStorage。
- `ApiKeyProvider` — API 密钥、多密钥切换、钱包余额（`useApiKeyContext()`）。
- `HistoryProvider` — 历史记录、轮询、homeState（`useHistoryContext()`）。
- `FavoritesProvider` — 收藏模型管理（`useFavoritesContext()`）。
- `AppProvider` — 组合以上四个 Provider + activeTab 导航状态。
- `ToastProvider` — 全局 Toast 通知（自动消失 3s + 手动关闭），通过 `ToastContext` 暴露 `showToast(message, type)`。
- 路由：expo-router 文件路由，`(tabs)/` 组提供三标签导航，`model-select` 提供 Modal 路由。

### 任务提交 → 轮询 → 结果
1. 用户在 `HomeScreen` 选模型、填参数，点击生成。
2. `HomeParamControls.js` 根据模型的 `paramType` 路由到对应控件组件渲染表单。
3. `payloadBuilder.js` 将前端 camelCase 参数映射为 API snake_case 请求体。
4. `apiClient.js` 调用 `submitTask()` 提交，返回 `requestId`。
5. `HistoryContext` 添加历史记录（Pending/Running），`startPolling()` 每 3 秒轮询状态。
6. 轮询成功后提取输出 URL；连续 5 次失败标记 Failed。启动时 `resumeRunningPolling()` 自动恢复。

### paramType 驱动
`constants/models.js` 中每个模型定义 `paramType`，驱动三处逻辑：

| 层面 | 实现位置 | 说明 |
|:---|:---|:---|
| 参数表单 | `HomeParamControls.js` → 按 paramType 分发到 5 类控件组件 | 图片类（6 种）、视频类（10 种）、LLM、Vision、TTS |
| 请求体构建 | `payloadBuilder.js` switch-case | 每类 paramType 一个 case |
| 价格计算 | `modelHelpers.js` `calculatePrice()` | 固定/分辨率/时长/像素/token 等策略 |

### 文件上传
1. `useFileUpload` → `DocumentPicker` 选本地文件
2. `apiClient.getUploadToken()` → 获取 OSS STS 临时凭证
3. jssha HMAC-SHA1 签名 → PUT 直传阿里云 OSS
4. `apiClient.commitResource()` → 通知服务端确认

### API 请求封装
`apiClient.js` 的 `request()` 统一封装：15 秒超时（AbortController）、指数退避重试（最多 3 次）、错误分类（超时/服务端/客户端）。

### 常见 UI 模式
项目中已沉淀以下重复使用的 UI 模式，新增功能时优先复用：

| 模式 | 实现 | 使用场景 |
|:---|:---|:---|
| 主题样式工厂 | `useThemedStyles(createStyles)` | 任何需要响应亮/暗主题的组件样式 |
| Pressable 反馈 | `pressedOpacity()` | 所有可点击元素的按下态 |
| 状态标记 | `StatusBadge` + `STATUS_COLORS` | 任何异步状态展示（Pending/Running/Success/Failed） |
| 模型选择流程 | ModelSelector → ModelSelectScreen Modal | 更换 AI 模型 |
| 文件上传 + 预览 | `UploadCard` + `useFileUpload` | 图片/视频/音频/文件输入 |
| 结果查看 | ImageViewer / VideoPlayer / AudioPlayer / TextResultView | 不同媒体类型的输出展示 |
| 列表分页 | FlatList + `PAN_SIZE` + `visibleCount` | 历史记录等长列表场景 |
| ListEmptyComponent | 条件渲染指导文案 | FlatList 无数据时的引导展示 |

## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示
- 用户可见的错误信息通过 `ToastContext.showToast(message, 'error')` 统一展示
- 每个页面级组件应包裹 `ErrorBoundary`（`src/components/ErrorBoundary.js`），防止单组件崩溃白屏
- 轮询失败处理：连续 5 次轮询失败 → 标记 Failed；网络恢复后 `resumeRunningPolling()` 自动续轮

## 性能优化要点
现有性能决策沉淀，新增功能时参照执行：

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

## 新增模型检查清单
添加新模型时需同步修改：
1. `src/constants/models.js` — `MODELS` 对象中添加模型配置（paramType、modes、prices/priceCalculator）
2. `src/constants/modelMeta.js` — `MODEL_MANUFACTURERS` 映射中添加条目
3. `src/components/HomeParamControls.js` — 若新的 paramType，添加 import + case 分支
4. `src/utils/payloadBuilder.js` — 若新的 paramType，添加 switch-case
5. `src/utils/modelHelpers.js` — 若新计费方式，添加计算函数
6. `src/components/` — 若新参数控件，创建组件并在 `HomeParamControls.js` 中引入；若复用已有 paramType 则跳过
7. `src/screens/home/homeReducer.js` — `initialState` 中添加模型的默认参数值；若参数较多，考虑按 paramType 拆分初始状态

## 新增 UI 组件检查清单
创建新 UI 组件时需满足：
1. **主题响应式**：样式通过 `useThemedStyles(createStyles)` 创建，颜色/字号/间距引用 Design Token
2. **交互反馈**：可点击元素使用 `pressedOpacity()` 作为 pressed 样式
3. **错误保护**：页面级组件包裹 `ErrorBoundary`
4. **列表优化**：长列表使用 `FlatList` + `React.memo` 包裹行组件
5. **无障碍**：为交互元素添加 `accessibilityLabel` 和 `accessibilityRole`
6. **文件命名**：使用 kebab-case，与导出组件名一致

## 构建（Build）
- *用户明确要构建apk时*，阅读参考文档 `reference\apk-build-reference.md`
- `build-android.ps1` 自动执行：版本号递增 → 签名密钥备份/恢复 → expo prebuild → patch-android-build.ps1 修补 → Gradle 构建 → 产物验证 → 复制到 apk/ 目录
- `patch-android-build.ps1` 修补内容：ProGuard 规则、gradle.properties 配置、AndroidManifest allowBackup=false、build.gradle 签名注入和 APK 命名
