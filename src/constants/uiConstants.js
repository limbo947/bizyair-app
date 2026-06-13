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
  BZA_G: ['720p', '1080p', '4k'],
  DREAMACTOR: [],
};

export const VIDEO_RATIOS = {
  STANDARD: ['16:9', '9:16', '1:1'],
  EXTENDED: ['16:9', '9:16', '1:1', '4:3', '3:4'],
  SEEDANCE: ['auto', '16:9', '4:3', '1:1', '3:4', '9:16', '21:9'],
  HAPPYHORSE: ['16:9', '9:16', '1:1', '4:3', '3:4', '4:5', '5:4'],
  BZA_X: ['16:9', '2:3', '1:1', '3:2', '9:16'],
  BZA_V3: ['16:9', '9:16'],
  BZA_G: ['16:9', '9:16'],
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

export const TAB_HOME = 'home';
export const TAB_WEBAPP = 'webapp';
export const TAB_HISTORY = 'history';
export const PAGE_SIZE = 20;
