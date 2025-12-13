import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface PushSubscriptionState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  permission: NotificationPermission;
}

/**
 * Hook to manage push notification subscriptions
 * Handles: permission requests, subscribing/unsubscribing, service worker communication
 */
export function usePushNotifications() {
  const { user } = useAuth();
  const [state, setState] = useState<PushSubscriptionState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    error: null,
    permission: 'default'
  });

  useEffect(() => {
    checkSupport();
    checkSubscription();
  }, [user]);

  /**
   * Check if push notifications are supported
   */
  const checkSupport = () => {
    const isSupported = 
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setState(prev => ({ 
      ...prev, 
      isSupported,
      permission: isSupported ? Notification.permission : 'denied'
    }));

    if (!isSupported) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Check if user is already subscribed
   */
  const checkSubscription = async () => {
    if (!state.isSupported || !user) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      setState(prev => ({
        ...prev,
        isSubscribed: subscription !== null,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error checking subscription:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Failed to check subscription status'
      }));
    }
  };

  /**
   * Request notification permission and subscribe
   */
  const subscribe = async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Push notifications not supported' }));
      return false;
    }

    if (!user) {
      setState(prev => ({ ...prev, error: 'Must be logged in to subscribe' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));

      if (permission !== 'granted') {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Notification permission denied'
        }));
        return false;
      }

      // Get VAPID public key from backend
      const keyResponse = await fetch(`${API_URL}/api/push/vapid-public-key`);
      const { publicKey } = await keyResponse.json();

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to backend
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setState(prev => ({ 
        ...prev, 
        isSubscribed: true, 
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to subscribe'
      }));
      return false;
    }
  };

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = async (): Promise<boolean> => {
    if (!state.isSupported || !user) {
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setState(prev => ({ 
          ...prev, 
          isSubscribed: false, 
          isLoading: false 
        }));
        return true;
      }

      // Unsubscribe from browser
      await subscription.unsubscribe();

      // Notify backend
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/push/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });

      setState(prev => ({ 
        ...prev, 
        isSubscribed: false, 
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to unsubscribe'
      }));
      return false;
    }
  };

  return {
    ...state,
    subscribe,
    unsubscribe,
    refresh: checkSubscription
  };
}

/**
 * Helper: Convert VAPID public key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
