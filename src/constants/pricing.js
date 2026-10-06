// ─── 价格常量（国际版价表，2026-10-06 price_table API 快照，数值 = wallet 扣费单位）───
// 单位三类：call/image=按次、second=按秒（×duration）、M Tokens=每百万 token（input/output 分列）

/** GPT Image 2 官方版按质量×像素计费表（pixels 阈值：1920*1080=2073600；2560*1440=3686400） */
export const O2_PRICE_TIERS = {
  high: [{ max: 2073600, price: 275 }, { max: 3686400, price: 300 }, { max: Infinity, price: 500 }],
  medium: [{ max: 2073600, price: 70 }, { max: 3686400, price: 75 }, { max: Infinity, price: 130 }],
  low: [{ max: 2073600, price: 8 }, { max: 3686400, price: 12 }, { max: Infinity, price: 16 }],
};

/** Seedance 2.0 官方版/Fast 官方版 每秒价（ref 按有无参考视频分档；flf 4K 独立档） */
export const SEEDANCE_OFFICIAL_PRICES = {
  t2v: { '480p': 160, '720p': 350, '1080p': 720, '4k': 1350 },
  flf: { '480p': 160, '720p': 350, '1080p': 720, '4k': 1700 },
  refNoRef: { '480p': 160, '720p': 350, '1080p': 720, '4k': 1350 },
  refWithRef: { '480p': 120, '720p': 260, '1080p': 450, '4k': 900 },
};
export const SEEDANCE_FAST_OFFICIAL_PRICES = {
  t2v: { '480p': 140, '720p': 280 }, flf: { '480p': 140, '720p': 280 },
  refNoRef: { '480p': 140, '720p': 280 }, refWithRef: { '480p': 85, '720p': 185 },
};
/** 旧"每 M Tokens"计价常量废弃，仅为兼容 re-export 保留 */
export const SEEDANCE_RATES = { withRefVideo: 120, withoutRefVideo: 160 };
export const SEEDANCE_FAST_RATE = 140;
/** Seedance 2.0 渠道版/Fast 渠道版 每秒价（t2v/flf 与 ref 有参考视频分档；国际枚举含 native 档） */
export const SEEDANCE_BASE_PRICES = { '480p': 140, '720p': 300, native1080p: 600, '1080p': 350, '2k': 375, '4k': 400, native4k: 1250 };
export const SEEDANCE_BASE_REF_PRICES = { '480p': 150, '720p': 275, native1080p: 600, '1080p': 300, '2k': 325, '4k': 350, native4k: 1150 };
export const SEEDANCE_FAST_BASE_PRICES = { '480p': 140, '720p': 250, '1080p': 325, '2k': 350, '4k': 400 };
export const SEEDANCE_FAST_BASE_REF_PRICES = { '480p': 100, '720p': 225, '1080p': 275, '2k': 300, '4k': 325 };
/** 可灵 channel 系每秒价（sound 布尔分档；o3 系 std 与 pro 同价） */
export const KLING_O3_PRO_RATES = { sound: 150, noSound: 130 };
export const KLING_PRO_RATES = { sound: 210, noSound: 150 };
export const KLING_STD_RATES = { sound: 150, noSound: 130 };
/** 可灵 3.0 Std 渠道版（与 O3 系不同价，独立表） */
export const KLING_30_STD_RATES = { sound: 150, noSound: 110 };
/** 可灵 O3 4K 每秒 663，sound 无差价（旧 keepOriginalSound 分档废弃，常量保留兼容 re-export） */
export const KLING_O3_4K_RATES = { keepOriginalSound: 663, noKeepOriginalSound: 663 };

/** Vidu Q3 官方版每秒价（分辨率国际为小写枚举） */
export const VIDU_Q3_PRO_PRICES = { '540p': 90, '720p': 160, '1080p': 180 };
export const VIDU_Q3_TURBO_PRICES = { '540p': 55, '720p': 85, '1080p': 100 };
/** Vidu Q3 渠道版每秒价（国际 i2v/t2v 同价，旧 T2V/I2V 分表废弃、保留兼容 re-export） */
export const VIDU_Q3_PRO_BASE_PRICES = { '540p': 70, '720p': 140, '1080p': 160 };
export const VIDU_Q3_PRO_BASE_T2V_PRICES = VIDU_Q3_PRO_BASE_PRICES;
export const VIDU_Q3_PRO_BASE_I2V_PRICES = VIDU_Q3_PRO_BASE_PRICES;
export const VIDU_Q3_TURBO_BASE_PRICES = { '540p': 50, '720p': 80, '1080p': 90 };

/** 万相2.7视频 每秒价 */
export const WAN_27_VIDEO_PRICES = { '720P': 125, '1080P': 215 };
/** 以下两表所属模型已下架，常量仅为兼容 re-export 保留 */
export const WAN_27_EXTEND_PRICES = { '720P': 125, '1080P': 215 };
export const WAN_I2V_PRICES = { '480P': 300, '720P': 600, '1080P': 1000 };

/** 海螺2.3 channel 按 分辨率+时长组合 计费（call，不乘时长） */
export const HAILUO_23_PRICES = { '768P/6': 350, '768P/10': 700, '1080P/6': 600 };
export const HAILUO_23_FAST_PRICES = { '768P/6': 240, '768P/10': 400, '1080P/6': 400 };

/** HappyHorse 每秒价 */
export const HAPPYHORSE_PRICES = { '720P': 180, '1080P': 280 };

/** Google Veo 3.1 channel（duration 恒 8s，call 单价） */
export const BZA_V3_PRO_PRICES = { '720p': 180, '1080p': 250, '4k': 300 };
export const BZA_V3_FAST_PRICES = { '720p': 300, '1080p': 300, '4k': 300 };

/** Google Veo 3.1 official 系每秒价（按 分辨率×generate_audio 分档） */
export const BZA_V3_OFFICIAL_PRICES = {
  '720p': { false: 170, true: 350 }, '1080p': { false: 170, true: 350 }, '4k': { false: 350, true: 500 },
};
export const BZA_V3_FAST_OFFICIAL_PRICES = {
  '720p': { false: 70, true: 90 }, '1080p': { false: 90, true: 100 }, '4k': { false: 215, true: 250 },
};
export const BZA_V3_LITE_OFFICIAL_PRICES = {
  '720p': { false: 25, true: 42 }, '1080p': { false: 42, true: 70 },
};

/** Gemini Omni Flash 按 分辨率×时长档 计费（call，时长档已含在表内） */
export const BZA_VIDEO_G_PRICES = {
  '720p': { 4: 350, 6: 350, 8: 350, 10: 420 },
  '1080p': { 4: 350, 6: 350, 8: 350, 10: 420 },
  '4k': { 4: 500, 6: 600, 8: 700, 10: 800 },
};

/** Z-Image Turbo 固定 5/次；旧按像素分档常量与 Z-Image Base 计价基数（8 金币 = MP × steps/28） */
export const Z_IMAGE_PRICES = { small: 5, large: 10 };
export const Z_IMAGE_PIXEL_THRESHOLD = 1024 * 1024;
export const Z_IMAGE_BASE_MP_PRICE = 8;

/** Grok Imagine 每秒价 */
export const BZA_VIDEO_X_OFFICIAL_RATE = 80;
export const BZA_VIDEO_X_BASE_RATE = 60;
/** 旧 official 按时长档计费常量废弃、保留兼容 re-export */
export const BZA_VIDEO_X_PRICES = { 6: 1900, 10: 3150 };

/** LTX 2.3 已下架，常量仅为兼容 re-export 保留 */
export const LTX_PRICE = 300;

/** DreamActor 2.0 channel 每秒价 */
export const DREAMACTOR_PRICE = 80;

/** JoyCaption3 / Qwen3 TTS / BiRefNet / Flux Klein / Kontext LoRA 固定价 */
export const JOYCAPTION_PRICE = 1;
export const TTS_PRICE = 10;
export const BIREFNET_PRICE = 2;
export const ACE_STEP_PRICE = 0;
export const FLUX_KLEIN_PRICE = 10;
export const KONTEXT_LORA_PRICE = 30;
export const QWEN_IMAGE_PRICE = 20;
/** SeedVR2 按分辨率计费 */
export const SEEDVR2_PRICES = { 720: 1, 1080: 2, 1440: 4, 2160: 8 };

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

/** Seedance 每秒计价工厂：按参数推断 mode（ref 依有无参考视频分档）取每秒价 × 时长 */
export function calcSeedancePrice(tables) {
  return (params) => {
    const dur = params.duration === 'auto' ? 5 : parseInt(params.duration) || 5;
    const hasRefVideo = params.refVideos?.length > 0;
    const isRef = hasRefVideo || params.refImages?.length > 0 || params.refAudios?.length > 0;
    const isFlf = params.firstFrameUrls?.length > 0 || params.lastFrameUrls?.length > 0;
    const table = isRef ? (hasRefVideo ? tables.refWithRef : tables.refNoRef) : (isFlf ? tables.flf : tables.t2v);
    const rate = table[params.resolution] || table['720p'] || Object.values(table)[0];
    return rate * dur;
  };
}

/** GPT Image 2 官方版：质量×像素计费；i2i 多图部分按 Input 价 50/张 叠加 */
export function calcO2Price(params) {
  const w = params.width || 1024;
  const h = params.height || 1024;
  const q = params.quality || 'medium';
  const pixels = w * h;
  const tiers = O2_PRICE_TIERS[q] || O2_PRICE_TIERS.medium;
  const tier = tiers.find((t) => pixels <= t.max);
  let price = tier ? tier.price : tiers[tiers.length - 1].price;
  const extraImages = (params.imageUrls?.length || 0) - 1;
  if (extraImages > 0) price += extraImages * 50;
  return price;
}

/** 可灵系列每秒计费（区分有无声音） */
export function calcKlingPrice(rates) {
  return (params) => {
    const dur = params.duration || 5;
    const rate = params.sound ? rates.sound : rates.noSound;
    return rate * dur;
  };
}

/** 可灵 O3 4K 每秒计费（sound 无差价，保留函数兼容旧引用） */
export function calcKlingO3_4KPrice(params) {
  const dur = params.duration || 5;
  return 663 * dur;
}

/** Vidu Q3 官方版每秒计费（国际价格表无 is_rec 差价，旧 +320 废弃） */
export function calcViduQ3ProOfficialPrice(params) {
  const dur = params.duration || 5;
  return (VIDU_Q3_PRO_PRICES[params.resolution] || 160) * dur;
}

export function calcViduQ3TurboOfficialPrice(params) {
  const dur = params.duration || 5;
  return (VIDU_Q3_TURBO_PRICES[params.resolution] || 85) * dur;
}

/** Vidu Q3 渠道版每秒计费（i2v/t2v 同价） */
export function calcViduQ3ProBasePrice(params) {
  const dur = params.duration || 5;
  return (VIDU_Q3_PRO_BASE_PRICES[params.resolution] || 140) * dur;
}

/** 固定价格（忽略参数） */
export function calcFixedPrice(price) {
  return () => price;
}

/** Google Veo 3.1 official 系每秒计费（分辨率×generate_audio 分档） */
export function calcV3OfficialPrice(priceTable) {
  return (params) => {
    const res = params.resolution || '720p';
    const dur = parseInt(params.duration) || 4;
    const audioTable = priceTable[res] || priceTable['720p'];
    const rate = audioTable[!!params.generateAudio] ?? audioTable.false ?? 0;
    return rate * dur;
  };
}

/** Gemini Omni Flash 按分辨率×时长档计费 */
export function calcVideoGPrice(params) {
  const res = params.resolution || '720p';
  const dur = parseInt(params.duration) || 4;
  return BZA_VIDEO_G_PRICES[res]?.[dur] || 350;
}

/** Z-Image Base 按像素×步数计费：8 金币 / (MP × steps / 28) */
export function calcZImageBasePrice(params) {
  const w = params.width || 1024;
  const h = params.height || 1024;
  const mp = (w * h) / 1048576;
  const steps = parseInt(params.steps) || 28;
  return Math.ceil((mp * steps * Z_IMAGE_BASE_MP_PRICE) / 28);
}

/** 以下两个函数所属计价方式已废弃（国际价改固定 5/次、按时长），仅为兼容 re-export 保留 */
export function calcZImagePrice(params) {
  const w = params.width || 1024;
  const h = params.height || 1024;
  return w * h <= Z_IMAGE_PIXEL_THRESHOLD ? Z_IMAGE_PRICES.small : Z_IMAGE_PRICES.large;
}

export function calcBzaVideoXPrice(params) {
  const dur = parseInt(params.duration) || 6;
  return BZA_VIDEO_X_PRICES[dur] || BZA_VIDEO_X_PRICES[6];
}

/** Seedream 5.0 Pro（≤2.61M px=80、>2.61M=160；edit 多图 Input 另收 3/张） */
export function calcSeedream5Price(params) {
  const base = { '1K': 1024, '2K': 2048 }[params.resolution] || 1024;
  let price = base * base <= 2610000 ? 80 : 160;
  const extraImages = (params.imageUrls?.length || 0) - 1;
  if (extraImages > 0) price += extraImages * 3;
  return price;
}
