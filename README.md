# Bizyair Assistant

基于 Expo SDK 54 的多模态 AI 助手，接入 BizyAir 平台 48 个模型，覆盖文生图、图生图、文生视频、图生视频、首尾帧、参考视频、视频编辑、视频延长、大语言模型、视觉理解、语音合成等 11 种功能模式。

## APK安装包
- https://github.com/limbo947/bizyair-app/releases/tag/apk

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
该脚本自动执行：版本递增 → prebuild → 配置修补 → 签名注入 → Gradle 构建 → 产物验证（arm64-v8a）

**仅增量构建（跳过 prebuild）：**
```powershell
cd android
$env:NODE_ENV = "production"
.\gradlew.bat assembleRelease "-PreactNativeArchitectures=arm64-v8a"
```

**EAS Build（兜底方案）：**
```bash
npx eas build --platform android --profile preview --local
```

## 功能


### 核心能力

- **11 种功能模式**：文生图、图生图、文生视频、图生视频、首尾帧、参考视频、视频编辑、视频延长、大语言模型、视觉理解、语音合成
- **模型选择页**：按分类/厂商筛选，选择模型后自动切换到对应功能模式；支持收藏管理
- **系统提示词预设**：LLM 和视觉理解模型内置 6 个 Markdown 格式预设（200-300字），支持自定义新增/删除
- **暗色模式**：亮色/暗色主题一键切换，选择持久化
- **Markdown 渲染**：LLM/Vision 返回结果自动渲染为富文本（标题、列表、代码块等）
- **TTS 试听**：语音合成结果支持应用内在线播放（播放/暂停/进度跳转）
- **底部导航**：主页 / 历史 双标签切换，切换状态持久化，进行中任务角标显示
- **异步任务模式**：提交后立即加入历史列表，后台轮询状态（排队中 → 生成中 → 转存中 → 完成/失败）
- **动态价格计算**：根据模型和参数实时计算金币消耗，显示在生成按钮上
- **图片/视频上传**：通过阿里云 OSS STS 凭证直传，支持选择本地文件
- **历史记录**：搜索、筛选、排序、批量操作、分页加载、日志查看
- **API 密钥管理**：支持 .env 配置和运行时输入两种方式，多密钥切换

## 技术栈

- React Native 0.81.5 (Expo SDK 54) + React 19
- Hermes 引擎 + 新架构（New Arch）
- AsyncStorage 本地存储（带数据校验防护）
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
├── build-android.ps1         # APK 一键构建脚本（版本递增 → prebuild → 修补 → Gradle）
├── scripts/
│   └── patch-android-build.ps1   # post-prebuild 配置修补（ProGuard、签名、APK命名）
├── src/
│   ├── context/              # 全局状态管理（AppContext、ThemeContext）
│   ├── screens/              # 页面组件（HomeScreen、HistoryScreen、ModelSelectScreen、WebappScreen）
│   ├── components/           # UI 组件（TabBar、VideoPlayer、AudioPlayer、MarkdownRenderer 等）
│   ├── constants/            # 常量定义（models、modelMeta、ratios、theme）
│   ├── hooks/                # 自定义 Hooks（useFileUpload、useThemedStyles）
│   ├── utils/                # 工具函数（helpers、modelHelpers、payloadBuilder）
│   └── services/             # API 服务层（apiClient）
├── assets/                   # 图标资源
├── reference/                # 参考文档（BizyAir API 参考等）
└── .env.example              # 环境变量模板
```
