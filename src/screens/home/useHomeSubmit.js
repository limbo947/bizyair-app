import { useCallback, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { submitImageTask, submitVideoTask, submitLLMTask, submitVisionTask, submitTTSTask } from '../../services/apiClient';
import { calculatePrice, getActualResolution, getOutputType } from '../../utils/modelHelpers';
import { buildPayload } from '../../utils/payloadBuilder';
import { generateId } from '../../utils/helpers';
import { ENV_API_KEY } from '../../constants/models';

const toRemoteUrls = (urls) => (urls || []).map((u) => (typeof u === 'object' && u.remoteUrl) ? u.remoteUrl : u);

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
  const {
    prompt, imageUrls, resolution, aspectRatio, quality,
    customWidth, customHeight, duration, generateAudio, sound,
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
    steps, guidanceScale,
  } = state;

  const getPayloadParams = useCallback(() => {
    const base = { prompt: prompt.trim() };
    const iu = toRemoteUrls(imageUrls);
    const vu = toRemoteUrls(videoUrls);
    const ffu = toRemoteUrls(firstFrameUrls);
    const lfu = toRemoteUrls(lastFrameUrls);
    const ri = toRemoteUrls(refImages);
    const fcu = toRemoteUrls(firstClipUrls);
    const mu = toRemoteUrls(mediaUrls);
    switch (paramType) {
      case 'resolution-ratio':
        return { ...base, resolution, aspectRatio, imageUrls: iu, seed, webSearch, temperature, topP, maxTokens };
      case 'width-height-quality':
        return { ...base, width: parseInt(customWidth), height: parseInt(customHeight), quality, imageUrls: iu };
      case 'size-only':
        return { ...base, resolution, imageUrls: iu };
      case 'flux-kontext':
        return { ...base, aspectRatio, imageUrls: iu };
      case 'wan-size':
        return { ...base, resolution, customWidth, customHeight, imageUrls: iu, seed, watermark, enableSequential, thinkingMode, colorPalette, bboxList };
      case 'width-height':
        return { ...base, width: parseInt(customWidth), height: parseInt(customHeight), negativePrompt, seed, batchSize };
      case 'seedance-video':
        return { ...base, resolution, aspectRatio, duration, generateAudio, seed: seed !== '' && seed !== undefined ? parseInt(seed) : undefined, webSearch, returnLastFrame, imageUrls: iu, firstFrameUrls: ffu, lastFrameUrls: lfu, videoUrls: vu };
      case 'kling-video':
        return { ...base, aspectRatio, duration, sound, multiShot, shotType, multiPrompt, seed: seed !== '' && seed !== undefined ? parseInt(seed) : undefined, firstFrameUrls: ffu, lastFrameUrls: lfu };
      case 'kling-o3-4k':
        return { ...base, aspectRatio, duration, sound, keepOriginalSound, multiShot, shotType, multiPrompt, imageUrls: iu, videoUrls: vu };
      case 'vidu-video':
        return { ...base, resolution, aspectRatio, duration, audio, isRec, offPeak, seed: seed ? parseInt(seed) : undefined, imageUrls: iu, lastFrameUrls: lfu, movementAmplitude, style };
      case 'wan-video':
        return { ...base, resolution, aspectRatio, duration, promptExtend, watermark, negativePrompt, imageUrls: iu, firstFrameUrls: mode === 'image-to-video' ? iu : ffu, lastFrameUrls: lfu, videoUrls: vu, refImages: mode === 'reference-to-video' ? iu : ri, refVideos: mode === 'reference-to-video' ? vu : undefined, referenceVoice, drivingAudio, firstClipUrls: mode === 'video-extend' ? vu : fcu, audioUrl, audioSetting, seed: seed ? parseInt(seed) : undefined };
      case 'wan-i2v':
        return { ...base, resolution, duration, promptExtend, audio, audioUrl, imageUrls: iu };
      case 'hailuo-video':
        return { ...base, resolution, duration, promptOptimizer, fastPretreatment, aigcWatermark, imageUrls: iu };
      case 'happyhorse-video':
        return { ...base, resolution, aspectRatio, duration, watermark, seed: seed ? parseInt(seed) : undefined, imageUrls: iu, mediaUrls: mu, videoUrls: vu, refImages: ri, audioSetting };
      case 'ltx-video':
        return { ...base, resolution, display, seed: seed ? parseInt(seed) : undefined, imageUrls: iu };
      case 'bza-video-x':
        return { ...base, resolution, aspectRatio, duration, imageUrls: iu, videoUrls: vu };
      case 'bza-video-v3':
        return { ...base, resolution, aspectRatio, duration, generateAudio, seed: seed !== '' && seed !== undefined ? parseInt(seed) : undefined, negativePrompt, imageUrls: iu, firstFrameUrls: ffu, lastFrameUrls: lfu };
      case 'bza-video-g':
        return { ...base, resolution, aspectRatio, duration, imageUrls: iu };
      case 'dreamactor':
        return { imageUrls: iu, videoUrls: vu };
      case 'llm-chat':
        return { systemPrompt, userPrompt: prompt.trim(), temperature, maxTokens, enableThinking, enableSearch };
      case 'vision-g':
        return { systemPrompt, userPrompt: prompt.trim(), imageUrls: iu, temperature, maxTokens, detail, enableThinking };
      case 'joycaption':
        return { imageUrls: iu, captionType, captionLength, temperature, maxTokens, doSample, extraOptions, nameInput, customPrompt };
      case 'qwen-image':
        return { ...base, width: parseInt(customWidth) || 1024, height: parseInt(customHeight) || 1024, steps, guidanceScale, negativePrompt, seed: seed !== '' && seed !== undefined ? parseInt(seed) : undefined };
      case 'tts':
        return { input: prompt.trim(), voice, responseFormat, instructions, language, speed, maxTokens };
      default:
        return { ...base, resolution, aspectRatio, imageUrls: iu };
    }
  }, [paramType, prompt, resolution, aspectRatio, imageUrls, customWidth, customHeight, quality, duration, generateAudio, sound, multiShot, shotType, multiPrompt, negativePrompt, promptExtend, watermark, seed, display, keepOriginalSound, audio, offPeak, isRec, promptOptimizer, fastPretreatment, aigcWatermark, movementAmplitude, videoUrls, firstFrameUrls, lastFrameUrls, mediaUrls, refImages, audioSetting, drivingAudio, audioUrl, referenceVoice, bboxList, firstClipUrls, systemPrompt, temperature, maxTokens, enableThinking, enableSearch, detail, captionType, captionLength, doSample, extraOptions, nameInput, customPrompt, voice, responseFormat, instructions, language, speed, enableSequential, thinkingMode, colorPalette, batchSize, webSearch, returnLastFrame, topP, style, steps, guidanceScale, mode]);

  const livePrice = useMemo(() => calculatePrice(modelId, getPayloadParams()), [modelId, getPayloadParams]);

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
      await addCoinsSpent(price);
      await refreshUserInfo().catch(() => {});
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
