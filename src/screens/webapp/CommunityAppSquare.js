import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Modal, View, Text, TextInput, Pressable, FlatList,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useToastContext } from '../../context/ToastContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { fetchCommunityApps, fetchDict } from '../../services/apiClient';
import { loadSavedApps } from './storage';
import { Radius, Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { CommunityAppCard } from './CommunityAppCard';
import { CommunityAppPreview } from './CommunityAppPreview';

const PAGE_SIZE = 28;
const SORT_OPTIONS = [
  { label: '最近', value: 'Recently' },
  { label: '最多使用', value: 'Most Used' },
  { label: '最多收藏', value: 'Most Forked' },
  { label: '最多点赞', value: 'Most Liked' },
];

/**
 * 应用广场浮层。
 * @param {object} props
 * @param {boolean} props.visible - 是否显示
 * @param {function} props.onClose - 关闭回调
 * @param {function} props.onSelectApp - 选择使用应用回调（传入列表项 item）
 * @param {function} [props.onSavedAppsChange] - 收藏列表变更回调（通知父组件刷新）
 */
export function CommunityAppSquare({ visible, onClose, onSelectApp, onSavedAppsChange }) {
  const { colors } = useTheme();
  const { showToast } = useToastContext();
  const styles = useThemedStyles(createStyles);

  // 列表数据
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  // 筛选状态
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('Recently');
  const [baseModel, setBaseModel] = useState(''); // 空字符串=全部
  const [baseModels, setBaseModels] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  // 预览状态
  const [previewApp, setPreviewApp] = useState(null);

  // 收藏 ID 集合
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const searchTimer = useRef(null);
  const filterStateRef = useRef({ keyword: '', sort: 'Recently', baseModel: '' });

  // 同步筛选状态到 ref（供防抖回调读取最新值）
  useEffect(() => {
    filterStateRef.current = { keyword, sort, baseModel };
  }, [keyword, sort, baseModel]);

  // 加载应用列表
  const loadApps = useCallback(async (page = 1, reset = false, overrideFilter) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const f = overrideFilter || filterStateRef.current;
      const result = await fetchCommunityApps({
        current: page,
        pageSize: PAGE_SIZE,
        keyword: f.keyword,
        sort: f.sort,
        baseModel: f.baseModel || undefined,
      });
      setApps(prev => reset ? result.list : [...prev, ...result.list]);
      setCurrent(result.current);
      setTotal(result.total);
    } catch (err) {
      showToast(err.message || '加载失败', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [showToast]);

  // 打开时自动刷新（重置所有筛选条件并加载第一页）
  /* eslint-disable react-hooks/set-state-in-effect -- reset all filters and reload when square opens */
  useEffect(() => {
    if (visible) {
      setApps([]);
      setCurrent(1);
      setKeyword('');
      setSort('Recently');
      setBaseModel('');
      setPreviewApp(null);
      filterStateRef.current = { keyword: '', sort: 'Recently', baseModel: '' };
      loadApps(1, true, { keyword: '', sort: 'Recently', baseModel: '' });
    }
  }, [visible, loadApps]);

  // 加载收藏列表（用于卡片收藏状态显示）
  useEffect(() => {
    if (visible) {
      loadSavedApps().then(list => {
        setFavoriteIds(new Set(list.map(a => a.bizyModelId)));
      });
    }
  }, [visible]);

  // 加载基础模型字典（仅首次打开）
  useEffect(() => {
    if (visible && baseModels.length === 0) {
      fetchDict()
        .then(data => setBaseModels(data.baseModels))
        .catch(() => {/* 非关键功能，静默失败 */});
    }
  }, [visible, baseModels.length]);

  // 搜索防抖
  const onKeywordChange = useCallback((text) => {
    setKeyword(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      filterStateRef.current = { ...filterStateRef.current, keyword: text };
      loadApps(1, true, { ...filterStateRef.current, keyword: text });
    }, 500);
  }, [loadApps]);

  // 切换排序后重新加载
  const onSortChange = useCallback((value) => {
    setSort(value);
    setShowFilter(false);
    filterStateRef.current = { ...filterStateRef.current, sort: value };
    loadApps(1, true, { ...filterStateRef.current, sort: value });
  }, [loadApps]);

  // 切换基础模型分类后重新加载
  const onBaseModelChange = useCallback((value) => {
    setBaseModel(value);
    setShowFilter(false);
    filterStateRef.current = { ...filterStateRef.current, baseModel: value };
    loadApps(1, true, { ...filterStateRef.current, baseModel: value });
  }, [loadApps]);

  // 加载更多
  const onLoadMore = useCallback(() => {
    if (loadingMore || loading || apps.length >= total) return;
    loadApps(current + 1);
  }, [loadingMore, loading, apps.length, total, current, loadApps]);

  // 点击卡片 → 打开预览
  const handleCardPress = useCallback((item) => {
    setPreviewApp(item);
  }, []);

  // 从预览页选择使用应用
  const handleSelectApp = useCallback((item) => {
    setPreviewApp(null);
    onSelectApp(item);
    onClose();
  }, [onSelectApp, onClose]);

  // 收藏/取消收藏（仅更新 UI 状态，实际保存在预览页处理）
  const handleToggleFavorite = useCallback((item) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }, []);

  const renderItem = useCallback(({ item }) => (
    <CommunityAppCard
      item={item}
      onPress={() => handleCardPress(item)}
      colors={colors}
      styles={styles}
    />
  ), [handleCardPress, colors, styles]);

  const currentSortLabel = SORT_OPTIONS.find(s => s.value === sort)?.label || '最近';
  const currentModelLabel = baseModel
    ? baseModels.find(m => m.value === baseModel)?.value || baseModel
    : '全部分类';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* 头部 */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && pressedOpacity()]}
            onPress={onClose}
          >
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>应用广场</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 搜索栏 + 筛选 */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              value={keyword}
              onChangeText={onKeywordChange}
              placeholder="搜索应用..."
              placeholderTextColor={colors.textTertiary}
            />
            {keyword ? (
              <Pressable onPress={() => onKeywordChange('')}>
                <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
              </Pressable>
            ) : null}
          </View>
          <Pressable
            style={({ pressed }) => [styles.filterBtn, pressed && pressedOpacity()]}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Ionicons name="options-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>

        {/* 筛选条件展示 */}
        <View style={styles.filterTagsRow}>
          <Pressable
            style={({ pressed }) => [styles.filterTag, pressed && pressedOpacity()]}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Text style={styles.filterTagText}>{currentSortLabel}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.filterTag, pressed && pressedOpacity()]}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Text style={styles.filterTagText} numberOfLines={1}>{currentModelLabel}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* 筛选浮层 */}
        {showFilter ? (
          <View style={styles.filterPanel}>
            <Text style={styles.filterSectionTitle}>排序</Text>
            <View style={styles.filterOptions}>
              {SORT_OPTIONS.map(opt => (
                <Pressable
                  key={opt.value}
                  style={({ pressed }) => [
                    styles.filterOption,
                    sort === opt.value && styles.filterOptionActive,
                    pressed && pressedOpacity(),
                  ]}
                  onPress={() => onSortChange(opt.value)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    sort === opt.value && styles.filterOptionTextActive,
                  ]}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.filterSectionTitle}>基础模型</Text>
            <ScrollView style={styles.filterModelScroll} nestedScrollEnabled>
              <View style={styles.filterOptions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.filterOption,
                    !baseModel && styles.filterOptionActive,
                    pressed && pressedOpacity(),
                  ]}
                  onPress={() => onBaseModelChange('')}
                >
                  <Text style={[
                    styles.filterOptionText,
                    !baseModel && styles.filterOptionTextActive,
                  ]}>全部</Text>
                </Pressable>
                {baseModels.map(m => (
                  <Pressable
                    key={m.value}
                    style={({ pressed }) => [
                      styles.filterOption,
                      baseModel === m.value && styles.filterOptionActive,
                      pressed && pressedOpacity(),
                    ]}
                    onPress={() => onBaseModelChange(m.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      baseModel === m.value && styles.filterOptionTextActive,
                    ]}>{m.value}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        ) : null}

        {/* 列表 */}
        <FlatList
          data={apps}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={!loading ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyText}>未找到应用</Text>
            </View>
          ) : null}
          ListFooterComponent={loadingMore ? (
            <ActivityIndicator color={colors.primary} style={{ padding: Spacing.md }} />
          ) : null}
        />

        {/* 首次加载遮罩 */}
        {loading && apps.length === 0 ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : null}

        {/* 应用详情预览 */}
        <CommunityAppPreview
          app={previewApp}
          isFavorite={previewApp ? favoriteIds.has(previewApp.id) : false}
          onClose={() => setPreviewApp(null)}
          onSelect={handleSelectApp}
          onToggleFavorite={handleToggleFavorite}
          onSavedAppsChange={onSavedAppsChange}
        />
      </View>
    </Modal>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.separator,
  },
  closeBtn: { padding: Spacing.xs },
  title: { fontSize: Typography.fontSize.body, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary },

  // 搜索栏
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous',
  },
  searchInput: { flex: 1, fontSize: Typography.fontSize.footnote, color: colors.textPrimary },
  filterBtn: { padding: Spacing.sm, backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous' },

  // 筛选标签
  filterTagsRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  filterTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    backgroundColor: colors.card, borderRadius: Radius.full, borderCurve: 'continuous',
  },
  filterTagText: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary },

  // 筛选面板
  filterPanel: {
    backgroundColor: colors.card, marginHorizontal: Spacing.md, marginBottom: Spacing.sm,
    borderRadius: Radius.md, borderCurve: 'continuous', padding: Spacing.md,
  },
  filterSectionTitle: { fontSize: Typography.fontSize.caption1, fontWeight: Typography.fontWeight.semibold, color: colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.xs },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.sm },
  filterModelScroll: { maxHeight: 200 },
  filterOption: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    backgroundColor: colors.bg, borderRadius: Radius.full, borderCurve: 'continuous',
  },
  filterOptionActive: { backgroundColor: colors.primary },
  filterOptionText: { fontSize: Typography.fontSize.caption1, color: colors.textPrimary },
  filterOptionTextActive: { color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },

  // 列表
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },

  // 卡片样式（传给 CommunityAppCard）
  card: {
    flex: 1, margin: Spacing.xs, backgroundColor: colors.card,
    borderRadius: Radius.md, borderCurve: 'continuous', overflow: 'hidden',
  },
  coverWrapper: { position: 'relative', width: '100%', aspectRatio: 1 },
  cover: { width: '100%', height: '100%' },
  coverPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  videoBadge: {
    position: 'absolute', bottom: Spacing.xs, right: Spacing.xs,
    width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  info: { padding: Spacing.sm },
  name: { fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modelBadge: {
    backgroundColor: colors.primaryBg, paddingHorizontal: Spacing.xs, paddingVertical: 2,
    borderRadius: Radius.xs, borderCurve: 'continuous',
  },
  modelText: { fontSize: Typography.fontSize.caption2, color: colors.primary },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  count: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary },

  // 空状态
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary, marginTop: Spacing.md },

  // 加载遮罩
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg,
  },
});
