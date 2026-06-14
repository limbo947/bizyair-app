import React, { useState } from 'react';
import { Pressable, Text, View, TextInput, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApiKeyContext } from '../../context/ApiKeyContext';
import { useToastContext } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { ENV_API_KEY } from '../../constants/models';
import { Radius, Spacing, Typography, pressedOpacity } from '../../constants/theme';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ApiKeyDropdown } from './ApiKeyDropdown';

const createStyles = (colors) => ({
  header: { backgroundColor: colors.card, paddingLeft: Spacing.md, paddingRight: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.separator },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1, borderRadius: Radius.sm, borderCurve: 'continuous' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, borderCurve: 'continuous' },
  headerAvatarPlaceholder: { backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  headerUserInfo: { flexDirection: 'column' },
  headerNameRow: { flexDirection: 'row', alignItems: 'center' },
  headerUserName: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, fontWeight: Typography.fontWeight.semibold },
  headerBalances: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  headerBalanceText: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, fontWeight: Typography.fontWeight.semibold },
  headerApiInput: { flex: 1, fontSize: Typography.fontSize.footnote, color: colors.textPrimary, backgroundColor: colors.bg, borderRadius: Radius.sm, borderCurve: 'continuous', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs },
  headerSaveButton: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.primary },
  headerSaveButtonText: { color: colors.textInverse, fontSize: Typography.fontSize.footnote, fontWeight: Typography.fontWeight.semibold },
  headerAllModelsButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, borderRadius: Radius.sm, borderCurve: 'continuous', gap: Spacing.xs },
  headerAllModelsText: { fontSize: Typography.fontSize.footnote, color: colors.textPrimary, fontWeight: Typography.fontWeight.semibold },
  headerThemeButton: { padding: Spacing.sm, borderRadius: Radius.sm, borderCurve: 'continuous', backgroundColor: colors.bg },
});

export function AppHeader({ paddingTop, showAllModelsButton, onAllModelsPress }) {
  const {
    apiKey, setApiKey, saveApiKey, apiKeys, activeApiKeyId,
    addApiKey, removeApiKey, switchApiKey, renameApiKey,
    userInfo, walletBalance,
  } = useApiKeyContext();
  const { themeMode, toggleTheme, colors } = useTheme();
  const { showToast } = useToastContext();
  const styles = useThemedStyles(createStyles);

  const [showApiKeyDropdown, setShowApiKeyDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await saveApiKey(apiKey);
    } catch (_e) {
      showToast('密钥保存失败', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <View style={[styles.header, { paddingTop }]}>
        {userInfo && (apiKey || ENV_API_KEY) ? (
          <View style={styles.headerInner}>
            <Pressable
              style={({ pressed }) => [styles.headerLeft, pressed && pressedOpacity()]} onPress={() => setShowApiKeyDropdown(true)} >
              <Image source={{ uri: userInfo.avatar }} style={styles.headerAvatar} contentFit="cover" cachePolicy="memory-disk" transition={200} />
              <View style={styles.headerUserInfo}>
                <View style={styles.headerNameRow}>
                  <Text style={styles.headerUserName}>{userInfo.name}</Text>
                  {userInfo.user_level_str ? (
                    <MaterialCommunityIcons name="crown" size={14} color={colors.warning} style={{ marginLeft: Spacing.xs }} />
                  ) : null}
                </View>
                <View style={styles.headerBalances}>
                  <MaterialCommunityIcons name="gold" size={14} color={colors.warning} style={{ paddingRight: Spacing.xs }} />
                  <Text style={[styles.headerBalanceText, { paddingLeft: Spacing.xs, paddingTop: 2 }]}>
                    {walletBalance?.charge_balance_amount ?? '--'}
                  </Text>
                  <MaterialCommunityIcons name="gold" size={14} color={colors.textTertiary} style={{ marginLeft: Spacing.md, paddingRight: Spacing.xs }} />
                  <Text style={[styles.headerBalanceText, { paddingLeft: Spacing.xs, paddingTop: 2 }]}>
                    {walletBalance?.gift_balance_amount ?? '--'}
                  </Text>
                </View>
              </View>
            </Pressable>
            {showAllModelsButton ? (
              <Pressable
                style={({ pressed }) => [styles.headerAllModelsButton, pressed && pressedOpacity()]} onPress={onAllModelsPress} >
                <Text style={styles.headerAllModelsText}>所有模型</Text>
                <Ionicons name="apps-outline" size={18} color={colors.textPrimary} />
              </Pressable>
            ) : null}
            <Pressable
              style={({ pressed }) => [styles.headerThemeButton, pressed && pressedOpacity()]} onPress={toggleTheme} >
              <Ionicons name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
                <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
              </View>
              <TextInput
                style={styles.headerApiInput}
                placeholder="输入Bizyair API Key"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                placeholderTextColor={colors.textPlaceholder}
              />
            </View>
            {apiKey.trim() ? (
              <Pressable
                style={({ pressed }) => [styles.headerSaveButton, pressed && pressedOpacity()]} onPress={handleSaveApiKey} disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.textInverse} />
                ) : (
                  <Text style={styles.headerSaveButtonText}>保存</Text>
                )}
              </Pressable>
            ) : showAllModelsButton ? (
              <View style={styles.headerAllModelsButton}>
                <Text style={styles.headerAllModelsText}>所有模型</Text>
                <Ionicons name="apps-outline" size={18} color={colors.textPrimary} />
              </View>
            ) : null}
          </View>
        )}
      </View>

      <ApiKeyDropdown
        visible={showApiKeyDropdown}
        onClose={() => setShowApiKeyDropdown(false)}
        apiKeys={apiKeys}
        activeApiKeyId={activeApiKeyId}
        onSwitchKey={switchApiKey}
        onDeleteKey={removeApiKey}
        onAddKey={addApiKey}
        onRenameKey={renameApiKey}
        triggerTop={(paddingTop || 0) + 56}
      />
    </>
  );
}
