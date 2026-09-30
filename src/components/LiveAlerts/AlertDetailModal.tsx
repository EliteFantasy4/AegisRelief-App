import React from 'react';
import { DisasterAlert } from '../../types/disaster';
import { formatNumber, formatTimeAgo, getSeverityStyle } from '../../utils/formatters';
import {
  X,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  Users,
  Compass,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Package,
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: DisasterAlert | null;
  onClose: () => void;
  onAskAi: (alert: DisasterAlert) => void;
  onGoToDirectoryForCountry: (country: string) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onAskAi,
  onGoToDirectoryForCountry,
}) => {
  if (!alert) return null;

  const style = getSeverityStyle(alert.severity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
              <span>{alert.id}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{alert.category.replace('_', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span>{alert.continent}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {alert.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{alert.locationName}</span>
              <span>({alert.country})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase ${style.badgeBg}`}>
              {alert.severity}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tactical Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">AFFECTED POPULATION</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formatNumber(alert.affectedPopulationEstimate)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">THREAT RADIUS</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {alert.threatRadiusKm} km
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">RESPONSE STATUS</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate block">
              {alert.status}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">COORDINATES</span>
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
              {alert.coordinates.lat.toFixed(2)}°, {alert.coordinates.lng.toFixed(2)}°
            </span>
          </div>
        </div>

        {/* Situation Brief */}
        <div className="space-y-1.5">
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-500" /> Situational Brief
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
            {alert.summary}
          </p>
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1">
            <span>Lead Authority: <strong className="text-slate-600 dark:text-slate-300">{alert.primaryAgency}</strong></span>
            <span>Reported: {formatTimeAgo(alert.reportedAt)}</span>
          </div>
        </div>

        {/* Casualties & Displacement Breakdown */}
        <div className="space-y-1.5">
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-500" /> Human Impact Estimates
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block">CONFIRMED FATALITIES</span>
              <span className="text-base font-bold text-red-700 dark:text-red-400">
                {alert.casualtiesEstimate.fatalities}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block">INJURED / HOSPITALIZED</span>
              <span className="text-base font-bold text-amber-700 dark:text-amber-400">
                {formatNumber(alert.casualtiesEstimate.injured)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block">DISPLACED RESIDENTS</span>
              <span className="text-base font-bold text-sky-700 dark:text-sky-400">
                {formatNumber(alert.casualtiesEstimate.displaced)}
              </span>
            </div>
          </div>
        </div>

        {/* Immediate Directives Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Immediate Life-Safety Directives
          </h4>
          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            {alert.immediateActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 leading-normal">
                <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Relief Resources Needed */}
        <div className="space-y-1.5">
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-purple-500" /> Priority Relief Resources In-Demand
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {alert.resourcesNeeded.map((res, i) => (
              <span
                key={i}
                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
              >
                {res}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            onClick={() => onGoToDirectoryForCountry(alert.country)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
            <span>{alert.country} Emergency Helplines</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onAskAi(alert)}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 rounded-lg shadow-sm shadow-sky-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Aegis AI About This</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
