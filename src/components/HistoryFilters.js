import React from 'react';
import { View, TouchableOpacity, Text, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

const FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'image', label: '图片' },
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' },
  { key: 'text', label: '文本' },
];

const createStyles = (colors) => ({
  searchBar: { backgroundColor: colors.card, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: Radius.sm, paddingHorizontal: Spacing.md, height: 40, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: 0 },
  clearSearch: { fontSize: 16, color: colors.textTertiary, paddingHorizontal: 4 },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  filterScrollContent: { gap: Spacing.sm, paddingRight: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: colors.bg },
  filterChipActive: { backgroundColor: colors.primary },
  filterChipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  filterChipTextActive: { color: colors.textInverse, fontWeight: '600' },
  sortButton: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, marginLeft: 4 },
  batchBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator, gap: Spacing.sm },
  batchToggleButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: colors.primaryBg },
  batchToggleButtonActive: { backgroundColor: colors.primary },
  batchToggleText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  batchToggleTextActive: { color: colors.textInverse, fontWeight: '600' },
  batchActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  batchActionButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: colors.bg },
  batchActionText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  batchCount: { fontSize: 12, color: colors.textPrimary, fontWeight: '600', marginHorizontal: 4 },
  batchDeleteButton: { backgroundColor: colors.errorBg },
  batchDeleteText: { color: colors.error },
  batchDownloadBtn: { backgroundColor: colors.successBg },
  batchDownloadText: { color: colors.success },
  statsBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 17, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textTertiary, marginTop: 2 },
  statDivider: { width: 0.5, height: 24, backgroundColor: colors.separator },
});

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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View>
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="搜索提示词、模型名..." value={searchText} onChangeText={onSearchChange} placeholderTextColor={colors.textPlaceholder} />
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
          <Ionicons name="funnel-outline" size={18} color={colors.textSecondary} />
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
        <View style={styles.statItem}><Text style={[styles.statValue, { color: colors.success }]}>{successCount}</Text><Text style={styles.statLabel}>已完成</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: colors.error }]}>{failedCount}</Text><Text style={styles.statLabel}>失败</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: colors.warning }]}>{totalCoinsSpent}</Text><Text style={styles.statLabel}>总金币</Text></View>
      </View>
    </View>
  );
}
