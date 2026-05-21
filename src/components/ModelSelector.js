import React, { useState, useRef } from 'react';
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
import { Colors, Shadows, Radius, Spacing } from '../constants/theme';

const MODEL_IDS = Object.keys(MODELS);

export function ModelSelector({
  currentModel,
  modelId,
  showDropdown,
  onToggleDropdown,
  onSelectModel,
}) {
  const dropdownButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const handleDropdownButtonLayout = (event) => {
    const { x, y, height } = event.nativeEvent.layout;
    setDropdownPosition({ x, y: y + height + 4 });
  };

  return (
    <>
      <TouchableOpacity
        ref={dropdownButtonRef}
        style={styles.modelSelector}
        onPress={onToggleDropdown}
        onLayout={handleDropdownButtonLayout}
        activeOpacity={0.7}
      >
        <Ionicons name={currentModel.icon.name} size={18} color={currentModel.icon.color} />
        <Text style={styles.modelSelectorText}>{currentModel.name}</Text>
        <Text style={styles.modelSelectorArrow}>⌄</Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={onToggleDropdown}
      >
        <Pressable style={styles.modelDropdownOverlay} onPress={onToggleDropdown}>
          <View style={[styles.dropdownContainer, { top: dropdownPosition.y, left: dropdownPosition.x }]}>
            <View style={styles.dropdown}>
              <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
                {MODEL_IDS.map((id, index) => {
                  const model = MODELS[id];
                  const isActive = modelId === id;
                  return (
                    <TouchableOpacity
                      key={id}
                      style={[
                        styles.dropdownItem,
                        isActive && styles.dropdownItemActive,
                        index < MODEL_IDS.length - 1 && styles.dropdownItemBorder,
                      ]}
                      onPress={() => onSelectModel(id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={model.icon.name} size={18} color={isActive ? Colors.primary : model.icon.color} style={styles.dropdownItemIcon} />
                      <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                        {model.name}
                      </Text>
                      {isActive && (
                        <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={styles.dropdownItemCheck} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modelSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm, gap: Spacing.xs },
  modelSelectorText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  modelSelectorArrow: { fontSize: 16, color: Colors.textSecondary, marginTop: -4 },
  modelDropdownOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: { position: 'absolute', zIndex: 1000 },
  dropdown: { backgroundColor: Colors.card, borderRadius: Radius.md, ...Shadows.lg, maxHeight: 320, minWidth: 180, overflow: 'hidden' },
  dropdownList: { maxHeight: 320 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  dropdownItemActive: { backgroundColor: Colors.primaryBg },
  dropdownItemBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.separator },
  dropdownItemIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  dropdownItemText: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  dropdownItemTextActive: { color: Colors.primary, fontWeight: '600' },
  dropdownItemCheck: { marginLeft: Spacing.sm },
});