import React from 'react';
import { Home, Trophy, Users, Settings } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasNotification?: boolean;
  isAdmin?: boolean;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ 
  activeTab, 
  onTabChange, 
  hasNotification = false,
  isAdmin = false 
}) => {
  const tabs = [
    { id: 'my-night', label: 'My Night', icon: Home },
    { id: 'matches', label: 'Matches', icon: Trophy },
    { id: 'league-info', label: 'League Info', icon: Users },
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 z-50 safe-bottom">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === 'my-night' && hasNotification;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg
                  transition-all duration-200 min-w-[70px]
                  ${isActive 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <div className="relative">
                  <Icon 
                    className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} 
                  />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavBar;
