import React, { useState, useEffect } from 'react';
import { MOCK_DISASTERS } from './data/mockDisasters';
import { DisasterAlert } from './types/disaster';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { AlertMap } from './components/LiveAlerts/AlertMap';
import { AlertList } from './components/LiveAlerts/AlertList';
import { AlertDetailModal } from './components/LiveAlerts/AlertDetailModal';
import { AnalyticsHub } from './components/Analytics/AnalyticsHub';
import { PreparednessGuides } from './components/Preparedness/PreparednessGuides';
import { HistoricalArchives } from './components/Historical/HistoricalArchives';
import { EmergencyDirectory } from './components/Directory/EmergencyDirectory';
import { AegisAssistant } from './components/Assistant/AegisAssistantModal';
import {
  Shield,
  Activity,
  HeartHandshake,
  ExternalLink,
  MapPin,
  Layers,
  Sparkles,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aegis_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('live-stream');

  // Selected disaster alert for detail inspection
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(null);

  // AI Assistant Modal state
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string>('');
  const [assistantContext, setAssistantContext] = useState<string | undefined>(undefined);

  // Directory selected country override
  const [directoryCountry, setDirectoryCountry] = useState<string>('Nepal');

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aegis_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aegis_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Triggers AI Assistant with pre-filled context
  const handleAskAiAboutAlert = (alert: DisasterAlert) => {
    setAssistantInitialQuery(
      `Provide an immediate emergency response brief and survivor directives for the ${alert.title} in ${alert.locationName} (${alert.country}).`
    );
    setAssistantContext(alert.category);
    setIsAssistantOpen(true);
  };

  const handleAskAiForGuide = (guideType: string) => {
    setAssistantInitialQuery(
      `What are the most critical, life-saving steps to take immediately during an ${guideType}? Please provide a prioritized checklist.`
    );
    setAssistantContext(guideType);
    setIsAssistantOpen(true);
  };

  const handleGoToDirectoryForCountry = (country: string) => {
    setSelectedAlert(null);
    setDirectoryCountry(country);
    setActiveTab('directory');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-sky-500 selection:text-white">
      {/* Top Header & Tactical Broadcast Ticker */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAssistant={() => {
          setAssistantInitialQuery('');
          setIsAssistantOpen(true);
        }}
        onSelectAlert={(id) => {
          const match = MOCK_DISASTERS.find((d) => d.id === id);
          if (match) setSelectedAlert(match);
        }}
        onGoToDirectory={() => {
          setDirectoryCountry('Nepal');
          setActiveTab('directory');
        }}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'assistant') {
            setIsAssistantOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        activeAlertCount={MOCK_DISASTERS.length}
      />

      {/* Primary Dynamic Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Live Stream & Map View */}
        {activeTab === 'live-stream' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Geospatial Map Section */}
            <section aria-label="Interactive Global Threat Map">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Live Threat Radar &amp; Geospatial Coordinates
                  </h2>
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:block">
                  Click any epicenter marker to view tactical SitRep
                </div>
              </div>

              <AlertMap
                alerts={MOCK_DISASTERS}
                selectedAlertId={selectedAlert?.id || null}
                onSelectAlert={(alert) => setSelectedAlert(alert)}
              />
            </section>

            {/* Filterable Alert Stream List / High-Density Table */}
            <section aria-label="Active Disaster Stream">
              <AlertList
                alerts={MOCK_DISASTERS}
                selectedAlertId={selectedAlert?.id || null}
                onSelectAlert={(alert) => setSelectedAlert(alert)}
              />
            </section>
          </div>
        )}

        {/* Tab 2: Analytics & Trends */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in duration-150">
            <AnalyticsHub alerts={MOCK_DISASTERS} />
          </div>
        )}

        {/* Tab 3: Action & Preparedness */}
        {activeTab === 'preparedness' && (
          <div className="animate-in fade-in duration-150">
            <PreparednessGuides onAskAiForGuide={handleAskAiForGuide} />
          </div>
        )}

        {/* Tab 4: Historical Archives */}
        {activeTab === 'historical' && (
          <div className="animate-in fade-in duration-150">
            <HistoricalArchives />
          </div>
        )}

        {/* Tab 5: Emergency Helplines Directory */}
        {activeTab === 'directory' && (
          <div className="animate-in fade-in duration-150">
            <EmergencyDirectory initialCountry={directoryCountry} />
          </div>
        )}
      </main>

      {/* Situational Alert Detail Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onAskAi={handleAskAiAboutAlert}
        onGoToDirectoryForCountry={handleGoToDirectoryForCountry}
      />

      {/* Aegis AI Assistant Modal (with explicit bilingual consent) */}
      <AegisAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        initialQuery={assistantInitialQuery}
        initialContext={assistantContext}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors mt-auto text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-500" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  AegisRelief Global Intelligence
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Open Public Standard
                </span>
              </div>
              <p className="max-w-md text-xs leading-relaxed">
                Universal single-platform disaster intelligence, geospatial alert mapping, and survival preparedness for citizens and responders worldwide.
              </p>
            </div>

            {/* Quick Links & Feeds */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <button
                onClick={() => {
                  setDirectoryCountry('Nepal');
                  setActiveTab('directory');
                }}
                className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
              >
                <span>🇳🇵 Nepal Emergency Directory</span>
              </button>
              <button
                onClick={() => setActiveTab('preparedness')}
                className="hover:text-sky-600 dark:hover:text-sky-400"
              >
                72-Hour GO-BAG Checklist
              </button>
              <button
                onClick={() => {
                  setAssistantInitialQuery('');
                  setIsAssistantOpen(true);
                }}
                className="text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aegis AI Assistant</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono">
            <div>
              Data Synced with: UN GDACS · USGS Earthquake Hazards · WHO Outbreak News · NDRRMA Nepal
            </div>
            <div>
              © 2026 AegisRelief Portal · Public Safety Service
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
