# AGENTS.md

## 常用命令

- **安装依赖**: `npm install`
- **启动 Web 预览**: `npx expo start --web --port 8081`
- **启动开发服务器**: `npx expo start`
- **静态导出 Web**: `npx expo export --platform web`，然后用 `npx serve dist -l 3000` 预览
- **构建 APK（一键脚本，推荐）**: `.\scripts\build-android.ps1 -Clean`（全量构建）；`.\scripts\build-android.ps1`（增量构建）
- **增量 Gradle 构建（已有 android/ 目录时）**: `cd android && .\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a`
- **EAS Build（兜底方案）**: `npx eas build --platform android --profile preview --local`
- **配置 API 密钥**: 复制 `.env.example` 为 `.env`，填入 `EXPO_PUBLIC_BIZYAIR_API_KEY=你的密钥`
- **Lint 检查**: `npx eslint .`

## 技术栈与版本
- Expo SDK 56，参考文档：https://docs.expo.dev/versions/v56.0.0/
- React Native 0.85.3 + React 19.2，Hermes v1 引擎 + 新架构（New Arch）默认启用
- 目标架构：Android arm64-v8a / Web（react-native-web）
- expo-router 文件路由（原生 Tab 导航 + Modal 路由）
- expo-image（替代 RN Image，内存/磁盘双缓存）
- expo-file-system OOP API（File/Paths，替代 legacy downloadAsync）
- AsyncStorage 本地存储，expo-audio 音频播放，expo-video 视频播放，react-native-markdown-display Markdown 渲染
- @react-native-community/netinfo（网络状态检测），expo-clipboard（剪贴板），expo-haptics（触觉反馈），react-native-gesture-handler（手势处理）
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
├── package.json              # 依赖配置（main: expo-router/entry）
├── app.json                  # Expo 配置（scheme: bizyair）
├── eas.json                  # EAS Build 配置
├── scripts/                  # 构建辅助脚本
│   ├── build-android.ps1     # APK 一键构建脚本（prebuild → 修补 → Gradle）
│   ├── patch-android-build.ps1  # post-prebuild 配置修补（签名/ProGuard/allowBackup）
│   └── upload-proxy.mjs         # 上传代理（Node.js 中转服务，用于调试 OSS 直传）
├── src/
│   ├── context/              # 全局状态管理（Provider 链：ApiKey → History → Favorites）
│   │   ├── history/          # 历史记录子模块
│   │   │   ├── HistoryProvider.js  # 历史记录、轮询、homeState
│   │   │   ├── contexts.js        # 历史相关 Context 定义
│   │   │   ├── hooks.js           # 历史相关自定义 Hooks
│   │   │   └── index.js           # 统一导出
│   │   ├── ApiKeyContext.js  # API 密钥、多密钥切换、钱包余额
│   │   ├── FavoritesContext.js # 收藏模型管理
│   │   ├── AppContext.js     # 组合 Provider + activeTab 导航状态
│   │   ├── ThemeContext.js   # 亮/暗主题，持久化 AsyncStorage，提供 colors + theme
│   │   └── ToastContext.js   # 全局 Toast 通知管理（自动消失 + 手动关闭）
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js    # 主页（useReducer + expo-image + Pressable + KeyboardAvoidingView）
│   │   ├── home/            # 主页子模块
│   │   │   ├── homeReducer.js  # reducer + initialState + MODE_LABELS + dispatch helpers
│   │   │   └── useHomeSubmit.js # 提交逻辑自定义 Hook（表单校验 + API 调用 + 错误处理）
│   │   ├── history/         # 历史页子模块
│   │   │   ├── HistoryScreen.js  # 历史页（FlatList 分页 + 筛选 + 批量操作）
│   │   │   ├── HistoryCard.js    # 历史卡片（React.memo + DurationDisplay 独立定时器）
│   │   │   └── DurationDisplay.js # 运行时长显示组件
│   │   ├── webapp/          # AI 应用子模块
│   │   │   ├── WebappScreen.js   # AI 应用（field_type 驱动参数渲染：combo/slider/number/hidden/string）
│   │   │   ├── WebappListItem.js # 应用列表项（React.memo）
│   │   │   ├── storage.js        # Webapp 本地存储
│   │   │   └── utils.js          # Webapp 工具函数
│   │   └── ModelSelectScreen.js # 模型选择（FlatList 虚拟化 + ModelCard memo + 左侧分类栏）
│   ├── components/           # UI 组件（按功能分组，共 30 个）
│   │   │
│   │   │ # 参数控件（params/，12 个，由 HomeParamControls.js 按 paramType 路由分发）
│   │   ├── params/
│   │   │   ├── HomeParamControls.js   # paramType 路由分发入口
│   │   │   ├── ParamControls.js       # 图片模型参数（6 种：分辨率/比例/画质/数量/去水印/种子）
│   │   │   ├── VideoParamControls.js  # 视频模型参数（10 种，Switch 用 Pressable 包裹）
│   │   │   ├── LLMControls.js         # LLM 参数（温度/MaxTokens/Thinking/Speed）
│   │   │   ├── VisionParamControls.js # 视觉理解参数
│   │   │   ├── TTSControls.js         # TTS 参数（音色选择/语速/情感/音量）
│   │   │   ├── AceStepControls.js     # AceStep 模型专用参数
│   │   │   ├── BirefnetControls.js    # Birefnet 背景移除模型专用参数
│   │   │   ├── FluxKleinControls.js   # Flux Klein 模型专用参数
│   │   │   ├── KontextLoraControls.js # Kontext LoRA 模型专用参数
│   │   │   ├── Seedvr2Controls.js     # SeedVR2 视频修复模型专用参数
│   │   │   └── ParamLabel.js          # 参数标签组件（标题 + 说明文本）
│   │   │
│   │   │ # 媒体组件（media/，4 个）
│   │   ├── media/
│   │   │   ├── ImageViewer.js     # 图片预览（PanResponder 双指缩放 + 左右划切换 + 下载）
│   │   │   ├── VideoPlayer.js     # 视频播放（expo-video）
│   │   │   ├── AudioPlayer.js     # 音频播放（expo-audio，带进度条）
│   │   │   └── UploadCard.js      # 上传卡片（文件/图片/视频/音频，带预览 + 进度提示）
│   │   │
│   │   │ # 布局组件（layout/，5 个）
│   │   ├── layout/
│   │   │   ├── AppHeader.js           # 共享头部组件（用户信息/余额/主题切换/密钥）
│   │   │   ├── ApiKeyDropdown.js      # 密钥管理下拉（多密钥切换 + 余额显示）
│   │   │   ├── FavoriteModelsLayer.js # 收藏模型浮层（Modal + FlatList）
│   │   │   ├── Toast.js               # Toast 通知组件（成功/错误/警告/信息，自动消失）
│   │   │   └── ErrorBoundary.js       # 错误边界（React Error Boundary 包裹子组件）
│   │   │
│   │   │ # 通用组件（common/，5 个）
│   │   ├── common/
│   │   │   ├── DropdownModal.js     # 浮层下拉 Modal（对齐触发按钮的上拉面板）
│   │   │   ├── PickerModal.js       # 居中选择器 Modal（带标题的选项列表）
│   │   │   ├── ResizableTextInput.js  # 自适应输入框（多行，跟随内容撑高）
│   │   │   ├── TextResultView.js      # 文本结果展示（复制按钮 + 滚动查看）
│   │   │   └── MarkdownRenderer.js    # Markdown 渲染（react-native-markdown-display）
│   │   │
│   │   │ # 页面辅助组件（4 个，仍在 components/ 根层级）
│   │   ├── HistoryFilters.js      # 历史筛选（类型/状态/日期多条件筛选）
│   │   ├── HistoryModals.js       # 历史弹窗（日志查看 / 详情 / 操作确认）
│   │   ├── ModelSelector.js       # 模型选择器（首页顶部下拉按钮）
│   │   ├── NetworkStatusBar.js    # 网络状态栏（离线时顶部红色提示条）
│   │   └── ParamPresetBar.js      # 参数预设栏（保存/加载/删除参数预设）
│   ├── constants/            # 常量定义
│   │   ├── models.js         # MODELS 对象 + paramType + re-export（向后兼容）
│   │   ├── pricing.js        # 价格常量 + 计算函数
│   │   ├── modelMeta.js      # CATEGORIES / MANUFACTURERS / FAVORITES_MAX_COUNT
│   │   ├── apiConfig.js      # API 端点 + 超时配置
│   │   ├── storageKeys.js    # AsyncStorage 键名
│   │   ├── uiConstants.js    # UI 常量
│   │   ├── theme.js          # Design Token：Radius / Spacing / Typography / Shadow / ButtonVariants / STATUS_COLORS
│   │   ├── sharedStyles.js   # 跨组件共享样式（pressedOpacity / 通用布局）
│   │   └── ratios.js         # 图片比例预设（1:1 / 4:3 / 16:9 等）
│   ├── hooks/                # 自定义 Hooks（7 个）
│   │   ├── useFileUpload.js      # 文件上传（选文件 → OSS 直传 → commitResource，含进度/取消/错误）
│   │   ├── useThemedStyles.js    # 主题响应式样式工厂（createStyles + useMemo）
│   │   ├── useDownload.js        # 文件下载 Hook（expo-file-system + MediaLibrary）
│   │   ├── useModelSwitch.js     # 模型切换 Hook（模型选择 + 参数重置）
│   │   ├── useFormValidation.js  # 表单校验 Hook（提示词/图片/首尾帧/视频等校验）
│   │   ├── useNetworkStatus.js   # 网络状态 Hook（NetInfo 监听连接/可达性）
│   │   └── usePresets.js         # 参数预设 Hook（保存/加载/删除预设，AsyncStorage 持久化）
│   ├── utils/                # 纯函数工具（5 个）
│   │   ├── modelHelpers.js   # 价格计算 / 模型过滤 / 参数默认值
│   │   ├── payloadBuilder.js # 参数映射（camelCase → snake_case）+ 请求体构建
│   │   ├── helpers.js        # 通用辅助函数（时间格式化 / 字符串处理）
│   │   ├── download.js       # 文件下载（expo-file-system + MediaLibrary）
│   │   └── resultCache.js    # 结果缓存（expo-file-system OOP API，按 historyId 缓存）
│   └── services/             # API 服务层
│       ├── httpClient.js     # 核心 HTTP 请求（15s 超时 / 指数退避重试 / 错误分类）
│       ├── taskApi.js        # 任务 API（提交/查询/取消）
│       ├── uploadApi.js      # 上传 API（OSS STS 凭证 + 直传 + 确认）
│       ├── userApi.js        # 用户 API（余额查询）
│       ├── webappApi.js      # AI 应用 API（Combo 列表/详情）
│       └── apiClient.js      # 统一入口（re-export，向后兼容）
├── assets/                   # 图标资源
├── reference/                # 参考文档（API 文档 / 构建指南）
├── apk/                      # 构建产物（APK 安装包）
├── keystore-backup/          # 签名密钥备份
└── .env.example              # 环境变量模板（EXPO_PUBLIC_BIZYAIR_API_KEY）
```

## 设计体系（Design System）

> UI 设计规范已迁移至 [Design.md](./Design.md)，包含：设计原则、设计令牌（色彩/圆角/间距/排版/阴影/按钮）、主题系统（亮/暗色板）、交互反馈规范、共享样式、组件规范、常见 UI 模式、性能优化、UI 组件检查清单。

## 代码生成规则
- 新建文件严格按上述目录存放，文件名使用 kebab-case
- **关注点分离**：组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数
- 修改和新增功能优先复用现有模块
- 修改代码时遵循最小改动原则，尽量保持原有接口不变
- 单文件有效代码行数（不含空行/注释）不得超过 **800 行**，*新建代码文件*或*修改后的代码文件* 预估超 **700 行** 时即拆分为多个文件
- **UI 设计相关规则**（Design Token / 主题响应式 / ErrorBoundary / Pressable 反馈 / React.memo 等）详见 [Design.md](./Design.md)

## 架构概览

### Provider 链与路由
```
expo-router entry → app/_layout.js
SafeAreaProvider → ThemeProvider → AppProvider → ToastProvider → Stack
AppProvider = ApiKeyProvider → HistoryProvider → FavoritesProvider
```
- `ThemeProvider` — 亮/暗主题（`useTheme()`），持久化到 AsyncStorage。
- `ApiKeyProvider` — API 密钥、多密钥切换、钱包余额（`useApiKeyContext()`）。
- `HistoryProvider` — 历史记录、轮询、homeState（`useHistoryContext()`），位于 `src/context/history/`。
- `FavoritesProvider` — 收藏模型管理（`useFavoritesContext()`）。
- `AppProvider` — 组合以上四个 Provider + activeTab 导航状态。
- `ToastProvider` — 全局 Toast 通知（自动消失 3s + 手动关闭），通过 `ToastContext` 暴露 `showToast(message, type)`。
- 路由：expo-router 文件路由，`(tabs)/` 组提供三标签导航，`model-select` 提供 Modal 路由。

### 任务提交 → 轮询 → 结果
1. 用户在 `HomeScreen` 选模型、填参数，点击生成。
2. `params/HomeParamControls.js` 根据模型的 `paramType` 路由到对应控件组件渲染表单。
3. `useFormValidation` 校验必填项（提示词/图片/首尾帧/视频等），不通过则 Toast 提示。
4. `payloadBuilder.js` 将前端 camelCase 参数映射为 API snake_case 请求体。
5. `taskApi.js` 调用 `submitTask()` 提交，返回 `requestId`。
6. `HistoryProvider` 添加历史记录（Pending/Running），`startPolling()` 每 3 秒轮询状态。
7. 轮询成功后提取输出 URL，`resultCache.js` 缓存结果文件到本地；连续 5 次失败标记 Failed。启动时 `resumeRunningPolling()` 自动恢复。

### paramType 驱动
`constants/models.js` 中每个模型定义 `paramType`，驱动三处逻辑：

| 层面 | 实现位置 | 说明 |
|:---|:---|:---|
| 参数表单 | `params/HomeParamControls.js` → 按 paramType 分发到 5 类控件组件 | 图片类（6 种）、视频类（10 种）、LLM、Vision、TTS |
| 请求体构建 | `payloadBuilder.js` switch-case | 每类 paramType 一个 case |
| 价格计算 | `modelHelpers.js` `calculatePrice()` | 固定/分辨率/时长/像素/token 等策略 |

### 文件上传
1. `useFileUpload` → `DocumentPicker` 选本地文件
2. `uploadApi.js` → `getUploadToken()` 获取 OSS STS 临时凭证
3. jssha HMAC-SHA1 签名 → PUT 直传阿里云 OSS
4. `uploadApi.js` → `commitResource()` 通知服务端确认

### API 请求封装
`httpClient.js` 的 `request()` 统一封装：15 秒超时（AbortController）、指数退避重试（最多 3 次）、错误分类（超时/服务端/客户端）。`apiClient.js` 作为统一入口 re-export 各子模块，保持向后兼容。

### 网络状态检测
`useNetworkStatus` Hook 基于 `@react-native-community/netinfo` 监听网络连接状态，`NetworkStatusBar` 组件在离线时显示顶部红色提示条。轮询失败后网络恢复时自动续轮（`resumeRunningPolling()`）。

### 参数预设
`usePresets` Hook 提供参数预设的保存/加载/删除功能，持久化到 AsyncStorage（键名 `bizyair_param_presets`，上限 20 条）。`ParamPresetBar` 组件提供 UI 入口，按 `modelId + mode` 过滤预设。

### 结果缓存
`resultCache.js` 基于 expo-file-system OOP API（File/Paths），按 `historyId + index` 缓存结果文件到 `{document}/bizyair_results/` 目录，避免重复下载远程结果。

### 常见 UI 模式
> 详见 [Design.md — 常见 UI 模式](./Design.md#7-常见-ui-模式)

## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示
- 用户可见的错误信息通过 `ToastContext.showToast(message, 'error')` 统一展示
- 每个页面级组件应包裹 `ErrorBoundary`（`src/components/layout/ErrorBoundary.js`），防止单组件崩溃白屏
- 轮询失败处理：连续 5 次轮询失败 → 标记 Failed；网络恢复后 `resumeRunningPolling()` 自动续轮

## 性能优化要点
> UI 相关性能优化详见 [Design.md — 性能优化](./Design.md#8-性能优化ui-相关)

## 新增模型检查清单
添加新模型时需同步修改：
1. `src/constants/models.js` — `MODELS` 对象中添加模型配置（paramType、modes）
2. `src/constants/pricing.js` — 添加价格常量和计算函数（若新计费方式）
3. `src/constants/modelMeta.js` — `MODEL_MANUFACTURERS` 映射中添加条目
4. `src/components/params/` — 若新的 paramType，创建控件组件并在 `HomeParamControls.js` 中添加 import + case 分支；若复用已有 paramType 则跳过
5. `src/utils/payloadBuilder.js` — 若新的 paramType，添加 switch-case
6. `src/utils/modelHelpers.js` — 若新计费方式，添加计算函数
7. `src/screens/home/homeReducer.js` — `initialState` 中添加模型的默认参数值；若参数较多，考虑按 paramType 拆分初始状态

## 新增 UI 组件检查清单
> 详见 [Design.md — UI 组件检查清单](./Design.md#9-ui-组件检查清单)

## 构建（Build）
- `scripts/build-android.ps1` 自动执行：版本号递增 → 签名密钥备份/恢复 → expo prebuild → patch-android-build.ps1 修补 → Gradle 构建 → 产物验证 → 复制到 apk/ 目录
- `scripts/patch-android-build.ps1` 修补内容：ProGuard 规则、gradle.properties 配置、AndroidManifest allowBackup=false、build.gradle 签名注入和 APK 命名
