import { BZA_RATIOS_FULL, BZA_RATIOS_10, BZA_RATIOS_10_ALT, O2_I2I_RATIOS } from './ratios';

// ─── 价格常量 ────────────────────────────────────────────────────────────────

/** O.2 官方版按像素层级计费表 */
const O2_PRICE_TIERS = {
  high: [
    { max: 1920 * 1080, price: 1120 },
    { max: 2560 * 1440, price: 2149 },
    { max: Infinity, price: 3486 },
  ],
  medium: [
    { max: 1920 * 1080, price: 378 },
    { max: 2560 * 1440, price: 630 },
    { max: Infinity, price: 966 },
  ],
  low: [
    { max: 1920 * 1080, price: 161 },
    { max: 2560 * 1440, price: 182 },
    { max: Infinity, price: 224 },
  ],
};

/** Seedance 2.0 按秒计费（有参考视频/无参考视频） */
const SEEDANCE_RATES = { withRefVideo: 59, withoutRefVideo: 98 };
const SEEDANCE_FAST_RATE = 80;
/** Seedance 2.0 渠道版 按分辨率×时长计费 */
const SEEDANCE_BASE_PRICES = { '480p': 600, '720p': 1200, 'native1080p': 3000, '1080p': 1480, '2k': 1620, '4k': 1830 };
/** Seedance 2.0 Fast 渠道版 按分辨率×时长计费 */
const SEEDANCE_FAST_BASE_PRICES = { '480p': 500, '720p': 1000, '1080p': 1200, '2k': 1420, '4k': 1630 };

/** 可灵系列按秒计费 */
const KLING_O3_PRO_RATES = { sound: 900, noSound: 700 };
const KLING_PRO_RATES = { sound: 1050, noSound: 700 };
const KLING_STD_RATES = { sound: 800, noSound: 550 };
/** 可灵 O3 4K 按秒计费（keepOriginalSound） */
const KLING_O3_4K_RATES = { keepOriginalSound: 700, noKeepOriginalSound: 550 };

/** Vidu Q3 Pro 按分辨率计费 */
const VIDU_Q3_PRO_PRICES = { '540P': 438, '720P': 938, '1080P': 1000 };
const VIDU_Q3_PRO_BASE_T2V_PRICES = { '540P': 310, '720P': 660, '1080P': 700 };
const VIDU_Q3_PRO_BASE_I2V_PRICES = { '540P': 350, '720P': 700, '1080P': 750 };
/** Vidu Q3 Turbo 按分辨率计费 */
const VIDU_Q3_TURBO_PRICES = { '540P': 250, '720P': 375, '1080P': 500 };
/** Vidu Q3 Turbo 渠道版 按分辨率计费 */
const VIDU_Q3_TURBO_BASE_PRICES = { '540P': 200, '720P': 300, '1080P': 350 };

/** 万相2.7视频 按分辨率计费 */
const WAN_27_VIDEO_PRICES = { '720P': 600, '1080P': 1000 };
/** 万相2.7视频延长 按分辨率计费 */
const WAN_27_EXTEND_PRICES = { '480P': 300, '720P': 600, '1080P': 1000 };
/** 万相2.5/2.6图生视频 按分辨率计费 */
const WAN_I2V_PRICES = { '480P': 300, '720P': 600, '1080P': 1000 };

/** 海螺2.3 按分辨率+时长组合计费 */
const HAILUO_23_PRICES = { '768P/6': 1600, '768P/10': 3200, '1080P/6': 2800 };
/** 海螺2.3 Fast 按分辨率+时长组合计费 */
const HAILUO_23_FAST_PRICES = { '768P/6': 1080, '768P/10': 1800, '1080P/6': 1850 };

/** HappyHorse 按分辨率计费 */
const HAPPYHORSE_PRICES = { '720P': 900, '1080P': 1600 };

/** Video V3.1 Pro 按分辨率计费 */
const BZA_V3_PRO_PRICES = { '720p': 800, '1080p': 1000, '4k': 1400 };
/** Video V3.1 Fast 按分辨率计费 */
const BZA_V3_FAST_PRICES = { '720p': 200, '1080p': 250, '4k': 500 };

/** Z-Image Turbo 按像素面积计费阈值 */
const Z_IMAGE_PRICES = { small: 5, large: 10 };
const Z_IMAGE_PIXEL_THRESHOLD = 1024 * 1024;

/** Video X 按时长计费 */
const BZA_VIDEO_X_PRICES = { 6: 1900, 10: 3150 };
/** Video X 渠道版 按秒计费 */
const BZA_VIDEO_X_BASE_RATE = 50;

/** LTX 2.3 固定价格 */
const LTX_PRICE = 300;

/** DreamActor 2.0 固定价格 */
const DREAMACTOR_PRICE = 350;

/** JoyCaption3 固定价格 */
const JOYCAPTION_PRICE = 6;

/** Qwen3 TTS 固定价格 */
const TTS_PRICE = 10;

// ─── 通用价格计算函数 ─────────────────────────────────────────────────────────

/** 按秒计费：duration × 单价 */
function calcByDuration(rate) {
  return (params) => {
    const dur = params.duration === 'auto' ? 5 : (parseInt(params.duration) || params.duration || 5);
    return rate * dur;
  };
}

/** 按分辨率×时长计费 */
function calcByResolutionDuration(prices, defaultRate) {
  return (params) => {
    const dur = params.duration || 5;
    const rate = prices[params.resolution] || defaultRate;
    return rate * dur;
  };
}

/** 按分辨率+时长组合计费 */
function calcByCombo(prices, defaultPrice) {
  return (params) => {
    const combo = `${params.resolution}/${params.duration}`;
    return prices[combo] || defaultPrice;
  };
}

/** 按分辨率固定价格（不乘时长） */
function calcByResolution(prices, defaultPrice) {
  return (params) => prices[params.resolution] || defaultPrice;
}

/** O.2 官方版按像素层级计费 */
function calcO2Price(params) {
  const w = params.width || 1024;
  const h = params.height || 1024;
  const q = params.quality || 'medium';
  const pixels = w * h;
  const tiers = O2_PRICE_TIERS[q] || O2_PRICE_TIERS.medium;
  const tier = tiers.find((t) => pixels <= t.max);
  return tier ? tier.price : tiers[tiers.length - 1].price;
}

/** Seedance 2.0 按秒计费（区分有无参考视频） */
function calcSeedancePrice(params) {
  const dur = params.duration === 'auto' ? 5 : parseInt(params.duration) || 5;
  const hasRefVideo = params.videoUrls?.length > 0;
  const rate = hasRefVideo ? SEEDANCE_RATES.withRefVideo : SEEDANCE_RATES.withoutRefVideo;
  return rate * dur;
}

/** 可灵系列按秒计费（区分有无声音） */
function calcKlingPrice(rates) {
  return (params) => {
    const dur = params.duration || 5;
    const rate = params.sound ? rates.sound : rates.noSound;
    return rate * dur;
  };
}

/** 可灵 O3 4K 按秒计费（区分是否保留原始声音） */
function calcKlingO3_4KPrice(params) {
  const dur = params.duration || 5;
  const rate = params.keepOriginalSound ? KLING_O3_4K_RATES.keepOriginalSound : KLING_O3_4K_RATES.noKeepOriginalSound;
  return rate * dur;
}

/** Video X 按时长计费 */
function calcBzaVideoXPrice(params) {
  const dur = parseInt(params.duration) || 6;
  return BZA_VIDEO_X_PRICES[dur] || BZA_VIDEO_X_PRICES[6];
}

/** Z-Image Turbo 按像素面积计费 */
function calcZImagePrice(params) {
  const w = params.width || 1024;
  const h = params.height || 1024;
  return w * h <= Z_IMAGE_PIXEL_THRESHOLD ? Z_IMAGE_PRICES.small : Z_IMAGE_PRICES.large;
}

/** Vidu Q3 Pro 渠道版 按模式区分价格计费 */
function calcViduQ3ProBasePrice(params) {
  const isI2V = params.imageUrls?.length > 0 || params.lastFrameUrls?.length > 0;
  const prices = isI2V ? VIDU_Q3_PRO_BASE_I2V_PRICES : VIDU_Q3_PRO_BASE_T2V_PRICES;
  const dur = params.duration || 5;
  const rate = prices[params.resolution] || 660;
  return rate * dur;
}

/** Vidu Q3 Pro 官方版 按分辨率*时长计费 + is_rec 额外费用 */
function calcViduQ3ProOfficialPrice(params) {
  const dur = params.duration || 5;
  const rate = VIDU_Q3_PRO_PRICES[params.resolution] || 938;
  let price = rate * dur;
  if (params.isRec) price += 320;
  return price;
}

/** Vidu Q3 Turbo 官方版 按分辨率*时长计费 + is_rec 额外费用 */
function calcViduQ3TurboOfficialPrice(params) {
  const dur = params.duration || 5;
  const rate = VIDU_Q3_TURBO_PRICES[params.resolution] || 375;
  let price = rate * dur;
  if (params.isRec) price += 320;
  return price;
}

/** 固定价格（忽略参数） */
function calcFixedPrice(price) {
  return () => price;
}

export const MODELS = {
  'bza-image-b2-base': {
    name: 'B.2 渠道版',
    icon: { name: 'image-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'resolution-ratio',
    prices: { '1K': 200, '2K': 200, '4K': 250 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_FULL,
    imageToImageRatios: BZA_RATIOS_FULL,
    maxPromptLength: 20000,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-b2-official': {
    name: 'B.2 官方版',
    icon: { name: 'image-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'resolution-ratio',
    prices: { '0.5K': 550, '1K': 550, '2K': 850, '4K': 1100 },
    resolutions: ['0.5K', '1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_FULL,
    imageToImageRatios: BZA_RATIOS_FULL,
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
    supportsSeed: true, supportsWebSearch: true,
  },
  'bza-image-b-pro-base': {
    name: 'B.Pro 渠道版',
    icon: { name: 'image-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'resolution-ratio',
    prices: { '1K': 400, '2K': 400, '4K': 500 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_10_ALT,
    imageToImageRatios: BZA_RATIOS_10_ALT,
    maxPromptLength: 20000,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-b-pro-official': {
    name: 'B.Pro 官方版',
    icon: { name: 'image-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'resolution-ratio',
    prices: { '1K': 700, '2K': 1000, '4K': 1300 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_10,
    imageToImageRatios: BZA_RATIOS_10,
    maxPromptLength: 20000,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
    supportsTemperature: true, supportsTopP: true, supportsMaxTokens: true, supportsSeed: true,
  },
  'bza-image-o2-base': {
    name: 'O.2 渠道版',
    icon: { name: 'image-outline', color: '#10A37F' },
    manufacturer: 'openai',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'resolution-ratio',
    prices: { '1K': 100, '2K': 100, '4K': 100 },
    resolutions: ['1K', '2K', '4K'],
    defaultResolution: '2K',
    textToImageRatios: ['1:1','2:3','3:2','4:5','5:4','3:4','4:3','16:9','9:16','21:9'],
    imageToImageRatios: O2_I2I_RATIOS,
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
    resolutionRequired: false,
  },
  'bza-image-o2-official': {
    name: 'O.2 官方版',
    icon: { name: 'image-outline', color: '#10A37F' },
    manufacturer: 'openai',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'width-height-quality',
    qualities: ['low', 'medium', 'high'],
    priceNote: '按尺寸+质量计费',
    priceCalculator: calcO2Price,
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 16,
    supportsImageToImage: true,
  },
  'seedream-5-0-official': {
    name: 'Seedream 5.0',
    icon: { name: 'image-outline', color: '#00C7BE' },
    manufacturer: 'bytedance',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'size-only',
    prices: { '2K': 220, '3K': 220, '4K': 220 },
    resolutions: ['2K', '3K', '4K'],
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'seedream-4-0-official': {
    name: 'Seedream 4.0',
    icon: { name: 'image-outline', color: '#00C7BE' },
    manufacturer: 'bytedance',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'size-only',
    prices: { '1K': 150, '2K': 150, '4K': 150 },
    resolutions: ['1K', '2K', '4K'],
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'seedream-4-5-official': {
    name: 'Seedream 4.5',
    icon: { name: 'image-outline', color: '#00C7BE' },
    manufacturer: 'bytedance',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'size-only',
    prices: { '2K': 250, '4K': 250 },
    resolutions: ['2K', '4K'],
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'flux-kontext-pro-base': {
    name: 'F.K Pro',
    icon: { name: 'image-outline', color: '#FF6B6B' },
    manufacturer: 'blackforest',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'flux-kontext',
    prices: { default: 70 },
    textToImageRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
    imageToImageRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'flux-kontext-max-base': {
    name: 'F.K Max',
    icon: { name: 'image-outline', color: '#FF6B6B' },
    manufacturer: 'blackforest',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'flux-kontext',
    prices: { default: 140 },
    textToImageRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
    imageToImageRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'wan-2-7-image-official': {
    name: '万相2.7',
    icon: { name: 'image-outline', color: '#FF6A00' },
    manufacturer: 'alibaba',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'wan-size',
    prices: { '1K': 200, '2K': 200, '4K': 200 },
    resolutions: ['1K', '2K', '4K', 'Custom'],
    defaultResolution: '2K',
    maxPromptLength: 5000,
    imageField: 'images',
    maxImages: 9,
    supportsImageToImage: true,
    i2iResolutions: ['1K', '2K', 'Custom'],
    supportsSeed: true,
    supportsWatermark: true, supportsEnableSequential: true, supportsThinkingMode: true, supportsColorPalette: true, supportsBboxList: true,
    defaultWatermark: false, defaultThinkingMode: true,
  },
  'wan-2-7-image-pro-offcial': {
    name: '万相2.7 Pro',
    icon: { name: 'image-outline', color: '#FF6A00' },
    manufacturer: 'alibaba',
    category: 'text-to-image',
    modes: ['text-to-image', 'image-to-image'],
    paramType: 'wan-size',
    prices: { '1K': 500, '2K': 500, '4K': 500 },
    resolutions: ['1K', '2K', '4K', 'Custom'],
    defaultResolution: '2K',
    maxPromptLength: 5000,
    imageField: 'images',
    maxImages: 9,
    supportsImageToImage: true,
    i2iResolutions: ['1K', '2K', 'Custom'],
    supportsSeed: true, supportsWatermark: true, supportsEnableSequential: true, supportsThinkingMode: true, supportsColorPalette: true, supportsBboxList: true,
    defaultWatermark: false, defaultThinkingMode: true,
  },
  'z-image-turbo': {
    name: 'Z-Image Turbo',
    icon: { name: 'image-outline', color: '#6C5CE7' },
    manufacturer: 'siliconflow',
    category: 'text-to-image',
    modes: ['text-to-image'],
    paramType: 'width-height',
    prices: { '1024': 5, '2048': 10 },
    priceCalculator: calcZImagePrice,
    maxPromptLength: 2500,
    supportsImageToImage: false,
    supportsNegativePrompt: true, supportsSeed: true, supportsBatchSize: true,
  },
  'seedance-2-0-official': {
    name: 'Seedance 2.0',
    icon: { name: 'videocam-outline', color: '#00C7BE' },
    manufacturer: 'bytedance',
    category: 'text-to-video',
    paramType: 'seedance-video',
    modes: ['text-to-video', 'flf-to-video', 'reference-to-video'],
    priceCalculator: calcSeedancePrice,
    priceFormula: '98金币/M Tokens',
    priceFormulaRefVideo: '无参考视频 98金币/M Tokens; 有参考视频 98 * 0.6/M Tokens;',
    resolutions: ['480p', '720p', '1080p'],
    videoRatios: ['auto', '16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
    maxPromptLength: 20480,
    maxDuration: 15,
    minDuration: 4,
    supportsAudio: true,
    supportsSeed: true,
    supportsReturnLastFrame: true,
    ratioField: 'aspect_ratio',
  },
  'seedance-2-0-base': {
    name: 'Seedance 2.0 渠道版',
    icon: { name: 'videocam-outline', color: '#00C7BE' },
    manufacturer: 'bytedance',
    category: 'text-to-video',
    paramType: 'seedance-video',
    modes: ['text-to-video', 'flf-to-video', 'reference-to-video'],
    priceCalculator: calcByResolutionDuration(SEEDANCE_BASE_PRICES, 600),
    resolutions: ['480p', '720p', 'native1080p', '1080p', '2k', '4k'],
    defaultResolution: '720p',
    videoRatios: ['adaptive', '16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
    defaultAspectRatio: 'adaptive',
    maxPromptLength: 20480,
    maxDuration: 15,
    minDuration: 4,
    defaultDuration: 5,
    supportsAudio: true,
    supportsSeed: true,
    supportsReturnLastFrame: true,
    supportsWebSearch: true,
    ratioField: 'ratio',
    durationType: 'number',
  },
  'seedance-2-0-fast-official': {
    name: 'Seedance 2.0 Fast',
    icon: { name: 'videocam-outline', color: '#00C7BE' },
    manufacturer: 'bytedance',
    category: 'text-to-video',
    paramType: 'seedance-video',
    modes: ['text-to-video', 'flf-to-video', 'reference-to-video'],
    priceCalculator: calcByDuration(SEEDANCE_FAST_RATE),
    priceFormula: '80金币/M Tokens',
    priceFormulaRefVideo: '无参考视频 80金币/M Tokens; 有参考视频 80 * 0.6/M Tokens;',
    resolutions: ['480p', '720p'],
    videoRatios: ['auto', '16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
    maxPromptLength: 20480,
    maxDuration: 15,
    minDuration: 4,
    supportsAudio: true,
    supportsSeed: true,
    supportsReturnLastFrame: true,
    ratioField: 'aspect_ratio',
  },
  'seedance-2-0-fast-base': {
    name: 'Seedance 2.0 Fast 渠道版',
    icon: { name: 'videocam-outline', color: '#00C7BE' },
    manufacturer: 'bytedance',
    category: 'text-to-video',
    paramType: 'seedance-video',
    modes: ['text-to-video', 'flf-to-video', 'reference-to-video'],
    priceCalculator: calcByResolutionDuration(SEEDANCE_FAST_BASE_PRICES, 500),
    resolutions: ['480p', '720p', '1080p', '2k', '4k'],
    videoRatios: ['adaptive', '16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
    maxPromptLength: 20480,
    maxDuration: 15,
    minDuration: 4,
    supportsAudio: true,
    supportsSeed: true,
    supportsReturnLastFrame: true,
    supportsWebSearch: true,
    ratioField: 'ratio',
    durationType: 'number',
  },

  'kling-o3-pro-base': {
    name: '可灵 O3 Pro',
    icon: { name: 'videocam-outline', color: '#FF6B6B' },
    manufacturer: 'kuaishou',
    category: 'text-to-video',
    paramType: 'kling-video',
    modes: ['text-to-video', 'flf-to-video'],
    priceCalculator: calcKlingPrice(KLING_O3_PRO_RATES),
    videoRatios: ['16:9', '9:16', '1:1'],
    maxPromptLength: 2500,
    maxDuration: 15,
    minDuration: 1,
    supportsMultiShot: true,
    soundRequired: true,
    defaultSound: true,
  },
  'kling-o3-std-base': {
    name: '可灵 O3 Std',
    icon: { name: 'videocam-outline', color: '#FF6B6B' },
    manufacturer: 'kuaishou',
    category: 'text-to-video',
    paramType: 'kling-video',
    modes: ['text-to-video', 'flf-to-video'],
    priceCalculator: calcKlingPrice(KLING_STD_RATES),
    videoRatios: ['16:9', '9:16', '1:1'],
    maxPromptLength: 2500,
    maxDuration: 15,
    minDuration: 1,
    supportsMultiShot: true,
    soundRequired: true,
    defaultSound: true,
  },
  'kling-3-0-pro-base': {
    name: '可灵 3.0 Pro',
    icon: { name: 'videocam-outline', color: '#FF6B6B' },
    manufacturer: 'kuaishou',
    category: 'text-to-video',
    paramType: 'kling-video',
    modes: ['text-to-video', 'flf-to-video'],
    priceCalculator: calcKlingPrice(KLING_PRO_RATES),
    videoRatios: ['16:9', '9:16', '1:1'],
    maxPromptLength: 2048,
    maxDuration: 15,
    minDuration: 3,
    supportsSeed: true,
    flfUsesImageUrls: true,
  },
  'kling-3-0-std-base': {
    name: '可灵 3.0 Std',
    icon: { name: 'videocam-outline', color: '#FF6B6B' },
    manufacturer: 'kuaishou',
    category: 'text-to-video',
    paramType: 'kling-video',
    modes: ['text-to-video', 'flf-to-video'],
    priceCalculator: calcKlingPrice(KLING_STD_RATES),
    videoRatios: ['16:9', '9:16', '1:1'],
    maxPromptLength: 2048,
    maxDuration: 15,
    minDuration: 3,
    supportsSeed: true,
    flfUsesImageUrls: true,
  },
  'kling-o3-4k-base': {
    name: '可灵 O3 4K',
    icon: { name: 'git-compare-outline', color: '#FF6B6B' },
    manufacturer: 'kuaishou',
    category: 'reference-to-video',
    paramType: 'kling-o3-4k',
    modes: ['reference-to-video'],
    priceCalculator: calcKlingO3_4KPrice,
    videoRatios: ['16:9', '9:16', '1:1'],
    maxPromptLength: 2500,
    maxDuration: 15,
    minDuration: 3,
    supportsMultiShot: true,
    soundRequired: true,
    defaultSound: true,
    defaultKeepOriginalSound: true,
  },

  'vidu-q3-pro-official': {
    name: 'Vidu Q3 Pro',
    icon: { name: 'videocam-outline', color: '#6C5CE7' },
    manufacturer: 'shengshuo',
    category: 'text-to-video',
    paramType: 'vidu-video',
    modes: ['text-to-video', 'image-to-video', 'flf-to-video'],
    priceCalculator: calcViduQ3ProOfficialPrice,
    resolutions: ['540P', '720P', '1080P'],
    videoRatios: ['16:9', '9:16', '4:3', '3:4', '1:1'],
    maxPromptLength: 5000,
    maxDuration: 16,
    minDuration: 1,
    supportsAudio: true,
    supportsOffPeak: true,
    supportsIsRec: true,
    supportsSeed: true,
  },
  'vidu-q3-pro-base': {
    name: 'Vidu Q3 Pro 渠道版',
    icon: { name: 'videocam-outline', color: '#6C5CE7' },
    manufacturer: 'shengshuo',
    category: 'text-to-video',
    paramType: 'vidu-video',
    modes: ['text-to-video', 'image-to-video', 'flf-to-video'],
    priceCalculator: calcViduQ3ProBasePrice,
    resolutions: ['540P', '720P', '1080P'],
    videoRatios: ['16:9', '9:16', '4:3', '3:4', '1:1'],
    maxPromptLength: 4000,
    maxDuration: 16,
    minDuration: 1,
    supportsAudio: true,
    supportsStyle: true,
    supportsMovementAmplitude: true,
    flfUsesFirstFrameImage: true, styleOptions: ['general', 'anime'],
  },
  'vidu-q3-turbo-official': {
    name: 'Vidu Q3 Turbo',
    icon: { name: 'videocam-outline', color: '#6C5CE7' },
    manufacturer: 'shengshuo',
    category: 'text-to-video',
    paramType: 'vidu-video',
    modes: ['text-to-video', 'image-to-video', 'flf-to-video'],
    priceCalculator: calcViduQ3TurboOfficialPrice,
    resolutions: ['540P', '720P', '1080P'],
    videoRatios: ['16:9', '9:16', '4:3', '3:4', '1:1'],
    maxPromptLength: 5000,
    maxDuration: 16,
    minDuration: 1,
    supportsAudio: true,
    supportsOffPeak: true,
    supportsIsRec: true,
    supportsSeed: true,
  },
  'vidu-q3-turbo-base': {
    name: 'Vidu Q3 Turbo 渠道版',
    icon: { name: 'videocam-outline', color: '#6C5CE7' },
    manufacturer: 'shengshuo',
    category: 'text-to-video',
    paramType: 'vidu-video',
    modes: ['text-to-video', 'image-to-video', 'flf-to-video'],
    priceCalculator: calcByResolutionDuration(VIDU_Q3_TURBO_BASE_PRICES, 200),
    resolutions: ['540P', '720P', '1080P'],
    videoRatios: ['16:9', '9:16', '4:3', '3:4', '1:1'],
    maxPromptLength: 4000,
    maxDuration: 16,
    minDuration: 1,
    supportsAudio: true,
    supportsStyle: true,
    supportsMovementAmplitude: true,
    flfUsesFirstFrameImage: true, styleOptions: ['general', 'anime'],
  },
  'wan-2-7-official': {
    name: '万相2.7 视频',
    icon: { name: 'videocam-outline', color: '#FF6A00' },
    manufacturer: 'alibaba',
    category: 'text-to-video',
    paramType: 'wan-video',
    modes: ['text-to-video', 'image-to-video', 'reference-to-video', 'video-edit'],
    priceCalculator: calcByResolutionDuration(WAN_27_VIDEO_PRICES, 600),
    resolutions: ['720P', '1080P'],
    defaultResolution: '1080P',
    videoRatios: ['16:9', '9:16', '1:1', '4:3', '3:4'],
    maxPromptLength: 5000,
    maxDuration: 15,
    minDuration: 2,
    supportsPromptExtend: true,
    supportsWatermark: true,
    supportsNegativePrompt: true,
    supportsSeed: true,
    supportsAudioSetting: true,
    supportsDrivingAudio: true,
    supportsAudioUrl: true,
    supportsRefImages: true,
    supportsRefVideos: true,
    supportsReferenceVoice: true,
    defaultWatermark: false, defaultPromptExtend: true, defaultAudioSetting: 'auto',
  },
  'wan-2-7-offcial': {
    name: '万相2.7 视频延长',
    icon: { name: 'time-outline', color: '#FF6A00' },
    manufacturer: 'alibaba',
    category: 'video-extend',
    paramType: 'wan-video',
    modes: ['video-extend'],
    priceCalculator: calcByResolutionDuration(WAN_27_EXTEND_PRICES, 600),
    resolutions: ['720P', '1080P'],
    defaultResolution: '1080P',
    videoRatios: [],
    maxPromptLength: 2048,
    maxDuration: 15,
    minDuration: 2,
    defaultDuration: 15,
    supportsPromptExtend: true,
    supportsWatermark: true,
    supportsNegativePrompt: true,
    supportsSeed: true,
    supportsDrivingAudio: true,
    defaultWatermark: false, defaultPromptExtend: true,
  },
  'wan-2-5-official': {
    name: '万相2.5 图生视频',
    icon: { name: 'film-outline', color: '#FF6A00' },
    manufacturer: 'alibaba',
    category: 'image-to-video',
    paramType: 'wan-i2v',
    modes: ['image-to-video'],
    priceCalculator: calcByResolutionDuration(WAN_I2V_PRICES, 400),
    resolutions: ['480P', '720P', '1080P'],
    defaultResolution: '1080P',
    videoRatios: [],
    maxPromptLength: 1500,
    maxDuration: 10,
    minDuration: 5,
    supportsPromptExtend: true,
    supportsAudio: true,
    supportsAudioUrl: true,
    defaultPromptExtend: true, defaultAudio: true,
  },

  'wan-2-6-official': {
    name: '万相2.6 图生视频',
    icon: { name: 'film-outline', color: '#FF6A00' },
    manufacturer: 'alibaba',
    category: 'image-to-video',
    paramType: 'wan-i2v',
    modes: ['image-to-video'],
    priceCalculator: calcByResolutionDuration(WAN_I2V_PRICES, 400),
    resolutions: ['480P', '720P', '1080P'],
    defaultResolution: '1080P',
    videoRatios: [],
    maxPromptLength: 1500,
    maxDuration: 10,
    minDuration: 5,
    supportsPromptExtend: true,
    supportsAudio: true,
    supportsAudioUrl: true,
    defaultPromptExtend: true, defaultAudio: true,
  },

  'hailuo-2-3-base': {
    name: '海螺 2.3',
    icon: { name: 'videocam-outline', color: '#00CEC9' },
    manufacturer: 'minimax',
    category: 'text-to-video',
    paramType: 'hailuo-video',
    modes: ['text-to-video', 'image-to-video'],
    priceCalculator: calcByCombo(HAILUO_23_PRICES, 1600),
    resolutions: ['768P', '1080P'],
    videoRatios: [],
    durationOptions: [6, 10],
    resolutionDurationMap: { '768P': [6, 10], '1080P': [6] },
    maxPromptLength: 2000,
    supportsPromptOptimizer: true,
    supportsFastPretreatment: true,
    supportsWatermark: true,
  },
  'hailuo-2-3-fast-base': {
    name: '海螺 2.3 Fast',
    icon: { name: 'videocam-outline', color: '#00CEC9' },
    manufacturer: 'minimax',
    category: 'text-to-video',
    paramType: 'hailuo-video',
    modes: ['text-to-video', 'image-to-video'],
    priceCalculator: calcByCombo(HAILUO_23_FAST_PRICES, 1080),
    resolutions: ['768P', '1080P'],
    videoRatios: [],
    durationOptions: [6, 10],
    maxPromptLength: 2000,
    resolutionDurationMap: { '1080P': [6], '768P': [6, 10] },
  },

  'happyhorse-1-0-official': {
    name: 'HappyHorse 1.0',
    icon: { name: 'videocam-outline', color: '#FF6A00' },
    manufacturer: 'alibaba',
    category: 'text-to-video',
    paramType: 'happyhorse-video',
    modes: ['text-to-video', 'image-to-video', 'reference-to-video', 'video-edit'],
    priceCalculator: calcByResolutionDuration(HAPPYHORSE_PRICES, 900),
    resolutions: ['720P', '1080P'],
    defaultResolution: '1080P',
    videoRatios: ['16:9', '9:16', '1:1', '4:3', '3:4', '4:5', '5:4'],
    maxPromptLength: 2500,
    maxDuration: 15,
    minDuration: 3,
    supportsWatermark: true,
    supportsAudioSetting: true,
    defaultWatermark: true, defaultAudioSetting: 'auto',
  },

  'ltx-2-3': {
    name: 'LTX 2.3',
    icon: { name: 'videocam-outline', color: '#6C5CE7' },
    manufacturer: 'siliconflow',
    category: 'text-to-video',
    paramType: 'ltx-video',
    modes: ['text-to-video', 'image-to-video'],
    priceCalculator: calcFixedPrice(LTX_PRICE),
    resolutions: ['1080P'],
    videoRatios: [],
    maxPromptLength: 2500,
    maxDuration: 5,
    minDuration: 5,
    displayOptions: ['horizontal', 'vertical'],
    supportsSeed: true,
  },

  'bza-video-x-official': {
    name: 'Video X 官方版',
    icon: { name: 'videocam-outline', color: '#FF6A00' },
    manufacturer: 'grok',
    category: 'text-to-video',
    paramType: 'bza-video-x',
    modes: ['text-to-video', 'image-to-video', 'video-edit'],
    priceCalculator: calcBzaVideoXPrice,
    resolutions: ['480p', '720p'],
    videoRatios: ['16:9', '2:3', '1:1', '3:2', '9:16'],
    durationOptions: [6, 10],
    maxPromptLength: 800,
    maxImages: 1,
  },
  'bza-video-x-base': {
    name: 'Video X 渠道版',
    icon: { name: 'videocam-outline', color: '#FF6A00' },
    manufacturer: 'grok',
    category: 'text-to-video',
    paramType: 'bza-video-x',
    modes: ['text-to-video', 'image-to-video'],
    priceCalculator: calcByDuration(BZA_VIDEO_X_BASE_RATE),
    resolutions: ['480p', '720p'],
    videoRatios: ['16:9', '2:3', '1:1', '3:2', '9:16'],
    maxDuration: 30,
    minDuration: 6,
    maxPromptLength: 20000,
    maxImages: 7,
  },

  'bza-video-v3-1-pro-base': {
    name: 'Video V3.1 Pro',
    icon: { name: 'videocam-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'text-to-video',
    paramType: 'bza-video-v3',
    modes: ['text-to-video', 'image-to-video', 'flf-to-video'],
    priceCalculator: calcByResolution(BZA_V3_PRO_PRICES, 1000),
    resolutions: ['720p', '1080p', '4k'],
    videoRatios: ['16:9', '9:16'],
    maxPromptLength: 8000,
  },
  'bza-video-v3-1-fast-base': {
    name: 'Video V3.1 Fast',
    icon: { name: 'videocam-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'text-to-video',
    paramType: 'bza-video-v3',
    modes: ['text-to-video', 'image-to-video', 'flf-to-video'],
    priceCalculator: calcByResolution(BZA_V3_FAST_PRICES, 800),
    resolutions: ['720p', '1080p', '4k'],
    videoRatios: ['16:9', '9:16'],
    maxPromptLength: 8000,
  },

  'dreamactor-2-0-base': {
    name: 'DreamActor 2.0',
    icon: { name: 'git-compare-outline', color: '#E17055' },
    manufacturer: 'jimeng',
    category: 'reference-to-video',
    paramType: 'dreamactor',
    modes: ['reference-to-video'],
    priceCalculator: calcByDuration(DREAMACTOR_PRICE),
    resolutions: [],
    videoRatios: [],
    maxPromptLength: 0,
    maxDuration: 15,
    minDuration: 3,
  },

  'bza-chat-g3-1-pro-official': {
    name: 'G.3.1 Pro',
    icon: { name: 'chatbubbles-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'language',
    paramType: 'llm-chat',
    modes: ['large-language-models'],
    outputType: 'text',
    prices: { input_per_1k_tokens: 14, output_per_1k_tokens: 84 },
    priceFormula: '金币：14 / 1000 * prompt_tokens + 84 / 1000 * completion_tokens',
    maxSystemPromptLength: 2500,
    maxUserPromptLength: 2500,
    maxTokens: 65536,
    temperatureRange: [0, 2],
    enableThinkingRequired: true,
    enableSearchRequired: true,
  },
  'bza-chat-g3-1-flash-lite-official': {
    name: 'G.3.1 Flash-Lite',
    icon: { name: 'chatbubbles-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'language',
    paramType: 'llm-chat',
    modes: ['large-language-models'],
    outputType: 'text',
    prices: { input_per_1k_tokens: 1.75, output_per_1k_tokens: 10.5 },
    priceFormula: '金币：1.75 / 1000 * prompt_tokens + 10.5 / 1000 * completion_tokens',
    maxSystemPromptLength: 2500,
    maxUserPromptLength: 2500,
    maxTokens: 65536,
    temperatureRange: [0, 2],
    enableThinkingRequired: true,
    enableSearchRequired: true,
  },
  'bza-chat-g3-flash-official': {
    name: 'G.3 Flash',
    icon: { name: 'chatbubbles-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'language',
    paramType: 'llm-chat',
    modes: ['large-language-models'],
    outputType: 'text',
    prices: { input_per_1k_tokens: 3.5, output_per_1k_tokens: 21 },
    priceFormula: '金币：3.5 / 1000 * prompt_tokens + 21 / 1000 * completion_tokens',
    maxSystemPromptLength: 2500,
    maxUserPromptLength: 2500,
    maxTokens: 65536,
    temperatureRange: [0, 2],
    enableThinkingRequired: false,
    enableSearchRequired: false,
  },

  'bza-vision-g3-1-pro-official': {
    name: 'G.3.1 Pro Vision',
    icon: { name: 'eye-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'vision',
    paramType: 'vision-g',
    modes: ['vision'],
    outputType: 'text',
    prices: { input_per_1k_tokens: 14, output_per_1k_tokens: 84 },
    priceFormula: '金币：14 / 1000 * prompt_tokens + 84 / 1000 * completion_tokens',
    maxSystemPromptLength: 5000,
    maxUserPromptLength: 2500,
    maxTokens: 65536,
    maxImages: 900,
    temperatureRange: [0, 2],
    detailOptions: ['low', 'medium', 'high'],
    supportsEnableThinking: true,
  },
  'bza-vision-g3-1-flash-lite-official': {
    name: 'G.3.1 Flash-Lite Vision',
    icon: { name: 'eye-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'vision',
    paramType: 'vision-g',
    modes: ['vision'],
    outputType: 'text',
    priceCalculator: calcFixedPrice(700),
    priceFormula: '金币：1.75 / 1000 * prompt_tokens + 10.5 / 1000 * completion_tokens',
    maxSystemPromptLength: 5000,
    maxUserPromptLength: 2500,
    maxTokens: 65536,
    maxImages: 900,
    temperatureRange: [0, 2],
    detailOptions: ['low', 'medium', 'high'],
    supportsEnableThinking: true,
  },
  'bza-vision-g3-flash-official': {
    name: 'G.3 Flash Vision',
    icon: { name: 'eye-outline', color: '#4285F4' },
    manufacturer: 'google',
    category: 'vision',
    paramType: 'vision-g',
    modes: ['vision'],
    outputType: 'text',
    prices: { input_per_1k_tokens: 3.5, output_per_1k_tokens: 21 },
    priceFormula: '金币：3.5 / 1000 * prompt_tokens + 21 / 1000 * completion_tokens',
    maxSystemPromptLength: 2500,
    maxUserPromptLength: 2500,
    maxTokens: 65536,
    maxImages: 900,
    temperatureRange: [0, 2],
    detailOptions: ['low', 'medium', 'high'],
    supportsEnableThinking: true,
  },
  'joycaption3': {
    name: 'JoyCaption3',
    icon: { name: 'eye-outline', color: '#6C5CE7' },
    manufacturer: 'siliconflow',
    category: 'vision',
    paramType: 'joycaption',
    modes: ['vision'],
    outputType: 'text',
    priceCalculator: calcFixedPrice(JOYCAPTION_PRICE),
    maxImages: 1,
    maxTokens: 512,
    defaultTemperature: 0.5,
    defaultMaxTokens: 256,
    temperatureRange: [0, 2],
    captionTypes: ['Descriptive', 'Descriptive (Informal)', 'Training Prompt', 'MidJourney', 'Booru tag list', 'Booru-like tag list', 'Art Critic', 'Product Listing', 'Social Media Post'],
    captionLengths: ['any', 'very short', 'short', 'medium-length', 'long', 'very long', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130', '140', '150', '160', '170', '180', '190', '200', '210', '220', '230', '240', '250', '260'],
  },

  'qwen3tts-custom-voice': {
    name: 'Qwen3 TTS',
    icon: { name: 'mic-outline', color: '#6C5CE7' },
    manufacturer: 'siliconflow',
    category: 'text-to-audio',
    paramType: 'tts',
    modes: ['text-to-audio'],
    outputType: 'audio',
    priceCalculator: calcFixedPrice(TTS_PRICE),
    voices: ['vivian', 'serena', 'uncle_fu', 'dylan', 'eric', 'ryan', 'aiden', 'ono_anna', 'sohee'],
    formats: ['wav', 'mp3', 'flac', 'pcm', 'aac', 'opus'],
    languages: ['Auto', 'Chinese', 'English', 'Japanese', 'Korean', 'German', 'French', 'Russian', 'Portuguese', 'Spanish', 'Italian'],
    maxInputLength: 2500,
    speedRange: [0.5, 2],
    defaultSpeed: 1,
    defaultVoice: 'eric',
    defaultFormat: 'mp3',
    defaultLanguage: 'Auto',
    maxTokens: 1024,
  },
};

export const VIDEO_RESOLUTIONS = {
  SEEDANCE: ['480p', '720p', '1080p'],
  SEEDANCE_OPTIONAL: ['480p', '720p', '1080p'],
  KLING: ['720p', '1080p'],
  VIDU: ['540P', '720P', '1080P'],
  WAN: ['480P', '720P', '1080P'],
  HAILUO: ['768P', '1080P'],
  LTX: ['1080P'],
  HAPPYHORSE: ['720P', '1080P'],
  BZA_X: ['480p', '720p'],
  BZA_V3: ['720p', '1080p', '4k'],
  DREAMACTOR: [],
};

export const VIDEO_RATIOS = {
  STANDARD: ['16:9', '9:16', '1:1'],
  EXTENDED: ['16:9', '9:16', '1:1', '4:3', '3:4'],
  SEEDANCE: ['auto', '16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
  HAPPYHORSE: ['16:9', '9:16', '1:1', '4:3', '3:4', '4:5', '5:4'],
  BZA_X: ['16:9', '2:3', '1:1', '3:2', '9:16'],
  BZA_V3: ['16:9', '9:16'],
  VIDU: ['16:9', '9:16', '4:3', '3:4', '1:1'],
  KLING: ['16:9', '9:16', '1:1'],
  WAN: ['16:9', '9:16', '1:1', '4:3', '3:4'],
};

export const SIZE_PRESETS = [
  { label: '1:1', width: 1024, height: 1024 },
  { label: '16:9', width: 1920, height: 1080 },
  { label: '9:16', width: 1080, height: 1920 },
  { label: '4:3', width: 1440, height: 1080 },
  { label: '3:4', width: 1080, height: 1440 },
  { label: '3:2', width: 1536, height: 1024 },
  { label: '2:3', width: 1024, height: 1536 },
];

export const STATUS_LABELS = { Pending: '排队中', Queuing: '排队中', Preparing: '准备中', Running: '生成中', Saving: '转存中', Success: '已完成', Failed: '失败' };
export const QUALITY_LABELS = { low: '低', medium: '中', high: '高' };

export const API_HOST = 'https://api.bizyair.cn';
export const API_BASE = `${API_HOST}/x/v1/modelzoo/tasks/openapi`;
export const WEBAPP_API_BASE = `${API_HOST}/w/v1/webapp/task/openapi`;
export const WEBAPP_DETAIL_URL = `${API_HOST}/x/v1/webapp`;
export const UPLOAD_TOKEN_URL = `${API_HOST}/x/v1/upload/token`;
export const COMMIT_RESOURCE_URL = `${API_HOST}/x/v1/input_resource/commit`;
export const USER_METADATA_URL = `${API_HOST}/x/v1/user/metadata`;
export const WALLET_BALANCE_URL = `${API_HOST}/y/v1/wallet`;
export const ENV_API_KEY = process.env.EXPO_PUBLIC_BIZYAIR_API_KEY || '';

export const REQUEST_TIMEOUT_MS = 15000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const POLLING_INTERVAL_MS = 3000;
export const TAB_FADE_OUT_MS = 120;
export const TAB_FADE_IN_MS = 180;

export const HISTORY_KEY = '@image_history';
export const API_KEY_STORAGE_KEY = '@api_key';
export const API_KEYS_STORAGE_KEY = '@api_keys';
export const ACTIVE_KEY_ID_KEY = '@active_key_id';
export const ACTIVE_TAB_KEY = '@active_tab';
export const HOME_STATE_KEY = '@home_state';
export const TOTAL_COINS_KEY = '@total_coins_spent';
export const TAB_HOME = 'home';
export const TAB_WEBAPP = 'webapp';
export const TAB_HISTORY = 'history';
export const PAGE_SIZE = 20;
