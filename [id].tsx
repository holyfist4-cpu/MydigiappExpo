
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { allProducts, paymentMethods } from '../../data/mockData';
import { useCart } from '../../hooks/useCart';
import { useSubscription } from '../../hooks/useSubscription';
import { useUsage } from '../../hooks/useUsage';
import Icon from '../../components/Icon';
import SimpleBottomSheet from '../../components/BottomSheet';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const { addToCart } = useCart();
  const { hasAccess, isTrialExpired, subscription } = useSubscription();
  const { canDownload, recordDownload, getRemainingDownloads } = useUsage();
  
  const product = allProducts.find(p => p.id === id);

  if (!product) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[styles.content, styles.centerContent]}>
          <Text style={styles.errorText}>Produit non trouvé</Text>
          <TouchableOpacity style={buttonStyles.secondary} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (!hasAccess) {
      // Redirect to subscription if no access
      router.push('/subscription');
      return;
    }
    addToCart(product);
    console.log('Added to cart:', product.title);
  };

  const handleBuyNow = () => {
    if (!hasAccess) {
      // Redirect to subscription if no access
      router.push('/subscription');
      return;
    }
    setShowPaymentSheet(true);
  };

  const handlePayment = async (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    console.log('Payment with:', method?.name);
    
    // Check download limits
    const downloadCheck = await canDownload();
    if (!downloadCheck.canDownload) {
      alert(`Limite atteinte: ${downloadCheck.reason}`);
      setShowPaymentSheet(false);
      return;
    }
    
    setShowPaymentSheet(false);
    
    // Simulate purchase and record download
    await recordDownload(product.id);
    alert(`Achat réussi avec ${method?.name}! Vous recevrez le lien de téléchargement par email.`);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Image source={{ uri: product.images[0] }} style={styles.productImage} />

        {/* Access Banner */}
        {!hasAccess && (
          <View style={styles.accessBanner}>
            <Icon name="lock-closed" size={20} color={colors.warning} />
            <View style={styles.accessInfo}>
              <Text style={styles.accessTitle}>
                {isTrialExpired ? 'Période d\'essai expirée' : 'Accès limité'}
              </Text>
              <Text style={styles.accessText}>
                {isTrialExpired 
                  ? 'Choisissez un plan pour continuer à acheter'
                  : 'Abonnez-vous pour un accès complet'
                }
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => router.push('/subscription')}
            >
              <Text style={styles.upgradeButtonText}>Voir les plans</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trial Usage Info */}
        {hasAccess && subscription?.isTrialActive && (
          <View style={styles.usageBanner}>
            <Icon name="download" size={20} color={colors.primary} />
            <View style={styles.usageInfo}>
              <Text style={styles.usageTitle}>Période d'essai</Text>
              <Text style={styles.usageText}>
                {getRemainingDownloads()} téléchargement{getRemainingDownloads() !== 1 ? 's' : ''} restant{getRemainingDownloads() !== 1 ? 's' : ''} aujourd'hui
              </Text>
            </View>
          </View>
        )}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category.name}</Text>
          </View>
          
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{product.price}€</Text>
          
          <View style={styles.creatorInfo}>
            <Image source={{ uri: product.creator.avatar }} style={styles.creatorAvatar} />
            <Text style={styles.creatorName}>par {product.creator.name}</Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Icon name="star" size={16} color={colors.warning} />
              <Text style={styles.statText}>{product.rating} ({product.reviewCount} avis)</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="download" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{product.salesCount} téléchargements</Text>
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Détails du produit</Text>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Format:</Text>
              <Text style={styles.detailValue}>{product.format}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Taille:</Text>
              <Text style={styles.detailValue}>{product.fileSize}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tags}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={[buttonStyles.secondary, styles.addToCartButton]} onPress={handleAddToCart}>
          <Icon name="bag-add" size={20} color={colors.text} />
          <Text style={styles.addToCartText}>Panier</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            buttonStyles.primary, 
            styles.buyButton,
            !hasAccess && styles.disabledButton
          ]} 
          onPress={handleBuyNow}
        >
          <Text style={styles.buyButtonText}>
            {!hasAccess ? 'S\'abonner pour acheter' : 'Acheter maintenant'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
      >
        <View style={styles.paymentSheet}>
          <Text style={styles.paymentTitle}>Choisir un moyen de paiement</Text>
          {paymentMethods.filter(method => method.available).map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentMethod}
              onPress={() => handlePayment(method.id)}
            >
              <Icon name={method.icon as any} size={24} color={colors.primary} />
              <Text style={styles.paymentMethodText}>{method.name}</Text>
              <Icon name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addToCartText: {
    color: colors.text,
    fontWeight: '600',
    marginLeft: 8,
  },
  buyButton: {
    flex: 2,
  },
  buyButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  paymentSheet: {
    padding: 20,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 12,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '600',
  },
  accessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 12,
  },
  accessInfo: {
    flex: 1,
    marginLeft: 12,
  },
  accessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
  },
  accessText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  upgradeButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  disabledButton: {
    opacity: 0.7,
  },
  usageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    borderRadius: 12,
  },
  usageInfo: {
    marginLeft: 12,
  },
  usageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  usageText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
