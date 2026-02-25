export interface Airport {
  id: string;
  name: string;
  code: string;
  country: string;
  location: {
    lat: number;
    lng: number;
  };
  demand: number; // 0-100 scale
  fees: number;
}

export interface PlaneType {
  id: string;
  model: string;
  range: number;
  capacity: number;
  speed: number;
  purchaseCost: number;
  operatingCost: number; // Cost per km
}

export interface Plane extends PlaneType {
  instanceId: string;
  status: 'idle' | 'flying' | 'maintenance';
}

export interface Route {
  id: string;
  originId: string;
  destinationId: string;
  assignedPlanes: string[]; // List of Plane instanceIds
  ticketPrice: number;
}

export interface LogEntry {
  id: string;
  day: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface GameState {
  cash: number;
  reputation: number; // 0-100
  fleet: Plane[];
  routes: Route[];
  day: number;
  logs: LogEntry[];
}
