import React, { useRef, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, PanResponder } from 'react-native';
import { Radius, Spacing } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 400;

/**
 * 可调整高度的多行输入框，带"清空"按钮和右下角拖拽手柄。
 */
export function ResizableTextInput({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  maxLength,
  style,
  inputStyle,
  minHeight,
  maxHeight,
  hideClear = false,
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [height, setHeight] = React.useState(minHeight || MIN_HEIGHT);
  const heightRef = useRef(minHeight || MIN_HEIGHT);

  useEffect(() => { heightRef.current = height; }, [height]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = Math.max(
          minHeight || MIN_HEIGHT,
          Math.min(maxHeight || MAX_HEIGHT, heightRef.current + gestureState.dy)
        );
        setHeight(newHeight);
      },
      onPanResponderRelease: () => {
        heightRef.current = height;
      },
    })
  ).current;

  return (
    <View style={[styles.wrapper, { height }, style]}>
      <TextInput
        style={[styles.input, { height }, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || colors.textPlaceholder}
        textAlignVertical="top"
        showsVerticalScrollIndicator={false}
      />
      {!hideClear && value && value.length > 0 ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          activeOpacity={0.6}
        >
          <Text style={styles.clearButtonText}>清空</Text>
        </TouchableOpacity>
      ) : null}
      <View style={styles.resizeHandle} {...panResponder.panHandlers}>
        <MaterialCommunityIcons name="resize-bottom-right" size={14} color={colors.textTertiary} />
      </View>
    </View>
  );
}

const createStyles = (colors) => ({
  wrapper: {
    position: 'relative',
    borderRadius: Radius.sm,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  input: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    textAlignVertical: 'top',
    borderWidth: 0,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingRight: 24,
    backgroundColor: colors.bg,
  },
  clearButton: {
    position: 'absolute',
    top: 4,
    right: 28,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    zIndex: 2,
    backgroundColor: colors.bg,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#4A9EF5',
    fontWeight: '500',
  },
  resizeHandle: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    padding: 4,
    zIndex: 1,
  },
});
