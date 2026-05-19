# AI 文生图 App - 一句话日记 + 文生图

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置 API 密钥
复制 `.env.example` 为 `.env`，填入你的 Bizyair API Key：
```bash
cp .env.example .env
# 然后编辑 .env，填入 EXPO_PUBLIC_BIZYAIR_API_KEY=你的密钥
```

或者直接在 App 内输入密钥（运行时保存到本地）。

### 3. 启动开发服务器
```bash
# Web 版本
npm run web

# 或者本地 Tunnel（手机测试）
npx expo start --tunnel
```

## 功能
- AI 文生图（Bizyair API）
- 提示词输入 + 分辨率 + 宽高比选择
- 生成历史记录保存
- API 密钥支持 .env 配置或运行时输入

## 技术栈
- React Native (Expo SDK 54)
- AsyncStorage 本地存储
