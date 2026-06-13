import React, { useState, useMemo, useCallback } from 'react';
import { Pressable, Text,
  View,
  ScrollView,
  FlatList,
  useWindowDimensions, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MODELS } from '../constants/models';
import { CATEGORIES, MANUFACTURERS, FAVORITES_MAX_COUNT } from '../constants/modelMeta';
import { Radius, Spacing, Typography, pressedOpacity } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { useFavoritesContext } from '../context/FavoritesContext';

const ModelCard = React.memo(function ModelCard({ model, isSelected, isEditMode, onPress, colors, styles }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.modelCard,
        isSelected && styles.modelCardActive,
      , pressed && pressedOpacity()]} onPress={onPress} >
      <View style={styles.modelCardHeader}>
        <Ionicons
          name={model.icon.name}
          size={24}
          color={model.icon.color}
          style={{ paddingLeft: 4, paddingRight: 4 }}
        />
        {isEditMode && (
          <View style={[
            styles.favoriteCheckbox,
            isSelected && styles.favoriteCheckboxChecked,
          ]}>
            {isSelected && (
              <Ionicons name="check" size={14} color={colors.textOnOverlay} />
            )}
          </View>
        )}
        {!isEditMode && model.isFavorite && (
          <Ionicons name="star" size={16} color={colors.star} />
        )}
      </View>
      <Text style={[styles.modelCardName, { paddingLeft: 6, paddingRight: 6 }]}>{model.name}</Text>
      {model.manufacturerInfo && (
        <Text style={styles.modelCardManufacturer}>
          {model.manufacturerInfo.label}
        </Text>
      )}
    </Pressable>
  );
});

export function ModelSelectScreen({ currentModelId, onSelectModel, onBack }) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const categoryWidth = screenWidth < 360 ? 100 : 130;
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { favorites, saveFavorites, isFavorite } = useFavoritesContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedModels, setSelectedModels] = useState([...favorites]);

  const allModelEntries = useMemo(() => {
    return Object.entries(MODELS).map(([id, model]) => {
      // categories 用于 UI 分类过滤，基于 CATEGORIES 的键
      // modes 用于 API 路径，两者可能不同（如 LLM 的 category='language' vs mode='large-language-models'）
      const categories = model.supportsImageToImage && !model.modes
        ? ['text-to-image', 'image-to-image']
        : model.modes
          ? model.modes.map(m => {
              // 将 API mode 映射回 UI category
              if (m === 'large-language-models') return 'language';
              if (m === 'vision') return 'vision';
              if (m === 'text-to-audio') return 'text-to-audio';
              return m;
            })
          : [model.category];
      return {
        id,
        ...model,
        categories,
        manufacturerInfo: MANUFACTURERS[model.manufacturer],
        isFavorite: isFavorite(id),
      };
    });
  }, [isFavorite]);

  const filteredModels = useMemo(() => {
    if (selectedCategory === 'all') {
      return allModelEntries;
    }
    if (selectedCategory === 'favorite') {
      const favs = Array.isArray(favorites) ? favorites : [];
      return allModelEntries.filter((m) => favs.includes(m.id));
    }
    return allModelEntries.filter((m) => m.categories.includes(selectedCategory));
  }, [selectedCategory, favorites, allModelEntries]);

  const handleModelPress = (modelId, category) => {
    if (isEditMode) {
      if (selectedModels.includes(modelId)) {
        setSelectedModels(selectedModels.filter((id) => id !== modelId));
      } else if (selectedModels.length < FAVORITES_MAX_COUNT) {
        setSelectedModels([...selectedModels, modelId]);
      }
    } else {
      // 传递当前分类，以便 HomeScreen 自动切换到对应模式
      // 将 UI category 映射为 API mode
      let apiMode = category && category !== 'all' && category !== 'favorite' ? category : undefined;
      if (apiMode === 'language') apiMode = 'large-language-models';
      onSelectModel(modelId, apiMode);
    }
  };

  const handleSaveFavorites = () => {
    saveFavorites([...selectedModels]);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      handleSaveFavorites();
    } else {
      setSelectedModels([...favorites]);
      setIsEditMode(true);
    }
  };

  const categoryList = useMemo(() => [
    { key: 'all', label: '全部模型', icon: 'apps-outline', color: colors.primary, count: allModelEntries.length },
    ...Object.entries(CATEGORIES).map(([key, value]) => ({
      key,
      ...value,
      count: key === 'favorite'
        ? (Array.isArray(favorites) ? favorites.length : 0)
        : allModelEntries.filter((m) => m.categories.includes(key)).length,
    })),
  ], [allModelEntries, favorites, colors.primary]);

  const renderModelItem = useCallback(({ item: model }) => {
    const isSelected = isEditMode ? selectedModels.includes(model.id) : currentModelId === model.id;
    return (
      <ModelCard
        model={model}
        isSelected={isSelected}
        isEditMode={isEditMode}
        onPress={() => handleModelPress(model.id, selectedCategory)}
        colors={colors}
        styles={styles}
      />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, selectedModels, currentModelId, selectedCategory, styles, colors, handleModelPress]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && pressedOpacity()]} onPress={onBack} >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>选择模型</Text>
        <Pressable
          style={({ pressed }) => [styles.editButton, pressed && pressedOpacity()]} onPress={toggleEditMode} >
          <Text style={[
            styles.editButtonText,
            isEditMode && styles.editButtonTextActive
          ]}>
            {isEditMode ? '完成' : '添加到常用模型'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <ScrollView
          style={[styles.categorySidebar, { width: categoryWidth }]}
          showsVerticalScrollIndicator={false}
        >
          {categoryList.map((category) => (
            <Pressable
              key={category.key}
              style={({ pressed }) => [
                styles.categoryItem,
                selectedCategory === category.key && styles.categoryItemActive,
              , pressed && pressedOpacity()]} onPress={() => {
                setSelectedCategory(category.key);
              }} >
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.key && styles.categoryLabelActive,
                ]}
                numberOfLines={1}
              >
                {category.label}
              </Text>
              <Text
                style={[
                  styles.categoryCount,
                  selectedCategory === category.key && styles.categoryCountActive,
                ]}
              >
                {category.count}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <FlatList
          style={styles.modelList}
          data={filteredModels}
          keyExtractor={(item) => item.id}
          renderItem={renderModelItem}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>暂无模型</Text>
              {selectedCategory === 'favorite' && !isEditMode && (
                <Text style={styles.emptySubtext}>点击右上角添加常用模型</Text>
              )}
            </View>
          }
          contentContainerStyle={styles.modelGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  editButtonText: {
    fontSize: Typography.fontSize.subheadline,
    color: colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  editButtonTextActive: {
    color: colors.primary,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  categorySidebar: {
    backgroundColor: colors.bg,
    paddingTop: 0,
    flexShrink: 0,
    flexGrow: 0,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  categoryItemActive: {
    backgroundColor: colors.card,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  categoryLabel: {
    flex: 1,
    fontSize: Typography.fontSize.caption1,
    color: colors.textTertiary,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'left',
  },
  categoryLabelActive: {
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
  },
  categoryCount: {
    fontSize: Typography.fontSize.caption2,
    color: colors.textTertiary,
    backgroundColor: colors.bg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
    borderCurve: 'continuous',
  },
  categoryCountActive: {
    color: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  modelList: {
    flex: 1,
    backgroundColor: colors.card,
  },
  modelListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  modelListTitle: {
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  modelListSubtitle: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.callout,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textTertiary,
  },
  modelGrid: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  modelCard: {
    backgroundColor: colors.bg,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    paddingVertical: Spacing.md,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  modelCardActive: {
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  favoriteCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteCheckboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modelCardName: {
    flex: 1,
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.semibold,
  },
  modelCardManufacturer: {
    fontSize: Typography.fontSize.caption1,
    color: colors.textTertiary,
    marginRight: Spacing.sm,
  },
});
