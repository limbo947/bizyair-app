# Bizyair Assistant

基于 Expo SDK 54 的多模态 AI 助手，接入 BizyAir 平台 29 个模型，覆盖文生图、图生图、文生视频、图生视频、首尾帧、参考视频、视频编辑、视频延长、大语言模型、视觉理解、语音合成等 11 种功能模式。

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置 API 密钥
复制 `.env.example` 为 `.env`，填入你的 Bizyair API Key：
```bash
cp .env.example .env
# 编辑 .env，填入 EXPO_PUBLIC_BIZYAIR_API_KEY=你的密钥
```

也可以直接在 App 内输入密钥（运行时保存到本地）。

### 3. 启动 Web 预览

```bash
npx expo start --web --port 8081
```

或使用静态导出：
```bash
npx expo export --platform web
npx serve dist -l 3000
```

### 4. 构建 APK

**一键构建（推荐）：**
```powershell
.\build-android.ps1 -Clean
```
该脚本自动执行：prebuild → 配置修补 → 签名注入 → Gradle 构建 → 产物验证（arm64-v8a）

**仅增量构建（跳过 prebuild）：**
```bash
cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

**EAS Build（兜底方案）：**
```bash
npx eas build --platform android --profile preview --local
```

## 功能

### 已接入模型（29 个）

#### 图片模型（10 个）

| 模型 | 厂商 | 功能模式 |
|:---|:---|:---|
| B.2 渠道版 | 谷歌 | 文生图、图生图 |
| B.2 官方版 | 谷歌 | 文生图、图生图 |
| B.Pro 渠道版 | 谷歌 | 文生图、图生图 |
| B.Pro 官方版 | 谷歌 | 文生图、图生图 |
| O.2 渠道版 | OpenAI | 文生图、图生图 |
| O.2 官方版 | OpenAI | 文生图、图生图 |
| Seedream 5.0 | 字节 | 文生图、图生图 |
| 万相2.7 | 阿里 | 文生图、图生图 |
| 万相2.7 Pro | 阿里 | 文生图、图生图 |
| Z-Image Turbo | 硅基流动 | 文生图 |

#### 视频模型（13 个）

| 模型 | 厂商 | 功能模式 |
|:---|:---|:---|
| Seedance 2.0 / 渠道版 | 字节 | 文生视频、首尾帧、参考视频 |
| Seedance 2.0 Fast / 渠道版 | 字节 | 文生视频、首尾帧、参考视频 |
| 可灵 3.0 Pro / Std | 快手 | 文生视频、首尾帧 |
| 可灵 O3 Pro / Std | 快手 | 文生视频、首尾帧 |
| 可灵 O3 4K | 快手 | 参考视频 |
| Vidu Q3 Pro / Turbo（官方/渠道） | 生数 | 文生视频、图生视频、首尾帧 |
| 万相 2.7 | 阿里 | 文生视频、图生视频、参考视频、视频编辑 |
| 万相 2.5 / 2.6 | 阿里 | 图生视频 |
| 海螺 2.3 / Fast | MiniMax | 文生视频、图生视频 |
| HappyHorse 1.0 | — | 文生视频、图生视频、参考视频、视频编辑 |
| LTX 2.3 | 硅基流动 | 文生视频、图生视频 |
| Video X / V3.1 | xAI/Google | 文生视频、图生视频等 |
| DreamActor 2.0 | 即梦 | 参考视频 |

#### 语言/视觉/语音模型（6 个）

| 模型 | 厂商 | 功能模式 |
|:---|:---|:---|
| G.3.1 Pro / Flash Lite / Flash | 谷歌 | 大语言模型（对话） |
| VisionG 3.1 Pro / Flash Lite / Flash | 谷歌 | 视觉理解 |
| JoyCaption3 | 硅基流动 | 图片描述 |
| Qwen3 TTS | 硅基流动 | 语音合成 |

### 核心能力

- **11 种功能模式**：文生图、图生图、文生视频、图生视频、首尾帧、参考视频、视频编辑、视频延长、大语言模型、视觉理解、语音合成
- **模型选择页**：按分类筛选，选择模型后自动切换到对应功能模式；支持收藏管理（最多 7 个）
- **系统提示词预设**：LLM 和视觉理解模型内置 6 个 Markdown 格式预设（200-300字），支持自定义新增/删除
- **暗色模式**：亮色/暗色主题一键切换，选择持久化
- **Markdown 渲染**：LLM/Vision 返回结果自动渲染为富文本（标题、列表、代码块等）
- **TTS 试听**：语音合成结果支持应用内在线播放（播放/暂停/进度跳转）
- **可调整输入框**：长文本输入框支持拖拽调整高度、一键清空
- **底部导航**：主页 / 历史 双标签切换，切换状态持久化，进行中任务角标显示
- **异步任务模式**：提交后立即加入历史列表，后台轮询状态（排队中 → 生成中 → 转存中 → 完成/失败）
- **动态价格计算**：根据模型和参数实时计算金币消耗，显示在生成按钮上
- **图片/视频上传**：通过阿里云 OSS STS 凭证直传，支持选择本地文件
- **历史记录**：搜索、筛选、排序、批量操作、分页加载、日志查看
- **API 密钥管理**：支持 .env 配置和运行时输入两种方式，多密钥切换
- **网络容错**：统一请求封装，超时（15s）+ 指数退避重试（最多 3 次）
- **任务恢复**：应用启动时自动检测生成中任务，恢复轮询

## 技术栈

- React Native (Expo SDK 54) + React 19
- Hermes 引擎 + 新架构（New Arch）
- AsyncStorage 本地存储
- BizyAir OpenAPI（异步任务模式）
- 阿里云 OSS 直传（HMAC-SHA1 签名）
- expo-av（音频播放）
- react-native-markdown-display（Markdown 渲染）
- 目标平台：Android arm64-v8a / Web

## 项目结构

```
├── App.js                    # 导航容器（ThemeProvider + AppProvider + AppNavigator）
├── index.js                  # 应用入口
├── api.js                    # API 兼容层（重新导出）
├── package.json              # 依赖配置
├── app.json                  # Expo 配置
├── eas.json                  # EAS Build 配置
├── build-android.ps1         # APK 一键构建脚本（prebuild → 修补 → Gradle）
├── scripts/                  # 构建辅助脚本
│   └── patch-android-build.ps1  # post-prebuild 配置修补（签名/ProGuard/allowBackup）
├── android/                  # Android 原生工程（expo prebuild 生成，勿手动修改）
│   ├── keystore.properties   # 签名密钥配置（不提交 Git）
│   ├── gradle.properties     # Gradle 构建属性
│   └── app/
│       ├── build.gradle      # 应用 Gradle 配置
│       └── src/main/java/com/bizyair/assistant/  # Kotlin 源码
├── src/
│   ├── context/              # 全局状态管理
│   │   ├── AppContext.js     # React Context（历史/密钥/轮询/用户信息/收藏）
│   │   └── ThemeContext.js   # 主题上下文（亮色/暗色切换，AsyncStorage 持久化）
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js     # 主页：模型选择、参数配置、生成、文本结果展示
│   │   ├── HistoryScreen.js  # 历史记录：搜索/筛选/排序/批量操作/分页
│   │   └── ModelSelectScreen.js  # 模型选择页：分类筛选、收藏管理、模式自动选择
│   ├── components/           # UI 组件
│   │   ├── TabBar.js         # 底部导航栏（带角标和切换动画）
│   │   ├── HomeParamControls.js  # 主页参数控件路由（按 paramType 分发）
│   │   ├── ParamControls.js  # 图片参数控制面板（5 种参数类型自适应）
│   │   ├── VideoParamControls.js # 视频参数控制面板（12 种视频参数类型）
│   │   ├── LLMControls.js    # LLM 参数控件（系统提示词预设/自定义/温度/思考/搜索）
│   │   ├── VisionParamControls.js # 视觉理解参数控件（预设/温度/细节/思考）
│   │   ├── TTSControls.js    # TTS 语音合成参数控件（语速/音色/格式）
│   │   ├── ResizableTextInput.js  # 可调整大小文本输入（清空按钮+拖拽手柄）
│   │   ├── MarkdownRenderer.js    # Markdown 富文本渲染组件
│   │   ├── AudioPlayer.js    # 音频播放器（expo-av，播放/暂停/进度跳转）
│   │   ├── VideoPlayer.js    # 视频预览播放器
│   │   ├── StatusBadge.js    # 任务状态徽章
│   │   ├── ModelSelector.js  # 模型选择器（按钮+下拉菜单）
│   │   ├── ApiKeyDropdown.js # API 密钥下拉浮窗（多密钥管理/切换/新增/删除）
│   │   ├── FavoriteModelsLayer.js  # 收藏模型浮层
│   │   ├── HistoryFilters.js # 历史记录筛选栏
│   │   ├── HistoryModals.js  # 历史记录弹窗
│   │   ├── TextResultView.js # 文本结果查看器
│   │   └── UserInfoCard.js   # 用户信息卡片
│   ├── constants/            # 常量定义
│   │   ├── models.js         # 29 个模型配置、价格计算、状态标签
│   │   ├── modelMeta.js      # 模型分类/厂商映射（MANUFACTURERS + CATEGORIES）
│   │   ├── theme.js          # 设计令牌（LightColors/DarkColors/createTheme/色彩/间距/圆角）
│   │   └── ratios.js         # 宽高比常量
│   ├── hooks/                # 自定义 Hooks
│   │   └── useFileUpload.js  # 文件上传逻辑（图片/视频选择 + OSS 直传）
│   ├── utils/                # 工具函数
│   │   ├── helpers.js        # 通用工具（generateId 等）
│   │   ├── modelHelpers.js   # 模型信息查询、价格计算、分辨率计算
│   │   └── payloadBuilder.js # API 请求体构建（按 paramType 分发）
│   └── services/             # API 服务层
│       └── apiClient.js      # 统一请求封装（超时+重试）、任务提交/轮询/OSS 上传
├── assets/                   # 图标资源
├── reference/                # 参考文档
│   └── bizyair.api.reference/  # BizyAir 平台 API 参考文档（按模型分类，38 个子目录）
└── .env.example              # 环境变量模板
```

## 当前分支

- `test03`
