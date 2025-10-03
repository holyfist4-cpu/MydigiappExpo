
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ProductCategory } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface CategoryCardProps {
  category: ProductCategory;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={[styles.container, { borderColor: category.color }]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <Icon name={category.icon as any} size={24} color={colors.background} />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: colors.background,
    marginRight: 12,
    minWidth: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
