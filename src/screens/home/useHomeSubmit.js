import { useCallback, useMemo, useRef, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { submitImageTask, submitVideoTask, submitLLMTask, submitVisionTask, submitTTSTask } from '../../services/apiClient';
import { calculatePrice, getActualResolution, getOutputType } from '../../utils/modelHelpers';
import { buildPayload } from '../../utils/payloadBuilder';
import { generateId } from '../../utils/helpers';
import { ENV_API_KEY } from '../../constants/models';

const toRemoteUrls = (urls) => (urls || []).map((u) => (typeof u === 'object' && u.remoteUrl) ? u.remoteUrl : u);

/**
 * 根据 paramType 和 mode 从 state 构建请求参数对象。
 * 独立函数，可同时供 getPayloadParams（事件处理器）和 livePrice（渲染期）使用。
 */
function buildParamsFromState(s, paramType, mode) {
  const base = { prompt: s.prompt.trim() };
  const iu = toRemoteUrls(s.imageUrls);
  const vu = toRemoteUrls(s.videoUrls);
  const ffu = toRemoteUrls(s.firstFrameUrls);
  const lfu = toRemoteUrls(s.lastFrameUrls);
  const ri = toRemoteUrls(s.refImages);
  const fcu = toRemoteUrls(s.firstClipUrls);
  const mu = toRemoteUrls(s.mediaUrls);
  switch (paramType) {
    case 'resolution-ratio':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, imageUrls: iu, seed: s.seed, webSearch: s.webSearch, temperature: s.temperature, topP: s.topP, maxTokens: s.maxTokens };
    case 'width-height-quality':
      return { ...base, width: parseInt(s.customWidth), height: parseInt(s.customHeight), quality: s.quality, imageUrls: iu };
    case 'size-only':
      return { ...base, resolution: s.resolution, imageUrls: iu };
    case 'flux-kontext':
      return { ...base, aspectRatio: s.aspectRatio, imageUrls: iu };
    case 'wan-size':
      return { ...base, resolution: s.resolution, customWidth: s.customWidth, customHeight: s.customHeight, imageUrls: iu, seed: s.seed, watermark: s.watermark, enableSequential: s.enableSequential, thinkingMode: s.thinkingMode, colorPalette: s.colorPalette, bboxList: s.bboxList };
    case 'width-height':
      return { ...base, width: parseInt(s.customWidth), height: parseInt(s.customHeight), steps: s.steps, guidanceScale: s.guidanceScale, negativePrompt: s.negativePrompt, seed: s.seed, batchSize: s.batchSize };
    case 'seedance-video':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, duration: s.duration, generateAudio: s.generateAudio, seed: s.seed !== '' && s.seed !== undefined ? parseInt(s.seed) : undefined, webSearch: s.webSearch, returnLastFrame: s.returnLastFrame, imageUrls: iu, firstFrameUrls: ffu, lastFrameUrls: lfu, videoUrls: vu };
    case 'kling-video':
      return { ...base, aspectRatio: s.aspectRatio, duration: s.duration, sound: s.sound, multiShot: s.multiShot, shotType: s.shotType, multiPrompt: s.multiPrompt, seed: s.seed !== '' && s.seed !== undefined ? parseInt(s.seed) : undefined, firstFrameUrls: ffu, lastFrameUrls: lfu };
    case 'kling-o3-4k':
      return { ...base, aspectRatio: s.aspectRatio, duration: s.duration, sound: s.sound, keepOriginalSound: s.keepOriginalSound, multiShot: s.multiShot, shotType: s.shotType, multiPrompt: s.multiPrompt, imageUrls: iu, videoUrls: vu };
    case 'vidu-video':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, duration: s.duration, audio: s.audio, isRec: s.isRec, offPeak: s.offPeak, seed: s.seed ? parseInt(s.seed) : undefined, imageUrls: iu, lastFrameUrls: lfu, movementAmplitude: s.movementAmplitude, style: s.style };
    case 'wan-video':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, duration: s.duration, promptExtend: s.promptExtend, watermark: s.watermark, negativePrompt: s.negativePrompt, imageUrls: iu, firstFrameUrls: mode === 'image-to-video' ? iu : ffu, lastFrameUrls: lfu, videoUrls: vu, refImages: mode === 'reference-to-video' ? iu : ri, refVideos: mode === 'reference-to-video' ? vu : undefined, referenceVoice: s.referenceVoice, drivingAudio: s.drivingAudio, firstClipUrls: mode === 'video-extend' ? vu : fcu, audioUrl: s.audioUrl, audioSetting: s.audioSetting, seed: s.seed ? parseInt(s.seed) : undefined };
    case 'wan-i2v':
      return { ...base, resolution: s.resolution, duration: s.duration, promptExtend: s.promptExtend, audio: s.audio, audioUrl: s.audioUrl, imageUrls: iu };
    case 'hailuo-video':
      return { ...base, resolution: s.resolution, duration: s.duration, promptOptimizer: s.promptOptimizer, fastPretreatment: s.fastPretreatment, aigcWatermark: s.aigcWatermark, imageUrls: iu };
    case 'happyhorse-video':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, duration: s.duration, watermark: s.watermark, seed: s.seed ? parseInt(s.seed) : undefined, imageUrls: iu, mediaUrls: mu, videoUrls: vu, refImages: ri, audioSetting: s.audioSetting };
    case 'ltx-video':
      return { ...base, resolution: s.resolution, display: s.display, seed: s.seed ? parseInt(s.seed) : undefined, imageUrls: iu };
    case 'bza-video-x':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, duration: s.duration, imageUrls: iu, videoUrls: vu };
    case 'bza-video-v3':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, duration: s.duration, generateAudio: s.generateAudio, seed: s.seed !== '' && s.seed !== undefined ? parseInt(s.seed) : undefined, negativePrompt: s.negativePrompt, imageUrls: iu, firstFrameUrls: ffu, lastFrameUrls: lfu };
    case 'bza-video-g':
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, duration: s.duration, imageUrls: iu };
    case 'dreamactor':
      return { imageUrls: iu, videoUrls: vu };
    case 'llm-chat':
      return { systemPrompt: s.systemPrompt, userPrompt: s.prompt.trim(), temperature: s.temperature, maxTokens: s.maxTokens, enableThinking: s.enableThinking, enableSearch: s.enableSearch };
    case 'vision-g':
      return { systemPrompt: s.systemPrompt, userPrompt: s.prompt.trim(), imageUrls: iu, temperature: s.temperature, maxTokens: s.maxTokens, detail: s.detail, enableThinking: s.enableThinking };
    case 'joycaption':
      return { imageUrls: iu, captionType: s.captionType, captionLength: s.captionLength, temperature: s.temperature, maxTokens: s.maxTokens, doSample: s.doSample, extraOptions: s.extraOptions, nameInput: s.nameInput, customPrompt: s.customPrompt };
    case 'qwen-image':
      return { ...base, width: parseInt(s.customWidth) || 1024, height: parseInt(s.customHeight) || 1024, steps: s.steps, guidanceScale: s.guidanceScale, negativePrompt: s.negativePrompt, seed: s.seed !== '' && s.seed !== undefined ? parseInt(s.seed) : undefined };
    case 'tts':
      return { input: s.prompt.trim(), voice: s.voice, responseFormat: s.responseFormat, instructions: s.instructions, language: s.language, speed: s.speed, maxTokens: s.maxTokens };
    case 'birefnet':
      return { imageUrls: iu, outputmask: s.outputmask };
    case 'ace-step':
      return { lyrics: s.lyrics, tags: s.tags, duration: s.duration, seed: s.seed !== '' && s.seed !== undefined ? parseInt(s.seed) : undefined };
    case 'seedvr2':
      return { imageUrls: iu, resolution: s.resolution };
    case 'flux-klein':
      return { imageUrls: iu };
    case 'kontext-lora':
      return { ...base, imageUrls: iu, seed: s.seed !== '' && s.seed !== undefined ? parseInt(s.seed) : undefined };
    default:
      return { ...base, resolution: s.resolution, aspectRatio: s.aspectRatio, imageUrls: iu };
  }
}

export function useHomeSubmit({
  state,
  paramType,
  modelId,
  mode,
  currentModel,
  apiKey,
  setShowApiKeyInput,
  setError,
  setIsSubmitting,
  addToHistory,
  addCoinsSpent,
  refreshUserInfo,
  updateHistoryItem,
  startPolling,
}) {
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // 事件处理器用：通过 ref 读取最新 state，避免 useCallback 依赖爆炸
  const getPayloadParams = useCallback(() => buildParamsFromState(stateRef.current, paramType, mode), [paramType, mode]);

  // 渲染期用：直接从 state 计算，不通过 ref，确保响应式更新
  const livePrice = useMemo(() => calculatePrice(modelId, buildParamsFromState(state, paramType, mode)), [modelId, paramType, mode, state]);

  const handleGenerate = async () => {
    const initialOutputType = getOutputType(modelId);
    const isVideo = initialOutputType === 'video';
    const s = stateRef.current;

    if (!s.prompt.trim() && paramType !== 'dreamactor' && paramType !== 'birefnet' && paramType !== 'seedvr2' && paramType !== 'flux-klein' && paramType !== 'ace-step') {
      setError('请输入提示词');
      return;
    }
    if (mode === 'image-to-image' && s.imageUrls.length === 0) {
      setError('请至少上传一张参考图片');
      return;
    }
    if (mode === 'image-to-video' && s.imageUrls.length === 0 && s.firstFrameUrls.length === 0) {
      setError('请至少上传一张参考图片');
      return;
    }
    if (mode === 'flf-to-video' && s.firstFrameUrls.length === 0) {
      setError('请上传首帧图片');
      return;
    }
    if (mode === 'video-edit' && s.videoUrls.length === 0) {
      setError('请上传视频文件');
      return;
    }
    if (mode === 'video-extend' && s.firstFrameUrls.length === 0 && s.videoUrls.length === 0) {
      setError('请上传视频文件');
      return;
    }
    if (mode === 'reference-to-video' && paramType === 'dreamactor' && (s.imageUrls.length === 0 || s.videoUrls.length === 0)) {
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
      prompt: s.prompt.trim(),
      resolution: s.resolution,
      aspectRatio: s.aspectRatio,
      quality: s.quality,
      duration: s.duration,
      seed: s.seed,
      negativePrompt: s.negativePrompt,
      systemPrompt: s.systemPrompt,
      temperature: s.temperature,
      maxTokens: s.maxTokens,
      voice: s.voice,
      style: s.style,
      imageUrls: s.imageUrls,
      videoUrls: s.videoUrls,
      firstFrameUrls: s.firstFrameUrls,
      lastFrameUrls: s.lastFrameUrls,
      firstClipUrls: s.firstClipUrls,
      refImages: s.refImages,
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

    try {
      const payload = buildPayload(modelId, mode, params);
      let submitResult;
      if (paramType === 'llm-chat') {
        submitResult = await submitLLMTask(ek, modelId, mode, payload);
      } else if (paramType === 'vision-g' || paramType === 'joycaption') {
        submitResult = await submitVisionTask(ek, modelId, mode, payload);
      } else if (paramType === 'tts') {
        submitResult = await submitTTSTask(ek, modelId, mode, payload);
      } else if (paramType === 'ace-step') {
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
      await addCoinsSpent(price);
      await refreshUserInfo().catch((e) => console.warn('提交后刷新用户信息失败:', e?.message || e));
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

  return { getPayloadParams, livePrice, handleGenerate };
}
