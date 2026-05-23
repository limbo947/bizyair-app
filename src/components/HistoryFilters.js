import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../constants/theme';

const FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'image', label: '图片' },
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' },
  { key: 'text', label: '文本' },
];

export function HistoryFilters({
  history,
  searchText,
  filterBy,
  sortBy,
  batchMode,
  selectedIds,
  isDownloading,
  activeCount,
  successCount,
  failedCount,
  totalCoinsSpent,
  onSearchChange,
  onFilterChange,
  onSortPress,
  onToggleBatchMode,
  onSelectAll,
  onDeselectAll,
  onBatchDeletePress,
  onBatchDownload,
}) {
  return (
    <View>
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="搜索提示词、模型名..." value={searchText} onChangeText={onSearchChange} placeholderTextColor={Colors.textPlaceholder} />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={() => onSearchChange('')}><Text style={styles.clearSearch}>✕</Text></TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.key} style={[styles.filterChip, filterBy === opt.key && styles.filterChipActive]} onPress={() => onFilterChange(opt.key)}>
              <Text style={[styles.filterChipText, filterBy === opt.key && styles.filterChipTextActive]}>{opt.label}{opt.key === 'all' ? ` (${history.length})` : ''}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
          <Ionicons name="funnel-outline" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {history.length > 0 ? (
        <View style={styles.batchBar}>
          <TouchableOpacity style={[styles.batchToggleButton, batchMode && styles.batchToggleButtonActive]} onPress={onToggleBatchMode}>
            <Text style={[styles.batchToggleText, batchMode && styles.batchToggleTextActive]}>{batchMode ? '取消批量' : '批量操作'}</Text>
          </TouchableOpacity>
          {batchMode ? (
            <View style={styles.batchActions}>
              <TouchableOpacity style={styles.batchActionButton} onPress={onSelectAll}><Text style={styles.batchActionText}>全选</Text></TouchableOpacity>
              <TouchableOpacity style={styles.batchActionButton} onPress={onDeselectAll}><Text style={styles.batchActionText}>取消</Text></TouchableOpacity>
              <Text style={styles.batchCount}>已选 {selectedIds.size}/{history.length}</Text>
              <TouchableOpacity style={[styles.batchActionButton, styles.batchDeleteButton]} onPress={onBatchDeletePress} disabled={selectedIds.size === 0}>
                <Text style={[styles.batchActionText, styles.batchDeleteText]}>删除({selectedIds.size})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.batchActionButton, styles.batchDownloadBtn]} onPress={onBatchDownload} disabled={selectedIds.size === 0 || isDownloading}>
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
        <View style={styles.statItem}><Text style={[styles.statValue, { color: Colors.warning }]}>{totalCoinsSpent}</Text><Text style={styles.statLabel}>总金币</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: { backgroundColor: Colors.card, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, height: 40, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, paddingVertical: 0 },
  clearSearch: { fontSize: 16, color: Colors.textTertiary, paddingHorizontal: 4 },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  filterScrollContent: { gap: Spacing.sm, paddingRight: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.bg },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  filterChipTextActive: { color: Colors.textInverse, fontWeight: '600' },
  sortButton: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, marginLeft: 4 },
  batchBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: Colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: Colors.separator, gap: Spacing.sm },
  batchToggleButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.primaryBg },
  batchToggleButtonActive: { backgroundColor: Colors.primary },
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
});
