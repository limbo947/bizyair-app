import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Platform,
  NativeModules,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useAppContext } from '../context/AppContext';
import { HistoryModals } from '../components/HistoryModals';
import { HistoryFilters } from '../components/HistoryFilters';
import { VideoPlayer } from '../components/VideoPlayer';
import { AudioPlayer } from '../components/AudioPlayer';
import { TextResultView } from '../components/TextResultView';
import { PAGE_SIZE, TAB_HISTORY } from '../constants/models';
import { Colors, Radius, Spacing } from '../constants/theme';

const { AndroidDownloadManager } = NativeModules;

const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];
const FINAL_STATUSES = ['Success', 'Failed'];

const SORT_OPTIONS = [
  { key: 'newest', label: '最新优先' },
  { key: 'oldest', label: '最早优先' },
  { key: 'price_high', label: '价格高→低' },
  { key: 'price_low', label: '价格低→高' },
];

function formatDuration(startedAt, completedAt) {
  if (!startedAt) return '--';
  const end = completedAt || Date.now();
  const ms = end - startedAt;
  if (ms < 0) return '--';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}分${remainSeconds}秒`;
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  return `${hours}时${remainMinutes}分`;
}

function triggerDownload(url, filename) {
  if (Platform.OS === 'web') {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename || 'image.jpg';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } else if (Platform.OS === 'android' && AndroidDownloadManager) {
    AndroidDownloadManager.downloadFile(url, filename || 'image.jpg');
  } else {
    Linking.openURL(url);
  }
}

export function HistoryScreen() {
  const {
    history,
    removeHistoryItems,
    activeTab,
    refreshRunningTasks,
    totalCoinsSpent,
  } = useAppContext();

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewImage, setPreviewImage] = useState(null);
  const [videoPreview, setVideoPreview] = useState({ visible: false, url: null });
  const [audioPreview, setAudioPreview] = useState({ visible: false, url: null });
  const [textPreview, setTextPreview] = useState({ visible: false, text: '' });
  const [logModal, setLogModal] = useState(null);
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [deleteConfirmBatch, setDeleteConfirmBatch] = useState(false);
  const [tick, setTick] = useState(0);
  const flatListRef = useRef(null);
  const prevActiveTab = useRef(activeTab);
  const tickRef = useRef(null);

  const hasActiveTasks = history.some((h) => ACTIVE_STATUSES.includes(h.status));

  useEffect(() => {
    if (hasActiveTasks) {
      tickRef.current = setInterval(() => setTick((t) => t + 1), 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [hasActiveTasks]);

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
    switch (sortBy) {
      case 'newest': items.sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0)); break;
      case 'oldest': items.sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0)); break;
      case 'price_high': items.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'price_low': items.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
    }
    return items;
  }, [history, searchText, sortBy, filterBy]);

  const displayedItems = useMemo(() => filteredHistory.slice(0, visibleCount), [filteredHistory, visibleCount]);
  const hasMore = visibleCount < filteredHistory.length;

  const loadMore = useCallback(() => { if (hasMore) setVisibleCount((prev) => prev + PAGE_SIZE); }, [hasMore]);
  const handleSearch = useCallback((text) => { setSearchText(text); setVisibleCount(PAGE_SIZE); }, []);
  const handleSortChange = useCallback((key) => { setSortBy(key); setShowSortPicker(false); setVisibleCount(PAGE_SIZE); }, []);
  const handleFilterChange = useCallback((key) => { setFilterBy(key); setVisibleCount(PAGE_SIZE); setBatchMode(false); setSelectedIds(new Set()); }, []);

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
    if (isDownloading) return;
    const ext = item.outputType === 'video' ? '.mp4' : item.outputType === 'audio' ? `.${item.responseFormat || 'mp3'}` : '.jpg';
    const url = item.videoUrl || item.audioUrl || item.imageUrl;
    if (!url) return;
    triggerDownload(url, `bizyair_${item.id}${ext}`);
  }, [isDownloading]);

  const handleBatchDownload = useCallback(async () => {
    const items = history.filter((item) => selectedIds.has(item.id) && (item.imageUrl || item.videoUrl || item.audioUrl));
    if (items.length === 0) return;
    setIsDownloading(true);
    for (let i = 0; i < items.length; i++) {
      const url = items[i].videoUrl || items[i].audioUrl || items[i].imageUrl;
      const ext = items[i].outputType === 'video' ? '.mp4' : items[i].outputType === 'audio' ? `.${items[i].responseFormat || 'mp3'}` : '.jpg';
      triggerDownload(url, `bizyair_${items[i].id}${ext}`);
      if (i < items.length - 1) await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setIsDownloading(false); setBatchMode(false); setSelectedIds(new Set());
  }, [history, selectedIds]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const toggleBatchMode = useCallback(() => {
    setBatchMode((prev) => { if (prev) setSelectedIds(new Set()); return !prev; });
  }, []);

  const selectAll = useCallback(() => { setSelectedIds(new Set(filteredHistory.map((item) => item.id))); }, [filteredHistory]);
  const deselectAll = useCallback(() => { setSelectedIds(new Set()); }, []);

  const activeCount = history.filter((h) => ACTIVE_STATUSES.includes(h.status)).length;
  const successCount = history.filter((h) => h.status === 'Success').length;
  const failedCount = history.filter((h) => h.status === 'Failed').length;

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedIds.has(item.id);
    const isFinal = FINAL_STATUSES.includes(item.status);
    const duration = isFinal ? formatDuration(item.startedAt, item.completedAt) : ACTIVE_STATUSES.includes(item.status) ? formatDuration(item.startedAt, null) : null;

    return (
      <View style={styles.historyCard}>
        {batchMode ? (
          <TouchableOpacity style={styles.checkboxArea} onPress={() => toggleSelect(item.id)} activeOpacity={0.6}>
            <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
              {isSelected ? <Text style={styles.checkboxMark}>✓</Text> : null}
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.historyCardInner}
          onPress={() => {
            if (batchMode) toggleSelect(item.id);
            else if (item.outputType === 'video' && item.videoUrl) {
              setVideoPreview({ visible: true, url: item.videoUrl });
            } else if (item.outputType === 'text' && item.textResult) {
              setTextPreview({ visible: true, text: item.textResult });
            } else if (item.outputType === 'audio' && item.audioUrl) {
              setAudioPreview({ visible: true, url: item.audioUrl });
            } else if (item.imageUrl) setPreviewImage({ url: item.imageUrl, prompt: item.prompt });
          }}
          disabled={batchMode ? false : !(item.imageUrl || item.videoUrl || item.textResult || item.audioUrl)}
          activeOpacity={batchMode ? 0.6 : 0.7}
        >
          <View style={styles.historyThumbWrap}>
            {item.outputType === 'video' && item.videoUrl ? (
              <View style={[styles.historyThumbPlaceholder, styles.historyThumbVideo]}>
                <Ionicons name="videocam" size={32} color={Colors.primary} />
              </View>
            ) : item.outputType === 'audio' && item.audioUrl ? (
              <View style={[styles.historyThumbPlaceholder, styles.historyThumbAudio]}>
                <Ionicons name="musical-notes" size={32} color={Colors.purple} />
              </View>
            ) : item.outputType === 'text' && item.textResult ? (
              <View style={[styles.historyThumbPlaceholder, styles.historyThumbText]}>
                <Ionicons name="document-text" size={32} color={Colors.primary} />
              </View>
            ) : item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.historyThumb} />
            ) : item.status === 'Failed' ? (
              <View style={[styles.historyThumbPlaceholder, styles.historyThumbFailed]}>
                <Ionicons name="close-circle-outline" size={32} color={Colors.error} />
              </View>
            ) : (
              <View style={styles.historyThumbPlaceholder}>
                <ActivityIndicator color={Colors.textTertiary} />
              </View>
            )}
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.historyPrompt} numberOfLines={2}>{item.prompt}</Text>
            <Text style={styles.historyMeta}>{item.modelName} · {item.actualResolution || item.resolution} · {item.date}</Text>
            {duration ? <Text style={styles.historyDuration}>⏱ 用时 {duration}</Text> : null}
            <View style={styles.historyBottomRow}>
              <Text style={styles.historyPrice}>{item.price} 金币</Text>
              <View style={styles.historyActions}>
                {((item.imageUrl && !batchMode) || (item.outputType === 'video' && item.videoUrl && !batchMode) || (item.outputType === 'audio' && item.audioUrl && !batchMode)) ? (
                  <TouchableOpacity style={[styles.iconButton, styles.iconButtonSuccess]} onPress={() => handleDownload(item)}>
                    <Ionicons name="download" size={18} color={Colors.success} />
                  </TouchableOpacity>
                ) : null}
                {!batchMode ? (
                  <TouchableOpacity style={[styles.iconButton, styles.iconButtonPurple]} onPress={async () => {
                    await Clipboard.setStringAsync(item.prompt || '');
                  }}>
                    <Ionicons name="copy" size={18} color={Colors.purple} />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={[styles.iconButton, styles.iconButtonPrimary]} onPress={() => setLogModal(item)}>
                  <Ionicons name="document-text" size={18} color={Colors.primary} />
                </TouchableOpacity>
                {!batchMode ? (
                  <TouchableOpacity style={[styles.iconButton, styles.iconButtonError]} onPress={() => setDeleteConfirmId(item.id)}>
                    <Ionicons name="trash" size={18} color={Colors.error} />
                  </TouchableOpacity>
                ) : null}
                {item.status === 'Pending' ? (
                  <View style={[styles.iconButton, styles.iconButtonWarning]}>
                    <Ionicons name="time" size={16} color={Colors.warning} />
                  </View>
                ) : item.status === 'Running' ? (
                  <View style={[styles.iconButton, styles.iconButtonRunning]}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                  </View>
                ) : item.status === 'Saving' ? (
                  <View style={[styles.iconButton, styles.iconButtonPurple]}>
                    <Ionicons name="cloud-upload" size={16} color={Colors.purple} />
                  </View>
                ) : item.status === 'Success' ? (
                  <View style={[styles.iconButton, styles.iconButtonSuccess]}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  </View>
                ) : (
                  <View style={[styles.iconButton, styles.iconButtonError]}>
                    <Ionicons name="close-circle" size={16} color={Colors.error} />
                  </View>
                )}
              </View>
            </View>
            {item.status === 'Failed' && item.errorMessage ? (
              <Text style={styles.historyError} numberOfLines={1}>{item.errorMessage}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [selectedIds, batchMode, toggleSelect, handleDownload]);

  const renderFooter = useCallback(() => {
    if (!hasMore) {
      if (filteredHistory.length > 0) return <View style={styles.footerEnd}><Text style={styles.footerEndText}>已加载全部 {filteredHistory.length} 条记录</Text></View>;
      return null;
    }
    return <View style={styles.footerLoading}><ActivityIndicator color={Colors.primary} /><Text style={styles.footerLoadingText}>加载更多...</Text></View>;
  }, [hasMore, filteredHistory.length]);

  const renderEmpty = useCallback(() => {
    if (history.length === 0) return <View style={styles.emptyContainer}><Text style={styles.emptyIcon}>📭</Text><Text style={styles.emptyTitle}>暂无历史记录</Text><Text style={styles.emptySubtitle}>开始创作，你的作品将在这里展示</Text></View>;
    return <View style={styles.emptyContainer}><Text style={styles.emptyIcon}>🔍</Text><Text style={styles.emptyTitle}>未找到匹配记录</Text><Text style={styles.emptySubtitle}>尝试调整搜索条件或筛选器</Text></View>;
  }, [history.length]);

  return (
    <View style={styles.container}>
      <HistoryFilters
        history={history}
        searchText={searchText}
        filterBy={filterBy}
        sortBy={sortBy}
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
        onToggleBatchMode={toggleBatchMode}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
        onBatchDeletePress={() => setDeleteConfirmBatch(true)}
        onBatchDownload={handleBatchDownload}
      />

      <FlatList ref={flatListRef} data={displayedItems} keyExtractor={(item) => item.id} renderItem={renderItem} extraData={{ selectedIds, tick }} ListEmptyComponent={renderEmpty} ListFooterComponent={renderFooter} onEndReached={loadMore} onEndReachedThreshold={0.3} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

      <HistoryModals
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  listContent: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  historyCard: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.xs, marginBottom: Spacing.sm, overflow: 'hidden' },
  checkboxArea: { width: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
  checkbox: { width: 22, height: 22, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.disabled, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkboxMark: { color: Colors.textInverse, fontSize: 14, fontWeight: '600' },
  historyCardInner: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  historyThumbWrap: { marginLeft: 6, marginVertical: 6, width: 88 },
  historyThumb: { width: '100%', flex: 1, resizeMode: 'cover', borderRadius: Radius.xs },
  historyThumbPlaceholder: { flex: 1, width: '100%', backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  historyThumbFailed: { backgroundColor: Colors.errorBg },
  historyThumbVideo: { backgroundColor: Colors.primaryBg },
  historyThumbAudio: { backgroundColor: Colors.purpleBg },
  historyThumbText: { backgroundColor: Colors.primaryBg },
  historyInfo: { flex: 1, padding: Spacing.md, justifyContent: 'space-between', alignSelf: 'center' },
  historyPrompt: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', lineHeight: 18 },
  historyMeta: { fontSize: 12, color: Colors.textTertiary, marginTop: 3 },
  historyDuration: { fontSize: 12, color: Colors.success, marginTop: 2, fontWeight: '500' },
  historyBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  historyPrice: { fontSize: 13, color: Colors.warning, fontWeight: '700' },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { width: 28, height: 28, borderRadius: Radius.xs, alignItems: 'center', justifyContent: 'center' },
  iconButtonSuccess: { backgroundColor: Colors.successBg },
  iconButtonPurple: { backgroundColor: Colors.purpleBg },
  iconButtonPrimary: { backgroundColor: Colors.primaryBg },
  iconButtonError: { backgroundColor: Colors.errorBg },
  iconButtonWarning: { backgroundColor: Colors.warningBg },
  iconButtonRunning: { backgroundColor: Colors.primaryBg },
  historyError: { fontSize: 11, color: Colors.error, marginTop: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.textTertiary },
  footerEnd: { alignItems: 'center', paddingVertical: Spacing.xl },
  footerEndText: { fontSize: 13, color: Colors.disabled },
  footerLoading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  footerLoadingText: { fontSize: 13, color: Colors.textTertiary },
});
