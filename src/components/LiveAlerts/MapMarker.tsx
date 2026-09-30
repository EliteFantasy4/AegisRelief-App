import React from 'react';
import { DisasterAlert } from '../../types/disaster';
import { getSeverityStyle } from '../../utils/formatters';
import { calculateSvgRadius } from '../../utils/geoProjection';

interface MapMarkerProps {
  alert: DisasterAlert;
  x: number;
  y: number;
  zoom: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (alert: DisasterAlert) => void;
  onHover: (alert: DisasterAlert, clientPos: { x: number; y: number }) => void;
  onLeave: () => void;
}

const areEqual = (prevProps: MapMarkerProps, nextProps: MapMarkerProps): boolean => {
  return (
    prevProps.alert.id === nextProps.alert.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y &&
    prevProps.zoom === nextProps.zoom &&
    prevProps.alert.severity === nextProps.alert.severity &&
    prevProps.alert.threatRadiusKm === nextProps.alert.threatRadiusKm &&
    prevProps.alert.updatedAt === nextProps.alert.updatedAt
  );
};

export const MapMarker: React.FC<MapMarkerProps> = React.memo(
  ({
    alert,
    x,
    y,
    zoom,
    isSelected,
    isHovered,
    onSelect,
    onHover,
    onLeave,
  }) => {
    const style = getSeverityStyle(alert.severity);

    // Calculate scaled threat radius in SVG pixels
    const svgRadius = calculateSvgRadius(alert.threatRadiusKm, alert.coordinates.lat, 500, 14, 75);

    // Scale-compensated dimensions to ensure hit-boxes and center cores stay crisp
    const coreRadius = isSelected ? 7 : isHovered ? 6 : 4.5;
    const hitBoxRadius = Math.max(22 / zoom, 16);

    const handleMouseEnter = (e: React.MouseEvent) => {
      try {
        const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
        onHover(alert, { x: rect.left + rect.width / 2, y: rect.top });
      } catch {
        // Safe fallback
      }
    };

    return (
      <g
        className="cursor-pointer group"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(alert);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onLeave}
      >
        {/* Threat Radius Impact Boundary (Geographic Area) */}
        <circle
          cx={x}
          cy={y}
          r={svgRadius}
          fill={style.ringColor}
          fillOpacity={isSelected ? 0.32 : isHovered ? 0.22 : 0.12}
          stroke={style.ringColor}
          strokeWidth={isSelected ? 2 / zoom : 1 / zoom}
          strokeDasharray={isSelected ? 'none' : '4,3'}
          className="transition-all duration-200 pointer-events-none"
        />

        {/* Pulsating Radar Shockwave Ring for Critical & Severe Alerts */}
        {alert.severity === 'CRITICAL' && (
          <circle
            cx={x}
            cy={y}
            r={svgRadius * 1.3}
            fill="none"
            stroke="#EF4444"
            strokeWidth={1.2 / zoom}
            strokeDasharray="4,4"
            className="pointer-events-none"
            opacity="0.8"
          >
            <animate
              attributeName="r"
              values={`${svgRadius * 0.8};${svgRadius * 1.5};${svgRadius * 0.8}`}
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;0.1;0.8"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Secondary Radar Ping Ring anchored at center */}
        <circle
          cx={x}
          cy={y}
          r={coreRadius + 6}
          fill="none"
          stroke={style.ringColor}
          strokeWidth={1 / zoom}
          className="pointer-events-none"
        >
          <animate
            attributeName="r"
            values={`${coreRadius + 2};${coreRadius + 14};${coreRadius + 2}`}
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9;0;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Epicenter Core Marker with high-contrast halo */}
        <circle
          cx={x}
          cy={y}
          r={coreRadius + 2 / zoom}
          fill="#0F172A"
          className="pointer-events-none"
        />
        <circle
          cx={x}
          cy={y}
          r={coreRadius}
          fill={style.ringColor}
          stroke="#FFFFFF"
          strokeWidth={1.6 / zoom}
          className="transition-transform pointer-events-none"
        />

        {/* Tactical Crosshair Notch when selected or hovered */}
        {(isSelected || isHovered) && (
          <g stroke={style.ringColor} strokeWidth={1 / zoom} className="pointer-events-none">
            <line x1={x - coreRadius - 4} y1={y} x2={x - coreRadius - 1} y2={y} />
            <line x1={x + coreRadius + 1} y1={y} x2={x + coreRadius + 4} y2={y} />
            <line x1={x} y1={y - coreRadius - 4} x2={x} y2={y - coreRadius - 1} />
            <line x1={x} y1={y + coreRadius + 1} x2={x} y2={y + coreRadius + 4} />
          </g>
        )}

        {/* Fixed Geographic Micro-Label */}
        <text
          x={x + coreRadius + 6 / zoom}
          y={y + 3 / zoom}
          fill={isSelected ? '#38BDF8' : '#F1F5F9'}
          fontSize={Math.max(9 / zoom, 7.5)}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontWeight={isSelected ? '700' : '500'}
          className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] select-none"
        >
          {alert.country} · {alert.subType.split('(')[0].trim()}
        </text>

        {/* High-Precision Transparent Click Hit-Box (Guarantees reliable clicking at any zoom) */}
        <circle
          cx={x}
          cy={y}
          r={hitBoxRadius}
          fill="transparent"
          className="cursor-pointer"
          aria-label={`Select disaster alert: ${alert.title}`}
        />
      </g>
    );
  },
  areEqual
);
