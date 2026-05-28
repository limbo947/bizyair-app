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
- Expo SDK 54，参考文档：https://docs.expo.dev/versions/v54.0.0/
- React Native 0.81.5 + React 19，Hermes 引擎 + 新架构（New Arch）默认启用
- 目标架构：Android arm64-v8a / Web
- expo-router 文件路由（原生 Tab 导航 + Modal 路由）
- expo-image（替代 RN Image，内存/磁盘双缓存）
- expo-file-system OOP API（File/Paths，替代 legacy downloadAsync）
- AsyncStorage 本地存储，expo-av 音频播放，react-native-markdown-display Markdown 渲染
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
├── package-lock.json         # 依赖锁定
├── app.json                  # Expo 配置（scheme: bizyair）
├── eas.json                  # EAS Build 配置
├── build-android.ps1         # APK 一键构建脚本（prebuild → 修补 → Gradle）
├── scripts/                  # 构建辅助脚本
│   └── patch-android-build.ps1  # post-prebuild 配置修补（签名/ProGuard/allowBackup）
├── src/
│   ├── context/              # 全局状态管理
│   │   ├── ApiKeyContext.js  # API 密钥、多密钥切换、钱包余额
│   │   ├── HistoryContext.js # 历史记录、轮询、homeState
│   │   ├── FavoritesContext.js # 收藏模型管理
│   │   ├── AppContext.js     # 组合 Provider（ApiKey → History → Favorites）+ activeTab
│   │   └── ThemeContext.js   # 亮/暗主题
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js    # 主页（useReducer 68 action types + expo-image + Pressable）
│   │   ├── HistoryScreen.js # 历史（HistoryCard memo + DurationDisplay 独立定时器 + FlatList）
│   │   ├── ModelSelectScreen.js # 模型选择（FlatList 虚拟化 + Pressable）
│   │   └── WebappScreen.js  # AI 应用
│   ├── components/           # UI 组件（21 个，按功能拆分）
│   │   ├── HomeParamControls.js  # paramType 路由分发
│   │   ├── VideoParamControls.js # 视频模型参数（10 种，Switch 用 Pressable 包裹）
│   │   ├── ParamControls.js      # 图片模型参数（6 种）
│   │   ├── LLMControls.js        # LLM 参数
│   │   ├── VisionParamControls.js # 视觉理解参数
│   │   ├── TTSControls.js        # TTS 参数
│   │   ├── ImageViewer.js        # 图片预览（PanResponder 双指缩放 + 左右划切换）
│   │   ├── ModelSelector.js      # 模型选择器
│   │   ├── FavoriteModelsLayer.js # 收藏模型浮层
│   │   ├── ApiKeyDropdown.js     # 密钥管理下拉
│   │   ├── UserInfoCard.js       # 用户信息卡片
│   │   ├── HistoryFilters.js     # 历史筛选
│   │   ├── HistoryModals.js      # 历史弹窗
│   │   ├── VideoPlayer.js        # 视频播放
│   │   ├── AudioPlayer.js        # 音频播放
│   │   ├── MarkdownRenderer.js   # Markdown 渲染
│   │   ├── TextResultView.js     # 文本结果展示
│   │   ├── ResizableTextInput.js # 自适应输入框
│   │   ├── StatusBadge.js        # 状态徽章
│   │   ├── ErrorBoundary.js      # 错误边界
│   │   └── TabBar.js             # 已被 expo-router 替代，保留未删除
│   ├── constants/            # 常量定义（models / modelMeta / ratios / theme）
│   ├── hooks/                # 自定义 Hooks（useFileUpload / useThemedStyles）
│   ├── utils/                # 工具函数（modelHelpers / payloadBuilder / helpers）
│   └── services/             # API 服务层（apiClient）
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
SafeAreaProvider → ThemeProvider → AppProvider → Stack
AppProvider = ApiKeyProvider → HistoryProvider → FavoritesProvider
```
- `ThemeProvider` — 亮/暗主题（`useTheme()`），持久化到 AsyncStorage。
- `ApiKeyProvider` — API 密钥、多密钥切换、钱包余额（`useApiKeyContext()`）。
- `HistoryProvider` — 历史记录、轮询、homeState（`useHistoryContext()`）。
- `FavoritesProvider` — 收藏模型管理（`useFavoritesContext()`）。
- `AppProvider` — 组合以上三个 Provider + activeTab 导航状态。
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

## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示

## 新增模型检查清单
添加新模型时需同步修改：
1. `src/constants/models.js` — `MODELS` 对象中添加模型配置（paramType、modes、prices/priceCalculator）
2. `src/constants/modelMeta.js` — `MODEL_MANUFACTURERS` 映射中添加条目
3. `src/components/HomeParamControls.js` — 若新的 paramType，添加 import + case 分支
4. `src/utils/payloadBuilder.js` — 若新的 paramType，添加 switch-case
5. `src/utils/modelHelpers.js` — 若新计费方式，添加计算函数
6. `src/components/` — 若新参数控件，创建组件并在 `HomeParamControls.js` 中引入

## 构建（Build）
- *用户明确要构建apk时*，阅读参考文档 `reference\apk-build-reference.md`
- `build-android.ps1` 自动执行：版本号递增 → 签名密钥备份/恢复 → expo prebuild → patch-android-build.ps1 修补 → Gradle 构建 → 产物验证 → 复制到 apk/ 目录
- `patch-android-build.ps1` 修补内容：ProGuard 规则、gradle.properties 配置、AndroidManifest allowBackup=false、build.gradle 签名注入和 APK 命名
