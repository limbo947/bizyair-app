import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAppContext } from '../context/AppContext';
import { submitImageTask, uploadImageFile } from '../services/apiClient';
import { calculatePrice, getRatios, getResolutions, getModelInfo, getActualResolution } from '../utils/modelHelpers';
import { buildPayload } from '../utils/payloadBuilder';
import { MODELS, ENV_API_KEY } from '../constants/models';
import { Colors, Shadows, Radius, Spacing } from '../constants/theme';
import {
  ResolutionRatioControls,
  WidthHeightQualityControls,
  SizeOnlyControls,
  WanSizeControls,
  WidthHeightControls,
} from '../components/ParamControls';

const MODEL_IDS = Object.keys(MODELS);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function HomeScreen() {
  const {
    apiKey,
    setApiKey,
    saveApiKey,
    history,
    setHistory,
    persistHistory,
    startPolling,
    updateHistoryItem,
    homeState,
    saveHomeState,
    addCoinsSpent,
  } = useAppContext();

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
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const currentModel = getModelInfo(modelId);
  const currentRatios = getRatios(modelId, mode);
  const currentResolutions = getResolutions(modelId, mode);
  const paramType = currentModel.paramType;
  const dropdownButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const persistCurrentState = useCallback(() => {
    saveHomeState({
      modelId,
      mode,
      prompt,
      imageUrls,
      resolution,
      aspectRatio,
      quality,
      sizePreset,
      customWidth,
      customHeight,
    });
  }, [
    modelId,
    mode,
    prompt,
    imageUrls,
    resolution,
    aspectRatio,
    quality,
    sizePreset,
    customWidth,
    customHeight,
    saveHomeState,
  ]);

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
    if (!currentModel.supportsImageToImage && mode === 'image-to-image') {
      setMode('text-to-image');
    }
  }, [modelId, mode, paramType, currentResolutions, currentRatios, currentModel.supportsImageToImage]);

  useEffect(() => {
    persistCurrentState();
  }, [persistCurrentState]);

  const handleModelSelect = (id) => {
    setModelId(id);
    setShowModelDropdown(false);
  };

  const handleDropdownButtonLayout = (event) => {
    const { x, y, height } = event.nativeEvent.layout;
    setDropdownPosition({ x, y: y + height + 4 });
  };

  const handleFileSelect = async () => {
    const ek = apiKey.trim() || ENV_API_KEY;
    if (!ek) {
      setShowApiKeyInput(true);
      setError('请先配置API密钥');
      return;
    }
    setIsUploading(true);
    setError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) {
        setIsUploading(false);
        return;
      }
      const file = result.assets[0];
      const uploadResult = await uploadImageFile(ek, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'image/jpeg',
      });
      const newImageUrls = [...imageUrls, uploadResult];
      setImageUrls(newImageUrls);
    } catch (err) {
      setError(err.message || '上传失败');
    } finally {
      setIsUploading(false);
    }
  };

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
      default:
        return { ...base, resolution, aspectRatio, imageUrls };
    }
  }, [paramType, prompt, resolution, aspectRatio, imageUrls, customWidth, customHeight, quality]);

  const currentPrice = calculatePrice(modelId, getPayloadParams());

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }
    if (mode === 'image-to-image' && imageUrls.length === 0) {
      setError('请至少上传一张参考图片');
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
    const updated = [entry, ...history];
    setHistory(updated);
    await persistHistory(updated);

    await addCoinsSpent(price);

    try {
      const payload = buildPayload(modelId, mode, params);
      const { requestId, apiKey: taskApiKey } = await submitImageTask(ek, modelId, mode, payload);
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

  const paramControls = (() => {
    switch (paramType) {
      case 'resolution-ratio':
        return (
          <ResolutionRatioControls
            currentResolutions={currentResolutions}
            currentRatios={currentRatios}
            resolution={resolution}
            aspectRatio={aspectRatio}
            setResolution={setResolution}
            setAspectRatio={setAspectRatio}
          />
        );
      case 'width-height-quality':
        return (
          <WidthHeightQualityControls
            sizePreset={sizePreset}
            setSizePreset={setSizePreset}
            customWidth={customWidth}
            setCustomWidth={setCustomWidth}
            customHeight={customHeight}
            setCustomHeight={setCustomHeight}
            quality={quality}
            setQuality={setQuality}
            modelQualities={currentModel.qualities}
          />
        );
      case 'size-only':
        return (
          <SizeOnlyControls
            currentResolutions={currentResolutions}
            resolution={resolution}
            setResolution={setResolution}
          />
        );
      case 'wan-size':
        return (
          <WanSizeControls
            currentResolutions={currentResolutions}
            resolution={resolution}
            setResolution={setResolution}
            customWidth={customWidth}
            setCustomWidth={setCustomWidth}
            customHeight={customHeight}
            setCustomHeight={setCustomHeight}
          />
        );
      case 'width-height':
        return (
          <WidthHeightControls
            sizePreset={sizePreset}
            setSizePreset={setSizePreset}
            customWidth={customWidth}
            setCustomWidth={setCustomWidth}
            customHeight={customHeight}
            setCustomHeight={setCustomHeight}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            ref={dropdownButtonRef}
            style={styles.modelSelector}
            onPress={() => setShowModelDropdown(!showModelDropdown)}
            onLayout={handleDropdownButtonLayout}
            activeOpacity={0.7}
          >
            <Text style={styles.modelSelectorIcon}>{currentModel.icon}</Text>
            <Text style={styles.modelSelectorText}>{currentModel.name}</Text>
            <Text style={styles.modelSelectorArrow}>⌄</Text>
          </TouchableOpacity>
          
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'text-to-image' && styles.modeButtonActive]}
              onPress={() => setMode('text-to-image')}
            >
              <Text style={[styles.modeButtonText, mode === 'text-to-image' && styles.modeButtonTextActive]}>
                文生图
              </Text>
            </TouchableOpacity>
            {currentModel.supportsImageToImage ? (
              <TouchableOpacity
                style={[styles.modeButton, mode === 'image-to-image' && styles.modeButtonActive]}
                onPress={() => setMode('image-to-image')}
              >
                <Text style={[styles.modeButtonText, mode === 'image-to-image' && styles.modeButtonTextActive]}>
                  图生图
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      <Modal
        visible={showModelDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModelDropdown(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowModelDropdown(false)}>
          <View style={[styles.dropdownContainer, { top: dropdownPosition.y, left: dropdownPosition.x }]}>
            <View style={styles.dropdown}>
              <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
                {MODEL_IDS.map((id, index) => {
                  const model = MODELS[id];
                  const isActive = modelId === id;
                  return (
                    <TouchableOpacity
                      key={id}
                      style={[
                        styles.dropdownItem,
                        isActive && styles.dropdownItemActive,
                        index < MODEL_IDS.length - 1 && styles.dropdownItemBorder,
                      ]}
                      onPress={() => handleModelSelect(id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dropdownItemIcon, isActive && styles.dropdownItemIconActive]}>
                        {model.icon}
                      </Text>
                      <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                        {model.name}
                      </Text>
                      {isActive && (
                        <Ionicons name="checkmark" size={18} color={Colors.primary} style={styles.dropdownItemCheck} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Modal>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {showApiKeyInput ? (
          <View style={[styles.card, styles.apiKeyCard]}>
            <View style={styles.labelRow}>
              <Ionicons name="key-outline" size={16} color={Colors.warning} />
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
                onPress={() => {
                  saveApiKey(apiKey);
                  setShowApiKeyInput(false);
                }}
              >
                <Text style={styles.saveKeyButtonText}>保存密钥</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Ionicons name="key-outline" size={16} color={Colors.textTertiary} />
              <Text style={styles.label}>API 密钥</Text>
            </View>
            <View style={styles.apiKeyRow}>
              <Text style={styles.apiKeyMasked}>
                {ENV_API_KEY || apiKey ? '密钥已配置 ●●●●●●●●' : '未配置密钥'}
              </Text>
              <TouchableOpacity
                style={styles.changeKeyButton}
                onPress={() => {
                  if (!apiKey) setApiKey(ENV_API_KEY);
                  setShowApiKeyInput(true);
                }}
              >
                <Text style={styles.changeKeyButtonText}>
                  {apiKey || ENV_API_KEY ? '更换' : '输入'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>提示词</Text>
          <TextInput
            style={styles.promptInput}
            placeholder={mode === 'image-to-image' ? '描述你想对图片进行哪些修改...' : '描述你想生成的图片...'}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            maxLength={currentModel.maxPromptLength}
            placeholderTextColor={Colors.textPlaceholder}
          />
          <Text style={styles.charCount}>
            {prompt.length} / {currentModel.maxPromptLength}
          </Text>
        </View>

        {mode === 'image-to-image' ? (
          <View style={styles.card}>
            <Text style={styles.label}>参考图片</Text>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={handleFileSelect}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
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
              : `${mode === 'image-to-image' ? '图生图' : '生成图片'} · ${currentPrice} 金币`}
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.card, paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modelSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm, gap: Spacing.xs },
  modelSelectorIcon: { fontSize: 16 },
  modelSelectorText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  modelSelectorArrow: { fontSize: 16, color: Colors.textSecondary, marginTop: -4 },
  modeToggle: { flexDirection: 'row', borderRadius: Radius.sm, backgroundColor: Colors.bg, padding: 2 },
  modeButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.xs, alignItems: 'center' },
  modeButtonActive: { backgroundColor: Colors.card },
  modeButtonText: { fontSize: 13, color: Colors.textTertiary, fontWeight: '500' },
  modeButtonTextActive: { color: Colors.primary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: { position: 'absolute', zIndex: 1000 },
  dropdown: { backgroundColor: Colors.card, borderRadius: Radius.md, ...Shadows.lg, maxHeight: 320, minWidth: 180, overflow: 'hidden' },
  dropdownList: { maxHeight: 320 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  dropdownItemActive: { backgroundColor: Colors.primaryBg },
  dropdownItemBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  dropdownItemIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  dropdownItemIconActive: {},
  dropdownItemText: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  dropdownItemTextActive: { color: Colors.primary, fontWeight: '600' },
  dropdownItemCheck: { marginLeft: Spacing.sm },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  card: { backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md, ...Shadows.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  promptInput: { fontSize: 16, color: Colors.textPrimary, minHeight: 80, maxHeight: 160, textAlignVertical: 'top', borderWidth: 0, borderRadius: Radius.sm, padding: Spacing.md, backgroundColor: Colors.bg },
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
  generateButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: Spacing.md, ...Shadows.md },
  generateButtonDisabled: { backgroundColor: Colors.primaryDisabled },
  generateButtonText: { color: Colors.textInverse, fontSize: 17, fontWeight: '600', letterSpacing: -0.3 },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: Spacing.md, fontSize: 14 },
  apiKeyCard: { borderColor: Colors.warningBorder, borderWidth: 1 },
  apiKeyInput: { fontSize: 15, color: Colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, padding: Spacing.md, fontFamily: 'monospace', backgroundColor: Colors.bg },
  saveKeyButton: { backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: Radius.sm, alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: Colors.textInverse, fontSize: 15, fontWeight: '600' },
  apiKeyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  apiKeyMasked: { fontSize: 14, color: Colors.textTertiary },
  changeKeyButton: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: Colors.primaryBg, borderRadius: Radius.full },
  changeKeyButtonText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
});
