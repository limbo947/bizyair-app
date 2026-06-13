import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';

export function ApiKeyDropdown({
  visible,
  onClose,
  apiKeys,
  activeApiKeyId,
  onSwitchKey,
  onDeleteKey,
  onAddKey,
  onRenameKey,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [showAddInput, setShowAddInput] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [editingKeyId, setEditingKeyId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    const trimmed = newKey.trim();
    if (!trimmed) return;
    const name = newKeyName.trim() || `密钥 ${apiKeys.length + 1}`;
    onAddKey(trimmed, name);
    setNewKey('');
    setNewKeyName('');
    setShowAddInput(false);
  };

  const startRename = (keyItem) => {
    setEditingKeyId(keyItem.id);
    setEditName(keyItem.name || '');
  };

  const confirmRename = () => {
    if (editingKeyId && editName.trim()) {
      onRenameKey(editingKeyId, editName.trim());
    }
    setEditingKeyId(null);
    setEditName('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={({ pressed }) => [styles.overlay, { paddingTop: insets.top + 56 }, pressed && pressedOpacity()]} onPress={onClose}>
        <View style={styles.dropdownContainer}>
          <Pressable>
            <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>🔑 API 密钥</Text>
              <Text style={styles.dropdownSubtitle}>
                {apiKeys.length} 个
              </Text>
            </View>

            <ScrollView
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            >
              {apiKeys.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🔑</Text>
                  <Text style={styles.emptyText}>暂无密钥</Text>
                  <Text style={styles.emptySubtext}>点击下方按钮添加</Text>
                </View>
              ) : (
                apiKeys.map((keyItem, index) => (
                  <Pressable
                    key={keyItem.id}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      activeApiKeyId === keyItem.id && styles.dropdownItemActive,
                      index < apiKeys.length - 1 && styles.dropdownItemBorder,
                    , pressed && pressedOpacity()]} onPress={() => {
                      onSwitchKey(keyItem.id);
                    }} >
                    <View style={styles.itemContent}>
                      {editingKeyId === keyItem.id ? (
                        <TextInput
                          style={styles.renameInput}
                          value={editName}
                          onChangeText={setEditName}
                          onSubmitEditing={confirmRename}
                          onBlur={confirmRename}
                          placeholderTextColor={colors.textPlaceholder}
                          autoFocus
                          selectTextOnFocus
                        />
                      ) : (
                        <Text
                          style={[
                            styles.itemKeyText,
                            activeApiKeyId === keyItem.id && styles.itemKeyTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {keyItem.name || `密钥 ${index + 1}`}
                          <Text style={styles.itemKeySubtext}>
                            {keyItem.key.slice(0, 8)}●●●●{keyItem.key.slice(-4)}
                          </Text>
                        </Text>
                      )}
                    </View>
                    <Pressable
                      style={({ pressed }) => [styles.editKeyNameButton, pressed && pressedOpacity()]} onPress={(e) => {
                        e.stopPropagation();
                        startRename(keyItem);
                      }} >
                      <Ionicons name="pencil-outline" size={14} color={colors.textTertiary} />
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [styles.deleteButton, pressed && pressedOpacity()]} onPress={(e) => {
                        e.stopPropagation();
                        onDeleteKey(keyItem.id);
                      }} >
                      <Ionicons name="trash-outline" size={16} color={colors.error} />
                    </Pressable>
                  </Pressable>
                ))
              )}
            </ScrollView>

            {showAddInput ? (
              <View style={styles.addInputSection}>
                <TextInput
                  style={styles.addInput}
                  placeholder="输入 API Key"
                  value={newKey}
                  onChangeText={setNewKey}
                  secureTextEntry
                  placeholderTextColor={colors.textPlaceholder}
                  autoFocus
                />
                <TextInput
                  style={styles.addNameInput}
                  placeholder="密钥名称（可选）"
                  value={newKeyName}
                  onChangeText={setNewKeyName}
                  placeholderTextColor={colors.textPlaceholder}
                  maxLength={30}
                />
                <View style={styles.addInputRow}>
                  <Pressable
                    style={({ pressed }) => [styles.cancelButton, pressed && pressedOpacity()]} onPress={() => {
                      setShowAddInput(false);
                      setNewKey('');
                      setNewKeyName('');
                    }} >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.addConfirmButton, !newKey.trim() && styles.addConfirmButtonDisabled, pressed && pressedOpacity()]} onPress={handleAdd}
                    disabled={!newKey.trim()} >
                    <Text style={styles.addConfirmButtonText}>添加</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.dropdownFooter}>
                <Pressable
                  style={({ pressed }) => [styles.addButton, pressed && pressedOpacity()]} onPress={() => setShowAddInput(true)} >
                  <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                  <Text style={styles.addButtonText}>新增密钥</Text>
                </Pressable>
              </View>
            )}
          </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors) => ({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayLight,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: 0,
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    backgroundColor: colors.card,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    height: 40,
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
    maxHeight: 280,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 44,
    gap: Spacing.sm,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryBg,
  },
  dropdownItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  itemContent: {
    flex: 1,
  },
  itemKeyText: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: 30,
  },
  itemKeyTextActive: {
    color: colors.primary,
  },
  itemKeySubtext: {
    fontSize: Typography.fontSize.caption1,
    color: colors.textTertiary,
    fontFamily: 'monospace',
    marginLeft: Spacing.md,
  },
  renameInput: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 0,
  },
  editKeyNameButton: {
    padding: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.xs + 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.subheadline,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textTertiary,
  },
  dropdownFooter: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.separator,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  addButtonText: {
    fontSize: Typography.fontSize.footnote,
    color: colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  addInputSection: {
    borderTopWidth: 0.5,
    borderTopColor: colors.separator,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  addNameInput: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    backgroundColor: colors.bg,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md + 2,
    marginTop: Spacing.sm,
  },
  addInputRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  cancelButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    backgroundColor: colors.bg,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  addInput: {
    flex: 1,
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    backgroundColor: colors.bg,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md + 2,
    fontFamily: 'monospace',
  },
  addConfirmButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
  },
  addConfirmButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  addConfirmButtonText: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textInverse,
    fontWeight: Typography.fontWeight.semibold,
  },
});
