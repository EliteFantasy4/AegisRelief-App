/**
 * AegisRelief Geospatial Projection & WGS84 Coordinate Normalization
 * Equirectangular (Plate Carrée) standard projection system
 */

export interface NormalizedCoordinates {
  lat: number;
  lng: number;
  isValid: boolean;
  formattedGps: string;
}

export interface EquirectangularPoint {
  x: number;
  y: number;
  isValid: boolean;
}

export interface GeoBoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export const WORLD_BOUNDS: GeoBoundingBox = {
  west: -180,
  south: -90,
  east: 180,
  north: 90,
};

export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 500;

/**
 * Normalizes raw coordinate payloads defensively:
 * - Clamps Latitude to [-90, 90]
 * - Wraps Longitude cleanly to [-180, 180]
 * - Converts strings or invalid numbers to fallback coordinates [0, 0] without throwing
 */
export function normalizeCoordinates(
  rawLat: unknown,
  rawLng: unknown,
  fallbackLat = 0,
  fallbackLng = 0
): NormalizedCoordinates {
  try {
    let lat = typeof rawLat === 'string' ? parseFloat(rawLat) : Number(rawLat);
    let lng = typeof rawLng === 'string' ? parseFloat(rawLng) : Number(rawLng);

    if (isNaN(lat) || isNaN(lng) || rawLat === null || rawLng === null || rawLat === undefined || rawLng === undefined) {
      return {
        lat: fallbackLat,
        lng: fallbackLng,
        isValid: false,
        formattedGps: formatGpsCoordinates(fallbackLat, fallbackLng),
      };
    }

    // Force clamp Latitude between [-90, 90]
    lat = Math.max(-90, Math.min(90, lat));

    // Force wrap Longitude cleanly between [-180, 180]
    // Mathematical modulo that handles negative values seamlessly
    if (lng === 180 || lng === -180) {
      // Keep boundary intact
    } else {
      lng = ((((lng + 180) % 360) + 360) % 360) - 180;
    }

    return {
      lat,
      lng,
      isValid: true,
      formattedGps: formatGpsCoordinates(lat, lng),
    };
  } catch {
    return {
      lat: fallbackLat,
      lng: fallbackLng,
      isValid: false,
      formattedGps: formatGpsCoordinates(fallbackLat, fallbackLng),
    };
  }
}

/**
 * Maps WGS84 (Lat, Lng) to Equirectangular SVG/Canvas [x, y] coordinates.
 * Formula:
 * x = ((lng + 180) / 360) * width
 * y = ((90 - lat) / 180) * height
 */
export function projectEquirectangular(
  rawLat: unknown,
  rawLng: unknown,
  width = DEFAULT_CANVAS_WIDTH,
  height = DEFAULT_CANVAS_HEIGHT
): EquirectangularPoint {
  const norm = normalizeCoordinates(rawLat, rawLng);
  const x = ((norm.lng + 180) / 360) * width;
  const y = ((90 - norm.lat) / 180) * height;

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    isValid: norm.isValid,
  };
}

/**
 * Inverse mapping: converts SVG canvas [x, y] back into WGS84 decimal degrees
 */
export function inverseEquirectangular(
  x: number,
  y: number,
  width = DEFAULT_CANVAS_WIDTH,
  height = DEFAULT_CANVAS_HEIGHT
): { lat: number; lng: number } {
  try {
    const lng = (x / width) * 360 - 180;
    const lat = 90 - (y / height) * 180;
    const norm = normalizeCoordinates(lat, lng);
    return { lat: norm.lat, lng: norm.lng };
  } catch {
    return { lat: 0, lng: 0 };
  }
}

/**
 * Standardizes GPS coordinates display:
 * e.g., "28.1400° N, 84.8500° E" or "19.9800° S, 44.1500° W"
 */
export function formatGpsCoordinates(lat: number, lng: number): string {
  try {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `Lat: ${Math.abs(lat).toFixed(4)}° ${latDir}, Lng: ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
  } catch {
    return 'Lat: 0.0000° N, Lng: 0.0000° E';
  }
}

/**
 * Calculates approximate threat radius in SVG pixels at a given latitude.
 * Standard Plate Carrée: 1 degree latitude = (height / 180) px ≈ 111.12 km
 */
export function calculateSvgRadius(
  threatRadiusKm: number,
  latitude = 0,
  mapHeight = DEFAULT_CANVAS_HEIGHT,
  minPx = 10,
  maxPx = 80
): number {
  try {
    const kmPerDegreeLat = 111.12;
    const pxPerKm = mapHeight / (180 * kmPerDegreeLat);
    const radiusPx = threatRadiusKm * pxPerKm;
    return Math.max(minPx, Math.min(maxPx, radiusPx));
  } catch {
    return minPx;
  }
}
