import React, { useState } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';

/**
 * NotificationPermissionBanner
 * Shows when user hasn't granted notification permission yet
 * Appears at top of app or as a card in settings
 */
export const NotificationPermissionBanner: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { subscribe, isLoading, isSupported, permission, isSubscribed } = usePushNotifications();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleEnable = async () => {
    const success = await subscribe();
    if (success && onDismiss) {
      onDismiss();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Don't show if not supported, already subscribed, or dismissed
  if (!isSupported || isSubscribed || isDismissed || permission === 'denied') {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <Bell className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Stay in the game!</p>
          <p className="text-xs opacity-90">Get notified when your match is ready</p>
        </div>
        <button
          onClick={handleEnable}
          disabled={isLoading}
          className="px-4 py-2 bg-white text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Enabling...' : 'Enable'}
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/**
 * NotificationSettingsCard
 * Detailed notification settings for profile/settings page
 */
export const NotificationSettingsCard: React.FC = () => {
  const { 
    subscribe, 
    unsubscribe, 
    isLoading, 
    isSupported, 
    isSubscribed, 
    permission,
    error
  } = usePushNotifications();

  const [testLoading, setTestLoading] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string | null>(null);

  // Debug: Log state changes
  React.useEffect(() => {
    console.log('[NotificationSettingsCard] State:', {
      isSupported,
      isSubscribed,
      permission,
      isLoading,
      error
    });
  }, [isSupported, isSubscribed, permission, isLoading, error]);

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const handleTestNotification = async () => {
    setTestLoading(true);
    setTestResult(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/push/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setTestResult('✓ Test notification sent! Check your notifications.');
      } else {
        setTestResult('✗ Failed to send notification');
      }
    } catch (err) {
      setTestResult('✗ Error sending test notification');
      console.error('Test notification error:', err);
    } finally {
      setTestLoading(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <BellOff className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              Push Notifications
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your browser doesn't support push notifications. Try using Chrome, Firefox, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <BellOff className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              Notifications Blocked
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              You've blocked notifications for this site. To enable them:
            </p>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Find "Notifications" and change to "Allow"</li>
              <li>Refresh this page</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Bell className={`w-5 h-5 mt-0.5 ${isSubscribed ? 'text-emerald-600' : 'text-slate-400'}`} />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              Push Notifications
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Get notified when your match is ready, scores need confirmation, or you receive partnership requests
            </p>
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                {error}
              </p>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {isSubscribed ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {testResult && (
              <p className={`text-xs mt-2 ${testResult.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                {testResult}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {isSubscribed && (
            <button
              onClick={handleTestNotification}
              disabled={testLoading}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all disabled:opacity-50"
            >
              {testLoading ? 'Sending...' : 'Test'}
            </button>
          )}
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
              isSubscribed
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700'
            }`}
          >
            {isLoading ? 'Loading...' : isSubscribed ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};
