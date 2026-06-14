import React, { useMemo } from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MODELS } from '../../constants/models';
import { MANUFACTURERS } from '../../constants/modelMeta';
import { Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { DropdownModal } from '../common/DropdownModal';

const createStyles = (colors) => {
  const shared = createSharedStyles(colors);
  return {
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
    backgroundColor: colors.primaryBg,
  },
  dropdownItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  itemIcon: {
    width: 28,
    textAlign: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: Typography.fontSize.subheadline,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
  },
  itemNameActive: {
    color: colors.primary,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  itemManufacturer: {
    fontSize: Typography.fontSize.caption1,
    color: colors.textTertiary,
  },
  itemPrice: {
    fontSize: Typography.fontSize.caption1,
    color: colors.warning,
  },
  emptyState: { ...shared.emptyContainer, paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg },
  emptyText: { ...shared.emptyTitle, fontSize: Typography.fontSize.subheadline },
  emptySubtext: shared.emptySubtitle,
  };
};

export function FavoriteModelsLayer({
  visible,
  onClose,
  currentModelId,
  onSelectModel,
  favorites,
  triggerTop,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  const favoriteModels = useMemo(() => favorites.map((modelId) => ({
    id: modelId,
    ...MODELS[modelId],
    manufacturerInfo: MANUFACTURERS[MODELS[modelId]?.manufacturer],
  })).filter(Boolean), [favorites]);

  return (
    <DropdownModal
      visible={visible}
      onClose={onClose}
      triggerTop={triggerTop}
      width={260}
      align="left"
    >
      <View style={styles.dropdownHeader}>
        <Text style={styles.dropdownTitle}>常用模型</Text>
      </View>

      <ScrollView
        style={styles.dropdownList}
        showsVerticalScrollIndicator={false}
        canCancelContentTouches={false}
        keyboardShouldPersistTaps="handled"
      >
        {favoriteModels.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="inbox-outline" size={36} color={colors.textTertiary} />
            <Text style={styles.emptyText}>暂无常用模型</Text>
            <Text style={styles.emptySubtext}>点击下方按钮添加</Text>
          </View>
        ) : (
          favoriteModels.map((model, index) => (
            <Pressable
              key={model.id}
              style={({ pressed }) => [
                styles.dropdownItem,
                currentModelId === model.id && styles.dropdownItemActive,
                index < favoriteModels.length - 1 && styles.dropdownItemBorder,
                pressed && pressedOpacity(),
              ]} onPress={() => {
                onSelectModel(model.id);
                onClose();
              }} >
              <Ionicons
                name={model.icon.name}
                size={20}
                color={
                  currentModelId === model.id
                    ? colors.primary
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
                  color={colors.primary}
                />
              )}
            </Pressable>
          ))
        )}
      </ScrollView>
    </DropdownModal>
  );
}
