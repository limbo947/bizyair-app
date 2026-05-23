import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Colors, Radius, Spacing } from '../constants/theme';

/**
 * 音频播放器组件，支持应用内在线试听。
 */
export function AudioPlayer({ visible, audioUrl, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState('');
  const soundRef = useRef(null);
  const positionInterval = useRef(null);

  // 关闭时卸载音频
  useEffect(() => {
    if (!visible) {
      stopAndUnload();
    }
  }, [visible]);

  // 组件卸载时清理
  useEffect(() => {
    return () => { stopAndUnload(); };
  }, []);

  const stopAndUnload = async () => {
    if (positionInterval.current) {
      clearInterval(positionInterval.current);
      positionInterval.current = null;
    }
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    setError('');
  };

  const handlePlay = useCallback(async () => {
    if (!audioUrl) return;

    if (isPlaying && soundRef.current) {
      // 暂停
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      if (positionInterval.current) {
        clearInterval(positionInterval.current);
        positionInterval.current = null;
      }
      return;
    }

    if (soundRef.current && !isPlaying) {
      // 恢复播放
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.positionMillis === status.durationMillis) {
          // 播放完毕，重新开始
          await soundRef.current.replayAsync();
        } else {
          await soundRef.current.playAsync();
        }
        setIsPlaying(true);
        startPositionTracking();
      } catch (e) {
        setError('播放失败');
      }
      return;
    }

    // 首次加载
    setIsLoading(true);
    setError('');
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsPlaying(true);
      setIsLoading(false);
      startPositionTracking();
    } catch (e) {
      setIsLoading(false);
      setError('音频加载失败，请检查网络连接');
    }
  }, [audioUrl, isPlaying]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        if (positionInterval.current) {
          clearInterval(positionInterval.current);
          positionInterval.current = null;
        }
      }
    }
  };

  const startPositionTracking = () => {
    if (positionInterval.current) clearInterval(positionInterval.current);
    positionInterval.current = setInterval(async () => {
      if (soundRef.current) {
        try {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded) {
            setPosition(status.positionMillis || 0);
          }
        } catch {}
      }
    }, 200);
  };

  const handleSeek = useCallback(async (fraction) => {
    if (!soundRef.current || !duration) return;
    const seekTo = fraction * duration;
    try {
      await soundRef.current.setPositionAsync(seekTo);
      setPosition(seekTo);
    } catch {}
  }, [duration]);

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>音频预览</Text>
          <View style={styles.closeButton} />
        </View>

        <View style={styles.audioContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="musical-note" size={64} color={Colors.primary} />
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* 进度条 */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <TouchableOpacity
              style={styles.progressBar}
              activeOpacity={0.8}
              onPress={(e) => {
                const { locationX } = e.nativeEvent;
                const barWidth = 260;
                handleSeek(Math.max(0, Math.min(1, locationX / barWidth)));
              }}
            >
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
            </TouchableOpacity>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* 控制按钮 */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlay}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textInverse} size="small" />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={36}
                  color={Colors.textInverse}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.card,
  },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  audioContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg,
  },
  iconCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: Colors.primaryBg, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  errorText: { fontSize: 13, color: Colors.error, marginTop: Spacing.md, textAlign: 'center' },
  progressContainer: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, width: '100%', maxWidth: 340,
  },
  timeText: { fontSize: 12, color: Colors.textTertiary, minWidth: 36, textAlign: 'center' },
  progressBar: { flex: 1, height: 28, justifyContent: 'center' },
  progressTrack: {
    height: 4, borderRadius: 2, backgroundColor: Colors.disabledBg, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  controls: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  playButton: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
});
