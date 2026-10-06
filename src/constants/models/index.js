// MODELS 聚合入口 —— 原 models.js 按 800 行约束拆分（§5.6），
// 对外接口不变：import 路径 ../constants/models 解析到本文件，具名导出全部保留
import { IMAGE_MODELS } from './image';
import { VIDEO_MODELS } from './video';
import { LLM_VISION_MODELS } from './llm-vision';
import { AUDIO_MODELS } from './audio';
import { OTHER_MODELS } from './other';

export const MODELS = {
  ...IMAGE_MODELS,
  ...VIDEO_MODELS,
  ...LLM_VISION_MODELS,
  ...AUDIO_MODELS,
  ...OTHER_MODELS,
};

// ─── Re-export for backward compatibility ──────────────────────────────────────
export {
  O2_PRICE_TIERS, SEEDANCE_RATES, SEEDANCE_FAST_RATE, SEEDANCE_BASE_PRICES, SEEDANCE_FAST_BASE_PRICES,
  KLING_O3_PRO_RATES, KLING_PRO_RATES, KLING_STD_RATES, KLING_O3_4K_RATES,
  VIDU_Q3_PRO_PRICES, VIDU_Q3_PRO_BASE_T2V_PRICES, VIDU_Q3_PRO_BASE_I2V_PRICES,
  VIDU_Q3_TURBO_PRICES, VIDU_Q3_TURBO_BASE_PRICES,
  WAN_27_VIDEO_PRICES, WAN_27_EXTEND_PRICES, WAN_I2V_PRICES,
  HAILUO_23_PRICES, HAILUO_23_FAST_PRICES, HAPPYHORSE_PRICES,
  BZA_V3_PRO_PRICES, BZA_V3_FAST_PRICES,
  BZA_V3_LITE_OFFICIAL_PRICES, BZA_V3_OFFICIAL_PRICES, BZA_V3_FAST_OFFICIAL_PRICES,
  BZA_VIDEO_G_PRICES, Z_IMAGE_PRICES, Z_IMAGE_PIXEL_THRESHOLD,
  BZA_VIDEO_X_PRICES, BZA_VIDEO_X_BASE_RATE,
  LTX_PRICE, DREAMACTOR_PRICE, JOYCAPTION_PRICE, TTS_PRICE, BIREFNET_PRICE,
  ACE_STEP_PRICE, SEEDVR2_PRICES, FLUX_KLEIN_PRICE, KONTEXT_LORA_PRICE, QWEN_IMAGE_PRICE,
  calcByDuration, calcByResolutionDuration, calcByCombo, calcByResolution,
  calcO2Price, calcSeedancePrice, calcKlingPrice, calcKlingO3_4KPrice,
  calcBzaVideoXPrice, calcZImagePrice, calcViduQ3ProBasePrice,
  calcViduQ3ProOfficialPrice, calcViduQ3TurboOfficialPrice,
  calcFixedPrice, calcV3OfficialPrice, calcVideoGPrice,
} from '../pricing';

export {
  HISTORY_KEY, API_KEY_STORAGE_KEY, API_KEYS_STORAGE_KEY, ACTIVE_KEY_ID_KEY,
  ACTIVE_TAB_KEY, HOME_STATE_KEY, MODEL_STATES_KEY, TOTAL_COINS_KEY,
} from '../storageKeys';

export {
  VIDEO_RESOLUTIONS, VIDEO_RATIOS, SIZE_PRESETS, STATUS_LABELS, QUALITY_LABELS,
  TAB_HOME, TAB_WEBAPP, TAB_HISTORY, PAGE_SIZE,
} from '../uiConstants';
