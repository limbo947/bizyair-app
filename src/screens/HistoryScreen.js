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
import { StatusBadge } from '../components/StatusBadge';
import { useAppContext } from '../context/AppContext';
import { PAGE_SIZE, TAB_HISTORY } from '../constants/models';

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
  const flatListRef = useRef(null);
  const prevActiveTab = useRef(activeTab);

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
      case 'newest':
        items.sort((a, b) => (parseInt(b.id) || 0) - (parseInt(a.id) || 0));
        break;
      case 'oldest':
        items.sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0));
        break;
      case 'price_high':
        items.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price_low':
        items.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
    }

    return items;
  }, [history, searchText, sortBy, filterBy]);

  const displayedItems = useMemo(() => {
    return filteredHistory.slice(0, visibleCount);
  }, [filteredHistory, visibleCount]);

  const hasMore = visibleCount < filteredHistory.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  }, [hasMore]);

  const handleSearch = useCallback((text) => {
    setSearchText(text);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSortChange = useCallback((key) => {
    setSortBy(key);
    setShowSortPicker(false);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleFilterChange = useCallback((key) => {
    setFilterBy(key);
    setVisibleCount(PAGE_SIZE);
    setBatchMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleDelete = useCallback((id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    persistHistory(updated);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDeleteConfirmId(null);
  }, [history, setHistory, persistHistory]);

  const handleBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    const updated = history.filter((item) => !selectedIds.has(item.id));
    setHistory(updated);
    persistHistory(updated);
    setSelectedIds(new Set());
    setBatchMode(false);
    setDeleteConfirmBatch(false);
  }, [history, setHistory, persistHistory, selectedIds]);

  const handleDownload = useCallback((item) => {
    if (!item.imageUrl) return;
    const filename = `bizyair_${item.id}.jpg`;
    triggerDownload(item.imageUrl, filename);
  }, []);

  const handleBatchDownload = useCallback(async () => {
    const items = history.filter(
      (item) => selectedIds.has(item.id) && item.imageUrl
    );
    if (items.length === 0) return;

    setIsDownloading(true);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const filename = `bizyair_${item.id}.jpg`;
      triggerDownload(item.imageUrl, filename);
      if (i < items.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    setIsDownloading(false);
    setBatchMode(false);
    setSelectedIds(new Set());
  }, [history, selectedIds]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleBatchMode = useCallback(() => {
    setBatchMode((prev) => {
      if (prev) setSelectedIds(new Set());
      return !prev;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = new Set(filteredHistory.map((item) => item.id));
    setSelectedIds(allIds);
  }, [filteredHistory]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const activeCount = history.filter((h) => ACTIVE_STATUSES.includes(h.status)).length;
  const successCount = history.filter((h) => h.status === 'Success').length;
  const failedCount = history.filter((h) => h.status === 'Failed').length;

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedIds.has(item.id);
    const isFinal = FINAL_STATUSES.includes(item.status);
    const duration = isFinal
      ? formatDuration(item.startedAt, item.completedAt)
      : ACTIVE_STATUSES.includes(item.status)
        ? formatDuration(item.startedAt, null)
        : null;

    return (
      <View style={styles.historyCard}>
        {batchMode ? (
          <TouchableOpacity
            style={styles.checkboxArea}
            onPress={() => toggleSelect(item.id)}
            activeOpacity={0.6}
          >
            <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
              {isSelected ? <Text style={styles.checkboxMark}>✓</Text> : null}
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.historyCardInner}
          onPress={() => {
            if (batchMode) {
              toggleSelect(item.id);
            } else if (item.imageUrl) {
              setPreviewImage(item.imageUrl);
            }
          }}
          disabled={batchMode ? false : !item.imageUrl}
          activeOpacity={batchMode ? 0.6 : 0.7}
        >
          <View style={styles.historyThumbWrap}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.historyThumb} resizeMode="cover" />
            ) : (
              <View style={styles.historyThumbPlaceholder}>
                <ActivityIndicator color="#999" />
              </View>
            )}
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.historyPrompt} numberOfLines={2}>
              {item.prompt}
            </Text>
            <Text style={styles.historyMeta}>
              {item.modelName} · {item.actualResolution || item.resolution} · {item.date}
            </Text>
            {duration ? (
              <Text style={styles.historyDuration}>
                ⏱ 用时 {duration}
              </Text>
            ) : null}
            <View style={styles.historyBottomRow}>
              <Text style={styles.historyPrice}>{item.price} 金币</Text>
              <View style={styles.historyActions}>
                {item.imageUrl && !batchMode ? (
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => handleDownload(item)}
                  >
                    <Text style={styles.downloadButtonText}>下载</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={styles.logButton}
                  onPress={() => setLogModal(item)}
                >
                  <Text style={styles.logButtonText}>日志</Text>
                </TouchableOpacity>
                {!batchMode ? (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setDeleteConfirmId(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>删除</Text>
                  </TouchableOpacity>
                ) : null}
                <StatusBadge status={item.status} />
              </View>
            </View>
            {item.status === 'Failed' && item.errorMessage ? (
              <Text style={styles.historyError} numberOfLines={1}>
                {item.errorMessage}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [selectedIds, batchMode, toggleSelect, handleDownload]);

  const renderFooter = useCallback(() => {
    if (!hasMore) {
      if (filteredHistory.length > 0) {
        return (
          <View style={styles.footerEnd}>
            <Text style={styles.footerEndText}>
              已加载全部 {filteredHistory.length} 条记录
            </Text>
          </View>
        );
      }
      return null;
    }
    return (
      <View style={styles.footerLoading}>
        <ActivityIndicator color="#3F51B5" />
        <Text style={styles.footerLoadingText}>加载更多...</Text>
      </View>
    );
  }, [hasMore, filteredHistory.length]);

  const renderEmpty = useCallback(() => {
    if (history.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>暂无历史记录</Text>
          <Text style={styles.emptySubtitle}>开始创作，你的作品将在这里展示</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>未找到匹配记录</Text>
        <Text style={styles.emptySubtitle}>尝试调整搜索条件或筛选器</Text>
      </View>
    );
  }, [history.length]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索提示词、模型名..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#bbb"
          />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.filterChip, filterBy === opt.key && styles.filterChipActive]}
              onPress={() => handleFilterChange(opt.key)}
            >
              <Text style={[styles.filterChipText, filterBy === opt.key && styles.filterChipTextActive]}>
                {opt.label}
                {opt.key === 'all' ? ` (${history.length})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortPicker(true)}
        >
          <Text style={styles.sortButtonIcon}>⇅</Text>
        </TouchableOpacity>
      </View>

      {history.length > 0 ? (
        <View style={styles.batchBar}>
          <TouchableOpacity
            style={[styles.batchToggleButton, batchMode && styles.batchToggleButtonActive]}
            onPress={toggleBatchMode}
          >
            <Text style={[styles.batchToggleText, batchMode && styles.batchToggleTextActive]}>
              {batchMode ? '取消批量' : '批量操作'}
            </Text>
          </TouchableOpacity>

          {batchMode ? (
            <View style={styles.batchActions}>
              <TouchableOpacity style={styles.batchActionButton} onPress={selectAll}>
                <Text style={styles.batchActionText}>全选</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.batchActionButton} onPress={deselectAll}>
                <Text style={styles.batchActionText}>取消</Text>
              </TouchableOpacity>
              <Text style={styles.batchCount}>
                已选 {selectedIds.size}/{history.length}
              </Text>
              <TouchableOpacity
                style={[styles.batchActionButton, styles.batchDeleteButton]}
                onPress={() => setDeleteConfirmBatch(true)}
                disabled={selectedIds.size === 0}
              >
                <Text style={[styles.batchActionText, styles.batchDeleteText]}>
                  删除({selectedIds.size})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.batchActionButton, styles.batchDownloadBtn]}
                onPress={handleBatchDownload}
                disabled={selectedIds.size === 0 || isDownloading}
              >
                <Text style={[styles.batchActionText, styles.batchDownloadText]}>
                  {isDownloading ? '下载中...' : `下载(${selectedIds.size})`}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeCount}</Text>
          <Text style={styles.statLabel}>进行中</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>{successCount}</Text>
          <Text style={styles.statLabel}>已完成</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#f44336' }]}>{failedCount}</Text>
          <Text style={styles.statLabel}>失败</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {history.reduce((sum, h) => sum + (h.price || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>总金币</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={displayedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={selectedIds}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={!!previewImage} transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPreviewImage(null)}>
          <Image source={{ uri: previewImage }} style={styles.modalImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>

      <Modal visible={!!logModal} transparent animationType="fade" onRequestClose={() => setLogModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logModalContent}>
            <View style={styles.logModalHeader}>
              <Text style={styles.logModalTitle}>响应日志</Text>
              <TouchableOpacity onPress={() => setLogModal(null)}>
                <Text style={styles.logModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.logModalScroll}>
              <Text style={styles.logModalText}>
                {logModal?.lastResponse ? JSON.stringify(logModal.lastResponse, null, 2) : '暂无响应信息'}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteConfirmId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmId(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>确认删除</Text>
            <Text style={styles.confirmMessage}>
              确定要删除这条记录吗？此操作不可恢复。
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setDeleteConfirmId(null)}
              >
                <Text style={styles.confirmCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={() => handleDelete(deleteConfirmId)}
              >
                <Text style={styles.confirmDeleteText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteConfirmBatch}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmBatch(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>确认批量删除</Text>
            <Text style={styles.confirmMessage}>
              确定要删除选中的 {selectedIds.size} 条记录吗？此操作不可恢复。
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setDeleteConfirmBatch(false)}
              >
                <Text style={styles.confirmCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleBatchDelete}
              >
                <Text style={styles.confirmDeleteText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSortPicker} transparent animationType="fade" onRequestClose={() => setShowSortPicker(false)}>
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowSortPicker(false)}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>排序方式</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.pickerOption, sortBy === opt.key && styles.pickerOptionActive]}
                onPress={() => handleSortChange(opt.key)}
              >
                <Text style={[styles.pickerOptionText, sortBy === opt.key && styles.pickerOptionTextActive]}>
                  {opt.label}
                </Text>
                {sortBy === opt.key ? <Text style={styles.pickerCheck}>✓</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchBar: { backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, paddingHorizontal: 10, height: 40 },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, color: '#333', paddingVertical: 0 },
  clearSearch: { fontSize: 16, color: '#999', paddingHorizontal: 4 },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterScrollContent: { gap: 6, paddingRight: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#e8e8e8' },
  filterChipActive: { backgroundColor: '#3F51B5', borderColor: '#3F51B5' },
  filterChipText: { fontSize: 12, color: '#666', fontWeight: '500' },
  filterChipTextActive: { color: '#fff', fontWeight: 'bold' },
  sortButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#e8e8e8', marginLeft: 4 },
  sortButtonIcon: { fontSize: 16, color: '#666' },
  batchBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee', gap: 8 },
  batchToggleButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#E8EAF6', borderWidth: 1, borderColor: '#C5CAE9' },
  batchToggleButtonActive: { backgroundColor: '#3F51B5', borderColor: '#3F51B5' },
  batchToggleText: { fontSize: 13, color: '#3F51B5', fontWeight: '600' },
  batchToggleTextActive: { color: '#fff', fontWeight: 'bold' },
  batchActions: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  batchActionButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e8e8e8' },
  batchActionText: { fontSize: 12, color: '#555', fontWeight: '500' },
  batchCount: { fontSize: 12, color: '#333', fontWeight: 'bold', marginHorizontal: 4 },
  batchDeleteButton: { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' },
  batchDeleteText: { color: '#f44336' },
  batchDownloadBtn: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  batchDownloadText: { color: '#2E7D32' },
  statsBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#3F51B5' },
  statLabel: { fontSize: 10, color: '#999', marginTop: 1 },
  statDivider: { width: 1, height: 24, backgroundColor: '#eee' },
  listContent: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 20 },
  historyCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  checkboxArea: { width: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#bbb', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#3F51B5', borderColor: '#3F51B5' },
  checkboxMark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  historyCardInner: { flex: 1, flexDirection: 'row' },
  historyThumbWrap: { width: 90, height: 90 },
  historyThumb: { width: 90, height: 90 },
  historyThumbPlaceholder: { width: 90, height: 90, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  historyInfo: { flex: 1, padding: 10, justifyContent: 'space-between' },
  historyPrompt: { fontSize: 13, color: '#333', fontWeight: '500' },
  historyMeta: { fontSize: 11, color: '#999', marginTop: 3 },
  historyDuration: { fontSize: 11, color: '#8BC34A', marginTop: 2, fontWeight: '500' },
  historyBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 },
  historyPrice: { fontSize: 12, color: '#FF9800', fontWeight: 'bold' },
  historyActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logButton: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#90CAF9' },
  logButtonText: { fontSize: 11, color: '#1976D2', fontWeight: '500' },
  downloadButton: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#C8E6C9' },
  downloadButtonText: { fontSize: 11, color: '#2E7D32', fontWeight: '500' },
  deleteButton: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#FFCDD2' },
  deleteButtonText: { fontSize: 11, color: '#f44336', fontWeight: '500' },
  historyError: { fontSize: 11, color: '#f44336', marginTop: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, color: '#333', fontWeight: 'bold', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#999' },
  footerEnd: { alignItems: 'center', paddingVertical: 16 },
  footerEndText: { fontSize: 13, color: '#bbb' },
  footerLoading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  footerLoadingText: { fontSize: 13, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '100%', height: '80%' },
  logModalContent: { width: '90%', maxHeight: '80%', backgroundColor: '#1e1e1e', borderRadius: 12, overflow: 'hidden' },
  logModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#333' },
  logModalTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  logModalClose: { fontSize: 20, color: '#999', fontWeight: 'bold', paddingHorizontal: 8 },
  logModalScroll: { padding: 14, maxHeight: 500 },
  logModalText: { fontSize: 13, color: '#d4d4d4', fontFamily: 'monospace' },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  pickerContent: { width: '80%', backgroundColor: '#fff', borderRadius: 14, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 10 },
  pickerTitle: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 14, textAlign: 'center' },
  pickerOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 4 },
  pickerOptionActive: { backgroundColor: '#E8EAF6' },
  pickerOptionText: { fontSize: 15, color: '#555' },
  pickerOptionTextActive: { color: '#3F51B5', fontWeight: 'bold' },
  pickerCheck: { fontSize: 18, color: '#3F51B5', fontWeight: 'bold' },
  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  confirmBox: { width: '82%', backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 10 },
  confirmTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12, textAlign: 'center' },
  confirmMessage: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 20, textAlign: 'center' },
  confirmActions: { flexDirection: 'row', gap: 12 },
  confirmCancelButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  confirmCancelText: { fontSize: 16, color: '#666', fontWeight: '600' },
  confirmDeleteButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f44336', alignItems: 'center' },
  confirmDeleteText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});
