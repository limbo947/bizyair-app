import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useTheme } from '../../context/ThemeContext';

const thumbUri = (url) => {
  if (typeof url === 'string') return url;
  if (url && typeof url === 'object') return url.localUrl || url.remoteUrl || '';
  return '';
};

function UploadCardInner({
  label,
  required,
  onUpload,
  isUploading,
  urls,
  onRemove,
  acceptType,
  itemPrefix,
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        {label}
        {required ? (
          <Text style={{ color: colors.error }}> *</Text>
        ) : (
          <Text style={{ color: colors.textTertiary, fontWeight: Typography.fontWeight.regular, textTransform: 'none' }}> (可选)</Text>
        )}
      </Text>
      <Pressable
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
        onPress={onUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
        )}
        <Text style={styles.uploadButtonText}>{isUploading ? '上传中...' : '选择文件'}</Text>
      </Pressable>
      {urls && urls.length > 0 && (
        <View style={styles.uploadedList}>
          {urls.map((url, index) => (
            <View key={index} style={styles.uploadedItem}>
              {acceptType === 'image' ? (
                <Image source={{ uri: thumbUri(url) }} style={styles.uploadedThumb} contentFit="cover" />
              ) : (
                <View style={[styles.uploadedThumb, { backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="videocam" size={20} color={colors.primary} />
                </View>
              )}
              <Text style={styles.uploadedName} numberOfLines={1}>
                {itemPrefix}{index + 1}
              </Text>
              <Pressable style={styles.removeUploadedButton} onPress={() => onRemove(index)}>
                <Text style={styles.removeUploadedButtonText}>删除</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export const UploadCard = React.memo(UploadCardInner);

const createStyles = (colors) => ({
  card: { backgroundColor: colors.card, padding: Spacing.lg, borderRadius: Radius.md, borderCurve: 'continuous', marginBottom: Spacing.md },
  label: { fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold, color: colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: Typography.letterSpacing.wide },
  uploadButton: { backgroundColor: colors.primaryBg, paddingVertical: Spacing.xl, borderRadius: Radius.md, borderCurve: 'continuous', borderWidth: 1.5, borderColor: colors.primaryBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: Spacing.sm },
  uploadButtonDisabled: { opacity: 0.6 },
  uploadButtonText: { color: colors.primary, fontSize: Typography.fontSize.subheadline, fontWeight: Typography.fontWeight.semibold },
  uploadedList: { marginTop: Spacing.md, gap: Spacing.sm },
  uploadedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', padding: Spacing.sm, gap: Spacing.md },
  uploadedThumb: { width: 44, height: 44, borderRadius: Radius.xs, borderCurve: 'continuous' },
  uploadedName: { flex: 1, fontSize: Typography.fontSize.footnote, color: colors.textPrimary, fontWeight: Typography.fontWeight.medium },
  removeUploadedButton: { backgroundColor: colors.errorBg, paddingHorizontal: Spacing.md, paddingVertical: 5, borderRadius: Radius.xs, borderCurve: 'continuous' },
  removeUploadedButtonText: { color: colors.error, fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold },
});
