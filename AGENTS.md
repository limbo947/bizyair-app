# AGENTS.md

## 技术栈与版本
- Expo SDK 54，参考文档：https://docs.expo.dev/versions/v54.0.0/
- React Native 新架构默认启用
- 目标架构：Android arm64-v8a

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
│   ├── gradle.properties     # Gradle 构建属性（由 app.json 插件 + 修补脚本管理）
│   └── app/
│       ├── build.gradle      # 应用 Gradle 配置
│       └── src/main/java/com/bizyair/assistant/  # Kotlin 源码（MainActivity/MainApplication）
├── src/
│   ├── context/              # 全局状态管理
│   │   └── AppContext.js     # React Context Provider + Hook（历史/密钥/轮询/用户信息）
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js     # 主页：模型选择、参数配置、图片生成
│   │   └── HistoryScreen.js  # 历史记录：搜索/筛选/排序/批量操作/分页
│   ├── components/           # UI 组件
│   │   ├── ModelSelector.js  # 模型选择器（按钮+下拉菜单）
│   │   ├── UserInfoCard.js   # 用户信息卡片（头像/余额/API密钥管理）
│   │   ├── TabBar.js         # 底部导航栏（带角标和切换动画）
│   │   ├── ParamControls.js  # 参数控制面板（5 种参数类型自适应）
│   │   └── StatusBadge.js    # 任务状态徽章
│   ├── constants/            # 常量定义
│   │   ├── models.js         # 模型配置、状态标签、API/存储常量
│   │   ├── theme.js          # 设计令牌（色彩/间距/圆角/阴影）
│   │   └── ratios.js         # 宽高比常量
│   ├── utils/                # 工具函数
│   │   ├── helpers.js        # 通用工具（generateId 等）
│   │   ├── modelHelpers.js   # 模型信息、价格计算、分辨率计算
│   │   └── payloadBuilder.js # API 请求体构建
│   └── services/             # API 服务层
│       └── apiClient.js      # 统一请求封装（超时+重试）、任务提交/轮询、OSS 上传
├── assets/                   # 图标资源
├── bizyair.api.reference/    # BizyAir 平台 API 参考文档（按模型分类）
└── .env.example              # 环境变量模板
```

## 代码生成规则
- 新建文件严格按上述目录存放
- 组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数
- 文件名使用 kebab-case
- 修改已有功能优先复用现有模块
- 单文件有效代码行数（不含空行/注释）不得超过 **800 行**，新文件预估超 700 行时即拆分为多个文件
- 修改代码时遵循最小改动原则，尽量保持原有接口不变

## BizyAir API 目录规范
- `bizyair.api.reference/` 下按模型 ID 建文件夹，文件名对应接口类型
- 已接入应用的功能，文件名末尾追加 `[已接入]`
- 目录内全部接入后，目录名也标记 `[已接入]`


## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示

## 构建（Build）
- **环境要求**：JDK 17+、Android SDK (build-tools 35+)
- **一键构建 Release APK**：
  ```
  .\build-android.ps1 -Clean
  ```
  该脚本执行：prebuild → 修补配置 → 签名注入 → Gradle 构建 → 产物验证
- **仅增量构建**（不重新 prebuild）：
  ```
  cd android && ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
  ```
- **EAS 本地构建**（兜底方案）：
  ```
  npx eas build --platform android --profile preview --local
  ```
- **签名密钥**：`android/app/bizyair-release.keystore`，密码配置在 `android/keystore.properties`（不提交 Git）

## 版本管理
- 语义版本：`app.json` → `expo.version`
- Android versionCode：`android/gradle.properties` → `android.versionCode`（默认 1）
- 版本递增（CLI 覆盖）：
  ```
  ./gradlew assembleRelease -Pandroid.versionCode=2
  ```

## 构建配置说明
- **唯一真实来源**：`app.json` 的 `expo-build-properties` 插件
- **修补脚本**：`scripts/patch-android-build.ps1` 在 prebuild 后应用插件不支持的配置
- **不要手动修改 `android/` 目录下的文件**（`expo prebuild --clean` 会销毁所有手动修改）