
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface TabItem {
  key: string;
  title: string;
  icon: string;
}

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const tabs: TabItem[] = [
  { key: 'home', title: 'Accueil', icon: 'home' },
  { key: 'explore', title: 'Explorer', icon: 'compass' },
  { key: 'cart', title: 'Panier', icon: 'bag' },
  { key: 'profile', title: 'Profil', icon: 'person' },
];

export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
        >
          <Icon
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.key ? colors.primary : colors.textLight}
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === tab.key ? colors.primary : colors.textLight }
          ]}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
