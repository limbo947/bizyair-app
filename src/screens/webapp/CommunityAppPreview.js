import React, { useState, useCallback, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useToastContext } from '../../context/ToastContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { fetchWebappDetail } from '../../services/apiClient';
import { persistSavedApps, loadSavedApps } from './storage';
import { Radius, Spacing, Typography, pressedOpacity } from '../../constants/theme';

/**
 * 应用详情预览页。
 * @param {object} props
 * @param {object|null} props.app - 列表项数据（含 id, name, versions, counter）
 * @param {boolean} props.isFavorite - 是否已收藏
 * @param {function} props.onClose - 关闭回调
 * @param {function} props.onSelect - 使用此应用回调（传入 app）
 * @param {function} props.onToggleFavorite - 收藏状态变更回调（传入 app）
 * @param {function} [props.onSavedAppsChange] - 收藏列表变更回调（通知父组件刷新）
 */
export function CommunityAppPreview({ app, isFavorite, onClose, onSelect, onToggleFavorite, onSavedAppsChange }) {
  const { colors } = useTheme();
  const { showToast } = useToastContext();
  const styles = useThemedStyles(createStyles);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 加载详情
  const loadDetail = useCallback(async () => {
    if (!app) return;
    setLoading(true);
    try {
      const data = await fetchWebappDetail(app.id);
      setDetail(data);
    } catch (err) {
      showToast(err.message || '加载详情失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [app, showToast]);

  // 打开时自动加载详情
  /* eslint-disable react-hooks/set-state-in-effect -- reset detail and load new one when app changes */
  useEffect(() => {
    if (app) {
      setDetail(null);
      loadDetail();
    }
  }, [app, loadDetail]);

  // 收藏到本地
  const handleSave = useCallback(async () => {
    if (!detail || !app) return;
    setSaving(true);
    try {
      const existing = await loadSavedApps();
      // 检查是否已存在（按 bizyModelId 去重）
      if (existing.some(a => a.bizyModelId === app.id)) {
        showToast('该应用已在收藏列表中', 'info');
        onToggleFavorite(app);
        return;
      }
      // 从 input_nodes 生成默认参数值（与 applyAppDetail 逻辑一致）
      const sortedNodes = [...(detail.input_nodes || [])].sort((a, b) => (a.sort ?? -1) - (b.sort ?? -1));
      const inputValues = {};
      const originalTypes = {};
      for (const node of sortedNodes) {
        inputValues[node.variable_name] = node.field_value;
        originalTypes[node.variable_name] = typeof node.field_value;
      }

      const entry = {
        id: `community_${app.id}_${Date.now()}`,
        name: detail.name || app.name,
        bizyModelId: app.id,
        webAppId: detail.id,
        apiCodeText: '',
        appDetail: {
          name: detail.name,
          base_model: detail.base_model,
          intro: detail.intro,
          cover_urls: detail.cover_urls,
        },
        inputNodes: sortedNodes,
        inputValues,
        originalTypes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updated = [entry, ...existing];
      await persistSavedApps(updated);
      onToggleFavorite(app);
      onSavedAppsChange?.();
      showToast('已收藏到本地', 'success');
    } catch (err) {
      showToast(err.message || '收藏失败', 'error');
    } finally {
      setSaving(false);
    }
  }, [detail, app, showToast, onToggleFavorite, onSavedAppsChange]);

  if (!app) return null;

  const version = app.versions?.[0] || {};
  const coverUrl = version.cover_urls?.[0];
  const isVideo = typeof coverUrl === 'string' && coverUrl.endsWith('.mp4');
  const usedCount = app.counter?.used_count ?? 0;
  const forkedCount = app.counter?.forked_count ?? 0;
  const likedCount = app.counter?.liked_count ?? 0;

  return (
    <Modal visible={!!app} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* 头部 */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && pressedOpacity()]}
            onPress={onClose}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>应用详情</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 封面 */}
          {coverUrl && !isVideo ? (
            <Image
              source={{ uri: coverUrl }}
              style={styles.cover}
              contentFit="contain"
            />
          ) : isVideo ? (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Ionicons name="videocam-outline" size={48} color={colors.textTertiary} />
            </View>
          ) : null}

          {/* 基本信息 */}
          <View style={styles.infoCard}>
            <Text style={styles.appName}>{detail?.name || app.name}</Text>
            <View style={styles.metaRow}>
              {version.base_model ? (
                <View style={styles.modelBadge}>
                  <Text style={styles.modelText}>{version.base_model}</Text>
                </View>
              ) : null}
              <Text style={styles.appId}>#{app.id}</Text>
            </View>
            {detail?.intro ? (
              <Text style={styles.intro}>{detail.intro}</Text>
            ) : null}

            {/* 统计数据 */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="trending-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.statText}>使用 {usedCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="git-branch-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.statText}>派生 {forkedCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="heart-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.statText}>点赞 {likedCount}</Text>
              </View>
            </View>
          </View>

          {/* 参数列表预览 */}
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>加载参数中...</Text>
            </View>
          ) : detail?.input_nodes?.length ? (
            <View style={styles.paramsCard}>
              <Text style={styles.paramsTitle}>输入参数（{detail.input_nodes.length} 项）</Text>
              {detail.input_nodes.map((node, idx) => (
                  <View key={node.id || idx} style={styles.paramItem}>
                    <View style={styles.paramHeader}>
                      <Text style={styles.paramLabel}>{node.field_label || node.field_name}</Text>
                      <View style={styles.paramTypeBadge}>
                        <Text style={styles.paramTypeText}>{node.field_type}</Text>
                      </View>
                    </View>
                    <Text style={styles.paramNode}>{node.node_name} · {node.node_type}</Text>
                    {node.field_value !== undefined && node.field_value !== '' ? (
                      <Text style={styles.paramValue} numberOfLines={2}>
                        默认: {String(node.field_value)}
                      </Text>
                    ) : null}
                  </View>
                ))}
            </View>
          ) : null}
        </ScrollView>

        {/* 底部操作栏 */}
        <View style={styles.bottomBar}>
          <Pressable
            style={({ pressed }) => [
              styles.favButton,
              isFavorite && styles.favButtonActive,
              pressed && pressedOpacity(),
            ]}
            onPress={handleSave}
            disabled={saving || !detail}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.error : colors.primary}
            />
            <Text style={[styles.favButtonText, isFavorite && { color: colors.error }]}>
              {isFavorite ? '已收藏' : '收藏'}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.useButton,
              !detail && styles.useButtonDisabled,
              pressed && pressedOpacity(),
            ]}
            onPress={() => onSelect(app)}
            disabled={!detail}
          >
            <Ionicons name="flash-outline" size={20} color={colors.textInverse} />
            <Text style={styles.useButtonText}>使用此应用</Text>
          </Pressable>
        </View>
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

  scrollContent: { paddingBottom: Spacing.xxl },
  cover: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.card },
  coverPlaceholder: { alignItems: 'center', justifyContent: 'center' },

  infoCard: {
    backgroundColor: colors.card, margin: Spacing.md, padding: Spacing.lg,
    borderRadius: Radius.md, borderCurve: 'continuous',
  },
  appName: { fontSize: Typography.fontSize.title3, fontWeight: Typography.fontWeight.bold, color: colors.textPrimary, marginBottom: Spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  modelBadge: {
    backgroundColor: colors.primaryBg, paddingHorizontal: Spacing.sm, paddingVertical: 2,
    borderRadius: Radius.xs, borderCurve: 'continuous',
  },
  modelText: { fontSize: Typography.fontSize.caption1, color: colors.primary },
  appId: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, fontFamily: 'monospace' },
  intro: { fontSize: Typography.fontSize.footnote, color: colors.textSecondary, lineHeight: Typography.lineHeight.normal },

  statsRow: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary },

  loadingBox: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
  loadingText: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary },

  paramsCard: {
    backgroundColor: colors.card, marginHorizontal: Spacing.md, padding: Spacing.lg,
    borderRadius: Radius.md, borderCurve: 'continuous',
  },
  paramsTitle: { fontSize: Typography.fontSize.callout, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: Spacing.md },
  paramItem: { paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  paramHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  paramLabel: { fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, flex: 1 },
  paramTypeBadge: { backgroundColor: colors.bg, paddingHorizontal: Spacing.xs, paddingVertical: 2, borderRadius: Radius.xs, borderCurve: 'continuous' },
  paramTypeText: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary, fontFamily: 'monospace' },
  paramNode: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary },
  paramValue: { fontSize: Typography.fontSize.caption1, color: colors.textSecondary, marginTop: 2 },

  // 底部操作栏
  bottomBar: {
    flexDirection: 'row', gap: Spacing.md, padding: Spacing.md,
    backgroundColor: colors.card, borderTopWidth: 0.5, borderTopColor: colors.separator,
  },
  favButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg, borderCurve: 'continuous',
    borderWidth: 1, borderColor: colors.primary, backgroundColor: colors.bg,
  },
  favButtonActive: { borderColor: colors.error },
  favButtonText: { fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.primary },
  useButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs,
    paddingVertical: Spacing.md, backgroundColor: colors.primary,
    borderRadius: Radius.lg, borderCurve: 'continuous',
  },
  useButtonDisabled: { backgroundColor: colors.primaryDisabled },
  useButtonText: { fontSize: Typography.fontSize.body, fontWeight: Typography.fontWeight.semibold, color: colors.textInverse },
});
