# BizyAir AI 图片生成 App

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

由于 Expo 开发服务器在沙箱环境下受限，使用静态导出 + serve 方式：

```bash
npx expo export --platform web
npx serve dist -l 3000
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

- **文生图**：输入提示词，选择参数，一键生成
- **图生图**：上传参考图片 + 提示词，修改或扩展图片（支持多张上传）
- **异步任务模式**：提交后立即加入历史列表，后台轮询状态（排队中 → 生成中 → 转存中 → 完成/失败）
- **动态价格计算**：根据模型和参数实时计算金币消耗，显示在生成按钮上
- **5 种参数类型**：resolution-ratio / width-height-quality / size-only / wan-size / width-height，UI 自适应渲染
- **图片上传**：通过阿里云 OSS STS 凭证直传，支持选择本地文件
- **历史记录**：显示真实分辨率（如 2048×1536）、金币消耗、任务状态
- **日志查看**：每条记录可查看最后一次 API 响应的完整 JSON
- **API 密钥管理**：支持 .env 配置和运行时输入两种方式

## 技术栈

- React Native (Expo SDK 54)
- AsyncStorage 本地存储
- BizyAir OpenAPI（异步任务模式）
- 阿里云 OSS 直传（HMAC-SHA1 签名）

## 项目结构

```
├── api.js              # API 层：模型配置、任务提交/轮询、OSS上传、价格计算
├── App.js              # 主界面：模型选择、参数面板、历史列表、日志弹窗
├── index.js            # 入口文件
├── assets/             # 图标资源
├── bizyair.api.reference/  # BizyAir 各模型 API 文档
└── .env.example        # 环境变量模板
```