import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { pressedOpacity } from '../../constants/theme';

/**
 * AI 应用列表项（2 列网格卡片，带封面）。
 * @param {object} props
 * @param {object} props.item - 已保存应用项（含 name, appDetail, webAppId）
 * @param {function} props.onEdit - 点击卡片回调（传入 item）
 * @param {function} props.onDelete - 删除回调（传入 item.id）
 * @param {object} props.colors - 主题色
 * @param {object} props.styles - 父组件传入的样式对象
 */
export const WebappListItem = React.memo(function WebappListItem({ item, onEdit, onDelete, colors, styles }) {
  const coverUrl = item.appDetail?.cover_urls?.[0];
  const isVideo = typeof coverUrl === 'string' && coverUrl.endsWith('.mp4');
  const baseModel = item.appDetail?.base_model;

  return (
    <Pressable
      style={({ pressed }) => [styles.gridCard, pressed && pressedOpacity()]}
      onPress={() => onEdit(item)}
    >
      {/* 封面 */}
      <View style={styles.gridCoverWrapper}>
        {coverUrl && !isVideo ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.gridCover}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={styles.gridCoverPlaceholder}>
            <Ionicons name={isVideo ? 'videocam-outline' : 'apps-outline'} size={32} color={colors.textTertiary} />
          </View>
        )}
        {/* 删除按钮（绝对定位右上角） */}
        <Pressable
          style={({ pressed }) => [styles.gridDeleteBtn, pressed && pressedOpacity()]}
          onPress={() => onDelete(item.id)}
          hitSlop={8}
        >
          <Ionicons name="close" size={14} color="#fff" />
        </Pressable>
      </View>

      {/* 信息 */}
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
        {baseModel && baseModel !== 'Other' ? (
          <View style={styles.gridModelBadge}>
            <Text style={styles.gridModelText} numberOfLines={1}>{baseModel}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});
