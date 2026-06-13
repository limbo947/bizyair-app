// ─── 价格常量 ────────────────────────────────────────────────────────────────

/** O.2 官方版按像素层级计费表 */
export const O2_PRICE_TIERS = {
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
export const SEEDANCE_RATES = { withRefVideo: 59, withoutRefVideo: 98 };
export const SEEDANCE_FAST_RATE = 80;
/** Seedance 2.0 渠道版 按分辨率×时长计费 */
export const SEEDANCE_BASE_PRICES = { '480p': 600, '720p': 1200, 'native1080p': 3000, '1080p': 1480, '2k': 1620, '4k': 1830 };
/** Seedance 2.0 Fast 渠道版 按分辨率×时长计费 */
export const SEEDANCE_FAST_BASE_PRICES = { '480p': 500, '720p': 1000, '1080p': 1200, '2k': 1420, '4k': 1630 };

/** 可灵系列按秒计费 */
export const KLING_O3_PRO_RATES = { sound: 900, noSound: 700 };
export const KLING_PRO_RATES = { sound: 1050, noSound: 700 };
export const KLING_STD_RATES = { sound: 800, noSound: 550 };
/** 可灵 O3 4K 按秒计费（keepOriginalSound） */
export const KLING_O3_4K_RATES = { keepOriginalSound: 700, noKeepOriginalSound: 550 };

/** Vidu Q3 Pro 按分辨率计费 */
export const VIDU_Q3_PRO_PRICES = { '540P': 438, '720P': 938, '1080P': 1000 };
export const VIDU_Q3_PRO_BASE_T2V_PRICES = { '540P': 310, '720P': 660, '1080P': 700 };
export const VIDU_Q3_PRO_BASE_I2V_PRICES = { '540P': 350, '720P': 700, '1080P': 750 };
/** Vidu Q3 Turbo 按分辨率计费 */
export const VIDU_Q3_TURBO_PRICES = { '540P': 250, '720P': 375, '1080P': 500 };
/** Vidu Q3 Turbo 渠道版 按分辨率计费 */
export const VIDU_Q3_TURBO_BASE_PRICES = { '540P': 200, '720P': 300, '1080P': 350 };

/** 万相2.7视频 按分辨率计费 */
export const WAN_27_VIDEO_PRICES = { '720P': 600, '1080P': 1000 };
/** 万相2.7视频延长 按分辨率计费 */
export const WAN_27_EXTEND_PRICES = { '480P': 300, '720P': 600, '1080P': 1000 };
/** 万相2.5/2.6图生视频 按分辨率计费 */
export const WAN_I2V_PRICES = { '480P': 300, '720P': 600, '1080P': 1000 };

/** 海螺2.3 按分辨率+时长组合计费 */
export const HAILUO_23_PRICES = { '768P/6': 1600, '768P/10': 3200, '1080P/6': 2800 };
/** 海螺2.3 Fast 按分辨率+时长组合计费 */
export const HAILUO_23_FAST_PRICES = { '768P/6': 1080, '768P/10': 1800, '1080P/6': 1850 };

/** HappyHorse 按分辨率计费 */
export const HAPPYHORSE_PRICES = { '720P': 900, '1080P': 1600 };

/** Video V3.1 Pro 按分辨率计费 */
export const BZA_V3_PRO_PRICES = { '720p': 800, '1080p': 1000, '4k': 1400 };
/** Video V3.1 Fast 按分辨率计费 */
export const BZA_V3_FAST_PRICES = { '720p': 200, '1080p': 250, '4k': 500 };

/** Video V3.1 Lite 官方版 按分辨率×时长×音频计费 */
export const BZA_V3_LITE_OFFICIAL_PRICES = {
  '720p': { 4: { false: 720, true: 1200 }, 6: { false: 1080, true: 1800 }, 8: { false: 1440, true: 2400 } },
  '1080p': { 4: { false: 1200, true: 2000 }, 6: { false: 1800, true: 3000 }, 8: { false: 2400, true: 4000 } },
};
/** Video V3.1 官方版 按分辨率×时长×音频计费 */
export const BZA_V3_OFFICIAL_PRICES = {
  '720p': { 4: { false: 4800, true: 9600 }, 6: { false: 7200, true: 14400 }, 8: { false: 9600, true: 19200 } },
  '1080p': { 4: { false: 4800, true: 9600 }, 6: { false: 7200, true: 14400 }, 8: { false: 9600, true: 19200 } },
  '4k': { 4: { false: 9600, true: 13000 }, 6: { false: 14400, true: 19500 }, 8: { false: 19200, true: 26000 } },
};
/** Video V3.1 Fast 官方版 按分辨率×时长×音频计费 */
export const BZA_V3_FAST_OFFICIAL_PRICES = {
  '720p': { 4: { false: 2000, true: 2400 }, 6: { false: 3000, true: 3600 }, 8: { false: 4000, true: 4800 } },
  '1080p': { 4: { false: 2400, true: 3000 }, 6: { false: 3600, true: 4500 }, 8: { false: 4800, true: 6000 } },
  '4k': { 4: { false: 6000, true: 6800 }, 6: { false: 9000, true: 10200 }, 8: { false: 12000, true: 13600 } },
};

/** Video G.Omni Flash 按分辨率×时长计费 */
export const BZA_VIDEO_G_PRICES = {
  '720p': { 4: 280, 6: 280, 8: 280, 10: 300 },
  '1080p': { 4: 280, 6: 280, 8: 280, 10: 300 },
  '4k': { 4: 450, 6: 510, 8: 540, 10: 600 },
};

/** Z-Image Turbo 按像素面积计费阈值 */
export const Z_IMAGE_PRICES = { small: 5, large: 10 };
export const Z_IMAGE_PIXEL_THRESHOLD = 1024 * 1024;

/** Video X 按时长计费 */
export const BZA_VIDEO_X_PRICES = { 6: 1900, 10: 3150 };
/** Video X 渠道版 按秒计费 */
export const BZA_VIDEO_X_BASE_RATE = 50;

/** LTX 2.3 固定价格 */
export const LTX_PRICE = 300;

/** DreamActor 2.0 固定价格 */
export const DREAMACTOR_PRICE = 350;

/** JoyCaption3 固定价格 */
export const JOYCAPTION_PRICE = 6;

/** Qwen3 TTS 固定价格 */
export const TTS_PRICE = 10;

/** BiRefNet 固定价格 */
export const BIREFNET_PRICE = 2;
/** ACE Step 固定价格 */
export const ACE_STEP_PRICE = 1;
/** SeedVR2 按分辨率计费 */
export const SEEDVR2_PRICES = { 720: 1, 1080: 2, 1440: 3, 2160: 4 };
/** Flux Klein 固定价格 */
export const FLUX_KLEIN_PRICE = 60;
/** Kontext-dev-LoRA 固定价格 */
export const KONTEXT_LORA_PRICE = 50;

/** Qwen-Image 固定价格 */
export const QWEN_IMAGE_PRICE = 100;

// ─── 通用价格计算函数 ─────────────────────────────────────────────────────────

/** 按秒计费：duration × 单价 */
export function calcByDuration(rate) {
  return (params) => {
    const dur = params.duration === 'auto' ? 5 : (parseInt(params.duration) || params.duration || 5);
    return rate * dur;
  };
}

/** 按分辨率×时长计费 */
export function calcByResolutionDuration(prices, defaultRate) {
  return (params) => {
    const dur = params.duration || 5;
    const rate = prices[params.resolution] || defaultRate;
    return rate * dur;
  };
}

/** 按分辨率+时长组合计费 */
export function calcByCombo(prices, defaultPrice) {
  return (params) => {
    const combo = `${params.resolution}/${params.duration}`;
    return prices[combo] || defaultPrice;
  };
}

/** 按分辨率固定价格（不乘时长） */
export function calcByResolution(prices, defaultPrice) {
  return (params) => prices[params.resolution] || defaultPrice;
}

/** O.2 官方版按像素层级计费 */
export function calcO2Price(params) {
  const w = params.width || 1024;
  const h = params.height || 1024;
  const q = params.quality || 'medium';
  const pixels = w * h;
  const tiers = O2_PRICE_TIERS[q] || O2_PRICE_TIERS.medium;
  const tier = tiers.find((t) => pixels <= t.max);
  return tier ? tier.price : tiers[tiers.length - 1].price;
}

/** Seedance 2.0 按秒计费（区分有无参考视频） */
export function calcSeedancePrice(params) {
  const dur = params.duration === 'auto' ? 5 : parseInt(params.duration) || 5;
  const hasRefVideo = params.videoUrls?.length > 0;
  const rate = hasRefVideo ? SEEDANCE_RATES.withRefVideo : SEEDANCE_RATES.withoutRefVideo;
  return rate * dur;
}

/** 可灵系列按秒计费（区分有无声音） */
export function calcKlingPrice(rates) {
  return (params) => {
    const dur = params.duration || 5;
    const rate = params.sound ? rates.sound : rates.noSound;
    return rate * dur;
  };
}

/** 可灵 O3 4K 按秒计费（区分是否保留原始声音） */
export function calcKlingO3_4KPrice(params) {
  const dur = params.duration || 5;
  const rate = params.keepOriginalSound ? KLING_O3_4K_RATES.keepOriginalSound : KLING_O3_4K_RATES.noKeepOriginalSound;
  return rate * dur;
}

/** Video X 按时长计费 */
export function calcBzaVideoXPrice(params) {
  const dur = parseInt(params.duration) || 6;
  return BZA_VIDEO_X_PRICES[dur] || BZA_VIDEO_X_PRICES[6];
}

/** Z-Image Turbo 按像素面积计费 */
export function calcZImagePrice(params) {
  const w = params.width || 1024;
  const h = params.height || 1024;
  return w * h <= Z_IMAGE_PIXEL_THRESHOLD ? Z_IMAGE_PRICES.small : Z_IMAGE_PRICES.large;
}

/** Vidu Q3 Pro 渠道版 按模式区分价格计费 */
export function calcViduQ3ProBasePrice(params) {
  const isI2V = params.imageUrls?.length > 0 || params.lastFrameUrls?.length > 0;
  const prices = isI2V ? VIDU_Q3_PRO_BASE_I2V_PRICES : VIDU_Q3_PRO_BASE_T2V_PRICES;
  const dur = params.duration || 5;
  const rate = prices[params.resolution] || 660;
  return rate * dur;
}

/** Vidu Q3 Pro 官方版 按分辨率*时长计费 + is_rec 额外费用 */
export function calcViduQ3ProOfficialPrice(params) {
  const dur = params.duration || 5;
  const rate = VIDU_Q3_PRO_PRICES[params.resolution] || 938;
  let price = rate * dur;
  if (params.isRec) price += 320;
  return price;
}

/** Vidu Q3 Turbo 官方版 按分辨率*时长计费 + is_rec 额外费用 */
export function calcViduQ3TurboOfficialPrice(params) {
  const dur = params.duration || 5;
  const rate = VIDU_Q3_TURBO_PRICES[params.resolution] || 375;
  let price = rate * dur;
  if (params.isRec) price += 320;
  return price;
}

/** 固定价格（忽略参数） */
export function calcFixedPrice(price) {
  return () => price;
}

/** Video V3.1 官方版 按分辨率×时长×音频计费 */
export function calcV3OfficialPrice(priceTable) {
  return (params) => {
    const res = params.resolution || '720p';
    const dur = parseInt(params.duration) || 4;
    const audio = !!params.generateAudio;
    return priceTable[res]?.[dur]?.[audio] || priceTable[res]?.[4]?.[false] || 720;
  };
}

/** Video G.Omni Flash 按分辨率×时长计费 */
export function calcVideoGPrice(params) {
  const res = params.resolution || '720p';
  const dur = parseInt(params.duration) || 4;
  return BZA_VIDEO_G_PRICES[res]?.[dur] || 280;
}
