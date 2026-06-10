import React from 'react';
import { Pressable, Text,
  View,
  ScrollView,
  Modal, } from 'react-native';
import { Radius, Spacing, Typography, pressedOpacity } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const createStyles = (colors) => ({
  modalOverlay: { flex: 1, backgroundColor: colors.overlayMedium, justifyContent: 'center', alignItems: 'center' },
  logModalContent: { width: '90%', maxHeight: '80%', backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous', overflow: 'hidden' },
  logModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  logModalTitle: { fontSize: Typography.fontSize.headline, fontWeight: Typography.fontWeight.semibold, color: colors.textInverse },
  logModalClose: { fontSize: Typography.fontSize.title3, color: colors.textTertiary, fontWeight: Typography.fontWeight.semibold, paddingHorizontal: 8 },
  logModalScroll: { padding: Spacing.lg, maxHeight: 500 },
  logModalText: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary, fontFamily: 'monospace' },
  pickerOverlay: { flex: 1, backgroundColor: colors.overlayLight, justifyContent: 'center', alignItems: 'center' },
  pickerContent: { width: '80%', backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous', padding: Spacing.xl },
  pickerTitle: { fontSize: Typography.fontSize.headline, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: Spacing.lg, textAlign: 'center' },
  pickerOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: Spacing.lg, borderRadius: Radius.sm, borderCurve: 'continuous', marginBottom: 2 },
  pickerOptionActive: { backgroundColor: colors.primaryBg },
  pickerOptionText: { fontSize: Typography.fontSize.callout, color: colors.textSecondary },
  pickerOptionTextActive: { color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  pickerCheck: { fontSize: 18, color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  confirmOverlay: { flex: 1, backgroundColor: colors.overlayLight, justifyContent: 'center', alignItems: 'center' },
  confirmBox: { width: '82%', backgroundColor: colors.card, borderRadius: Radius.xl, borderCurve: 'continuous', padding: Spacing.xxl },
  confirmTitle: { fontSize: 18, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' },
  confirmMessage: { fontSize: Typography.fontSize.subheadline, color: colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl, textAlign: 'center' },
  confirmActions: { flexDirection: 'row', gap: Spacing.md },
  confirmCancelButton: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, borderCurve: 'continuous', backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  confirmCancelText: { fontSize: Typography.fontSize.headline, color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  confirmDeleteButton: { flex: 1, paddingVertical: 12, borderRadius: Radius.md, borderCurve: 'continuous', backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center' },
  confirmDeleteText: { fontSize: Typography.fontSize.headline, color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
});

export function HistoryModals({
  logModal,
  setLogModal,
  deleteConfirmId,
  setDeleteConfirmId,
  deleteConfirmBatch,
  setDeleteConfirmBatch,
  showSortPicker,
  setShowSortPicker,
  handleDelete,
  handleBatchDelete,
  selectedIds,
  handleSortChange,
  sortBy,
  SORT_OPTIONS,
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <Modal visible={!!logModal} transparent animationType="fade" onRequestClose={() => setLogModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logModalContent}>
            <View style={styles.logModalHeader}>
              <Text style={styles.logModalTitle}>响应日志</Text>
              <Pressable style={({ pressed }) => pressed && pressedOpacity()} onPress={() => setLogModal(null)}><Text style={styles.logModalClose}>✕</Text></Pressable>
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
              <Pressable style={({ pressed }) => [styles.confirmCancelButton, pressed && pressedOpacity()]} onPress={() => setDeleteConfirmId(null)}><Text style={styles.confirmCancelText}>取消</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.confirmDeleteButton, pressed && pressedOpacity()]} onPress={() => handleDelete(deleteConfirmId)}><Text style={styles.confirmDeleteText}>删除</Text></Pressable>
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
              <Pressable style={({ pressed }) => [styles.confirmCancelButton, pressed && pressedOpacity()]} onPress={() => setDeleteConfirmBatch(false)}><Text style={styles.confirmCancelText}>取消</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.confirmDeleteButton, pressed && pressedOpacity()]} onPress={handleBatchDelete}><Text style={styles.confirmDeleteText}>删除</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSortPicker} transparent animationType="fade" onRequestClose={() => setShowSortPicker(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowSortPicker(false)}>
          <View style={styles.pickerContent}>
            <Text style={styles.pickerTitle}>排序方式</Text>
            {SORT_OPTIONS.map((opt) => (
              <Pressable key={opt.key} style={({ pressed }) => [styles.pickerOption, sortBy === opt.key && styles.pickerOptionActive, pressed && pressedOpacity()]} onPress={() => handleSortChange(opt.key)}>
                <Text style={[styles.pickerOptionText, sortBy === opt.key && styles.pickerOptionTextActive]}>{opt.label}</Text>
                {sortBy === opt.key ? <Text style={styles.pickerCheck}>✓</Text> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
