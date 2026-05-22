import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MODELS } from '../constants/models';
import { CATEGORIES, MANUFACTURERS, FAVORITES_MAX_COUNT } from '../constants/modelMeta';
import { Colors, Shadows, Radius, Spacing } from '../constants/theme';
import { useAppContext } from '../context/AppContext';

export function ModelSelectScreen({ currentModelId, onSelectModel, onBack }) {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('favorite');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedModels, setSelectedModels] = useState([...favorites]);

  const allModelEntries = useMemo(() => {
    return Object.entries(MODELS).map(([id, model]) => ({
      id,
      ...model,
      manufacturerInfo: MANUFACTURERS[model.manufacturer],
      isFavorite: isFavorite(id),
    }));
  }, [isFavorite]);

  const filteredModels = useMemo(() => {
    if (selectedCategory === 'favorite') {
      return allModelEntries.filter((m) => favorites.includes(m.id));
    }
    return allModelEntries.filter((m) => m.category === selectedCategory);
  }, [selectedCategory, favorites, allModelEntries]);

  const handleModelPress = (modelId) => {
    if (isEditMode) {
      if (selectedModels.includes(modelId)) {
        setSelectedModels(selectedModels.filter((id) => id !== modelId));
      } else if (selectedModels.length < FAVORITES_MAX_COUNT) {
        setSelectedModels([...selectedModels, modelId]);
      }
    } else {
      onSelectModel(modelId);
    }
  };

  const handleSaveFavorites = () => {
    selectedModels.forEach((modelId) => {
      if (!favorites.includes(modelId)) {
        addFavorite(modelId);
      }
    });
    favorites.forEach((modelId) => {
      if (!selectedModels.includes(modelId)) {
        removeFavorite(modelId);
      }
    });
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setSelectedModels([...favorites]);
    } else {
      setSelectedModels([...favorites]);
    }
    setIsEditMode(!isEditMode);
  };

  const categoryList = Object.entries(CATEGORIES).map(([key, value]) => ({
    key,
    ...value,
    count: key === 'favorite' 
      ? favorites.length 
      : allModelEntries.filter((m) => m.category === key).length,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择模型</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={toggleEditMode}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.editButtonText,
            isEditMode && styles.editButtonTextActive
          ]}>
            {isEditMode ? '完成' : '编辑'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <ScrollView
          style={styles.categorySidebar}
          showsVerticalScrollIndicator={false}
        >
          {categoryList.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryItem,
                selectedCategory === category.key && styles.categoryItemActive,
              ]}
              onPress={() => {
                setSelectedCategory(category.key);
                if (isEditMode && category.key !== 'favorite') {
                  setIsEditMode(false);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={selectedCategory === category.key ? Colors.primary : Colors.textTertiary}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.key && styles.categoryLabelActive,
                ]}
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
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          style={styles.modelList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modelListHeader}>
            <Text style={styles.modelListTitle}>
              {CATEGORIES[selectedCategory]?.label || '模型'}
            </Text>
            {isEditMode && selectedCategory === 'favorite' && (
              <Text style={styles.modelListSubtitle}>
                已选 {selectedModels.length}/{FAVORITES_MAX_COUNT}
              </Text>
            )}
          </View>

          {filteredModels.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>暂无模型</Text>
              {selectedCategory === 'favorite' && !isEditMode && (
                <>
                  <Text style={styles.emptySubtext}>点击右上角编辑添加常用模型</Text>
                </>
              )}
            </View>
          ) : (
            <View style={styles.modelGrid}>
              {filteredModels.map((model) => {
                const isSelected = isEditMode ? selectedModels.includes(model.id) : currentModelId === model.id;
                return (
                  <TouchableOpacity
                    key={model.id}
                    style={[
                      styles.modelCard,
                      isSelected && styles.modelCardActive,
                    ]}
                    onPress={() => handleModelPress(model.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.modelCardHeader}>
                      <Ionicons
                        name={model.icon.name}
                        size={24}
                        color={model.icon.color}
                      />
                      {isEditMode && (
                        <View style={[
                          styles.favoriteCheckbox,
                          isSelected && styles.favoriteCheckboxChecked,
                        ]}>
                          {isSelected && (
                            <Ionicons name="check" size={14} color="#fff" />
                          )}
                        </View>
                      )}
                      {!isEditMode && model.isFavorite && (
                        <Ionicons name="star" size={16} color="#FFD700" />
                      )}
                    </View>
                    <Text style={styles.modelCardName}>{model.name}</Text>
                    {model.manufacturerInfo && (
                      <Text style={styles.modelCardManufacturer}>
                        {model.manufacturerInfo.label}
                      </Text>
                    )}
                    {model.prices && (
                      <Text style={styles.modelCardPrice}>
                        {Math.min(...Object.values(model.prices))} 金币起
                      </Text>
                    )}
                    {model.priceNote && (
                      <Text style={styles.modelCardPriceNote}>
                        {model.priceNote}
                      </Text>
                    )}
                    {!isEditMode && isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {isEditMode && selectedCategory === 'favorite' && (
            <View style={styles.editFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveFavorites}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>保存常用模型</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  editButtonText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  editButtonTextActive: {
    color: Colors.primary,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  categorySidebar: {
    width: 100,
    backgroundColor: Colors.bg,
    paddingTop: Spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryItemActive: {
    backgroundColor: Colors.card,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 12,
    color: Colors.textTertiary,
    backgroundColor: Colors.bg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryCountActive: {
    color: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  modelList: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  modelListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.separator,
  },
  modelListTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modelListSubtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
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
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  modelGrid: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  modelCard: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  modelCardActive: {
    backgroundColor: Colors.primaryBg,
    borderWidth: 1,
    borderColor: Colors.primary,
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
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteCheckboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modelCardName: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  modelCardManufacturer: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginRight: Spacing.sm,
  },
  modelCardPrice: {
    fontSize: 12,
    color: Colors.warning,
    marginRight: Spacing.sm,
  },
  modelCardPriceNote: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  selectedIndicator: {
    marginLeft: 'auto',
  },
  editFooter: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: 0.5,
    borderTopColor: Colors.separator,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
