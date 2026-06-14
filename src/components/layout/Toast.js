import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';

const ICON_MAP = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
};

const TYPE_STYLE_KEYS = {
  success: 'typeSuccess',
  error: 'typeError',
  info: 'typeInfo',
};

const createStyles = (colors, theme) => ({
  container: {
    position: 'absolute',
    top: 60,
    left: '50%',
    transform: [{ translateX: -Dimensions.get('window').width / 2 }],
    width: Dimensions.get('window').width - 40,
    zIndex: 9999,
    elevation: 9999,
  },
  wrapper: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    ...theme.shadow.md,
  },
  typeSuccess: { backgroundColor: colors.success },
  typeError: { backgroundColor: colors.error },
  typeInfo: { backgroundColor: colors.primary },
  text: {
    color: colors.textInverse,
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
});

export function Toast({ message, type = 'info' }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  // eslint-disable-next-line react-hooks/refs -- Animated.Value must be stored in ref to persist across renders
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });
    fadeIn.start();
    return () => {
      fadeIn.stop();
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };
  }, [opacity]);

  const typeStyleKey = TYPE_STYLE_KEYS[type] || 'typeInfo';

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.wrapper, styles[typeStyleKey]]}>
        <Ionicons name={ICON_MAP[type]} size={16} color={colors.textInverse} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}
