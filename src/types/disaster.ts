export type DisasterCategory =
  | 'geological'
  | 'meteorological'
  | 'biological'
  | 'human_unintentional'
  | 'human_intentional';

export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'ADVISORY';

export type ResponseStatus =
  | 'Evacuation Ordered'
  | 'Active Response'
  | 'Contained'
  | 'Monitoring'
  | 'Search & Rescue';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DisasterAlert {
  id: string;
  title: string;
  category: DisasterCategory;
  subType: string; // e.g. "Earthquake (M 7.2)", "Category 4 Cyclone", "Chemical Leak"
  severity: SeverityLevel;
  locationName: string;
  country: string;
  continent: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania' | 'Global';
  coordinates: Coordinates;
  threatRadiusKm: number;
  reportedAt: string; // ISO string
  updatedAt: string;
  affectedPopulationEstimate: number;
  casualtiesEstimate: {
    injured: number;
    displaced: number;
    fatalities: number;
  };
  status: ResponseStatus;
  primaryAgency: string;
  summary: string;
  immediateActions: string[];
  resourcesNeeded: string[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number;
  category: DisasterCategory;
  subType: string;
  location: string;
  country: string;
  economicLossUsdBillions: number;
  displacedCount: number;
  fatalitiesCount: number;
  recoveryDurationMonths: number;
  summary: string;
  systemicLessons: string[];
  keyActionsTaken: string[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  criticality: 'essential' | 'recommended' | 'optional';
  phase: 'before' | 'during' | 'after';
  tip?: string;
}

export interface PreparednessGuide {
  id: string;
  disasterType: string;
  category: DisasterCategory;
  iconName: string;
  briefSummary: string;
  immediateSurvivalRule: string; // e.g. "Drop, Cover, Hold On"
  checklists: ChecklistItem[];
  goBagEssentials: string[];
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
}

export interface EmergencyContact {
  label: string;
  number: string;
  service: string;
  tollFree: boolean;
  availableHours: string;
  description: string;
}

export interface CountryHelplines {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  region: string;
  primaryEmergency: string;
  contacts: EmergencyContact[];
  disasterAuthority: {
    name: string;
    websiteUrl?: string;
    phone: string;
    description: string;
  };
}
