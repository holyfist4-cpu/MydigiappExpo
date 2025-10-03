
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useSubscription } from '../hooks/useSubscription';
import { subscriptionPlans } from '../data/mockData';
import { SubscriptionPlan } from '../types';
import Icon from '../components/Icon';

export default function SubscriptionScreen() {
  const { subscription, trialDaysLeft, isTrialActive, subscribeToPlan } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate payment process
      Alert.alert(
        'Confirmer l\'abonnement',
        `Voulez-vous vous abonner au plan ${subscriptionPlans.find(p => p.id === planId)?.name} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Confirmer',
            onPress: async () => {
              const success = await subscribeToPlan(planId);
              if (success) {
                Alert.alert(
                  'Abonnement activé !',
                  'Votre abonnement a été activé avec succès.',
                  [{ text: 'OK', onPress: () => router.back() }]
                );
              } else {
                Alert.alert('Erreur', 'Une erreur est survenue lors de l\'abonnement.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.log('Error subscribing:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'abonnement.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan === plan.id;
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected && styles.selectedPlanCard,
          plan.isPopular && styles.popularPlanCard
        ]}
        onPress={() => setSelectedPlan(plan.id)}
      >
        {plan.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>POPULAIRE</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>€{plan.price}</Text>
          <Text style={styles.pricePeriod}>/{plan.duration === 'monthly' ? 'mois' : 'an'}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Icon name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isSelected && styles.selectedSubscribeButton
          ]}
          onPress={() => handleSubscribe(plan.id)}
          disabled={isLoading}
        >
          <Text style={[
            styles.subscribeButtonText,
            isSelected && styles.selectedSubscribeButtonText
          ]}>
            {isLoading ? 'Traitement...' : 'Choisir ce plan'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plans d'abonnement</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trial Status */}
        {isTrialActive && (
          <View style={styles.trialBanner}>
            <Icon name="time" size={24} color={colors.warning} />
            <View style={styles.trialInfo}>
              <Text style={styles.trialTitle}>Période d'essai active</Text>
              <Text style={styles.trialText}>
                {trialDaysLeft > 0 
                  ? `${trialDaysLeft} jour${trialDaysLeft > 1 ? 's' : ''} restant${trialDaysLeft > 1 ? 's' : ''}`
                  : 'Expire aujourd\'hui'
                }
              </Text>
            </View>
          </View>
        )}

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Pourquoi s'abonner à Digigate ?</Text>
          
          <View style={styles.benefitRow}>
            <Icon name="download" size={24} color={colors.primary} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Téléchargements illimités</Text>
              <Text style={styles.benefitText}>Accédez à tous vos produits sans limite</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Icon name="shield-checkmark" size={24} color={colors.primary} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Contenu premium</Text>
              <Text style={styles.benefitText}>Accès exclusif aux nouveautés et contenus premium</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Icon name="headset" size={24} color={colors.primary} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Support prioritaire</Text>
              <Text style={styles.benefitText}>Assistance rapide et personnalisée</Text>
            </View>
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choisissez votre plan</Text>
          {subscriptionPlans.map(renderPlanCard)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • Annulation possible à tout moment{'\n'}
            • Facturation sécurisée{'\n'}
            • Satisfaction garantie ou remboursé
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  trialInfo: {
    marginLeft: 12,
    flex: 1,
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
  },
  trialText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  benefitsSection: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitContent: {
    marginLeft: 16,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  plansSection: {
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  popularPlanCard: {
    borderColor: colors.success,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.background,
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  pricePeriod: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSubscribeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedSubscribeButtonText: {
    color: colors.background,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
