import React from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
type RealtimeConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface RealtimeStatusIndicatorProps {
  status: RealtimeConnectionStatus | { connectionStatus: RealtimeConnectionStatus };
  className?: string;
}

export const RealtimeStatusIndicator: React.FC<RealtimeStatusIndicatorProps> = ({ 
  status, 
  className = '' 
}) => {
  // Handle both old and new status formats
  const connectionStatus = typeof status === 'string' ? status : status.connectionStatus;
  
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          borderColor: 'border-green-200 dark:border-green-700/50',
          text: 'Live Updates Active',
          description: 'Real-time updates are working'
        };
      case 'connecting':
        return {
          icon: Wifi,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          borderColor: 'border-yellow-200 dark:border-yellow-700/50',
          text: 'Connecting...',
          description: 'Establishing real-time connection'
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-700/30',
          borderColor: 'border-gray-200 dark:border-gray-600/50',
          text: 'Disconnected',
          description: 'Real-time updates unavailable - refresh to see changes'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          borderColor: 'border-red-200 dark:border-red-700/50',
          text: 'Connection Error',
          description: 'Real-time updates failed - refresh to see changes'
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-700/30',
          borderColor: 'border-gray-200 dark:border-gray-600/50',
          text: 'Unknown',
          description: 'Connection status unknown'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  // Don't show anything when connected (to reduce UI clutter)
  if (status === 'connected') {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-center space-x-2">
          <IconComponent className={`h-4 w-4 ${config.color} ${status === 'connecting' ? 'animate-pulse' : ''}`} />
          <div className="text-sm">
            <div className={`font-medium ${config.color}`}>
              {config.text}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-xs">
              {config.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeStatusIndicator;