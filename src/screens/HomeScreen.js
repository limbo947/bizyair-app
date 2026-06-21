import React, { useState, useEffect, useMemo, useReducer, useCallback, useRef } from 'react';
import { Pressable, Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  Platform, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApiKeyContext } from '../context/ApiKeyContext';
import { useHomeStateContext, usePollingContext, useHistoryListContext } from '../context/history';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useToastContext } from '../context/ToastContext';
import { getRatios, getResolutions, getModelInfo, getModelModes, getModelPlaceholder } from '../utils/modelHelpers';
import { Radius, Spacing, Typography, ButtonVariants, Shadow, pressedOpacity } from '../constants/theme';
import { createSharedStyles } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useModelSwitch } from '../hooks/useModelSwitch';
import { ModelSelector } from '../components/ModelSelector';
import { FavoriteModelsLayer } from '../components/layout/FavoriteModelsLayer';
import { HomeParamControls } from '../components/params/HomeParamControls';
import { ResizableTextInput } from '../components/common/ResizableTextInput';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { AppHeader } from '../components/layout/AppHeader';
import { UploadCard } from '../components/media/UploadCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { MODE_LABELS, initialState, homeParamReducer } from './home/homeReducer';
import { useHomeSubmit } from './home/useHomeSubmit';
import { usePresets } from '../hooks/usePresets';
import { useFormValidation } from '../hooks/useFormValidation';
import { ParamPresetBar } from '../components/ParamPresetBar';
import { getUserMessage } from '../utils/errorMessages';

export function HomeScreen({ onOpenModelSelect }) {
  const insets = useSafeAreaInsets();

  // 启用 Android LayoutAnimation（iOS 默认启用）
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const {
    apiKey,
    setApiKey,
    saveApiKey,
    refreshUserInfo,
  } = useApiKeyContext();
  const {
    addToHistory,
    updateHistoryItem,
    history,
    addCoinsSpent,
  } = useHistoryListContext();
  const {
    startPolling,
  } = usePollingContext();
  const {
    homeState,
    saveHomeState,
  } = useHomeStateContext();
  const { favorites } = useFavoritesContext();
  const { colors } = useTheme();
  const { showToast } = useToastContext();
  const { presets, savePreset, deletePreset } = usePresets();

  const styles = useThemedStyles(createStyles);

  const [state, stateDispatch] = useReducer(homeParamReducer, {
    ...initialState,
    ...homeState,
  });

  const handleApplyPreset = useCallback((params) => {
    stateDispatch({ type: 'SET_PARAMS', params });
  }, [stateDispatch]);

  const { switchToModel, isSwitchingModelRef, stateRef } = useModelSwitch({ state, saveHomeState, stateDispatch });

  // 模型切换：homeState.modelId 变化时触发 switchToModel
  useEffect(() => {
    if (isSwitchingModelRef.current) return;
    if (homeState.modelId !== undefined && homeState.modelId !== stateRef.current.modelId) {
      switchToModel(homeState.modelId);
    }
  }, [homeState.modelId, switchToModel, isSwitchingModelRef, stateRef]);

  // 参数同步：homeState 字段变化时同步到本地 state
  // 通过 stateRef 读取当前 state，避免将 state 加入依赖导致 dispatch 后无限循环
  // 当模型切换时，switchToModel 会重置 state，因此需要无条件包含所有 homeState 参数
  useEffect(() => {
    if (isSwitchingModelRef.current) return;
    const s = stateRef.current;
    const modelSwitching = homeState.modelId !== undefined && homeState.modelId !== s.modelId;
    const patch = {};
    if (homeState.mode !== undefined && (modelSwitching || homeState.mode !== s.mode)) {
      patch.mode = homeState.mode;
    }
    // 同步 URL 数组字段
    const syncUrlArray = (key, homeVal) => {
      if (homeVal === undefined) return;
      if (!Array.isArray(homeVal)) {
        patch[key] = [];
        return;
      }
      if (modelSwitching) {
        patch[key] = homeVal;
        return;
      }
      const stateVal = s[key];
      if (!Array.isArray(stateVal) || homeVal.length !== stateVal.length
        || homeVal.some((v, i) => {
          const hv = typeof v === 'object' ? v.remoteUrl : v;
          const sv = typeof stateVal[i] === 'object' ? stateVal[i].remoteUrl : stateVal[i];
          return hv !== sv;
        })) {
        patch[key] = homeVal;
      }
    };
    syncUrlArray('imageUrls', homeState.imageUrls);
    syncUrlArray('videoUrls', homeState.videoUrls);
    syncUrlArray('firstFrameUrls', homeState.firstFrameUrls);
    syncUrlArray('lastFrameUrls', homeState.lastFrameUrls);
    syncUrlArray('firstClipUrls', homeState.firstClipUrls);
    syncUrlArray('refImages', homeState.refImages);
    // 同步标量参数字段
    const SCALAR_PARAMS = ['prompt', 'resolution', 'aspectRatio', 'quality', 'duration', 'seed', 'negativePrompt', 'systemPrompt', 'temperature', 'maxTokens', 'voice', 'style'];
    for (const key of SCALAR_PARAMS) {
      if (homeState[key] !== undefined && (modelSwitching || homeState[key] !== s[key])) {
        patch[key] = homeState[key];
      }
    }
    if (Object.keys(patch).length > 0) {
      stateDispatch({ type: 'SET_PARAMS', params: patch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeState.mode, homeState.imageUrls, homeState.videoUrls, homeState.firstFrameUrls, homeState.lastFrameUrls, homeState.firstClipUrls, homeState.refImages, homeState.prompt, homeState.resolution, homeState.aspectRatio, homeState.quality, homeState.duration, homeState.seed, homeState.negativePrompt, homeState.systemPrompt, homeState.temperature, homeState.maxTokens, homeState.voice, homeState.style, switchToModel, stateDispatch]);
  const {
    modelId, mode, prompt, imageUrls,
    videoUrls, firstFrameUrls, lastFrameUrls, firstClipUrls,
    refImages,
  } = state;

  const [showFavorites, setShowFavorites] = useState(false);
  const [favTriggerY, setFavTriggerY] = useState(0);
  const favTriggerRef = useRef(null);
  const resultScrollRef = useRef(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadField, setUploadField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  // 统一错误处理：直接调用 showToast，避免 error 状态覆盖问题
  // 兼容字符串和 Error 对象；空字符串表示清除错误，不弹 Toast
  const handleError = useCallback((errOrMsg) => {
    if (!errOrMsg) return;
    if (typeof errOrMsg === 'string' && errOrMsg.trim() === '') return;
    const msg = typeof errOrMsg === 'string' ? errOrMsg : getUserMessage(errOrMsg);
    showToast(msg, 'error');
  }, [showToast]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await saveApiKey(apiKey);
      setShowApiKeyInput(false);
    } catch (e) {
      handleError(e);
    } finally {
      setIsSaving(false);
    }
  };

  const currentModel = getModelInfo(modelId);
  const currentRatios = useMemo(() => getRatios(modelId, mode), [modelId, mode]);
  const currentResolutions = useMemo(() => getResolutions(modelId, mode), [modelId, mode]);
  const currentModes = useMemo(() => getModelModes(modelId), [modelId]);
  const paramType = currentModel.paramType;

  const latestTextResultItem = useMemo(() => {
    if (paramType !== 'llm-chat' && paramType !== 'vision-g' && paramType !== 'joycaption') return null;
    return history.find(h => h.modelId === modelId && h.status === 'Success' && h.textResult) || null;
  }, [history, modelId, paramType]);
  const latestTextResult = latestTextResultItem?.textResult || '';

  // 当最新结果变化时，自动滚动到结果区域顶部
  useEffect(() => {
    if (latestTextResult && resultScrollRef.current) {
      resultScrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [latestTextResult]);

  // 模型默认值同步：仅在模型/模式变化时触发，通过 stateRef 读取当前 state 避免无限循环
  // 合并为单次 dispatch，避免最多 17 次重渲染
  useEffect(() => {
    const model = getModelInfo(modelId);
    const s = stateRef.current;
    const patch = {};

    if (currentResolutions.length > 0 && !currentResolutions.includes(s.resolution)) {
      patch.resolution = model.defaultResolution || currentResolutions[0];
    }
    if (currentRatios.length > 0 && !currentRatios.includes(s.aspectRatio)) {
      patch.aspectRatio = currentRatios[0];
    }
    if (model.defaultWatermark !== undefined && s.watermark !== model.defaultWatermark) patch.watermark = model.defaultWatermark;
    if (model.defaultThinkingMode !== undefined && s.thinkingMode !== model.defaultThinkingMode) patch.thinkingMode = model.defaultThinkingMode;
    if (model.defaultPromptExtend !== undefined && s.promptExtend !== model.defaultPromptExtend) patch.promptExtend = model.defaultPromptExtend;
    if (model.defaultAudio !== undefined && s.audio !== model.defaultAudio) patch.audio = model.defaultAudio;
    if (model.defaultAudioSetting !== undefined && s.audioSetting !== model.defaultAudioSetting) patch.audioSetting = model.defaultAudioSetting;
    if (model.defaultDuration !== undefined && s.duration !== model.defaultDuration) patch.duration = model.defaultDuration;
    if (model.defaultSound !== undefined && s.sound !== model.defaultSound) patch.sound = model.defaultSound;
    if (model.defaultKeepOriginalSound !== undefined && s.keepOriginalSound !== model.defaultKeepOriginalSound) patch.keepOriginalSound = model.defaultKeepOriginalSound;
    if (model.defaultTemperature !== undefined && s.temperature !== model.defaultTemperature) patch.temperature = model.defaultTemperature;
    if (model.defaultMaxTokens !== undefined && s.maxTokens !== model.defaultMaxTokens) patch.maxTokens = model.defaultMaxTokens;
    if (model.defaultSpeed !== undefined && s.speed !== model.defaultSpeed) patch.speed = model.defaultSpeed;
    if (model.defaultVoice !== undefined && s.voice !== model.defaultVoice) patch.voice = model.defaultVoice;
    if (model.defaultFormat !== undefined && s.responseFormat !== model.defaultFormat) patch.responseFormat = model.defaultFormat;
    if (model.defaultLanguage !== undefined && s.language !== model.defaultLanguage) patch.language = model.defaultLanguage;
    if (currentModes.length > 0 && !currentModes.includes(s.mode)) {
      patch.mode = currentModes[0];
    }

    if (Object.keys(patch).length > 0) {
      stateDispatch({ type: 'SET_PARAMS', params: patch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId, mode, paramType, currentResolutions, currentRatios, currentModes]);

  // 草稿保存：500ms 防抖写入 AsyncStorage，同时更新保存状态指示器
  // 所有 setState 都在 timer 回调中异步调用，避免 effect 主体中同步 setState 触发级联渲染
  const idleTimerRef = useRef(null);
  const latestStateRef = useRef(state);
  useEffect(() => { latestStateRef.current = state; }, [state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      saveHomeState(state);
      setSaveStatus('saved');
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      // 2 秒后恢复 idle，避免长期显示"已保存"
      idleTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [state, saveHomeState]);

  // 修复：页面失焦或卸载时同步保存最新状态，防止防抖定时器被清除导致数据丢失
  useFocusEffect(
    useCallback(() => {
      return () => {
        // 页面失焦时，立即保存最新状态（跳过防抖）
        if (latestStateRef.current) {
          saveHomeState(latestStateRef.current);
        }
      };
    }, [saveHomeState])
  );

  const handleModelSelect = (id) => {
    switchToModel(id);
  };

  // 模式切换：带 LayoutAnimation 过渡，避免内容突变
  const handleModeChange = useCallback((m) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    stateDispatch({ type: 'SET_FIELD', field: 'mode', value: m });
  }, [stateDispatch]);

  const handleOpenFavorites = () => {
    if (favTriggerRef.current) {
      favTriggerRef.current.measure((_x, y, _w, _h, _px, py) => {
        setFavTriggerY(py);
      });
    }
    setShowFavorites(true);
  };

  const handleOpenAllModels = () => {
    if (onOpenModelSelect) {
      onOpenModelSelect();
    }
  };

  const makeUrlSetter = (field) => (urlsOrFn) => {
    stateDispatch({ type: 'SET_FIELD', field, value: urlsOrFn });
  };

  const { handleFileSelect, handleLastFrameSelect, handleVideoSelect, handleRefImageSelect, handleFirstClipSelect, handleFirstFrameSelect } = useFileUpload({
    apiKey,
    setShowApiKeyInput,
    setError: handleError,
    setUploadField,
    setImageUrls: makeUrlSetter('imageUrls'),
    setLastFrameUrls: makeUrlSetter('lastFrameUrls'),
    setVideoUrls: makeUrlSetter('videoUrls'),
    setRefImages: makeUrlSetter('refImages'),
    setFirstClipUrls: makeUrlSetter('firstClipUrls'),
    setFirstFrameUrls: makeUrlSetter('firstFrameUrls'),
  });

  const { livePrice, handleGenerate } = useHomeSubmit({
    state,
    paramType,
    modelId,
    mode,
    currentModel,
    apiKey,
    setShowApiKeyInput,
    setError: handleError,
    setIsSubmitting,
    addToHistory,
    addCoinsSpent,
    refreshUserInfo,
    updateHistoryItem,
    startPolling,
  });

  const { isValid, errors } = useFormValidation({ state, paramType, mode, apiKey });

  const handleGeneratePress = useCallback(() => {
    setHasAttemptedSubmit(true);
    // 校验未通过时提示具体错误原因，而非静默禁用
    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      const firstError = errors[firstErrorKey];
      showToast(firstError, 'warning');
      return;
    }
    Keyboard.dismiss();
    handleGenerate();
  }, [handleGenerate, isValid, errors, showToast]);

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
      state={state}
      dispatch={stateDispatch}
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

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
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
                style={({ pressed }) => [styles.saveKeyButton, pressed && pressedOpacity()]} onPress={handleSaveApiKey}
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
          <View style={{ flex: 1 }} ref={favTriggerRef} collapsable={false}>
            <ModelSelector
              currentModel={currentModel}
              modelId={modelId}
              onSelectModel={handleModelSelect}
              onOpenFavorites={handleOpenFavorites}
            />
          </View>
          <ParamPresetBar
            modelId={modelId}
            mode={mode}
            currentParams={state}
            onApplyPreset={handleApplyPreset}
            presets={presets}
            onSavePreset={savePreset}
            onDeletePreset={deletePreset}
          />
        </View>
        <View style={styles.modeToggle}>
          {currentModes.map((m) => (
            <Pressable
              key={m}
              style={({ pressed }) => [styles.modeButton, mode === m && styles.modeButtonActive, pressed && pressedOpacity()]} onPress={() => handleModeChange(m)}
            >
              <Text style={[styles.modeButtonText, mode === m && styles.modeButtonTextActive]}>
                {MODE_LABELS[m] || m}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, hasAttemptedSubmit && errors.prompt && styles.cardError]}>
          <View style={styles.promptLabelRow}>
            <Text style={[styles.label, { marginBottom: 0 }]}>
              提示词{paramType === 'dreamactor' ? <Text style={{ color: colors.textTertiary, fontWeight: Typography.fontWeight.regular }}> (可选)</Text> : <Text style={{ color: colors.error }}> *</Text>}
            </Text>
            {prompt ? (
              <Pressable style={({ pressed }) => pressed && pressedOpacity(0.6)} onPress={() => stateDispatch({ type: 'SET_FIELD', field: 'prompt', value: '' })} >
                <Text style={styles.promptClearText}>清空</Text>
              </Pressable>
            ) : null}
          </View>
          <ResizableTextInput
            value={prompt}
            onChangeText={(v) => stateDispatch({ type: 'SET_FIELD', field: 'prompt', value: v })}
            placeholder={getModelPlaceholder(modelId, mode)}
            maxLength={currentModel.maxPromptLength}
            minHeight={120}
          />
          <Text style={[styles.charCount, prompt.length >= currentModel.maxPromptLength * 0.9 && { color: colors.warning }]}>
            {prompt.length} / {currentModel.maxPromptLength}
          </Text>
          {hasAttemptedSubmit && errors.prompt ? <Text style={styles.fieldErrorText}>{errors.prompt}</Text> : null}
        </View>

        {(mode === 'image-to-image' || mode === 'image-to-video' || mode === 'flf-to-video' || mode === 'reference-to-video' || mode === 'vision' || paramType === 'dreamactor' || paramType === 'vision-g' || paramType === 'joycaption') ? (
          <UploadCard
            label={mode === 'flf-to-video' ? '首帧图片' : '参考图片'}
            required={mode === 'flf-to-video' || mode === 'image-to-image' || mode === 'image-to-video' || (mode === 'reference-to-video' && paramType === 'dreamactor') || mode === 'vision' || paramType === 'vision-g' || paramType === 'joycaption'}
            onUpload={handleFileSelect}
            isUploading={uploadField === 'imageUrls'}
            urls={imageUrls}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'imageUrls', value: imageUrls.filter((_, j) => j !== i) })}
            acceptType="image"
            itemPrefix={mode === 'flf-to-video' ? '首帧' : '图片'}
            error={hasAttemptedSubmit && errors.imageUrls ? errors.imageUrls : null}
          />
        ) : null}

        {mode === 'flf-to-video' || ((mode === 'image-to-video' || mode === 'video-extend') && paramType === 'wan-video') ? (
          <UploadCard
            label="尾帧图片"
            required={mode === 'flf-to-video'}
            onUpload={handleLastFrameSelect}
            isUploading={uploadField === 'lastFrameUrls'}
            urls={lastFrameUrls}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'lastFrameUrls', value: lastFrameUrls.filter((_, j) => j !== i) })}
            acceptType="image"
            itemPrefix="尾帧"
          />
        ) : null}

        {(mode === 'video-edit' || mode === 'reference-to-video' || mode === 'video-extend' || paramType === 'dreamactor') ? (
          <UploadCard
            label={paramType === 'dreamactor' ? '参考视频' : '上传视频'}
            required
            onUpload={handleVideoSelect}
            isUploading={uploadField === 'videoUrls'}
            urls={videoUrls}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'videoUrls', value: videoUrls.filter((_, j) => j !== i) })}
            acceptType="video"
            itemPrefix="视频"
            error={hasAttemptedSubmit && errors.videoUrls ? errors.videoUrls : null}
          />
        ) : null}

        {(mode === 'reference-to-video' || mode === 'video-edit') && paramType === 'wan-video' ? (
          <UploadCard
            label="首帧图片"
            required={false}
            onUpload={handleFirstFrameSelect}
            isUploading={uploadField === 'firstFrameUrls'}
            urls={firstFrameUrls}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'firstFrameUrls', value: firstFrameUrls.filter((_, j) => j !== i) })}
            acceptType="image"
            itemPrefix="首帧"
          />
        ) : null}

        {mode === 'image-to-video' && paramType === 'wan-video' ? (
          <UploadCard
            label="首段视频"
            required={false}
            onUpload={handleFirstClipSelect}
            isUploading={uploadField === 'firstClipUrls'}
            urls={firstClipUrls}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'firstClipUrls', value: firstClipUrls.filter((_, j) => j !== i) })}
            acceptType="video"
            itemPrefix="视频"
          />
        ) : null}

        {mode === 'video-edit' && (paramType === 'wan-video' || paramType === 'happyhorse-video') ? (
          <UploadCard
            label="参考图片"
            required={false}
            onUpload={handleRefImageSelect}
            isUploading={uploadField === 'refImages'}
            urls={refImages}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'refImages', value: refImages.filter((_, j) => j !== i) })}
            acceptType="image"
            itemPrefix="图片"
          />
        ) : null}

        {paramControls}

        {(paramType === 'llm-chat' || paramType === 'vision-g' || paramType === 'joycaption') && latestTextResult ? (
          <View style={styles.card}>
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleRow}>
                <Text style={styles.label}>返回结果</Text>
                <View style={styles.resultBadge}>
                  <Text style={styles.resultBadgeText}>最新</Text>
                </View>
              </View>
              {latestTextResultItem?.date ? (
                <Text style={styles.resultTimestamp}>{latestTextResultItem.date}</Text>
              ) : null}
            </View>
            <ScrollView ref={resultScrollRef} style={styles.textResultBox} nestedScrollEnabled>
              <MarkdownRenderer content={latestTextResult} />
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || Spacing.md }]}>
        <View style={styles.bottomBarTopRow}>
          {priceFormulaText ? (
            <Text style={styles.priceFormulaText}>{priceFormulaText}</Text>
          ) : <View />}
          {saveStatus !== 'idle' ? (
            <View style={styles.saveIndicator}>
              {saveStatus === 'saving' ? (
                <>
                  <ActivityIndicator size={10} color={colors.textTertiary} />
                  <Text style={styles.saveIndicatorText}>保存中...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                  <Text style={[styles.saveIndicatorText, { color: colors.success }]}>已保存</Text>
                </>
              )}
            </View>
          ) : null}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.generateButton,
            isSubmitting && styles.generateButtonDisabled,
            !isValid && !isSubmitting && styles.generateButtonWarn,
            pressed && pressedOpacity(),
          ]}
          onPress={handleGeneratePress}
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
      </View>
      </KeyboardAvoidingView>

      <FavoriteModelsLayer
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
        currentModelId={modelId}
        onSelectModel={handleModelSelect}
        favorites={favorites}
        triggerTop={favTriggerY}
      />
    </View>
  );
}

const createStyles = (colors) => {
  const shared = createSharedStyles(colors);
  return {
  container: { flex: 1, backgroundColor: colors.bg },
  modelAndModeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  modeToggle: { flexDirection: 'row', borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg, padding: 1, gap: Spacing.xs, marginBottom: Spacing.md, borderWidth: 1, borderColor: colors.divider, height: 45 },
  modeButton: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.xs, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  modeButtonActive: { backgroundColor: colors.card },
  modeButtonText: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary, fontWeight: Typography.fontWeight.medium },
  modeButtonTextActive: { color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.sm, paddingRight: Spacing.md, paddingBottom: Spacing.xl, paddingLeft: Spacing.md },
  bottomBar: { backgroundColor: colors.card, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 0.5, borderTopColor: colors.separator, ...Shadow.md },
  card: shared.card,
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: shared.label,
  promptLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  promptClearText: { fontSize: Typography.fontSize.caption1, color: colors.primary, fontWeight: Typography.fontWeight.medium },
  charCount: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary, textAlign: 'right', marginTop: Spacing.xs },
  generateButton: { backgroundColor: colors.primary, paddingVertical: ButtonVariants.primary.paddingVertical, borderRadius: ButtonVariants.primary.borderRadius, borderCurve: 'continuous', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: Spacing.md },
  generateButtonDisabled: { backgroundColor: colors.primaryDisabled },
  generateButtonWarn: { backgroundColor: colors.warning, opacity: 0.85 },
  generateButtonText: { color: colors.textInverse, fontSize: ButtonVariants.primary.fontSize, fontWeight: ButtonVariants.primary.fontWeight, letterSpacing: Typography.letterSpacing.tight },
  priceFormulaText: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, textAlign: 'center', lineHeight: Typography.lineHeight.tight, flex: 1 },
  bottomBarTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 16, marginBottom: Spacing.xs },
  saveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saveIndicatorText: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary },
  textResultBox: { maxHeight: 300, backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  resultTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  resultBadge: { backgroundColor: colors.successBg, paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: Radius.xs, borderCurve: 'continuous' },
  resultBadgeText: { fontSize: Typography.fontSize.caption2, color: colors.success, fontWeight: Typography.fontWeight.semibold },
  resultTimestamp: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary },
  apiKeyInput: { fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, fontFamily: 'monospace', backgroundColor: colors.bg },
  saveKeyButton: { backgroundColor: colors.primary, paddingVertical: Spacing.sm + 2, borderRadius: Radius.sm, borderCurve: 'continuous', alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: colors.textInverse, fontSize: Typography.fontSize.subheadline, fontWeight: Typography.fontWeight.semibold },
  cardError: { borderColor: colors.error, borderWidth: 1 },
  fieldErrorText: { fontSize: Typography.fontSize.caption1, color: colors.error, marginTop: Spacing.xs },
  };
};
