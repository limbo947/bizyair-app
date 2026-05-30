import React, { useState, useEffect, useMemo, useReducer, useRef } from 'react';
import { Pressable, Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useApiKeyContext } from '../context/ApiKeyContext';
import { useHistoryContext } from '../context/HistoryContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { getRatios, getResolutions, getModelInfo, getModelModes } from '../utils/modelHelpers';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ModelSelector } from '../components/ModelSelector';
import { FavoriteModelsLayer } from '../components/FavoriteModelsLayer';
import { HomeParamControls } from '../components/HomeParamControls';
import { ResizableTextInput } from '../components/ResizableTextInput';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { AppHeader } from '../components/AppHeader';
import { useFileUpload } from '../hooks/useFileUpload';
import { MODE_LABELS, initialState, homeParamReducer } from './home/homeReducer';
import { useHomeSubmit } from './home/useHomeSubmit';

export function HomeScreen({ onOpenModelSelect }) {
  const insets = useSafeAreaInsets();
  const {
    apiKey,
    setApiKey,
    saveApiKey,
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
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [state, stateDispatch] = useReducer(homeParamReducer, {
    ...initialState,
    ...homeState,
  });

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const s = stateRef.current;
    const patch = {};
    if (homeState.modelId !== undefined && homeState.modelId !== s.modelId) {
      patch.modelId = homeState.modelId;
    }
    if (homeState.mode !== undefined && homeState.mode !== s.mode) {
      patch.mode = homeState.mode;
    }
    const syncUrlArray = (key, homeVal) => {
      if (homeVal === undefined) return;
      if (!Array.isArray(homeVal)) {
        patch[key] = [];
        return;
      }
      const stateVal = s[key];
      /* 按数组长度比较，仅在变化时同步，避免无限循环 */
      if (!Array.isArray(stateVal) || homeVal.length !== stateVal.length) {
        patch[key] = homeVal;
      }
    };
    syncUrlArray('imageUrls', homeState.imageUrls);
    syncUrlArray('videoUrls', homeState.videoUrls);
    syncUrlArray('firstFrameUrls', homeState.firstFrameUrls);
    syncUrlArray('lastFrameUrls', homeState.lastFrameUrls);
    syncUrlArray('firstClipUrls', homeState.firstClipUrls);
    syncUrlArray('refImages', homeState.refImages);
    if (Object.keys(patch).length > 0) {
      stateDispatch({ type: 'SET_PARAMS', params: patch });
    }
  }, [homeState.modelId, homeState.mode, homeState.imageUrls, homeState.videoUrls, homeState.firstFrameUrls, homeState.lastFrameUrls, homeState.firstClipUrls, homeState.refImages]);
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

  const latestTextResult = useMemo(() => {
    if (paramType !== 'llm-chat' && paramType !== 'vision-g' && paramType !== 'joycaption') return '';
    const latest = history.find(h => h.modelId === modelId && h.status === 'Success' && h.textResult);
    return latest?.textResult || '';
  }, [history, modelId, paramType]);

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

  const thumbUri = (url) => {
    if (typeof url === 'string') return url;
    if (url && typeof url === 'object') {
      /* 优先使用本地预览地址，回退到远程地址 */
      return url.localUrl || url.remoteUrl || '';
    }
    return typeof url === 'string' ? url : '';
  };

  const makeUrlSetter = (actionType, stateKey) => (urlsOrFn) => {
    if (typeof urlsOrFn === 'function') {
      stateDispatch({ type: actionType, value: urlsOrFn(stateRef.current[stateKey]) });
    } else {
      stateDispatch({ type: actionType, value: urlsOrFn });
    }
  };

  const { handleFileSelect, handleLastFrameSelect, handleVideoSelect, handleRefImageSelect, handleFirstClipSelect, handleFirstFrameSelect } = useFileUpload({
    apiKey,
    setShowApiKeyInput,
    setError,
    setIsUploading,
    setImageUrls: makeUrlSetter('SET_IMAGE_URLS', 'imageUrls'),
    setLastFrameUrls: makeUrlSetter('SET_LAST_FRAME_URLS', 'lastFrameUrls'),
    setVideoUrls: makeUrlSetter('SET_VIDEO_URLS', 'videoUrls'),
    setRefImages: makeUrlSetter('SET_REF_IMAGES', 'refImages'),
    setFirstClipUrls: makeUrlSetter('SET_FIRST_CLIP_URLS', 'firstClipUrls'),
    setFirstFrameUrls: makeUrlSetter('SET_FIRST_FRAME_URLS', 'firstFrameUrls'),
  });

  const { livePrice, handleGenerate } = useHomeSubmit({
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
  });

  const priceFormulaText = useMemo(() => {
    const model = getModelInfo(modelId);
    if (!model) return null;
    if (model.priceFormulaRefVideo && mode === 'reference-to-video') {
      return model.priceFormulaRefVideo;
    }
    return model.priceFormula || null;
  }, [modelId, mode]);

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
      <AppHeader
        paddingTop={insets.top}
        showAllModelsButton
        onAllModelsPress={handleOpenAllModels}
      />

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
              提示词{paramType === 'dreamactor' ? <Text style={{ color: colors.textTertiary, fontWeight: '400' }}> (可选)</Text> : <Text style={{ color: colors.error }}> *</Text>}
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
                return <>{label}{isRequired ? <Text style={{ color: colors.error }}> *</Text> : <Text style={{ color: colors.textTertiary, fontWeight: '400' }}> (可选)</Text>}</>;
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
                    <Image source={{ uri: thumbUri(url) }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
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
                    <Image source={{ uri: thumbUri(url) }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
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
                    <Image source={{ uri: thumbUri(url) }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
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
                    <Image source={{ uri: thumbUri(url) }} style={styles.uploadedThumb} contentFit="cover" cachePolicy="memory-disk" transition={200} />
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
    </View>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.bg },
  modelAndModeRow: { marginBottom: 6 },
  modeToggle: { flexDirection: 'row', borderRadius: 8, borderCurve: 'continuous', backgroundColor: colors.bg, padding: 1, gap: 4, marginTop: 6, borderWidth: 1, borderColor: colors.divider, height: 45 },
  modeButton: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.xs, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  modeButtonActive: { backgroundColor: colors.card },
  modeButtonText: { fontSize: 13, color: colors.textTertiary, fontWeight: '500' },
  modeButtonTextActive: { color: colors.primary, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8, paddingRight: Spacing.md, paddingBottom: Spacing.xxl, paddingLeft: Spacing.md },
  card: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, borderCurve: 'continuous', marginBottom: Spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  promptLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  promptClearText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  charCount: { fontSize: 12, color: colors.textTertiary, textAlign: 'right', marginTop: Spacing.xs },
  uploadButton: { backgroundColor: colors.primaryBg, paddingVertical: 18, borderRadius: Radius.md, borderCurve: 'continuous', borderWidth: 1.5, borderColor: colors.primaryBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: Spacing.sm },
  uploadButtonDisabled: { opacity: 0.6 },
  uploadButtonText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  uploadedList: { marginTop: Spacing.md, gap: Spacing.sm },
  uploadedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.sm, gap: 10 },
  uploadedThumb: { width: 44, height: 44, borderRadius: Radius.xs, borderCurve: 'continuous' },
  uploadedName: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  removeUploadedButton: { backgroundColor: colors.errorBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.xs, borderCurve: 'continuous' },
  removeUploadedButtonText: { color: colors.error, fontSize: 13, fontWeight: '600' },
  generateButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: Radius.md, borderCurve: 'continuous', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: Spacing.sm },
  generateButtonDisabled: { backgroundColor: colors.primaryDisabled },
  generateButtonText: { color: colors.textInverse, fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },
  priceFormulaText: { fontSize: 12, color: colors.textTertiary, textAlign: 'center', marginBottom: Spacing.md, lineHeight: 18 },
  errorText: { color: colors.error, textAlign: 'center', marginBottom: Spacing.md, fontSize: 14 },
  textResultBox: { maxHeight: 300, backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md },
  apiKeyInput: { fontSize: 15, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, fontFamily: 'monospace', backgroundColor: colors.bg },
  saveKeyButton: { backgroundColor: colors.primary, paddingVertical: 10, borderRadius: Radius.sm, borderCurve: 'continuous', alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: colors.textInverse, fontSize: 15, fontWeight: '600' },
});
