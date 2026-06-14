import React from 'react';
import { Pressable, View } from 'react-native';
import { Radius } from '../../constants/theme';
import { createSharedStyles } from '../../constants/sharedStyles';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { ParamLabel } from './ParamLabel';

export function BirefnetControls({ outputmask, setOutputmask }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.switchRow}>
        <ParamLabel label="输出 Mask" required={false} style={{ marginBottom: 0 }} />
        <Pressable
          style={({ pressed }) => [
            styles.switchTrack,
            outputmask && styles.switchTrackActive,
            pressed && styles.pressedStyle,
          ]}
          onPress={() => setOutputmask(!outputmask)}
        >
          <View style={[styles.switchThumb, outputmask && styles.switchThumbActive]} />
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors) => ({
  ...createSharedStyles(colors),
  switchTrack: {
    width: 44, height: 24, borderRadius: Radius.full, borderCurve: 'continuous',
    backgroundColor: colors.separator, padding: 2, justifyContent: 'center',
  },
  switchTrackActive: { backgroundColor: colors.primary },
  switchThumb: {
    width: 20, height: 20, borderRadius: Radius.full, borderCurve: 'continuous',
    backgroundColor: colors.card, transform: [{ translateX: 0 }],
  },
  switchThumbActive: { transform: [{ translateX: 20 }] },
});
