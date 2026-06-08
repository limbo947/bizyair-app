import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pressable, Text,
  View,
  TextInput,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useApiKeyContext } from '../context/ApiKeyContext';
import { useHistoryContext } from '../context/HistoryContext';
import { useTheme } from '../context/ThemeContext';
import { useToastContext } from '../context/ToastContext';
import { submitWebappTask, uploadImageFile, uploadVideoFile, fetchWebappDetail } from '../services/apiClient';
import { generateId } from '../utils/helpers';
import { ENV_API_KEY } from '../constants/models';
import { Radius, Spacing, Typography, ButtonVariants, pressedOpacity } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { ResizableTextInput } from '../components/ResizableTextInput';
import { AppHeader } from '../components/AppHeader';
import { ApiKeyDropdown } from '../components/ApiKeyDropdown';

const WEBAPP_SAVED_LIST_KEY = '@webapp_saved_list';

const WebappListItem = React.memo(function WebappListItem({ item, onEdit, onDelete, colors, styles }) {
  return (
    <View style={styles.listItem}>
      <Pressable style={({ pressed }) => [styles.listItemContent, pressed && pressedOpacity()]} onPress={() => onEdit(item)} >
        <View style={styles.listItemHeader}>
          <Text style={styles.listItemName} numberOfLines={1}>{item.name}</Text>
        </View>
        <View style={styles.listItemMeta}>
          {item.appDetail?.base_model ? <Text style={styles.listItemModel}>基础模型: {item.appDetail.base_model}</Text> : null}
          <Text style={styles.listItemId}>WebApp #{item.webAppId}</Text>
        </View>
        {item.appDetail?.intro ? <Text style={styles.listItemIntro} numberOfLines={1}>{item.appDetail.intro}</Text> : null}
      </Pressable>
      <View style={styles.listItemActions}>
        <Pressable style={({ pressed }) => [styles.listItemDeleteBtn, pressed && pressedOpacity()]} onPress={() => onDelete(item.id)} >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
});

/** 判断字符串值是否为 bizyair 上传文件 URL */
function isBizyairFileUrl(val) {
  return typeof val === 'string' && (
    val.includes('bizyair-prod.oss-cn-shanghai.aliyuncs.com/inputs/') ||
    val.includes('storage.bizyair.cn/inputs/')
  );
}

/** 根据 node_type 判断媒体类型：image / video / audio / file / null */
function getMediaType(nodeType, value) {
  if (nodeType === 'LoadImage') return 'image';
  if (nodeType === 'LoadVideo') return 'video';
  if (nodeType === 'LoadAudio') return 'audio';
  if (isBizyairFileUrl(value)) {
    const ext = value.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext)) return 'audio';
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'image';
    return 'file';
  }
  return null;
}

function stripJsComments(str) {
  let result = '';
  let i = 0;
  while (i < str.length) {
    if (str[i] === '"' || str[i] === "'") {
      const quote = str[i];
      result += str[i]; i++;
      while (i < str.length && str[i] !== quote) {
        if (str[i] === '\\') { result += str[i]; i++; if (i < str.length) { result += str[i]; i++; } }
        else { result += str[i]; i++; }
      }
      if (i < str.length) { result += str[i]; i++; }
    } else if (str[i] === '/' && i + 1 < str.length && str[i + 1] === '/') {
      while (i < str.length && str[i] !== '\n') i++;
    } else if (str[i] === '/' && i + 1 < str.length && str[i + 1] === '*') {
      i += 2;
      while (i < str.length && !(str[i] === '*' && i + 1 < str.length && str[i + 1] === '/')) i++;
      i += 2;
    } else { result += str[i]; i++; }
  }
  return result;
}

function extractStringifyArg(text) {
  const prefix = text.match(/JSON\.stringify\s*\(\s*/);
  if (!prefix) return null;
  const startIdx = text.indexOf(prefix[0]) + prefix[0].length;
  if (startIdx >= text.length || text[startIdx] !== '{') return null;
  let depth = 0, inString = false, stringChar = '', i = startIdx;
  while (i < text.length) {
    const ch = text[i];
    if (inString) { if (ch === '\\') { i += 2; continue; } if (ch === stringChar) inString = false; }
    else { if (ch === '"' || ch === "'") { inString = true; stringChar = ch; } else if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return text.slice(startIdx, i + 1); } }
    i++;
  }
  return null;
}

function parseApiCode(text) {
  const jsonStr = extractStringifyArg(text);
  if (!jsonStr) return { error: '未找到 JSON.stringify 内容，请粘贴完整的示例 API 代码' };
  const cleaned = stripJsComments(jsonStr).replace(/,\s*([}\]])/g, '$1');
  let parsed;
  try { parsed = JSON.parse(cleaned); } catch (e) { return { error: 'JSON 解析失败: ' + e.message }; }
  const webAppId = parsed.web_app_id;
  if (webAppId === undefined || webAppId === null) return { error: '未找到 web_app_id 参数' };
  const inputValues = parsed.input_values;
  if (!inputValues || typeof inputValues !== 'object' || Array.isArray(inputValues)) return { error: '未找到 input_values 参数' };
  return { webAppId: Number(webAppId), inputValues };
}

function parseFieldOptions(optStr) {
  if (!optStr || typeof optStr !== 'string') return {};
  try { return JSON.parse(optStr); } catch { return {}; }
}

/** 从 AsyncStorage 加载已保存应用列表 */
async function loadSavedApps() {
  try {
    const raw = await AsyncStorage.getItem(WEBAPP_SAVED_LIST_KEY);
    if (raw) { const list = JSON.parse(raw); return Array.isArray(list) ? list : []; }
  } catch (e) { console.error('加载应用列表失败:', e); }
  return [];
}

/** 保存应用列表到 AsyncStorage */
async function persistSavedApps(list) {
  try { await AsyncStorage.setItem(WEBAPP_SAVED_LIST_KEY, JSON.stringify(list)); } catch (e) { console.error('保存应用列表失败:', e); }
}

export function WebappScreen() {
  const insets = useSafeAreaInsets();
  const {
    apiKey, setApiKey, saveApiKey, apiKeys, activeApiKeyId,
    addApiKey, removeApiKey, switchApiKey, renameApiKey,
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
  const [parseError, setParseError] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false);

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error, showToast]);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [appDetail, setAppDetail] = useState(null);
  const [isLoadingApp, setIsLoadingApp] = useState(false);
  const [inputNodes, setInputNodes] = useState([]);
  const [appInfoExpanded, setAppInfoExpanded] = useState(false);

  // Combo 就地下拉状态
  const [comboExpanded, setComboExpanded] = useState(null);
  const [comboLayout, setComboLayout] = useState({ x: 0, y: 0, width: 0 });
  const [comboOptions, setComboOptions] = useState([]);
  const comboRefs = useRef({});

  // 保存名称弹窗
  const [saveNameVisible, setSaveNameVisible] = useState(false);
  const [saveNameText, setSaveNameText] = useState('');

  // 加载已保存列表
  useEffect(() => {
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
    setParseError('');
    try {
      const data = await fetchWebappDetail(id);
      applyAppDetail(data);
      return true;
    } catch (err) {
      setParseError(err.message || '获取应用信息失败');
      return false;
    } finally {
      setIsLoadingApp(false);
    }
  }, [applyAppDetail]);

  const handleParse = useCallback(async () => {
    setParseError('');
    if (!apiCodeText.trim()) { setParseError('请输入应用 URL 或 API 代码'); return; }
    const fetched = await handleFetchApp(apiCodeText);
    if (fetched) return;
    const result = parseApiCode(apiCodeText);
    if (result.error) {
      setParseError(result.error);
      setWebAppId(null); setInputValues({}); setOriginalTypes({});
      setAppDetail(null); setInputNodes([]);
      return;
    }
    setAppDetail(null); setInputNodes([]);
    setWebAppId(result.webAppId);
    setInputValues(result.inputValues);
    setOriginalTypes(Object.fromEntries(Object.entries(result.inputValues).map(([k, v]) => [k, typeof v])));
  }, [apiCodeText, handleFetchApp]);

  const handleParamChange = useCallback((key, text) => {
    setInputValues((prev) => {
      const updated = { ...prev };
      if (originalTypes[key] === 'number') {
        updated[key] = text === '' || text === '-' ? text : Number(text);
        if (isNaN(updated[key])) updated[key] = text;
      } else { updated[key] = text; }
      return updated;
    });
  }, [originalTypes]);

  const handleFileUpload = useCallback(async (key, mediaType) => {
    const ek = apiKey.trim() || ENV_API_KEY;
    if (!ek) { setShowApiKeyInput(true); setError('请先配置API密钥'); return; }
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
    } catch (err) { setError(err.message || '上传失败'); }
    finally { setUploadingKey(null); }
  }, [apiKey]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim() || isSaving) return;
    setIsSaving(true); setError('');
    try { await saveApiKey(apiKey); setShowApiKeyInput(false); }
    catch (e) { setError('保存失败: ' + (e.message || '未知错误')); }
    finally { setIsSaving(false); }
  };

  // 保存应用到列表
  const handleSaveApp = useCallback(() => {
    if (!webAppId) { setError('请先获取参数'); return; }
    const defaultName = appDetail?.name || `WebApp #${webAppId}`;
    setSaveNameText(defaultName);
    setSaveNameVisible(true);
  }, [webAppId, appDetail]);

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
    setMode('list');
  }, [saveNameText, webAppId, editingAppId, apiCodeText, appDetail, inputNodes, inputValues, originalTypes, savedApps]);

  // 进入编辑模式
  const enterEditMode = useCallback((app = null) => {
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
    setParseError(''); setError(''); setAppInfoExpanded(false);
    setComboExpanded(null);
    setMode('edit');
  }, []);

  // 删除应用
  const deleteApp = useCallback((id) => {
    Alert.alert('删除应用', '确定要删除此应用吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => {
        const updated = savedApps.filter(a => a.id !== id);
        setSavedApps(updated);
        persistSavedApps(updated);
      }},
    ]);
  }, [savedApps]);

  // 编辑模式提交任务
  const handleSubmit = async () => {
    if (!webAppId) { setError('请先获取应用信息或解析 API 代码'); return; }
    if (Object.keys(inputValues).length === 0) { setError('未检测到输入参数'); return; }
    const ek = apiKey.trim() || ENV_API_KEY;
    if (!ek) { setShowApiKeyInput(true); setError('请先输入API密钥'); return; }
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
      id, source: 'webapp', webAppId: Number(webAppId), outputType: 'image',
      prompt: appName, resolution: '', aspectRatio: '', price: 0,
      mode: 'webapp', modelId: 'webapp', modelName: appName,
      status: 'Pending', errorMessage: '', lastResponse: null,
      startedAt: now, completedAt: null,
      date: new Date(now).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    };
    await addToHistory(entry);
    await refreshUserInfo().catch(() => {});
    try {
      const requestId = await submitWebappTask(ek, webAppId, cleanInputValues);
      updateHistoryItem(id, { status: 'Pending', requestId, taskApiKey: ek, lastResponse: { status: 'Pending', request_id: requestId } });
      startWebappPolling(id, requestId, ek);
    } catch (err) {
      updateHistoryItem(id, { status: 'Failed', errorMessage: err.message, lastResponse: { status: 'Failed', error: err.message } });
    } finally { setIsSubmitting(false); }
    Keyboard.dismiss();
  };

  const hasParsed = webAppId !== null;
  const getNodeInfo = useCallback((key) => {
    if (!inputNodes.length) return null;
    return inputNodes.find((n) => n.variable_name === key) || null;
  }, [inputNodes]);

  // ============ 列表模式渲染 ============
  const renderListItem = useCallback(({ item }) => (
    <WebappListItem item={item} onEdit={enterEditMode} onDelete={deleteApp} colors={colors} styles={styles} />
  ), [colors, enterEditMode, deleteApp, styles]);

  if (mode === 'list') {
    return (
      <View style={styles.container}>
        <AppHeader paddingTop={insets.top} />

        <View style={styles.listTitleBar}>
          <Text style={styles.listTitle}>AI 应用</Text>
          <Pressable style={({ pressed }) => [styles.addBtn, pressed && pressedOpacity()]} onPress={() => enterEditMode()} >
            <Ionicons name="add" size={20} color={colors.textInverse} />
            <Text style={styles.addBtnText}>新增</Text>
          </Pressable>
        </View>

        {savedApps.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="apps-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>暂无应用</Text>
            <Text style={styles.emptySubtext}>点击右上角&ldquo;新增&rdquo;添加应用</Text>
          </View>
        ) : (
          <FlatList
            data={savedApps}
            keyExtractor={(item) => item.id}
            renderItem={renderListItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && pressedOpacity()]} onPress={() => setMode('list')} >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>{editingAppId ? '编辑应用' : '新增应用'}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
              <Pressable style={({ pressed }) => pressed && pressedOpacity()} onPress={() => setApiCodeText('')}>
                <Text style={styles.clearButtonText}>清空</Text>
              </Pressable>
            ) : null}
          </View>
          <TextInput
            style={styles.codeInput}
            value={apiCodeText}
            onChangeText={setApiCodeText}
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

        {parseError ? <Text style={styles.parseErrorText}>{parseError}</Text> : null}

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

        {/* 参数卡片列表 */}
        {hasParsed && Object.entries(inputValues).map(([key, value]) => {
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
                {(fieldType === 'customtext' || fieldType === 'string' || ((fieldType === 'number' || fieldType === 'slider') && String(inputValues[key]).length > 0)) ? (
                  <Pressable style={({ pressed }) => pressed && pressedOpacity()} onPress={() => handleParamChange(key, fieldType === 'number' || fieldType === 'slider' ? '' : '')}>
                    <Text style={styles.clearButtonText}>清空</Text>
                  </Pressable>
                ) : null}
              </View>

              {isFileUpload ? (
                <View style={styles.imageParamContainer}>
                  {value && mediaType === 'image' ? (
                    <Image source={{ uri: value }} style={styles.imagePreview} contentFit="contain" />
                  ) : value ? (
                    <View style={styles.fileInfoRow}>
                      <Ionicons name={fileInfoIcon} size={20} color={colors.primary} />
                      <Text style={styles.fileInfoText} numberOfLines={1}>{value.split('/').pop().split('?')[0]}</Text>
                    </View>
                  ) : null}
                  <Pressable style={({ pressed }) => [styles.uploadButton, pressed && pressedOpacity()]} onPress={() => handleFileUpload(key, mediaType)} disabled={uploadingKey === key} >
                    {uploadingKey === key ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name={uploadIcon} size={18} color={colors.primary} />}
                    <Text style={styles.uploadButtonText}>{uploadLabel}</Text>
                  </Pressable>
                </View>
              ) : fieldType === 'combo' ? (
                <Pressable
                  ref={ref => { if (ref) comboRefs.current[key] = ref; }}
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
                    keyboardType="number-pad"
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
              ) : fieldType === 'customtext' ? (
                <ResizableTextInput
                  value={String(inputValues[key])}
                  onChangeText={(text) => handleParamChange(key, text)}
                  placeholder={key}
                  placeholderTextColor={colors.textPlaceholder}
                />
              ) : fieldType === 'toggle' ? (
                <Pressable style={({ pressed }) => [styles.toggleContainer, pressed && pressedOpacity()]} onPress={() => handleParamChange(key, !inputValues[key])} >
                  <View style={[styles.toggleTrack, inputValues[key] && styles.toggleTrackActive]}>
                    <View style={[styles.toggleThumb, inputValues[key] && { marginLeft: 20 }]} />
                  </View>
                  <Text style={styles.toggleLabel}>{inputValues[key] ? '开启' : '关闭'}</Text>
                </Pressable>
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
        })}

        <Pressable style={({ pressed }) => [styles.generateButton, isSubmitting && styles.generateButtonDisabled, pressed && pressedOpacity()]} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color={colors.textInverse} /> : null}
          <Text style={styles.generateButtonText}>{isSubmitting ? '提交中...' : '提交任务'}</Text>
        </Pressable>
      </ScrollView>

      {/* Combo 就地下拉 Modal */}
      <Modal visible={comboExpanded !== null} transparent animationType="none" onRequestClose={() => setComboExpanded(null)}>
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

      <ApiKeyDropdown visible={showApiKeyDropdown} onClose={() => setShowApiKeyDropdown(false)} apiKeys={apiKeys} activeApiKeyId={activeApiKeyId} onSwitchKey={switchApiKey} onDeleteKey={removeApiKey} onAddKey={addApiKey} onRenameKey={renameApiKey} />
    </View>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.card, paddingLeft: Spacing.md, paddingRight: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: Spacing.xs },
  headerTitle: { fontSize: Typography.fontSize.body, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary },

  // 列表模式
  listTitleBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  listTitle: { fontSize: Typography.fontSize.title3, fontWeight: Typography.fontWeight.bold, color: colors.textPrimary },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.lg, borderCurve: 'continuous' },
  addBtnText: { color: colors.textInverse, fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, borderCurve: 'continuous', marginBottom: Spacing.sm },
  listItemContent: { flex: 1 },
  listItemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  listItemName: { fontSize: Typography.fontSize.callout, fontWeight: Typography.fontWeight.bold, color: colors.textPrimary, flex: 1 },
  listItemMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: 2 },
  listItemModel: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary },
  listItemId: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, fontFamily: 'monospace' },
  listItemIntro: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, lineHeight: Typography.lineHeight.tight },
  listItemActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginLeft: Spacing.sm },
  listItemDeleteBtn: { width: 32, height: 32, borderRadius: 16, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: Typography.fontSize.callout, color: colors.textTertiary, marginTop: Spacing.md },
  emptySubtext: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary, marginTop: Spacing.xs },

  // 编辑模式
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.sm, paddingRight: Spacing.md, paddingBottom: Spacing.xxl, paddingLeft: Spacing.md },
  card: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, borderCurve: 'continuous', marginBottom: Spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: { fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: Typography.letterSpacing.wide },
  clearButtonText: { fontSize: Typography.fontSize.footnote, color: colors.primary, fontWeight: Typography.fontWeight.medium },
  codeInput: { fontSize: Typography.fontSize.caption1, color: colors.textPrimary, backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, fontFamily: 'monospace', minHeight: 60, textAlignVertical: 'top', marginBottom: Spacing.sm },
  parseButtonRow: { flexDirection: 'row', gap: Spacing.sm },
  parseButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, backgroundColor: colors.primary, paddingVertical: Spacing.sm + 2, borderRadius: Radius.sm, borderCurve: 'continuous' },
  parseButtonDisabled: { backgroundColor: colors.primaryDisabled },
  parseButtonText: { color: colors.textInverse, fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold },
  saveAppButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.lg, borderRadius: Radius.sm, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.bg },
  saveAppButtonDisabled: { borderColor: colors.separator },
  saveAppButtonText: { fontSize: Typography.fontSize.footnote, color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  parseErrorText: { color: colors.error, textAlign: 'center', marginBottom: Spacing.md, fontSize: Typography.fontSize.footnote },

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
  paramInputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  rangeHint: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary, marginTop: Spacing.xs },

  // 文件上传
  imageParamContainer: { gap: Spacing.sm },
  imagePreview: { width: '100%', height: 160, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg },
  fileInfoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: colors.bg, padding: Spacing.md, borderRadius: Radius.sm, borderCurve: 'continuous' },
  fileInfoText: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary, flex: 1, fontFamily: 'monospace' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm + 2, borderRadius: Radius.sm, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.bg },
  uploadButtonText: { fontSize: Typography.fontSize.footnote, color: colors.primary, fontWeight: Typography.fontWeight.medium },

  // Toggle
  toggleContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  toggleTrack: { width: 44, height: 24, borderRadius: 12, borderCurve: 'continuous', backgroundColor: colors.separator, padding: 2 },
  toggleTrackActive: { backgroundColor: colors.primary },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, borderCurve: 'continuous', backgroundColor: colors.textInverse },
  toggleThumbActive: {},
  toggleLabel: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary },

  // Combo 就地下拉
  comboButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, borderWidth: 1, borderColor: colors.separator },
  comboValue: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, flex: 1 },
  comboOverlay: { flex: 1 },
  comboDropdown: { position: 'absolute', backgroundColor: colors.card, borderRadius: Radius.sm, borderCurve: 'continuous', borderWidth: 1, borderColor: colors.separator, maxHeight: 220, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)' },
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

  generateButton: { backgroundColor: colors.primary, paddingVertical: ButtonVariants.primary.paddingVertical, borderRadius: ButtonVariants.primary.borderRadius, borderCurve: 'continuous', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  generateButtonDisabled: { backgroundColor: colors.primaryDisabled },
  generateButtonText: { color: colors.textInverse, fontSize: ButtonVariants.primary.fontSize, fontWeight: ButtonVariants.primary.fontWeight, letterSpacing: Typography.letterSpacing.tight },
  apiKeyInput: { fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, fontFamily: 'monospace', backgroundColor: colors.bg },
  saveKeyButton: { backgroundColor: colors.primary, paddingVertical: Spacing.sm + 2, borderRadius: Radius.sm, borderCurve: 'continuous', alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: colors.textInverse, fontSize: Typography.fontSize.subheadline, fontWeight: Typography.fontWeight.semibold },
});
