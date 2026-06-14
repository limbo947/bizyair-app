import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
const SLIDE_THRESHOLD = 0.2;

/* ════════════════════════════════════════════════════════
   ImageViewerContent — 图片预览内容（key 驱动 remount 复位）
   ════════════════════════════════════════════════════════ */

/**
 * 图片预览内容组件。
 * 通过 key prop 在每次 Modal 打开时强制 remount，自动复位所有状态，
 * 无需在 effect 中手动 setState。
 */
function ImageViewerContent({ urls, totalCount, prompt, onClose, colors, styles }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  /* ── 动画值 ── */
  const [scale] = useState(() => new Animated.Value(1));
  const [panX] = useState(() => new Animated.Value(0));
  const [panY] = useState(() => new Animated.Value(0));
  const [slideDelta] = useState(() => new Animated.Value(0));
  const [fadeOpacity] = useState(() => new Animated.Value(1));

  /* ── 手势状态 ── */
  const baseScale = useRef(1);
  const lastScale = useRef(1);
  const lastPanX = useRef(0);
  const lastPanY = useRef(0);
  const lastSlideDelta = useRef(0);
  const lastDistance = useRef(0);
  const gestureMoved = useRef(false);
  const isZoomedAtStart = useRef(false);
  const touchStart = useRef({ x: 0, y: 0 });
  const lastTapTime = useRef(0);

  /* ── JS 侧动画值快照 ── */
  const currentIndexRef = useRef(0);
  const panXValue = useRef(0);
  const panYValue = useRef(0);
  const slideDeltaValue = useRef(0);
  const scaleValue = useRef(1);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  useEffect(() => {
    const ids = [];
    ids.push(scale.addListener(({ value }) => { scaleValue.current = value; }));
    ids.push(panX.addListener(({ value }) => { panXValue.current = value; }));
    ids.push(panY.addListener(({ value }) => { panYValue.current = value; }));
    ids.push(slideDelta.addListener(({ value }) => { slideDeltaValue.current = value; }));
    return () => {
      scale.removeListener(ids[0]);
      panX.removeListener(ids[1]);
      panY.removeListener(ids[2]);
      slideDelta.removeListener(ids[3]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 预加载相邻图片 ── */
  useEffect(() => {
    if (totalCount > 1) {
      [currentIndex - 1, currentIndex + 1].forEach((i) => {
        if (i >= 0 && i < totalCount) {
          Image.prefetch(urls[i]);
        }
      });
    }
  }, [currentIndex, totalCount, urls]);

  /* ── 复位缩放 ── */
  const resetTransform = useCallback(() => {
    baseScale.current = 1;
    scale.setValue(1);
    panX.setValue(0);
    panY.setValue(0);
  }, [scale, panX, panY]);

  /* ── 导航到指定索引（淡入淡出） ── */
  const goToIndex = useCallback((index) => {
    if (index < 0 || index >= totalCount) return;
    if (index === currentIndexRef.current) return;

    resetTransform();
    Animated.timing(fadeOpacity, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      slideDelta.setValue(0);
      panX.setValue(0);
      panY.setValue(0);
      setCurrentIndex(index);
      Animated.timing(fadeOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }, [resetTransform, fadeOpacity, slideDelta, panX, panY, totalCount]);

  /* ── 单击 / 双击缩放 ── */
  const handleSingleTap = useCallback(() => {
    setShowInfo((v) => !v);
  }, []);

  const handleDoubleTapZoom = useCallback(() => {
    const { x, y } = touchStart.current;
    const centerX = SCREEN_WIDTH / 2;
    const centerY = SCREEN_HEIGHT / 2;

    if (baseScale.current > 1.05) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
        Animated.spring(panX, { toValue: 0, useNativeDriver: true, friction: 7 }),
        Animated.spring(panY, { toValue: 0, useNativeDriver: true, friction: 7 }),
      ]).start();
      baseScale.current = 1;
    } else {
      const newScale = DOUBLE_TAP_SCALE;
      const offsetX = (centerX - x) * (newScale - 1);
      const offsetY = (centerY - y) * (newScale - 1);

      Animated.parallel([
        Animated.spring(scale, { toValue: newScale, useNativeDriver: true, friction: 7 }),
        Animated.spring(panX, { toValue: offsetX, useNativeDriver: true, friction: 7 }),
        Animated.spring(panY, { toValue: offsetY, useNativeDriver: true, friction: 7 }),
      ]).start();
      baseScale.current = newScale;
    }
  }, [scale, panX, panY]);

  const singleTapRef = useRef(handleSingleTap);
  const doubleTapRef = useRef(handleDoubleTapZoom);
  useEffect(() => { singleTapRef.current = handleSingleTap; }, [handleSingleTap]);
  useEffect(() => { doubleTapRef.current = handleDoubleTapZoom; }, [handleDoubleTapZoom]);

  /* ── 下载 ── */
  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      if (urls.length > 1) {
        await triggerBatchDownload(urls);
      } else if (urls[0]) {
        await triggerDownload(urls[0]);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, urls]);

  /* ── PanResponder ── */
  // eslint-disable-next-line react-hooks/refs
  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gs) => {
        return Math.abs(gs.dx) > 4 || Math.abs(gs.dy) > 4
          || (evt.nativeEvent.touches && evt.nativeEvent.touches.length >= 2);
      },
      onPanResponderGrant: (evt) => {
        lastScale.current = baseScale.current;
        lastPanX.current = panXValue.current;
        lastPanY.current = panYValue.current;
        lastSlideDelta.current = slideDeltaValue.current;
        lastDistance.current = 0;
        gestureMoved.current = false;
        isZoomedAtStart.current = baseScale.current > 1.05;

        const t0 = evt.nativeEvent.touches?.[0];
        if (t0) {
          touchStart.current = { x: t0.pageX, y: t0.pageY };
        }
        if (evt.nativeEvent.touches && evt.nativeEvent.touches.length >= 2) {
          const t1 = evt.nativeEvent.touches[1];
          const dx = t1.pageX - t0.pageX;
          const dy = t1.pageY - t0.pageY;
          lastDistance.current = Math.sqrt(dx * dx + dy * dy);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8) {
          gestureMoved.current = true;
        }
        const touches = evt.nativeEvent.touches;

        if (touches && touches.length >= 2) {
          // 双指捏合缩放
          const dx = touches[1].pageX - touches[0].pageX;
          const dy = touches[1].pageY - touches[0].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (lastDistance.current > 0) {
            const newScale = lastScale.current * (distance / lastDistance.current);
            const clamped = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
            baseScale.current = clamped;
            scale.setValue(clamped);
          }
          lastDistance.current = distance;
        } else if (touches && touches.length === 1) {
          if (isZoomedAtStart.current || baseScale.current > 1.05) {
            panX.setValue(lastPanX.current + gestureState.dx);
            panY.setValue(lastPanY.current + gestureState.dy);
          } else if (totalCount > 1) {
            slideDelta.setValue(lastSlideDelta.current + gestureState.dx);
          }
        }
      },
      onPanResponderRelease: (evt) => {
        lastDistance.current = 0;

        if (!gestureMoved.current) {
          const now = Date.now();
          if (now - lastTapTime.current < 300) {
            doubleTapRef.current();
            lastTapTime.current = 0;
          } else {
            lastTapTime.current = now;
            singleTapRef.current();
          }
          if (baseScale.current <= 1.05) {
            Animated.spring(slideDelta, { toValue: 0, useNativeDriver: true, friction: 7 }).start();
          }
          return;
        }

        if (baseScale.current <= 1.05) {
          const currentSlide = slideDeltaValue.current;
          const threshold = SCREEN_WIDTH * SLIDE_THRESHOLD;
          const velocity = evt.nativeEvent.velocityX || 0;
          const fastSwipe = Math.abs(velocity) > 0.5;

          if (totalCount > 1 && (Math.abs(currentSlide) > threshold || fastSwipe)) {
            const direction = (currentSlide > 0 || velocity > 0) ? -1 : 1;
            const targetIdx = currentIndexRef.current + direction;

            if (targetIdx >= 0 && targetIdx < totalCount) {
              Animated.spring(slideDelta, {
                toValue: (direction === -1 ? 1 : -1) * SCREEN_WIDTH,
                velocity,
                useNativeDriver: true,
                overshootClamping: true,
                friction: 26,
                tension: 180,
              }).start(() => {
                slideDelta.setValue(0);
                panX.setValue(0);
                panY.setValue(0);
                setCurrentIndex(targetIdx);
              });
            } else {
              Animated.spring(slideDelta, { toValue: 0, velocity, useNativeDriver: true, friction: 7 }).start();
            }
          } else {
            Animated.spring(slideDelta, { toValue: 0, velocity, useNativeDriver: true, friction: 7 }).start();
          }
        } else {
          const curScale = baseScale.current;
          const maxPan = Math.max(0, (curScale - 1) * SCREEN_WIDTH / 2);
          const maxPanY = Math.max(0, (curScale - 1) * SCREEN_HEIGHT / 2);
          const curX = panXValue.current;
          const curY = panYValue.current;
          const clampedX = Math.max(-maxPan, Math.min(maxPan, curX));
          const clampedY = Math.max(-maxPanY, Math.min(maxPanY, curY));

          if (clampedX !== curX || clampedY !== curY) {
            Animated.parallel([
              Animated.spring(panX, { toValue: clampedX, useNativeDriver: true, friction: 7 }),
              Animated.spring(panY, { toValue: clampedY, useNativeDriver: true, friction: 7 }),
            ]).start();
          }
        }
      },
      onPanResponderTerminate: () => {
        lastDistance.current = 0;
        if (baseScale.current <= 1.05) {
          Animated.spring(slideDelta, { toValue: 0, useNativeDriver: true, friction: 7 }).start();
        }
      },
    })
  );

  /* ── 渲染派生 ── */
  const currentUrl = urls[currentIndex] || null;
  const prevUrl = currentIndex > 0 ? urls[currentIndex - 1] : null;
  const nextUrl = currentIndex < totalCount - 1 ? urls[currentIndex + 1] : null;
  const showNav = totalCount > 1;
  const composedTranslateX = Animated.add(slideDelta, panX);

  return (
    <View style={styles.overlay}>
      {/* ── 手势层 + 缩放/平移容器 ── */}
      <View style={StyleSheet.absoluteFillObject} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.zoomContainer,
            {
              opacity: fadeOpacity,
              transform: [
                { scale },
                { translateX: composedTranslateX },
                { translateY: panY },
              ],
            },
          ]}
        >
          {/* ── 三图行 ── */}
          <View style={styles.imageRow}>
            <View style={styles.imageCell}>
              {prevUrl ? (
                <Image source={{ uri: prevUrl }} style={styles.image}
                  contentFit="contain" cachePolicy="memory-disk"
                  recyclingKey={prevUrl}
                />
              ) : null}
            </View>
            <View style={styles.imageCell}>
              {currentUrl ? (
                <Image source={{ uri: currentUrl }} style={styles.image}
                  contentFit="contain" cachePolicy="memory-disk"
                  recyclingKey={currentUrl}
                />
              ) : null}
            </View>
            <View style={styles.imageCell}>
              {nextUrl ? (
                <Image source={{ uri: nextUrl }} style={styles.image}
                  contentFit="contain" cachePolicy="memory-disk"
                  recyclingKey={nextUrl}
                />
              ) : null}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* ── 信息覆盖层 ── */}
      {showInfo ? (
        <>
          <View style={styles.topBar} pointerEvents="box-none">
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && pressedOpacity()]}
              onPress={onClose}
            >
              <Ionicons name="chevron-down" size={24} color={colors.textOnOverlay} />
            </Pressable>
            {showNav ? (
              <View style={styles.pageIndicator}>
                <Text style={styles.pageIndicatorText}>
                  {currentIndex + 1} / {totalCount}
                </Text>
              </View>
            ) : null}
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && pressedOpacity()]}
              onPress={handleDownload}
              disabled={isDownloading}
            >
              <Ionicons
                name={isDownloading ? 'hourglass-outline' : 'download-outline'}
                size={24}
                color={colors.textOnOverlay}
              />
            </Pressable>
          </View>

          {showNav ? (
            <View style={styles.navButtons} pointerEvents="box-none">
              {currentIndex > 0 ? (
                <Pressable
                  style={({ pressed }) => [styles.navBtn, pressed && pressedOpacity()]}
                  onPress={() => goToIndex(currentIndex - 1)}
                >
                  <Ionicons name="chevron-back" size={28} color={colors.textOnOverlay} />
                </Pressable>
              ) : <View style={styles.navBtnPlaceholder} />}
              {currentIndex < totalCount - 1 ? (
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

          {showNav ? (
            <View style={styles.thumbnailStrip} pointerEvents="box-none">
              <View style={styles.thumbnailList}>
                {urls.map((url, idx) => (
                  <Pressable
                    key={`${idx}_${url}`}
                    style={({ pressed }) => [
                      styles.thumbnailItem,
                      idx === currentIndex && styles.thumbnailItemActive,
                      pressed && pressedOpacity(),
                    ]}
                    onPress={() => goToIndex(idx)}
                  >
                    <Image source={{ uri: url }} style={styles.thumbnailImage}
                      contentFit="cover" cachePolicy="memory-disk"
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
  );
}

/* ════════════════════════════════════════════════════════
   ImageViewer — 外层壳：数据派生 + key 驱动的 remount
   ════════════════════════════════════════════════════════ */

/**
 * 全屏图片预览组件（顶层入口）。
 *
 * 核心机制：
 * - visible 变为 true 时递增 resetKey，强制 ImageViewerContent 卸载后重新挂载，
 *   所有内部 state / ref 自然回到初始值，无需 effect 内 setState。
 * - 三图渲染（prev / current / next）：滑动切换图片零闪烁。
 * - 双击缩放：以触点为中心在 1x ↔ 2.5x 之间切换。
 * - 手势协调：双指缩放 > 缩放后平移 > 未缩放滑动。
 */
export function ImageViewer({ visible, imageUrl, imageUrls, prompt, onClose }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  const urls = useMemo(
    () => imageUrls?.length > 0 ? imageUrls : (imageUrl ? [imageUrl] : []),
    [imageUrl, imageUrls]
  );
  const totalCount = urls.length;

  /* Modal 每次打开时递增 key，触发子组件 remount → 自动复位
     在 render 阶段检测 visible prop 跳变 → 更新派生状态 key，
     这是 React 官方推荐的「在渲染期间更新 state」模式。 */
  const [prevVisible, setPrevVisible] = useState(visible);
  const [resetKey, setResetKey] = useState(0);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setResetKey((k) => k + 1);
    }
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageViewerContent
        key={resetKey}
        urls={urls}
        totalCount={totalCount}
        prompt={prompt}
        onClose={onClose}
        colors={colors}
        styles={styles}
      />
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════ */

const createStyles = (colors) => ({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    overflow: 'hidden',
  },
  zoomContainer: {
    flex: 1,
  },
  imageRow: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 3,
    marginLeft: -SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageCell: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
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
