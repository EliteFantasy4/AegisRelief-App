import React, { useState, useEffect } from 'react';
import { Shield, Radio, Sparkles, Sun, Moon, AlertOctagon, PhoneCall } from 'lucide-react';
import { MOCK_DISASTERS } from '../data/mockDisasters';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAssistant: () => void;
  onSelectAlert: (alertId: string) => void;
  onGoToDirectory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenAssistant,
  onSelectAlert,
  onGoToDirectory,
}) => {
  const [currentUtcTime, setCurrentUtcTime] = useState<string>('');
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  // Critical alerts for ticker
  const criticalAlerts = MOCK_DISASTERS.filter((d) => d.severity === 'CRITICAL');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (criticalAlerts.length <= 1) return;
    const tickerInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % criticalAlerts.length);
    }, 6000);
    return () => clearInterval(tickerInterval);
  }, [criticalAlerts.length]);

  const activeAlert = criticalAlerts[tickerIndex] || criticalAlerts[0];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Top Tactical Broadcast Ticker */}
      {activeAlert && (
        <div className="bg-red-600 text-white text-xs px-3 py-1.5 flex items-center justify-between overflow-hidden shadow-inner">
          <div className="flex items-center gap-2 max-w-full overflow-hidden truncate">
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black/30 font-bold uppercase tracking-wider rounded">
              <span className="w-2 h-2 rounded-full bg-red-300 animate-ping inline-block" />
              LIVE CRISIS
            </span>
            <button
              onClick={() => onSelectAlert(activeAlert.id)}
              className="text-left font-medium hover:underline truncate transition-colors focus-visible:outline-none"
            >
              <span className="font-semibold text-red-100">{activeAlert.locationName} ({activeAlert.country}):</span>{' '}
              {activeAlert.title} · Status: <span className="underline">{activeAlert.status}</span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0 text-red-100 font-mono text-[11px]">
            <span>{criticalAlerts.length} Critical Emergencies</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onGoToDirectory}
              className="hover:text-white underline font-semibold flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              Emergency Dial
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 dark:from-sky-500 dark:to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Shield className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Aegis<span className="text-sky-500">Relief</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-semibold tracking-wider">
                v2.6 Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Global Disaster Intelligence &amp; Multi-Hazard Preparedness
            </p>
          </div>
        </div>

        {/* Live Clocks & Global Status */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-slate-400 dark:text-slate-500">STREAM:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SYNCHRONIZED</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div>
            <span className="text-slate-400 dark:text-slate-500">UTC: </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUtcTime || 'Syncing...'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Nepal Helpline Direct Button */}
          <button
            onClick={onGoToDirectory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Helplines & Emergency Contacts"
          >
            <span className="text-base leading-none">🇳🇵</span>
            <span className="hidden sm:inline">Nepal &amp; Global Helplines</span>
            <span className="sm:hidden">Helplines</span>
          </button>

          {/* Aegis AI Assistant Trigger Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 rounded-lg shadow-sm shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aegis AI Assistant</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none"
            aria-label="Toggle dark/light mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
