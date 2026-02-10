export interface Attribute {
  name: string;
  value: number;
}

export interface Skill {
  name: string;
  value: number;
}

export interface Species {
  name: string;
  bonusAttributes: string[];
  trait: string;
}

export interface Role {
  name: string;
  bonusSkills: string[];
  startingGear: string[];
}

export interface Character {
  name: string;
  species: Species;
  role: Role;
  attributes: Record<string, Attribute>;
  skills: Record<string, Skill>;
  maxHealth: number;
  currentHealth: number;
  maxStress: number;
  currentStress: number;
  rank: string;
  department: string;
  xp: number;
}

export interface LogEntry {
  id: string;
  text: string;
  timestamp: string; // Stardate
  type: 'narrative' | 'system' | 'combat';
}

export interface Location {
  id: string;
  name: string;
  description: string;
  availableActions: string[]; // Action IDs
  exits: string[]; // Location IDs
}

export interface ShipStatus {
  shields: number;
  maxShields: number;
  hull: number;
  maxHull: number;
  torpedoes: number;
}

export interface Enemy {
  name: string;
  shields: number;
  maxShields: number;
  hull: number;
  maxHull: number;
  damage: number;
}

export interface GameState {
  character: Character | null;
  currentLocation: Location | null;
  log: LogEntry[];
  stardate: number;
  inventory: string[];
  activeMissionId: string | null;
  completedObjectives: string[];
  gamePhase: 'creation' | 'playing' | 'combat' | 'gameover';
  ship: ShipStatus;
  enemy: Enemy | null;
}

export interface Action {
  id: string;
  label: string;
  description?: string;
  execute: (state: GameState) => Partial<GameState>; // Simplified for now
}
