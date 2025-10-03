
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSubscription, SubscriptionPlan } from '../types';
import { mockUserSubscription, subscriptionPlans } from '../data/mockData';

const SUBSCRIPTION_STORAGE_KEY = 'user_subscription';
const TRIAL_START_KEY = 'trial_start_date';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  // Initialize subscription data
  useEffect(() => {
    loadSubscription();
  }, []);

  // Calculate trial days left
  useEffect(() => {
    if (subscription?.isTrialActive && subscription.trialEndDate) {
      const trialEnd = new Date(subscription.trialEndDate);
      const now = new Date();
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setTrialDaysLeft(Math.max(0, daysLeft));
    }
  }, [subscription]);

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Check if user has existing subscription
      const storedSubscription = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      
      if (storedSubscription) {
        const parsedSubscription = JSON.parse(storedSubscription);
        
        // Check if trial has expired
        if (parsedSubscription.isTrialActive && parsedSubscription.trialEndDate) {
          const trialEnd = new Date(parsedSubscription.trialEndDate);
          const now = new Date();
          
          if (now > trialEnd) {
            // Trial expired, update status
            parsedSubscription.isTrialActive = false;
            parsedSubscription.status = 'expired';
            await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(parsedSubscription));
          }
        }
        
        setSubscription(parsedSubscription);
      } else {
        // First time user, start trial
        await startTrial();
      }
    } catch (error) {
      console.log('Error loading subscription:', error);
      // Fallback to trial
      await startTrial();
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    try {
      const trialStartDate = new Date().toISOString();
      const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now
      
      const trialSubscription: UserSubscription = {
        ...mockUserSubscription,
        startDate: trialStartDate,
        trialEndDate: trialEndDate,
        isTrialActive: true,
        status: 'trial'
      };

      await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(trialSubscription));
      await AsyncStorage.setItem(TRIAL_START_KEY, trialStartDate);
      
      setSubscription(trialSubscription);
      console.log('Trial started:', trialSubscription);
    } catch (error) {
      console.log('Error starting trial:', error);
    }
  };

  const subscribeToPlan = useCallback(async (planId: string) => {
    try {
      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      const now = new Date();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      const newSubscription: UserSubscription = {
        id: `sub_${Date.now()}`,
        userId: '1',
        planId: plan.id,
        plan: plan,
        status: 'active',
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        isTrialActive: false,
        autoRenew: true
      };

      await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(newSubscription));
      setSubscription(newSubscription);
      
      console.log('Subscribed to plan:', plan.name);
      return true;
    } catch (error) {
      console.log('Error subscribing to plan:', error);
      return false;
    }
  }, []);

  const cancelSubscription = useCallback(async () => {
    try {
      if (subscription) {
        const updatedSubscription = {
          ...subscription,
          status: 'cancelled' as const,
          autoRenew: false
        };

        await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(updatedSubscription));
        setSubscription(updatedSubscription);
        
        console.log('Subscription cancelled');
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error cancelling subscription:', error);
      return false;
    }
  }, [subscription]);

  const isTrialActive = subscription?.isTrialActive || false;
  const isSubscriptionActive = subscription?.status === 'active';
  const hasAccess = isTrialActive || isSubscriptionActive;
  const isTrialExpired = subscription?.status === 'expired' || (subscription?.isTrialActive === false && subscription?.status === 'trial');

  return {
    subscription,
    isLoading,
    trialDaysLeft,
    isTrialActive,
    isSubscriptionActive,
    hasAccess,
    isTrialExpired,
    subscribeToPlan,
    cancelSubscription,
    loadSubscription
  };
};
