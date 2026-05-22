# Bizyair Assistant

基于 Expo SDK 54 的图片生成应用，接入了 BizyAir 平台的 10 个图片生成模型，支持文生图和图生图两种模式。

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

### 已接入模型（10 个）

| 图标 | 模型 | 厂商 | 参数类型 |
|:---:|:---|:---|:---|
| 🍌 | B.2 渠道版 | 谷歌 | 分辨率 + 宽高比 |
| 🍌 | B.2 官方版 | 谷歌 | 分辨率 + 宽高比 |
| 🍌 | B.Pro 渠道版 | 谷歌 | 分辨率 + 宽高比 |
| 🍌 | B.Pro 官方版 | 谷歌 | 分辨率 + 宽高比 |
| 🤖 | O.2 渠道版 | OpenAI | 分辨率 + 宽高比 |
| 🤖 | O.2 官方版 | OpenAI | 宽高 + 质量 |
| 🌱 | Seedream 5.0 | 字节 | 尺寸 |
| 🌐 | 万相2.7 | 阿里 | 尺寸（含自定义宽高） |
| 🌐 | 万相2.7 Pro | 阿里 | 尺寸（含自定义宽高） |
| ⚡ | Z-Image Turbo | 硅基流动 | 自定义宽高 |

### 核心能力

- **底部导航**：主页 / 历史 双标签切换，切换状态持久化，进行中任务角标显示
- **文生图**：输入提示词，选择参数，一键生成
- **图生图**：上传参考图片 + 提示词，修改或扩展图片（支持多张上传）
- **模型选择**：独立模型选择页面，按分类（常用/文生图/图生图等）和厂商筛选，支持收藏管理（最多 7 个）
- **用户信息**：头像展示、余额查询、API 密钥运行时配置与管理
- **异步任务模式**：提交后立即加入历史列表，后台轮询状态（排队中 → 生成中 → 转存中 → 完成/失败）
- **动态价格计算**：根据模型和参数实时计算金币消耗，显示在生成按钮上
- **5 种参数类型**：resolution-ratio / width-height-quality / size-only / wan-size / width-height，UI 自适应渲染
- **图片上传**：通过阿里云 OSS STS 凭证直传，支持选择本地文件
- **历史记录**：
  - 显示真实分辨率、金币消耗、生成用时、任务状态
  - 搜索、筛选（按状态）、排序（时间/价格）
  - 批量操作：批量删除、批量下载
  - 单条下载、删除二次确认
  - 分页加载（无限滚动）
- **日志查看**：每条记录可查看最后一次 API 响应的完整 JSON
- **API 密钥管理**：支持 .env 配置和运行时输入两种方式
- **网络容错**：统一请求封装，超时（15s）+ 指数退避重试（最多 3 次）
- **任务恢复**：应用启动时自动检测生成中任务，恢复轮询

## 技术栈

- React Native (Expo SDK 54) + React 19
- Hermes 引擎 + 新架构（New Arch）
- AsyncStorage 本地存储
- BizyAir OpenAPI（异步任务模式）
- 阿里云 OSS 直传（HMAC-SHA1 签名）
- 目标平台：Android arm64-v8a

## 项目结构

```
├── App.js                    # 导航容器（AppProvider + AppNavigator）
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
│   │   └── AppContext.js     # React Context Provider + Hook（历史/密钥/轮询/用户信息/收藏）
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js     # 主页：模型选择、参数配置、图片生成
│   │   ├── HistoryScreen.js  # 历史记录：搜索/筛选/排序/批量操作/分页
│   │   └── ModelSelectScreen.js  # 模型选择页：分类/厂商筛选、收藏管理
│   ├── components/           # UI 组件
│   │   ├── TabBar.js         # 底部导航栏（带角标和切换动画）
│   │   ├── ParamControls.js  # 参数控制面板（5 种参数类型自适应）
│   │   ├── StatusBadge.js    # 任务状态徽章
│   │   ├── ModelSelector.js  # 模型选择器（按钮+下拉菜单）
│   │   ├── UserInfoCard.js   # 用户信息卡片（头像/余额/API密钥管理）
│   │   └── FavoriteModelsLayer.js  # 收藏模型浮层
│   ├── constants/            # 常量定义
│   │   ├── models.js         # 模型配置、状态标签、API/存储常量
│   │   ├── modelMeta.js      # 模型分类/厂商映射/收藏配置
│   │   ├── theme.js          # 设计令牌（色彩/间距/圆角/阴影）
│   │   └── ratios.js         # 宽高比常量
│   ├── utils/                # 工具函数
│   │   ├── helpers.js        # 通用工具（generateId 等）
│   │   ├── modelHelpers.js   # 模型信息、价格计算、分辨率计算
│   │   └── payloadBuilder.js # API 请求体构建
│   └── services/             # API 服务层
│       └── apiClient.js      # 统一请求封装（超时+重试）、任务提交/轮询/OSS 上传
├── assets/                   # 图标资源
├── bizyair.api.reference/    # BizyAir 平台 API 参考文档（按模型分类）
└── .env.example              # 环境变量模板
```

## 当前分支

- `test03`
