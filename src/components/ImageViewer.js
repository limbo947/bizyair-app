import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function triggerDownload(url) {
  if (Platform.OS === 'web') {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bizyair_image.jpg';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } else {
    const { Linking, NativeModules } = require('react-native');
    const { AndroidDownloadManager } = NativeModules;
    if (Platform.OS === 'android' && AndroidDownloadManager) {
      AndroidDownloadManager.downloadFile(url, 'bizyair_image.jpg');
    } else {
      Linking.openURL(url);
    }
  }
}

export function ImageViewer({ visible, imageUrl, prompt, onClose }) {
  const [imageSize, setImageSize] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const lastScale = useRef(1);
  const lastDistance = useRef(0);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const baseScale = useRef(1);
  const gestureMoved = useRef(false);

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
        }
      },
      onPanResponderRelease: () => {
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
        }
      },
    })
  ).current;

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(
        imageUrl,
        (imgW, imgH) => setImageSize({ width: imgW, height: imgH }),
        () => {}
      );
    }
  }, [imageUrl]);

  useEffect(() => {
    if (visible) {
      setShowInfo(true);
      baseScale.current = 1;
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);
    }
  }, [visible]);

  const displayWidth = imageSize
    ? Math.min(imageSize.width, SCREEN_WIDTH * 0.95)
    : SCREEN_WIDTH * 0.9;
  const displayHeight = imageSize
    ? Math.min((imageSize.height / imageSize.width) * displayWidth, SCREEN_HEIGHT * 0.8)
    : SCREEN_WIDTH * 0.9;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.85)" />
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.imageArea} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                transform: [
                  { scale },
                  { translateX },
                  { translateY },
                ],
              },
            ]}
          >
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, { width: displayWidth, height: displayHeight }]}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {showInfo ? (
          <>
            <View style={styles.topBar} pointerEvents="box-none">
              <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => triggerDownload(imageUrl)}
              >
                <Ionicons name="download-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {prompt ? (
              <View style={styles.bottomBar} pointerEvents="box-none">
                <Text style={styles.promptText} numberOfLines={3}>{prompt}</Text>
              </View>
            ) : null}
          </>
        ) : null}
      </TouchableOpacity>
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
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
});
