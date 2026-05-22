import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MODELS } from '../constants/models';
import { MANUFACTURERS, FAVORITES_MAX_COUNT } from '../constants/modelMeta';
import { Colors, Radius, Spacing } from '../constants/theme';

export function FavoriteModelsLayer({
  visible,
  onClose,
  currentModelId,
  onSelectModel,
  favorites,
}) {
  const favoriteModels = favorites.map((modelId) => ({
    id: modelId,
    ...MODELS[modelId],
    manufacturerInfo: MANUFACTURERS[MODELS[modelId]?.manufacturer],
  })).filter(Boolean);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>⭐ 常用模型</Text>
              <Text style={styles.dropdownSubtitle}>
                {favoriteModels.length}/{FAVORITES_MAX_COUNT}
              </Text>
            </View>

            <ScrollView
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            >
              {favoriteModels.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={styles.emptyText}>暂无常用模型</Text>
                  <Text style={styles.emptySubtext}>点击下方按钮添加</Text>
                </View>
              ) : (
                favoriteModels.map((model, index) => (
                  <TouchableOpacity
                    key={model.id}
                    style={[
                      styles.dropdownItem,
                      currentModelId === model.id && styles.dropdownItemActive,
                      index < favoriteModels.length - 1 &&
                        styles.dropdownItemBorder,
                    ]}
                    onPress={() => {
                      onSelectModel(model.id);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={model.icon.name}
                      size={20}
                      color={
                        currentModelId === model.id
                          ? Colors.primary
                          : model.icon.color
                      }
                      style={styles.itemIcon}
                    />
                    <View style={styles.itemContent}>
                      <Text
                        style={[
                          styles.itemName,
                          currentModelId === model.id && styles.itemNameActive,
                        ]}
                      >
                        {model.name}
                      </Text>
                      {model.manufacturerInfo && (
                        <View style={styles.itemMeta}>
                          <Text style={styles.itemManufacturer}>
                            {model.manufacturerInfo.label}
                          </Text>
                          {model.prices && (
                            <Text style={styles.itemPrice}>
                              · {Math.min(...Object.values(model.prices))}
                              金币起
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                    {currentModelId === model.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
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
    paddingTop: 110,
  },
  dropdownContainer: {
    width: 260,
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
    paddingVertical: Spacing.md,
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
    height: 50,
    gap: Spacing.sm,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primaryBg,
  },
  dropdownItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  itemIcon: {
    width: 28,
    textAlign: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  itemNameActive: {
    color: Colors.primary,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  itemManufacturer: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  itemPrice: {
    fontSize: 12,
    color: Colors.warning,
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
});
