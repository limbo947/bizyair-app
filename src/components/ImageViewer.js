import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
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

  // Android / iOS
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要存储权限才能保存图片');
      return;
    }
    const localUri = `${FileSystem.cacheDirectory}bizyair_image.jpg`;
    const downloadResult = await FileSystem.downloadAsync(url, localUri);
    await MediaLibrary.createAssetAsync(downloadResult.uri);
    Alert.alert('下载成功', '图片已保存到相册');
  } catch (err) {
    Alert.alert('下载失败', err.message || '请检查网络连接');
  }
}

export function ImageViewer({ visible, imageUrl, imageUrls, prompt, onClose }) {
  const urlsRef = useRef([]);
  urlsRef.current = imageUrls?.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []);
  const urls = urlsRef.current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSize, setImageSize] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(0)).current;

  const lastScale = useRef(1);
  const lastDistance = useRef(0);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const baseScale = useRef(1);
  const gestureMoved = useRef(false);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setShowInfo(true);
      baseScale.current = 1;
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);
      slideX.setValue(0);
    }
  }, [visible, scale, slideX, translateX, translateY]);

  useEffect(() => {
    const url = urls[currentIndex];
    if (url) {
      Image.getSize(
        url,
        (imgW, imgH) => setImageSize({ width: imgW, height: imgH }),
        () => setImageSize(null)
      );
    }
  }, [currentIndex, urls]);

  const resetTransform = useCallback(() => {
    baseScale.current = 1;
    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
  }, [scale, translateX, translateY]);

  const goToIndex = useCallback((index) => {
    if (index < 0 || index >= urlsRef.current.length) return;
    resetTransform();
    setImageSize(null);
    setCurrentIndex(index);
    slideX.setValue(0);
  }, [resetTransform, slideX]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        lastScale.current = baseScale.current;
        lastTranslateX.current = (translateX)._value || 0;
        lastTranslateY.current = (translateY)._value || 0;
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
        } else if (touches && touches.length === 1 && baseScale.current > 1) {
          const newX = lastTranslateX.current + gestureState.dx;
          const newY = lastTranslateY.current + gestureState.dy;
          translateX.setValue(newX);
          translateY.setValue(newY);
        } else if (touches && touches.length === 1 && baseScale.current <= 1 && urls.length > 1) {
          slideX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        lastDistance.current = 0;
        if (!gestureMoved.current) {
          setShowInfo((v) => !v);
        }
        if (baseScale.current <= 1.1) {
          Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          ]).start();
          baseScale.current = 1;

          if (urls.length > 1 && Math.abs(gestureState.dx) > SCREEN_WIDTH * 0.15) {
            const direction = gestureState.dx > 0 ? -1 : 1;
            const nextIndex = currentIndex + direction;
            if (nextIndex >= 0 && nextIndex < urls.length) {
              Animated.timing(slideX, {
                toValue: -direction * SCREEN_WIDTH,
                duration: 200,
                useNativeDriver: true,
              }).start(() => {
                goToIndex(nextIndex);
              });
            } else {
              Animated.spring(slideX, { toValue: 0, useNativeDriver: true }).start();
            }
          } else {
            Animated.spring(slideX, { toValue: 0, useNativeDriver: true }).start();
          }
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

  const currentUrl = urls[currentIndex];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.85)" />
      <View style={styles.overlay}>
        {/* 背景点击区域 - 点击关闭 */}
        <TouchableOpacity
          style={styles.backgroundTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* 图片区域 - 手势处理 */}
        <View style={styles.imageArea} {...panResponder.panHandlers}>
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
                resizeMode="contain"
              />
            ) : null}
          </Animated.View>
        </View>

        {showInfo ? (
          <>
            <View style={styles.topBar} pointerEvents="box-none">
              <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              {urls.length > 1 ? (
                <View style={styles.pageIndicator}>
                  <Text style={styles.pageIndicatorText}>{currentIndex + 1} / {urls.length}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => triggerDownload(currentUrl)}
              >
                <Ionicons name="download-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {urls.length > 1 ? (
              <View style={styles.navButtons} pointerEvents="box-none">
                {currentIndex > 0 ? (
                  <TouchableOpacity
                    style={[styles.navBtn, styles.navBtnLeft]}
                    onPress={() => goToIndex(currentIndex - 1)}
                  >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                  </TouchableOpacity>
                ) : null}
                {currentIndex < urls.length - 1 ? (
                  <TouchableOpacity
                    style={[styles.navBtn, styles.navBtnRight]}
                    onPress={() => goToIndex(currentIndex + 1)}
                  >
                    <Ionicons name="chevron-forward" size={28} color="#fff" />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}

            {prompt ? (
              <View style={styles.bottomBar} pointerEvents="box-none">
                <Text style={styles.promptText} numberOfLines={3}>{prompt}</Text>
              </View>
            ) : null}

            {urls.length > 1 ? (
              <View style={styles.thumbnailStrip} pointerEvents="box-none">
                <View style={styles.thumbnailList}>
                  {urls.map((url, idx) => (
                    <TouchableOpacity
                      key={`${url}_${idx}`}
                      style={[
                        styles.thumbnailItem,
                        idx === currentIndex && styles.thumbnailItemActive,
                      ]}
                      onPress={() => goToIndex(idx)}
                    >
                      <Image source={{ uri: url }} style={styles.thumbnailImage} />
                    </TouchableOpacity>
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
  backgroundTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  imageArea: {
    maxWidth: '95%',
    maxHeight: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnLeft: {},
  navBtnRight: {},
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
