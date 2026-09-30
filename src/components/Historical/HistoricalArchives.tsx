import React, { useState, useMemo } from 'react';
import { MOCK_HISTORICAL } from '../../data/mockHistorical';
import { HistoricalEvent, DisasterCategory } from '../../types/disaster';
import { formatNumber } from '../../utils/formatters';
import {
  History,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

export const HistoricalArchives: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'year' | 'loss' | 'fatalities' | 'duration'>('year');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(MOCK_HISTORICAL[0]?.id || null);

  const filteredEvents = useMemo(() => {
    return MOCK_HISTORICAL.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'loss') {
        return b.economicLossUsdBillions - a.economicLossUsdBillions;
      }
      if (sortBy === 'fatalities') {
        return b.fatalitiesCount - a.fatalitiesCount;
      }
      if (sortBy === 'duration') {
        return b.recoveryDurationMonths - a.recoveryDurationMonths;
      }
      return b.year - a.year;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const toggleExpand = (id: string) => {
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-sky-500" />
            Historical Disaster Impact &amp; Policy Archive
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Post-incident reviews, systemic engineering lessons learned, and economic reconstruction timelines
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical case studies (e.g. Nepal Gorkha, Tohoku, Beirut, Pakistan)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Disaster Categories</option>
              <option value="geological">Geological (Earthquakes/Tsunamis)</option>
              <option value="meteorological">Meteorological (Floods/Fires)</option>
              <option value="human_unintentional">Industrial / Accidents</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="year">Sort: Most Recent Year</option>
              <option value="loss">Sort: Highest Economic Loss</option>
              <option value="fatalities">Sort: Fatalities Count</option>
              <option value="duration">Sort: Recovery Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Archives Card List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const isExpanded = expandedEventId === event.id;

          return (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Card Summary Header (Clickable) */}
              <div
                onClick={() => toggleExpand(event.id)}
                className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="font-bold text-sky-600 dark:text-sky-400">{event.year}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{event.category.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{event.subType}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span>{event.location}</span>
                    <strong className="text-slate-800 dark:text-slate-200">({event.country})</strong>
                  </div>
                </div>

                {/* Right Side Stats & Toggle */}
                <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                  <div className="text-right text-xs font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase">ECONOMIC IMPACT</span>
                    <span className="text-base font-bold text-red-600 dark:text-red-400">
                      ${event.economicLossUsdBillions}B <span className="text-[11px] font-normal text-slate-400">USD</span>
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expandable Analytical SitRep */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-5 bg-slate-50/50 dark:bg-slate-900/50 animate-in fade-in duration-200">
                  {/* Detailed Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-mono mt-4">
                    <div>
                      <span className="text-slate-400 text-[10px] block">CONFIRMED FATALITIES</span>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        {event.fatalitiesCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">DISPLACED CITIZENS</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {formatNumber(event.displacedCount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">ECONOMIC LOSS</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        ${event.economicLossUsdBillions} Billion
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">RECOVERY HORIZON</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {event.recoveryDurationMonths} Months ({Math.round(event.recoveryDurationMonths / 12)} Yrs)
                      </span>
                    </div>
                  </div>

                  {/* Incident Synthesis */}
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400">
                      Incident Summary &amp; Mechanics
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                      {event.summary}
                    </p>
                  </div>

                  {/* Systemic Lessons Learned */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      Key Systemic &amp; Engineering Lessons Learned
                    </h4>
                    <div className="space-y-1.5">
                      {event.systemicLessons.map((lesson, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg"
                        >
                          <span className="text-sky-500 font-bold font-mono">0{idx + 1}.</span>
                          <span>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Institutional Actions & Reforms Taken */}
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Institutional Actions &amp; Systemic Reforms Implemented
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pl-4 list-disc">
                      {event.keyActionsTaken.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
