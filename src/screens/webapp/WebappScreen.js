import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Pressable, Text,
  View,
  TextInput,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useApiKeyContext } from '../../context/ApiKeyContext';
import { useHistoryContext } from '../../context/history';
import { useTheme } from '../../context/ThemeContext';
import { useToastContext } from '../../context/ToastContext';
import { submitWebappTask, uploadImageFile, uploadVideoFile, fetchWebappDetail } from '../../services/apiClient';
import { generateId } from '../../utils/helpers';
import { ENV_API_KEY } from '../../constants/models';
import { Radius, Spacing, Typography, ButtonVariants, Shadow, pressedOpacity } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ResizableTextInput } from '../../components/common/ResizableTextInput';
import { AppHeader } from '../../components/layout/AppHeader';
import { isBizyairFileUrl, getMediaType, parseApiCode, parseFieldOptions } from './utils';
import { WebappListItem } from './WebappListItem';
import { CommunityAppSquare } from './CommunityAppSquare';
import { loadSavedApps, persistSavedApps } from './storage';

export function WebappScreen() {
  const insets = useSafeAreaInsets();
  const {
    apiKey, setApiKey, saveApiKey,
    refreshUserInfo,
  } = useApiKeyContext();
  const {
    addToHistory, startWebappPolling, updateHistoryItem,
  } = useHistoryContext();
  const { colors } = useTheme();
  const { showToast } = useToastContext();
  const styles = useThemedStyles(createStyles);

  // 模式：'list' | 'edit'
  const [mode, setMode] = useState('list');
  const [editingAppId, setEditingAppId] = useState(null); // 正在编辑的已保存应用 ID（null=新增）

  // 已保存应用列表
  const [savedApps, setSavedApps] = useState([]);

  // 编辑模式状态
  const [apiCodeText, setApiCodeText] = useState('');
  const [webAppId, setWebAppId] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [originalTypes, setOriginalTypes] = useState({});
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingKey, setUploadingKey] = useState(null);
  const [appDetail, setAppDetail] = useState(null);
  const [isLoadingApp, setIsLoadingApp] = useState(false);
  const [inputNodes, setInputNodes] = useState([]);
  const [appInfoExpanded, setAppInfoExpanded] = useState(true);

  // Combo 就地下拉状态
  const [comboExpanded, setComboExpanded] = useState(null);
  const [comboLayout, setComboLayout] = useState({ x: 0, y: 0, width: 0 });
  const [comboOptions, setComboOptions] = useState([]);
  const comboRefs = useRef({});

  // 保存名称弹窗
  const [saveNameVisible, setSaveNameVisible] = useState(false);
  const [saveNameText, setSaveNameText] = useState('');

  // 未保存修改追踪
  const [isDirty, setIsDirty] = useState(false);
  const skipDirtyRef = useRef(false);

  // 应用广场浮层
  const [squareVisible, setSquareVisible] = useState(false);
  // 返回确认对话框（替代 Alert.alert，兼容 Web 平台）
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  // 删除确认对话框
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const markDirty = useCallback(() => {
    if (!skipDirtyRef.current) setIsDirty(true);
  }, []);

  // 统一错误处理：设置 error 状态并显示 Toast（避免连续相同错误时 useEffect 不触发）
  const showError = useCallback((msg) => {
    setError(msg);
    if (msg) showToast(msg, 'error');
  }, [showToast]);

  // 加载已保存列表
  useEffect(() => {
    loadSavedApps().then(setSavedApps);
  }, []);

  // 重新加载已保存列表（供子组件收藏后回调）
  const reloadSavedApps = useCallback(() => {
    loadSavedApps().then(setSavedApps);
  }, []);

  // 应用 API 获取的详情数据到状态
  const applyAppDetail = useCallback((data) => {
    setAppDetail(data);
    setWebAppId(data.id);
    const sortedNodes = [...(data.input_nodes || [])].sort((a, b) => (a.sort ?? -1) - (b.sort ?? -1));
    setInputNodes(sortedNodes);
    const values = {}, types = {};
    for (const node of sortedNodes) {
      values[node.variable_name] = node.field_value;
      types[node.variable_name] = typeof node.field_value;
    }
    setInputValues(values);
    setOriginalTypes(types);
  }, []);

  // 从输入中提取 URL 并调用 API
  const handleFetchApp = useCallback(async (input) => {
    const urlMatch = input.match(/bizyair\.cn\/community\/app\/(\d+)/);
    if (!urlMatch) return false;
    const id = urlMatch[1];
    setIsLoadingApp(true);
    setError('');
    try {
      const data = await fetchWebappDetail(id);
      applyAppDetail(data);
      return true;
    } catch (err) {
      showError(err.message || '获取应用信息失败');
      // 失败时清理旧状态，避免残留
      setAppDetail(null); setInputNodes([]); setWebAppId(null);
      setInputValues({}); setOriginalTypes({});
      return false;
    } finally {
      setIsLoadingApp(false);
    }
  }, [applyAppDetail, showError]);

  // 从应用广场选择应用后，进入编辑模式并自动加载详情
  const handleSelectFromSquare = useCallback(async (item) => {
    skipDirtyRef.current = true;
    setEditingAppId(null);
    setApiCodeText('');
    setWebAppId(null);
    setInputValues({});
    setOriginalTypes({});
    setAppDetail(null);
    setInputNodes([]);
    setError('');
    setAppInfoExpanded(true);
    setComboExpanded(null);
    setIsDirty(false);
    setMode('edit');
    setTimeout(() => { skipDirtyRef.current = false; }, 0);
    // 复用现有 handleFetchApp 逻辑，传入社区应用 URL
    await handleFetchApp(`https://bizyair.cn/community/app/${item.id}`);
  }, [handleFetchApp]);

  const handleApiCodeChange = useCallback((text) => {
    setApiCodeText(text);
    markDirty();
  }, [markDirty]);

  const handleParse = useCallback(async () => {
    setError('');
    if (!apiCodeText.trim()) { showError('请输入应用 URL 或 API 代码'); return; }
    const fetched = await handleFetchApp(apiCodeText);
    if (fetched) return;
    const result = parseApiCode(apiCodeText);
    if (result.error) {
      showError(result.error);
      setWebAppId(null); setInputValues({}); setOriginalTypes({});
      setAppDetail(null); setInputNodes([]);
      return;
    }
    setAppDetail(null); setInputNodes([]);
    setWebAppId(result.webAppId);
    setInputValues(result.inputValues);
    setOriginalTypes(Object.fromEntries(Object.entries(result.inputValues).map(([k, v]) => [k, typeof v])));
    markDirty();
  }, [apiCodeText, handleFetchApp, markDirty, showError]);

  const handleParamChange = useCallback((key, text) => {
    setInputValues((prev) => {
      const updated = { ...prev };
      if (originalTypes[key] === 'number') {
        // 保留中间状态：空、'-'、小数点结尾（如 '0.'、'-1.'），避免 Number() 转换丢失小数点
        if (text === '' || text === '-' || text.endsWith('.')) {
          updated[key] = text;
        } else {
          const num = Number(text);
          updated[key] = !isNaN(num) ? num : text;
        }
      } else { updated[key] = text; }
      return updated;
    });
    markDirty();
  }, [originalTypes, markDirty]);

  const handleFileUpload = useCallback(async (key, mediaType) => {
    const ek = apiKey.trim() || ENV_API_KEY;
    if (!ek) { setShowApiKeyInput(true); showError('请先配置API密钥'); return; }
    try {
      const mimeType = mediaType === 'video' ? 'video/*' : mediaType === 'audio' ? 'audio/*' : mediaType === 'image' ? 'image/*' : '*/*';
      const result = await DocumentPicker.getDocumentAsync({ type: mimeType, copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.length) return;
      setUploadingKey(key); setError('');
      const file = result.assets[0];
      const uploadFn = mediaType === 'video' ? uploadVideoFile : uploadImageFile;
      const uploadedUrl = await uploadFn(ek, {
        uri: file.uri, name: file.name,
        type: file.mimeType || (mediaType === 'video' ? 'video/mp4' : mediaType === 'audio' ? 'audio/mpeg' : mediaType === 'image' ? 'image/jpeg' : 'application/octet-stream'),
      });
      setInputValues((prev) => ({ ...prev, [key]: uploadedUrl }));
      markDirty();
    } catch (err) { showError(err.message || '上传失败'); }
    finally { setUploadingKey(null); }
  }, [apiKey, markDirty, showError]);

  const handleSaveApiKey = useCallback(async () => {
    if (!apiKey.trim() || isSaving) return;
    setIsSaving(true); setError('');
    try { await saveApiKey(apiKey); setShowApiKeyInput(false); }
    catch (e) { showError('保存失败: ' + (e.message || '未知错误')); }
    finally { setIsSaving(false); }
  }, [apiKey, isSaving, saveApiKey, showError]);

  // 保存应用到列表（新增/编辑共用）
  const handleSaveApp = useCallback(() => {
    if (!webAppId) { showError('请先获取参数'); return; }
    const existingApp = editingAppId ? savedApps.find(a => a.id === editingAppId) : null;
    const defaultName = existingApp?.name || appDetail?.name || `WebApp #${webAppId}`;
    setSaveNameText(defaultName);
    setSaveNameVisible(true);
  }, [webAppId, appDetail, editingAppId, savedApps, showError]);

  const confirmSaveApp = useCallback(() => {
    const name = saveNameText.trim() || `WebApp #${webAppId}`;
    const now = Date.now();
    const appEntry = {
      id: editingAppId || generateId(),
      name,
      bizyModelId: appDetail?.bizy_model_id || null,
      webAppId: Number(webAppId),
      apiCodeText,
      appDetail: appDetail ? { name: appDetail.name, base_model: appDetail.base_model, intro: appDetail.intro, cover_urls: appDetail.cover_urls } : null,
      inputNodes,
      inputValues: { ...inputValues },
      originalTypes: { ...originalTypes },
      createdAt: editingAppId ? (savedApps.find(a => a.id === editingAppId)?.createdAt || now) : now,
      updatedAt: now,
    };
    const updatedList = editingAppId
      ? savedApps.map(a => a.id === editingAppId ? appEntry : a)
      : [appEntry, ...savedApps];
    setSavedApps(updatedList);
    persistSavedApps(updatedList);
    setSaveNameVisible(false);
    setIsDirty(false);
    setMode('list');
  }, [saveNameText, webAppId, editingAppId, apiCodeText, appDetail, inputNodes, inputValues, originalTypes, savedApps]);

  // 进入编辑模式
  const enterEditMode = useCallback((app = null) => {
    skipDirtyRef.current = true;
    if (app) {
      setEditingAppId(app.id);
      setApiCodeText(app.apiCodeText || '');
      setWebAppId(app.webAppId);
      setInputValues(app.inputValues || {});
      setOriginalTypes(app.originalTypes || {});
      setAppDetail(app.appDetail || null);
      setInputNodes(app.inputNodes || []);
    } else {
      setEditingAppId(null);
      setApiCodeText(''); setWebAppId(null); setInputValues({});
      setOriginalTypes({}); setAppDetail(null); setInputNodes([]);
    }
    setError(''); setAppInfoExpanded(true);
    setComboExpanded(null);
    setIsDirty(false);
    setMode('edit');
    setTimeout(() => { skipDirtyRef.current = false; }, 0);
  }, []);

  // 删除应用（弹出确认对话框）
  const deleteApp = useCallback((id) => {
    setPendingDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  // 确认删除
  const confirmDeleteApp = useCallback(() => {
    if (pendingDeleteId) {
      const updated = savedApps.filter(a => a.id !== pendingDeleteId);
      setSavedApps(updated);
      persistSavedApps(updated);
    }
    setShowDeleteConfirm(false);
    setPendingDeleteId(null);
  }, [pendingDeleteId, savedApps]);

  // 返回列表（带未保存修改提示）
  const handleBack = useCallback(() => {
    if (isDirty) {
      setShowBackConfirm(true);
    } else {
      setMode('list');
    }
  }, [isDirty]);

  // 确认放弃修改
  const confirmDiscardAndBack = useCallback(() => {
    setShowBackConfirm(false);
    setIsDirty(false);
    setMode('list');
  }, []);

  // 编辑模式提交任务
  const handleSubmit = useCallback(async () => {
    if (!webAppId) { showError('请先获取应用信息或解析 API 代码'); return; }
    if (Object.keys(inputValues).length === 0) { showError('未检测到输入参数'); return; }
    const ek = apiKey.trim() || ENV_API_KEY;
    if (!ek) { setShowApiKeyInput(true); showError('请先输入API密钥'); return; }
    setIsSubmitting(true); setError('');
    const id = generateId(); const now = Date.now();
    const cleanInputValues = { ...inputValues };
    for (const key of Object.keys(cleanInputValues)) {
      if (originalTypes[key] === 'number' && typeof cleanInputValues[key] === 'string') {
        const num = Number(cleanInputValues[key]); if (!isNaN(num)) cleanInputValues[key] = num;
      }
    }
    const appName = appDetail?.name || `AI应用 #${webAppId}`;
    const entry = {
      id, source: 'webapp', webAppId: Number(webAppId), outputType: 'unknown',
      prompt: appName, resolution: '', aspectRatio: '', price: 0,
      mode: 'webapp', modelId: 'webapp', modelName: appName,
      status: 'Pending', errorMessage: '', lastResponse: null,
      startedAt: now, completedAt: null,
      date: new Date(now).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    };
    await addToHistory(entry);
    await refreshUserInfo().catch((e) => console.warn('提交后刷新用户信息失败:', e?.message || e));
    try {
      const requestId = await submitWebappTask(ek, webAppId, cleanInputValues);
      updateHistoryItem(id, { status: 'Pending', requestId, taskApiKey: ek, lastResponse: { status: 'Pending', request_id: requestId } });
      startWebappPolling(id, requestId, ek);
    } catch (err) {
      showError(err.message || '提交失败');
      updateHistoryItem(id, { status: 'Failed', errorMessage: err.message, lastResponse: { status: 'Failed', error: err.message } });
    } finally { setIsSubmitting(false); }
    Keyboard.dismiss();
  }, [webAppId, inputValues, apiKey, showError, appDetail, originalTypes, addToHistory, refreshUserInfo, updateHistoryItem, startWebappPolling]);

  const hasParsed = webAppId !== null;
  const getNodeInfo = useCallback((key) => {
    if (!inputNodes.length) return null;
    return inputNodes.find((n) => n.variable_name === key) || null;
  }, [inputNodes]);

  // 参数列表数据（仅解析后才有值，FlatList 虚拟化）
  const paramEntries = useMemo(() => hasParsed ? Object.entries(inputValues) : [], [hasParsed, inputValues]);

  // ============ 列表模式渲染 ============
  // 奇数个时末尾填充占位 item，避免最后一行单个卡片撑满整行
  const gridData = useMemo(() => {
    if (savedApps.length === 0 || savedApps.length % 2 === 0) return savedApps;
    return [...savedApps, { id: '__placeholder__', _isPlaceholder: true }];
  }, [savedApps]);

  const renderListItem = useCallback(({ item }) => {
    if (item._isPlaceholder) {
      return <View style={[styles.gridCard, { backgroundColor: 'transparent' }]} />;
    }
    return <WebappListItem item={item} onEdit={enterEditMode} onDelete={deleteApp} colors={colors} styles={styles} />;
  }, [colors, enterEditMode, deleteApp, styles]);

  // ============ 参数卡片渲染（FlatList 行组件） ============
  const renderParamCard = useCallback(({ item: [key, value] }) => {
    const nodeInfo = getNodeInfo(key);
    const nodeType = nodeInfo?.node_type || '';
    const fieldType = nodeInfo?.field_type || (isBizyairFileUrl(value) ? 'hidden' : (typeof value === 'number' ? 'number' : 'string'));
    const fieldLabel = nodeInfo?.field_label || key;
    const fieldOpts = nodeInfo ? parseFieldOptions(nodeInfo.field_options) : {};
    const mediaType = fieldType === 'hidden' ? getMediaType(nodeType, value) : null;
    const isFileUpload = mediaType !== null;
    const uploadLabel = mediaType === 'video' ? (uploadingKey === key ? '上传中...' : value ? '更换视频' : '上传视频')
      : mediaType === 'audio' ? (uploadingKey === key ? '上传中...' : value ? '更换音频' : '上传音频')
      : mediaType === 'file' ? (uploadingKey === key ? '上传中...' : value ? '更换文件' : '上传文件')
      : (uploadingKey === key ? '上传中...' : value ? '更换图片' : '上传图片');
    const uploadIcon = mediaType === 'video' ? 'videocam-outline' : mediaType === 'audio' ? 'musical-notes-outline' : mediaType === 'file' ? 'document-attach-outline' : 'cloud-upload-outline';
    const fileInfoIcon = mediaType === 'video' ? 'videocam' : mediaType === 'audio' ? 'headset' : mediaType === 'file' ? 'document-attach' : 'image';

    return (
      <View style={styles.paramCard} key={key}>
        <View style={styles.paramHeader}>
          <View>
            <Text style={styles.paramLabel}>{fieldLabel}</Text>
            <Text style={styles.paramKey}>{key}</Text>
          </View>
          {((fieldType === 'string' || fieldType === 'number' || fieldType === 'slider') && String(inputValues[key]).length > 0) ? (
            <Pressable style={({ pressed }) => pressed && pressedOpacity()} onPress={() => handleParamChange(key, '')}>
              <Text style={styles.clearButtonText}>清空</Text>
            </Pressable>
          ) : null}
        </View>

        {isFileUpload ? (
          <View style={styles.imageParamContainer}>
            {value ? (
              <View style={styles.filePreviewWrapper}>
                {mediaType === 'image' ? (
                  <Image source={{ uri: value }} style={styles.imagePreview} contentFit="contain" />
                ) : (
                  <View style={styles.fileInfoRow}>
                    <Ionicons name={fileInfoIcon} size={20} color={colors.primary} />
                    <Text style={styles.fileInfoText} numberOfLines={1}>{value.split('/').pop().split('?')[0]}</Text>
                  </View>
                )}
                <Pressable style={({ pressed }) => [styles.fileDeleteBtn, pressed && pressedOpacity()]} onPress={() => handleParamChange(key, '')} accessibilityRole="button" accessibilityLabel="删除文件">
                  <Ionicons name="close-circle" size={22} color={colors.error} />
                </Pressable>
              </View>
            ) : null}
            <Pressable style={({ pressed }) => [styles.uploadButton, pressed && pressedOpacity()]} onPress={() => handleFileUpload(key, mediaType)} disabled={uploadingKey === key} >
              {uploadingKey === key ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name={uploadIcon} size={18} color={colors.primary} />}
              <Text style={styles.uploadButtonText}>{uploadLabel}</Text>
            </Pressable>
          </View>
        ) : fieldType === 'combo' ? (
          <Pressable
            ref={ref => { comboRefs.current[key] = ref; }}
            style={({ pressed }) => [styles.comboButton, pressed && pressedOpacity()]} onPress={() => {
              const ref = comboRefs.current[key];
              if (ref) {
                ref.measure((x, y, width, height, pageX, pageY) => {
                  setComboLayout({ x: pageX, y: pageY + height, width });
                  setComboExpanded(comboExpanded === key ? null : key);
                  setComboOptions(fieldOpts.values || []);
                });
              }
            }} >
            <Text style={styles.comboValue} numberOfLines={1}>{String(value)}</Text>
            <Ionicons name={comboExpanded === key ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
          </Pressable>
        ) : fieldType === 'number' || fieldType === 'slider' ? (
          <View>
            <TextInput
              style={styles.paramInput}
              value={String(inputValues[key])}
              onChangeText={(text) => handleParamChange(key, text)}
              placeholder={key}
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {fieldOpts.min !== undefined || fieldOpts.max !== undefined ? (
              <Text style={styles.rangeHint}>
                范围: {fieldOpts.min ?? '-∞'} ~ {fieldOpts.max ?? '∞'}
                {fieldOpts.step ? `  步长: ${fieldOpts.step}` : ''}
              </Text>
            ) : null}
          </View>
        ) : typeof value === 'string' && value.length > 50 ? (
          <ResizableTextInput
            value={String(inputValues[key])}
            onChangeText={(text) => handleParamChange(key, text)}
            placeholder={key}
            placeholderTextColor={colors.textPlaceholder}
          />
        ) : (
          <TextInput style={styles.paramInput} value={String(inputValues[key])} onChangeText={(text) => handleParamChange(key, text)} placeholder={key} placeholderTextColor={colors.textPlaceholder} autoCapitalize="none" autoCorrect={false} />
        )}
      </View>
    );
  }, [getNodeInfo, inputValues, handleParamChange, handleFileUpload, uploadingKey, comboExpanded, colors, styles]);

  // ============ 编辑模式 ListHeader ============
  const renderListHeader = useCallback(() => (
    <>
      {showApiKeyInput ? (
        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Ionicons name="key" size={16} color={colors.warning} />
            <Text style={styles.label}>API 密钥</Text>
          </View>
          <TextInput style={styles.apiKeyInput} placeholder="输入你的Bizyair API Key" value={apiKey} onChangeText={setApiKey} secureTextEntry maxLength={100} placeholderTextColor={colors.textPlaceholder} />
          {apiKey.trim() ? (
            <Pressable style={({ pressed }) => [styles.saveKeyButton, pressed && pressedOpacity()]} onPress={handleSaveApiKey} disabled={isSaving}>
              {isSaving ? <ActivityIndicator size="small" color={colors.textInverse} /> : <Text style={styles.saveKeyButtonText}>保存密钥</Text>}
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {/* 输入卡片 - 仅新增模式显示 */}
      {!editingAppId && (
      <View style={styles.card}>
        <View style={styles.labelRow}>
          <Ionicons name="search-outline" size={16} color={colors.primary} />
          <Text style={styles.label}>应用网址/示例API</Text>
          <View style={{ flex: 1 }} />
          {apiCodeText.length > 0 ? (
            <Pressable style={({ pressed }) => pressed && pressedOpacity()} onPress={() => { setApiCodeText(''); markDirty(); }}>
              <Text style={styles.clearButtonText}>清空</Text>
            </Pressable>
          ) : null}
        </View>
        <TextInput
          style={styles.codeInput}
          value={apiCodeText}
          onChangeText={handleApiCodeChange}
          placeholder="粘贴应用网址或示例API代码...公开的AI应用建议使用网址导入，未公开的AI应用无法使用网址导入"
          placeholderTextColor={colors.textPlaceholder}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />
        <View style={styles.parseButtonRow}>
          <Pressable style={({ pressed }) => [styles.parseButton, isLoadingApp && styles.parseButtonDisabled, { flex: 1 }, pressed && pressedOpacity()]} onPress={handleParse} disabled={isLoadingApp}>
            {isLoadingApp ? <ActivityIndicator size="small" color={colors.textInverse} /> : <Ionicons name="search-outline" size={16} color={colors.textInverse} />}
            <Text style={styles.parseButtonText}>{isLoadingApp ? '获取中...' : '获取参数'}</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.saveAppButton, !hasParsed && styles.saveAppButtonDisabled, pressed && pressedOpacity()]} onPress={handleSaveApp} disabled={!hasParsed}>
            <Ionicons name="save-outline" size={16} color={hasParsed ? colors.primary : colors.textTertiary} />
            <Text style={[styles.saveAppButtonText, !hasParsed && { color: colors.textTertiary }]}>保存</Text>
          </Pressable>
        </View>
      </View>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* 应用信息卡片（可折叠） */}
      {hasParsed && appDetail ? (
        <View style={styles.appInfoCard}>
          <Pressable style={({ pressed }) => [styles.appInfoHeader, pressed && pressedOpacity()]} onPress={() => setAppInfoExpanded(!appInfoExpanded)} >
            <Ionicons name="apps-outline" size={18} color={colors.primary} />
            <Text style={styles.appInfoName} numberOfLines={1}>{appDetail.name}</Text>
            <Ionicons name={appInfoExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={16} color={colors.textTertiary} />
          </Pressable>
          {appInfoExpanded ? (
            <View style={styles.appInfoExpanded}>
              <View style={styles.appInfoMeta}>
                {appDetail.base_model ? <Text style={styles.appInfoModel}>基础模型: {appDetail.base_model}</Text> : null}
                <Text style={styles.appInfoId}>WebApp #{webAppId}</Text>
              </View>
              {appDetail.intro ? <Text style={styles.appInfoIntro}>{appDetail.intro}</Text> : null}
            </View>
          ) : null}
        </View>
      ) : hasParsed ? (
        <View style={styles.webappIdCard}>
          <Ionicons name="apps-outline" size={16} color={colors.primary} />
          <Text style={styles.webappIdText}>WebApp #{webAppId}</Text>
        </View>
      ) : null}
    </>
  ), [showApiKeyInput, styles, colors, apiKey, setApiKey, isSaving, handleSaveApiKey, editingAppId, apiCodeText, handleApiCodeChange, markDirty, isLoadingApp, handleParse, hasParsed, handleSaveApp, error, appDetail, appInfoExpanded, webAppId]);

  // ============ 编辑模式 ListFooter ============
  const renderListFooter = useCallback(() => (
    <Pressable style={({ pressed }) => [styles.generateButton, isSubmitting && styles.generateButtonDisabled, pressed && pressedOpacity()]} onPress={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? <ActivityIndicator color={colors.textInverse} /> : null}
      <Text style={styles.generateButtonText}>{isSubmitting ? '提交中...' : '提交任务'}</Text>
    </Pressable>
  ), [styles, colors, isSubmitting, handleSubmit]);

  // ============ 列表模式渲染 ============
  if (mode === 'list') {
    return (
      <View style={styles.container}>
        <AppHeader paddingTop={insets.top} />

        <View style={styles.listTitleBar}>
          <Text style={styles.listTitle}>AI 应用</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Pressable style={({ pressed }) => [styles.squareBtn, pressed && pressedOpacity()]} onPress={() => setSquareVisible(true)} accessibilityRole="button" accessibilityLabel="应用广场">
              <Ionicons name="grid-outline" size={18} color={colors.primary} />
              <Text style={styles.squareBtnText}>应用广场</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.addBtn, pressed && pressedOpacity()]} onPress={() => enterEditMode()} accessibilityRole="button" accessibilityLabel="新增应用">
              <Ionicons name="add" size={20} color={colors.textInverse} />
              <Text style={styles.addBtnText}>新增</Text>
            </Pressable>
          </View>
        </View>

        {savedApps.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="apps-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>暂无应用</Text>
            <Text style={styles.emptySubtext}>从 Bizyair 社区复制应用网址，或粘贴示例 API 代码来添加应用</Text>
            <Pressable style={({ pressed }) => [styles.emptyAddBtn, pressed && pressedOpacity()]} onPress={() => setSquareVisible(true)} accessibilityRole="button" accessibilityLabel="应用广场">
              <Ionicons name="grid-outline" size={18} color={colors.textInverse} />
              <Text style={styles.emptyAddBtnText}>浏览应用广场</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.emptySecondaryBtn, pressed && pressedOpacity()]} onPress={() => enterEditMode()} accessibilityRole="button" accessibilityLabel="新增应用">
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={styles.emptySecondaryBtnText}>新增应用</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={gridData}
            keyExtractor={(item) => item.id}
            renderItem={renderListItem}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* 删除确认对话框 */}
        <Modal visible={showDeleteConfirm} transparent animationType="fade" onRequestClose={() => setShowDeleteConfirm(false)}>
          <View style={styles.saveNameOverlay}>
            <View style={styles.saveNameDialog}>
              <Text style={styles.saveNameTitle}>删除应用</Text>
              <Text style={styles.confirmMessage}>确定要删除此应用吗？</Text>
              <View style={styles.saveNameActions}>
                <Pressable style={({ pressed }) => [styles.saveNameCancel, pressed && pressedOpacity()]} onPress={() => { setShowDeleteConfirm(false); setPendingDeleteId(null); }}>
                  <Text style={styles.saveNameCancelText}>取消</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.confirmDestructive, pressed && pressedOpacity()]} onPress={confirmDeleteApp}>
                  <Text style={styles.saveNameConfirmText}>删除</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <CommunityAppSquare
          visible={squareVisible}
          onClose={() => setSquareVisible(false)}
          onSelectApp={handleSelectFromSquare}
          onSavedAppsChange={reloadSavedApps}
        />
      </View>
    );
  }

  // ============ 编辑模式渲染 ============
  return (
    <View style={styles.container}>
      <AppHeader paddingTop={insets.top} />
      <View style={styles.secondaryHeader}>
        <Pressable style={({ pressed }) => [styles.backButton, pressed && pressedOpacity()]} onPress={handleBack} accessibilityRole="button" accessibilityLabel="返回">
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.secondaryHeaderTitle}>{editingAppId ? '编辑应用' : '新增应用'}</Text>
        {hasParsed ? (
          <Pressable style={({ pressed }) => [styles.headerSaveBtn, pressed && pressedOpacity()]} onPress={handleSaveApp} accessibilityRole="button" accessibilityLabel="保存应用">
            <Ionicons name="save-outline" size={20} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={paramEntries}
          keyExtractor={([key]) => key}
          renderItem={renderParamCard}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>

      {/* Combo 就地下拉 Modal */}
      <Modal visible={comboExpanded !== null} transparent animationType="fade" onRequestClose={() => setComboExpanded(null)}>
        <Pressable style={styles.comboOverlay} onPress={() => setComboExpanded(null)}>
          <View style={[styles.comboDropdown, { top: comboLayout.y, left: comboLayout.x, width: comboLayout.width }]}>
            <ScrollView nestedScrollEnabled style={styles.comboDropdownScroll}>
              {comboOptions.map(item => (
                <Pressable
                  key={String(item)}
                  style={({ pressed }) => [styles.comboItem, item === inputValues[comboExpanded] && styles.comboItemActive, pressed && pressedOpacity()]}
                  onPress={() => { handleParamChange(comboExpanded, item); setComboExpanded(null); }}
                >
                  <Text style={item === inputValues[comboExpanded] ? styles.comboItemTextActive : styles.comboItemText}>{item}</Text>
                  {item === inputValues[comboExpanded] ? <Ionicons name="checkmark" size={16} color={colors.primary} /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* 保存名称弹窗 */}
      <Modal visible={saveNameVisible} transparent animationType="fade" onRequestClose={() => setSaveNameVisible(false)}>
        <View style={styles.saveNameOverlay}>
          <View style={styles.saveNameDialog}>
            <Text style={styles.saveNameTitle}>保存应用</Text>
            <TextInput style={styles.saveNameInput} value={saveNameText} onChangeText={setSaveNameText} placeholder="输入应用名称" placeholderTextColor={colors.textPlaceholder} autoFocus />
            <View style={styles.saveNameActions}>
              <Pressable style={({ pressed }) => [styles.saveNameCancel, pressed && pressedOpacity()]} onPress={() => setSaveNameVisible(false)}>
                <Text style={styles.saveNameCancelText}>取消</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.saveNameConfirm, pressed && pressedOpacity()]} onPress={confirmSaveApp}>
                <Text style={styles.saveNameConfirmText}>确定</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* 返回确认对话框（替代 Alert.alert，兼容 Web） */}
      <Modal visible={showBackConfirm} transparent animationType="fade" onRequestClose={() => setShowBackConfirm(false)}>
        <View style={styles.saveNameOverlay}>
          <View style={styles.saveNameDialog}>
            <Text style={styles.saveNameTitle}>放弃修改</Text>
            <Text style={styles.confirmMessage}>当前修改尚未保存，确定要离开吗？</Text>
            <View style={styles.saveNameActions}>
              <Pressable style={({ pressed }) => [styles.saveNameCancel, pressed && pressedOpacity()]} onPress={() => setShowBackConfirm(false)}>
                <Text style={styles.saveNameCancelText}>继续编辑</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.confirmDestructive, pressed && pressedOpacity()]} onPress={confirmDiscardAndBack}>
                <Text style={styles.saveNameConfirmText}>放弃修改</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors) => {
  const shared = createSharedStyles(colors);
  return {
  container: { flex: 1, backgroundColor: colors.bg },

  // 二级头部（编辑模式）
  secondaryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  backButton: { padding: Spacing.xs },
  secondaryHeaderTitle: { fontSize: Typography.fontSize.body, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary },
  headerSaveBtn: { padding: Spacing.xs },

  // 列表模式
  listTitleBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  listTitle: { fontSize: Typography.fontSize.title3, fontWeight: Typography.fontWeight.bold, color: colors.textPrimary },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.lg, borderCurve: 'continuous' },
  addBtnText: { color: colors.textInverse, fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold },
  squareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.lg, borderCurve: 'continuous',
    borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.bg,
  },
  squareBtnText: {
    color: colors.primary, fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.semibold,
  },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  gridRow: { gap: Spacing.md, marginBottom: Spacing.md },
  gridCard: { flex: 1, backgroundColor: colors.card, borderRadius: Radius.md, borderCurve: 'continuous', overflow: 'hidden' },
  gridCoverWrapper: { position: 'relative', aspectRatio: 1, backgroundColor: colors.background },
  gridCover: { width: '100%', height: '100%' },
  gridCoverPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  gridDeleteBtn: { position: 'absolute', top: Spacing.xs, right: Spacing.xs, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  gridInfo: { padding: Spacing.sm },
  gridName: { fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: 4 },
  gridModelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryLight, paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: Radius.xs, alignSelf: 'flex-start', maxWidth: '100%' },
  gridModelText: { fontSize: Typography.fontSize.caption2, color: colors.primary, fontWeight: Typography.fontWeight.medium },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: Spacing.xxl },
  emptyText: { fontSize: Typography.fontSize.callout, color: colors.textTertiary, marginTop: Spacing.md },
  emptySubtext: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary, marginTop: Spacing.xs, textAlign: 'center', lineHeight: Typography.lineHeight.normal, paddingHorizontal: Spacing.xl },
  emptyAddBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2, borderRadius: Radius.sm, borderCurve: 'continuous', marginTop: Spacing.xl },
  emptyAddBtnText: { color: colors.textInverse, fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold },
  emptySecondaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.sm, borderCurve: 'continuous',
    borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.bg,
    marginTop: Spacing.sm,
  },
  emptySecondaryBtnText: {
    color: colors.primary, fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.semibold,
  },

  // 编辑模式
  scrollContent: { paddingTop: Spacing.sm, paddingRight: Spacing.md, paddingBottom: Spacing.xxl, paddingLeft: Spacing.md },
  card: shared.card,
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: shared.label,
  clearButtonText: { fontSize: Typography.fontSize.footnote, color: colors.primary, fontWeight: Typography.fontWeight.medium },
  codeInput: { fontSize: Typography.fontSize.caption1, color: colors.textPrimary, backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, fontFamily: 'monospace', minHeight: 60, textAlignVertical: 'top', marginBottom: Spacing.sm },
  parseButtonRow: { flexDirection: 'row', gap: Spacing.sm },
  parseButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, backgroundColor: colors.primary, paddingVertical: ButtonVariants.secondary.paddingVertical, borderRadius: ButtonVariants.secondary.borderRadius, borderCurve: 'continuous' },
  parseButtonDisabled: { backgroundColor: colors.primaryDisabled },
  parseButtonText: { color: colors.textInverse, fontSize: ButtonVariants.secondary.fontSize, fontWeight: ButtonVariants.secondary.fontWeight },
  saveAppButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: ButtonVariants.secondary.paddingVertical, paddingHorizontal: Spacing.lg, borderRadius: ButtonVariants.secondary.borderRadius, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.bg },
  saveAppButtonDisabled: { borderColor: colors.separator },
  saveAppButtonText: { fontSize: ButtonVariants.secondary.fontSize, color: colors.primary, fontWeight: ButtonVariants.secondary.fontWeight },
  errorText: { color: colors.error, textAlign: 'center', marginBottom: Spacing.md, fontSize: Typography.fontSize.footnote },

  // 应用信息卡片（可折叠）
  appInfoCard: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, borderCurve: 'continuous', marginBottom: Spacing.md },
  appInfoHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  appInfoName: { fontSize: Typography.fontSize.callout, fontWeight: Typography.fontWeight.bold, color: colors.textPrimary, flex: 1 },
  appInfoExpanded: { marginTop: Spacing.sm },
  appInfoMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xs },
  appInfoModel: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary },
  appInfoId: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, fontFamily: 'monospace' },
  appInfoIntro: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, lineHeight: Typography.lineHeight.tight, marginTop: Spacing.xs },
  webappIdCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: colors.card, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.md, borderCurve: 'continuous', marginBottom: Spacing.md },
  webappIdText: { fontSize: Typography.fontSize.subheadline, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary },

  // 参数卡片
  paramCard: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, borderCurve: 'continuous', marginBottom: Spacing.sm },
  paramHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 2 },
  paramLabel: { fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: 2 },
  paramKey: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary, fontFamily: 'monospace' },
  paramInput: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md },
  rangeHint: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary, marginTop: Spacing.xs },

  // 文件上传
  imageParamContainer: { gap: Spacing.sm },
  filePreviewWrapper: { position: 'relative' },
  imagePreview: { width: '100%', aspectRatio: 4 / 3, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg },
  fileInfoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: colors.bg, padding: Spacing.md, borderRadius: Radius.sm, borderCurve: 'continuous' },
  fileInfoText: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary, flex: 1, fontFamily: 'monospace' },
  fileDeleteBtn: { position: 'absolute', top: Spacing.xs, right: Spacing.xs, width: 28, height: 28, borderRadius: 14, borderCurve: 'continuous', backgroundColor: colors.overlayMedium, alignItems: 'center', justifyContent: 'center' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: ButtonVariants.secondary.paddingVertical, borderRadius: ButtonVariants.secondary.borderRadius, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.bg },
  uploadButtonText: { fontSize: ButtonVariants.secondary.fontSize, color: colors.primary, fontWeight: ButtonVariants.secondary.fontWeight },

  // Combo 就地下拉
  comboButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, borderWidth: 1, borderColor: colors.separator },
  comboValue: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, flex: 1 },
  comboOverlay: { flex: 1 },
  comboDropdown: { position: 'absolute', backgroundColor: colors.card, borderRadius: Radius.sm, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.separator, maxHeight: 220, ...Shadow.md },
  comboDropdownScroll: { maxHeight: 220 },
  comboItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  comboItemActive: { backgroundColor: colors.primaryBg },
  comboItemText: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary },
  comboItemTextActive: { fontSize: Typography.fontSize.footnote, color: colors.primary, fontWeight: Typography.fontWeight.semibold },

  // 保存名称弹窗
  saveNameOverlay: { flex: 1, backgroundColor: colors.overlayMedium, alignItems: 'center', justifyContent: 'center' },
  saveNameDialog: { backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous', padding: Spacing.xl, width: '80%', maxWidth: 360 },
  saveNameTitle: { fontSize: Typography.fontSize.body, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: Spacing.md },
  saveNameInput: { fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, borderWidth: 1, borderColor: colors.separator, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, backgroundColor: colors.bg, marginBottom: Spacing.lg },
  saveNameActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md },
  saveNameCancel: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  saveNameCancelText: { fontSize: Typography.fontSize.subheadline, color: colors.textSecondary },
  saveNameConfirm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, backgroundColor: colors.primary, borderRadius: Radius.sm, borderCurve: 'continuous' },
  saveNameConfirmText: { fontSize: Typography.fontSize.subheadline, color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  confirmMessage: { fontSize: Typography.fontSize.subheadline, color: colors.textSecondary, marginBottom: Spacing.md, lineHeight: Typography.lineHeight.normal },
  confirmDestructive: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, backgroundColor: colors.error, borderRadius: Radius.sm, borderCurve: 'continuous' },

  generateButton: { backgroundColor: colors.primary, paddingVertical: ButtonVariants.primary.paddingVertical, borderRadius: ButtonVariants.primary.borderRadius, borderCurve: 'continuous', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  generateButtonDisabled: { backgroundColor: colors.primaryDisabled },
  generateButtonText: { color: colors.textInverse, fontSize: ButtonVariants.primary.fontSize, fontWeight: ButtonVariants.primary.fontWeight, letterSpacing: Typography.letterSpacing.tight },
  apiKeyInput: { fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, fontFamily: 'monospace', backgroundColor: colors.bg },
  saveKeyButton: { backgroundColor: colors.primary, paddingVertical: ButtonVariants.secondary.paddingVertical, borderRadius: ButtonVariants.secondary.borderRadius, borderCurve: 'continuous', alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: colors.textInverse, fontSize: ButtonVariants.secondary.fontSize, fontWeight: ButtonVariants.secondary.fontWeight },
  };
};
