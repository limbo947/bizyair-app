# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# BizyAir API Reference 命名说明

`bizyair.api.reference/` 目录存放 BizyAir 平台各模型的 API 文档，命名规则如下：

- **文件夹名** = 模型 ID（如 `bza-image-b2-base`）
- **文件名** = 接口类型（如 `text-to-image.md`、`image-to-image.md`）
- 已接入应用的模型，文件名追加 `[已接入]` 标记
  - 文件：`text-to-image[已接入].md`
- 若文件夹内所有文件均已接入，则文件夹名也标记 `[已接入]`
  - 文件夹：`bza-image-b2-base[已接入]`
- 未标记的表示尚未接入
