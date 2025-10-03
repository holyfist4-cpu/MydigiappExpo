
import { Product, ProductCategory, PaymentMethod, User, SubscriptionPlan, UserSubscription } from '../types';

export const categories: ProductCategory[] = [
  { id: '1', name: 'E-books', icon: 'book', color: '#3B82F6' },
  { id: '2', name: 'Formations', icon: 'school', color: '#10B981' },
  { id: '3', name: 'Logiciels', icon: 'desktop', color: '#8B5CF6' },
  { id: '4', name: 'Templates', icon: 'document', color: '#F59E0B' },
  { id: '5', name: 'Audio', icon: 'musical-notes', color: '#EF4444' },
  { id: '6', name: 'Vidéos', icon: 'videocam', color: '#06B6D4' },
];

export const paymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Carte Bancaire', icon: 'card', available: true, regions: ['Global'] },
  { id: '2', name: 'PayPal', icon: 'logo-paypal', available: true, regions: ['Global'] },
  { id: '3', name: 'Orange Money', icon: 'phone-portrait', available: true, regions: ['Africa'] },
  { id: '4', name: 'MTN MoMo', icon: 'phone-portrait', available: true, regions: ['Africa'] },
  { id: '5', name: 'Wave', icon: 'phone-portrait', available: true, regions: ['Africa'] },
  { id: '6', name: 'Bitcoin', icon: 'logo-bitcoin', available: true, regions: ['Global'] },
];

export const mockUser: User = {
  id: '1',
  name: 'Jean Dupont',
  email: 'jean@example.com',
  isCreator: true,
  createdAt: '2024-01-01',
};

export const featuredProducts: Product[] = [
  {
    id: '1',
    title: 'Guide Complet du Marketing Digital',
    description: 'Un guide exhaustif pour maîtriser le marketing digital en Afrique et à l\'international.',
    price: 29.99,
    currency: 'EUR',
    category: categories[0],
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
    fileSize: '15 MB',
    format: 'PDF',
    creatorId: '1',
    creator: { name: 'Marie Kouassi', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' },
    rating: 4.8,
    reviewCount: 124,
    salesCount: 856,
    tags: ['marketing', 'digital', 'business'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    featured: true,
  },
  {
    id: '2',
    title: 'Formation React Native Complète',
    description: 'Apprenez à créer des applications mobiles professionnelles avec React Native.',
    price: 89.99,
    currency: 'EUR',
    category: categories[1],
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'],
    fileSize: '2.5 GB',
    format: 'Vidéo MP4',
    creatorId: '2',
    creator: { name: 'Ahmed Ben Ali', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    rating: 4.9,
    reviewCount: 89,
    salesCount: 234,
    tags: ['react-native', 'mobile', 'développement'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    featured: true,
  },
  {
    id: '3',
    title: 'Templates UI/UX Modernes',
    description: 'Collection de 50+ templates modernes pour vos projets web et mobile.',
    price: 49.99,
    currency: 'EUR',
    category: categories[3],
    images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'],
    fileSize: '120 MB',
    format: 'Figma + Sketch',
    creatorId: '3',
    creator: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    rating: 4.7,
    reviewCount: 67,
    salesCount: 445,
    tags: ['ui', 'ux', 'design', 'templates'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    featured: true,
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basique',
    description: 'Parfait pour commencer',
    price: 9.99,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Accès à tous les produits',
      'Téléchargements illimités',
      'Support par email',
      'Mises à jour gratuites'
    ],
    maxProducts: 50,
    maxDownloads: 100,
    supportLevel: 'basic'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Le plus populaire',
    price: 19.99,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Tout du plan Basique',
      'Accès prioritaire aux nouveautés',
      'Support chat en direct',
      'Contenu exclusif',
      'Analytics avancées'
    ],
    isPopular: true,
    maxProducts: 200,
    maxDownloads: 500,
    supportLevel: 'premium'
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Pour les professionnels',
    price: 49.99,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Tout du plan Premium',
      'Support téléphonique 24/7',
      'Gestionnaire de compte dédié',
      'API personnalisée',
      'Intégrations avancées',
      'Formation personnalisée'
    ],
    supportLevel: 'enterprise'
  }
];

// Mock user subscription (trial active)
export const mockUserSubscription: UserSubscription = {
  id: 'sub_1',
  userId: '1',
  planId: 'trial',
  plan: {
    id: 'trial',
    name: 'Essai Gratuit',
    description: 'Période d\'essai de 7 jours',
    price: 0,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Accès limité aux produits',
      'Support par email',
      '3 téléchargements par jour'
    ],
    maxProducts: 10,
    maxDownloads: 21,
    supportLevel: 'basic'
  },
  status: 'trial',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  isTrialActive: true,
  autoRenew: false
};

export const allProducts: Product[] = [
  ...featuredProducts,
  {
    id: '4',
    title: 'Logiciel de Gestion Comptable',
    description: 'Solution complète pour la gestion comptable des PME africaines.',
    price: 199.99,
    currency: 'EUR',
    category: categories[2],
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'],
    fileSize: '45 MB',
    format: 'Windows/Mac',
    creatorId: '4',
    creator: { name: 'Kwame Asante', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    rating: 4.6,
    reviewCount: 34,
    salesCount: 123,
    tags: ['comptabilité', 'gestion', 'pme'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    featured: false,
  },
  {
    id: '5',
    title: 'Pack Audio Afrobeat',
    description: 'Collection de samples et loops Afrobeat professionnels.',
    price: 39.99,
    currency: 'EUR',
    category: categories[4],
    images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'],
    fileSize: '500 MB',
    format: 'WAV/AIFF',
    creatorId: '5',
    creator: { name: 'DJ Koffi', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    rating: 4.9,
    reviewCount: 156,
    salesCount: 678,
    tags: ['afrobeat', 'samples', 'musique'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    featured: false,
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basique',
    description: 'Parfait pour commencer',
    price: 9.99,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Accès à tous les produits',
      'Téléchargements illimités',
      'Support par email',
      'Mises à jour gratuites'
    ],
    maxProducts: 50,
    maxDownloads: 100,
    supportLevel: 'basic'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Le plus populaire',
    price: 19.99,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Tout du plan Basique',
      'Accès prioritaire aux nouveautés',
      'Support chat en direct',
      'Contenu exclusif',
      'Analytics avancées'
    ],
    isPopular: true,
    maxProducts: 200,
    maxDownloads: 500,
    supportLevel: 'premium'
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Pour les professionnels',
    price: 49.99,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Tout du plan Premium',
      'Support téléphonique 24/7',
      'Gestionnaire de compte dédié',
      'API personnalisée',
      'Intégrations avancées',
      'Formation personnalisée'
    ],
    supportLevel: 'enterprise'
  }
];

// Mock user subscription (trial active)
export const mockUserSubscription: UserSubscription = {
  id: 'sub_1',
  userId: '1',
  planId: 'trial',
  plan: {
    id: 'trial',
    name: 'Essai Gratuit',
    description: 'Période d\'essai de 7 jours',
    price: 0,
    currency: 'EUR',
    duration: 'monthly',
    features: [
      'Accès limité aux produits',
      'Support par email',
      '3 téléchargements par jour'
    ],
    maxProducts: 10,
    maxDownloads: 21,
    supportLevel: 'basic'
  },
  status: 'trial',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  isTrialActive: true,
  autoRenew: false
};
