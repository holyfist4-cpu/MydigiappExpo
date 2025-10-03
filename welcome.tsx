
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  useEffect(() => {
    // Auto-redirect to onboarding after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Icon name="storefront" size={48} color={colors.background} />
          </View>
          <Text style={styles.logoText}>Digigate</Text>
          <Text style={styles.tagline}>Votre marketplace digitale</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15)`,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.background,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.background,
    opacity: 0.9,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
    marginHorizontal: 4,
    opacity: 0.6,
  },
  dot1: {
    // Animation would be added here in a real implementation
  },
  dot2: {
    // Animation would be added here in a real implementation
  },
  dot3: {
    // Animation would be added here in a real implementation
  },
});
