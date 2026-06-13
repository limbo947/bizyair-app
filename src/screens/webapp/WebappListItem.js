import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pressedOpacity } from '../../constants/theme';

export const WebappListItem = React.memo(function WebappListItem({ item, onEdit, onDelete, colors, styles }) {
  return (
    <View style={styles.listItem}>
      <Pressable style={({ pressed }) => [styles.listItemContent, pressed && pressedOpacity()]} onPress={() => onEdit(item)} >
        <View style={styles.listItemHeader}>
          <Text style={styles.listItemName} numberOfLines={1}>{item.name}</Text>
        </View>
        <View style={styles.listItemMeta}>
          {item.appDetail?.base_model ? <Text style={styles.listItemModel}>基础模型: {item.appDetail.base_model}</Text> : null}
          <Text style={styles.listItemId}>WebApp #{item.webAppId}</Text>
        </View>
        {item.appDetail?.intro ? <Text style={styles.listItemIntro} numberOfLines={1}>{item.appDetail.intro}</Text> : null}
      </Pressable>
      <View style={styles.listItemActions}>
        <Pressable style={({ pressed }) => [styles.listItemDeleteBtn, pressed && pressedOpacity()]} onPress={() => onDelete(item.id)} >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
});
