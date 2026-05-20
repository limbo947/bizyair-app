import React, { useState, useEffect, useCallback } from 'react';
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
  } = useAppContext();

  const [modelId, setModelId] = useState('bza-image-b2-base');
  const [mode, setMode] = useState('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [resolution, setResolution] = useState('2K');
  const [aspectRatio, setAspectRatio] = useState('4:3');
  const [quality, setQuality] = useState('medium');
  const [sizePreset, setSizePreset] = useState(0);
  const [customWidth, setCustomWidth] = useState('1024');
  const [customHeight, setCustomHeight] = useState('1024');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const currentModel = getModelInfo(modelId);
  const currentRatios = getRatios(modelId, mode);
  const currentResolutions = getResolutions(modelId, mode);
  const paramType = currentModel.paramType;

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
      setImageUrls([...imageUrls, uploadResult]);
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
        <View style={styles.titleRow}>
          <Ionicons name="image-outline" size={26} color={Colors.textPrimary} />
          <Text style={styles.title}>AI 图片生成</Text>
        </View>
        <View style={styles.modelScroll}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modelScrollContent}
          >
            {MODEL_IDS.map((id) => (
              <TouchableOpacity
                key={id}
                style={[styles.modelChip, modelId === id && styles.modelChipActive]}
                onPress={() => setModelId(id)}
              >
                <Text style={[styles.modelChipIcon, modelId === id && styles.modelChipIconActive]}>
                  {MODELS[id].icon}
                </Text>
                <Text style={[styles.modelChipText, modelId === id && styles.modelChipTextActive]}>
                  {MODELS[id].name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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
  header: { backgroundColor: Colors.card, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },
  modelScroll: { marginTop: Spacing.md },
  modelScrollContent: { gap: Spacing.sm, paddingRight: Spacing.xl },
  modelChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.bg, flexDirection: 'row', alignItems: 'center', gap: 4 },
  modelChipActive: { backgroundColor: Colors.primary, ...Shadows.sm },
  modelChipIcon: { fontSize: 14 },
  modelChipIconActive: { fontSize: 14 },
  modelChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  modelChipTextActive: { color: Colors.textInverse, fontWeight: '600' },
  modeToggle: { flexDirection: 'row', marginTop: Spacing.md, borderRadius: Radius.sm, backgroundColor: Colors.bg, padding: 2 },
  modeButton: { flex: 1, paddingVertical: 8, borderRadius: Radius.xs, alignItems: 'center' },
  modeButtonActive: { backgroundColor: Colors.card, ...Shadows.sm },
  modeButtonText: { fontSize: 14, color: Colors.textTertiary, fontWeight: '500' },
  modeButtonTextActive: { color: Colors.primary, fontWeight: '600' },
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
