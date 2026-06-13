const MODE_LABELS = {
  'text-to-image': '文生图',
  'image-to-image': '图生图',
  'text-to-video': '文生视频',
  'image-to-video': '图生视频',
  'flf-to-video': '首尾帧',
  'reference-to-video': '参考视频',
  'video-edit': '视频编辑',
  'video-extend': '视频延长',
  'large-language-models': '对话',
  'vision': '视觉理解',
  'text-to-audio': '语音合成',
};

const initialState = {
  modelId: 'bza-image-b2-base',
  mode: 'text-to-image',
  prompt: '',
  imageUrls: [],
  resolution: '2K',
  aspectRatio: '4:3',
  quality: 'medium',
  sizePreset: 0,
  customWidth: '1024',
  customHeight: '1024',
  duration: 5,
  generateAudio: false,
  sound: false,
  multiShot: false,
  shotType: 'customize',
  multiPrompt: '',
  negativePrompt: '',
  promptExtend: true,
  watermark: true,
  seed: '',
  display: 'horizontal',
  keepOriginalSound: false,
  audio: false,
  offPeak: false,
  isRec: false,
  promptOptimizer: true,
  fastPretreatment: false,
  aigcWatermark: false,
  movementAmplitude: 'auto',
  videoUrls: [],
  firstFrameUrls: [],
  lastFrameUrls: [],
  mediaUrls: [],
  firstClipUrls: [],
  refImages: [],
  audioSetting: '',
  drivingAudio: '',
  audioUrl: '',
  referenceVoice: '',
  bboxList: '',
  systemPrompt: '',
  temperature: 1.0,
  maxTokens: 32768,
  enableThinking: true,
  enableSearch: false,
  detail: 'medium',
  captionType: 'Descriptive',
  captionLength: 'medium-length',
  doSample: false,
  extraOptions: '',
  nameInput: '',
  customPrompt: '',
  voice: 'vivian',
  responseFormat: 'mp3',
  instructions: '',
  language: 'Auto',
  speed: 1.0,
  enableSequential: false,
  thinkingMode: false,
  colorPalette: '',
  batchSize: 1,
  webSearch: false,
  returnLastFrame: false,
  topP: 0.95,
  style: 'general',
  steps: undefined,
  guidanceScale: undefined,
  outputmask: false,
  lyrics: '',
  tags: '',
};

const ARRAY_FIELDS = new Set([
  'imageUrls', 'videoUrls', 'firstFrameUrls', 'lastFrameUrls',
  'mediaUrls', 'firstClipUrls', 'refImages',
]);

function homeParamReducer(state, action) {
  switch (action.type) {
    case 'SET_PARAMS':
      return { ...state, ...action.params };
    case 'SET_FIELD': {
      const raw = typeof action.value === 'function' ? action.value(state[action.field]) : action.value;
      const value = ARRAY_FIELDS.has(action.field)
        ? (Array.isArray(raw) ? raw : [])
        : raw;
      return { ...state, [action.field]: value };
    }
    default:
      return state;
  }
}

export { MODE_LABELS, initialState, homeParamReducer };
