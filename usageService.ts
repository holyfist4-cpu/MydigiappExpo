
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSubscription } from '../types';

const USAGE_STORAGE_KEY = 'user_usage';

interface UsageData {
  dailyDownloads: number;
  totalDownloads: number;
  lastResetDate: string;
  productsAccessed: string[];
}

export class UsageService {
  static async getUsageData(): Promise<UsageData> {
    try {
      const stored = await AsyncStorage.getItem(USAGE_STORAGE_KEY);
      if (stored) {
        const usage = JSON.parse(stored);
        
        // Reset daily downloads if it's a new day
        const today = new Date().toDateString();
        if (usage.lastResetDate !== today) {
          usage.dailyDownloads = 0;
          usage.lastResetDate = today;
          await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
        }
        
        return usage;
      }
    } catch (error) {
      console.log('Error getting usage data:', error);
    }

    // Return default usage data
    const defaultUsage: UsageData = {
      dailyDownloads: 0,
      totalDownloads: 0,
      lastResetDate: new Date().toDateString(),
      productsAccessed: []
    };

    await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(defaultUsage));
    return defaultUsage;
  }

  static async canDownload(subscription: UserSubscription | null): Promise<{ canDownload: boolean; reason?: string }> {
    if (!subscription) {
      return { canDownload: false, reason: 'Aucun abonnement actif' };
    }

    const usage = await this.getUsageData();
    
    // Check daily download limit for trial users
    if (subscription.isTrialActive) {
      const dailyLimit = 3; // 3 downloads per day during trial
      if (usage.dailyDownloads >= dailyLimit) {
        return { 
          canDownload: false, 
          reason: `Limite quotidienne atteinte (${dailyLimit} téléchargements/jour en période d'essai)` 
        };
      }
    }

    // Check total download limit based on plan
    if (subscription.plan.maxDownloads && usage.totalDownloads >= subscription.plan.maxDownloads) {
      return { 
        canDownload: false, 
        reason: `Limite totale atteinte (${subscription.plan.maxDownloads} téléchargements)` 
      };
    }

    return { canDownload: true };
  }

  static async recordDownload(productId: string): Promise<void> {
    try {
      const usage = await this.getUsageData();
      
      usage.dailyDownloads += 1;
      usage.totalDownloads += 1;
      
      if (!usage.productsAccessed.includes(productId)) {
        usage.productsAccessed.push(productId);
      }

      await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
      console.log('Download recorded:', { productId, usage });
    } catch (error) {
      console.log('Error recording download:', error);
    }
  }

  static async canAccessProduct(productId: string, subscription: UserSubscription | null): Promise<{ canAccess: boolean; reason?: string }> {
    if (!subscription) {
      return { canAccess: false, reason: 'Aucun abonnement actif' };
    }

    // Trial users have limited access
    if (subscription.isTrialActive) {
      const usage = await this.getUsageData();
      const trialLimit = subscription.plan.maxProducts || 10;
      
      if (usage.productsAccessed.length >= trialLimit && !usage.productsAccessed.includes(productId)) {
        return { 
          canAccess: false, 
          reason: `Limite d'accès atteinte (${trialLimit} produits en période d'essai)` 
        };
      }
    }

    return { canAccess: true };
  }

  static async resetUsage(): Promise<void> {
    try {
      const defaultUsage: UsageData = {
        dailyDownloads: 0,
        totalDownloads: 0,
        lastResetDate: new Date().toDateString(),
        productsAccessed: []
      };

      await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(defaultUsage));
      console.log('Usage data reset');
    } catch (error) {
      console.log('Error resetting usage:', error);
    }
  }
}
