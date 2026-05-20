import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { StatusBadge } from '../components/StatusBadge';
import { useAppContext } from '../context/AppContext';
import { PAGE_SIZE, TAB_HISTORY } from '../constants/models';
import { Colors, Shadows, Radius, Spacing } from '../constants/theme';

const ACTIVE_STATUSES = ['Pending', 'Running', 'Saving'];
const FINAL_STATUSES = ['Success', 'Failed'];

const SORT_OPTIONS = [
  { key: 'newest', label: '最新优先' },
  { key: 'oldest', label: '最早优先' },
  { key: 'price_high', label: '价格高→低' },
  { key: 'price_low', label: '价格低→高' },
];

const FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'Pending', label: '排队中' },
  { key: 'Running', label: '生成中' },
  { key: 'Saving', label: '转存中' },
  { key: 'Success', label: '已完成' },
  { key: 'Failed', label: '失败' },
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
  } else {
    const { Linking } = require('react-native');
    Linking.openURL(url);
  }
}

export function HistoryScreen() {
  const {
    history,
    setHistory,
    persistHistory,
    activeTab,
    refreshRunningTasks,
  } = useAppContext();

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewImage, setPreviewImage] = useState(null);
  const [logModal, setLogModal] = useState(null);
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [deleteConfirmBatch, setDeleteConfirmBatch] = useState(false);
  const [copied, setCopied] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);
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
      items = items.filter((item) => item.status === filterBy);
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
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated); persistHistory(updated);
    setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    setDeleteConfirmId(null);
  }, [history, setHistory, persistHistory]);

  const handleBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    const updated = history.filter((item) => !selectedIds.has(item.id));
    setHistory(updated); persistHistory(updated);
    setSelectedIds(new Set()); setBatchMode(false); setDeleteConfirmBatch(false);
  }, [history, setHistory, persistHistory, selectedIds]);

  const handleDownload = useCallback((item) => {
    if (!item.imageUrl) return;
    triggerDownload(item.imageUrl, `bizyair_${item.id}.jpg`);
  }, []);

  const handleBatchDownload = useCallback(async () => {
    const items = history.filter((item) => selectedIds.has(item.id) && item.imageUrl);
    if (items.length === 0) return;
    setIsDownloading(true);
    for (let i = 0; i < items.length; i++) {
      triggerDownload(items[i].imageUrl, `bizyair_${items[i].id}.jpg`);
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
          onPress={() => { if (batchMode) toggleSelect(item.id); else if (item.imageUrl) setPreviewImage({ url: item.imageUrl, prompt: item.prompt }); }}
          disabled={batchMode ? false : !item.imageUrl}
          activeOpacity={batchMode ? 0.6 : 0.7}
        >
          <View style={styles.historyThumbWrap}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.historyThumb} />
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
                {item.imageUrl && !batchMode ? (
                  <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(item)}>
                    <Ionicons name="download-outline" size={14} color={Colors.success} />
                    <Text style={styles.downloadButtonText}>下载</Text>
                  </TouchableOpacity>
                ) : null}
                {!batchMode ? (
                  <TouchableOpacity style={styles.copyPromptButton} onPress={async () => {
                    await Clipboard.setStringAsync(item.prompt || '');
                    setCopied(item.id);
                    setToastMsg('已复制');
                    if (toastTimer.current) clearTimeout(toastTimer.current);
                    toastTimer.current = setTimeout(() => { setCopied(null); setToastMsg(''); }, 2000);
                  }}>
                    <Ionicons name={copied === item.id ? 'checkmark-circle' : 'copy-outline'} size={14} color={copied === item.id ? Colors.success : Colors.purple} />
                    <Text style={[styles.copyPromptButtonText, copied === item.id && { color: Colors.success }]}>{copied === item.id ? '已复制' : '复制'}</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.logButton} onPress={() => setLogModal(item)}>
                  <Ionicons name="document-text-outline" size={14} color={Colors.primary} />
                  <Text style={styles.logButtonText}>日志</Text>
                </TouchableOpacity>
                {!batchMode ? (
                  <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteConfirmId(item.id)}>
                    <Ionicons name="trash-outline" size={14} color={Colors.error} />
                    <Text style={styles.deleteButtonText}>删除</Text>
                  </TouchableOpacity>
                ) : null}
                <StatusBadge status={item.status} />
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
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search-outline" size={18} color={Colors.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="搜索提示词、模型名..." value={searchText} onChangeText={handleSearch} placeholderTextColor={Colors.textPlaceholder} />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={() => handleSearch('')}><Text style={styles.clearSearch}>✕</Text></TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.key} style={[styles.filterChip, filterBy === opt.key && styles.filterChipActive]} onPress={() => handleFilterChange(opt.key)}>
              <Text style={[styles.filterChipText, filterBy === opt.key && styles.filterChipTextActive]}>{opt.label}{opt.key === 'all' ? ` (${history.length})` : ''}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortPicker(true)}>
          <Ionicons name="swap-vertical-outline" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {history.length > 0 ? (
        <View style={styles.batchBar}>
          <TouchableOpacity style={[styles.batchToggleButton, batchMode && styles.batchToggleButtonActive]} onPress={toggleBatchMode}>
            <Text style={[styles.batchToggleText, batchMode && styles.batchToggleTextActive]}>{batchMode ? '取消批量' : '批量操作'}</Text>
          </TouchableOpacity>
          {batchMode ? (
            <View style={styles.batchActions}>
              <TouchableOpacity style={styles.batchActionButton} onPress={selectAll}><Text style={styles.batchActionText}>全选</Text></TouchableOpacity>
              <TouchableOpacity style={styles.batchActionButton} onPress={deselectAll}><Text style={styles.batchActionText}>取消</Text></TouchableOpacity>
              <Text style={styles.batchCount}>已选 {selectedIds.size}/{history.length}</Text>
              <TouchableOpacity style={[styles.batchActionButton, styles.batchDeleteButton]} onPress={() => setDeleteConfirmBatch(true)} disabled={selectedIds.size === 0}>
                <Text style={[styles.batchActionText, styles.batchDeleteText]}>删除({selectedIds.size})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.batchActionButton, styles.batchDownloadBtn]} onPress={handleBatchDownload} disabled={selectedIds.size === 0 || isDownloading}>
                <Text style={[styles.batchActionText, styles.batchDownloadText]}>{isDownloading ? '下载中...' : `下载(${selectedIds.size})`}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.statsBar}>
        <View style={styles.statItem}><Text style={styles.statValue}>{activeCount}</Text><Text style={styles.statLabel}>进行中</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: Colors.success }]}>{successCount}</Text><Text style={styles.statLabel}>已完成</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: Colors.error }]}>{failedCount}</Text><Text style={styles.statLabel}>失败</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: Colors.warning }]}>{history.reduce((sum, h) => sum + (h.price || 0), 0)}</Text><Text style={styles.statLabel}>总金币</Text></View>
      </View>

      <FlatList ref={flatListRef} data={displayedItems} keyExtractor={(item) => item.id} renderItem={renderItem} extraData={{ selectedIds, tick }} ListEmptyComponent={renderEmpty} ListFooterComponent={renderFooter} onEndReached={loadMore} onEndReachedThreshold={0.3} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />

      <Modal visible={!!previewImage} transparent animationType="fade" onRequestClose={() => { setPreviewImage(null); }}>
        <TouchableOpacity
          style={styles.previewOverlay}
          activeOpacity={1}
          onPress={() => setPreviewImage(null)}
        >
          <Image source={{ uri: previewImage?.url }} style={styles.modalImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>

      <Modal visible={!!logModal} transparent animationType="fade" onRequestClose={() => setLogModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logModalContent}>
            <View style={styles.logModalHeader}>
              <Text style={styles.logModalTitle}>响应日志</Text>
              <TouchableOpacity onPress={() => setLogModal(null)}><Text style={styles.logModalClose}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={styles.logModalScroll}>
              <Text style={styles.logModalText}>{logModal?.lastResponse ? JSON.stringify(logModal.lastResponse, null, 2) : '暂无响应信息'}</Text>
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
              <TouchableOpacity style={styles.confirmCancelButton} onPress={() => setDeleteConfirmId(null)}><Text style={styles.confirmCancelText}>取消</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteButton} onPress={() => handleDelete(deleteConfirmId)}><Text style={styles.confirmDeleteText}>删除</Text></TouchableOpacity>
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
              <TouchableOpacity style={styles.confirmCancelButton} onPress={() => setDeleteConfirmBatch(false)}><Text style={styles.confirmCancelText}>取消</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteButton} onPress={handleBatchDelete}><Text style={styles.confirmDeleteText}>删除</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSortPicker} transparent animationType="fade" onRequestClose={() => setShowSortPicker(false)}>
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowSortPicker(false)}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>排序方式</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity key={opt.key} style={[styles.pickerOption, sortBy === opt.key && styles.pickerOptionActive]} onPress={() => handleSortChange(opt.key)}>
                <Text style={[styles.pickerOptionText, sortBy === opt.key && styles.pickerOptionTextActive]}>{opt.label}</Text>
                {sortBy === opt.key ? <Text style={styles.pickerCheck}>✓</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {toastMsg ? (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.textInverse} />
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  searchBar: { backgroundColor: Colors.card, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, height: 40, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, paddingVertical: 0 },
  clearSearch: { fontSize: 16, color: Colors.textTertiary, paddingHorizontal: 4 },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  filterScrollContent: { gap: Spacing.sm, paddingRight: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.bg },
  filterChipActive: { backgroundColor: Colors.primary, ...Shadows.sm },
  filterChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  filterChipTextActive: { color: Colors.textInverse, fontWeight: '600' },
  sortButton: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, marginLeft: 4 },
  batchBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: Colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.separator, gap: Spacing.sm },
  batchToggleButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.primaryBg },
  batchToggleButtonActive: { backgroundColor: Colors.primary, ...Shadows.sm },
  batchToggleText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  batchToggleTextActive: { color: Colors.textInverse, fontWeight: '600' },
  batchActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  batchActionButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.bg },
  batchActionText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  batchCount: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600', marginHorizontal: 4 },
  batchDeleteButton: { backgroundColor: Colors.errorBg },
  batchDeleteText: { color: Colors.error },
  batchDownloadBtn: { backgroundColor: Colors.successBg },
  batchDownloadText: { color: Colors.success },
  statsBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 17, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 10, color: Colors.textTertiary, marginTop: 2 },
  statDivider: { width: 0.5, height: 24, backgroundColor: Colors.separator },
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  historyCard: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.md, marginBottom: Spacing.sm, overflow: 'hidden', ...Shadows.sm },
  checkboxArea: { width: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
  checkbox: { width: 22, height: 22, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.disabled, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkboxMark: { color: Colors.textInverse, fontSize: 14, fontWeight: '600' },
  historyCardInner: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  historyThumbWrap: { width: 88, height: 88, marginLeft: 5 },
  historyThumb: { width: 88, height: 88, resizeMode: 'contain' },
  historyThumbPlaceholder: { width: 88, height: 88, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  historyInfo: { flex: 1, padding: Spacing.md, justifyContent: 'space-between' },
  historyPrompt: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', lineHeight: 18 },
  historyMeta: { fontSize: 12, color: Colors.textTertiary, marginTop: 3 },
  historyDuration: { fontSize: 12, color: Colors.success, marginTop: 2, fontWeight: '500' },
  historyBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  historyPrice: { fontSize: 13, color: Colors.warning, fontWeight: '700' },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  downloadButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.successBg, gap: 2 },
  downloadButtonText: { fontSize: 11, color: Colors.success, fontWeight: '500' },
  copyPromptButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.purpleBg, gap: 2 },
  copyPromptButtonText: { fontSize: 11, color: Colors.purple, fontWeight: '500' },
  logButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.primaryBg, gap: 2 },
  logButtonText: { fontSize: 11, color: Colors.primary, fontWeight: '500' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.errorBg, gap: 2 },
  deleteButtonText: { fontSize: 11, color: Colors.error, fontWeight: '500' },
  historyError: { fontSize: 11, color: Colors.error, marginTop: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.textTertiary },
  footerEnd: { alignItems: 'center', paddingVertical: Spacing.xl },
  footerEndText: { fontSize: 13, color: Colors.disabled },
  footerLoading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  footerLoadingText: { fontSize: 13, color: Colors.textTertiary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '100%', height: '80%' },
  previewOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  logModalContent: { width: '90%', maxHeight: '80%', backgroundColor: '#1C1C1E', borderRadius: Radius.lg, overflow: 'hidden' },
  logModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 0.5, borderBottomColor: '#38383A' },
  logModalTitle: { fontSize: 17, fontWeight: '600', color: Colors.textInverse },
  logModalClose: { fontSize: 20, color: Colors.textTertiary, fontWeight: '600', paddingHorizontal: 8 },
  logModalScroll: { padding: Spacing.lg, maxHeight: 500 },
  logModalText: { fontSize: 13, color: '#98989D', fontFamily: 'monospace' },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  pickerContent: { width: '80%', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.xl },
  pickerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.lg, textAlign: 'center' },
  pickerOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: Spacing.lg, borderRadius: Radius.sm, marginBottom: 2 },
  pickerOptionActive: { backgroundColor: Colors.primaryBg },
  pickerOptionText: { fontSize: 16, color: Colors.textSecondary },
  pickerOptionTextActive: { color: Colors.primary, fontWeight: '600' },
  pickerCheck: { fontSize: 18, color: Colors.primary, fontWeight: '600' },
  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  confirmBox: { width: '82%', backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.xxl },
  confirmTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' },
  confirmMessage: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl, textAlign: 'center' },
  confirmActions: { flexDirection: 'row', gap: Spacing.md },
  confirmCancelButton: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Colors.bg, alignItems: 'center' },
  confirmCancelText: { fontSize: 17, color: Colors.primary, fontWeight: '600' },
  confirmDeleteButton: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Colors.error, alignItems: 'center' },
  confirmDeleteText: { fontSize: 17, color: Colors.textInverse, fontWeight: '600' },
  toast: { position: 'absolute', bottom: 100, left: '50%', transform: [{ translateX: -70 }], flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: 'rgba(28,28,30,0.88)', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: Radius.full, ...Shadows.lg },
  toastText: { color: Colors.textInverse, fontSize: 14, fontWeight: '600' },
});
