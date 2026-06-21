import React, { useState, useCallback, useRef } from 'react';
import { Pressable, View, Text, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';
import { useToastContext } from '../../context/ToastContext';

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: colors.card },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  copyButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Typography.fontSize.callout, fontWeight: Typography.fontWeight.semibold, color: colors.textPrimary },
  content: { flex: 1 },
  contentInner: { padding: Spacing.lg },
  textContent: { fontSize: Typography.fontSize.subheadline, color: colors.textPrimary, lineHeight: 24 },
  footer: { padding: Spacing.md, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.bg },
  footerText: { fontSize: Typography.fontSize.caption1, color: colors.textTertiary, textAlign: 'center' },
  fontSizeHint: { fontSize: Typography.fontSize.caption2, color: colors.textTertiary, marginTop: Spacing.xs },
});

export function TextResultView({ visible, text, onClose }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { showToast } = useToastContext();
  const [copied, setCopied] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const scrollRef = useRef(null);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    showToast('文本已复制到剪贴板', 'success');
    setTimeout(() => setCopied(false), 1500);
  }, [text, showToast]);

  // 问题7：双击切换字体大小（1x → 1.25x → 1.5x → 1x）
  const handleDoubleTap = useCallback(() => {
    setFontScale((prev) => {
      if (prev >= 1.5) return 1;
      return prev === 1 ? 1.25 : 1.5;
    });
  }, []);

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={({ pressed }) => [styles.closeButton, pressed && pressedOpacity()]} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>文本结果</Text>
          <Pressable style={({ pressed }) => [styles.copyButton, pressed && pressedOpacity()]} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} onPress={handleCopy}>
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={24} color={copied ? colors.success : colors.primary} />
          </Pressable>
        </View>
        {/* 问题7：ScrollView 支持捏合缩放（Web 端），双击切换字号 */}
        <ScrollView
          ref={scrollRef}
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          maximumZoomScale={2}
          minimumZoomScale={0.8}
          showsVerticalScrollIndicator
        >
          <Pressable onLongPress={handleDoubleTap} delayLongPress={300}>
            <Text style={[styles.textContent, { fontSize: Typography.fontSize.subheadline * fontScale, lineHeight: 24 * fontScale }]} selectable>{text || '暂无文本内容'}</Text>
          </Pressable>
          <Text style={styles.fontSizeHint}>双击调整字号 · 当前 {fontScale}x</Text>
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{text ? `共 ${text.length} 个字符` : ''}</Text>
        </View>
      </View>
    </Modal>
  );
}
