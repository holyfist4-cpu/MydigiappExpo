
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useSubscription } from '../hooks/useSubscription';
import { useUsage } from '../hooks/useUsage';
import Icon from '../components/Icon';

export default function SettingsScreen() {
  const { subscription, isTrialActive, trialDaysLeft, cancelSubscription } = useSubscription();
  const { usage, resetUsage } = useUsage();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelSubscription = () => {
    Alert.alert(
      'Annuler l\'abonnement',
      'Êtes-vous sûr de vouloir annuler votre abonnement ? Vous perdrez l\'accès aux fonctionnalités premium.',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            const success = await cancelSubscription();
            setIsLoading(false);
            
            if (success) {
              Alert.alert('Abonnement annulé', 'Votre abonnement a été annulé avec succès.');
            } else {
              Alert.alert('Erreur', 'Une erreur est survenue lors de l\'annulation.');
            }
          }
        }
      ]
    );
  };

  const handleResetUsage = () => {
    Alert.alert(
      'Réinitialiser les données d\'usage',
      'Cette action est irréversible. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            await resetUsage();
            Alert.alert('Données réinitialisées', 'Les données d\'usage ont été réinitialisées.');
          }
        }
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showChevron: boolean = true,
    color: string = colors.text
  ) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Icon name={icon as any} size={24} color={color} />
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && onPress && (
        <Icon name="chevron-forward" size={20} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abonnement</Text>
          
          {subscription && (
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <Text style={styles.subscriptionPlan}>{subscription.plan.name}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: isTrialActive ? colors.warningLight : colors.successLight }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: isTrialActive ? colors.warning : colors.success }
                  ]}>
                    {isTrialActive ? 'Essai' : subscription.status}
                  </Text>
                </View>
              </View>
              
              {isTrialActive && (
                <Text style={styles.trialInfo}>
                  {trialDaysLeft} jour{trialDaysLeft > 1 ? 's' : ''} restant{trialDaysLeft > 1 ? 's' : ''}
                </Text>
              )}
              
              <Text style={styles.subscriptionPrice}>
                {subscription.plan.price > 0 ? `€${subscription.plan.price}/mois` : 'Gratuit'}
              </Text>
            </View>
          )}

          {renderSettingItem(
            'card',
            'Gérer l\'abonnement',
            'Changer de plan ou voir les détails',
            () => router.push('/subscription')
          )}

          {subscription?.status === 'active' && (
            renderSettingItem(
              'close-circle',
              'Annuler l\'abonnement',
              'Annuler votre abonnement actuel',
              handleCancelSubscription,
              true,
              colors.error
            )
          )}
        </View>

        {/* Usage Section */}
        {usage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Utilisation</Text>
            
            <View style={styles.usageCard}>
              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>Téléchargements aujourd'hui</Text>
                <Text style={styles.usageValue}>{usage.dailyDownloads}</Text>
              </View>
              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>Total téléchargements</Text>
                <Text style={styles.usageValue}>{usage.totalDownloads}</Text>
              </View>
              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>Produits accédés</Text>
                <Text style={styles.usageValue}>{usage.productsAccessed.length}</Text>
              </View>
            </View>

            {renderSettingItem(
              'refresh',
              'Réinitialiser les données',
              'Remettre à zéro les statistiques d\'usage',
              handleResetUsage,
              true,
              colors.warning
            )}
          </View>
        )}

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingItem(
            'chatbubble-ellipses',
            'Chat IA',
            'Assistance instantanée par intelligence artificielle',
            () => router.push('/chat')
          )}

          {renderSettingItem(
            'mail',
            'Contacter le support',
            'Envoyer un email à notre équipe',
            () => {
              // In a real app, this would open the email client
              Alert.alert('Contact', 'support@digigate.com');
            }
          )}

          {renderSettingItem(
            'help-circle',
            'Centre d\'aide',
            'FAQ et guides d\'utilisation',
            () => {
              Alert.alert('Centre d\'aide', 'Cette fonctionnalité sera bientôt disponible.');
            }
          )}
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          
          {renderSettingItem(
            'information-circle',
            'À propos',
            'Version 1.0.0',
            () => {
              Alert.alert('Digigate', 'Version 1.0.0\nPlateforme de produits digitaux');
            }
          )}

          {renderSettingItem(
            'document-text',
            'Conditions d\'utilisation',
            'Lire nos conditions',
            () => {
              Alert.alert('Conditions', 'Cette fonctionnalité sera bientôt disponible.');
            }
          )}

          {renderSettingItem(
            'shield-checkmark',
            'Politique de confidentialité',
            'Comment nous protégeons vos données',
            () => {
              Alert.alert('Confidentialité', 'Cette fonctionnalité sera bientôt disponible.');
            }
          )}
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
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  subscriptionCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionPlan: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  trialInfo: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500',
    marginBottom: 4,
  },
  subscriptionPrice: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  usageCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  usageLabel: {
    fontSize: 16,
    color: colors.text,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
