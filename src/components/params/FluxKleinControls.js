import React from 'react';
import { View, Text } from 'react-native';
import { Typography } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';

export function FluxKleinControls() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.hintText}>上传图片即可自动去除水印</Text>
    </View>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  hintText: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
