
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { featuredProducts, categories } from '../data/mockData';
import { useCart } from '../hooks/useCart';
import { useSubscription } from '../hooks/useSubscription';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import BottomTabBar from '../components/BottomTabBar';
import Icon from '../components/Icon';
import TrialNotification from '../components/TrialNotification';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true);
  const { addToCart, getCartItemsCount } = useCart();
  const { subscription, trialDaysLeft, isTrialActive, isTrialExpired, hasAccess } = useSubscription();

  useEffect(() => {
    // Check if it's first time opening the app
    const checkFirstTime = async () => {
      try {
        // In a real app, you'd check AsyncStorage or similar
        // For demo purposes, we'll show onboarding once
        const hasSeenOnboarding = false; // This would come from storage
        if (!hasSeenOnboarding) {
          router.replace('/welcome');
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.log('Error checking first time:', error);
        setIsFirstTime(false);
      }
    };

    checkFirstTime();
  }, []);

  const handleProductPress = (productId: string) => {
    console.log('Product pressed:', productId);
    router.push(`/product/${productId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
    // Navigation vers la page catégorie
  };

  const handleAddToCart = (productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      console.log('Added to cart:', product.title);
    }
  };

  const renderHomeContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Bonjour 👋</Text>
          <Text style={styles.welcomeText}>Découvrez des produits digitaux exceptionnels</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/chat')}
          >
            <Icon name="chatbubble-ellipses" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/settings')}
          >
            <Icon name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications" size={24} color={colors.text} />
            {getCartItemsCount() > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getCartItemsCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscription Status Banner */}
      {isTrialActive && (
        <TouchableOpacity 
          style={styles.trialBanner}
          onPress={() => router.push('/subscription')}
        >
          <Icon name="time" size={20} color={colors.warning} />
          <Text style={styles.trialText}>
            Essai gratuit - {trialDaysLeft} jour{trialDaysLeft > 1 ? 's' : ''} restant{trialDaysLeft > 1 ? 's' : ''}
          </Text>
          <Icon name="chevron-forward" size={16} color={colors.warning} />
        </TouchableOpacity>
      )}

      {isTrialExpired && (
        <TouchableOpacity 
          style={styles.expiredBanner}
          onPress={() => router.push('/subscription')}
        >
          <Icon name="warning" size={20} color={colors.error} />
          <Text style={styles.expiredText}>
            Période d'essai expirée - Choisissez un plan
          </Text>
          <Icon name="chevron-forward" size={16} color={colors.error} />
        </TouchableOpacity>
      )}

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilter={() => console.log('Filter pressed')}
      />

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produits en vedette</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={() => handleProductPress(product.id)}
            onAddToCart={() => handleAddToCart(product.id)}
          />
        ))}
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Digigate en chiffres</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Produits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5K+</Text>
            <Text style={styles.statLabel}>Créateurs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Utilisateurs</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'explore':
        return (
          <View style={[styles.content, styles.centerContent]}>
            <Icon name="compass" size={64} color={colors.textLight} />
            <Text style={styles.comingSoonTitle}>Explorer</Text>
            <Text style={styles.comingSoonText}>Découvrez tous nos produits par catégorie</Text>
          </View>
        );
      case 'cart':
        return (
          <View style={[styles.content, styles.centerContent]}>
            <Icon name="bag" size={64} color={colors.textLight} />
            <Text style={styles.comingSoonTitle}>Panier</Text>
            <Text style={styles.comingSoonText}>Gérez vos achats et procédez au paiement</Text>
            {getCartItemsCount() > 0 && (
              <Text style={styles.cartCount}>{getCartItemsCount()} article(s) dans le panier</Text>
            )}
          </View>
        );
      case 'profile':
        return (
          <View style={[styles.content, styles.centerContent]}>
            <Icon name="person" size={64} color={colors.textLight} />
            <Text style={styles.comingSoonTitle}>Profil</Text>
            <Text style={styles.comingSoonText}>Gérez votre compte et vos achats</Text>
            
            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/subscription')}
              >
                <Icon name="card" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>Abonnement</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/chat')}
              >
                <Icon name="chatbubble-ellipses" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>Support IA</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/settings')}
              >
                <Icon name="settings" size={24} color={colors.primary} />
                <Text style={styles.quickActionText}>Paramètres</Text>
              </TouchableOpacity>
            </View>

            {/* Subscription Info */}
            {subscription && (
              <View style={styles.subscriptionInfo}>
                <Text style={styles.subscriptionTitle}>
                  Plan actuel: {subscription.plan.name}
                </Text>
                <Text style={styles.subscriptionStatus}>
                  {isTrialActive 
                    ? `Essai - ${trialDaysLeft} jour${trialDaysLeft > 1 ? 's' : ''} restant${trialDaysLeft > 1 ? 's' : ''}`
                    : subscription.status === 'active' 
                      ? 'Actif' 
                      : 'Expiré'
                  }
                </Text>
              </View>
            )}
          </View>
        );
      default:
        return renderHomeContent();
    }
  };

  if (isFirstTime) {
    return null; // Will redirect to welcome/onboarding
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      {renderTabContent()}
      
      {/* Trial Notification */}
      <TrialNotification />
      
      {/* Floating Chat Button */}
      <TouchableOpacity 
        style={styles.floatingChatButton}
        onPress={() => router.push('/chat')}
      >
        <Icon name="chatbubble-ellipses" size={24} color={colors.background} />
      </TouchableOpacity>
      
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesScroll: {
    marginTop: 16,
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  cartCount: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 16,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  trialText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
    marginLeft: 8,
  },
  expiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  expiredText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 32,
    gap: 16,
    justifyContent: 'center',
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 100,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  subscriptionInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subscriptionStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
