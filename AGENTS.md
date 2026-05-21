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
├── src/
│   ├── context/              # 全局状态管理
│   │   └── AppContext.js     # React Context Provider + Hook（历史/密钥/轮询）
│   ├── screens/              # 页面级组件
│   │   ├── HomeScreen.js     # 主页：模型选择、参数配置、图片生成
│   │   └── HistoryScreen.js  # 历史记录：搜索/筛选/排序/批量操作/分页
│   ├── components/           # UI 组件
│   │   ├── TabBar.js         # 底部导航栏（带角标和切换动画）
│   │   ├── ParamControls.js  # 参数控制面板（5 种参数类型自适应）
│   │   └── StatusBadge.js    # 任务状态徽章
│   ├── constants/            # 常量定义
│   │   ├── models.js         # 模型配置、状态标签、API/存储常量
│   │   └── ratios.js         # 宽高比常量
│   ├── utils/                # 工具函数
│   │   ├── modelHelpers.js   # 模型信息、价格计算、分辨率计算
│   │   └── payloadBuilder.js # API 请求体构建
│   └── services/             # API 服务层
│       └── apiClient.js      # 统一请求封装（超时+重试）、任务提交/轮询、OSS 上传
├── assets/                   # 图标资源
├── bizyair.api.reference/    # BizyAir 平台 API 文档（按模型分类）
└── .env.example              # 环境变量模板
```

## 代码生成规则
- 新建文件严格按上述目录存放
- 组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数
- 文件名使用 kebab-case
- 修改已有功能优先复用现有模块
- 单文件有效代码行数（不含空行/注释）不得超过 **500 行**，新文件预估超 250 行时即拆分为多个文件
- 修改代码时遵循最小改动原则，尽量保持原有接口不变

## BizyAir API 目录规范
- `bizyair.api.reference/` 下按模型 ID 建文件夹，文件名对应接口类型
- 已接入应用的功能，文件名末尾追加 `[已接入]`
- 目录内全部接入后，目录名也标记 `[已接入]`

## 禁止修改
- SDK 版本
- `eas.json` 中的构建配置

## 错误处理
- 所有 API 调用必须处理超时、重试和状态码
- 网络错误需区分超时、服务端错误、客户端错误，给出明确提示