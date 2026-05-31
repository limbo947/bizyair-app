import React, { useState, useEffect, useMemo, useReducer, useRef, useCallback } from 'react';
import { Pressable, Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApiKeyContext } from '../context/ApiKeyContext';
import { useHomeStateContext, usePollingContext, useHistoryListContext } from '../context/HistoryContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useToastContext } from '../context/ToastContext';
import { getRatios, getResolutions, getModelInfo, getModelModes, getModelPlaceholder } from '../utils/modelHelpers';
import { Radius, Spacing, ButtonStyles } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ModelSelector } from '../components/ModelSelector';
import { FavoriteModelsLayer } from '../components/FavoriteModelsLayer';
import { HomeParamControls } from '../components/HomeParamControls';
import { ResizableTextInput } from '../components/ResizableTextInput';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { AppHeader } from '../components/AppHeader';
import { UploadCard } from '../components/UploadCard';
import { useFileUpload } from '../hooks/useFileUpload';
import { MODE_LABELS, initialState, homeParamReducer } from './home/homeReducer';
import { useHomeSubmit } from './home/useHomeSubmit';
import { MODEL_STATES_KEY } from '../constants/models';

const MODEL_ID_MIGRATIONS = {
  'wan-2-7-image-pro-offcial': 'wan-2-7-image-pro-official',
  'wan-2-7-offcial': 'wan-2-7-extend-official',
};

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
  const styles = useThemedStyles(createStyles);

  const [state, stateDispatch] = useReducer(homeParamReducer, {
    ...initialState,
    ...homeState,
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
    const { modelId: mid, ...rest } = state;
    modelStatesRef.current[mid] = rest;
  }, [state]);

  const modelStatesRef = useRef({});
  const isSwitchingModelRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(MODEL_STATES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) || {};
          let migrated = false;
          for (const [oldId, newId] of Object.entries(MODEL_ID_MIGRATIONS)) {
            if (parsed[oldId]) {
              parsed[newId] = parsed[oldId];
              delete parsed[oldId];
              migrated = true;
            }
          }
          if (migrated) {
            await AsyncStorage.setItem(MODEL_STATES_KEY, JSON.stringify(parsed));
          }
          modelStatesRef.current = parsed;
        }
      } catch (_e) { /* ignore */ }
    })();
  }, []);

  const persistModelStates = useCallback(() => {
    AsyncStorage.setItem(MODEL_STATES_KEY, JSON.stringify(modelStatesRef.current)).catch(() => {});
  }, []);

  const switchToModel = useCallback((newId) => {
    const oldId = stateRef.current.modelId;
    if (oldId === newId) return;

    isSwitchingModelRef.current = true;

    const { modelId: _, ...oldSnapshot } = stateRef.current;
    modelStatesRef.current[oldId] = oldSnapshot;

    const cached = modelStatesRef.current[newId];
    const newModes = getModelModes(newId);
    let updates;
    if (cached) {
      updates = { ...cached, modelId: newId };
      if (newModes.length > 0 && !newModes.includes(cached.mode)) {
        updates.mode = newModes[0];
      }
    } else {
      updates = { ...initialState, modelId: newId };
      if (newModes.length > 0) updates.mode = newModes[0];
    }

    saveHomeState({ modelId: newId, mode: updates.mode });
    stateDispatch({ type: 'SET_PARAMS', params: updates });
    persistModelStates();

    isSwitchingModelRef.current = false;
  }, [saveHomeState, persistModelStates]);

  useEffect(() => {
    if (isSwitchingModelRef.current) return;
    const s = stateRef.current;
    if (homeState.modelId !== undefined && homeState.modelId !== s.modelId) {
      switchToModel(homeState.modelId);
      return;
    }
    const patch = {};
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
  }, [homeState.modelId, homeState.mode, homeState.imageUrls, homeState.videoUrls, homeState.firstFrameUrls, homeState.lastFrameUrls, homeState.firstClipUrls, homeState.refImages, switchToModel]);
  const {
    modelId, mode, prompt, imageUrls,
    videoUrls, firstFrameUrls, lastFrameUrls, firstClipUrls,
    refImages,
  } = state;

  const [showFavorites, setShowFavorites] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error, showToast]);

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
      stateDispatch({ type: 'SET_FIELD', field: 'resolution', value: model.defaultResolution || currentResolutions[0] });
    }
    if (currentRatios.length > 0 && !currentRatios.includes(s.aspectRatio)) {
      stateDispatch({ type: 'SET_FIELD', field: 'aspectRatio', value: currentRatios[0] });
    }
    if (model.defaultWatermark !== undefined && s.watermark !== model.defaultWatermark) stateDispatch({ type: 'SET_FIELD', field: 'watermark', value: model.defaultWatermark });
    if (model.defaultThinkingMode !== undefined && s.thinkingMode !== model.defaultThinkingMode) stateDispatch({ type: 'SET_FIELD', field: 'thinkingMode', value: model.defaultThinkingMode });
    if (model.defaultPromptExtend !== undefined && s.promptExtend !== model.defaultPromptExtend) stateDispatch({ type: 'SET_FIELD', field: 'promptExtend', value: model.defaultPromptExtend });
    if (model.defaultAudio !== undefined && s.audio !== model.defaultAudio) stateDispatch({ type: 'SET_FIELD', field: 'audio', value: model.defaultAudio });
    if (model.defaultAudioSetting !== undefined && s.audioSetting !== model.defaultAudioSetting) stateDispatch({ type: 'SET_FIELD', field: 'audioSetting', value: model.defaultAudioSetting });
    if (model.defaultDuration !== undefined && s.duration !== model.defaultDuration) stateDispatch({ type: 'SET_FIELD', field: 'duration', value: model.defaultDuration });
    if (model.defaultSound !== undefined && s.sound !== model.defaultSound) stateDispatch({ type: 'SET_FIELD', field: 'sound', value: model.defaultSound });
    if (model.defaultKeepOriginalSound !== undefined && s.keepOriginalSound !== model.defaultKeepOriginalSound) stateDispatch({ type: 'SET_FIELD', field: 'keepOriginalSound', value: model.defaultKeepOriginalSound });
    if (model.defaultTemperature !== undefined && s.temperature !== model.defaultTemperature) stateDispatch({ type: 'SET_FIELD', field: 'temperature', value: model.defaultTemperature });
    if (model.defaultMaxTokens !== undefined && s.maxTokens !== model.defaultMaxTokens) stateDispatch({ type: 'SET_FIELD', field: 'maxTokens', value: model.defaultMaxTokens });
    if (model.defaultSpeed !== undefined && s.speed !== model.defaultSpeed) stateDispatch({ type: 'SET_FIELD', field: 'speed', value: model.defaultSpeed });
    if (model.defaultVoice !== undefined && s.voice !== model.defaultVoice) stateDispatch({ type: 'SET_FIELD', field: 'voice', value: model.defaultVoice });
    if (model.defaultFormat !== undefined && s.responseFormat !== model.defaultFormat) stateDispatch({ type: 'SET_FIELD', field: 'responseFormat', value: model.defaultFormat });
    if (model.defaultLanguage !== undefined && s.language !== model.defaultLanguage) stateDispatch({ type: 'SET_FIELD', field: 'language', value: model.defaultLanguage });
    if (currentModes.length > 0 && !currentModes.includes(s.mode)) {
      stateDispatch({ type: 'SET_FIELD', field: 'mode', value: currentModes[0] });
    }
  }, [modelId, mode, paramType, currentResolutions, currentRatios, currentModes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveHomeState(state);
    }, 500);
    return () => clearTimeout(timer);
  }, [state, saveHomeState]);

  const handleModelSelect = (id) => {
    switchToModel(id);
  };

  const handleOpenFavorites = () => {
    setShowFavorites(true);
  };

  const handleOpenAllModels = () => {
    if (onOpenModelSelect) {
      onOpenModelSelect();
    }
  };

  const makeUrlSetter = (field) => (urlsOrFn) => {
    if (typeof urlsOrFn === 'function') {
      stateDispatch({ type: 'SET_FIELD', field, value: urlsOrFn(stateRef.current[field]) });
    } else {
      stateDispatch({ type: 'SET_FIELD', field, value: urlsOrFn });
    }
  };

  const { handleFileSelect, handleLastFrameSelect, handleVideoSelect, handleRefImageSelect, handleFirstClipSelect, handleFirstFrameSelect } = useFileUpload({
    apiKey,
    setShowApiKeyInput,
    setError,
    setIsUploading,
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

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                style={({ pressed }) => [styles.modeButton, mode === m && styles.modeButtonActive, pressed && { opacity: 0.7 }]} onPress={() => stateDispatch({ type: 'SET_FIELD', field: 'mode', value: m })}
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
              <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }} onPress={() => stateDispatch({ type: 'SET_FIELD', field: 'prompt', value: '' })} >
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
          <Text style={styles.charCount}>
            {prompt.length} / {currentModel.maxPromptLength}
          </Text>
        </View>

        {(mode === 'image-to-image' || mode === 'image-to-video' || mode === 'flf-to-video' || mode === 'reference-to-video' || mode === 'vision' || paramType === 'dreamactor' || paramType === 'vision-g' || paramType === 'joycaption') ? (
          <UploadCard
            label={mode === 'flf-to-video' ? '首帧图片' : '参考图片'}
            required={mode === 'flf-to-video' || mode === 'image-to-image' || mode === 'image-to-video' || (mode === 'reference-to-video' && paramType === 'dreamactor') || mode === 'vision' || paramType === 'vision-g' || paramType === 'joycaption'}
            onUpload={handleFileSelect}
            isUploading={isUploading}
            urls={imageUrls}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'imageUrls', value: imageUrls.filter((_, j) => j !== i) })}
            acceptType="image"
            itemPrefix={mode === 'flf-to-video' ? '首帧' : '图片'}
          />
        ) : null}

        {mode === 'flf-to-video' || ((mode === 'image-to-video' || mode === 'video-extend') && paramType === 'wan-video') ? (
          <UploadCard
            label="尾帧图片"
            required={mode === 'flf-to-video'}
            onUpload={handleLastFrameSelect}
            isUploading={isUploading}
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
            isUploading={isUploading}
            urls={videoUrls}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'videoUrls', value: videoUrls.filter((_, j) => j !== i) })}
            acceptType="video"
            itemPrefix="视频"
          />
        ) : null}

        {(mode === 'reference-to-video' || mode === 'video-edit') && paramType === 'wan-video' ? (
          <UploadCard
            label="首帧图片"
            required={false}
            onUpload={handleFirstFrameSelect}
            isUploading={isUploading}
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
            isUploading={isUploading}
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
            isUploading={isUploading}
            urls={refImages}
            onRemove={(i) => stateDispatch({ type: 'SET_FIELD', field: 'refImages', value: refImages.filter((_, j) => j !== i) })}
            acceptType="image"
            itemPrefix="图片"
          />
        ) : null}

        {paramControls}

        <Pressable
          style={({ pressed }) => [styles.generateButton, isSubmitting && styles.generateButtonDisabled, pressed && { opacity: 0.7 }]} onPress={() => { Keyboard.dismiss(); handleGenerate(); }}
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

        {(paramType === 'llm-chat' || paramType === 'vision-g' || paramType === 'joycaption') && latestTextResult ? (
          <View style={styles.card}>
            <Text style={styles.label}>返回结果</Text>
            <ScrollView style={styles.textResultBox} nestedScrollEnabled>
              <MarkdownRenderer content={latestTextResult} />
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
      </KeyboardAvoidingView>

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
  generateButton: { backgroundColor: colors.primary, paddingVertical: ButtonStyles.primary.paddingVertical, borderRadius: ButtonStyles.primary.borderRadius, borderCurve: 'continuous', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: Spacing.sm },
  generateButtonDisabled: { backgroundColor: colors.primaryDisabled },
  generateButtonText: { color: colors.textInverse, fontSize: ButtonStyles.primary.fontSize, fontWeight: ButtonStyles.primary.fontWeight, letterSpacing: -0.3 },
  priceFormulaText: { fontSize: 12, color: colors.textTertiary, textAlign: 'center', marginBottom: Spacing.md, lineHeight: 18 },
  textResultBox: { maxHeight: 300, backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md },
  apiKeyInput: { fontSize: 15, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, fontFamily: 'monospace', backgroundColor: colors.bg },
  saveKeyButton: { backgroundColor: colors.primary, paddingVertical: 10, borderRadius: Radius.sm, borderCurve: 'continuous', alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: colors.textInverse, fontSize: 15, fontWeight: '600' },
});
