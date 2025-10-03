
import { useState, useEffect, useCallback } from 'react';
import { UsageService } from '../services/usageService';
import { useSubscription } from './useSubscription';

interface UsageData {
  dailyDownloads: number;
  totalDownloads: number;
  lastResetDate: string;
  productsAccessed: string[];
}

export const useUsage = () => {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { subscription } = useSubscription();

  const loadUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const usageData = await UsageService.getUsageData();
      setUsage(usageData);
    } catch (error) {
      console.log('Error loading usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsage();
  }, [loadUsage]);

  const canDownload = useCallback(async (): Promise<{ canDownload: boolean; reason?: string }> => {
    return await UsageService.canDownload(subscription);
  }, [subscription]);

  const canAccessProduct = useCallback(async (productId: string): Promise<{ canAccess: boolean; reason?: string }> => {
    return await UsageService.canAccessProduct(productId, subscription);
  }, [subscription]);

  const recordDownload = useCallback(async (productId: string) => {
    await UsageService.recordDownload(productId);
    await loadUsage(); // Refresh usage data
  }, [loadUsage]);

  const resetUsage = useCallback(async () => {
    await UsageService.resetUsage();
    await loadUsage(); // Refresh usage data
  }, [loadUsage]);

  // Calculate remaining downloads for trial users
  const getRemainingDownloads = useCallback(() => {
    if (!subscription?.isTrialActive || !usage) return null;
    
    const dailyLimit = 3;
    return Math.max(0, dailyLimit - usage.dailyDownloads);
  }, [subscription, usage]);

  return {
    usage,
    isLoading,
    canDownload,
    canAccessProduct,
    recordDownload,
    resetUsage,
    getRemainingDownloads,
    loadUsage
  };
};
