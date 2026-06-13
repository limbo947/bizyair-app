import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { isTokenPricedModel } from '../../utils/modelHelpers';
import { pressedOpacity, Radius, Spacing, Typography } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { DurationDisplay } from './DurationDisplay';

const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];
const FINAL_STATUSES = ['Success', 'Failed', 'Canceled'];

const STATUS_LABELS = {
  Pending: '等待中',
  Running: '运行中',
  Saving: '保存中',
  Success: '已完成',
  Failed: '失败',
  Canceled: '已取消',
};

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
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(item.prompt || '');
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  }, [item.prompt]);

  useEffect(() => {
    return () => { if (copiedTimer.current) clearTimeout(copiedTimer.current); };
  }, []);

  const isFinal = FINAL_STATUSES.includes(item.status);
  const statusLabel = STATUS_LABELS[item.status] || item.status;
  const statusColor = theme.STATUS_COLORS[item.status] || colors.textTertiary;
  const statusBg = theme.STATUS_BG[item.status] || colors.bg;
  const isActive = ACTIVE_STATUSES.includes(item.status);
  const isWebapp = item.source === 'webapp';

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
          if (batchMode) toggleSelect(item.id);
          else if (item.outputType === 'video' && item.videoUrl) {
            setVideoPreview({ visible: true, url: item.videoUrl });
          } else if (item.outputType === 'text' && item.textResult) {
            setTextPreview({ visible: true, text: item.textResult });
          } else if (item.outputType === 'audio' && item.audioUrl) {
            setAudioPreview({ visible: true, url: item.audioUrl });
          } else if (item.imageUrl) {
            setPreviewImage({ url: item.imageUrl, prompt: item.prompt });
            setPreviewImageUrls(item.imageUrls || null);
          }
        }}
        disabled={batchMode ? false : !(item.imageUrl || item.videoUrl || item.textResult || item.audioUrl)}
      >
        <View style={styles.historyThumbWrap}>
          {item.outputType === 'video' && item.videoUrl ? (
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
          ) : item.outputType === 'audio' && item.audioUrl ? (
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
          ) : item.imageUrl ? (
            item.imageUrls && item.imageUrls.length > 1 ? (
              <View style={styles.thumbGrid}>
                {item.imageUrls.slice(0, 4).map((url, idx) => (
                  <Image
                    key={`${item.id}_thumb_${idx}`}
                    source={{ uri: url }}
                    style={[
                      styles.thumbGridItem,
                      item.imageUrls.length === 2 && styles.thumbGridItem2,
                      item.imageUrls.length === 3 && idx === 0 && styles.thumbGridItem3First,
                    ]}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    recyclingKey={`${item.id}_thumb_${idx}`}
                    transition={200}
                  />
                ))}
                {item.imageUrls.length > 4 ? (
                  <View style={styles.thumbGridOverlay}>
                    <Text style={styles.thumbGridOverlayText}>+{item.imageUrls.length - 4}</Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <Image source={{ uri: item.imageUrl }} style={styles.historyThumb} contentFit="cover" cachePolicy="memory-disk" recyclingKey={`${item.id}_thumb`} transition={200} />
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
              <Pressable style={({ pressed }) => [styles.stopButton, pressed && pressedOpacity()]} onPress={() => stopPolling(item.id)} >
                <Ionicons name="stop-circle" size={18} color={colors.error} />
                <Text style={styles.stopButtonText}>终止</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={styles.historyMeta}>{item.modelName}{(item.outputType === 'image' || item.outputType === 'video') && item.actualResolution ? ` · ${item.actualResolution}` : item.resolution ? ` · ${item.resolution}` : ''} · {item.date}</Text>
          <View style={styles.historyDurationRow}>
            <DurationDisplay startedAt={item.startedAt} completedAt={item.completedAt} isFinal={isFinal} isActive={isActive} colors={colors} />
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
              {((item.imageUrl && !batchMode) || (item.outputType === 'video' && item.videoUrl && !batchMode) || (item.outputType === 'audio' && item.audioUrl && !batchMode)) ? (
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
                <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonWarning, pressed && pressedOpacity()]} onPress={() => { resubmitTask(item); router.navigate('/'); }}>
                  <Ionicons name="refresh-outline" size={18} color={colors.warning} />
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
            <Text style={[styles.historyError, item.status !== 'Failed' && styles.historyErrorWarning]} numberOfLines={1}>{item.errorMessage}</Text>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
},
(prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
    prevProps.item.status === nextProps.item.status &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.batchMode === nextProps.batchMode &&
    prevProps.thumbUri === nextProps.thumbUri;
});

const createStyles = (colors) => ({
  historyCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: Radius.xs, borderCurve: 'continuous', marginBottom: Spacing.sm, overflow: 'hidden' },
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
    flexWrap: 'wrap',
    borderRadius: Radius.xs,
    borderCurve: 'continuous',
    overflow: 'hidden',
    gap: 2,
    backgroundColor: colors.bg,
  },
  thumbGridItem: {
    width: '48%',
    height: '48%',
    borderRadius: 2,
    borderCurve: 'continuous',
    resizeMode: 'cover',
  },
  thumbGridItem2: {
    width: '48%',
    height: '100%',
  },
  thumbGridItem3First: {
    width: '100%',
    height: '48%',
  },
  thumbGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayMedium,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xs,
    borderCurve: 'continuous',
  },
  thumbGridOverlayText: {
    color: colors.textOnOverlay,
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
  },
  historyInfo: { flex: 1, padding: Spacing.md, justifyContent: 'space-between', alignSelf: 'center' },
  historyInfoHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm },
  stopButton: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, borderCurve: 'continuous', backgroundColor: colors.errorBg },
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
  iconButtonSuccess: { backgroundColor: colors.successBg },
  iconButtonPurple: { backgroundColor: colors.purpleBg },
  iconButtonCopied: { backgroundColor: colors.successBg },
  iconButtonPrimary: { backgroundColor: colors.primaryBg },
  iconButtonError: { backgroundColor: colors.errorBg },
  iconButtonWarning: { backgroundColor: colors.warningBg },
  iconButtonRunning: { backgroundColor: colors.primaryBg },
  historyError: { fontSize: Typography.fontSize.caption2, color: colors.error, marginTop: 2 },
  historyErrorWarning: { color: colors.warning },
});
