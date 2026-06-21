import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { isTokenPricedModel } from '../../utils/modelHelpers';
import { resolveUrl } from '../../utils/resultCache';
import { STATUS_LABELS } from '../../constants/models';
import { pressedOpacity, Radius, Spacing, Typography } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { useToastContext } from '../../context/ToastContext';
import { DurationDisplay } from './DurationDisplay';

const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];
const FINAL_STATUSES = ['Success', 'Failed', 'Canceled'];

export const HistoryCard = React.memo(function HistoryCard({
  item,
  isSelected,
  batchMode,
  toggleSelect,
  handleDownload,
  setLogModal,
  setDeleteConfirmId,
  setVideoPreview,
  setTextPreview,
  setAudioPreview,
  setPreviewImage,
  setPreviewImageUrls,
  stopPolling,
  resubmitTask,
  thumbUri,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors, theme } = useTheme();
  const { showToast } = useToastContext();
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);
  const [errorExpanded, setErrorExpanded] = useState(false); // 问题16：错误信息展开/收起
  const copiedTimer = useRef(null);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(item.prompt || '');
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  }, [item.prompt]);

  const handleResubmit = useCallback(async () => {
    if (resubmitting) return;
    setResubmitting(true);
    try {
      const ok = await resubmitTask(item);
      if (ok) {
        // 问题17修复：不自动跳转，让用户选择是否前往主页
        showToast('参数已恢复', 'success');
        Alert.alert('参数已恢复', '是否前往主页继续编辑？', [
          { text: '留在此处', style: 'cancel' },
          { text: '前往主页', onPress: () => router.navigate('/') },
        ]);
      } else {
        showToast('恢复参数失败，请重试', 'error');
      }
    } catch {
      showToast('恢复参数失败，请重试', 'error');
    } finally {
      setResubmitting(false);
    }
  }, [resubmitting, resubmitTask, item, showToast, router]);

  const handleStop = useCallback(async () => {
    if (stopping) return;
    setStopping(true);
    try {
      await stopPolling(item.id);
    } finally {
      setStopping(false);
    }
  }, [stopping, stopPolling, item.id]);

  useEffect(() => {
    return () => { if (copiedTimer.current) clearTimeout(copiedTimer.current); };
  }, []);

  const isFinal = FINAL_STATUSES.includes(item.status);
  const statusLabel = STATUS_LABELS[item.status] || item.status;
  const statusColor = theme.STATUS_COLORS[item.status] || colors.textTertiary;
  const statusBg = theme.STATUS_BG[item.status] || colors.bg;
  const isActive = ACTIVE_STATUSES.includes(item.status);
  const isWebapp = item.source === 'webapp';

  // 优先使用本地缓存路径，fallback 远程 URL
  const imageUrl = resolveUrl(item.localImageUrl, item.imageUrl);
  const videoUrl = resolveUrl(item.localVideoUrl, item.videoUrl);
  const audioUrl = resolveUrl(item.localAudioUrl, item.audioUrl);
  const imageUrls = (item.localImageUrls?.length > 0 ? item.localImageUrls : item.imageUrls) || item.imageUrls;

  const renderImageGrid = () => {
    const total = imageUrls.length;
    const hasMore = total > 4;
    const visibleUrls = imageUrls.slice(0, 4);

    const renderCell = (url, idx, extraStyle) => (
      <View key={`${item.id}_thumb_${idx}`} style={[styles.thumbGridCell, extraStyle]}>
        <Image
          source={{ uri: url }}
          style={styles.thumbGridImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={`${item.id}_thumb_${idx}`}
          transition={200}
        />
        {hasMore && idx === 3 ? (
          <View style={styles.thumbGridOverlay}>
            <Text style={styles.thumbGridOverlayText}>+{total - 4}</Text>
          </View>
        ) : null}
      </View>
    );

    // 2 张：左右均分
    if (total === 2) {
      return (
        <View style={styles.thumbGrid}>
          {imageUrls.map((url, idx) => renderCell(url, idx, styles.thumbGridItem2))}
        </View>
      );
    }

    // 3 张：左侧大图 + 右侧两张上下堆叠
    if (total === 3) {
      return (
        <View style={[styles.thumbGrid, styles.thumbGrid3Container]}>
          {renderCell(imageUrls[0], 0, styles.thumbGrid3Main)}
          <View style={styles.thumbGrid3Side}>
            {renderCell(imageUrls[1], 1, styles.thumbGrid3SideItem)}
            {renderCell(imageUrls[2], 2, styles.thumbGrid3SideItem)}
          </View>
        </View>
      );
    }

    // 4 张及以上：2x2 网格，第 4 张显示 +N 遮罩
    return (
      <View style={[styles.thumbGrid, styles.thumbGrid4Container]}>
        <View style={styles.thumbGrid4Row}>
          {renderCell(visibleUrls[0], 0, styles.thumbGrid4Item)}
          {renderCell(visibleUrls[1], 1, styles.thumbGrid4Item)}
        </View>
        <View style={styles.thumbGrid4Row}>
          {renderCell(visibleUrls[2], 2, styles.thumbGrid4Item)}
          {renderCell(visibleUrls[3], 3, styles.thumbGrid4Item)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.historyCard}>
      {batchMode ? (
        <Pressable style={({ pressed }) => [styles.checkboxArea, pressed && pressedOpacity()]} onPress={() => toggleSelect(item.id)} >
          <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
            {isSelected ? <Text style={styles.checkboxMark}>✓</Text> : null}
          </View>
        </Pressable>
      ) : null}
      <Pressable
        style={({ pressed }) => [styles.historyCardInner, pressed && { opacity: batchMode ? 0.6 : 0.7 }]} onPress={() => {
          if (batchMode) {
            toggleSelect(item.id);
            return;
          }
          // 收集所有可预览的产物类型（修复：同一任务可能包含多种类型产物）
          const types = [];
          if (videoUrl) types.push('video');
          if (audioUrl) types.push('audio');
          if (item.textResult) types.push('text');
          if (imageUrl) types.push('image');

          const openPreview = (type) => {
            if (type === 'video') setVideoPreview({ visible: true, url: videoUrl });
            else if (type === 'audio') setAudioPreview({ visible: true, url: audioUrl });
            else if (type === 'text') setTextPreview({ visible: true, text: item.textResult });
            else if (type === 'image') {
              setPreviewImage({ url: imageUrl, prompt: item.prompt });
              setPreviewImageUrls(imageUrls || null);
            }
          };

          // 单一类型：直接打开；多类型：让用户选择
          if (types.length <= 1) {
            openPreview(types[0]);
          } else {
            const labels = { video: '视频', audio: '音频', text: '文本', image: '图片' };
            Alert.alert(
              '选择预览类型',
              '该任务包含多种产物',
              types
                .map((t) => ({ text: labels[t], onPress: () => openPreview(t) }))
                .concat({ text: '取消', style: 'cancel' })
            );
          }
        }}
        disabled={batchMode ? false : !(imageUrl || videoUrl || item.textResult || audioUrl)}
      >
        <View style={styles.historyThumbWrap}>
          {item.outputType === 'video' && videoUrl ? (
            <View style={styles.thumbContainer}>
              {thumbUri ? (
                <Image source={{ uri: thumbUri }} style={styles.historyThumb} contentFit="cover" cachePolicy="memory-disk" recyclingKey={`${item.id}_thumb`} transition={200} />
              ) : (
                <View style={[styles.historyThumbPlaceholder, styles.historyThumbVideo]}>
                  <Ionicons name="videocam" size={32} color={colors.primary} />
                </View>
              )}
              <View style={styles.thumbPlayOverlay}>
                <Ionicons name="play-circle" size={28} color={colors.textOnOverlay} />
              </View>
            </View>
          ) : item.outputType === 'audio' && audioUrl ? (
            <View style={styles.thumbContainer}>
              <View style={[styles.historyThumbPlaceholder, styles.historyThumbAudio]}>
                <Ionicons name="musical-notes" size={32} color={colors.purple} />
              </View>
              <View style={styles.thumbPlayOverlay}>
                <Ionicons name="play-circle" size={28} color={colors.textOnOverlay} />
              </View>
            </View>
          ) : item.outputType === 'text' && item.textResult ? (
            <View style={[styles.historyThumbPlaceholder, styles.historyThumbText]}>
              <Ionicons name="document-text" size={32} color={colors.primary} />
            </View>
          ) : imageUrl ? (
            imageUrls && imageUrls.length > 1 ? (
              renderImageGrid()
            ) : (
              <Image source={{ uri: imageUrl }} style={styles.historyThumb} contentFit="cover" cachePolicy="memory-disk" recyclingKey={`${item.id}_thumb`} transition={200} />
            )
          ) : item.status === 'Failed' ? (
            <View style={[styles.historyThumbPlaceholder, styles.historyThumbFailed]}>
              <Ionicons name="close-circle-outline" size={32} color={colors.error} />
            </View>
          ) : (
            <View style={styles.historyThumbPlaceholder}>
              <ActivityIndicator color={colors.textTertiary} />
            </View>
          )}
        </View>
        <View style={styles.historyInfo}>
          <View style={styles.historyInfoHeader}>
            <Text style={styles.historyPrompt} numberOfLines={2}>{item.prompt}</Text>
            {isWebapp && isActive && !batchMode ? (
              <Pressable style={({ pressed }) => [styles.stopButton, pressed && pressedOpacity(), stopping && styles.stopButtonDisabled]} onPress={handleStop} disabled={stopping}>
                {stopping ? <ActivityIndicator size="small" color={colors.error} /> : <Ionicons name="stop-circle" size={18} color={colors.error} />}
                <Text style={styles.stopButtonText}>{stopping ? '终止中' : '终止'}</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.historyMeta}>{item.modelName}{(item.outputType === 'image' || item.outputType === 'video') && item.actualResolution ? ` · ${item.actualResolution}` : item.resolution ? ` · ${item.resolution}` : ''} · {item.date}</Text>
          <View style={styles.historyDurationRow}>
            <DurationDisplay startedAt={item.startedAt} completedAt={item.completedAt} isFinal={isFinal} isActive={isActive} colors={colors} status={item.status} />
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              {isActive ? <ActivityIndicator size="small" color={statusColor} style={styles.statusSpinner} /> : null}
              <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
          </View>
          <View style={styles.historyBottomRow}>
            {!isWebapp ? (
              <Text style={styles.historyPrice}>{isTokenPricedModel(item.modelId) ? '按量计费' : `${item.price} 金币`}</Text>
            ) : <View />}
            <View style={styles.historyActions}>
              {((imageUrl || videoUrl || audioUrl) && !batchMode) ? (
                <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonSuccess, pressed && pressedOpacity()]} onPress={() => handleDownload(item)}>
                  <Ionicons name="download" size={18} color={colors.success} />
                </Pressable>
              ) : null}
              {!batchMode ? (
                <Pressable style={({ pressed }) => [styles.iconButton, copied ? styles.iconButtonCopied : styles.iconButtonPurple, pressed && pressedOpacity()]} onPress={handleCopy}>
                  <Ionicons name={copied ? 'checkmark' : 'copy'} size={18} color={copied ? colors.success : colors.purple} />
                </Pressable>
              ) : null}
              {!batchMode ? (
                <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonWarning, pressed && pressedOpacity(), resubmitting && styles.iconButtonDisabled]} onPress={handleResubmit} disabled={resubmitting}>
                  {resubmitting ? <ActivityIndicator size="small" color={colors.warning} /> : <Ionicons name="refresh-outline" size={18} color={colors.warning} />}
                </Pressable>
              ) : null}
              <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonPrimary, pressed && pressedOpacity()]} onPress={() => setLogModal(item)}>
                <Ionicons name="document-text" size={18} color={colors.primary} />
              </Pressable>
              {!batchMode ? (
                <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonError, pressed && pressedOpacity()]} onPress={() => setDeleteConfirmId(item.id)}>
                  <Ionicons name="trash" size={18} color={colors.error} />
                </Pressable>
              ) : null}
            </View>
          </View>
          {item.errorMessage ? (
            <Pressable
              onPress={() => setErrorExpanded((prev) => !prev)}
              disabled={errorExpanded && (item.errorMessage?.length || 0) <= 80}
              style={styles.errorWrap}
            >
              <Text
                style={[styles.historyError, item.status !== 'Failed' && styles.historyErrorWarning]}
                numberOfLines={errorExpanded ? undefined : 2}
              >
                {item.errorMessage}
              </Text>
              {(item.errorMessage?.length || 0) > 80 ? (
                <Text style={styles.errorToggleText}>{errorExpanded ? '收起' : '展开'}</Text>
              ) : null}
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
},
(prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
    prevProps.item.status === nextProps.item.status &&
    prevProps.item.imageUrl === nextProps.item.imageUrl &&
    prevProps.item.videoUrl === nextProps.item.videoUrl &&
    prevProps.item.audioUrl === nextProps.item.audioUrl &&
    prevProps.item.localImageUrl === nextProps.item.localImageUrl &&
    prevProps.item.localVideoUrl === nextProps.item.localVideoUrl &&
    prevProps.item.localAudioUrl === nextProps.item.localAudioUrl &&
    prevProps.item.localImageUrls === nextProps.item.localImageUrls &&
    prevProps.item.textResult === nextProps.item.textResult &&
    prevProps.item.errorMessage === nextProps.item.errorMessage &&
    prevProps.item.completedAt === nextProps.item.completedAt &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.batchMode === nextProps.batchMode &&
    prevProps.thumbUri === nextProps.thumbUri;
});

const createStyles = (colors) => ({
  historyCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: Radius.xs, borderCurve: 'continuous', marginBottom: Spacing.sm, overflow: 'hidden', maxWidth: 720, width: '100%', alignSelf: 'center' },
  checkboxArea: { width: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  checkbox: { width: 22, height: 22, borderRadius: Radius.full, borderCurve: 'continuous', borderWidth: 1.5, borderColor: colors.disabled, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxMark: { color: colors.textInverse, fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold },
  historyCardInner: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  historyThumbWrap: { marginLeft: 6, marginVertical: 6, width: 88 },
  thumbContainer: { flex: 1, width: '100%', position: 'relative', borderRadius: Radius.xs, borderCurve: 'continuous', overflow: 'hidden' },
  thumbPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.overlayLight,
  },
  historyThumb: { width: '100%', flex: 1, resizeMode: 'cover', borderRadius: Radius.xs, borderCurve: 'continuous' },
  historyThumbPlaceholder: { flex: 1, width: '100%', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  historyThumbFailed: { backgroundColor: colors.errorBg },
  historyThumbVideo: { backgroundColor: colors.primaryBg },
  historyThumbAudio: { backgroundColor: colors.purpleBg },
  historyThumbText: { backgroundColor: colors.primaryBg },
  thumbGrid: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    borderRadius: Radius.xs,
    borderCurve: 'continuous',
    overflow: 'hidden',
    gap: 2,
    backgroundColor: colors.bg,
  },
  thumbGridCell: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbGridImage: {
    width: '100%',
    height: '100%',
  },
  thumbGridItem2: {
    height: '100%',
  },
  thumbGrid3Container: {
    flexDirection: 'row',
  },
  thumbGrid3Main: {
    height: '100%',
  },
  thumbGrid3Side: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  thumbGrid3SideItem: {
    flex: 1,
    width: '100%',
  },
  thumbGrid4Container: {
    flexDirection: 'column',
  },
  thumbGrid4Row: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  thumbGrid4Item: {
    flex: 1,
  },
  thumbGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbGridOverlayText: {
    color: colors.textOnOverlay,
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
  },
  historyInfo: { flex: 1, padding: Spacing.md, justifyContent: 'space-between', alignSelf: 'center' },
  historyInfoHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm },
  stopButton: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, borderCurve: 'continuous', backgroundColor: colors.errorBg },
  stopButtonDisabled: { opacity: 0.5 },
  stopButtonText: { fontSize: Typography.fontSize.caption1, color: colors.error, fontWeight: Typography.fontWeight.semibold },
  historyPrompt: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, fontWeight: Typography.fontWeight.medium, lineHeight: 18, flex: 1 },
  historyMeta: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, marginTop: 3 },
  historyDurationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: Spacing.sm },
  historyDuration: { fontSize: Typography.fontSize.caption1, color: colors.success, fontWeight: Typography.fontWeight.medium },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.full, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: 2, gap: 3 },
  statusSpinner: { marginRight: 0 },
  statusText: { fontSize: Typography.fontSize.caption2, fontWeight: Typography.fontWeight.semibold },
  historyBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  historyPrice: { fontSize: Typography.fontSize.footnote, color: colors.warning, fontWeight: Typography.fontWeight.bold, lineHeight: 18 },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { width: 28, height: 28, borderRadius: Radius.xs, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  iconButtonDisabled: { opacity: 0.5 },
  iconButtonSuccess: { backgroundColor: colors.successBg },
  iconButtonPurple: { backgroundColor: colors.purpleBg },
  iconButtonCopied: { backgroundColor: colors.successBg },
  iconButtonPrimary: { backgroundColor: colors.primaryBg },
  iconButtonError: { backgroundColor: colors.errorBg },
  iconButtonWarning: { backgroundColor: colors.warningBg },
  iconButtonRunning: { backgroundColor: colors.primaryBg },
  historyError: { fontSize: Typography.fontSize.caption2, color: colors.error, marginTop: 2 },
  historyErrorWarning: { color: colors.warning },
  errorWrap: { marginTop: 2 },
  errorToggleText: { fontSize: Typography.fontSize.caption2, color: colors.primary, fontWeight: Typography.fontWeight.semibold, marginTop: 2, alignSelf: 'flex-end' },
});
