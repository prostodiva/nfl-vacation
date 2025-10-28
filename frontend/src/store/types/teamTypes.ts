//Team types
export interface Souvenir {
  _id?: string;
  name: string;
  price: number;
  category: 'Apparel' | 'Accessories' | 'Collectibles' | 'Food & Beverage';
  isTraditional: boolean;
}

export interface Stadium {
  name: string;
  location: string;
  seatingCapacity: number;
  surfaceType: string;
  roofType: 'Open' | 'Dome' | 'Retractable';
  yearOpened: number;
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
