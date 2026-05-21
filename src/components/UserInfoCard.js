import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENV_API_KEY } from '../constants/models';
import { Colors, Shadows, Radius, Spacing } from '../constants/theme';

export function UserInfoCard({
  userInfo,
  walletBalance,
  apiKey,
  showApiKeyInput,
  userCardExpanded,
  onToggleExpand,
  onApiKeyChange,
  onSaveApiKey,
  onShowApiKeyInput,
  onRefresh,
}) {
  if (userInfo && (apiKey || ENV_API_KEY) && !showApiKeyInput) {
    return (
      <View style={[styles.card, styles.userCard]}>
        <TouchableOpacity
          style={styles.userCardTop}
          onPress={onToggleExpand}
          activeOpacity={0.7}
        >
          <Image source={{ uri: userInfo.avatar }} style={styles.userAvatar} />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <View style={styles.userLevelRow}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
              <Text style={styles.userLevel}>{userInfo.user_level_str}</Text>
            </View>
          </View>
          {userCardExpanded ? (
            <View style={styles.userBalanceBlock}>
              <Text style={styles.userBalanceLabel}>BZ币余额</Text>
              <Text style={styles.userBalanceValue}>
                {walletBalance?.total_balance || '--'}
              </Text>
            </View>
          ) : (
            <View style={styles.userCollapsedBalances}>
              <Ionicons name="star" size={14} color={Colors.warning} />
              <Text style={styles.userCollapsedBalanceText}>
                {walletBalance?.charge_balance || '--'}
              </Text>
              <Ionicons name="star-outline" size={14} color={Colors.textTertiary} style={{ marginLeft: 10 }} />
              <Text style={styles.userCollapsedBalanceText}>
                {walletBalance?.gift_balance || '--'}
              </Text>
            </View>
          )}
          <Ionicons
            name={userCardExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={Colors.textTertiary}
            style={{ marginLeft: Spacing.sm }}
          />
        </TouchableOpacity>

        {userCardExpanded ? (
          <>
            {walletBalance ? (
              <View style={styles.userBalanceDetail}>
                <View style={styles.userBalanceItem}>
                  <View style={styles.userBalanceItemHeader}>
                    <Ionicons name="star" size={14} color={Colors.warning} />
                    <Text style={[styles.userBalanceItemLabel, { color: Colors.warning }]}>充值金币</Text>
                  </View>
                  <Text style={styles.userBalanceItemValue}>{walletBalance.charge_balance}</Text>
                </View>
                <View style={styles.userBalanceDivider} />
                <View style={styles.userBalanceItem}>
                  <View style={styles.userBalanceItemHeader}>
                    <Ionicons name="star-outline" size={14} color={Colors.textTertiary} />
                    <Text style={[styles.userBalanceItemLabel, { color: Colors.textTertiary }]}>赠送银币</Text>
                  </View>
                  <Text style={styles.userBalanceItemValue}>{walletBalance.gift_balance}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.userApiKeySection}>
              <View style={styles.labelRow}>
                <Ionicons name="key" size={16} color={Colors.textTertiary} />
                <Text style={styles.label}>API 密钥</Text>
              </View>
              <View style={styles.apiKeyRow}>
                <Text style={styles.apiKeyMasked}>
                  {ENV_API_KEY || apiKey ? '密钥已配置 ●●●●●●●●' : '未配置密钥'}
                </Text>
                <View style={styles.apiKeyActions}>
                  {apiKey || ENV_API_KEY ? (
                    <TouchableOpacity
                      style={styles.refreshKeyButton}
                      onPress={onRefresh}
                    >
                      <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={styles.changeKeyButton}
                    onPress={onShowApiKeyInput}
                  >
                    <Text style={styles.changeKeyButtonText}>
                      {apiKey || ENV_API_KEY ? '更换' : '输入'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </View>
    );
  }

  if (showApiKeyInput) {
    return (
      <View style={[styles.card, styles.apiKeyCard]}>
        <View style={styles.labelRow}>
          <Ionicons name="key" size={16} color={Colors.warning} />
          <Text style={styles.label}>API 密钥</Text>
        </View>
        <TextInput
          style={styles.apiKeyInput}
          placeholder="输入你的Bizyair API Key"
          value={apiKey}
          onChangeText={onApiKeyChange}
          secureTextEntry
          maxLength={100}
          placeholderTextColor={Colors.textPlaceholder}
        />
        {apiKey.trim() ? (
          <TouchableOpacity
            style={styles.saveKeyButton}
            onPress={onSaveApiKey}
          >
            <Text style={styles.saveKeyButtonText}>保存密钥</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <Ionicons name="key" size={16} color={Colors.textTertiary} />
        <Text style={styles.label}>API 密钥</Text>
      </View>
      <View style={styles.apiKeyRow}>
        <Text style={styles.apiKeyMasked}>
          {ENV_API_KEY || apiKey ? '密钥已配置 ●●●●●●●●' : '未配置密钥'}
        </Text>
        <View style={styles.apiKeyActions}>
          {apiKey || ENV_API_KEY ? (
            <TouchableOpacity
              style={styles.refreshKeyButton}
              onPress={onRefresh}
            >
              <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.changeKeyButton}
            onPress={onShowApiKeyInput}
          >
            <Text style={styles.changeKeyButtonText}>
              {apiKey || ENV_API_KEY ? '更换' : '输入'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.md, ...Shadows.sm },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  userCard: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
  userCardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  userAvatar: { width: 44, height: 44, borderRadius: 22 },
  userInfoText: { flex: 1 },
  userName: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', letterSpacing: -0.3 },
  userLevelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  userLevel: { fontSize: 12, color: Colors.textTertiary },
  userBalanceBlock: { alignItems: 'flex-end' },
  userBalanceLabel: { fontSize: 11, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  userBalanceValue: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', letterSpacing: -0.5, marginTop: 2 },
  userCollapsedBalances: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userCollapsedBalanceText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  userBalanceDetail: { flexDirection: 'row', marginTop: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.md, borderTopWidth: 0.5, borderTopColor: Colors.divider, borderBottomWidth: 0.5, borderBottomColor: Colors.divider },
  userBalanceItem: { flex: 1, alignItems: 'center' },
  userBalanceItemHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userBalanceItemLabel: { fontSize: 12, color: Colors.textTertiary },
  userBalanceItemValue: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginTop: 4 },
  userBalanceDivider: { width: 0.5, backgroundColor: Colors.divider },
  userApiKeySection: { marginTop: Spacing.md },
  apiKeyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  apiKeyMasked: { fontSize: 14, color: Colors.textTertiary },
  changeKeyButton: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: Colors.primaryBg, borderRadius: Radius.full },
  changeKeyButtonText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  apiKeyActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  refreshKeyButton: { padding: 6, backgroundColor: Colors.primaryBg, borderRadius: Radius.full },
  apiKeyCard: { borderColor: Colors.warningBorder, borderWidth: 1 },
  apiKeyInput: { fontSize: 15, color: Colors.textPrimary, borderWidth: 0, borderRadius: Radius.sm, padding: Spacing.md, fontFamily: 'monospace', backgroundColor: Colors.bg },
  saveKeyButton: { backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: Radius.sm, alignItems: 'center', marginTop: Spacing.sm },
  saveKeyButtonText: { color: Colors.textInverse, fontSize: 15, fontWeight: '600' },
});