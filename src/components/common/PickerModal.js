import React from 'react';
import { Pressable, Text, View, ScrollView, Modal } from 'react-native';
import { Radius, Spacing, Typography, Shadow, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const createStyles = (colors) => ({
  overlay: { flex: 1, backgroundColor: colors.overlayLight, justifyContent: 'center', alignItems: 'center' },
  content: { width: '80%', backgroundColor: colors.card, borderRadius: Radius.lg, borderCurve: 'continuous', overflow: 'hidden', ...Shadow.lg },
  title: { fontSize: Typography.fontSize.headline, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  scroll: { maxHeight: '70%' },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  optionActive: { backgroundColor: colors.primaryBg },
  optionBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  optionText: { fontSize: Typography.fontSize.callout, color: colors.textSecondary },
  optionTextActive: { color: colors.primary, fontWeight: Typography.fontWeight.semibold },
  optionCount: { fontSize: Typography.fontSize.footnote, color: colors.textTertiary },
  optionCountActive: { color: colors.primary },
  check: { fontSize: Typography.fontSize.title3, color: colors.primary, fontWeight: Typography.fontWeight.semibold },
});

/**
 * 统一的居中选择器 Modal
 * @param {boolean} visible - 是否显示
 * @param {function} onClose - 关闭回调
 * @param {string} title - 标题
 * @param {Array} options - 选项列表 [{ key, label, count? }]
 * @param {string} selectedKey - 当前选中项的 key
 * @param {function} onSelect - 选中回调 (key) => void
 */
export function PickerModal({ visible, onClose, title, options, selectedKey, onSelect }) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {options.map((opt, index) => (
              <Pressable
                key={opt.key}
                style={({ pressed }) => [
                  styles.option,
                  selectedKey === opt.key && styles.optionActive,
                  index < options.length - 1 && styles.optionBorder,
                  pressed && pressedOpacity(),
                ]}
                onPress={() => { onSelect(opt.key); onClose(); }}
              >
                <Text style={[styles.optionText, selectedKey === opt.key && styles.optionTextActive]}>
                  {opt.label}
                  {opt.count !== undefined ? ` (${opt.count})` : ''}
                </Text>
                {selectedKey === opt.key ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
