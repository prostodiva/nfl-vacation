//Team types
export interface Souvenir {
  _id: string;
  name: string;
  price: number;
  category: 'Apparel' | 'Accessories' | 'Collectibles' | 'Food & Beverage';
  isTraditional: boolean;
  teamName: string;     
  stadiumName: string;
}

export interface SouvenirsResponse {
  success: boolean;
  count: number;
  data: Souvenir[];
}

export interface SingleSouvenirResponse {
  success: boolean;
  data: Souvenir;
}

export interface CreateSouvenirRequest {
  teamId: string;
  souvenir: {
    name: string;
    price: number;
    category: string;
    isTraditional?: boolean;
  };
}

export interface UpdateSouvenirRequest {
  id: string;
  souvenir: Partial<{
    name: string;
    price: number;
    category: string;
    isTraditional: boolean;
  }>;
}

export interface Stadium {
  name: string;
  location: string;
  seatingCapacity: number;
  surfaceType: string;
  roofType: 'Open' | 'Fixed' | 'Retractable';
  yearOpened: number;
}

// Response types
export interface StadiumResponse {
  success: boolean;
  data: StadiumItem[];
}

export interface SingleStadiumResponse {
  success: boolean;
  data: StadiumItem;
}

export interface CreateStadiumRequest {
  teamId: string;
  stadium: {
    name: string;
    location: string;
    seatingCapacity: number;
    surfaceType: 'Bermuda grass' | 'Kentucky Bluegrass' | 'FieldTurf' | 'AstroTurf' | 'Natural Grass';
    roofType: 'Open' | 'Fixed' | 'Retractable';
    yearOpened: number;
  };
}

export interface UpdateStadiumRequest {
  name?: string
  location?: string;
  seatingCapacity?: number;
  surfaceType?: string;
  roofType?: string;
  yearOpened?: number;
}

export interface Team {
  _id: string;
  teamName: string;
  conference: 'American Football Conference' | 'National Football Conference';
  division:
    | 'AFC East'
    | 'AFC West'
    | 'AFC North'
    | 'AFC South'
    | 'NFC East'
    | 'NFC West'
    | 'NFC North'
    | 'NFC South';
  stadium: Stadium;
  souvenirs: Souvenir[];
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface TeamResponse {
  success: boolean;
  data: Team;
}

export interface TeamsResponse {
  success: boolean;
  count: number;
  data: Team[];
}

// State management
export interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
}

export interface StadiumItem {
  _id: string;
  stadiumName: string;
  teamName: string;
  location: string;
  seatingCapacity: number;
  yearOpened: number;
  roofType: 'Open' | 'Fixed' | 'Retractable';
  surfaceType: string;
  teams?: string[]; 
}

export interface StadiumsByRoofTypeResponse {
  success: boolean;
  count: number;
  totalTeams: number;
  roofType: 'Open' | 'Fixed' | 'Retractable';
  data: StadiumItem[];
}

export type ActiveTab = 'teams' | 'stadiums' | 'souvenirs';