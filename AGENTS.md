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
│   ├── keystore.properties   # 签名密钥配置（不提交 Git）
│   ├── gradle.properties     # Gradle 构建属性（由 app.json 插件 + 修补脚本管理）
│   └── app/
│       ├── build.gradle      # 应用 Gradle 配置
│       └── src/main/java/com/bizyair/assistant/  # Kotlin 源码（MainActivity/MainApplication）
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
│   │   ├── HomeParamControls.js   # 主页参数控件路由（按 paramType 分发）
│   │   ├── ParamControls.js  # 图片参数控制面板（5 种参数类型自适应）
│   │   ├── VideoParamControls.js  # 视频参数控制面板（12 种视频参数类型）
│   │   ├── LLMControls.js    # LLM 参数控件（系统提示词预设/自定义/温度/思考/搜索）
│   │   ├── VisionParamControls.js # 视觉理解参数控件（预设/温度/细节/思考）
│   │   ├── TTSControls.js    # TTS 语音合成参数控件（语速/音色/格式）
│   │   ├── ResizableTextInput.js  # 可调整大小文本输入（清空按钮+拖拽手柄）
│   │   ├── MarkdownRenderer.js    # Markdown 富文本渲染组件
│   │   ├── AudioPlayer.js    # 音频播放器（expo-av，播放/暂停/进度跳转）
│   │   ├── VideoPlayer.js    # 视频预览播放器
│   │   ├── TextResultView.js # 文本结果查看器
│   │   ├── StatusBadge.js    # 任务状态徽章
│   │   ├── ModelSelector.js  # 模型选择器（按钮+下拉菜单）
│   │   ├── ApiKeyDropdown.js # API 密钥下拉浮窗（多密钥管理/切换/新增/删除）
│   │   ├── FavoriteModelsLayer.js  # 收藏模型浮层
│   │   ├── HistoryModals.js  # 历史记录弹窗（预览/日志/删除确认/排序）
│   │   ├── HistoryFilters.js # 历史记录筛选栏（搜索/筛选/批量/统计）
│   │   └── UserInfoCard.js   # 用户信息卡片
│   ├── constants/            # 常量定义
│   │   ├── models.js         # 29 个模型配置、价格计算、状态标签
│   │   ├── modelMeta.js      # 模型分类/厂商映射（MANUFACTURERS + CATEGORIES）
│   │   ├── theme.js          # 设计令牌（LightColors/DarkColors/createTheme/色彩/间距/圆角）
│   │   └── ratios.js         # 宽高比常量
│   ├── hooks/                # 自定义 Hooks
│   │   └── useFileUpload.js  # 文件上传逻辑（图片/视频选择+OSS上传）
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

## 代码生成规则
- 新建文件严格按上述目录存放
- 组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数
- 文件名使用 kebab-case
- 修改已有功能优先复用现有模块
- 修改代码时遵循最小改动原则，尽量保持原有接口不变
- 单文件有效代码行数（不含空行/注释）不得超过 **800 行**，*新建代码文件*或*修改后的代码文件* 预估超 **700 行** 时即拆分为多个文件

## BizyAir API 目录规范
- `reference\bizyair.api.reference/` 下按模型 ID 建文件夹，文件名对应接口类型
- 已接入应用的功能，文件名末尾追加 `[已接入]`
- 目录内全部接入后，目录名也标记 `[已接入]`

## 项目图标规则
- 从 @expo/vector-icons 图标库中选择图标

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