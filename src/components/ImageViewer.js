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
  Platform,
  Alert,
  Image as RNImage,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Spacing } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

async function triggerDownload(url) {
  if (Platform.OS === 'web') {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bizyair_image.jpg';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return;
  }

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要存储权限才能保存图片');
      return;
    }
    const destination = new File(Paths.cache, 'bizyair_image.jpg');
    const downloadedFile = await File.downloadFileAsync(url, destination);
    await MediaLibrary.createAssetAsync(downloadedFile.uri);
    Alert.alert('下载成功', '图片已保存到相册');
  } catch (err) {
    Alert.alert('下载失败', err.message || '请检查网络连接');
  }
}

export function ImageViewer({ visible, imageUrl, imageUrls, prompt, onClose }) {
  const urlsRef = useRef([]);
  urlsRef.current = imageUrls?.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSize, setImageSize] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Animated.Value refs are stable
  }, [visible]);

  useEffect(() => {
    const url = urlsRef.current[currentIndex];
    if (url) {
      RNImage.getSize(
        url,
        (imgW, imgH) => setImageSize({ width: imgW, height: imgH }),
        () => setImageSize(null)
      );
    }
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

  const displayWidth = imageSize
    ? Math.min(imageSize.width, SCREEN_WIDTH * 0.95)
    : SCREEN_WIDTH * 0.9;
  const displayHeight = imageSize
    ? Math.min((imageSize.height / imageSize.width) * displayWidth, SCREEN_HEIGHT * 0.8)
    : SCREEN_WIDTH * 0.9;

  if (!visible) return null;

  const currentUrl = urlsRef.current[currentIndex];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.85)" />
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
                style={[styles.image, { width: displayWidth, height: displayHeight }]}
                contentFit="contain"
                cachePolicy="memory-disk"
                transition={150}
              />
            ) : null}
          </Animated.View>
        </View>

        {showInfo ? (
          <>
            <View style={styles.topBar} pointerEvents="box-none">
              <Pressable
                style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
              {urlsRef.current.length > 1 ? (
                <View style={styles.pageIndicator}>
                  <Text style={styles.pageIndicatorText}>
                    {currentIndex + 1} / {urlsRef.current.length}
                  </Text>
                </View>
              ) : null}
              <Pressable
                style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
                onPress={() => triggerDownload(currentUrl)}
              >
                <Ionicons name="download-outline" size={24} color="#fff" />
              </Pressable>
            </View>

            {urlsRef.current.length > 1 ? (
              <View style={styles.navButtons} pointerEvents="box-none">
                {currentIndex > 0 ? (
                  <Pressable
                    style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.7 }]}
                    onPress={() => goToIndex(currentIndex - 1)}
                  >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                  </Pressable>
                ) : <View style={styles.navBtnPlaceholder} />}
                {currentIndex < urlsRef.current.length - 1 ? (
                  <Pressable
                    style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.7 }]}
                    onPress={() => goToIndex(currentIndex + 1)}
                  >
                    <Ionicons name="chevron-forward" size={28} color="#fff" />
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
                        pressed && { opacity: 0.7 },
                      ]}
                      onPress={() => goToIndex(idx)}
                    >
                      <Image
                        source={{ uri: url }}
                        style={styles.thumbnailImage}
                        contentFit="cover"
                        cachePolicy="memory-disk"
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {},
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pageIndicatorText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
  },
  thumbnailItem: {
    width: 48,
    height: 48,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailItemActive: {
    borderColor: '#fff',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});
