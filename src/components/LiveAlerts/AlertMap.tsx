import React, { useState } from 'react';
import { DisasterAlert } from '../../types/disaster';
import { getSeverityStyle } from '../../utils/formatters';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, MapPin } from 'lucide-react';

interface AlertMapProps {
  alerts: DisasterAlert[];
  selectedAlertId: string | null;
  onSelectAlert: (alert: DisasterAlert) => void;
}

export const AlertMap: React.FC<AlertMapProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredAlert, setHoveredAlert] = useState<DisasterAlert | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map dimensions
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 500;

  // Convert lat/lng to SVG coordinates (Equirectangular projection)
  const coordsToSvg = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * MAP_WIDTH;
    const y = ((90 - lat) / 180) * MAP_HEIGHT;
    return { x, y };
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.35, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.35, 0.9));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl select-none">
      {/* Map Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset Map Position"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Status & Legend Banner */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs shadow-lg font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
          <span className="text-red-400 font-semibold">Critical Threat</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-amber-300 font-medium">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
          <span className="text-sky-300 font-medium">Advisory</span>
        </div>
      </div>

      {/* SVG Container */}
      <div
        className="w-full h-[380px] sm:h-[480px] lg:h-[540px] cursor-grab active:cursor-grabbing overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#070B19" />
            </radialGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Ocean Surface */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanGlow)" />

          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ transformOrigin: 'center center', transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
          >
            {/* Latitude & Longitude Gridlines */}
            {[-60, -30, 0, 30, 60].map((lat) => (
              <line
                key={`lat-${lat}`}
                x1={0}
                y1={((90 - lat) / 180) * MAP_HEIGHT}
                x2={MAP_WIDTH}
                y2={((90 - lat) / 180) * MAP_HEIGHT}
                stroke="#1E293B"
                strokeWidth={lat === 0 ? "1.2" : "0.5"}
                strokeDasharray={lat === 0 ? "none" : "3,3"}
              />
            ))}
            {[-120, -60, 0, 60, 120].map((lng) => (
              <line
                key={`lng-${lng}`}
                x1={((lng + 180) / 360) * MAP_WIDTH}
                y1={0}
                x2={((lng + 180) / 360) * MAP_WIDTH}
                y2={MAP_HEIGHT}
                stroke="#1E293B"
                strokeWidth={lng === 0 ? "1.2" : "0.5"}
                strokeDasharray={lng === 0 ? "none" : "3,3"}
              />
            ))}

            {/* Tactical Continents (Curated High-Legibility Simplified Vector Landmasses) */}
            {/* North America */}
            <path
              d="M 120 70 L 260 70 L 290 120 L 240 180 L 210 240 L 195 260 L 175 220 L 130 180 L 95 130 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Greenland */}
            <path
              d="M 310 40 L 370 45 L 350 90 L 300 75 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Central America & Caribbean */}
            <path
              d="M 195 260 L 235 280 L 255 310 L 230 325 L 210 295 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* South America */}
            <path
              d="M 255 310 L 330 325 L 365 375 L 330 460 L 285 470 L 265 400 L 245 340 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Europe */}
            <path
              d="M 450 90 L 550 90 L 560 145 L 500 170 L 450 160 L 430 120 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* United Kingdom & Ireland */}
            <path
              d="M 430 100 L 450 105 L 440 130 L 425 125 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Africa */}
            <path
              d="M 450 170 L 560 170 L 595 240 L 555 350 L 500 375 L 460 300 L 430 210 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Madagascar */}
            <path
              d="M 590 320 L 610 330 L 600 370 L 585 360 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Asia (Mainland, Russia, Middle East, India, China) */}
            <path
              d="M 550 85 L 860 70 L 890 140 L 820 220 L 760 260 L 700 240 L 670 190 L 600 180 L 560 140 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Indian Subcontinent & Himalayan Arc */}
            <path
              d="M 640 185 L 710 190 L 700 270 L 660 270 L 640 215 Z"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="1.2"
              className="transition-colors hover:fill-slate-800"
            />
            {/* Southeast Asia Arc */}
            <path
              d="M 730 240 L 780 250 L 770 310 L 735 290 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Japan Arc */}
            <path
              d="M 835 150 L 865 170 L 850 200 L 830 180 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Indonesia & Philippines Islands */}
            <path
              d="M 740 310 L 830 315 L 820 340 L 750 335 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Australia & New Zealand */}
            <path
              d="M 770 370 L 880 375 L 870 450 L 780 445 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <path
              d="M 895 440 L 915 450 L 905 480 L 890 470 Z"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="0.8"
            />

            {/* Disaster Threat Epicenters & Shockwave Rings */}
            {alerts.map((alert) => {
              const { x, y } = coordsToSvg(alert.coordinates.lat, alert.coordinates.lng);
              const isSelected = selectedAlertId === alert.id;
              const style = getSeverityStyle(alert.severity);

              // Calculate radius proportional to threatRadiusKm
              const svgRadius = Math.max(alert.threatRadiusKm * 0.12, 14);

              return (
                <g
                  key={alert.id}
                  className="cursor-pointer transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAlert(alert);
                  }}
                  onMouseEnter={() => setHoveredAlert(alert)}
                  onMouseLeave={() => setHoveredAlert(null)}
                >
                  {/* Outer Pulsing Threat Impact Zone */}
                  <circle
                    cx={x}
                    cy={y}
                    r={svgRadius}
                    fill={style.ringColor}
                    fillOpacity={isSelected ? 0.28 : 0.14}
                    stroke={style.ringColor}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isSelected ? 'none' : '3,3'}
                    className={alert.severity === 'CRITICAL' ? 'animate-pulse' : ''}
                  />

                  {/* Secondary Shockwave Ring */}
                  {alert.severity === 'CRITICAL' && (
                    <circle
                      cx={x}
                      cy={y}
                      r={svgRadius * 1.6}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="0.75"
                      strokeOpacity="0.4"
                      strokeDasharray="4,4"
                    />
                  )}

                  {/* Epicenter Core Marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 7 : 5}
                    fill={style.ringColor}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    filter="url(#glowEffect)"
                  />

                  {/* Country / City Tactical Label */}
                  <text
                    x={x + 10}
                    y={y + 4}
                    fill={isSelected ? '#38BDF8' : '#CBD5E1'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {alert.locationName.split(',')[0]} ({alert.country})
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip Inspection Card */}
        {hoveredAlert && (
          <div
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 pointer-events-none bg-slate-900/95 border border-sky-500/50 rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                  {hoveredAlert.subType} · {hoveredAlert.category}
                </span>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {hoveredAlert.title}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 inline" />
                  {hoveredAlert.locationName}
                </p>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                  hoveredAlert.severity === 'CRITICAL'
                    ? 'bg-red-600 text-white'
                    : hoveredAlert.severity === 'WARNING'
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-sky-600 text-white'
                }`}
              >
                {hoveredAlert.severity}
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
              <div>
                <span className="block text-[10px] text-slate-500">RADIUS</span>
                <span className="text-slate-200 font-semibold">{hoveredAlert.threatRadiusKm} km</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">AFFECTED</span>
                <span className="text-slate-200 font-semibold">
                  {(hoveredAlert.affectedPopulationEstimate / 1000).toFixed(0)}k est.
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">STATUS</span>
                <span className="text-emerald-400 font-semibold truncate block">
                  {hoveredAlert.status}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-sky-300 mt-2 italic font-mono flex items-center gap-1">
              <Crosshair className="w-3 h-3" /> Click epicenter to inspect full response brief
            </p>
          </div>
        )}
      </div>

      {/* Bottom Map Info Footer */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>Equirectangular Vector Map · Real-Time Satellite Coordinates Projection</span>
        </div>
        <div className="text-slate-500">
          Showing {alerts.length} Active Global Threat Epicenters
        </div>
      </div>
    </div>
  );
};
