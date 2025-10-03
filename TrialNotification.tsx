
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/commonStyles';
import { useSubscription } from '../hooks/useSubscription';
import { router } from 'expo-router';
import Icon from './Icon';

export default function TrialNotification() {
  const { isTrialActive, trialDaysLeft, isTrialExpired } = useSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Show notification if trial is about to expire (2 days or less) or expired
    const shouldShow = (isTrialActive && trialDaysLeft <= 2) || isTrialExpired;
    
    if (shouldShow && !isVisible) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isTrialActive, trialDaysLeft, isTrialExpired, isVisible, fadeAnim]);

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  };

  const handleUpgrade = () => {
    router.push('/subscription');
    handleDismiss();
  };

  if (!isVisible) return null;

  const getNotificationContent = () => {
    if (isTrialExpired) {
      return {
        title: 'Période d\'essai expirée',
        message: 'Choisissez un plan pour continuer à utiliser Digigate',
        buttonText: 'Voir les plans',
        color: colors.error,
        backgroundColor: colors.errorLight,
        icon: 'warning'
      };
    } else if (trialDaysLeft <= 1) {
      return {
        title: 'Essai expire bientôt',
        message: `Plus que ${trialDaysLeft} jour${trialDaysLeft > 1 ? 's' : ''} d'essai gratuit`,
        buttonText: 'S\'abonner',
        color: colors.warning,
        backgroundColor: colors.warningLight,
        icon: 'time'
      };
    } else {
      return {
        title: 'Essai expire bientôt',
        message: `Plus que ${trialDaysLeft} jours d'essai gratuit`,
        buttonText: 'S\'abonner',
        color: colors.warning,
        backgroundColor: colors.warningLight,
        icon: 'time'
      };
    }
  };

  const content = getNotificationContent();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.notification, { backgroundColor: content.backgroundColor }]}>
        <Icon name={content.icon as any} size={20} color={content.color} />
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: content.color }]}>
            {content.title}
          </Text>
          <Text style={styles.message}>
            {content.message}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.upgradeButton, { backgroundColor: content.color }]}
            onPress={handleUpgrade}
          >
            <Text style={styles.upgradeButtonText}>
              {content.buttonText}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={handleDismiss}
          >
            <Icon name="close" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  upgradeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  dismissButton: {
    padding: 4,
  },
});
