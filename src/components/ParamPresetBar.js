import React, { useState, useCallback, useRef } from 'react';
import { Pressable, Text, View, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography, pressedOpacity } from '../constants/theme';
import { createSharedStyles } from '../constants/sharedStyles';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { DropdownModal } from './common/DropdownModal';

export function ParamPresetBar({ modelId, mode, currentParams, onApplyPreset, presets, onSavePreset, onDeletePreset }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [triggerY, setTriggerY] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const triggerRef = useRef(null);

  const modelPresets = presets.filter((p) => p.modelId === modelId && p.mode === mode);

  const handleSave = useCallback(() => {
    const name = presetName.trim();
    if (!name) return;
    onSavePreset(name, modelId, mode, currentParams);
    setPresetName('');
    setSaveModalVisible(false);
  }, [presetName, modelId, mode, currentParams, onSavePreset]);

  const handleOpenSave = useCallback(() => {
    setVisible(false);
    setTimeout(() => setSaveModalVisible(true), 200);
  }, []);

  const handleConfirmDelete = useCallback((id) => {
    onDeletePreset(id);
    setConfirmDeleteId(null);
    setVisible(false);
  }, [onDeletePreset]);

  return (
    <>
      <Pressable
        ref={triggerRef}
        style={({ pressed }) => [styles.triggerButton, pressed && pressedOpacity()]}
        onPress={() => {
          triggerRef.current?.measure((_x, _y, _w, _h, _px, py) => {
            setTriggerY(py);
          });
          setVisible(true);
        }}
      >
        <Ionicons name="bookmark-outline" size={18} color={colors.primary} style={{ paddingLeft: Spacing.xs }} />
        <Text style={styles.triggerText}>预设</Text>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.textTertiary} style={{ paddingLeft: Spacing.xs, paddingRight: Spacing.xs }} />
      </Pressable>

      <DropdownModal
        visible={visible}
        onClose={() => setVisible(false)}
        triggerTop={triggerY}
        width={280}
        align="right"
      >
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>参数预设</Text>
                <Text style={styles.dropdownSubtitle}>
                  {modelPresets.length} 个预设
                </Text>
              </View>

              <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false} canCancelContentTouches={false} keyboardShouldPersistTaps="handled">
                {modelPresets.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="bookmark-outline" size={36} color={colors.textTertiary} />
                    <Text style={styles.emptyText}>暂无预设</Text>
                    <Text style={styles.emptySubtext}>点击下方按钮保存当前参数</Text>
                  </View>
                ) : (
                  modelPresets.map((preset, index) => (
                    <View
                      key={preset.id}
                      style={[
                        styles.dropdownItem,
                        index < modelPresets.length - 1 && styles.dropdownItemBorder,
                      ]}
                    >
                      {confirmDeleteId === preset.id ? (
                        <View style={styles.confirmRow}>
                          <Text style={styles.confirmText}>删除此预设？</Text>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.confirmCancelBtn}
                            onPress={() => setConfirmDeleteId(null)}
                          >
                            <Text style={styles.confirmCancelText}>取消</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.confirmDeleteBtn}
                            onPress={() => handleConfirmDelete(preset.id)}
                          >
                            <Text style={styles.confirmDeleteText}>删除</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <>
                          <Pressable
                            style={styles.dropdownItemContent}
                            onPress={() => {
                              onApplyPreset(preset.params);
                              setVisible(false);
                            }}
                          >
                            <Ionicons name="bookmark" size={20} color={colors.primary} style={styles.itemIcon} />
                            <View style={styles.itemContent}>
                              <Text style={styles.itemName} numberOfLines={1}>{preset.name}</Text>
                            </View>
                          </Pressable>
                          <TouchableOpacity
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.7}
                            style={styles.deleteButton}
                            onPress={() => setConfirmDeleteId(preset.id)}
                          >
                            <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>

              <Pressable style={({ pressed }) => [styles.dropdownFooter, pressed && pressedOpacity()]} onPress={handleOpenSave}>
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.dropdownFooterText}>保存当前参数</Text>
              </Pressable>
      </DropdownModal>

      <Modal visible={saveModalVisible} transparent animationType="fade" onRequestClose={() => setSaveModalVisible(false)}>
        <View style={styles.saveOverlay}>
          <View style={styles.saveContent}>
            <Text style={styles.saveTitle}>保存参数预设</Text>
            <TextInput
              style={styles.saveInput}
              value={presetName}
              onChangeText={setPresetName}
              placeholder="输入预设名称"
              placeholderTextColor={colors.textPlaceholder}
              autoFocus
              maxLength={20}
            />
            <View style={styles.saveActions}>
              <Pressable style={({ pressed }) => [styles.saveCancel, pressed && pressedOpacity()]} onPress={() => setSaveModalVisible(false)}>
                <Text style={styles.saveCancelText}>取消</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.saveConfirm, pressed && pressedOpacity()]} onPress={handleSave} disabled={!presetName.trim()}>
                <Text style={styles.saveConfirmText}>保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (colors) => {
  const shared = createSharedStyles(colors);
  return {
    triggerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingVertical: Spacing.sm,
      paddingLeft: Spacing.xs,
      paddingRight: Spacing.xs,
      borderRadius: Radius.sm,
      borderCurve: 'continuous',
      gap: Spacing.xs,
      alignSelf: 'flex-start',
    },
    triggerText: {
      fontSize: Typography.fontSize.footnote,
      color: colors.textPrimary,
      fontWeight: Typography.fontWeight.semibold,
      paddingLeft: Spacing.xs,
      paddingRight: Spacing.xs,
    },
    dropdownHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.separator,
    },
    dropdownTitle: {
      fontSize: Typography.fontSize.callout,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
    },
    dropdownSubtitle: {
      fontSize: Typography.fontSize.footnote,
      color: colors.textTertiary,
    },
    dropdownList: {
      maxHeight: 260,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      height: 50,
    },
    dropdownItemContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    dropdownItemBorder: {
      borderBottomWidth: 0.5,
      borderBottomColor: colors.separator,
    },
    itemIcon: {
      width: 24,
      textAlign: 'center',
    },
    itemContent: {
      flex: 1,
    },
    deleteButton: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemName: {
      fontSize: Typography.fontSize.subheadline,
      color: colors.textPrimary,
      fontWeight: Typography.fontWeight.semibold,
    },
    confirmRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    confirmText: {
      flex: 1,
      fontSize: Typography.fontSize.subheadline,
      color: colors.textSecondary,
    },
    confirmCancelBtn: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
    },
    confirmCancelText: {
      fontSize: Typography.fontSize.subheadline,
      color: colors.textSecondary,
    },
    confirmDeleteBtn: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      backgroundColor: colors.error,
      borderRadius: Radius.xs,
      borderCurve: 'continuous',
    },
    confirmDeleteText: {
      fontSize: Typography.fontSize.subheadline,
      color: colors.textInverse,
      fontWeight: Typography.fontWeight.semibold,
    },
    dropdownFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
      borderTopWidth: 0.5,
      borderTopColor: colors.separator,
    },
    dropdownFooterText: {
      fontSize: Typography.fontSize.subheadline,
      color: colors.primary,
      fontWeight: Typography.fontWeight.semibold,
    },
    emptyState: { ...shared.emptyContainer, paddingVertical: Spacing.xxl },
    emptyText: { ...shared.emptyTitle, fontSize: Typography.fontSize.subheadline },
    emptySubtext: shared.emptySubtitle,
    saveOverlay: { flex: 1, backgroundColor: colors.overlayMedium, alignItems: 'center', justifyContent: 'center' },
    saveContent: { backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous', padding: Spacing.xl, width: '80%', maxWidth: 360 },
    saveTitle: { fontSize: Typography.fontSize.body, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: Spacing.md },
    saveInput: { fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, borderWidth: 1, borderColor: colors.separator, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.md, backgroundColor: colors.bg, marginBottom: Spacing.lg },
    saveActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md },
    saveCancel: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
    saveCancelText: { fontSize: Typography.fontSize.subheadline, color: colors.textSecondary },
    saveConfirm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, backgroundColor: colors.primary, borderRadius: Radius.sm, borderCurve: 'continuous' },
    saveConfirmText: { fontSize: Typography.fontSize.subheadline, color: colors.textInverse, fontWeight: Typography.fontWeight.semibold },
  };
};
