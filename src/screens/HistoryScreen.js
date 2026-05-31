import React, { useState, useMemo, useCallback, useRef, useEffect, useReducer } from 'react';
import { Pressable, StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Platform,
  Alert, } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { getVideoThumbnailAsync } from 'expo-video-thumbnails';
import { useAppContext } from '../context/AppContext';
import { useHistoryContext, useHomeStateContext } from '../context/HistoryContext';
import { useToastContext } from '../context/ToastContext';
import { HistoryModals } from '../components/HistoryModals';
import { HistoryFilters } from '../components/HistoryFilters';
import { VideoPlayer } from '../components/VideoPlayer';
import { AudioPlayer } from '../components/AudioPlayer';
import { ImageViewer } from '../components/ImageViewer';
import { TextResultView } from '../components/TextResultView';
import { PAGE_SIZE, TAB_HISTORY } from '../constants/models';
import { isTokenPricedModel } from '../utils/modelHelpers';
import { triggerDownload } from '../utils/download';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];
const FINAL_STATUSES = ['Success', 'Failed', 'Canceled'];

const SORT_OPTIONS = [
  { key: 'newest', label: '最新优先' },
  { key: 'oldest', label: '最早优先' },
  { key: 'price_high', label: '价格高→低' },
  { key: 'price_low', label: '价格低→高' },
];

const STATUS_LABELS = {
  Pending: '等待中',
  Running: '运行中',
  Saving: '保存中',
  Success: '已完成',
  Failed: '失败',
  Canceled: '已取消',
};

function DurationDisplay({ startedAt, completedAt, isFinal, isActive, colors }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!isActive || isFinal) return;
    const timer = setInterval(() => forceUpdate(), 1000);
    return () => clearInterval(timer);
  }, [isActive, isFinal]);

  if (!isFinal && !isActive) return null;

  const end = completedAt || Date.now();
  const ms = end - (startedAt || 0);
  if (ms < 0) return <Text>--</Text>;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return <Text style={{ fontSize: 12, color: colors.success, fontWeight: '500' }}>{seconds}秒</Text>;
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  if (minutes < 60) return <Text style={{ fontSize: 12, color: colors.success, fontWeight: '500' }}>{minutes}分{remainSeconds}秒</Text>;
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  return <Text style={{ fontSize: 12, color: colors.success, fontWeight: '500' }}>{hours}时{remainMinutes}分</Text>;
}

const HistoryCard = React.memo(function HistoryCard({
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
        <Pressable style={({ pressed }) => [styles.checkboxArea, pressed && { opacity: 0.7 }]} onPress={() => toggleSelect(item.id)} >
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
              <Pressable style={({ pressed }) => [styles.stopButton, pressed && { opacity: 0.7 }]} onPress={() => stopPolling(item.id)} >
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
                <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonSuccess, pressed && { opacity: 0.7 }]} onPress={() => handleDownload(item)}>
                  <Ionicons name="download" size={18} color={colors.success} />
                </Pressable>
              ) : null}
              {!batchMode ? (
                <Pressable style={({ pressed }) => [styles.iconButton, copied ? styles.iconButtonCopied : styles.iconButtonPurple, pressed && { opacity: 0.7 }]} onPress={handleCopy}>
                  <Ionicons name={copied ? 'checkmark' : 'copy'} size={18} color={copied ? colors.success : colors.purple} />
                </Pressable>
              ) : null}
              {!batchMode ? (
                <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonWarning, pressed && { opacity: 0.7 }]} onPress={() => { resubmitTask(item); router.navigate('/'); }}>
                  <Ionicons name="refresh-outline" size={18} color={colors.warning} />
                </Pressable>
              ) : null}
              <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonPrimary, pressed && { opacity: 0.7 }]} onPress={() => setLogModal(item)}>
                <Ionicons name="document-text" size={18} color={colors.primary} />
              </Pressable>
              {!batchMode ? (
                <Pressable style={({ pressed }) => [styles.iconButton, styles.iconButtonError, pressed && { opacity: 0.7 }]} onPress={() => setDeleteConfirmId(item.id)}>
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

export function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const {
    history,
    removeHistoryItems,
    refreshRunningTasks,
    totalCoinsSpent,
    stopPolling,
  } = useHistoryContext();
  const { resubmitTask } = useHomeStateContext();
  const { activeTab } = useAppContext();
  const { showToast } = useToastContext();

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImageUrls, setPreviewImageUrls] = useState(null);
  const [videoPreview, setVideoPreview] = useState({ visible: false, url: null });
  const [audioPreview, setAudioPreview] = useState({ visible: false, url: null });
  const [textPreview, setTextPreview] = useState({ visible: false, text: '' });
  const [logModal, setLogModal] = useState(null);
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadingRef = useRef(new Set());
  const [deleteConfirmBatch, setDeleteConfirmBatch] = useState(false);
  const flatListRef = useRef(null);
  const prevActiveTab = useRef(activeTab);
  const thumbCache = useRef({});
  const [thumbVersion, setThumbVersion] = useState(0);

  useEffect(() => {
    if (
      activeTab === TAB_HISTORY &&
      prevActiveTab.current !== TAB_HISTORY
    ) {
      refreshRunningTasks();
    }
    prevActiveTab.current = activeTab;
  }, [activeTab, refreshRunningTasks]);

  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    let items = [...history];
    if (searchText.trim()) {
      const kw = searchText.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.prompt?.toLowerCase().includes(kw) ||
          item.modelName?.toLowerCase().includes(kw) ||
          item.id?.includes(kw)
      );
    }
    if (filterBy !== 'all') {
      items = items.filter((item) => item.outputType === filterBy);
    }
    if (sourceFilter === 'model') {
      items = items.filter((item) => item.source !== 'webapp');
    } else if (sourceFilter === 'webapp') {
      items = items.filter((item) => item.source === 'webapp');
    }
    switch (sortBy) {
      case 'newest': items.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0)); break;
      case 'oldest': items.sort((a, b) => (a.startedAt || 0) - (b.startedAt || 0)); break;
      case 'price_high': items.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'price_low': items.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
    }
    return items;
  }, [history, searchText, sortBy, filterBy, sourceFilter]);

  const displayedItems = useMemo(() => filteredHistory.slice(0, visibleCount), [filteredHistory, visibleCount]);
  const hasMore = visibleCount < filteredHistory.length;

  useEffect(() => {
    const videoItems = displayedItems
      .filter((item) => item.outputType === 'video' && item.videoUrl && !thumbCache.current[item.videoUrl]);
    if (videoItems.length === 0) return;
    let cancelled = false;
    const loadThumbnails = async () => {
      for (const item of videoItems) {
        if (cancelled) break;
        try {
          const { uri } = await getVideoThumbnailAsync(item.videoUrl, { time: 2000 });
          if (!cancelled && uri) {
            thumbCache.current[item.videoUrl] = uri;
            setThumbVersion((v) => v + 1);
          }
        } catch {}
      }
    };
    loadThumbnails();
    return () => { cancelled = true; };
  }, [displayedItems]);

  const loadMore = useCallback(() => { if (hasMore) setVisibleCount((prev) => prev + PAGE_SIZE); }, [hasMore]);
  const handleSearch = useCallback((text) => { setSearchText(text); setVisibleCount(PAGE_SIZE); }, []);
  const handleSortChange = useCallback((key) => { setSortBy(key); setShowSortPicker(false); setVisibleCount(PAGE_SIZE); }, []);
  const handleFilterChange = useCallback((key) => { setFilterBy(key); setVisibleCount(PAGE_SIZE); setBatchMode(false); setSelectedIds(new Set()); }, []);
  const handleSourceFilterChange = useCallback((key) => { setSourceFilter(key); setVisibleCount(PAGE_SIZE); setBatchMode(false); setSelectedIds(new Set()); }, []);

  const handleDelete = useCallback((id) => {
    removeHistoryItems((item) => item.id === id);
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    setDeleteConfirmId(null);
  }, [removeHistoryItems]);

  const handleBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    removeHistoryItems((item) => selectedIds.has(item.id));
    setSelectedIds(new Set()); setBatchMode(false); setDeleteConfirmBatch(false);
  }, [removeHistoryItems, selectedIds]);

  const handleDownload = useCallback((item) => {
    if (isDownloading || downloadingRef.current.has(item.id)) return;
    downloadingRef.current.add(item.id);
    const ext = item.outputType === 'video' ? '.mp4' : item.outputType === 'audio' ? `.${item.responseFormat || 'mp3'}` : '.jpg';
    if (item.outputType === 'image' && item.imageUrls && item.imageUrls.length > 1) {
      const urls = item.imageUrls;
      (async () => {
        try {
          if (Platform.OS === 'web') {
            for (let i = 0; i < urls.length; i++) {
              const anchor = document.createElement('a');
              anchor.href = urls[i];
              anchor.download = `bizyair_${item.id}_${i + 1}${ext}`;
              anchor.target = '_blank';
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
              if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 300));
            }
          } else {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('权限不足', '需要存储权限才能保存文件');
              return;
            }
            for (let i = 0; i < urls.length; i++) {
              const filename = `bizyair_${item.id}_${i + 1}${ext}`;
              const destination = new File(Paths.cache, filename);
              const downloadedFile = await File.downloadFileAsync(urls[i], destination);
              await MediaLibrary.createAssetAsync(downloadedFile.uri);
              if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 300));
            }
            showToast(`${urls.length} 张图片已保存到相册`, 'success');
          }
        } catch (err) {
          showToast(err.message || '下载失败，请检查网络连接', 'error');
        } finally {
          setTimeout(() => downloadingRef.current.delete(item.id), 2000);
        }
      })();
    } else {
      const url = item.videoUrl || item.audioUrl || item.imageUrl;
      if (!url) { downloadingRef.current.delete(item.id); return; }
      (async () => {
        const result = await triggerDownload(url, `bizyair_${item.id}${ext}`);
        if (result.errorType === 'permission') {
          Alert.alert('权限不足', '需要存储权限才能保存文件');
        } else if (result.success) {
          showToast('文件已保存到相册', 'success');
        } else {
          showToast(result.message || '下载失败，请检查网络连接', 'error');
        }
        setTimeout(() => downloadingRef.current.delete(item.id), 2000);
      })();
    }
  }, [isDownloading, showToast]);

  const handleBatchDownload = useCallback(async () => {
    if (!Array.isArray(history)) return;
    const items = history.filter((item) => selectedIds.has(item.id) && (item.imageUrl || item.videoUrl || item.audioUrl));
    if (items.length === 0) return;
    setIsDownloading(true);
    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const ext = item.outputType === 'video' ? '.mp4' : item.outputType === 'audio' ? `.${item.responseFormat || 'mp3'}` : '.jpg';
      if (item.outputType === 'image' && item.imageUrls && item.imageUrls.length > 1) {
        for (let j = 0; j < item.imageUrls.length; j++) {
          const result = await triggerDownload(item.imageUrls[j], `bizyair_${item.id}_${j + 1}${ext}`);
          if (result.success) successCount++; else failCount++;
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      } else {
        const url = item.videoUrl || item.audioUrl || item.imageUrl;
        const result = await triggerDownload(url, `bizyair_${item.id}${ext}`);
        if (result.success) successCount++; else failCount++;
      }
      if (i < items.length - 1) await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (failCount > 0) {
      showToast(`${successCount} 个下载成功，${failCount} 个失败`, 'error');
    } else {
      showToast(`${successCount} 个文件已保存到相册`, 'success');
    }
    setIsDownloading(false); setBatchMode(false); setSelectedIds(new Set());
  }, [history, selectedIds, showToast]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const toggleBatchMode = useCallback(() => {
    setBatchMode((prev) => { if (prev) setSelectedIds(new Set()); return !prev; });
  }, []);

  const selectAll = useCallback(() => { if (Array.isArray(filteredHistory)) setSelectedIds(new Set(filteredHistory.map((item) => item.id))); }, [filteredHistory]);
  const deselectAll = useCallback(() => { setSelectedIds(new Set()); }, []);

  const activeCount = Array.isArray(history) ? history.filter((h) => h && ACTIVE_STATUSES.includes(h.status)).length : 0;
  const successCount = Array.isArray(history) ? history.filter((h) => h && h.status === 'Success').length : 0;
  const failedCount = Array.isArray(history) ? history.filter((h) => h && h.status === 'Failed').length : 0;

  const renderItem = useCallback(({ item }) => {
    const thumbUri = item.outputType === 'video' && item.videoUrl ? thumbCache.current[item.videoUrl] : null;
    return (
      <HistoryCard
        item={item}
        isSelected={selectedIds.has(item.id)}
        batchMode={batchMode}
        toggleSelect={toggleSelect}
        handleDownload={handleDownload}
        setLogModal={setLogModal}
        setDeleteConfirmId={setDeleteConfirmId}
        setVideoPreview={setVideoPreview}
        setTextPreview={setTextPreview}
        setAudioPreview={setAudioPreview}
        setPreviewImage={setPreviewImage}
        setPreviewImageUrls={setPreviewImageUrls}
        stopPolling={stopPolling}
        resubmitTask={resubmitTask}
        thumbUri={thumbUri}
      />
    );
  }, [selectedIds, batchMode, toggleSelect, handleDownload, stopPolling, resubmitTask]);

  const extraData = useMemo(() => ({ selectedIds, thumbVersion }), [selectedIds, thumbVersion]);

  const renderFooter = useCallback(() => {
    if (!hasMore) {
      if (filteredHistory.length > 0) return <View style={styles.footerEnd}><Text style={styles.footerEndText}>已加载全部 {filteredHistory.length} 条记录</Text></View>;
      return null;
    }
    return <View style={styles.footerLoading}><ActivityIndicator color={colors.primary} /><Text style={styles.footerLoadingText}>加载更多...</Text></View>;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- styles/colors only change on theme switch
  }, [hasMore, filteredHistory.length]);

  const renderEmpty = useCallback(() => {
    const histLen = Array.isArray(history) ? history.length : 0;
    if (histLen === 0) return <View style={styles.emptyContainer}><Text style={styles.emptyIcon}>📭</Text><Text style={styles.emptyTitle}>暂无历史记录</Text><Text style={styles.emptySubtitle}>开始创作，你的作品将在这里展示</Text></View>;
    return <View style={styles.emptyContainer}><Text style={styles.emptyIcon}>🔍</Text><Text style={styles.emptyTitle}>未找到匹配记录</Text><Text style={styles.emptySubtitle}>尝试调整搜索条件或筛选器</Text></View>;
  }, [history, styles]);

  return (
    <View style={styles.container}>
      <HistoryFilters
        topInset={insets.top}
        history={history}
        searchText={searchText}
        filterBy={filterBy}
        sortBy={sortBy}
        sourceFilter={sourceFilter}
        batchMode={batchMode}
        selectedIds={selectedIds}
        isDownloading={isDownloading}
        activeCount={activeCount}
        successCount={successCount}
        failedCount={failedCount}
        totalCoinsSpent={totalCoinsSpent}
        onSearchChange={handleSearch}
        onFilterChange={handleFilterChange}
        onSortPress={() => setShowSortPicker(true)}
        onSourceFilterChange={handleSourceFilterChange}
        onToggleBatchMode={toggleBatchMode}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBatchDeletePress={() => setDeleteConfirmBatch(true)}
        onBatchDownload={handleBatchDownload}
      />

      <FlatList ref={flatListRef} data={displayedItems} keyExtractor={(item) => item.id} renderItem={renderItem} extraData={extraData} ListEmptyComponent={renderEmpty} ListFooterComponent={renderFooter} onEndReached={loadMore} onEndReachedThreshold={0.3} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

      <HistoryModals
        logModal={logModal}
        setLogModal={setLogModal}
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={setDeleteConfirmId}
        deleteConfirmBatch={deleteConfirmBatch}
        setDeleteConfirmBatch={setDeleteConfirmBatch}
        showSortPicker={showSortPicker}
        setShowSortPicker={setShowSortPicker}
        handleDelete={handleDelete}
        handleBatchDelete={handleBatchDelete}
        selectedIds={selectedIds}
        handleSortChange={handleSortChange}
        sortBy={sortBy}
        SORT_OPTIONS={SORT_OPTIONS}
      />
      <VideoPlayer
        visible={videoPreview.visible}
        videoUrl={videoPreview.url}
        onClose={() => setVideoPreview({ visible: false, url: null })}
      />
      <AudioPlayer
        visible={audioPreview.visible}
        audioUrl={audioPreview.url}
        onClose={() => setAudioPreview({ visible: false, url: null })}
      />
      <TextResultView
        visible={textPreview.visible}
        text={textPreview.text}
        onClose={() => setTextPreview({ visible: false, text: '' })}
      />
      <ImageViewer
        visible={!!previewImage}
        imageUrl={previewImage?.url}
        imageUrls={previewImageUrls}
        prompt={previewImage?.prompt}
        onClose={() => { setPreviewImage(null); setPreviewImageUrls(null); }}
      />
    </View>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.bg },
  listContent: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  historyCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: Radius.xs, borderCurve: 'continuous', marginBottom: Spacing.sm, overflow: 'hidden' },
  checkboxArea: { width: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  checkbox: { width: 22, height: 22, borderRadius: Radius.full, borderCurve: 'continuous', borderWidth: 1.5, borderColor: colors.disabled, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxMark: { color: colors.textInverse, fontSize: 14, fontWeight: '600' },
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
    fontWeight: '700',
  },
  historyInfo: { flex: 1, padding: Spacing.md, justifyContent: 'space-between', alignSelf: 'center' },
  historyInfoHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm },
  stopButton: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, borderCurve: 'continuous', backgroundColor: colors.errorBg },
  stopButtonText: { fontSize: 12, color: colors.error, fontWeight: '600' },
  historyPrompt: { fontSize: 14, color: colors.textPrimary, fontWeight: '500', lineHeight: 18, flex: 1 },
  historyMeta: { fontSize: 12, color: colors.textTertiary, marginTop: 3 },
  historyDurationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: Spacing.sm },
  historyDuration: { fontSize: 12, color: colors.success, fontWeight: '500' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.full, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: 2, gap: 3 },
  statusSpinner: { marginRight: 0 },
  statusText: { fontSize: 11, fontWeight: '600' },
  historyBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  historyPrice: { fontSize: 13, color: colors.warning, fontWeight: '700', lineHeight: 18 },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { width: 28, height: 28, borderRadius: Radius.xs, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  iconButtonSuccess: { backgroundColor: colors.successBg },
  iconButtonPurple: { backgroundColor: colors.purpleBg },
  iconButtonCopied: { backgroundColor: colors.successBg },
  iconButtonPrimary: { backgroundColor: colors.primaryBg },
  iconButtonError: { backgroundColor: colors.errorBg },
  iconButtonWarning: { backgroundColor: colors.warningBg },
  iconButtonRunning: { backgroundColor: colors.primaryBg },
  historyError: { fontSize: 11, color: colors.error, marginTop: 2 },
  historyErrorWarning: { color: colors.warning },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { fontSize: 20, color: colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: colors.textTertiary },
  footerEnd: { alignItems: 'center', paddingVertical: Spacing.xl },
  footerEndText: { fontSize: 13, color: colors.disabled },
  footerLoading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  footerLoadingText: { fontSize: 13, color: colors.textTertiary },
});
