import React, { useState, useEffect } from 'react';
import { MOCK_PREPAREDNESS_GUIDES } from '../../data/mockPreparedness';
import { PreparednessGuide } from '../../types/disaster';
import {
  Activity,
  Droplets,
  Flame,
  AlertOctagon,
  Biohazard,
  Printer,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  Package,
  Sparkles,
} from 'lucide-react';

interface PreparednessGuidesProps {
  onAskAiForGuide?: (guideName: string) => void;
}

export const PreparednessGuides: React.FC<PreparednessGuidesProps> = ({ onAskAiForGuide }) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>('prep-earthquake');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Load saved checklist progress from localStorage safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aegis_checklist_progress');
      if (saved) {
        setCompletedItems(JSON.parse(saved));
      }
    } catch {
      // Fallback if localStorage restricted
    }
  }, []);

  const toggleItem = (itemId: string) => {
    setCompletedItems((prev) => {
      const updated = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem('aegis_checklist_progress', JSON.stringify(updated));
      } catch {
        // Safe storage error handling
      }
      return updated;
    });
  };

  const activeGuide =
    MOCK_PREPAREDNESS_GUIDES.find((g) => g.id === selectedGuideId) ||
    MOCK_PREPAREDNESS_GUIDES[0];

  // Calculate completion percentage for the active guide
  const totalTasks = activeGuide.checklists.length;
  const completedCount = activeGuide.checklists.filter((item) => completedItems[item.id]).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const getGuideIcon = (id: string) => {
    switch (id) {
      case 'prep-earthquake':
        return <Activity className="w-4 h-4 text-rose-500" />;
      case 'prep-flood':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'prep-wildfire':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'prep-chemical':
        return <AlertOctagon className="w-4 h-4 text-purple-500" />;
      case 'prep-biological':
        return <Biohazard className="w-4 h-4 text-emerald-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-sky-500" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Print Control */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            Tactical Preparedness &amp; Survival Action Guides
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Step-by-step multi-phase checklists, immediate survival rules, and 72-hour GO-BAG essentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-sky-500" />
            <span>Print / Save Quick Guide</span>
          </button>
        </div>
      </div>

      {/* Disaster Selector Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MOCK_PREPAREDNESS_GUIDES.map((guide) => {
          const isSelected = selectedGuideId === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className={isSelected ? 'text-white' : ''}>{getGuideIcon(guide.id)}</span>
              <span>{guide.disasterType.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Guide Main Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Immediate Survival Golden Rule (High Alert Banner) */}
        <div className="bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            IMMEDIATE SURVIVAL RULE (DURING EVENT)
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            "{activeGuide.immediateSurvivalRule}"
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {activeGuide.briefSummary}
          </p>
        </div>

        {/* Interactive Progress Meter */}
        <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-300 font-semibold">
              PREPAREDNESS READINESS SCORE
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              {completedCount} of {totalTasks} Tasks Completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Phase-Based Interactive Checklists: Before, During, After */}
        {(['before', 'during', 'after'] as const).map((phase) => {
          const phaseTasks = activeGuide.checklists.filter((item) => item.phase === phase);
          if (phaseTasks.length === 0) return null;

          const phaseLabels = {
            before: 'Phase 1: Pre-Disaster Mitigation & Readiness (BEFORE)',
            during: 'Phase 2: Immediate Life-Safety Tactics (DURING EVENT)',
            after: 'Phase 3: Post-Event Recovery & Assessment (AFTER)',
          };

          return (
            <div key={phase} className="space-y-3">
              <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                {phaseLabels[phase]}
              </h3>

              <div className="space-y-2">
                {phaseTasks.map((item) => {
                  const isChecked = Boolean(completedItems[item.id]);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`cursor-pointer flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 hover:text-sky-600 focus-visible:outline-none"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              isChecked
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {item.task}
                          </span>
                          {item.criticality === 'essential' && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold shrink-0">
                              Essential
                            </span>
                          )}
                        </div>

                        {item.tip && (
                          <p className="mt-1 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                            💡 <strong>Survival Tip:</strong> {item.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 72-Hour GO-BAG Essentials */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-sky-500" />
            72-Hour GO-BAG Emergency Kit Checklist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activeGuide.goBagEssentials.map((essential, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>{essential}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical DOs and DON'Ts Side-by-Side Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* DOs */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> DO THIS
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {activeGuide.dosAndDonts.dos.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DONTs */}
          <div className="bg-red-500/10 dark:bg-red-950/30 border border-red-500/30 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-red-800 dark:text-red-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> DO NOT DO THIS
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {activeGuide.dosAndDonts.donts.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Assistant Quick Inquiry Prompt */}
        {onAskAiForGuide && (
          <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 p-4 rounded-xl flex items-center justify-between gap-3">
            <div className="text-xs">
              <strong className="text-slate-900 dark:text-white font-semibold block">
                Need customized preparedness steps for your family or district?
              </strong>
              <span className="text-slate-600 dark:text-slate-400">
                Ask Aegis AI for specific triage protocols in English or Nepali.
              </span>
            </div>
            <button
              onClick={() => onAskAiForGuide(activeGuide.disasterType)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Guide</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
