import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Platform,
  Alert,
  RefreshControl,
  BackHandler, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getVideoThumbnailAsync } from 'expo-video-thumbnails';
import { File, Paths } from 'expo-file-system';
import { useAppContext } from '../../context/AppContext';
import { useHistoryContext, useHomeStateContext } from '../../context/history';
import { useToastContext } from '../../context/ToastContext';
import { HistoryModals } from '../../components/HistoryModals';
import { HistoryFilters } from '../../components/HistoryFilters';
import { VideoPlayer } from '../../components/media/VideoPlayer';
import { AudioPlayer } from '../../components/media/AudioPlayer';
import { ImageViewer } from '../../components/media/ImageViewer';
import { TextResultView } from '../../components/common/TextResultView';
import { PAGE_SIZE, TAB_HISTORY, STATUS_LABELS } from '../../constants/models';
import { MODE_LABELS } from '../home/homeReducer';
import { useDownload } from '../../hooks/useDownload';
import { resolveUrl } from '../../utils/resultCache';
import { Spacing, Typography } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { HistoryCard } from './HistoryCard';

const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];

const SORT_OPTIONS = [
  { key: 'newest', label: '最新优先' },
  { key: 'oldest', label: '最早优先' },
  { key: 'price_high', label: '价格高→低' },
  { key: 'price_low', label: '价格低→高' },
];

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
  const { handleDownload: downloadFile } = useDownload(showToast);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimerRef = useRef(null);
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const downloadingRef = useRef(new Set());
  const [deleteConfirmBatch, setDeleteConfirmBatch] = useState(false);
  const flatListRef = useRef(null);
  const prevActiveTab = useRef(activeTab);
  const [thumbMap, setThumbMap] = useState({});
  // 问题4修复：用 ref 追踪已处理过的视频 URL，避免重复生成缩略图
  const processedThumbsRef = useRef(new Set());

  useEffect(() => {
    if (
      activeTab === TAB_HISTORY &&
      prevActiveTab.current !== TAB_HISTORY
    ) {
      refreshRunningTasks();
    }
    prevActiveTab.current = activeTab;
  }, [activeTab, refreshRunningTasks]);

  // 问题1修复：组件卸载时清理搜索防抖定时器，避免内存泄漏
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshRunningTasks();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshRunningTasks]);

  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    let items = [...history];
    if (debouncedSearch.trim()) {
      const kw = debouncedSearch.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.prompt?.toLowerCase().includes(kw) ||
          item.modelName?.toLowerCase().includes(kw) ||
          item.id?.includes(kw) ||
          MODE_LABELS[item.mode]?.toLowerCase().includes(kw) ||
          STATUS_LABELS[item.status]?.toLowerCase().includes(kw)
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
  }, [history, debouncedSearch, sortBy, filterBy, sourceFilter]);

  const displayedItems = useMemo(() => filteredHistory.slice(0, visibleCount), [filteredHistory, visibleCount]);
  const hasMore = visibleCount < filteredHistory.length;

  useEffect(() => {
    const videoItems = displayedItems
      .filter((item) => {
        if (item.outputType !== 'video') return false;
        const url = resolveUrl(item.localVideoUrl, item.videoUrl);
        if (!url) return false;
        // 跳过已有缩略图或已处理过的 URL
        if (thumbMap[url]) return false;
        if (processedThumbsRef.current.has(url)) return false;
        return true;
      });
    if (videoItems.length === 0) return;
    let cancelled = false;
    // 标记为已处理，防止后续 effect 重复触发
    videoItems.forEach((item) => {
      const url = resolveUrl(item.localVideoUrl, item.videoUrl);
      processedThumbsRef.current.add(url);
    });
    // 并发生成缩略图，限制并发数 3，避免长列表串行阻塞
    const CONCURRENCY = 3;
    const loadThumbnails = async () => {
      let cursor = 0;
      const workers = Array.from({ length: Math.min(CONCURRENCY, videoItems.length) }, async () => {
        while (cursor < videoItems.length) {
          const idx = cursor++;
          if (cancelled) break;
          const item = videoItems[idx];
          try {
            const url = resolveUrl(item.localVideoUrl, item.videoUrl);
            const { uri } = await getVideoThumbnailAsync(url, { time: 2000 });
            if (!cancelled && uri) {
              setThumbMap((prev) => ({ ...prev, [url]: uri }));
            }
          } catch (e) { console.warn('生成缩略图失败:', e?.message || e); }
        }
      });
      await Promise.all(workers);
    };
    loadThumbnails();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- thumbMap 仅用于跳过判断，不作为触发依赖
  }, [displayedItems]);

  const loadingMoreRef = useRef(false);
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setVisibleCount((prev) => prev + PAGE_SIZE);
    // 防抖：避免快速滚动时 onEndReached 多次触发
    setTimeout(() => { loadingMoreRef.current = false; }, 300);
  }, [hasMore]);

  // 批量模式下按返回键退出批量模式（Android）
  useEffect(() => {
    if (!batchMode) return;
    const handler = () => {
      setBatchMode(false);
      setSelectedIds(new Set());
      return true; // 拦截返回键
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => sub.remove();
  }, [batchMode]);
  const handleSearch = useCallback((text) => {
    setSearchText(text);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(text);
      setVisibleCount(PAGE_SIZE);
    }, 300);
  }, []);
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
    const localImageUrls = item.localImageUrls?.length > 0 ? item.localImageUrls : null;
    const dlImageUrls = localImageUrls || item.imageUrls;
    if (item.outputType === 'image' && dlImageUrls && dlImageUrls.length > 1) {
      const urls = dlImageUrls;
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
            const MediaLibrary = require('expo-media-library');
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('权限不足', '需要存储权限才能保存文件');
              return;
            }
            for (let i = 0; i < urls.length; i++) {
              const filename = `bizyair_${item.id}_${i + 1}${ext}`;
              const destination = new File(Paths.cache, filename);
              const downloadedFile = await File.downloadFileAsync(urls[i], destination);
              await MediaLibrary.Asset.create(downloadedFile.uri);
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
      const url = resolveUrl(item.localVideoUrl, item.videoUrl) || resolveUrl(item.localAudioUrl, item.audioUrl) || resolveUrl(item.localImageUrl, item.imageUrl);
      if (!url) { downloadingRef.current.delete(item.id); return; }
      (async () => {
        await downloadFile(url, `bizyair_${item.id}${ext}`);
        setTimeout(() => downloadingRef.current.delete(item.id), 2000);
      })();
    }
  }, [isDownloading, showToast, downloadFile]);

  const handleBatchDownload = useCallback(async () => {
    if (!Array.isArray(history)) return;
    const items = history.filter((item) => selectedIds.has(item.id) && (item.imageUrl || item.videoUrl || item.audioUrl));
    if (items.length === 0) return;
    setIsDownloading(true);
    let successCount = 0;
    let failCount = 0;
    let totalCount = 0;

    // 问题2修复：构建所有下载任务列表
    const tasks = [];
    for (const item of items) {
      const ext = item.outputType === 'video' ? '.mp4' : item.outputType === 'audio' ? `.${item.responseFormat || 'mp3'}` : '.jpg';
      const localImageUrls = item.localImageUrls?.length > 0 ? item.localImageUrls : null;
      const dlImageUrls = localImageUrls || item.imageUrls;
      if (item.outputType === 'image' && dlImageUrls && dlImageUrls.length > 1) {
        for (let j = 0; j < dlImageUrls.length; j++) {
          tasks.push({ url: dlImageUrls[j], filename: `bizyair_${item.id}_${j + 1}${ext}` });
        }
      } else {
        const url = resolveUrl(item.localVideoUrl, item.videoUrl) || resolveUrl(item.localAudioUrl, item.audioUrl) || resolveUrl(item.localImageUrl, item.imageUrl);
        if (url) tasks.push({ url, filename: `bizyair_${item.id}${ext}` });
      }
    }
    totalCount = tasks.length;

    // 问题2修复：并发下载，限制并发数 3，移除 500ms 硬延迟
    const CONCURRENCY = 3;
    let cursor = 0;
    const workers = Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, async () => {
      while (cursor < tasks.length) {
        const idx = cursor++;
        const task = tasks[idx];
        const result = await downloadFile(task.url, task.filename, { silent: true });
        if (result.skipped) { /* already downloading */ }
        else if (result.success) successCount++;
        else failCount++;
      }
    });
    await Promise.all(workers);

    if (failCount > 0) {
      showToast(`${successCount}/${totalCount} 个下载成功，${failCount} 个失败`, 'error');
    } else {
      showToast(`${successCount} 个文件已保存到相册`, 'success');
    }
    setIsDownloading(false); setBatchMode(false); setSelectedIds(new Set());
  }, [history, selectedIds, showToast, downloadFile]);

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
    const thumbUri = item.outputType === 'video' ? thumbMap[resolveUrl(item.localVideoUrl, item.videoUrl)] : null;
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
  }, [thumbMap, selectedIds, batchMode, toggleSelect, handleDownload, stopPolling, resubmitTask]);

  const extraData = useMemo(() => ({ selectedIds }), [selectedIds]);

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
    if (histLen === 0) return (
      <View style={styles.emptyContainer}>
        <Ionicons name="file-tray-outline" size={48} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>暂无历史记录</Text>
        <Text style={styles.emptySubtitle}>开始创作，你的作品将在这里展示</Text>
      </View>
    );
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>未找到匹配记录</Text>
        <Text style={styles.emptySubtitle}>尝试调整搜索条件或筛选器</Text>
      </View>
    );
  }, [history, styles, colors]);

  return (
    <View style={styles.container}>
      <HistoryFilters
        topInset={insets.top}
        history={history}
        filteredCount={filteredHistory.length}
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

      <FlatList ref={flatListRef} data={displayedItems} keyExtractor={(item) => item.id} renderItem={renderItem} extraData={extraData} ListEmptyComponent={renderEmpty} ListFooterComponent={renderFooter} onEndReached={loadMore} onEndReachedThreshold={0.3} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} colors={[colors.primary]} />} />

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

const createStyles = (colors) => {
  const shared = createSharedStyles(colors);
  return {
  container: { flex: 1, backgroundColor: colors.bg },
  listContent: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  emptyContainer: shared.emptyContainer,
  emptyTitle: shared.emptyTitle,
  emptySubtitle: shared.emptySubtitle,
  footerEnd: { alignItems: 'center', paddingVertical: Spacing.xl },
  footerEndText: { fontSize: Typography.fontSize.footnote, color: colors.disabled },
  footerLoading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  footerLoadingText: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary },
  };
};
