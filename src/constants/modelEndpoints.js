/**
 * 模型端点注册表 —— 集中管理"官网端点 slug 与 MODELS key 不一致"的模型。
 *
 * 默认规则：请求端点 = `${modelId}/${mode}`（绝大多数模型如此，无需登记）。
 * 仅当官网端点 slug 与 key 不同时才在此登记覆盖：
 *   - 字符串形式：所有 mode 共用（单端点模型）
 *   - 对象形式：按 mode 映射（同一模型不同模式分属不同 slug）
 *
 * 国际版（bizyair.ai）映射原则（附录 C 矩阵冻结稿）：key 保持不变、零迁移，
 * 全部差异经本表覆盖；国内 -base ↔ 国际 -channel，自部署模型挂 bizyair/ 前缀。
 * 文档参见 https://docs.bizyair.ai。
 */
export const MODEL_ENDPOINTS = {
  // ── 第一批已实施（前缀 / 变体 / 三段路径）──
  // 可灵 O3 4K：国际版挂 -channel 变体
  'kling-o3-4k': {
    'reference-to-video': 'kling-o3-4k-channel/reference-to-video',
  },

  // SeedVR2 超分：bizyair/ 前缀
  'seedvr2-upscale-image': 'bizyair/seedvr2-upscale-image/image-to-image',

  // Flux Klein 去水印：三段路径 bizyair/flux-klein/{mode}/{sub}
  'flux-klein-watermarker-remover': 'bizyair/flux-klein/image-to-image/watermarker-remover',

  // ── bizyair/ 前缀族 ──
  'qwen-image': 'bizyair/qwen-image/text-to-image',
  'z-image-turbo': 'bizyair/z-image-turbo/text-to-image',
  'z-image-base': 'bizyair/z-image/text-to-image',
  'joycaption3': 'bizyair/joycaption3/vision',
  'ace-step': 'bizyair/ace-step/text-to-audio',
  'kontext-dev-lora': 'bizyair/kontext-dev-lora/image-to-image',
  'birefnet-background-remover': 'bizyair/birefnet/image-to-image',

  // qwen3tts：国际版 mode 改名 text-to-speech，内部 mode 名不变（零 UI 牵连）
  'qwen3tts-custom-voice': {
    'text-to-audio': 'bizyair/qwen3tts-custom-voice/text-to-speech',
  },

  // ── 图片变体映射（附录 C 行 2-7）──
  'bza-image-b2-official': {
    'text-to-image': 'nano-banana-2-official/text-to-image',
    'image-to-image': 'nano-banana-2-official/image-to-image',
  },
  'bza-image-b-pro-base': {
    'text-to-image': 'nano-banana-pro-channel/text-to-image',
    'image-to-image': 'nano-banana-pro-channel/image-to-image',
  },
  'bza-image-b-pro-official': {
    'text-to-image': 'nano-banana-pro-official/text-to-image',
    'image-to-image': 'nano-banana-pro-official/image-to-image',
  },
  'bza-image-o2-base': {
    'text-to-image': 'gpt-image-2-channel/text-to-image',
    'image-to-image': 'gpt-image-2-channel/image-to-image',
  },
  'bza-image-o2-official': {
    'text-to-image': 'gpt-image-2-official/text-to-image',
    'image-to-image': 'gpt-image-2-official/image-to-image',
  },
  // Seedream 5.0 绑国际 5.0 Pro（领导裁决）：t2i 直通；
  // i2i 走三段路径 edit（裸 image-to-image 404）。
  // 国际另有 image-to-image/layer-decomposition 端点（llms 200），不暴露 UI 入口，仅此注释留档
  'seedream-5-0-official': {
    'text-to-image': 'seedream-5-0-pro-official/text-to-image',
    'image-to-image': 'seedream-5-0-pro-official/image-to-image/edit',
  },

  // ── 视频变体映射（附录 C 行 20-47）──
  'seedance-2-0-base': {
    'text-to-video': 'seedance-2-0-channel/text-to-video',
    'flf-to-video': 'seedance-2-0-channel/flf-to-video',
    'reference-to-video': 'seedance-2-0-channel/reference-to-video',
  },
  'seedance-2-0-fast-base': {
    'text-to-video': 'seedance-2-0-fast-channel/text-to-video',
    'flf-to-video': 'seedance-2-0-fast-channel/flf-to-video',
    'reference-to-video': 'seedance-2-0-fast-channel/reference-to-video',
  },
  'kling-o3-pro-base': {
    'text-to-video': 'kling-o3-pro-channel/text-to-video',
    'flf-to-video': 'kling-o3-pro-channel/flf-to-video',
  },
  'kling-o3-std-base': {
    'text-to-video': 'kling-o3-std-channel/text-to-video',
    'flf-to-video': 'kling-o3-std-channel/flf-to-video',
  },
  'kling-3-0-pro-base': {
    'text-to-video': 'kling-3-0-pro-channel/text-to-video',
    'flf-to-video': 'kling-3-0-pro-channel/flf-to-video',
  },
  'kling-3-0-std-base': {
    'text-to-video': 'kling-3-0-std-channel/text-to-video',
    'flf-to-video': 'kling-3-0-std-channel/flf-to-video',
  },
  'vidu-q3-pro-base': {
    'text-to-video': 'vidu-q3-pro-channel/text-to-video',
    'image-to-video': 'vidu-q3-pro-channel/image-to-video',
    'flf-to-video': 'vidu-q3-pro-channel/flf-to-video',
  },
  'vidu-q3-turbo-base': {
    'text-to-video': 'vidu-q3-turbo-channel/text-to-video',
    'image-to-video': 'vidu-q3-turbo-channel/image-to-video',
    'flf-to-video': 'vidu-q3-turbo-channel/flf-to-video',
  },
  'hailuo-2-3-base': 'hailuo-2-3-channel/image-to-video',
  'hailuo-2-3-fast-base': 'hailuo-2-3-fast-channel/image-to-video',
  'bza-video-x-official': {
    'text-to-video': 'grok-imagine-official/text-to-video',
    'image-to-video': 'grok-imagine-official/image-to-video',
    'video-edit': 'grok-imagine-official/video-edit',
  },
  'bza-video-x-base': {
    'text-to-video': 'grok-imagine-channel/text-to-video',
    'image-to-video': 'grok-imagine-channel/image-to-video',
  },
  'bza-video-v3-1-pro-base': {
    'text-to-video': 'google-veo-3-1-pro-channel/text-to-video',
    'flf-to-video': 'google-veo-3-1-pro-channel/flf-to-video',
  },
  'bza-video-v3-1-fast-base': {
    'text-to-video': 'google-veo-3-1-fast-channel/text-to-video',
    'flf-to-video': 'google-veo-3-1-fast-channel/flf-to-video',
  },
  'bza-video-v3-1-official': {
    'text-to-video': 'google-veo-3-1-official/text-to-video',
    'flf-to-video': 'google-veo-3-1-official/flf-to-video',
  },
  'bza-video-v3-1-fast-official': {
    'text-to-video': 'google-veo-3-1-fast-official/text-to-video',
    'flf-to-video': 'google-veo-3-1-fast-official/flf-to-video',
  },
  'bza-video-v3-1-lite-official': 'google-veo-3-1-lite-official/text-to-video',
  'bza-video-g-omni-flash-base': {
    'text-to-video': 'gemini-omni-flash-preview-channel/text-to-video',
    'image-to-video': 'gemini-omni-flash-preview-channel/image-to-video',
  },
  'dreamactor-2-0-base': 'dreamactor-2-0-channel/reference-to-video',
};
