import React from 'react';
import { Pressable, View, Modal } from 'react-native';
import { Radius, Spacing, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';

const createStyles = (colors) => ({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayLight,
    justifyContent: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: 0,
  },
  overlayLeft: { alignItems: 'flex-start' },
  overlayRight: { alignItems: 'flex-end' },
  dropdown: {
    backgroundColor: colors.card,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
});

/**
 * 统一的浮层下拉 Modal
 * @param {boolean} visible - 是否显示
 * @param {function} onClose - 关闭回调
 * @param {number} triggerTop - 触发按钮的 Y 坐标（屏幕坐标）
 * @param {number|string} width - 面板宽度（数字或百分比字符串）
 * @param {'left'|'right'} align - 面板对齐方向
 * @param {React.ReactNode} children - 面板内容
 */
export function DropdownModal({ visible, onClose, triggerTop, width, align = 'left', children }) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={({ pressed }) => [
          styles.overlay,
          align === 'right' ? styles.overlayRight : styles.overlayLeft,
          { paddingTop: triggerTop || 0 },
          pressed && pressedOpacity(),
        ]}
        onPress={onClose}
      >
        <View style={{ width: width || 260 }}>
          <Pressable>
            <View style={styles.dropdown}>
              {children}
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
