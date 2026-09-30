import React from 'react';
import {
  Radio,
  BarChart3,
  BookOpen,
  History,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'live-stream'
  | 'analytics'
  | 'preparedness'
  | 'historical'
  | 'directory'
  | 'assistant';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeAlertCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  activeAlertCount,
}) => {
  const tabs = [
    {
      id: 'live-stream' as ActiveTab,
      label: 'Live Stream & Map',
      icon: Radio,
      badge: activeAlertCount,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics & Trends',
      icon: BarChart3,
    },
    {
      id: 'preparedness' as ActiveTab,
      label: 'Action & Preparedness',
      icon: BookOpen,
    },
    {
      id: 'historical' as ActiveTab,
      label: 'Historical Archives',
      icon: History,
    },
    {
      id: 'directory' as ActiveTab,
      label: 'Emergency Directory',
      icon: PhoneCall,
      specialIndicator: '🇳🇵 Hotlines',
    },
    {
      id: 'assistant' as ActiveTab,
      label: 'Aegis AI Companion',
      icon: Sparkles,
      highlight: true,
    },
  ];

  return (
    <nav className="bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur sticky top-[61px] z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150 focus-visible:outline-none ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                } ${tab.highlight ? 'relative' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      tab.badgeColor || 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {tab.specialIndicator && (
                  <span className="hidden md:inline text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    {tab.specialIndicator}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
