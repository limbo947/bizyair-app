import React from 'react';
import { Pressable, View, Text, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Spacing, Typography, pressedOpacity } from '../constants/theme';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { useTheme } from '../context/ThemeContext';

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
});

export function TextResultView({ visible, text, onClose }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  const handleCopy = async () => {
    if (text) {
      await Clipboard.setStringAsync(text);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={({ pressed }) => [styles.closeButton, pressed && pressedOpacity()]} onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>文本结果</Text>
          <Pressable style={({ pressed }) => [styles.copyButton, pressed && pressedOpacity()]} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={24} color={colors.primary} />
          </Pressable>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          <Text style={styles.textContent} selectable>{text || '暂无文本内容'}</Text>
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{text ? `共 ${text.length} 个字符` : ''}</Text>
        </View>
      </View>
    </Modal>
  );
}
