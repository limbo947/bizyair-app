import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Typography } from '../../constants/theme';

export function DurationDisplay({ startedAt, completedAt, isFinal, isActive, colors }) {
  const [now, setNow] = useState(completedAt || 0);

  useEffect(() => {
    if (!isActive || isFinal) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isActive, isFinal]);

  if (!isFinal && !isActive) return null;

  const end = completedAt || now;
  const ms = end - (startedAt || 0);
  if (ms < 0) return <Text>--</Text>;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return <Text style={{ fontSize: Typography.fontSize.caption1, color: colors.success, fontWeight: Typography.fontWeight.medium }}>{seconds}秒</Text>;
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  if (minutes < 60) return <Text style={{ fontSize: Typography.fontSize.caption1, color: colors.success, fontWeight: Typography.fontWeight.medium }}>{minutes}分{remainSeconds}秒</Text>;
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;
  return <Text style={{ fontSize: Typography.fontSize.caption1, color: colors.success, fontWeight: Typography.fontWeight.medium }}>{hours}时{remainMinutes}分</Text>;
}
