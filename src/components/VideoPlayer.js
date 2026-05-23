import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function VideoPlayer({ visible, videoUrl, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>视频预览</Text>
          <View style={styles.closeButton} />
        </View>

        <View style={styles.videoContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={Colors.textTertiary} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  Linking.openURL(videoUrl);
                }}
              >
                <Ionicons name="download-outline" size={20} color={Colors.textInverse} />
                <Text style={styles.downloadButtonText}>浏览器打开视频</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="videocam" size={80} color={Colors.textTertiary} />
              <Text style={styles.placeholderText}>视频 URL: {videoUrl ? videoUrl.substring(0, 50) + '...' : '无'}</Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleTogglePlay}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bg,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  downloadButtonText: {
    fontSize: 14,
    color: Colors.textInverse,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.bg,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
