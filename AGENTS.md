# AGENTS.md

## 技术栈与版本
- Expo SDK 54，参考文档：https://docs.expo.dev/versions/v54.0.0/
- React Native 新架构默认启用
- 目标架构：Android arm64-v8a

## 项目结构
  *新增文件或修改文件后，及时更新本章节，保持与项目结构一致。*
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
├── src/
│   ├── context/              # 全局状态管理
│   ├── screens/              # 页面级组件
│   ├── components/           # UI 组件
│   ├── constants/            # 常量定义
│   ├── hooks/                # 自定义 Hooks
│   ├── utils/                # 工具函数
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

## 项目图标规则
- 优先从 @expo/vector-icons 图标库中选择图标
- 如果图标库中没有合适的图标，再考虑其他图标库（如 Material Icons、Feather Icons 等）

## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示

## 构建（Build）
- *用户明确要构建apk时*，阅读参考文档 `reference\apk-build-reference.md`