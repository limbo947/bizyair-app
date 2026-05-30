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
};

function homeParamReducer(state, action) {
  switch (action.type) {
    case 'SET_PARAMS':
      return { ...state, ...action.params };
    case 'SET_MODEL_ID':
      return { ...state, modelId: action.value };
    case 'SET_MODE':
      return { ...state, mode: action.value };
    case 'SET_PROMPT':
      return { ...state, prompt: action.value };
    case 'SET_IMAGE_URLS':
      return { ...state, imageUrls: Array.isArray(action.value) ? action.value : [] };
    case 'SET_RESOLUTION':
      return { ...state, resolution: action.value };
    case 'SET_ASPECT_RATIO':
      return { ...state, aspectRatio: action.value };
    case 'SET_QUALITY':
      return { ...state, quality: action.value };
    case 'SET_SIZE_PRESET':
      return { ...state, sizePreset: action.value };
    case 'SET_CUSTOM_WIDTH':
      return { ...state, customWidth: action.value };
    case 'SET_CUSTOM_HEIGHT':
      return { ...state, customHeight: action.value };
    case 'SET_DURATION':
      return { ...state, duration: action.value };
    case 'SET_GENERATE_AUDIO':
      return { ...state, generateAudio: action.value };
    case 'SET_SOUND':
      return { ...state, sound: action.value };
    case 'SET_MULTI_SHOT':
      return { ...state, multiShot: action.value };
    case 'SET_SHOT_TYPE':
      return { ...state, shotType: action.value };
    case 'SET_MULTI_PROMPT':
      return { ...state, multiPrompt: action.value };
    case 'SET_NEGATIVE_PROMPT':
      return { ...state, negativePrompt: action.value };
    case 'SET_PROMPT_EXTEND':
      return { ...state, promptExtend: action.value };
    case 'SET_WATERMARK':
      return { ...state, watermark: action.value };
    case 'SET_SEED':
      return { ...state, seed: action.value };
    case 'SET_DISPLAY':
      return { ...state, display: action.value };
    case 'SET_KEEP_ORIGINAL_SOUND':
      return { ...state, keepOriginalSound: action.value };
    case 'SET_AUDIO':
      return { ...state, audio: action.value };
    case 'SET_OFF_PEAK':
      return { ...state, offPeak: action.value };
    case 'SET_IS_REC':
      return { ...state, isRec: action.value };
    case 'SET_PROMPT_OPTIMIZER':
      return { ...state, promptOptimizer: action.value };
    case 'SET_FAST_PRETREATMENT':
      return { ...state, fastPretreatment: action.value };
    case 'SET_AIGC_WATERMARK':
      return { ...state, aigcWatermark: action.value };
    case 'SET_MOVEMENT_AMPLITUDE':
      return { ...state, movementAmplitude: action.value };
    case 'SET_VIDEO_URLS':
      return { ...state, videoUrls: Array.isArray(action.value) ? action.value : [] };
    case 'SET_FIRST_FRAME_URLS':
      return { ...state, firstFrameUrls: Array.isArray(action.value) ? action.value : [] };
    case 'SET_LAST_FRAME_URLS':
      return { ...state, lastFrameUrls: Array.isArray(action.value) ? action.value : [] };
    case 'SET_FIRST_CLIP_URLS':
      return { ...state, firstClipUrls: Array.isArray(action.value) ? action.value : [] };
    case 'SET_REF_IMAGES':
      return { ...state, refImages: Array.isArray(action.value) ? action.value : [] };
    case 'SET_AUDIO_SETTING':
      return { ...state, audioSetting: action.value };
    case 'SET_DRIVING_AUDIO':
      return { ...state, drivingAudio: action.value };
    case 'SET_AUDIO_URL':
      return { ...state, audioUrl: action.value };
    case 'SET_REFERENCE_VOICE':
      return { ...state, referenceVoice: action.value };
    case 'SET_BBOX_LIST':
      return { ...state, bboxList: action.value };
    case 'SET_SYSTEM_PROMPT':
      return { ...state, systemPrompt: action.value };
    case 'SET_TEMPERATURE':
      return { ...state, temperature: action.value };
    case 'SET_MAX_TOKENS':
      return { ...state, maxTokens: action.value };
    case 'SET_ENABLE_THINKING':
      return { ...state, enableThinking: action.value };
    case 'SET_ENABLE_SEARCH':
      return { ...state, enableSearch: action.value };
    case 'SET_DETAIL':
      return { ...state, detail: action.value };
    case 'SET_CAPTION_TYPE':
      return { ...state, captionType: action.value };
    case 'SET_CAPTION_LENGTH':
      return { ...state, captionLength: action.value };
    case 'SET_DO_SAMPLE':
      return { ...state, doSample: action.value };
    case 'SET_EXTRA_OPTIONS':
      return { ...state, extraOptions: action.value };
    case 'SET_NAME_INPUT':
      return { ...state, nameInput: action.value };
    case 'SET_CUSTOM_PROMPT':
      return { ...state, customPrompt: action.value };
    case 'SET_VOICE':
      return { ...state, voice: action.value };
    case 'SET_RESPONSE_FORMAT':
      return { ...state, responseFormat: action.value };
    case 'SET_INSTRUCTIONS':
      return { ...state, instructions: action.value };
    case 'SET_LANGUAGE':
      return { ...state, language: action.value };
    case 'SET_SPEED':
      return { ...state, speed: action.value };
    case 'SET_ENABLE_SEQUENTIAL':
      return { ...state, enableSequential: action.value };
    case 'SET_THINKING_MODE':
      return { ...state, thinkingMode: action.value };
    case 'SET_COLOR_PALETTE':
      return { ...state, colorPalette: action.value };
    case 'SET_BATCH_SIZE':
      return { ...state, batchSize: action.value };
    case 'SET_WEB_SEARCH':
      return { ...state, webSearch: action.value };
    case 'SET_RETURN_LAST_FRAME':
      return { ...state, returnLastFrame: action.value };
    case 'SET_TOP_P':
      return { ...state, topP: action.value };
    case 'SET_STYLE':
      return { ...state, style: action.value };
    default:
      return state;
  }
}

export { MODE_LABELS, initialState, homeParamReducer };
