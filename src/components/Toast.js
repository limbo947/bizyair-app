import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';

const ICON_MAP = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
};

const TYPE_STYLES = {
  success: { backgroundColor: '#10B981' },
  error: { backgroundColor: '#EF4444' },
  info: { backgroundColor: '#3B82F6' },
};

const createStyles = () => ({
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export function Toast({ message, type = 'info' }) {
  const styles = useThemedStyles(createStyles);
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

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.wrapper, TYPE_STYLES[type]]}>
        <Ionicons name={ICON_MAP[type]} size={16} color="#FFFFFF" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}
