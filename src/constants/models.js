import { BZA_RATIOS_FULL, BZA_RATIOS_10, BZA_RATIOS_10_ALT, O2_I2I_RATIOS } from './ratios';
import { STATUS_COLORS as THEME_STATUS_COLORS, STATUS_BG as THEME_STATUS_BG } from './theme';

export const MODELS = {
  'bza-image-b2-base': {
    name: 'B.2 渠道版',
    icon: { name: 'color-palette-outline', color: '#FF9500' },
    manufacturer: '谷歌',
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
    icon: { name: 'color-palette-outline', color: '#FF9500' },
    manufacturer: '谷歌',
    paramType: 'resolution-ratio',
    prices: { '0.5K': 550, '1K': 550, '2K': 850, '4K': 1100 },
    resolutions: ['0.5K', '1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_FULL,
    imageToImageRatios: BZA_RATIOS_FULL,
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-b-pro-base': {
    name: 'B.Pro 渠道版',
    icon: { name: 'color-palette-outline', color: '#FF9500' },
    manufacturer: '谷歌',
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
    icon: { name: 'color-palette-outline', color: '#FF9500' },
    manufacturer: '谷歌',
    paramType: 'resolution-ratio',
    prices: { '1K': 700, '2K': 1000, '4K': 1300 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: BZA_RATIOS_10,
    imageToImageRatios: BZA_RATIOS_10,
    maxPromptLength: 20000,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'bza-image-o2-base': {
    name: 'O.2 渠道版',
    icon: { name: 'hardware-chip-outline', color: '#5AC8FA' },
    manufacturer: 'OpenAI',
    paramType: 'resolution-ratio',
    prices: { '1K': 100, '2K': 100, '4K': 100 },
    resolutions: ['1K', '2K', '4K'],
    textToImageRatios: ['1:1','2:3','3:2','4:5','5:4','3:4','4:3','16:9','9:16','21:9'],
    imageToImageRatios: O2_I2I_RATIOS,
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 10,
    supportsImageToImage: true,
  },
  'bza-image-o2-official': {
    name: 'O.2 官方版',
    icon: { name: 'hardware-chip-outline', color: '#5AC8FA' },
    manufacturer: 'OpenAI',
    paramType: 'width-height-quality',
    qualities: ['low', 'medium', 'high'],
    priceNote: '按尺寸+质量计费',
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 16,
    supportsImageToImage: true,
  },
  'seedream-5-0-official': {
    name: 'Seedream 5.0',
    icon: { name: 'leaf-outline', color: '#34C759' },
    manufacturer: '字节',
    paramType: 'size-only',
    prices: { '2K': 220, '3K': 220, '4K': 220 },
    resolutions: ['2K', '3K', '4K'],
    maxPromptLength: 2500,
    imageField: 'image_urls',
    maxImages: 14,
    supportsImageToImage: true,
  },
  'wan-2-7-image-official': {
    name: '万相2.7',
    icon: { name: 'grid-outline', color: '#007AFF' },
    manufacturer: '阿里',
    paramType: 'wan-size',
    prices: { '1K': 200, '2K': 200, '4K': 200 },
    resolutions: ['1K', '2K', '4K', 'Custom'],
    maxPromptLength: 5000,
    imageField: 'images',
    maxImages: 9,
    supportsImageToImage: true,
    i2iResolutions: ['1K', '2K', 'Custom'],
  },
  'wan-2-7-image-pro-offcial': {
    name: '万相2.7 Pro',
    icon: { name: 'grid-outline', color: '#007AFF' },
    manufacturer: '阿里',
    paramType: 'wan-size',
    prices: { '1K': 500, '2K': 500, '4K': 500 },
    resolutions: ['1K', '2K', '4K', 'Custom'],
    maxPromptLength: 5000,
    imageField: 'images',
    maxImages: 9,
    supportsImageToImage: true,
    i2iResolutions: ['1K', '2K', 'Custom'],
  },
  'z-image-turbo': {
    name: 'Z-Image Turbo',
    icon: { name: 'flash-outline', color: '#AF52DE' },
    manufacturer: '硅基流动',
    paramType: 'width-height',
    prices: { '1024': 5, '2048': 10 },
    maxPromptLength: 2500,
    supportsImageToImage: false,
  },
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

export const STATUS_LABELS = { Pending: '排队中', Running: '生成中', Saving: '转存中', Success: '已完成', Failed: '失败' };
export const STATUS_COLORS = THEME_STATUS_COLORS;
export const STATUS_BG = THEME_STATUS_BG;
export const QUALITY_LABELS = { low: '低', medium: '中', high: '高' };

export const API_HOST = 'https://api.bizyair.cn';
export const API_BASE = `${API_HOST}/x/v1/modelzoo/tasks/openapi`;
export const UPLOAD_TOKEN_URL = `${API_HOST}/x/v1/upload/token`;
export const COMMIT_RESOURCE_URL = `${API_HOST}/x/v1/input_resource/commit`;
export const ENV_API_KEY = process.env.EXPO_PUBLIC_BIZYAIR_API_KEY || '';

export const REQUEST_TIMEOUT_MS = 15000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const POLLING_INTERVAL_MS = 3000;
export const TAB_FADE_OUT_MS = 120;
export const TAB_FADE_IN_MS = 180;

export const HISTORY_KEY = '@image_history';
export const API_KEY_STORAGE_KEY = '@api_key';
export const ACTIVE_TAB_KEY = '@active_tab';
export const HOME_STATE_KEY = '@home_state';
export const TOTAL_COINS_KEY = '@total_coins_spent';
export const TAB_HOME = 'home';
export const TAB_HISTORY = 'history';
export const PAGE_SIZE = 20;
