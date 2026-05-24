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

## 技术栈与版本
- Expo SDK 54，参考文档：https://docs.expo.dev/versions/v54.0.0/
- React Native 0.81.5 + React 19，Hermes 引擎 + 新架构（New Arch）默认启用
- 目标架构：Android arm64-v8a / Web
- AsyncStorage 本地存储，expo-av 音频播放，react-native-markdown-display Markdown 渲染
- jssha（阿里云 OSS HMAC-SHA1 签名）

## 项目结构
  *新增文件或修改文件后，及时更新本章节，保持与项目结构一致。*
```
├── App.js                    # 导航容器（ThemeProvider + AppProvider + AppNavigator）
├── index.js                  # 应用入口
├── api.js                    # API 兼容层（重新导出 services/utils/constants 的公共接口）
├── package.json              # 依赖配置
├── app.json                  # Expo 配置
├── eas.json                  # EAS Build 配置
├── build-android.ps1         # APK 一键构建脚本（prebuild → 修补 → Gradle）
├── scripts/                  # 构建辅助脚本
│   └── patch-android-build.ps1  # post-prebuild 配置修补（签名/ProGuard/allowBackup）
├── android/                  # Android 原生工程（expo prebuild 生成，勿手动修改）
├── src/
│   ├── context/              # 全局状态管理（AppContext + ThemeContext）
│   ├── screens/              # 页面级组件（HomeScreen / HistoryScreen / ModelSelectScreen）
│   ├── components/           # UI 组件（20 个，按功能拆分）
│   ├── constants/            # 常量定义（models / modelMeta / ratios / theme）
│   ├── hooks/                # 自定义 Hooks（useFileUpload）
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
- 修改已有功能优先复用现有模块
- 修改代码时遵循最小改动原则，尽量保持原有接口不变
- 单文件有效代码行数（不含空行/注释）不得超过 **800 行**，*新建代码文件*或*修改后的代码文件* 预估超 **700 行** 时即拆分为多个文件

## 架构概览

### 组件层级与 Provider 链
```
SafeAreaProvider > ThemeProvider > AppProvider > AppNavigator
```
- `ThemeProvider` 提供亮/暗色主题（`useTheme()`），主题模式持久化到 AsyncStorage。
- `AppProvider` 管理全部业务状态（`useAppContext()`），包括 API 密钥、历史记录、主页状态、轮询、收藏等。
- `AppNavigator` 管理三个页面（Home / History / ModelSelect），通过状态切换而非 React Navigation，含淡入淡出动画。

### 数据流：任务提交 → 异步轮询 → 结果展示
1. 用户在 `HomeScreen` 选择模型、填写参数，点击生成。
2. `payloadBuilder.js` 根据模型的 `paramType` 将前端 camelCase 参数映射为 API snake_case 请求体。
3. `apiClient.js` 调用 `submitTask()` 提交到 BizyAir OpenAPI，返回 `requestId`。
4. `AppContext` 调用 `addToHistory()` 添加历史记录（状态 Pending/Running），并 `startPolling()` 每 3 秒轮询。
5. 轮询成功后更新历史条目状态为 Success/Failed，提取输出（image/video/audio/text URL）。
6. 应用启动时 `resumeRunningPolling()` 自动恢复未完成任务的轮询。连续 5 次轮询失败标记为 Failed。

### paramType 驱动的参数系统
每个模型在 `constants/models.js` 的 `MODELS` 对象中定义 `paramType`，决定了：
- 参数控件渲染（`ParamControls` / `VideoParamControls` / `LLMControls` / `VisionParamControls` / `TTSControls`）
- 请求体构建逻辑（`payloadBuilder.js` 的 switch-case）
- 价格计算方式（`modelHelpers.js` 的 `calculatePrice()`，支持固定价格、按分辨率、按时长、按像素、按 token 等多种策略）

当前 paramType 值：`resolution-ratio` | `width-height-quality` | `size-only` | `flux-kontext` | `wan-size` | `width-height` | `seedance-video` | `kling-video` | `kling-o3-4k` | `vidu-video` | `wan-video` | `wan-i2v` | `hailuo-video` | `happyhorse-video` | `ltx-video` | `bza-video-x` | `bza-video-v3` | `dreamactor` | `llm-chat` | `vision-g` | `joycaption` | `tts`

### 文件上传流程
1. `useFileUpload` hook 调用 `DocumentPicker` 选择本地文件。
2. `apiClient.getUploadToken()` 获取阿里云 OSS STS 临时凭证。
3. 使用 jssha 计算 HMAC-SHA1 签名，PUT 直传到 OSS。
4. `apiClient.commitResource()` 通知服务端确认上传。
5. 返回文件 URL 用于任务提交。

### API 请求封装
`apiClient.js` 的 `request()` 函数统一封装了：
- 15 秒超时（AbortController）
- 指数退避重试（最多 3 次，仅对超时/5xx/网络错误重试）
- 错误分类（超时 vs 服务端 vs 客户端）

### 导航与页面
- 底部 TabBar 切换 Home / History，状态持久化到 AsyncStorage。
- ModelSelectScreen 为全屏覆盖页面，按分类和厂商筛选模型，支持收藏（最多 7 个）。
- HistoryScreen 支持搜索、筛选、排序、批量操作、分页加载、日志查看。

## 项目图标规则
- 优先从 @expo/vector-icons 图标库中选择图标
- 如果图标库中没有合适的图标，再考虑其他图标库（如 Material Icons、Feather Icons 等）

## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示

## 新增模型检查清单
添加新模型时需同步修改：
1. `src/constants/models.js` — 在 `MODELS` 对象中添加模型配置（含 paramType、modes、prices/priceCalculator）
2. `src/constants/modelMeta.js` — 在 `MODEL_MANUFACTURERS` 映射中添加条目
3. `src/utils/payloadBuilder.js` — 如使用新 paramType，添加对应的 switch-case 分支
4. `src/utils/modelHelpers.js` — 如有新计费方式，添加计算函数
5. `src/components/` — 如需新参数控件，创建对应组件并在 HomeScreen 中集成
6. `api.js` — 如需导出新公共接口，在此添加重新导出

## 构建（Build）
- *用户明确要构建apk时*，阅读参考文档 `reference\apk-build-reference.md`
- `build-android.ps1` 自动执行：版本号递增 → 签名密钥备份/恢复 → expo prebuild → patch-android-build.ps1 修补 → Gradle 构建 → 产物验证 → 复制到 apk/ 目录
- `patch-android-build.ps1` 修补内容：ProGuard 规则、gradle.properties 配置、AndroidManifest allowBackup=false、build.gradle 签名注入和 APK 命名
