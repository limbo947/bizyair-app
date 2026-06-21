import React, { useState, useCallback, useMemo } from 'react';
import { Pressable, Text, View, ScrollView, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography, pressedOpacity } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { useToastContext } from '../context/ToastContext';
import { PickerModal } from './common/PickerModal';

// 获取请求参数：优先使用提交时存储的真实 API 请求体（requestPayload）
// 对于旧的历史记录（无 requestPayload），回退到从历史项字段中提取
function getRequestParams(item) {
  if (!item) return null;
  // 优先使用真实请求体
  if (item.requestPayload && typeof item.requestPayload === 'object') {
    return item.requestPayload;
  }
  // 回退：从历史项字段中提取（旧记录兼容）
  const INTERNAL_FIELDS = new Set([
    'id', 'status', 'startedAt', 'completedAt', 'errorMessage', 'lastResponse',
    'outputType', 'imageUrl', 'videoUrl', 'audioUrl', 'textResult', 'resultUrl',
    'localImageUrl', 'localVideoUrl', 'localAudioUrl', 'localImageUrls',
    'imageUrls_output', 'videoUrls_output',
    'coinsSpent', 'date', 'taskApiKey', 'requestId', 'modelIcon',
  ]);
  const params = {};
  for (const key of Object.keys(item)) {
    if (INTERNAL_FIELDS.has(key)) continue;
    const val = item[key];
    if (val === undefined || val === null || val === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    params[key] = val;
  }
  return Object.keys(params).length > 0 ? params : null;
}

// 从响应中提取关键字段用于高亮展示
function extractResponseHighlights(lastResponse) {
  if (!lastResponse || typeof lastResponse !== 'object') return [];
  const r = lastResponse;
  const keys = ['status', 'error', 'error_message', 'message', 'code', 'outputs', 'output', 'data', 'result'];
  const entries = [];
  for (const key of keys) {
    if (r[key] !== undefined && r[key] !== null && r[key] !== '') {
      let val = r[key];
      if (Array.isArray(val)) val = `[${val.length} 项]`;
      else if (typeof val === 'object') val = JSON.stringify(val).slice(0, 200);
      entries.push([key, val]);
    }
  }
  return entries;
}

// 格式化关键字段颜色
function formatKeyValue(key, value, colors) {
  const isStatus = key === 'status';
  const isError = key === 'error' || key === 'error_message' || key === 'errorMessage';
  const isUrl = typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'));
  const isOutput = key === 'outputs' || key === 'output';

  let color = colors.textSecondary;
  if (isStatus) color = value === 'Success' ? colors.success : value === 'Failed' ? colors.error : colors.primary;
  else if (isError) color = colors.error;
  else if (isUrl) color = colors.primary;
  else if (isOutput) color = colors.purple;

  return color;
}

const createStyles = (colors) => ({
  modalOverlay: { flex: 1, backgroundColor: colors.overlayMedium, justifyContent: 'center', alignItems: 'center' },
  logModalContent: { width: '90%', maxHeight: '85%', backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous', overflow: 'hidden' },
  logModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  logModalTitle: { fontSize: Typography.fontSize.headline, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary },
  logModalActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logModalCopyBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.xs, borderCurve: 'continuous', backgroundColor: colors.primaryBg },
  logModalClose: { fontSize: Typography.fontSize.title3, color: colors.textTertiary, fontWeight: Typography.fontWeight.semibold, paddingHorizontal: 8 },
  logModalScroll: { padding: Spacing.lg, maxHeight: 550 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm, marginBottom: Spacing.xs, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  sectionTitle: { fontSize: Typography.fontSize.subheadline, fontWeight: Typography.fontWeight.bold, color: colors.textPrimary },
  sectionToggle: { fontSize: Typography.fontSize.caption1, color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  sectionBody: { marginBottom: Spacing.md },
  kvRow: { flexDirection: 'row', paddingVertical: 3, gap: Spacing.sm },
  kvKey: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, fontWeight: Typography.fontWeight.medium, minWidth: 90 },
  kvValue: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary, flex: 1, fontFamily: 'monospace' },
  rawJsonText: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, fontFamily: 'monospace', lineHeight: 16 },
  emptySection: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, fontStyle: 'italic', paddingVertical: Spacing.sm },
  rawJsonSection: { marginTop: Spacing.sm },
  confirmOverlay: { flex: 1, backgroundColor: colors.overlayLight, justifyContent: 'center', alignItems: 'center' },
  confirmBox: { width: '82%', backgroundColor: colors.card, borderRadius: Radius.xl, borderCurve: 'continuous', padding: Spacing.xxl },
  confirmTitle: { fontSize: 18, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' },
  confirmMessage: { fontSize: Typography.fontSize.subheadline, color: colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl, textAlign: 'center' },
  confirmActions: { flexDirection: 'row', gap: Spacing.md },
  confirmCancelButton: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  confirmCancelText: { fontSize: Typography.fontSize.headline, color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  confirmDeleteButton: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, borderCurve: 'continuous', backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center' },
  confirmDeleteText: { fontSize: Typography.fontSize.headline, color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
});

export function HistoryModals({
  logModal,
  setLogModal,
  deleteConfirmId,
  setDeleteConfirmId,
  deleteConfirmBatch,
  setDeleteConfirmBatch,
  showSortPicker,
  setShowSortPicker,
  handleDelete,
  handleBatchDelete,
  selectedIds,
  handleSortChange,
  sortBy,
  SORT_OPTIONS,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { showToast } = useToastContext();
  const [copied, setCopied] = useState(false);
  const [reqExpanded, setReqExpanded] = useState(true);
  const [respExpanded, setRespExpanded] = useState(true);
  const [rawJsonExpanded, setRawJsonExpanded] = useState(false);

  // 提取请求参数（保留完整值用于 JSON 展示）
  const requestParams = useMemo(() => getRequestParams(logModal), [logModal]);
  const requestJsonString = useMemo(() => {
    if (!requestParams || Object.keys(requestParams).length === 0) return null;
    return JSON.stringify(requestParams, null, 2);
  }, [requestParams]);

  // 提取响应关键字段（用于高亮键值对展示）
  const responseEntries = useMemo(() => extractResponseHighlights(logModal?.lastResponse), [logModal]);

  const handleCopyLog = useCallback(async () => {
    const parts = [];
    if (requestParams && Object.keys(requestParams).length > 0) {
      parts.push('=== 请求参数 ===');
      parts.push(JSON.stringify(requestParams, null, 2));
    }
    if (logModal?.lastResponse) {
      parts.push('=== 响应信息 ===');
      parts.push(JSON.stringify(logModal.lastResponse, null, 2));
    }
    const text = parts.join('\n\n');
    if (!text) return;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    showToast('日志已复制到剪贴板', 'success');
    setTimeout(() => setCopied(false), 1500);
  }, [logModal, requestParams, showToast]);

  return (
    <>
      <Modal visible={!!logModal} transparent animationType="fade" onRequestClose={() => setLogModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logModalContent}>
            <View style={styles.logModalHeader}>
              <Text style={styles.logModalTitle}>响应日志</Text>
              <View style={styles.logModalActions}>
                <Pressable style={({ pressed }) => [styles.logModalCopyBtn, pressed && pressedOpacity()]} onPress={handleCopyLog}>
                  <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={copied ? colors.success : colors.primary} />
                </Pressable>
                <Pressable style={({ pressed }) => pressed && pressedOpacity()} onPress={() => setLogModal(null)}><Text style={styles.logModalClose}>✕</Text></Pressable>
              </View>
            </View>
            <ScrollView style={styles.logModalScroll}>
              {/* 请求参数区块 — 原始 JSON 格式 */}
              {requestJsonString ? (
                <View style={styles.sectionBody}>
                  <Pressable style={styles.sectionHeader} onPress={() => setReqExpanded((v) => !v)}>
                    <Text style={styles.sectionTitle}>请求参数</Text>
                    <Text style={styles.sectionToggle}>{reqExpanded ? '收起' : '展开'}</Text>
                  </Pressable>
                  {reqExpanded ? (
                    <Text style={styles.rawJsonText}>{requestJsonString}</Text>
                  ) : (
                    <Text style={styles.emptySection}>点击展开查看请求参数 JSON</Text>
                  )}
                </View>
              ) : null}

              {/* 响应关键信息区块 — 键值对高亮展示 */}
              {responseEntries.length > 0 ? (
                <View style={styles.sectionBody}>
                  <Pressable style={styles.sectionHeader} onPress={() => setRespExpanded((v) => !v)}>
                    <Text style={styles.sectionTitle}>响应信息 ({responseEntries.length})</Text>
                    <Text style={styles.sectionToggle}>{respExpanded ? '收起' : '展开'}</Text>
                  </Pressable>
                  {respExpanded ? (
                    responseEntries.map(([key, value]) => (
                      <View key={key} style={styles.kvRow}>
                        <Text style={styles.kvKey}>{key}</Text>
                        <Text style={[styles.kvValue, { color: formatKeyValue(key, value, colors) }]}>{String(value)}</Text>
                      </View>
                    ))
                  ) : null}
                </View>
              ) : null}

              {/* 原始响应 JSON 区块（默认折叠） */}
              <View style={styles.rawJsonSection}>
                <Pressable style={styles.sectionHeader} onPress={() => setRawJsonExpanded((v) => !v)}>
                  <Text style={styles.sectionTitle}>原始响应 JSON</Text>
                  <Text style={styles.sectionToggle}>{rawJsonExpanded ? '收起' : '展开'}</Text>
                </Pressable>
                {rawJsonExpanded ? (
                  <Text style={styles.rawJsonText}>
                    {logModal?.lastResponse ? JSON.stringify(logModal.lastResponse, null, 2) : '暂无响应信息'}
                  </Text>
                ) : (
                  <Text style={styles.emptySection}>点击展开查看完整 JSON</Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteConfirmId !== null} transparent animationType="fade" onRequestClose={() => setDeleteConfirmId(null)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>确认删除</Text>
            <Text style={styles.confirmMessage}>确定要删除这条记录吗？此操作不可恢复。</Text>
            <View style={styles.confirmActions}>
              <Pressable style={({ pressed }) => [styles.confirmCancelButton, pressed && pressedOpacity()]} onPress={() => setDeleteConfirmId(null)}><Text style={styles.confirmCancelText}>取消</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.confirmDeleteButton, pressed && pressedOpacity()]} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); handleDelete(deleteConfirmId); }}><Text style={styles.confirmDeleteText}>删除</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteConfirmBatch} transparent animationType="fade" onRequestClose={() => setDeleteConfirmBatch(false)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>确认批量删除</Text>
            <Text style={styles.confirmMessage}>确定要删除选中的 {selectedIds.size} 条记录吗？此操作不可恢复。</Text>
            <View style={styles.confirmActions}>
              <Pressable style={({ pressed }) => [styles.confirmCancelButton, pressed && pressedOpacity()]} onPress={() => setDeleteConfirmBatch(false)}><Text style={styles.confirmCancelText}>取消</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.confirmDeleteButton, pressed && pressedOpacity()]} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); handleBatchDelete(); }}><Text style={styles.confirmDeleteText}>删除</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <PickerModal
        visible={showSortPicker}
        onClose={() => setShowSortPicker(false)}
        title="排序方式"
        options={SORT_OPTIONS}
        selectedKey={sortBy}
        onSelect={handleSortChange}
      />
    </>
  );
}
