import React, { useRef, useEffect, useCallback } from 'react';
import { View, TextInput, PanResponder, Platform } from 'react-native';
import { Radius, Spacing, Typography } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 400;

/**
 * 可调整高度的多行输入框，带右下角拖拽手柄。
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
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [height, setHeight] = React.useState(minHeight || MIN_HEIGHT);
  const heightRef = useRef(minHeight || MIN_HEIGHT);

  const effectiveMaxHeight = maxHeight || MAX_HEIGHT;

  useEffect(() => { heightRef.current = height; }, [height]);

  const handleContentSizeChange = useCallback((event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    if (contentHeight > height && contentHeight <= effectiveMaxHeight) {
      setHeight(contentHeight + 20);
    }
  }, [height, effectiveMaxHeight]);

  /* eslint-disable react-hooks/refs -- PanResponder must be stored in ref to persist across renders */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = Math.max(
          minHeight || MIN_HEIGHT,
          Math.min(effectiveMaxHeight, heightRef.current + gestureState.dy)
        );
        setHeight(newHeight);
      },
      onPanResponderRelease: () => {
        heightRef.current = height;
      },
    })
  ).current;
  /* eslint-enable react-hooks/refs */

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
        onContentSizeChange={handleContentSizeChange}
        scrollEnabled={height >= effectiveMaxHeight}
        returnKeyType="done"
        blurOnSubmit={true}
      />
      {/* eslint-disable-next-line react-hooks/refs -- panResponder.panHandlers must be spread during render for gesture handling */}
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
    borderCurve: 'continuous',
    backgroundColor: colors.bg,
  },
  input: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    borderWidth: 0,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    padding: Spacing.sm,
    backgroundColor: colors.bg,
    ...(Platform.OS === 'android' ? { includeFontPadding: false, fontFamily: 'System' } : {}),
  },
  resizeHandle: {
    position: 'absolute',
    right: Spacing.xs,
    bottom: Spacing.xs,
    padding: Spacing.xs,
    zIndex: 1,
  },
});
