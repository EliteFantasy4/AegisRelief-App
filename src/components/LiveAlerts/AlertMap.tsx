import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { DisasterAlert } from '../../types/disaster';
import {
  projectEquirectangular,
  inverseEquirectangular,
  formatGpsCoordinates,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  WORLD_BOUNDS,
} from '../../utils/geoProjection';
import { EquirectangularWorldPaths } from './EquirectangularWorldPaths';
import { MapMarker } from './MapMarker';
import { TacticalSitRepPanel } from './TacticalSitRepPanel';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  Layers,
  Activity,
  Radio,
  Play,
  Pause,
  Compass,
  MapPin,
} from 'lucide-react';

interface AlertMapProps {
  alerts: DisasterAlert[];
  selectedAlertId: string | null;
  onSelectAlert: (alert: DisasterAlert) => void;
  onOpenFullDossier?: (alert: DisasterAlert) => void;
  onGoToDirectory?: (country: string) => void;
  onGoToPreparedness?: (guideType: string) => void;
  onAskAi?: (alert: DisasterAlert) => void;
}

export const AlertMap: React.FC<AlertMapProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onOpenFullDossier,
  onGoToDirectory,
  onGoToPreparedness,
  onAskAi,
}) => {
  // Navigation & Zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map Layer toggles
  const [showSatelliteGrid, setShowSatelliteGrid] = useState<boolean>(true);
  const [showHimalayanZone, setShowHimalayanZone] = useState<boolean>(true);

  // Live Stream Simulation & 2000ms Throttling Architecture
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);
  const [batchedAlerts, setBatchedAlerts] = useState<DisasterAlert[]>(alerts);
  const [lastBatchTimestamp, setLastBatchTimestamp] = useState<string>(() => new Date().toISOString());
  const [isBatchUpdating, setIsBatchUpdating] = useState<boolean>(false);

  // Hover & Tooltip State
  const [hoveredAlert, setHoveredAlert] = useState<DisasterAlert | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Real-time Cursor Coordinates Readout
  const [cursorGps, setCursorGps] = useState<string>('Lat: 28.1400° N, Lng: 84.8500° E');

  // SVG ref for bounding rect calculations
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Throttle timer reference (2000ms buffer window)
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<DisasterAlert[]>(alerts);
  const liveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Synchronize incoming alerts through 2000ms throttle window
  useEffect(() => {
    pendingUpdatesRef.current = alerts;

    if (!throttleTimerRef.current) {
      setIsBatchUpdating(true);
      throttleTimerRef.current = setTimeout(() => {
        try {
          setBatchedAlerts(pendingUpdatesRef.current);
          setLastBatchTimestamp(new Date().toISOString());
          setIsBatchUpdating(false);
          throttleTimerRef.current = null;
        } catch {
          setIsBatchUpdating(false);
          throttleTimerRef.current = null;
        }
      }, 2000);
    }

    return () => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
        throttleTimerRef.current = null;
      }
    };
  }, [alerts]);

  // 2. Simulated Live Spatial Telemetry Feeds (demonstrating smooth batching without marker jitter)
  useEffect(() => {
    if (!isLiveStreamActive) {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
      return;
    }

    liveIntervalRef.current = setInterval(() => {
      try {
        setBatchedAlerts((prev) => {
          if (!prev.length) return prev;
          // Apply subtle realistic micro-variance to one active alert's radius or status without unmounting
          const idx = Math.floor(Math.random() * prev.length);
          const target = prev[idx];
          const radiusDelta = (Math.random() - 0.5) * 4;
          const updatedRadius = Math.max(15, Math.round(target.threatRadiusKm + radiusDelta));

          const updated = [...prev];
          updated[idx] = {
            ...target,
            threatRadiusKm: updatedRadius,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        });
        setLastBatchTimestamp(new Date().toISOString());
      } catch {
        // Safe fallback
      }
    }, 4500);

    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, [isLiveStreamActive]);

  // Map Dimensions
  const MAP_W = DEFAULT_CANVAS_WIDTH;
  const MAP_H = DEFAULT_CANVAS_HEIGHT;

  // 3. Projected Coordinates Calculation (Memoized for high performance)
  const projectedMarkers = useMemo(() => {
    return batchedAlerts.map((alert) => {
      const { x, y, isValid } = projectEquirectangular(
        alert.coordinates?.lat,
        alert.coordinates?.lng,
        MAP_W,
        MAP_H
      );
      return {
        alert,
        x,
        y,
        isValid,
      };
    });
  }, [batchedAlerts, MAP_W, MAP_H]);

  // Find currently selected alert for SitRep HUD
  const activeSelectedAlert = useMemo(() => {
    if (!selectedAlertId) return null;
    return batchedAlerts.find((a) => a.id === selectedAlertId) || null;
  }, [batchedAlerts, selectedAlertId]);

  // Controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.35, 4.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.35, 0.9));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center on a specific coordinate
  const handleFocusCenter = useCallback(
    (lat: number, lng: number) => {
      try {
        const { x, y } = projectEquirectangular(lat, lng, MAP_W, MAP_H);
        const targetZoom = 2.2;
        const centerX = MAP_W / 2;
        const centerY = MAP_H / 2;

        const panX = (centerX - x) * targetZoom;
        const panY = (centerY - y) * targetZoom;

        setZoom(targetZoom);
        setPan({ x: panX, y: panY });
      } catch {
        // Defensive
      }
    },
    [MAP_W, MAP_H]
  );

  // Mouse pan & drag interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Calculate cursor GPS coordinates on the equirectangular projection
    if (svgRef.current) {
      try {
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Transform screen pixels through current pan and zoom
        const svgX = (clientX / rect.width) * MAP_W;
        const svgY = (clientY / rect.height) * MAP_H;

        const canvasX = (svgX - pan.x) / zoom;
        const canvasY = (svgY - pan.y) / zoom;

        const geo = inverseEquirectangular(canvasX, canvasY, MAP_W, MAP_H);
        setCursorGps(formatGpsCoordinates(geo.lat, geo.lng));
      } catch {
        // Safe fallback
      }
    }

    // 2. Dragging map
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Clean unmount mouse listener
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl select-none"
    >
      {/* Top Left: Map Control Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
        <button
          onClick={handleZoomIn}
          title="Zoom In (+35%)"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out (-35%)"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Reset Map Position"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
          aria-label="Reset position"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-800 my-0.5" />
        <button
          onClick={() => setShowSatelliteGrid((prev) => !prev)}
          title={showSatelliteGrid ? 'Hide WGS84 Satellite Graticule' : 'Show WGS84 Satellite Graticule'}
          className={`p-2 rounded-lg transition-colors ${
            showSatelliteGrid ? 'text-sky-400 bg-sky-950/70' : 'text-slate-400 hover:bg-slate-800'
          }`}
          aria-label="Toggle Graticule"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFocusCenter(28.14, 84.85)}
          title="Focus on Himalayan Arc (Nepal M 7.1 Epicenter)"
          className="p-2 text-rose-400 hover:bg-rose-950/70 rounded-lg transition-colors"
          aria-label="Focus Nepal"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Top Right: Live Stream Telemetry & Batch Status Indicator */}
      <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-2">
        {/* 2000ms Throttle Stream Status Pill */}
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-mono shadow-lg text-slate-300">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBatchUpdating ? 'bg-amber-400' : isLiveStreamActive ? 'bg-emerald-400' : 'bg-slate-500'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isBatchUpdating ? 'bg-amber-500' : isLiveStreamActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </span>

          <span className="text-[11px] font-semibold text-slate-200">
            {isBatchUpdating
              ? 'SYNCING CLUSTERS...'
              : isLiveStreamActive
              ? 'LIVE TELEMETRY STREAM'
              : 'STREAM PAUSED'}
          </span>

          <span className="text-[10px] text-slate-500 hidden sm:inline">
            (2000ms Throttled)
          </span>

          <button
            onClick={() => setIsLiveStreamActive((prev) => !prev)}
            className="ml-1 p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={isLiveStreamActive ? 'Pause Spatial Telemetry Stream' : 'Resume Spatial Stream'}
          >
            {isLiveStreamActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>

        {/* Severity Legend */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs shadow-lg font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse" />
            <span className="text-red-400 font-semibold text-[11px]">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="text-amber-300 font-medium text-[11px]">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span className="text-sky-300 font-medium text-[11px]">Advisory</span>
          </div>
        </div>
      </div>

      {/* Main SVG Interactive Map Viewport */}
      <div
        className="w-full h-[420px] sm:h-[500px] lg:h-[580px] cursor-grab active:cursor-grabbing overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Deep Ocean Tactical Surface Gradient */}
            <radialGradient id="oceanSurfaceGradient" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="60%" stopColor="#070D1F" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>

            {/* Glowing marker halo */}
            <filter id="tacticalMarkerGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Ocean Surface */}
          <rect width={MAP_W} height={MAP_H} fill="url(#oceanSurfaceGradient)" />

          {/* Zoomable & Pannable Master Group */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: '500px 250px',
              transition: isDragging ? 'none' : 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Satellite Graticule: Longitudes & Latitudes (Calibrated to WGS84 Bounding Box) */}
            {showSatelliteGrid && (
              <g id="satellite-graticule-grid" className="pointer-events-none">
                {/* Latitudes [-60, -30, 0, 30, 60] */}
                {[-60, -30, 0, 30, 60].map((lat) => {
                  const y = ((90 - lat) / 180) * MAP_H;
                  const isEquator = lat === 0;
                  return (
                    <g key={`graticule-lat-${lat}`}>
                      <line
                        x1={0}
                        y1={y}
                        x2={MAP_W}
                        y2={y}
                        stroke={isEquator ? '#38BDF8' : '#1E293B'}
                        strokeWidth={isEquator ? 1.2 / zoom : 0.6 / zoom}
                        strokeDasharray={isEquator ? 'none' : `${4 / zoom},${4 / zoom}`}
                        opacity={isEquator ? 0.75 : 0.5}
                      />
                      <text
                        x={10}
                        y={y - 3 / zoom}
                        fill="#64748B"
                        fontSize={Math.max(8 / zoom, 6.5)}
                        fontFamily="ui-monospace, monospace"
                      >
                        {lat === 0 ? 'EQUATOR 0°' : `${Math.abs(lat)}° ${lat > 0 ? 'N' : 'S'}`}
                      </text>
                    </g>
                  );
                })}

                {/* Longitudes [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150] */}
                {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
                  const x = ((lng + 180) / 360) * MAP_W;
                  const isPrimeMeridian = lng === 0;
                  return (
                    <g key={`graticule-lng-${lng}`}>
                      <line
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={MAP_H}
                        stroke={isPrimeMeridian ? '#38BDF8' : '#1E293B'}
                        strokeWidth={isPrimeMeridian ? 1.2 / zoom : 0.6 / zoom}
                        strokeDasharray={isPrimeMeridian ? 'none' : `${4 / zoom},${4 / zoom}`}
                        opacity={isPrimeMeridian ? 0.75 : 0.5}
                      />
                      <text
                        x={x + 3 / zoom}
                        y={MAP_H - 8 / zoom}
                        fill="#64748B"
                        fontSize={Math.max(8 / zoom, 6.5)}
                        fontFamily="ui-monospace, monospace"
                      >
                        {lng === 0 ? '0° (UTC)' : `${Math.abs(lng)}° ${lng > 0 ? 'E' : 'W'}`}
                      </text>
                    </g>
                  );
                })}

                {/* Tropics of Cancer & Capricorn (±23.44°) */}
                <line
                  x1={0}
                  y1={((90 - 23.44) / 180) * MAP_H}
                  x2={MAP_W}
                  y2={((90 - 23.44) / 180) * MAP_H}
                  stroke="#F59E0B"
                  strokeWidth={0.7 / zoom}
                  strokeDasharray={`${6 / zoom},${6 / zoom}`}
                  opacity="0.4"
                />
                <line
                  x1={0}
                  y1={((90 - -23.44) / 180) * MAP_H}
                  x2={MAP_W}
                  y2={((90 - -23.44) / 180) * MAP_H}
                  stroke="#F59E0B"
                  strokeWidth={0.7 / zoom}
                  strokeDasharray={`${6 / zoom},${6 / zoom}`}
                  opacity="0.4"
                />
              </g>
            )}

            {/* Mathematically Calibrated Equirectangular Continents */}
            <EquirectangularWorldPaths showTacticalBorders={zoom < 2.5} />

            {/* Render Disaster Epicenter Markers with React.memo stability */}
            {projectedMarkers.map(({ alert, x, y }) => {
              const isSelected = selectedAlertId === alert.id;
              const isHovered = hoveredAlert?.id === alert.id;

              return (
                <MapMarker
                  key={alert.id}
                  alert={alert}
                  x={x}
                  y={y}
                  zoom={zoom}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  onSelect={(selected) => onSelectAlert(selected)}
                  onHover={(hov, clientPos) => {
                    setHoveredAlert(hov);
                    setHoverPos(clientPos);
                  }}
                  onLeave={() => {
                    setHoveredAlert(null);
                    setHoverPos(null);
                  }}
                />
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip (Quick Glance if no SitRep is pinned for this alert) */}
        {hoveredAlert && !activeSelectedAlert && (
          <div
            className="absolute bottom-4 left-4 max-w-xs sm:max-w-sm z-30 pointer-events-none bg-slate-900/95 border border-sky-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md animate-in fade-in duration-100"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                  {hoveredAlert.subType}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                  {hoveredAlert.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-sky-400 inline" />
                  {hoveredAlert.locationName}
                </p>
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
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
            <p className="text-[10px] text-sky-300 mt-2 font-mono flex items-center gap-1">
              <Crosshair className="w-3 h-3" /> Click epicenter to open Tactical SitRep
            </p>
          </div>
        )}

        {/* Pinned Tactical Situation Report (SitRep) Overlay Panel */}
        {activeSelectedAlert && (
          <TacticalSitRepPanel
            alert={activeSelectedAlert}
            onClose={() => onSelectAlert(null as any)}
            onFocusCenter={handleFocusCenter}
            onInspectFullDossier={(alert) => {
              if (onOpenFullDossier) {
                onOpenFullDossier(alert);
              } else {
                onSelectAlert(alert);
              }
            }}
            onGoToDirectory={(country) => {
              if (onGoToDirectory) onGoToDirectory(country);
            }}
            onGoToPreparedness={(guideType) => {
              if (onGoToPreparedness) onGoToPreparedness(guideType);
            }}
            onAskAi={(alert) => {
              if (onAskAi) onAskAi(alert);
            }}
          />
        )}
      </div>

      {/* Bottom Map Info & Real-Time Cursor Status Footer */}
      <div className="px-4 py-2.5 bg-slate-950/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>{cursorGps}</span>
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-500">
            WGS84 Equirectangular Projection · Bounding Box [-180, -90, 180, 90]
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div>
            Batch: <strong className="text-slate-200">{batchedAlerts.length} Epicenters</strong>
          </div>
          <div className="hidden sm:inline text-slate-500">
            Synced: {new Date(lastBatchTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div>
            Zoom: <strong className="text-sky-400">{(zoom * 100).toFixed(0)}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
