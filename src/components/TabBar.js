import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TAB_HOME, TAB_HISTORY } from '../constants/models';
import { Colors, Shadows, Radius, Spacing } from '../constants/theme';

const TABS = [
  { key: TAB_HOME, label: '主页', icon: 'home-outline', iconActive: 'home' },
  { key: TAB_HISTORY, label: '历史', icon: 'list-outline', iconActive: 'list' },
];

export function TabBar({ activeTab, onTabChange, historyBadge }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.6}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={24}
                color={isActive ? Colors.primary : Colors.textTertiary}
              />
              {tab.key === TAB_HISTORY && historyBadge > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {historyBadge > 99 ? '99+' : historyBadge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderTopWidth: 0.5,
    borderTopColor: Colors.separator,
    paddingBottom: 6,
    paddingTop: 4,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    position: 'relative',
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 10,
    fontWeight: '600',
  },
  label: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 1,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
