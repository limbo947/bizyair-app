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
├── package.json              # 依赖配置（main: expo-router/entry）
├── package-lock.json         # 依赖锁定
├── app.json                  # Expo 配置（scheme: bizyair）
├── eas.json                  # EAS Build 配置
├── scripts/                  # 构建辅助脚本
│   ├── build-android.ps1     # APK 一键构建脚本（prebuild → 修补 → Gradle）
│   ├── patch-android-build.ps1  # post-prebuild 配置修补（签名/ProGuard/allowBackup）
│   └── upload-proxy.mjs     # Web 端文件上传代理（OSS STS 签名，端口 3001）
├── src/
│   ├── context/              # 全局状态管理
│   │   ├── history/          # 历史记录子模块
│   │   │   ├── contexts.js   # Context 创建 + 工具函数（extractTaskResult/extractWebappResult）
│   │   │   ├── hooks.js      # useContext hooks（useHistoryListContext/useHomeStateContext/usePollingContext/useHistoryContext）
│   │   │   ├── HistoryProvider.js # Provider 逻辑（状态、轮询、回调）
│   │   │   └── index.js      # 统一导出
│   │   ├── ApiKeyContext.js  # API 密钥、多密钥切换、钱包余额
│   │   ├── FavoritesContext.js # 收藏模型管理
│   │   ├── AppContext.js     # 组合 Provider（ApiKey → History → Favorites）+ activeTab
│   │   ├── ThemeContext.js   # 亮/暗主题
│   │   └── ToastContext.js   # Toast 提示（showToast）
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js    # 主页（useReducer + expo-image + Pressable）
│   │   ├── home/            # 主页子模块
│   │   │   ├── homeReducer.js  # reducer + initialState + MODE_LABELS
│   │   │   └── useHomeSubmit.js # 提交逻辑自定义 Hook
│   │   ├── history/         # 历史页子模块
│   │   │   ├── HistoryScreen.js # 历史页（HistoryCard memo + DurationDisplay + FlatList）
│   │   │   ├── HistoryCard.js   # 历史卡片组件
│   │   │   └── DurationDisplay.js # 运行时长显示组件
│   │   ├── webapp/          # AI 应用子模块
│   │   │   ├── WebappScreen.js  # AI 应用页
│   │   │   ├── WebappListItem.js # 应用列表项组件
│   │   │   ├── utils.js     # 工具函数（parseApiCode/stripJsComments/getMediaType 等）
│   │   │   └── storage.js   # 存储逻辑（loadSavedApps/persistSavedApps）
│   │   └── ModelSelectScreen.js # 模型选择（FlatList 虚拟化 + ModelCard memo）
│   ├── components/           # UI 组件（按功能分组）
│   │   ├── params/          # 参数控件（12 个）
│   │   │   ├── HomeParamControls.js  # paramType 路由分发
│   │   │   ├── VideoParamControls.js # 视频模型参数（10 种）
│   │   │   ├── ParamControls.js      # 图片模型参数（6 种）
│   │   │   ├── LLMControls.js        # LLM 参数
│   │   │   ├── VisionParamControls.js # 视觉理解参数
│   │   │   ├── TTSControls.js        # TTS 参数
│   │   │   ├── AceStepControls.js    # ACE Step 参数
│   │   │   ├── BirefnetControls.js   # BiRefNet 参数
│   │   │   ├── FluxKleinControls.js  # Flux Klein 参数
│   │   │   ├── KontextLoraControls.js # Kontext LoRA 参数
│   │   │   ├── Seedvr2Controls.js    # SeedVR2 参数
│   │   │   └── ParamLabel.js         # 参数标签组件
│   │   ├── media/           # 媒体组件（4 个）
│   │   │   ├── ImageViewer.js   # 图片预览（PanResponder 双指缩放 + 左右划切换）
│   │   │   ├── VideoPlayer.js   # 视频播放（expo-video）
│   │   │   ├── AudioPlayer.js   # 音频播放（expo-audio）
│   │   │   └── UploadCard.js    # 文件上传卡片
│   │   ├── layout/          # 布局组件（5 个）
│   │   │   ├── AppHeader.js         # 共享头部（用户信息/余额/主题切换/密钥）
│   │   │   ├── FavoriteModelsLayer.js # 收藏模型浮层
│   │   │   ├── ApiKeyDropdown.js    # 密钥管理下拉
│   │   │   ├── Toast.js             # Toast 提示
│   │   │   └── ErrorBoundary.js     # 错误边界
│   │   ├── common/          # 通用组件（3 个）
│   │   │   ├── ResizableTextInput.js # 自适应输入框
│   │   │   ├── MarkdownRenderer.js   # Markdown 渲染
│   │   │   └── TextResultView.js     # 文本结果展示
│   │   ├── HistoryFilters.js     # 历史筛选
│   │   ├── HistoryModals.js      # 历史弹窗
│   │   └── ModelSelector.js      # 模型选择器
│   ├── constants/            # 常量定义
│   │   ├── models.js        # MODELS 对象定义 + re-export（向后兼容）
│   │   ├── pricing.js       # 价格常量 + 计算函数（calcO2Price/calcSeedancePrice 等）
│   │   ├── apiConfig.js     # API 端点 + 超时/重试配置
│   │   ├── storageKeys.js   # AsyncStorage 键名
│   │   ├── uiConstants.js   # UI 常量（分辨率/比例/状态标签/分页）
│   │   ├── modelMeta.js     # 模型厂商元数据
│   │   ├── ratios.js        # 图片比例常量
│   │   ├── theme.js         # 主题色定义
│   │   └── sharedStyles.js  # 共享样式
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useFileUpload.js  # 文件上传
│   │   ├── useThemedStyles.js # 主题样式
│   │   ├── useDownload.js    # 下载逻辑（handleDownload/handleBatchDownload）
│   │   └── useModelSwitch.js # 模型切换逻辑（switchToModel/modelStatesRef）
│   ├── utils/                # 工具函数
│   │   ├── helpers.js        # 通用工具
│   │   ├── modelHelpers.js   # 模型相关（价格计算等）
│   │   ├── payloadBuilder.js # 请求体构建
│   │   └── download.js       # 下载功能（triggerDownload/triggerBatchDownload）
│   └── services/             # API 服务层
│       ├── httpClient.js     # 核心 HTTP 请求函数（request，超时/重试）
│       ├── taskApi.js        # 任务提交/查询（submitTask/queryTaskResult）
│       ├── uploadApi.js      # 上传相关（getUploadToken/uploadImageFile 等）
│       ├── userApi.js        # 用户信息（fetchUserInfo/fetchWalletBalance）
│       ├── webappApi.js      # WebApp 相关（submitWebappTask/cancelWebappTask 等）
│       └── apiClient.js      # 统一入口（re-export 所有 API，向后兼容）
├── assets/                   # 图标资源
├── reference/                # 参考文档
└── .env.example              # 环境变量模板
```

## 代码生成规则
- 新建文件严格按上述目录存放
- 组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数
- 文件名使用 kebab-case
- 修改和新增功能优先复用现有模块
- 修改代码时遵循最小改动原则，尽量保持原有接口不变
- 单文件有效代码行数（不含空行/注释）不得超过 **800 行**，*新建代码文件*或*修改后的代码文件* 预估超 **700 行** 时即拆分为多个文件

## 架构概览

### Provider 链与路由
```
expo-router entry → app/_layout.js
SafeAreaProvider → ThemeProvider → AppProvider → ToastProvider → ErrorBoundary → Stack
AppProvider = AppContext.Provider → ApiKeyProvider → HistoryProvider → FavoritesProvider
```
- `ThemeProvider` — 亮/暗主题（`useTheme()`），持久化到 AsyncStorage。
- `AppProvider` — 组合 ApiKey/History/Favorites 三个 Provider + activeTab 导航状态（`useAppContext()`）。
- `ApiKeyProvider` — API 密钥、多密钥切换、钱包余额（`useApiKeyContext()`）。
- `HistoryProvider` — 历史记录、轮询、homeState（`useHistoryContext()`）。
- `FavoritesProvider` — 收藏模型管理（`useFavoritesContext()`）。
- `ToastProvider` — Toast 提示（`useToastContext()`），2 秒自动消失。
- `ErrorBoundary` — 捕获渲染错误，显示降级 UI。
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
`httpClient.js` 的 `request()` 统一封装：15 秒超时（AbortController）、指数退避重试（最多 3 次）、错误分类（超时/服务端/客户端）。`apiClient.js` 作为统一入口 re-export 所有 API 函数，保持向后兼容。

## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示

## 新增模型检查清单
添加新模型时需同步修改：
1. `src/constants/models.js` — `MODELS` 对象中添加模型配置（paramType、modes、prices/priceCalculator）
2. `src/constants/pricing.js` — 若新计费方式，添加价格常量和计算函数
3. `src/constants/modelMeta.js` — `MODEL_MANUFACTURERS` 映射中添加条目
4. `src/components/params/HomeParamControls.js` — 若新的 paramType，添加 import + case 分支
5. `src/utils/payloadBuilder.js` — 若新的 paramType，添加 switch-case
6. `src/utils/modelHelpers.js` — 若新计费方式，添加计算函数
7. `src/components/params/` — 若新参数控件，创建组件并在 `HomeParamControls.js` 中引入

## 构建（Build）
- *用户明确要构建apk时*，阅读参考文档 `reference\apk-build-reference.md`
- `scripts/build-android.ps1` 自动执行：版本号递增 → 签名密钥备份/恢复 → expo prebuild → patch-android-build.ps1 修补 → Gradle 构建 → 产物验证 → 复制到 apk/ 目录
- `patch-android-build.ps1` 修补内容：ProGuard 规则、gradle.properties 配置、AndroidManifest allowBackup=false、build.gradle 签名注入和 APK 命名
