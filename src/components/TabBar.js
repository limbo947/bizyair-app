import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TAB_HOME, TAB_HISTORY } from '../constants/models';

const TABS = [
  { key: TAB_HOME, label: '主页', icon: '🏠', activeIcon: '🏠' },
  { key: TAB_HISTORY, label: '历史', icon: '📋', activeIcon: '📋' },
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
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {isActive ? tab.activeIcon : tab.icon}
              </Text>
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
            {isActive ? <View style={styles.indicator} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    paddingBottom: 8,
    paddingTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  iconWrap: {
    position: 'relative',
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -8,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 11,
    color: '#999',
    marginTop: 1,
    fontWeight: '500',
  },
  labelActive: {
    color: '#3F51B5',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#3F51B5',
  },
});
