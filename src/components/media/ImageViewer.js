import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { triggerDownload, triggerBatchDownload } from '../../utils/download';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ImageViewer({ visible, imageUrl, imageUrls, prompt, onClose }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const urlsRef = useRef([]);
  urlsRef.current = imageUrls?.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(0)).current;

  const baseScale = useRef(1);
  const lastScale = useRef(1);
  const lastDistance = useRef(0);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const gestureMoved = useRef(false);

  const currentIndexRef = useRef(0);
  const onCloseRef = useRef(onClose);
  const translateXValue = useRef(0);
  const translateYValue = useRef(0);
  const lastTapTime = useRef(0);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const xId = translateX.addListener(({ value }) => { translateXValue.current = value; });
    const yId = translateY.addListener(({ value }) => { translateYValue.current = value; });
    return () => {
      translateX.removeListener(xId);
      translateY.removeListener(yId);
    };
  }, [translateX, translateY]);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      setShowInfo(true);
      baseScale.current = 1;
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);
      slideX.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (urlsRef.current.length > 1) {
      const preloadIndices = [currentIndex - 1, currentIndex + 1];
      preloadIndices.forEach((i) => {
        if (i >= 0 && i < urlsRef.current.length) {
          Image.prefetch(urlsRef.current[i]);
        }
      });
    }
  }, [currentIndex]);

  const resetTransform = useCallback(() => {
    baseScale.current = 1;
    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
  }, [scale, translateX, translateY]);

  const goToIndex = useCallback((index) => {
    if (index < 0 || index >= urlsRef.current.length) return;
    resetTransform();
    setCurrentIndex(index);
    slideX.setValue(0);
  }, [resetTransform, slideX]);

  const goToIndexRef = useRef(goToIndex);
  useEffect(() => { goToIndexRef.current = goToIndex; }, [goToIndex]);

  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const urls = urlsRef.current;
      if (urls.length > 1) {
        await triggerBatchDownload(urls);
      } else if (urls[0]) {
        await triggerDownload(urls[0]);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastScale.current = baseScale.current;
        lastTranslateX.current = translateXValue.current;
        lastTranslateY.current = translateYValue.current;
        gestureMoved.current = false;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8) {
          gestureMoved.current = true;
        }

        const touches = evt.nativeEvent.touches;
        if (touches && touches.length === 2) {
          const dx = touches[1].pageX - touches[0].pageX;
          const dy = touches[1].pageY - touches[0].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (lastDistance.current > 0) {
            const newScale = lastScale.current * (distance / lastDistance.current);
            const clampedScale = Math.max(1, Math.min(newScale, 5));
            baseScale.current = clampedScale;
            scale.setValue(clampedScale);
          }
          lastDistance.current = distance;
        } else if (touches && touches.length === 1) {
          if (baseScale.current > 1) {
            const newX = lastTranslateX.current + gestureState.dx;
            const newY = lastTranslateY.current + gestureState.dy;
            translateX.setValue(newX);
            translateY.setValue(newY);
          } else if (urlsRef.current.length > 1) {
            slideX.setValue(gestureState.dx);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        lastDistance.current = 0;

        if (!gestureMoved.current) {
          const now = Date.now();
          if (now - lastTapTime.current < 300) {
            onCloseRef.current();
            lastTapTime.current = 0;
          } else {
            lastTapTime.current = now;
            setShowInfo((v) => !v);
          }
        }

        if (baseScale.current <= 1.1) {
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
          baseScale.current = 1;

          if (urlsRef.current.length > 1 && Math.abs(gestureState.dx) > SCREEN_WIDTH * 0.15) {
            const direction = gestureState.dx > 0 ? -1 : 1;
            const nextIndex = currentIndexRef.current + direction;
            if (nextIndex >= 0 && nextIndex < urlsRef.current.length) {
              Animated.timing(slideX, {
                toValue: -direction * SCREEN_WIDTH,
                duration: 200,
                useNativeDriver: true,
              }).start(() => {
                goToIndexRef.current(nextIndex);
              });
            } else {
              Animated.spring(slideX, { toValue: 0, useNativeDriver: true }).start();
            }
          } else {
            Animated.spring(slideX, { toValue: 0, useNativeDriver: true }).start();
          }
        }
      },
      onPanResponderTerminate: () => {
        lastDistance.current = 0;
        if (baseScale.current <= 1.1) {
          Animated.spring(slideX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  const currentUrl = urlsRef.current[currentIndex];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.overlayHeavy} />
      <View style={styles.overlay}>
        <View style={StyleSheet.absoluteFillObject} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                transform: [
                  { scale },
                  { translateX: Animated.add(translateX, slideX) },
                  { translateY },
                ],
              },
            ]}
          >
            {currentUrl ? (
              <Image
                source={{ uri: currentUrl }}
                style={styles.image}
                contentFit="contain"
                cachePolicy="memory-disk"
                recyclingKey={currentUrl}
              />
            ) : null}
          </Animated.View>
        </View>

        {showInfo ? (
          <>
            <View style={styles.topBar} pointerEvents="box-none">
              <Pressable
                style={({ pressed }) => [styles.iconBtn, pressed && pressedOpacity()]}
                onPress={onClose}
              >
                <Ionicons name="chevron-down" size={24} color={colors.textOnOverlay} />
              </Pressable>
              {urlsRef.current.length > 1 ? (
                <View style={styles.pageIndicator}>
                  <Text style={styles.pageIndicatorText}>
                    {currentIndex + 1} / {urlsRef.current.length}
                  </Text>
                </View>
              ) : null}
              <Pressable
                style={({ pressed }) => [styles.iconBtn, pressed && pressedOpacity()]}
                onPress={handleDownload}
                disabled={isDownloading}
              >
                <Ionicons name={isDownloading ? 'hourglass-outline' : 'download-outline'} size={24} color={colors.textOnOverlay} />
              </Pressable>
            </View>

            {urlsRef.current.length > 1 ? (
              <View style={styles.navButtons} pointerEvents="box-none">
                {currentIndex > 0 ? (
                  <Pressable
                    style={({ pressed }) => [styles.navBtn, pressed && pressedOpacity()]}
                    onPress={() => goToIndex(currentIndex - 1)}
                  >
                    <Ionicons name="chevron-back" size={28} color={colors.textOnOverlay} />
                  </Pressable>
                ) : <View style={styles.navBtnPlaceholder} />}
                {currentIndex < urlsRef.current.length - 1 ? (
                  <Pressable
                    style={({ pressed }) => [styles.navBtn, pressed && pressedOpacity()]}
                    onPress={() => goToIndex(currentIndex + 1)}
                  >
                    <Ionicons name="chevron-forward" size={28} color={colors.textOnOverlay} />
                  </Pressable>
                ) : <View style={styles.navBtnPlaceholder} />}
              </View>
            ) : null}

            {prompt ? (
              <View style={styles.bottomBar} pointerEvents="box-none">
                <Text style={styles.promptText} numberOfLines={3}>{prompt}</Text>
              </View>
            ) : null}

            {urlsRef.current.length > 1 ? (
              <View style={styles.thumbnailStrip} pointerEvents="box-none">
                <View style={styles.thumbnailList}>
                  {urlsRef.current.map((url, idx) => (
                    <Pressable
                      key={`${url}_${idx}`}
                      style={({ pressed }) => [
                        styles.thumbnailItem,
                        idx === currentIndex && styles.thumbnailItemActive,
                        pressed && pressedOpacity(),
                      ]}
                      onPress={() => goToIndex(idx)}
                    >
                      <Image
                        source={{ uri: url }}
                        style={styles.thumbnailImage}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        recyclingKey={`thumb_${idx}`}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </Modal>
  );
}

const createStyles = (colors) => ({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndicator: {
    backgroundColor: colors.overlayMedium,
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pageIndicatorText: {
    color: colors.textOnOverlay,
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.semibold,
  },
  navButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  promptText: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textOnOverlay,
    lineHeight: 20,
    textAlign: 'center',
  },
  thumbnailStrip: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  thumbnailList: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.overlayLight,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  thumbnailItem: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailItemActive: {
    borderColor: colors.textOnOverlay,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
