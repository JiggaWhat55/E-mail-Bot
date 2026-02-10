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
  name: string;
  description: string;
  availableActions: string[]; // Action IDs
}

export interface GameState {
  character: Character | null;
  currentLocation: Location | null;
  log: LogEntry[];
  stardate: number;
  inventory: string[];
  missionObjectives: string[];
  gamePhase: 'creation' | 'playing' | 'combat' | 'gameover';
}

export interface Action {
  id: string;
  label: string;
  description?: string;
  execute: (state: GameState) => Partial<GameState>; // Simplified for now
}
