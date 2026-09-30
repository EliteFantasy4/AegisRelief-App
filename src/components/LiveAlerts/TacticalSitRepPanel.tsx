import React from 'react';
import { DisasterAlert } from '../../types/disaster';
import { formatGpsCoordinates } from '../../utils/geoProjection';
import { formatNumber, getSeverityStyle } from '../../utils/formatters';
import {
  X,
  Crosshair,
  MapPin,
  Clock,
  Compass,
  Radio,
  PhoneCall,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface TacticalSitRepPanelProps {
  alert: DisasterAlert;
  onClose: () => void;
  onFocusCenter: (lat: number, lng: number) => void;
  onInspectFullDossier: (alert: DisasterAlert) => void;
  onGoToDirectory: (country: string) => void;
  onGoToPreparedness: (guideType: string) => void;
  onAskAi: (alert: DisasterAlert) => void;
}

export const TacticalSitRepPanel: React.FC<TacticalSitRepPanelProps> = ({
  alert,
  onClose,
  onFocusCenter,
  onInspectFullDossier,
  onGoToDirectory,
  onGoToPreparedness,
  onAskAi,
}) => {
  const style = getSeverityStyle(alert.severity);

  // Accurate GPS Coordinates string
  const gpsString = formatGpsCoordinates(alert.coordinates.lat, alert.coordinates.lng);

  // UTC and Local Timestamps
  const utcDate = new Date(alert.updatedAt).toUTCString().replace('GMT', 'UTC');
  const localDate = new Date(alert.updatedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <aside
      className="absolute bottom-4 right-4 max-w-sm sm:max-w-md w-[calc(100%-2rem)] z-30 bg-slate-900/95 backdrop-blur-md border border-sky-500/40 rounded-2xl shadow-2xl p-4 text-slate-100 font-sans transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
      aria-label="Tactical Situation Report Panel"
    >
      {/* Header bar: Live ping, ID, Severity and Close button */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-400'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-400'
                  : 'bg-sky-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-500'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-500'
                  : 'bg-sky-500'
              }`}
            />
          </span>
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
            Tactical SitRep · {alert.id}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${style.badgeBg}`}
          >
            {alert.severity}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Tactical SitRep"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & SubType */}
      <div className="mt-2.5">
        <div className="text-[11px] font-mono uppercase text-sky-400 font-semibold tracking-wide flex items-center gap-1">
          <Radio className="w-3.5 h-3.5" />
          <span>{alert.subType}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{alert.category.replace('_', ' ')}</span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white leading-snug mt-0.5">
          {alert.title}
        </h3>
        <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="font-semibold text-slate-200">{alert.locationName}</span>
          <span className="text-slate-400 font-normal">({alert.country})</span>
        </p>
      </div>

      {/* Metrics Row: GPS Coordinates, Radius, Population */}
      <div className="mt-3 bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-medium flex items-center gap-1">
            <Compass className="w-3 h-3 text-sky-400" /> Precise GPS
          </span>
          <span className="text-[11px] font-bold text-sky-300 truncate block mt-0.5">
            {gpsString}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-medium">
            Threat Radius
          </span>
          <span className="text-[11px] font-bold text-white block mt-0.5">
            {alert.threatRadiusKm} km impact zone
          </span>
        </div>
        <div className="col-span-2 pt-1.5 border-t border-slate-900/80 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-slate-500 text-[10px]">AFFECTED: </span>
            <span className="text-slate-200 font-bold">{formatNumber(alert.affectedPopulationEstimate)}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">STATUS: </span>
            <span className="text-emerald-400 font-bold">{alert.status}</span>
          </div>
        </div>
      </div>

      {/* Dual Timestamps */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>UTC: {utcDate.replace('GMT', '').trim().slice(0, 22)}</span>
        </div>
        <div>Local: {localDate}</div>
      </div>

      {/* Key Directive Preview */}
      {alert.immediateActions.length > 0 && (
        <div className="mt-2.5 p-2 rounded-lg bg-sky-950/30 border border-sky-900/40 text-[11px] text-sky-200 leading-relaxed flex items-start gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            <strong>Key Directive:</strong> {alert.immediateActions[0]}
          </span>
        </div>
      )}

      {/* Quick Action Links */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-xs">
        <button
          onClick={() => onGoToDirectory(alert.country)}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors border border-slate-700/80 text-[11px] font-medium"
        >
          <PhoneCall className="w-3 h-3 text-emerald-400" />
          <span>{alert.country} Hotlines</span>
        </button>

        <button
          onClick={() => onGoToPreparedness(alert.subType)}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors border border-slate-700/80 text-[11px] font-medium"
        >
          <BookOpen className="w-3 h-3 text-sky-400" />
          <span>Preparedness Guide</span>
        </button>

        <button
          onClick={() => onFocusCenter(alert.coordinates.lat, alert.coordinates.lng)}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 rounded-lg transition-colors border border-sky-800/80 text-[11px] font-medium"
        >
          <Crosshair className="w-3 h-3 text-sky-400" />
          <span>Center Epicenter</span>
        </button>

        <button
          onClick={() => onAskAi(alert)}
          className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white rounded-lg shadow-sm transition-all text-[11px] font-bold"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Ask Aegis AI</span>
        </button>
      </div>

      {/* Full Dossier Link */}
      <div className="mt-2 text-center">
        <button
          onClick={() => onInspectFullDossier(alert)}
          className="w-full text-center text-xs text-sky-400 hover:text-sky-300 font-semibold hover:underline flex items-center justify-center gap-1 py-1"
        >
          <span>Open Full Tactical Situation Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
