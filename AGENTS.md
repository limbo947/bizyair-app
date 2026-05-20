# AGENTS.md

## 技术栈与版本
- Expo SDK 54，参考文档：https://docs.expo.dev/versions/v54.0.0/
- React Native 新架构默认启用
- 目标架构：Android arm64-v8a

## 项目结构
```
├── App.js
├── api.js                    # API 兼容层（重新导出）
├── src/
│   ├── constants/            # 常量定义（模型配置、API 常量）
│   ├── utils/                # 纯工具函数（价格计算、请求体构建）
│   ├── services/             # API 服务层（任务提交、轮询、上传）
│   └── components/           # UI 组件
├── assets/                   # 图标等静态资源
└── bizyair.api.reference/    # BizyAir 各模型 API 文档
```

## 代码生成规则
- 新建文件严格按上述目录存放
- 组件不写 API 调用，服务文件不写 UI 代码，常量文件不定义函数
- 文件名使用 kebab-case
- 修改已有功能优先复用现有模块
- 单文件有效代码行数（不含空行/注释）不得超过 **300 行**，新文件预估超 250 行时即拆分为多个文件

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