import React, { useState, useMemo } from 'react';
import { DisasterAlert, DisasterCategory, SeverityLevel } from '../../types/disaster';
import { CATEGORY_LABELS } from '../../data/mockDisasters';
import { formatNumber, formatTimeAgo, getSeverityStyle } from '../../utils/formatters';
import {
  Search,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Flame,
  Activity,
  CloudRain,
  Biohazard,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

interface AlertListProps {
  alerts: DisasterAlert[];
  selectedAlertId: string | null;
  onSelectAlert: (alert: DisasterAlert) => void;
}

export const AlertList: React.FC<AlertListProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'severity' | 'affected' | 'radius'>('severity');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((alert) => {
        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            alert.title.toLowerCase().includes(q) ||
            alert.locationName.toLowerCase().includes(q) ||
            alert.country.toLowerCase().includes(q) ||
            alert.subType.toLowerCase().includes(q) ||
            alert.summary.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Category
        if (selectedCategory !== 'ALL' && alert.category !== selectedCategory) {
          return false;
        }

        // Severity
        if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) {
          return false;
        }

        // Continent
        if (selectedContinent !== 'ALL' && alert.continent !== selectedContinent) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'severity') {
          const score = { CRITICAL: 3, WARNING: 2, ADVISORY: 1 };
          return score[b.severity] - score[a.severity];
        }
        if (sortBy === 'affected') {
          return b.affectedPopulationEstimate - a.affectedPopulationEstimate;
        }
        if (sortBy === 'radius') {
          return b.threatRadiusKm - a.threatRadiusKm;
        }
        // recent
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      });
  }, [alerts, searchQuery, selectedCategory, selectedSeverity, selectedContinent, sortBy]);

  const getCategoryIcon = (category: DisasterCategory) => {
    switch (category) {
      case 'geological':
        return <Activity className="w-4 h-4 text-rose-500" />;
      case 'meteorological':
        return <CloudRain className="w-4 h-4 text-sky-500" />;
      case 'biological':
        return <Biohazard className="w-4 h-4 text-emerald-500" />;
      case 'human_unintentional':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'human_intentional':
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      default:
        return <Flame className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        {/* Top line: Search and View Mode */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active alerts by region, disaster type, country (e.g. Nepal, Typhoon, Earthquake)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="High-Density Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="severity">Sort: Highest Severity</option>
              <option value="recent">Sort: Most Recent</option>
              <option value="affected">Sort: Affected Population</option>
              <option value="radius">Sort: Threat Radius</option>
            </select>
          </div>
        </div>

        {/* Filter Segmented Controls: Categories */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All (5 Structural)
            </button>
            {Object.entries(CATEGORY_LABELS).map(([catKey, catVal]) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === catKey
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {getCategoryIcon(catKey as DisasterCategory)}
                <span>{catVal.label}</span>
              </button>
            ))}
          </div>

          {/* Severity and Continent quick filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Severity:</span>
            {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  selectedSeverity === sev
                    ? sev === 'CRITICAL'
                      ? 'bg-red-600 text-white font-bold'
                      : sev === 'WARNING'
                      ? 'bg-amber-500 text-slate-900 font-bold'
                      : sev === 'ADVISORY'
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}

            <span className="text-slate-300 dark:text-slate-700 mx-1">|</span>

            <span className="text-slate-500 dark:text-slate-400 font-medium">Region:</span>
            {['ALL', 'Asia', 'Europe', 'North America', 'South America', 'Africa'].map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  selectedContinent === cont
                    ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cont}
              </button>
            ))}

            <span className="ml-auto text-slate-400 font-mono text-[11px]">
              Showing {filteredAlerts.length} of {alerts.length} threats
            </span>
          </div>
        </div>
      </div>

      {/* Render Results: Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No active alerts match current filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, switching categories, or resetting severity filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedSeverity('ALL');
              setSelectedContinent('ALL');
            }}
            className="px-3 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Mode A: Card Grid View */}
      {viewMode === 'cards' && filteredAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => {
            const isSelected = selectedAlertId === alert.id;
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className={`cursor-pointer rounded-xl p-4 transition-all duration-150 border text-left bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/20 dark:bg-sky-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header: Clean unboxed metadata with separators */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 truncate">
                    {getCategoryIcon(alert.category)}
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {alert.subType}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{alert.continent}</span>
                  </div>

                  {/* Functional micro-badge for strict alert level scanning */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${style.badgeBg}`}
                  >
                    {alert.severity}
                  </span>
                </div>

                {/* Primary Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 transition-colors">
                  {alert.title}
                </h3>

                {/* Location and Agency */}
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {alert.locationName}
                  </span>
                  <span>({alert.country})</span>
                </div>

                {/* Concise Summary */}
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {alert.summary}
                </p>

                {/* High Density Metric Row */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="block text-slate-400 text-[10px]">AFFECTED</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatNumber(alert.affectedPopulationEstimate)} est.
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">THREAT ZONE</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {alert.threatRadiusKm} km radius
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">STATUS</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate block">
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {formatTimeAgo(alert.updatedAt)}</span>
                  </div>
                  <span className="text-sky-600 dark:text-sky-400 font-medium flex items-center gap-0.5 hover:underline">
                    View SitRep <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode B: High-Density Table View */}
      {viewMode === 'table' && filteredAlerts.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4 font-semibold">Severity</th>
                <th className="py-2.5 px-4 font-semibold">Event &amp; Subtype</th>
                <th className="py-2.5 px-4 font-semibold">Location / Country</th>
                <th className="py-2.5 px-4 font-semibold">Affected Pop.</th>
                <th className="py-2.5 px-4 font-semibold">Radius</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Updated</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAlerts.map((alert) => {
                const isSelected = selectedAlertId === alert.id;
                const style = getSeverityStyle(alert.severity);

                return (
                  <tr
                    key={alert.id}
                    onClick={() => onSelectAlert(alert)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      isSelected ? 'bg-sky-50/50 dark:bg-sky-950/40' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${style.badgeBg}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-sans font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(alert.category)}
                        <span className="truncate">{alert.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 font-normal">
                        {alert.subType}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      <div>{alert.locationName}</div>
                      <span className="text-[10px] text-slate-400">{alert.country}</span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatNumber(alert.affectedPopulationEstimate)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {alert.threatRadiusKm} km
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {formatTimeAgo(alert.updatedAt)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAlert(alert);
                        }}
                        className="text-sky-600 dark:text-sky-400 font-sans font-medium hover:underline text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
