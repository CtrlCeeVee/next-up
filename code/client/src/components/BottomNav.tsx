import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, BarChart3, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 px-4 py-3 safe-area-bottom shadow-lg z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive('/') && !isActive('/profile') && !isActive('/league')
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          } group`}
        >
          <Home className={`w-6 h-6 group-hover:scale-110 transition-transform ${
            isActive('/') && !isActive('/profile') && !isActive('/league') ? 'stroke-[2.5]' : 'stroke-[2]'
          }`} />
          <span className={`text-xs ${
            isActive('/') && !isActive('/profile') && !isActive('/league') ? 'font-semibold' : ''
          }`}>Home</span>
        </button>
        <button 
          onClick={() => navigate('/leagues')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            location.pathname.startsWith('/league')
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          } group`}
        >
          <Trophy className={`w-6 h-6 group-hover:scale-110 transition-transform ${
            location.pathname.startsWith('/league') ? 'stroke-[2.5]' : 'stroke-[2]'
          }`} />
          <span className={`text-xs ${
            location.pathname.startsWith('/league') ? 'font-semibold' : ''
          }`}>Leagues</span>
        </button>
        <button 
          onClick={() => navigate('/profile?tab=stats')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            location.pathname === '/profile' && location.search.includes('tab=stats')
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          } group`}
        >
          <BarChart3 className={`w-6 h-6 group-hover:scale-110 transition-transform ${
            location.pathname === '/profile' && location.search.includes('tab=stats') ? 'stroke-[2.5]' : 'stroke-[2]'
          }`} />
          <span className={`text-xs ${
            location.pathname === '/profile' && location.search.includes('tab=stats') ? 'font-semibold' : ''
          }`}>Stats</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            location.pathname === '/profile' && !location.search.includes('tab=')
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          } group`}
        >
          <User className={`w-6 h-6 group-hover:scale-110 transition-transform ${
            location.pathname === '/profile' && !location.search.includes('tab=') ? 'stroke-[2.5]' : 'stroke-[2]'
          }`} />
          <span className={`text-xs ${
            location.pathname === '/profile' && !location.search.includes('tab=') ? 'font-semibold' : ''
          }`}>Profile</span>
        </button>
      </div>
    </div>
  );
}
