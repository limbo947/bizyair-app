import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { submitImageTask, submitVideoTask, submitLLMTask, submitVisionTask, submitTTSTask } from '../services/apiClient';
import { calculatePrice, getRatios, getResolutions, getModelInfo, getActualResolution, getModelModes } from '../utils/modelHelpers';
import { buildPayload } from '../utils/payloadBuilder';
import { generateId } from '../utils/helpers';
import { ENV_API_KEY } from '../constants/models';
import { Colors, Radius, Spacing } from '../constants/theme';
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

export function HomeScreen({ onOpenModelSelect }) {
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
    addToHistory,
    startPolling,
    updateHistoryItem,
    homeState,
    saveHomeState,
    addCoinsSpent,
    userInfo,
    walletBalance,
    refreshUserInfo,
    favorites,
    history,
  } = useAppContext();
  const { themeMode, toggleTheme } = useTheme();

  const [modelId, setModelId] = useState(homeState.modelId);
  const [mode, setMode] = useState(homeState.mode);
  const [prompt, setPrompt] = useState(homeState.prompt);
  const [imageUrls, setImageUrls] = useState(homeState.imageUrls);
  const [resolution, setResolution] = useState(homeState.resolution);
  const [aspectRatio, setAspectRatio] = useState(homeState.aspectRatio);
  const [quality, setQuality] = useState(homeState.quality);
  const [sizePreset, setSizePreset] = useState(homeState.sizePreset);
  const [customWidth, setCustomWidth] = useState(homeState.customWidth);
  const [customHeight, setCustomHeight] = useState(homeState.customHeight);
  const [duration, setDuration] = useState(homeState.duration || 5);
  const [generateAudio, setGenerateAudio] = useState(homeState.generateAudio || false);
  const [sound, setSound] = useState(homeState.sound || false);
  const [multiShot, setMultiShot] = useState(homeState.multiShot || false);
  const [shotType, setShotType] = useState(homeState.shotType || 'customize');
  const [multiPrompt, setMultiPrompt] = useState(homeState.multiPrompt || '');
  const [negativePrompt, setNegativePrompt] = useState(homeState.negativePrompt || '');
  const [promptExtend, setPromptExtend] = useState(homeState.promptExtend !== undefined ? homeState.promptExtend : true);
  const [watermark, setWatermark] = useState(homeState.watermark !== undefined ? homeState.watermark : true);
  const [seed, setSeed] = useState(homeState.seed || '');
  const [display, setDisplay] = useState(homeState.display || 'horizontal');
  const [keepOriginalSound, setKeepOriginalSound] = useState(homeState.keepOriginalSound || false);
  const [audio, setAudio] = useState(homeState.audio || false);
  const [offPeak, setOffPeak] = useState(homeState.offPeak || false);
  const [isRec, setIsRec] = useState(homeState.isRec || false);
  const [promptOptimizer, setPromptOptimizer] = useState(homeState.promptOptimizer !== undefined ? homeState.promptOptimizer : false);
  const [fastPretreatment, setFastPretreatment] = useState(homeState.fastPretreatment || false);
  const [aigcWatermark, setAigcWatermark] = useState(homeState.aigcWatermark !== undefined ? homeState.aigcWatermark : false);
  const [videoUrls, setVideoUrls] = useState(homeState.videoUrls || []);
  const [firstFrameUrls, setFirstFrameUrls] = useState(homeState.firstFrameUrls || []);
  const [lastFrameUrls, setLastFrameUrls] = useState(homeState.lastFrameUrls || []);
  const [mediaUrls, setMediaUrls] = useState(homeState.mediaUrls || []);
  const [systemPrompt, setSystemPrompt] = useState(homeState.systemPrompt || '');
  const [temperature, setTemperature] = useState(homeState.temperature ?? 1.0);
  const [maxTokens, setMaxTokens] = useState(homeState.maxTokens || 4096);
  const [enableThinking, setEnableThinking] = useState(homeState.enableThinking !== undefined ? homeState.enableThinking : true);
  const [enableSearch, setEnableSearch] = useState(homeState.enableSearch !== undefined ? homeState.enableSearch : false);
  const [detail, setDetail] = useState(homeState.detail || 'medium');
  const [captionType, setCaptionType] = useState(homeState.captionType || 'Descriptive');
  const [captionLength, setCaptionLength] = useState(homeState.captionLength || 'medium-length');
  const [doSample, setDoSample] = useState(homeState.doSample !== undefined ? homeState.doSample : false);
  const [extraOptions, setExtraOptions] = useState(homeState.extraOptions || '');
  const [nameInput, setNameInput] = useState(homeState.nameInput || '');
  const [customPrompt, setCustomPrompt] = useState(homeState.customPrompt || '');
  const [voice, setVoice] = useState(homeState.voice || 'vivian');
  const [responseFormat, setResponseFormat] = useState(homeState.responseFormat || 'mp3');
  const [instructions, setInstructions] = useState(homeState.instructions || '');
  const [language, setLanguage] = useState(homeState.language || 'Auto');
  const [speed, setSpeed] = useState(homeState.speed || 1.0);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false);
  const [latestTextResult, setLatestTextResult] = useState('');

  const currentModel = getModelInfo(modelId);
  const currentRatios = getRatios(modelId, mode);
  const currentResolutions = getResolutions(modelId, mode);
  const currentModes = getModelModes(modelId);
  const paramType = currentModel.paramType;

  // 监听 LLM/Vision 模型的文本结果
  useEffect(() => {
    if (paramType !== 'llm-chat' && paramType !== 'vision-g' && paramType !== 'joycaption') return;
    const latest = history.find(h => h.modelId === modelId && h.status === 'Success' && h.textResult);
    if (latest?.textResult && latest.textResult !== latestTextResult) {
      setLatestTextResult(latest.textResult);
    }
  }, [history, modelId, paramType]);

  useEffect(() => {
    if (paramType === 'resolution-ratio' || paramType === 'wan-size') {
      const firstRes = currentResolutions[0] || '2K';
      if (!currentResolutions.includes(resolution)) {
        setResolution(firstRes);
      }
      if (currentRatios.length > 0 && !currentRatios.includes(aspectRatio)) {
        setAspectRatio(currentRatios[0]);
      }
    }
    // 验证当前模式是否被模型支持，不支持则切换到第一个可用模式
    if (currentModes.length > 0 && !currentModes.includes(mode)) {
      setMode(currentModes[0]);
    }
  }, [modelId, mode, paramType, currentResolutions, currentRatios, currentModes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveHomeState({
        modelId, mode, prompt, imageUrls, resolution, aspectRatio,
        quality, sizePreset, customWidth, customHeight,
        duration, generateAudio, sound, multiShot, shotType, multiPrompt,
        negativePrompt, promptExtend, watermark, seed, display,
        keepOriginalSound, audio, offPeak, isRec, promptOptimizer,
        fastPretreatment, aigcWatermark, videoUrls, firstFrameUrls,
        lastFrameUrls, mediaUrls,
        systemPrompt, temperature, maxTokens, enableThinking, enableSearch,
        detail, captionType, captionLength, doSample, extraOptions,
        nameInput, customPrompt, voice, responseFormat, instructions,
        language, speed,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [modelId, mode, prompt, imageUrls, resolution, aspectRatio, quality, sizePreset, customWidth, customHeight, saveHomeState, duration, generateAudio, sound, multiShot, shotType, multiPrompt, negativePrompt, promptExtend, watermark, seed, display, keepOriginalSound, audio, offPeak, isRec, promptOptimizer, fastPretreatment, aigcWatermark, videoUrls, firstFrameUrls, lastFrameUrls, mediaUrls, systemPrompt, temperature, maxTokens, enableThinking, enableSearch, detail, captionType, captionLength, doSample, extraOptions, nameInput, customPrompt, voice, responseFormat, instructions, language, speed]);

  const handleModelSelect = (id) => {
    setModelId(id);
  };

  const handleOpenFavorites = () => {
    setShowFavorites(true);
  };

  const handleOpenAllModels = () => {
    if (onOpenModelSelect) {
      onOpenModelSelect();
    }
  };

  const { handleFileSelect, handleLastFrameSelect, handleVideoSelect } = useFileUpload({
    apiKey,
    setShowApiKeyInput,
    setError,
    setIsUploading,
    setImageUrls,
    setLastFrameUrls,
    setVideoUrls,
  });

  // ⚠️ 同步风险：此 switch(paramType) 需与 HomeParamControls 的 switch 保持同步。
  // 新增 paramType 时必须同时修改两处。
  const getPayloadParams = useCallback(() => {
    const base = { prompt: prompt.trim() };
    switch (paramType) {
      case 'resolution-ratio':
        return { ...base, resolution, aspectRatio, imageUrls };
      case 'width-height-quality':
        return { ...base, width: parseInt(customWidth), height: parseInt(customHeight), quality, imageUrls };
      case 'size-only':
        return { ...base, resolution, imageUrls };
      case 'wan-size':
        return { ...base, resolution, customWidth, customHeight, imageUrls };
      case 'width-height':
        return { ...base, width: parseInt(customWidth), height: parseInt(customHeight) };
      case 'seedance-video':
        return { ...base, resolution, aspectRatio, duration, generateAudio, seed: seed ? parseInt(seed) : undefined, imageUrls, firstFrameUrls, lastFrameUrls, videoUrls };
      case 'kling-video':
        return { ...base, aspectRatio, duration, sound, multiShot, shotType, multiPrompt, seed: seed ? parseInt(seed) : undefined, firstFrameUrls, lastFrameUrls };
      case 'kling-o3-4k':
        return { ...base, aspectRatio, duration, sound, keepOriginalSound, multiShot, shotType, multiPrompt, imageUrls, videoUrls };
      case 'vidu-video':
        return { ...base, resolution, aspectRatio, duration, audio, isRec, offPeak, seed: seed ? parseInt(seed) : undefined, imageUrls, lastFrameUrls };
      case 'wan-video':
        return { ...base, resolution, aspectRatio, duration, promptExtend, watermark, negativePrompt, imageUrls, firstFrameUrls: mode === 'image-to-video' ? imageUrls : firstFrameUrls, lastFrameUrls, videoUrls, firstClipUrls: mode === 'video-extend' ? videoUrls : undefined, seed: seed ? parseInt(seed) : undefined };
      case 'wan-i2v':
        return { ...base, resolution, duration, promptExtend, audio, audioUrl: undefined, imageUrls };
      case 'hailuo-video':
        return { ...base, resolution, duration, promptOptimizer, fastPretreatment, aigcWatermark, imageUrls };
      case 'happyhorse-video':
        return { ...base, resolution, aspectRatio, duration, watermark, seed: seed ? parseInt(seed) : undefined, imageUrls, mediaUrls };
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
  }, [paramType, prompt, resolution, aspectRatio, imageUrls, customWidth, customHeight, quality, duration, generateAudio, sound, multiShot, shotType, multiPrompt, negativePrompt, promptExtend, watermark, seed, display, keepOriginalSound, audio, offPeak, isRec, promptOptimizer, fastPretreatment, aigcWatermark, videoUrls, firstFrameUrls, lastFrameUrls, mediaUrls, systemPrompt, temperature, maxTokens, enableThinking, enableSearch, detail, captionType, captionLength, doSample, extraOptions, nameInput, customPrompt, voice, responseFormat, instructions, language, speed, mode]);

  const currentPrice = useMemo(() => calculatePrice(modelId, getPayloadParams()), [modelId, getPayloadParams]);

  const handleGenerate = async () => {
    const isVideo = paramType?.startsWith('seedance') || paramType?.startsWith('kling') || paramType?.startsWith('vidu') ||
      paramType?.startsWith('wan-video') || paramType?.startsWith('wan-i2v') || paramType?.startsWith('hailuo') ||
      paramType?.startsWith('happyhorse') || paramType?.startsWith('ltx') || paramType?.startsWith('bza-video') ||
      paramType === 'dreamactor';
    const isText = paramType === 'llm-chat' || paramType === 'vision-g' || paramType === 'joycaption';
    const isAudio = paramType === 'tts';
    const initialOutputType = isVideo ? 'video' : isAudio ? 'audio' : isText ? 'text' : 'image';

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
    const price = currentPrice;
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
    await refreshUserInfo();

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
      paramType={paramType}
      currentModel={currentModel}
      currentResolutions={currentResolutions}
      currentRatios={currentRatios}
      resolution={resolution}
      setResolution={setResolution}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      quality={quality}
      setQuality={setQuality}
      sizePreset={sizePreset}
      setSizePreset={setSizePreset}
      customWidth={customWidth}
      setCustomWidth={setCustomWidth}
      customHeight={customHeight}
      setCustomHeight={setCustomHeight}
      duration={duration}
      setDuration={setDuration}
      generateAudio={generateAudio}
      setGenerateAudio={setGenerateAudio}
      seed={seed}
      setSeed={setSeed}
      sound={sound}
      setSound={setSound}
      multiShot={multiShot}
      setMultiShot={setMultiShot}
      shotType={shotType}
      setShotType={setShotType}
      multiPrompt={multiPrompt}
      setMultiPrompt={setMultiPrompt}
      keepOriginalSound={keepOriginalSound}
      setKeepOriginalSound={setKeepOriginalSound}
      negativePrompt={negativePrompt}
      setNegativePrompt={setNegativePrompt}
      promptExtend={promptExtend}
      setPromptExtend={setPromptExtend}
      watermark={watermark}
      setWatermark={setWatermark}
      display={display}
      setDisplay={setDisplay}
      audio={audio}
      setAudio={setAudio}
      offPeak={offPeak}
      setOffPeak={setOffPeak}
      isRec={isRec}
      setIsRec={setIsRec}
      promptOptimizer={promptOptimizer}
      setPromptOptimizer={setPromptOptimizer}
      fastPretreatment={fastPretreatment}
      setFastPretreatment={setFastPretreatment}
      aigcWatermark={aigcWatermark}
      setAigcWatermark={setAigcWatermark}
      systemPrompt={systemPrompt}
      setSystemPrompt={setSystemPrompt}
      temperature={temperature}
      setTemperature={setTemperature}
      maxTokens={maxTokens}
      setMaxTokens={setMaxTokens}
      enableThinking={enableThinking}
      setEnableThinking={setEnableThinking}
      enableSearch={enableSearch}
      setEnableSearch={setEnableSearch}
      detail={detail}
      setDetail={setDetail}
      captionType={captionType}
      setCaptionType={setCaptionType}
      captionLength={captionLength}
      setCaptionLength={setCaptionLength}
      doSample={doSample}
      setDoSample={setDoSample}
      extraOptions={extraOptions}
      setExtraOptions={setExtraOptions}
      nameInput={nameInput}
      setNameInput={setNameInput}
      customPrompt={customPrompt}
      setCustomPrompt={setCustomPrompt}
      voice={voice}
      setVoice={setVoice}
      responseFormat={responseFormat}
      setResponseFormat={setResponseFormat}
      instructions={instructions}
      setInstructions={setInstructions}
      language={language}
      setLanguage={setLanguage}
      speed={speed}
      setSpeed={setSpeed}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {userInfo && (apiKey || ENV_API_KEY) ? (
          <View style={styles.headerInner}>
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => setShowApiKeyDropdown(true)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: userInfo.avatar }} style={styles.headerAvatar} />
              <View style={styles.headerUserInfo}>
                <View style={styles.headerNameRow}>
                  <Text style={styles.headerUserName}>{userInfo.name}</Text>
                  {userInfo.user_level_str ? (
                    <MaterialCommunityIcons name="crown" size={14} color={Colors.warning} style={{ marginLeft: 4 }} />
                  ) : null}
                </View>
                <View style={styles.headerBalances}>
                  <MaterialCommunityIcons name="gold" size={14} color={Colors.warning} style={{ paddingRight: 2 }} />
                  <Text style={[styles.headerBalanceText, { paddingLeft: 2, paddingTop: 2 }]}>
                    {walletBalance?.charge_balance_amount ?? '--'}
                  </Text>
                  <MaterialCommunityIcons name="gold" size={14} color="#C0C0C0" style={{ marginLeft: 10, paddingRight: 2 }} />
                  <Text style={[styles.headerBalanceText, { paddingLeft: 2, paddingTop: 2 }]}>
                    {walletBalance?.gift_balance_amount ?? '--'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerAllModelsButton}
              onPress={handleOpenAllModels}
              activeOpacity={0.7}
            >
              <Text style={styles.headerAllModelsText}>所有模型</Text>
              <Ionicons name="apps-outline" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerThemeButton}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <Ionicons name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
                <Ionicons name="person-outline" size={20} color={Colors.textTertiary} />
              </View>
              <TextInput
                style={styles.headerApiInput}
                placeholder="输入Bizyair API Key"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                placeholderTextColor={Colors.textPlaceholder}
              />
            </View>
            {apiKey.trim() ? (
              <TouchableOpacity
                style={styles.headerSaveButton}
                onPress={() => { saveApiKey(apiKey); setShowApiKeyInput(false); }}
                activeOpacity={0.7}
              >
                <Text style={styles.headerSaveButtonText}>保存</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.headerAllModelsButton}>
                <Text style={styles.headerAllModelsText}>所有模型</Text>
                <Ionicons name="apps-outline" size={18} color={Colors.textPrimary} />
              </View>
            )}
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {showApiKeyInput ? (
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Ionicons name="key" size={16} color={Colors.warning} />
              <Text style={styles.label}>API 密钥</Text>
            </View>
            <TextInput
              style={styles.apiKeyInput}
              placeholder="输入你的Bizyair API Key"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              maxLength={100}
              placeholderTextColor={Colors.textPlaceholder}
            />
            {apiKey.trim() ? (
              <TouchableOpacity
                style={styles.saveKeyButton}
                onPress={() => { saveApiKey(apiKey); setShowApiKeyInput(false); }}
              >
                <Text style={styles.saveKeyButtonText}>保存密钥</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                key={m}
                style={[styles.modeButton, mode === m && styles.modeButtonActive]}
                onPress={() => setMode(m)}
              >
                <Text style={[styles.modeButtonText, mode === m && styles.modeButtonTextActive]}>
                  {MODE_LABELS[m] || m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>提示词</Text>
          <ResizableTextInput
            value={prompt}
            onChangeText={setPrompt}
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
              {mode === 'flf-to-video' ? '首帧图片' : mode === 'reference-to-video' ? '参考图片' : '参考图片'}
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={handleFileSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择图片上传'}
              </Text>
            </TouchableOpacity>
            {imageUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {imageUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Image source={{ uri: url }} style={styles.uploadedThumb} resizeMode="cover" />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      图片 {i + 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeUploadedButton}
                      onPress={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {mode === 'flf-to-video' ? (
          <View style={styles.card}>
            <Text style={styles.label}>尾帧图片</Text>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={handleLastFrameSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择尾帧图片'}
              </Text>
            </TouchableOpacity>
            {lastFrameUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {lastFrameUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Image source={{ uri: url }} style={styles.uploadedThumb} resizeMode="cover" />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      尾帧 {i + 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeUploadedButton}
                      onPress={() => setLastFrameUrls(lastFrameUrls.filter((_, j) => j !== i))}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {(mode === 'video-edit' || mode === 'reference-to-video' || mode === 'video-extend' || paramType === 'dreamactor') ? (
          <View style={styles.card}>
            <Text style={styles.label}>{paramType === 'dreamactor' ? '参考视频' : '上传视频'}</Text>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={handleVideoSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? '上传中...' : '选择视频上传'}
              </Text>
            </TouchableOpacity>
            {videoUrls.length > 0 ? (
              <View style={styles.uploadedList}>
                {videoUrls.map((url, i) => (
                  <View key={i} style={styles.uploadedItem}>
                    <Ionicons name="videocam" size={24} color={Colors.primary} />
                    <Text style={styles.uploadedName} numberOfLines={1}>
                      视频 {i + 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeUploadedButton}
                      onPress={() => setVideoUrls(videoUrls.filter((_, j) => j !== i))}
                    >
                      <Text style={styles.removeUploadedButtonText}>删除</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {paramControls}

        <TouchableOpacity
          style={[styles.generateButton, isSubmitting && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.textInverse} />
          ) : null}
          <Text style={styles.generateButtonText}>
            {isSubmitting
              ? '提交中...'
              : `${MODE_LABELS[mode] || '生成'} · ${currentPrice} 金币`}
          </Text>
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.card, paddingLeft: Spacing.md, paddingRight: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1, borderRadius: Radius.sm },
  headerAvatar: { width: 36, height: 36, borderRadius: 18 },
  headerAvatarPlaceholder: { backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  headerUserInfo: { flexDirection: 'column' },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 2 },
  headerUserName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  headerBalances: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  headerBalanceText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  headerApiInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, backgroundColor: Colors.bg, borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  headerSaveButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm, backgroundColor: Colors.primary },
  headerSaveButtonText: { color: Colors.textInverse, fontSize: 13, fontWeight: '600' },
  headerAllModelsButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, borderRadius: Radius.sm, gap: Spacing.xs },
  headerAllModelsText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  headerThemeButton: { padding: Spacing.sm, borderRadius: Radius.sm, backgroundColor: Colors.bg },
  modelAndModeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  modeToggle: { flexDirection: 'row', borderRadius: Radius.sm, backgroundColor: Colors.bg, padding: 2 },
  modeButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.xs, alignItems: 'center' },
  modeButtonActive: { backgroundColor: Colors.card },
  modeButtonText: { fontSize: 13, color: Colors.textTertiary, fontWeight: '500' },
  modeButtonTextActive: { color: Colors.primary, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8, paddingRight: Spacing.md, paddingBottom: Spacing.xxl, paddingLeft: Spacing.md },
  card: { backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  charCount: { fontSize: 12, color: Colors.textTertiary, textAlign: 'right', marginTop: Spacing.xs },
  uploadButton: { backgroundColor: Colors.primaryBg, paddingVertical: 18, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.primaryBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: Spacing.sm },
  uploadButtonDisabled: { opacity: 0.6 },
  uploadButtonText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  uploadedList: { marginTop: Spacing.md, gap: Spacing.sm },
  uploadedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, borderRadius: Radius.sm, padding: Spacing.sm, gap: 10 },
  uploadedThumb: { width: 44, height: 44, borderRadius: Radius.xs },
  uploadedName: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  removeUploadedButton: { backgroundColor: Colors.errorBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.xs },
  removeUploadedButtonText: { color: Colors.error, fontSize: 13, fontWeight: '600' },
  generateButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: Spacing.md },
  generateButtonDisabled: { backgroundColor: Colors.primaryDisabled },
  generateButtonText: { color: Colors.textInverse, fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: Spacing.md, fontSize: 14 },
  textResultBox: { maxHeight: 300, backgroundColor: Colors.bg, borderRadius: Radius.sm, padding: Spacing.md },
  textResultContent: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  apiKeyInput: { fontSize: 15, color: Colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, padding: Spacing.md, fontFamily: 'monospace', backgroundColor: Colors.bg },
  saveKeyButton: { backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: Radius.sm, alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: Colors.textInverse, fontSize: 15, fontWeight: '600' },
});
