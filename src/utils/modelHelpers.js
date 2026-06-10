import { MODELS } from '../constants/models';

/**
 * @typedef {Object} ModelConfig
 * @property {string} name - 模型显示名称
 * @property {Object} icon - 图标配置 { name, color }
 * @property {string} manufacturer - 厂商
 * @property {string} category - 分类（text-to-image/text-to-video/language/vision/text-to-audio 等）
 * @property {string} paramType - 参数控件类型（resolution-ratio/seedance-video/llm-chat/tts 等）
 * @property {string[]} [modes] - 支持的模式列表
 * @property {Object} [prices] - 按分辨率/按token计费表
 * @property {number} [price] - 固定价格
 * @property {function} [priceCalculator] - 自定义价格计算函数
 * @property {string[]} [resolutions] - 支持的分辨率列表
 * @property {string[]} [videoRatios] - 视频宽高比列表
 * @property {number} [maxPromptLength] - 最大提示词长度
 * @property {number} [maxDuration] - 最大时长（秒）
 * @property {number} [minDuration] - 最小时长（秒）
 * @property {string} [imageField] - 图片上传字段名
 * @property {number} [maxImages] - 最大图片数量
 * @property {boolean} [supportsImageToImage] - 是否支持图生图
 * @property {boolean} [supportsAudio] - 是否支持音频
 * @property {boolean} [supportsMultiShot] - 是否支持多镜头
 * @property {boolean} [supportsPromptExtend] - 是否支持提示词扩展
 * @property {boolean} [supportsWatermark] - 是否支持水印
 * @property {boolean} [supportsNegativePrompt] - 是否支持反向提示词
 * @property {boolean} [supportsOffPeak] - 是否支持闲时模式
 * @property {boolean} [supportsPromptOptimizer] - 是否支持提示词优化
 * @property {string[]} [voices] - TTS 语音列表
 * @property {string[]} [formats] - TTS 输出格式列表
 * @property {string[]} [languages] - TTS 语言列表
 * @property {number[]} [speedRange] - TTS 语速范围
 * @property {number[]} [durationOptions] - 可选时长列表
 * @property {string[]} [detailOptions] - Vision 详情级别列表
 * @property {string[]} [captionTypes] - JoyCaption 类型列表
 * @property {string[]} [captionLengths] - JoyCaption 长度列表
 */

const OUTPUT_TYPE_MAP = {
  'text-to-image': 'image',
  'image-to-image': 'image',
  'text-to-video': 'video',
  'image-to-video': 'video',
  'flf-to-video': 'video',
  'reference-to-video': 'video',
  'video-edit': 'video',
  'video-extend': 'video',
  'text-to-audio': 'audio',
  'vision': 'text',
  'language': 'text',
};

/**
 * 获取模型的输出类型。
 * @param {string} modelId - 模型ID
 * @returns {'image'|'video'|'audio'|'text'} 输出类型，未知模型默认返回 'image'
 */
export function getOutputType(modelId) {
  const model = MODELS[modelId];
  if (!model) return 'image';
  return OUTPUT_TYPE_MAP[model.category] || 'image';
}

/**
 * 获取模型支持的模式列表。
 * @param {string} modelId - 模型ID
 * @returns {string[]} 模式列表，如 ['text-to-image', 'image-to-image']
 */
export function getModelModes(modelId) {
  const model = MODELS[modelId];
  if (!model) return ['text-to-image'];
  if (model.modes) return model.modes;
  const cat = model.category;
  switch (cat) {
    case 'text-to-image':
      return model.supportsImageToImage ? ['text-to-image', 'image-to-image'] : ['text-to-image'];
    case 'text-to-video':
      return ['text-to-video'];
    case 'image-to-video':
      return ['image-to-video'];
    case 'flf-to-video':
      return ['flf-to-video'];
    case 'reference-to-video':
      return ['reference-to-video'];
    case 'video-edit':
      return ['video-edit'];
    case 'video-extend':
      return ['video-extend'];
    case 'text-to-audio':
      return ['text-to-audio'];
    case 'vision':
    case 'large-language-models':
      return [cat];
    default:
      return ['text-to-image'];
  }
}

/**
 * 获取模型配置对象，未找到时返回默认模型。
 * @param {string} modelId - 模型ID
 * @returns {ModelConfig} 模型配置对象
 */
export function getModelInfo(modelId) {
  return MODELS[modelId] || MODELS['bza-image-b2-base'];
}

/**
 * 获取指定分辨率的固定价格（仅用于简单价格表模型）。
 * @param {string} modelId - 模型ID
 * @param {string} resolution - 分辨率
 * @returns {number} 价格
 */
export function getPrice(modelId, resolution) {
  const model = getModelInfo(modelId);
  return model.prices?.[resolution] || 0;
}

/**
 * 计算模型调用价格。按优先级依次尝试：
 * 1. model.priceCalculator 自定义计算函数
 * 2. model.price 固定价格
 * 3. model.prices 按分辨率或按token计费表
 * 4. 返回 0
 * @param {string} modelId - 模型ID
 * @param {object} params - 请求参数（resolution/duration/sound/userPrompt等）
 * @returns {number} 计算出的价格（金币）
 */
export function calculatePrice(modelId, params) {
  const model = getModelInfo(modelId);

  if (model.priceCalculator) {
    return model.priceCalculator(params);
  }

  if (model.price !== undefined) {
    return model.price;
  }

  if (model.prices && model.paramType !== 'width-height-quality' && model.paramType !== 'width-height') {
    if (model.prices.input_per_1k_tokens !== undefined) {
      const tokens = Math.max(100, (params.userPrompt || params.prompt || '').length);
      return model.prices.input_per_1k_tokens * Math.ceil(tokens / 1000);
    }
    const res = params.resolution === 'Custom' ? '2K' : params.resolution;
    return model.prices[res] || Object.values(model.prices)[0] || 0;
  }

  return 0;
}

/**
 * 判断模型是否按 tokens 计费（价格无法在提交前确定）。
 * @param {string} modelId - 模型ID
 * @returns {boolean}
 */
export function isTokenPricedModel(modelId) {
  const model = getModelInfo(modelId);
  return !!(model.prices?.input_per_1k_tokens || model.priceFormula);
}

/**
 * 获取模型支持的宽高比列表。
 * @param {string} modelId - 模型ID
 * @param {string} mode - 当前模式（'text-to-image' 或 'image-to-image'）
 * @returns {string[]} 宽高比列表
 */
export function getRatios(modelId, mode) {
  const model = getModelInfo(modelId);
  if (mode === 'image-to-image') return model.imageToImageRatios || [];
  if (model.videoRatios?.length) return model.videoRatios;
  return model.textToImageRatios || [];
}

/**
 * 获取模型支持的分辨率列表。
 * @param {string} modelId - 模型ID
 * @param {string} mode - 当前模式
 * @returns {string[]} 分辨率列表
 */
export function getResolutions(modelId, mode) {
  const model = getModelInfo(modelId);
  if (mode === 'image-to-image' && model.i2iResolutions) return model.i2iResolutions;
  return model.resolutions || [];
}

/**
 * 计算实际输出分辨率字符串（用于历史记录展示）。
 * @param {string} modelId - 模型ID
 * @param {string} mode - 当前模式
 * @param {object} params - 请求参数
 * @returns {string} 分辨率描述，如 '2048×1024' 或 '720p'
 */
const PARAM_TYPE_PLACEHOLDERS = {
  'resolution-ratio': {
    'text-to-image': '描述你想生成的图片...',
    'image-to-image': '描述你想生成的图片...',
  },
  'width-height-quality': { 'text-to-image': '描述你想生成的图片...' },
  'size-only': { 'text-to-image': '描述你想生成的图片...' },
  'flux-kontext': { 'image-to-image': '描述你想生成的图片...' },
  'wan-size': {
    'text-to-image': '描述你想生成的图片...',
    'image-to-image': '描述你想生成的图片...',
  },
  'width-height': { 'text-to-image': '描述你想生成的图片...' },
  'seedance-video': {
    'text-to-video': '描述视频内容...',
    'image-to-video': '描述视频运动效果（可选）...',
    'flf-to-video': '描述视频运动效果（可选）...',
    'reference-to-video': '描述视频内容...',
  },
  'kling-video': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
    'flf-to-video': '描述你想生成的视频...',
  },
  'kling-o3-4k': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
  },
  'vidu-video': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
    'reference-to-video': '描述参考视频效果...',
    'video-edit': '描述视频编辑效果...',
  },
  'wan-video': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
    'flf-to-video': '描述你想生成的视频...',
    'reference-to-video': '描述参考视频效果...',
    'video-edit': '描述视频编辑效果...',
    'video-extend': '描述视频延长效果（可选）...',
  },
  'wan-i2v': { 'image-to-video': '描述你想生成的视频...' },
  'hailuo-video': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
  },
  'happyhorse-video': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
    'video-edit': '描述视频编辑效果...',
  },
  'ltx-video': { 'text-to-video': '描述你想生成的视频...' },
  'bza-video-x': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
  },
  'bza-video-v3': {
    'text-to-video': '描述你想生成的视频...',
    'image-to-video': '描述你想生成的视频...',
  },
  'dreamactor': { 'reference-to-video': '描述视频内容...' },
  'llm-chat': { 'large-language-models': '输入你的问题...' },
  'vision-g': { 'vision': '描述你想了解的图片内容...' },
  'joycaption': { 'vision': '描述你想了解的图片内容...' },
  'tts': { 'text-to-audio': '输入要合成的文本...' },
  'birefnet': { 'image-to-image': '上传图片即可抠图...' },
  'ace-step': { 'text-to-audio': '输入歌词或描述音乐风格...' },
  'seedvr2': { 'image-to-image': '上传图片即可放大...' },
  'flux-klein': { 'image-to-image': '上传图片即可去水印...' },
  'kontext-lora': { 'image-to-image': '描述你想编辑的效果...' },
};

export function getModelPlaceholder(modelId, mode) {
  const model = getModelInfo(modelId);
  if (!model) return '输入提示词...';
  if (model.placeholder && typeof model.placeholder === 'string') return model.placeholder;
  if (model.placeholder && typeof model.placeholder === 'object' && model.placeholder[mode]) return model.placeholder[mode];
  const paramPlaceholders = PARAM_TYPE_PLACEHOLDERS[model.paramType];
  if (paramPlaceholders && paramPlaceholders[mode]) return paramPlaceholders[mode];
  return '输入提示词...';
}

export function getActualResolution(modelId, mode, params) {
  const model = getModelInfo(modelId);
  const RES_BASE = { '0.5K': 512, '1K': 1024, '2K': 2048, '3K': 3072, '4K': 4096 };

  switch (model.paramType) {
    case 'resolution-ratio': {
      const base = RES_BASE[params.resolution] || 1024;
      if (!params.aspectRatio) return `${base}×${base}`;
      const parts = params.aspectRatio.split(':').map(Number);
      if (parts.length !== 2 || parts[0] === 0 || parts[1] === 0) return `${base}×${base}`;
      const [rw, rh] = parts;
      if (rw >= rh) {
        const w = base;
        const h = Math.round(base * rh / rw);
        return `${w}×${h}`;
      }
      const h = base;
      const w = Math.round(base * rw / rh);
      return `${w}×${h}`;
    }
    case 'width-height-quality':
      return `${params.width || 1024}×${params.height || 1024}`;
    case 'size-only': {
      const base = RES_BASE[params.resolution] || 2048;
      return `~${base}`;
    }
    case 'wan-size': {
      if (params.resolution === 'Custom') {
        return `${parseInt(params.customWidth) || 2048}×${parseInt(params.customHeight) || 2048}`;
      }
      const base = RES_BASE[params.resolution] || 2048;
      return `${base}×${base}`;
    }
    case 'width-height':
      return `${params.width || 1024}×${params.height || 1024}`;
    default:
      return params.resolution || '';
  }
}
