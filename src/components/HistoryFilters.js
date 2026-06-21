import React, { useState } from 'react';
import { Pressable, View, Text, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography, pressedOpacity } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { PickerModal } from './common/PickerModal';

const FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'image', label: '图片' },
  { key: 'video', label: '视频' },
  { key: 'audio', label: '音频' },
  { key: 'text', label: '文本' },
];

const SOURCE_OPTIONS = [
  { key: 'all', label: '全部来源' },
  { key: 'model', label: '模型' },
  { key: 'webapp', label: 'AI应用' },
];

const createStyles = (colors) => ({
  searchBar: { backgroundColor: colors.card, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.md, height: 40, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, paddingVertical: 0 },
  clearSearch: { fontSize: Typography.fontSize.callout, color: colors.textTertiary, width: 28, height: 28, textAlign: 'center', textAlignVertical: 'center' },
  filterBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  filterScrollContent: { gap: Spacing.sm, paddingRight: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 1, borderRadius: Radius.full, borderCurve: 'continuous', backgroundColor: colors.bg },
  filterChipActive: { backgroundColor: colors.primary },
  filterChipText: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  filterChipTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  allChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 1, borderRadius: Radius.full, borderCurve: 'continuous', backgroundColor: colors.bg, gap: Spacing.xs },
  allChipActive: { backgroundColor: colors.primary },
  allChipText: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  allChipTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  allChipBadge: { fontSize: 10, color: colors.textTertiary, fontWeight: Typography.fontWeight.medium },
  allChipBadgeActive: { color: colors.textOnOverlay, fontWeight: Typography.fontWeight.semibold },
  allChipCaret: { marginTop: 1 },
  sortButton: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, marginLeft: Spacing.xs },
  batchBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: colors.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator, gap: Spacing.sm },
  batchToggleButton: { paddingHorizontal: Spacing.md + 2, paddingVertical: Spacing.xs + 2, borderRadius: Radius.full, borderCurve: 'continuous', backgroundColor: colors.primaryBg },
  batchToggleButtonActive: { backgroundColor: colors.primary },
  batchToggleText: { fontSize: Typography.fontSize.footnote, color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  batchToggleTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  batchActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  batchActionButton: { paddingHorizontal: Spacing.sm + 2, paddingVertical: Spacing.xs + 1, borderRadius: Radius.full, borderCurve: 'continuous', backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  batchActionText: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary, fontWeight: Typography.fontWeight.medium },
  batchCount: { fontSize: Typography.fontSize.caption1, color: colors.textPrimary, fontWeight: Typography.fontWeight.semibold, marginHorizontal: Spacing.xs },
  batchDeleteButton: { backgroundColor: colors.errorBg },
  batchDeleteText: { color: colors.error },
  batchDownloadBtn: { backgroundColor: colors.successBg },
  batchDownloadText: { color: colors.success },
  statsBar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', backgroundColor: colors.card, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs + 1, borderBottomWidth: 0.5, borderBottomColor: colors.separator, gap: Spacing.xs },
  statSummary: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary },
  statSummaryActive: { color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  statSummarySuccess: { color: colors.success, fontWeight: Typography.fontWeight.semibold },
  statSummaryError: { color: colors.error, fontWeight: Typography.fontWeight.semibold },
  statSummaryWarning: { color: colors.warning, fontWeight: Typography.fontWeight.semibold },
  statDivider: { fontSize: Typography.fontSize.caption1, color: colors.disabled },
});

export function HistoryFilters({
  topInset,
  history,
  filteredCount,
  searchText,
  filterBy,
  sortBy,
  sourceFilter,
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
  onSourceFilterChange,
  onToggleBatchMode,
  onSelectAll,
  onDeselectAll,
  onBatchDeletePress,
  onBatchDownload,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [showSourcePicker, setShowSourcePicker] = useState(false);

  const sourceLabel = sourceFilter === 'model' ? '模型' : sourceFilter === 'webapp' ? 'AI应用' : '';
  const isAllActive = filterBy === 'all';

  return (
    <View>
      <View style={[styles.searchBar, { paddingTop: Spacing.md + (topInset || 0) }]}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput style={styles.searchInput} placeholder="搜索提示词、模型、模式..." value={searchText} onChangeText={onSearchChange} placeholderTextColor={colors.textPlaceholder} />
          {searchText.length > 0 ? (
            <Pressable hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={({ pressed }) => pressed && pressedOpacity()} onPress={() => onSearchChange('')}><Text style={styles.clearSearch}>✕</Text></Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
          <Pressable
            style={({ pressed }) => [
              styles.allChip,
              isAllActive && styles.allChipActive,
              pressed && pressedOpacity(),
            ]}
            onPress={() => {
              if (isAllActive) {
                setShowSourcePicker(true);
              } else {
                onFilterChange('all');
              }
            }}
          >
            <Text style={[styles.allChipText, isAllActive && styles.allChipTextActive]}>
              全部{sourceLabel ? `(${sourceLabel})` : ''} ({history.length})
            </Text>
            <Ionicons
              name="chevron-down"
              size={12}
              color={isAllActive ? colors.textInverse : colors.textTertiary}
              style={styles.allChipCaret}
            />
          </Pressable>
          {FILTER_OPTIONS.filter(o => o.key !== 'all').map((opt) => (
            <Pressable key={opt.key} style={({ pressed }) => [styles.filterChip, filterBy === opt.key && styles.filterChipActive, pressed && pressedOpacity()]} onPress={() => onFilterChange(opt.key)}>
              <Text style={[styles.filterChipText, filterBy === opt.key && styles.filterChipTextActive]}>{opt.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Pressable style={({ pressed }) => [styles.sortButton, pressed && pressedOpacity()]} onPress={onSortPress}>
          <Ionicons name="swap-vertical" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <PickerModal
        visible={showSourcePicker}
        onClose={() => setShowSourcePicker(false)}
        title="来源筛选"
        options={SOURCE_OPTIONS}
        selectedKey={sourceFilter}
        onSelect={onSourceFilterChange}
      />

      {history.length > 0 ? (
        <View style={styles.batchBar}>
          <Pressable style={({ pressed }) => [styles.batchToggleButton, batchMode && styles.batchToggleButtonActive, pressed && pressedOpacity()]} onPress={onToggleBatchMode}>
            <Text style={[styles.batchToggleText, batchMode && styles.batchToggleTextActive]}>{batchMode ? '取消批量' : '批量操作'}</Text>
          </Pressable>
          {batchMode ? (
            <View style={styles.batchActions}>
              <Pressable style={({ pressed }) => [styles.batchActionButton, pressed && pressedOpacity()]} onPress={onSelectAll}><Text style={styles.batchActionText}>全选</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.batchActionButton, pressed && pressedOpacity()]} onPress={onDeselectAll}><Text style={styles.batchActionText}>取消</Text></Pressable>
              <Text style={styles.batchCount}>已选 {selectedIds.size}/{filteredCount}</Text>
              <Pressable style={({ pressed }) => [styles.batchActionButton, styles.batchDeleteButton, pressed && pressedOpacity()]} onPress={onBatchDeletePress} disabled={selectedIds.size === 0}>
                <Text style={[styles.batchActionText, styles.batchDeleteText]}>删除({selectedIds.size})</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.batchActionButton, styles.batchDownloadBtn, pressed && pressedOpacity()]} onPress={onBatchDownload} disabled={selectedIds.size === 0 || isDownloading}>
                <Text style={[styles.batchActionText, styles.batchDownloadText]}>{isDownloading ? '下载中...' : `下载(${selectedIds.size})`}</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}

      {history.length > 0 ? (
        <View style={styles.statsBar}>
          <Text style={styles.statSummary}>共 <Text style={styles.statSummaryActive}>{history.length}</Text> 条</Text>
          <Text style={styles.statDivider}>|</Text>
          <Text style={styles.statSummary}><Text style={styles.statSummaryActive}>{activeCount}</Text> 进行中</Text>
          <Text style={styles.statDivider}>|</Text>
          <Text style={styles.statSummary}><Text style={styles.statSummarySuccess}>{successCount}</Text> 已完成</Text>
          <Text style={styles.statDivider}>|</Text>
          <Text style={styles.statSummary}><Text style={styles.statSummaryError}>{failedCount}</Text> 失败</Text>
          <Text style={styles.statDivider}>|</Text>
          <Text style={styles.statSummary}><Text style={styles.statSummaryWarning}>{totalCoinsSpent}</Text> 金币</Text>
        </View>
      ) : null}
    </View>
  );
}
