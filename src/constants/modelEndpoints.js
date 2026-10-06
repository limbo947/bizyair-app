/**
 * 模型端点注册表 —— 集中管理"官网端点 slug 与 MODELS key 不一致"的模型。
 *
 * 默认规则：请求端点 = `${modelId}/${mode}`（绝大多数模型如此，无需登记）。
 * 仅当官网端点 slug 与 key 不同时才在此登记覆盖：
 *   - 字符串形式：所有 mode 共用（单端点模型）
 *   - 对象形式：按 mode 映射（同一模型不同模式分属不同 slug）
 *
 * 新增/更换模型 API 时先查本表；官方文档参见 reference/bizyair.api.reference/。
 * 注意：部分官网 slug 本身拼写有误（如 wan-2-7-offcial），必须原样使用才能调通。
 */
export const MODEL_ENDPOINTS = {
  // 可灵 O3 4K 渠道版：官网 slug 为 kling-o3-4k-base
  'kling-o3-4k': 'kling-o3-4k-base/reference-to-video',

  // SeedVR2 超分：功能路径为 seedvr2/upscale/image（而非 key/image-to-image）
  'seedvr2-upscale-image': 'seedvr2/upscale/image',

  // Flux Klein 去水印：功能路径为 flux-klein/watermarker-remover/*
  'flux-klein-watermarker-remover': 'flux-klein/watermarker-remover/image-to-image',

  // 万相2.7 视频延长：官网将 video-extend 挂在拼写错误的 offcial slug 下
  'wan-2-7-extend-official': 'wan-2-7-offcial/video-extend',

  // 万相2.7 Pro：text-to-image 在拼错的 offcial slug 下，image-to-image 仍走默认 official
  'wan-2-7-image-pro-official': {
    'text-to-image': 'wan-2-7-image-pro-offcial/text-to-image',
  },
};
