import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { pressedOpacity } from '../../constants/theme';

/**
 * 广场应用卡片。
 * @param {object} props
 * @param {object} props.item - 列表项（含 name, versions[0].cover_urls, base_model, counter）
 * @param {function} props.onPress - 点击卡片回调
 * @param {object} props.colors - 主题色
 * @param {object} props.styles - 样式对象（由父组件 CommunityAppSquare 传入）
 */
export const CommunityAppCard = React.memo(function CommunityAppCard({
  item, onPress, colors, styles,
}) {
  const version = item.versions?.[0] || {};
  const coverUrl = version.cover_urls?.[0];
  const isVideo = typeof coverUrl === 'string' && coverUrl.endsWith('.mp4');
  const usedCount = item.counter?.used_count ?? 0;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && pressedOpacity()]}
      onPress={onPress}
    >
      {/* 封面 */}
      <View style={styles.coverWrapper}>
        {coverUrl && !isVideo ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.cover}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name={isVideo ? 'videocam-outline' : 'apps-outline'} size={32} color={colors.textTertiary} />
          </View>
        )}
        {isVideo ? (
          <View style={styles.videoBadge}>
            <Ionicons name="play" size={10} color="#fff" />
          </View>
        ) : null}
      </View>

      {/* 信息 */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.meta}>
          {version.base_model && version.base_model !== 'Other' ? (
            <View style={styles.modelBadge}>
              <Text style={styles.modelText} numberOfLines={1}>{version.base_model}</Text>
            </View>
          ) : null}
          <View style={styles.countRow}>
            <Ionicons name="trending-up-outline" size={11} color={colors.textTertiary} />
            <Text style={styles.count}>{usedCount}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});
