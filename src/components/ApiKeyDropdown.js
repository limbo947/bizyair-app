import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../constants/theme';

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
      <Pressable style={styles.overlay} onPress={onClose}>
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
                  <TouchableOpacity
                    key={keyItem.id}
                    style={[
                      styles.dropdownItem,
                      activeApiKeyId === keyItem.id && styles.dropdownItemActive,
                      index < apiKeys.length - 1 && styles.dropdownItemBorder,
                    ]}
                    onPress={() => {
                      onSwitchKey(keyItem.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemContent}>
                      {editingKeyId === keyItem.id ? (
                        <TextInput
                          style={styles.renameInput}
                          value={editName}
                          onChangeText={setEditName}
                          onSubmitEditing={confirmRename}
                          onBlur={confirmRename}
                          placeholderTextColor={Colors.textPlaceholder}
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
                    <TouchableOpacity
                      style={styles.editKeyNameButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        startRename(keyItem);
                      }}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="pencil-outline" size={14} color={Colors.textTertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        onDeleteKey(keyItem.id);
                      }}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="trash-outline" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </TouchableOpacity>
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
                  placeholderTextColor={Colors.textPlaceholder}
                  autoFocus
                />
                <TextInput
                  style={styles.addNameInput}
                  placeholder="密钥名称（可选）"
                  value={newKeyName}
                  onChangeText={setNewKeyName}
                  placeholderTextColor={Colors.textPlaceholder}
                  maxLength={30}
                />
                <View style={styles.addInputRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowAddInput(false);
                      setNewKey('');
                      setNewKeyName('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.addConfirmButton, !newKey.trim() && styles.addConfirmButtonDisabled]}
                    onPress={handleAdd}
                    disabled={!newKey.trim()}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addConfirmButtonText}>添加</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.dropdownFooter}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddInput(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
                  <Text style={styles.addButtonText}>新增密钥</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: 65,
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dropdownSubtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
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
    backgroundColor: Colors.primaryBg,
  },
  dropdownItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  itemContent: {
    flex: 1,
  },
  itemKeyText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    lineHeight: 30,
  },
  itemKeyTextActive: {
    color: Colors.primary,
  },
  itemKeySubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginLeft: 12,
  },
  renameInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingVertical: 0,
  },
  editKeyNameButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 6,
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
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  dropdownFooter: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: Colors.separator,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  addInputSection: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.separator,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  addNameInput: {
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.bg,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
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
    backgroundColor: Colors.bg,
  },
  cancelButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  addInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.bg,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    fontFamily: 'monospace',
  },
  addConfirmButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
  },
  addConfirmButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  addConfirmButtonText: {
    fontSize: 13,
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
