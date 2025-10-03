
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Bienvenue sur Digigate',
    subtitle: 'Votre marketplace de produits digitaux',
    description: 'Découvrez des milliers de produits digitaux créés par des experts du monde entier.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    icon: 'storefront',
  },
  {
    id: 2,
    title: 'Paiements Sécurisés',
    subtitle: 'Adaptés à votre région',
    description: 'Payez avec votre méthode préférée : cartes, PayPal, mobile money, crypto et plus.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    icon: 'card',
  },
  {
    id: 3,
    title: 'Téléchargement Instantané',
    subtitle: 'Accès immédiat à vos achats',
    description: 'Téléchargez vos produits immédiatement après l\'achat, où que vous soyez.',
    image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400',
    icon: 'download',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/');
    }
  };

  const handleSkip = () => {
    router.replace('/');
  };

  const currentData = onboardingData[currentIndex];

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: currentData.image }} style={styles.image} />
            <View style={styles.iconOverlay}>
              <Icon name={currentData.icon as any} size={32} color={colors.primary} />
            </View>
          </View>

          <View style={styles.textContent}>
            <Text style={styles.title}>{currentData.title}</Text>
            <Text style={styles.subtitle}>{currentData.subtitle}</Text>
            <Text style={styles.description}>{currentData.description}</Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentIndex ? colors.primary : colors.border }
                ]}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity style={[buttonStyles.primary, styles.nextButton]} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1 ? 'Commencer' : 'Suivant'}
            </Text>
            <Icon 
              name={currentIndex === onboardingData.length - 1 ? 'checkmark' : 'arrow-forward'} 
              size={20} 
              color={colors.background} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  skipText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    backgroundColor: colors.background,
    borderRadius: 30,
    padding: 16,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
