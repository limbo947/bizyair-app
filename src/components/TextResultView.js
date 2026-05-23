import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Colors, Radius, Spacing } from '../constants/theme';

export function TextResultView({ visible, text, onClose }) {
  const handleCopy = async () => {
    if (text) {
      await Clipboard.setStringAsync(text);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>文本结果</Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.card },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  copyButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  content: { flex: 1 },
  contentInner: { padding: Spacing.lg },
  textContent: { fontSize: 15, color: Colors.textPrimary, lineHeight: 24 },
  footer: { padding: Spacing.md, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.bg },
  footerText: { fontSize: 12, color: Colors.textTertiary, textAlign: 'center' },
});
