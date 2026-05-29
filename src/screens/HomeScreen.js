import React, { useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react';
import { Pressable, Text,
  View,
  TextInput,
  Keyboard,
  ScrollView,
  ActivityIndicator, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApiKeyContext } from '../context/ApiKeyContext';
import { useHistoryContext } from '../context/HistoryContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { submitImageTask, submitVideoTask, submitLLMTask, submitVisionTask, submitTTSTask } from '../services/apiClient';
import { calculatePrice, getRatios, getResolutions, getModelInfo, getActualResolution, getModelModes, getOutputType } from '../utils/modelHelpers';
import { buildPayload } from '../utils/payloadBuilder';
import { generateId } from '../utils/helpers';
import { ENV_API_KEY } from '../constants/models';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ModelSelector } from '../components/ModelSelector';
import { FavoriteModelsLayer } from '../components/FavoriteModelsLayer';
import { ApiKeyDropdown } from '../components/ApiKeyDropdown';
import { HomeParamControls } from '../components/HomeParamControls';
import { ResizableTextInput } from '../components/ResizableTextInput';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useFileUpload } from '../hooks/useFileUpload';

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
      return { ...state, imageUrls: action.value };
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
      return { ...state, videoUrls: action.value };
    case 'SET_FIRST_FRAME_URLS':
      return { ...state, firstFrameUrls: action.value };
    case 'SET_LAST_FRAME_URLS':
      return { ...state, lastFrameUrls: action.value };
    case 'SET_FIRST_CLIP_URLS':
      return { ...state, firstClipUrls: action.value };
    case 'SET_REF_IMAGES':
      return { ...state, refImages: action.value };
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

export function HomeScreen({ onOpenModelSelect }) {
  const insets = useSafeAreaInsets();
  const {
    apiKey,
    setApiKey,
    saveApiKey,
    apiKeys,
    activeApiKeyId,
    addApiKey,
    removeApiKey,
    switchApiKey,
    renameApiKey,
    userInfo,
    walletBalance,
    refreshUserInfo,
  } = useApiKeyContext();
  const {
    addToHistory,
    startPolling,
    updateHistoryItem,
    homeState,
    saveHomeState,
    addCoinsSpent,
    history,
  } = useHistoryContext();
  const { favorites } = useFavoritesContext();
  const { themeMode, toggleTheme, colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [state, stateDispatch] = useReducer(homeParamReducer, {
    ...initialState,
    ...homeState,
  });

  const selfSaveRef = useRef(false);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    if (selfSaveRef.current) {
      selfSaveRef.current = false;
      return;
    }
    const s = stateRef.current;
    const patch = {};
    if (homeState.modelId !== undefined && homeState.modelId !== s.modelId) {
      patch.modelId = homeState.modelId;
    }
    if (homeState.mode !== undefined && homeState.mode !== s.mode) {
      patch.mode = homeState.mode;
    }
    if (Object.keys(patch).length > 0) {
      stateDispatch({ type: 'SET_PARAMS', params: patch });
    }
  }, [homeState.modelId, homeState.mode]);
  const {
    modelId, mode, prompt, imageUrls, resolution, aspectRatio, quality,
    sizePreset, customWidth, customHeight, duration, generateAudio, sound,
    multiShot, shotType, multiPrompt, negativePrompt, promptExtend,
    watermark, seed, display, keepOriginalSound, audio, offPeak, isRec,
    promptOptimizer, fastPretreatment, aigcWatermark, movementAmplitude,
    videoUrls, firstFrameUrls, lastFrameUrls, mediaUrls, firstClipUrls,
    refImages, audioSetting, drivingAudio, audioUrl, referenceVoice,
    bboxList, systemPrompt, temperature, maxTokens, enableThinking,
    enableSearch, detail, captionType, captionLength, doSample,
    extraOptions, nameInput, customPrompt, voice, responseFormat,
    instructions, language, speed, enableSequential, thinkingMode,
    colorPalette, batchSize, webSearch, returnLastFrame, topP, style,
  } = state;

  const [showFavorites, setShowFavorites] = useState(false);
  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim() || isSaving) return;
    setIsSaving(true);
    setError('');
    try {
      await saveApiKey(apiKey);
      setShowApiKeyInput(false);
    } catch (e) {
      setError('保存失败: ' + (e.message || '未知错误'));
    } finally {
      setIsSaving(false);
    }
  };

  const currentModel = getModelInfo(modelId);
  const currentRatios = useMemo(() => getRatios(modelId, mode), [modelId, mode]);
  const currentResolutions = useMemo(() => getResolutions(modelId, mode), [modelId, mode]);
  const currentModes = useMemo(() => getModelModes(modelId), [modelId]);
  const paramType = currentModel.paramType;

  // 监听 LLM/Vision 模型的文本结果
  const latestTextResult = useMemo(() => {
    if (paramType !== 'llm-chat' && paramType !== 'vision-g' && paramType !== 'joycaption') return '';
    const latest = history.find(h => h.modelId === modelId && h.status === 'Success' && h.textResult);
    return latest?.textResult || '';
  }, [history, modelId, paramType]);

  // 模型切换时重置不合法的参数值
  useEffect(() => {
    const model = getModelInfo(modelId);
    const s = stateRef.current;
    if (currentResolutions.length > 0 && !currentResolutions.includes(s.resolution)) {
      stateDispatch({ type: 'SET_RESOLUTION', value: model.defaultResolution || currentResolutions[0] });
    }
    if (currentRatios.length > 0 && !currentRatios.includes(s.aspectRatio)) {
      stateDispatch({ type: 'SET_ASPECT_RATIO', value: currentRatios[0] });
    }
    if (model.defaultWatermark !== undefined && s.watermark !== model.defaultWatermark) stateDispatch({ type: 'SET_WATERMARK', value: model.defaultWatermark });
    if (model.defaultThinkingMode !== undefined && s.thinkingMode !== model.defaultThinkingMode) stateDispatch({ type: 'SET_THINKING_MODE', value: model.defaultThinkingMode });
    if (model.defaultPromptExtend !== undefined && s.promptExtend !== model.defaultPromptExtend) stateDispatch({ type: 'SET_PROMPT_EXTEND', value: model.defaultPromptExtend });
    if (model.defaultAudio !== undefined && s.audio !== model.defaultAudio) stateDispatch({ type: 'SET_AUDIO', value: model.defaultAudio });
    if (model.defaultAudioSetting !== undefined && s.audioSetting !== model.defaultAudioSetting) stateDispatch({ type: 'SET_AUDIO_SETTING', value: model.defaultAudioSetting });
    if (model.defaultDuration !== undefined && s.duration !== model.defaultDuration) stateDispatch({ type: 'SET_DURATION', value: model.defaultDuration });
    if (model.defaultSound !== undefined && s.sound !== model.defaultSound) stateDispatch({ type: 'SET_SOUND', value: model.defaultSound });
    if (model.defaultKeepOriginalSound !== undefined && s.keepOriginalSound !== model.defaultKeepOriginalSound) stateDispatch({ type: 'SET_KEEP_ORIGINAL_SOUND', value: model.defaultKeepOriginalSound });
    if (model.defaultTemperature !== undefined && s.temperature !== model.defaultTemperature) stateDispatch({ type: 'SET_TEMPERATURE', value: model.defaultTemperature });
    if (model.defaultMaxTokens !== undefined && s.maxTokens !== model.defaultMaxTokens) stateDispatch({ type: 'SET_MAX_TOKENS', value: model.defaultMaxTokens });
    if (model.defaultSpeed !== undefined && s.speed !== model.defaultSpeed) stateDispatch({ type: 'SET_SPEED', value: model.defaultSpeed });
    if (model.defaultVoice !== undefined && s.voice !== model.defaultVoice) stateDispatch({ type: 'SET_VOICE', value: model.defaultVoice });
    if (model.defaultFormat !== undefined && s.responseFormat !== model.defaultFormat) stateDispatch({ type: 'SET_RESPONSE_FORMAT', value: model.defaultFormat });
    if (model.defaultLanguage !== undefined && s.language !== model.defaultLanguage) stateDispatch({ type: 'SET_LANGUAGE', value: model.defaultLanguage });
    if (currentModes.length > 0 && !currentModes.includes(s.mode)) {
      stateDispatch({ type: 'SET_MODE', value: currentModes[0] });
    }
  }, [modelId, mode, paramType, currentResolutions, currentRatios, currentModes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      selfSaveRef.current = true;
      saveHomeState(state);
    }, 500);
    return () => clearTimeout(timer);
  }, [state, saveHomeState]);

  const handleModelSelect = (id) => {
    const newModes = getModelModes(id);
    const updates = { modelId: id };
    if (newModes.length > 0 && !newModes.includes(stateRef.current.mode)) {
      updates.mode = newModes[0];
    }
    selfSaveRef.current = true;
    saveHomeState(updates);
    stateDispatch({ type: 'SET_PARAMS', params: updates });
  };

  const handleOpenFavorites = () => {
    setShowFavorites(true);
  };

  const handleOpenAllModels = () => {
    if (onOpenModelSelect) {
      onOpenModelSelect();
    }
  };

  const { handleFileSelect, handleLastFrameSelect, handleVideoSelect, handleRefImageSelect, handleFirstClipSelect, handleFirstFrameSelect } = useFileUpload({
    apiKey,
    setShowApiKeyInput,
    setError,
    setIsUploading,
    setImageUrls: (urls) => stateDispatch({ type: 'SET_IMAGE_URLS', value: urls }),
    setLastFrameUrls: (urls) => stateDispatch({ type: 'SET_LAST_FRAME_URLS', value: urls }),
    setVideoUrls: (urls) => stateDispatch({ type: 'SET_VIDEO_URLS', value: urls }),
    setRefImages: (urls) => stateDispatch({ type: 'SET_REF_IMAGES', value: urls }),
    setFirstClipUrls: (urls) => stateDispatch({ type: 'SET_FIRST_CLIP_URLS', value: urls }),
    setFirstFrameUrls: (urls) => stateDispatch({ type: 'SET_FIRST_FRAME_URLS', value: urls }),
  });

  // ⚠️ 同步风险：此 switch(paramType) 需与 HomeParamControls 的 switch 保持同步。
  // 新增 paramType 时必须同时修改两处。
  const getPayloadParams = useCallback(() => {
    const base = { prompt: prompt.trim() };
    switch (paramType) {
      case 'resolution-ratio':
        return { ...base, resolution, aspectRatio, imageUrls, seed, webSearch, temperature, topP, maxTokens };
      case 'width-height-quality':
        return { ...base, width: parseInt(customWidth), height: parseInt(customHeight), quality, imageUrls };
      case 'size-only':
        return { ...base, resolution, imageUrls };
      case 'flux-kontext':
        return { ...base, aspectRatio, imageUrls };
      case 'wan-size':
        return { ...base, resolution, customWidth, customHeight, imageUrls, seed, watermark, enableSequential, thinkingMode, colorPalette, bboxList };
      case 'width-height':
        return { ...base, width: parseInt(customWidth), height: parseInt(customHeight), negativePrompt, seed, batchSize };
      case 'seedance-video':
        return { ...base, resolution, aspectRatio, duration, generateAudio, seed: seed !== '' && seed !== undefined ? parseInt(seed) : undefined, webSearch, returnLastFrame, imageUrls, firstFrameUrls, lastFrameUrls, videoUrls };
      case 'kling-video':
        return { ...base, aspectRatio, duration, sound, multiShot, shotType, multiPrompt, seed: seed !== '' && seed !== undefined ? parseInt(seed) : undefined, firstFrameUrls, lastFrameUrls };
      case 'kling-o3-4k':
        return { ...base, aspectRatio, duration, sound, keepOriginalSound, multiShot, shotType, multiPrompt, imageUrls, videoUrls };
      case 'vidu-video':
        return { ...base, resolution, aspectRatio, duration, audio, isRec, offPeak, seed: seed ? parseInt(seed) : undefined, imageUrls, lastFrameUrls, movementAmplitude, style };
      case 'wan-video':
        return { ...base, resolution, aspectRatio, duration, promptExtend, watermark, negativePrompt, imageUrls, firstFrameUrls: mode === 'image-to-video' ? imageUrls : firstFrameUrls, lastFrameUrls, videoUrls, refImages: mode === 'reference-to-video' ? imageUrls : refImages, refVideos: mode === 'reference-to-video' ? videoUrls : undefined, referenceVoice, drivingAudio, firstClipUrls: mode === 'video-extend' ? videoUrls : firstClipUrls, audioUrl, audioSetting, seed: seed ? parseInt(seed) : undefined };
      case 'wan-i2v':
        return { ...base, resolution, duration, promptExtend, audio, audioUrl, imageUrls };
      case 'hailuo-video':
        return { ...base, resolution, duration, promptOptimizer, fastPretreatment, aigcWatermark, imageUrls };
      case 'happyhorse-video':
        return { ...base, resolution, aspectRatio, duration, watermark, seed: seed ? parseInt(seed) : undefined, imageUrls, mediaUrls, videoUrls, refImages, audioSetting };
      case 'ltx-video':
        return { ...base, resolution, display, seed: seed ? parseInt(seed) : undefined, imageUrls };
      case 'bza-video-x':
        return { ...base, resolution, aspectRatio, duration, imageUrls, videoUrls };
      case 'bza-video-v3':
        return { ...base, resolution, aspectRatio, imageUrls, firstFrameUrls, lastFrameUrls };
      case 'dreamactor':
        return { imageUrls, videoUrls };
      case 'llm-chat':
        return { systemPrompt, userPrompt: prompt.trim(), temperature, maxTokens, enableThinking, enableSearch };
      case 'vision-g':
        return { systemPrompt, userPrompt: prompt.trim(), imageUrls, temperature, maxTokens, detail, enableThinking };
      case 'joycaption':
        return { imageUrls, captionType, captionLength, temperature, maxTokens, doSample, extraOptions, nameInput, customPrompt };
      case 'tts':
        return { input: prompt.trim(), voice, responseFormat, instructions, language, speed, maxTokens };
      default:
        return { ...base, resolution, aspectRatio, imageUrls };
    }
  }, [paramType, prompt, resolution, aspectRatio, imageUrls, customWidth, customHeight, quality, duration, generateAudio, sound, multiShot, shotType, multiPrompt, negativePrompt, promptExtend, watermark, seed, display, keepOriginalSound, audio, offPeak, isRec, promptOptimizer, fastPretreatment, aigcWatermark, movementAmplitude, videoUrls, firstFrameUrls, lastFrameUrls, mediaUrls, refImages, audioSetting, drivingAudio, audioUrl, referenceVoice, bboxList, firstClipUrls, systemPrompt, temperature, maxTokens, enableThinking, enableSearch, detail, captionType, captionLength, doSample, extraOptions, nameInput, customPrompt, voice, responseFormat, instructions, language, speed, enableSequential, thinkingMode, colorPalette, batchSize, webSearch, returnLastFrame, topP, style, mode]);

  const livePrice = useMemo(() => calculatePrice(modelId, getPayloadParams()), [modelId, getPayloadParams]);

  // 获取价格公式显示文本（按 Tokens 计费模型）
  const priceFormulaText = useMemo(() => {
    const model = getModelInfo(modelId);
    if (!model) return null;
    // Seedance 参考生视频模式显示特殊公式
    if (model.priceFormulaRefVideo && mode === 'reference-to-video') {
      return model.priceFormulaRefVideo;
    }
    return model.priceFormula || null;
  }, [modelId, mode]);

  const handleGenerate = async () => {
    const initialOutputType = getOutputType(modelId);
    const isVideo = initialOutputType === 'video';

    if (!prompt.trim() && paramType !== 'dreamactor') {
      setError('请输入提示词');
      return;
    }
    if (mode === 'image-to-image' && imageUrls.length === 0) {
      setError('请至少上传一张参考图片');
      return;
    }
    if (mode === 'image-to-video' && imageUrls.length === 0 && firstFrameUrls.length === 0) {
      setError('请至少上传一张参考图片');
      return;
    }
    if (mode === 'flf-to-video' && firstFrameUrls.length === 0) {
      setError('请上传首帧图片');
      return;
    }
    if (mode === 'video-edit' && videoUrls.length === 0) {
      setError('请上传视频文件');
      return;
    }
    if (mode === 'video-extend' && firstFrameUrls.length === 0 && videoUrls.length === 0) {
      setError('请上传视频文件');
      return;
    }
    if (mode === 'reference-to-video' && paramType === 'dreamactor' && (imageUrls.length === 0 || videoUrls.length === 0)) {
      setError('请上传人物图片和参考视频');
      return;
    }
    const ek = apiKey.trim() || ENV_API_KEY;
    if (!ek) {
      setShowApiKeyInput(true);
      setError('请先输入API密钥');
      return;
    }

    setIsSubmitting(true);
    setError('');
    const id = generateId();
    const now = Date.now();
    const price = livePrice;
    const params = getPayloadParams();
    const actualRes = getActualResolution(modelId, mode, params);

    const entry = {
      id,
      imageUrl: null,
      outputType: initialOutputType,
      prompt: prompt.trim(),
      resolution,
      aspectRatio,
      price,
      mode,
      modelId,
      modelName: currentModel.name,
      status: 'Pending',
      errorMessage: '',
      actualResolution: actualRes,
      lastResponse: null,
      startedAt: now,
      completedAt: null,
      date: new Date(now).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    await addToHistory(entry);

    await addCoinsSpent(price);
    await refreshUserInfo().catch(() => {});

    try {
      const payload = buildPayload(modelId, mode, params);
      let submitResult;
      if (paramType === 'llm-chat') {
        submitResult = await submitLLMTask(ek, modelId, mode, payload);
      } else if (paramType === 'vision-g' || paramType === 'joycaption') {
        submitResult = await submitVisionTask(ek, modelId, mode, payload);
      } else if (paramType === 'tts') {
        submitResult = await submitTTSTask(ek, modelId, mode, payload);
      } else if (isVideo) {
        submitResult = await submitVideoTask(ek, modelId, mode, payload);
      } else {
        submitResult = await submitImageTask(ek, modelId, mode, payload);
      }
      const { requestId, apiKey: taskApiKey } = submitResult;
      updateHistoryItem(id, {
        status: 'Pending',
        requestId,
        taskApiKey,
        lastResponse: { status: 'Pending', request_id: requestId },
      });
      startPolling(id, requestId, taskApiKey);
    } catch (err) {
      updateHistoryItem(id, {
        status: 'Failed',
        errorMessage: err.message,
        lastResponse: { status: 'Failed', error: err.message },
      });
    } finally {
      setIsSubmitting(false);
    }
    Keyboard.dismiss();
  };

  const paramControls = (
    <HomeParamControls
      key={paramType}
      paramType={paramType}
      currentModel={currentModel}
      currentResolutions={currentResolutions}
      currentRatios={currentRatios}
      resolution={resolution}
      setResolution={(v) => stateDispatch({ type: 'SET_RESOLUTION', value: v })}
      aspectRatio={aspectRatio}
      setAspectRatio={(v) => stateDispatch({ type: 'SET_ASPECT_RATIO', value: v })}
      quality={quality}
      setQuality={(v) => stateDispatch({ type: 'SET_QUALITY', value: v })}
      sizePreset={sizePreset}
      setSizePreset={(v) => stateDispatch({ type: 'SET_SIZE_PRESET', value: v })}
      customWidth={customWidth}
      setCustomWidth={(v) => stateDispatch({ type: 'SET_CUSTOM_WIDTH', value: v })}
      customHeight={customHeight}
      setCustomHeight={(v) => stateDispatch({ type: 'SET_CUSTOM_HEIGHT', value: v })}
      duration={duration}
      setDuration={(v) => stateDispatch({ type: 'SET_DURATION', value: v })}
      generateAudio={generateAudio}
      setGenerateAudio={(v) => stateDispatch({ type: 'SET_GENERATE_AUDIO', value: v })}
      seed={seed}
      setSeed={(v) => stateDispatch({ type: 'SET_SEED', value: v })}
      sound={sound}
      setSound={(v) => stateDispatch({ type: 'SET_SOUND', value: v })}
      multiShot={multiShot}
      setMultiShot={(v) => stateDispatch({ type: 'SET_MULTI_SHOT', value: v })}
      shotType={shotType}
      setShotType={(v) => stateDispatch({ type: 'SET_SHOT_TYPE', value: v })}
      multiPrompt={multiPrompt}
      setMultiPrompt={(v) => stateDispatch({ type: 'SET_MULTI_PROMPT', value: v })}
      keepOriginalSound={keepOriginalSound}
      setKeepOriginalSound={(v) => stateDispatch({ type: 'SET_KEEP_ORIGINAL_SOUND', value: v })}
      negativePrompt={negativePrompt}
      setNegativePrompt={(v) => stateDispatch({ type: 'SET_NEGATIVE_PROMPT', value: v })}
      promptExtend={promptExtend}
      setPromptExtend={(v) => stateDispatch({ type: 'SET_PROMPT_EXTEND', value: v })}
      watermark={watermark}
      setWatermark={(v) => stateDispatch({ type: 'SET_WATERMARK', value: v })}
      display={display}
      setDisplay={(v) => stateDispatch({ type: 'SET_DISPLAY', value: v })}
      audio={audio}
      setAudio={(v) => stateDispatch({ type: 'SET_AUDIO', value: v })}
      offPeak={offPeak}
      setOffPeak={(v) => stateDispatch({ type: 'SET_OFF_PEAK', value: v })}
      isRec={isRec}
      setIsRec={(v) => stateDispatch({ type: 'SET_IS_REC', value: v })}
      promptOptimizer={promptOptimizer}
      setPromptOptimizer={(v) => stateDispatch({ type: 'SET_PROMPT_OPTIMIZER', value: v })}
      fastPretreatment={fastPretreatment}
      setFastPretreatment={(v) => stateDispatch({ type: 'SET_FAST_PRETREATMENT', value: v })}
      aigcWatermark={aigcWatermark}
      setAigcWatermark={(v) => stateDispatch({ type: 'SET_AIGC_WATERMARK', value: v })}
      movementAmplitude={movementAmplitude}
      setMovementAmplitude={(v) => stateDispatch({ type: 'SET_MOVEMENT_AMPLITUDE', value: v })}
      systemPrompt={systemPrompt}
      setSystemPrompt={(v) => stateDispatch({ type: 'SET_SYSTEM_PROMPT', value: v })}
      temperature={temperature}
      setTemperature={(v) => stateDispatch({ type: 'SET_TEMPERATURE', value: v })}
      maxTokens={maxTokens}
      setMaxTokens={(v) => stateDispatch({ type: 'SET_MAX_TOKENS', value: v })}
      enableThinking={enableThinking}
      setEnableThinking={(v) => stateDispatch({ type: 'SET_ENABLE_THINKING', value: v })}
      enableSearch={enableSearch}
      setEnableSearch={(v) => stateDispatch({ type: 'SET_ENABLE_SEARCH', value: v })}
      detail={detail}
      setDetail={(v) => stateDispatch({ type: 'SET_DETAIL', value: v })}
      captionType={captionType}
      setCaptionType={(v) => stateDispatch({ type: 'SET_CAPTION_TYPE', value: v })}
      captionLength={captionLength}
      setCaptionLength={(v) => stateDispatch({ type: 'SET_CAPTION_LENGTH', value: v })}
      doSample={doSample}
      setDoSample={(v) => stateDispatch({ type: 'SET_DO_SAMPLE', value: v })}
      extraOptions={extraOptions}
      setExtraOptions={(v) => stateDispatch({ type: 'SET_EXTRA_OPTIONS', value: v })}
      nameInput={nameInput}
      setNameInput={(v) => stateDispatch({ type: 'SET_NAME_INPUT', value: v })}
      customPrompt={customPrompt}
      setCustomPrompt={(v) => stateDispatch({ type: 'SET_CUSTOM_PROMPT', value: v })}
      voice={voice}
      setVoice={(v) => stateDispatch({ type: 'SET_VOICE', value: v })}
      responseFormat={responseFormat}
      setResponseFormat={(v) => stateDispatch({ type: 'SET_RESPONSE_FORMAT', value: v })}
      instructions={instructions}
      setInstructions={(v) => stateDispatch({ type: 'SET_INSTRUCTIONS', value: v })}
      language={language}
      setLanguage={(v) => stateDispatch({ type: 'SET_LANGUAGE', value: v })}
      speed={speed}
      setSpeed={(v) => stateDispatch({ type: 'SET_SPEED', value: v })}
      enableSequential={enableSequential}
      setEnableSequential={(v) => stateDispatch({ type: 'SET_ENABLE_SEQUENTIAL', value: v })}
      thinkingMode={thinkingMode}
      setThinkingMode={(v) => stateDispatch({ type: 'SET_THINKING_MODE', value: v })}
      colorPalette={colorPalette}
      setColorPalette={(v) => stateDispatch({ type: 'SET_COLOR_PALETTE', value: v })}
      batchSize={batchSize}
      setBatchSize={(v) => stateDispatch({ type: 'SET_BATCH_SIZE', value: v })}
      webSearch={webSearch}
      setWebSearch={(v) => stateDispatch({ type: 'SET_WEB_SEARCH', value: v })}
      returnLastFrame={returnLastFrame}
      setReturnLastFrame={(v) => stateDispatch({ type: 'SET_RETURN_LAST_FRAME', value: v })}
      topP={topP}
      setTopP={(v) => stateDispatch({ type: 'SET_TOP_P', value: v })}
      style={style}
      setStyle={(v) => stateDispatch({ type: 'SET_STYLE', value: v })}
      audioSetting={audioSetting}
      setAudioSetting={(v) => stateDispatch({ type: 'SET_AUDIO_SETTING', value: v })}
      drivingAudio={drivingAudio}
      setDrivingAudio={(v) => stateDispatch({ type: 'SET_DRIVING_AUDIO', value: v })}
      audioUrl={audioUrl}
      setAudioUrl={(v) => stateDispatch({ type: 'SET_AUDIO_URL', value: v })}
      referenceVoice={referenceVoice}
      setReferenceVoice={(v) => stateDispatch({ type: 'SET_REFERENCE_VOICE', value: v })}
      bboxList={bboxList}
      setBboxList={(v) => stateDispatch({ type: 'SET_BBOX_LIST', value: v })}
      mode={mode}
    />
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {userInfo && (apiKey || ENV_API_KEY) ? (
          <View style={styles.headerInner}>
            <Pressable
              style={({ pressed }) => [styles.headerLeft, pressed && { opacity: 0.7 }]} onPress={() => setShowApiKeyDropdown(true)} >
              <Image source={{ uri: userInfo.avatar }} style={styles.headerAvatar} contentFit="cover" cachePolicy="memory-disk" transition={200} />
              <View style={styles.headerUserInfo}>
                <View style={styles.headerNameRow}>
                  <Text style={styles.headerUserName}>{userInfo.name}</Text>
                  {userInfo.user_level_str ? (
                    <MaterialCommunityIcons name="crown" size={14} color={colors.warning} style={{ marginLeft: 4 }} />
                  ) : null}
                </View>
                <View style={styles.headerBalances}>
                  <MaterialCommunityIcons name="gold" size={14} color={colors.warning} style={{ paddingRight: 2 }} />
                  <Text style={[styles.headerBalanceText, { paddingLeft: 2, paddingTop: 2 }]}>
                    {walletBalance?.charge_balance_amount ?? '--'}
                  </Text>
                  <MaterialCommunityIcons name="gold" size={14} color="#C0C0C0" style={{ marginLeft: 10, paddingRight: 2 }} />
                  <Text style={[styles.headerBalanceText, { paddingLeft: 2, paddingTop: 2 }]}>
                    {walletBalance?.gift_balance_amount ?? '--'}
                  </Text>
                </View>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.headerAllModelsButton, pressed && { opacity: 0.7 }]} onPress={handleOpenAllModels} >
              <Text style={styles.headerAllModelsText}>所有模型</Text>
              <Ionicons name="apps-outline" size={18} color={colors.textPrimary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.headerThemeButton, pressed && { opacity: 0.7 }]} onPress={toggleTheme} >
              <Ionicons name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
                <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
              </View>
              <TextInput
                style={styles.headerApiInput}
                placeholder="输入Bizyair API Key"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                placeholderTextColor={colors.textPlaceholder}
              />
            </View>
            {apiKey.trim() ? (
              <Pressable
                style={({ pressed }) => [styles.headerSaveButton, pressed && { opacity: 0.7 }]} onPress={handleSaveApiKey} disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.textInverse} />
                ) : (
                  <Text style={styles.headerSaveButtonText}>保存</Text>
                )}
              </Pressable>
            ) : (
              <View style={styles.headerAllModelsButton}>
                <Text style={styles.headerAllModelsText}>所有模型</Text>
                <Ionicons name="apps-outline" size={18} color={colors.textPrimary} />
              </View>
            )}
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        {showApiKeyInput ? (
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Ionicons name="key" size={16} color={colors.warning} />
              <Text style={styles.label}>API 密钥</Text>
            </View>
            <TextInput
              style={styles.apiKeyInput}
              placeholder="输入你的Bizyair API Key"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              maxLength={100}
              placeholderTextColor={colors.textPlaceholder}
            />
            {apiKey.trim() ? (
              <Pressable
                style={({ pressed }) => [styles.saveKeyButton, pressed && { opacity: 0.7 }]} onPress={handleSaveApiKey}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.textInverse} />
                ) : (
                  <Text style={styles.saveKeyButtonText}>保存密钥</Text>
                )}
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View style={styles.modelAndModeRow}>
          <ModelSelector
            currentModel={currentModel}
            modelId={modelId}
            onSelectModel={handleModelSelect}
            onOpenFavorites={handleOpenFavorites}
          />
          <View style={styles.modeToggle}>
            {currentModes.map((m) => (
              <Pressable
                key={m}
                style={({ pressed }) => [styles.modeButton, mode === m && styles.modeButtonActive, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_MODE', value: m })}
              >
                <Text style={[styles.modeButtonText, mode === m && styles.modeButtonTextActive]}>
                  {MODE_LABELS[m] || m}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.promptLabelRow}>
            <Text style={[styles.label, { marginBottom: 0 }]}>
              提示词{paramType === 'dreamactor' ? <Text style={{ color: colors.textTertiary, fontWeight: '400' }}> (可选)</Text> : <Text style={{ color: '#E74C3C' }}> *</Text>}
            </Text>
            {prompt ? (
              <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }} onPress={() => stateDispatch({ type: 'SET_PROMPT', value: '' })} >
                <Text style={styles.promptClearText}>清空</Text>
              </Pressable>
            ) : null}
          </View>
          <ResizableTextInput
            value={prompt}
            onChangeText={(v) => stateDispatch({ type: 'SET_PROMPT', value: v })}
            placeholder={
              paramType === 'llm-chat' ? '输入你的问题，支持深度思考...'
              : paramType === 'vision-g' ? '描述图片内容或提出问题...'
              : paramType === 'joycaption' ? '输入自定义提示词（可选）...'
              : paramType === 'tts' ? '输入要合成的文本...'
              : paramType === 'dreamactor' ? '描述动作或表情（可选）...'
              : mode === 'image-to-image' ? '描述你想对图片进行哪些修改...'
              : mode === 'image-to-video' ? (
                modelId.startsWith('seedance') ? '描述视频内容，支持运镜指令...'
                : modelId.startsWith('hailuo') ? '描述视频内容，支持运镜指令写法...'
                : modelId.startsWith('kling') ? '描述视频的运动和场景...'
                : '描述视频的运动和场景...'
              )
              : mode === 'video-edit' ? '描述你想对视频进行哪些修改...'
              : mode === 'video-extend' ? '描述视频延续的内容（可选）...'
              : mode === 'reference-to-video' ? (
                modelId.startsWith('seedance') ? '描述参考素材的风格和内容...'
                : '描述视频的风格和内容...'
              )
              : mode === 'flf-to-video' ? '描述首尾帧之间的过渡...'
              : mode === 'text-to-video' ? (
                modelId.startsWith('seedance') ? '描述视频内容，支持运镜指令...'
                : modelId.startsWith('hailuo') ? '描述视频内容，支持运镜指令写法...'
                : modelId.startsWith('kling') ? '描述视频内容，支持多镜头...'
                : modelId.startsWith('wan') ? '描述视频内容，支持智能改写...'
                : modelId.startsWith('happyhorse') ? '描述视频内容，支持多风格...'
                : '描述你想生成的视频...'
              )
              : '描述你想生成的图片...'
            }
            maxLength={currentModel.maxPromptLength}
            minHeight={120}
          />
          <Text style={styles.charCount}>
            {prompt.length} / {currentModel.maxPromptLength}
          </Text>
        </View>

        {(mode === 'image-to-image' || mode === 'image-to-video' || mode === 'flf-to-video' || mode === 'reference-to-video' || mode === 'vision' || paramType === 'dreamactor' || paramType === 'vision-g' || paramType === 'joycaption') ? (
          <View style={styles.card}>
            <Text style={styles.label}>
              {(() => {
                const label = mode === 'flf-to-video' ? '首帧图片' : '参考图片';
                const isRequired = mode === 'flf-to-video' || mode === 'image-to-image' || mode === 'image-to-video'
                  || (mode === 'reference-to-video' && paramType === 'dreamactor')
                  || mode === 'vision' || paramType === 'vision-g' || paramType === 'joycaption';
                return <>{label}{isRequired ? <Text style={{ color: '#E74C3C' }}> *</Text> : <Text style={{ color: colors.textTertiary, fontWeight: '400' }}> (可选)</Text>}</>;
              })()}
            </Text>
            <Pressable
              style={({ pressed }) => [styles.uploadButton, isUploading && styles.uploadButtonDisabled, pressed && { opacity: 0.7 }]} onPress={handleFileSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择图片上传'}
              </Text>
            </Pressable>
            {imageUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {imageUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Image source={{ uri: url }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      图片 {i + 1}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [styles.removeUploadedButton, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_IMAGE_URLS', value: imageUrls.filter((_, j) => j !== i) })}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {mode === 'flf-to-video' || ((mode === 'image-to-video' || mode === 'video-extend') && paramType === 'wan-video') ? (
          <View style={styles.card}>
            <Text style={styles.label}>尾帧图片{mode === 'flf-to-video' ? '' : ' (可选)'}</Text>
            <Pressable
              style={({ pressed }) => [styles.uploadButton, isUploading && styles.uploadButtonDisabled, pressed && { opacity: 0.7 }]} onPress={handleLastFrameSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择尾帧图片'}
              </Text>
            </Pressable>
            {lastFrameUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {lastFrameUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Image source={{ uri: url }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      尾帧 {i + 1}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [styles.removeUploadedButton, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_LAST_FRAME_URLS', value: lastFrameUrls.filter((_, j) => j !== i) })}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {(mode === 'video-edit' || mode === 'reference-to-video' || mode === 'video-extend' || paramType === 'dreamactor') ? (
          <View style={styles.card}>
            <Text style={styles.label}>{paramType === 'dreamactor' ? '参考视频' : '上传视频'}</Text>
            <Pressable
              style={({ pressed }) => [styles.uploadButton, isUploading && styles.uploadButtonDisabled, pressed && { opacity: 0.7 }]} onPress={handleVideoSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择视频上传'}
              </Text>
            </Pressable>
            {videoUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {videoUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Ionicons name="videocam" size={24} color={colors.primary} />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      视频 {i + 1}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [styles.removeUploadedButton, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_VIDEO_URLS', value: videoUrls.filter((_, j) => j !== i) })}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* 首帧图片上传：wan-2-7 reference-to-video / video-edit 模式 */}
        {(mode === 'reference-to-video' || mode === 'video-edit') && paramType === 'wan-video' ? (
          <View style={styles.card}>
            <Text style={styles.label}>首帧图片 (可选)</Text>
            <Pressable
              style={({ pressed }) => [styles.uploadButton, isUploading && styles.uploadButtonDisabled, pressed && { opacity: 0.7 }]} onPress={handleFirstFrameSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择首帧图片'}
              </Text>
            </Pressable>
            {firstFrameUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {firstFrameUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Image source={{ uri: url }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      首帧 {i + 1}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [styles.removeUploadedButton, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_FIRST_FRAME_URLS', value: firstFrameUrls.filter((_, j) => j !== i) })}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* 首段视频上传：wan-2-7 image-to-video 模式 */}
        {mode === 'image-to-video' && paramType === 'wan-video' ? (
          <View style={styles.card}>
            <Text style={styles.label}>首段视频 (可选)</Text>
            <Pressable
              style={({ pressed }) => [styles.uploadButton, isUploading && styles.uploadButtonDisabled, pressed && { opacity: 0.7 }]} onPress={handleFirstClipSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择首段视频'}
              </Text>
            </Pressable>
            {firstClipUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {firstClipUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Ionicons name="videocam" size={24} color={colors.primary} />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      视频 {i + 1}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [styles.removeUploadedButton, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_FIRST_CLIP_URLS', value: firstClipUrls.filter((_, j) => j !== i) })}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* 参考图片上传：wan-2-7 video-edit 模式 / happyhorse video-edit 模式 */}
        {mode === 'video-edit' && (paramType === 'wan-video' || paramType === 'happyhorse-video') ? (
          <View style={styles.card}>
            <Text style={styles.label}>参考图片 (可选)</Text>
            <Pressable
              style={({ pressed }) => [styles.uploadButton, isUploading && styles.uploadButtonDisabled, pressed && { opacity: 0.7 }]} onPress={handleRefImageSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择参考图片'}
              </Text>
            </Pressable>
            {refImages.length > 0 ? (
              <View style={styles.uploadedList}>
                {refImages.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Image source={{ uri: url }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      图片 {i + 1}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [styles.removeUploadedButton, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_REF_IMAGES', value: refImages.filter((_, j) => j !== i) })}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {paramControls}

        <Pressable
          style={({ pressed }) => [styles.generateButton, isSubmitting && styles.generateButtonDisabled, pressed && { opacity: 0.7 }]} onPress={handleGenerate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : null}
          <Text style={styles.generateButtonText}>
            {isSubmitting
              ? '提交中...'
              : `${MODE_LABELS[mode] || '生成'}${priceFormulaText ? '' : ` · ${livePrice} 金币`}`}
          </Text>
        </Pressable>

        {priceFormulaText ? (
          <Text style={styles.priceFormulaText}>{priceFormulaText}</Text>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {(paramType === 'llm-chat' || paramType === 'vision-g' || paramType === 'joycaption') && latestTextResult ? (
          <View style={styles.card}>
            <Text style={styles.label}>返回结果</Text>
            <ScrollView style={styles.textResultBox} nestedScrollEnabled>
              <MarkdownRenderer content={latestTextResult} />
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      <FavoriteModelsLayer
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
        currentModelId={modelId}
        onSelectModel={handleModelSelect}
        favorites={favorites}
      />

      <ApiKeyDropdown
        visible={showApiKeyDropdown}
        onClose={() => setShowApiKeyDropdown(false)}
        apiKeys={apiKeys}
        activeApiKeyId={activeApiKeyId}
        onSwitchKey={switchApiKey}
        onDeleteKey={removeApiKey}
        onAddKey={addApiKey}
        onRenameKey={renameApiKey}
      />
    </View>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.card, paddingLeft: Spacing.md, paddingRight: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1, borderRadius: Radius.sm },
  headerAvatar: { width: 36, height: 36, borderRadius: 18 },
  headerAvatarPlaceholder: { backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  headerUserInfo: { flexDirection: 'column' },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 2 },
  headerUserName: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  headerBalances: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  headerBalanceText: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  headerApiInput: { flex: 1, fontSize: 14, color: colors.textPrimary, backgroundColor: colors.bg, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  headerSaveButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm, backgroundColor: colors.primary },
  headerSaveButtonText: { color: colors.textInverse, fontSize: 13, fontWeight: '600' },
  headerAllModelsButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, borderRadius: Radius.sm, gap: Spacing.xs },
  headerAllModelsText: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  headerThemeButton: { padding: Spacing.sm, borderRadius: Radius.sm, backgroundColor: colors.bg },
  modelAndModeRow: { marginBottom: 6 },
  modeToggle: { flexDirection: 'row', borderRadius: 8, backgroundColor: colors.bg, padding: 1, gap: 4, marginTop: 6, borderWidth: 1, borderColor: colors.divider, height: 45 },
  modeButton: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.xs, alignItems: 'center', justifyContent: 'center' },
  modeButtonActive: { backgroundColor: colors.card },
  modeButtonText: { fontSize: 13, color: colors.textTertiary, fontWeight: '500' },
  modeButtonTextActive: { color: colors.primary, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8, paddingRight: Spacing.md, paddingBottom: Spacing.xxl, paddingLeft: Spacing.md },
  card: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  promptLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  promptClearText: { fontSize: 12, color: '#4A9EF5', fontWeight: '500' },
  charCount: { fontSize: 12, color: colors.textTertiary, textAlign: 'right', marginTop: Spacing.xs },
  uploadButton: { backgroundColor: colors.primaryBg, paddingVertical: 18, borderRadius: Radius.md, borderWidth: 1.5, borderColor: colors.primaryBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: Spacing.sm },
  uploadButtonDisabled: { opacity: 0.6 },
  uploadButtonText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  uploadedList: { marginTop: Spacing.md, gap: Spacing.sm },
  uploadedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: Radius.sm, padding: Spacing.sm, gap: 10 },
  uploadedThumb: { width: 44, height: 44, borderRadius: Radius.xs },
  uploadedName: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  removeUploadedButton: { backgroundColor: colors.errorBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.xs },
  removeUploadedButtonText: { color: colors.error, fontSize: 13, fontWeight: '600' },
  generateButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: Radius.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: Spacing.sm },
  generateButtonDisabled: { backgroundColor: colors.primaryDisabled },
  generateButtonText: { color: colors.textInverse, fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },
  priceFormulaText: { fontSize: 12, color: colors.textTertiary, textAlign: 'center', marginBottom: Spacing.md, lineHeight: 18 },
  errorText: { color: colors.error, textAlign: 'center', marginBottom: Spacing.md, fontSize: 14 },
  textResultBox: { maxHeight: 300, backgroundColor: colors.bg, borderRadius: Radius.sm, padding: Spacing.md },
  textResultContent: { fontSize: 14, color: colors.textPrimary, lineHeight: 22 },
  apiKeyInput: { fontSize: 15, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, padding: Spacing.md, fontFamily: 'monospace', backgroundColor: colors.bg },
  saveKeyButton: { backgroundColor: colors.primary, paddingVertical: 10, borderRadius: Radius.sm, alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: colors.textInverse, fontSize: 15, fontWeight: '600' },
});
