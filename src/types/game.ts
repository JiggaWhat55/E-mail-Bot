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
  items: string[]; // Item IDs
  npcs: string[]; // NPC IDs
}

export interface ShipStatus {
  shields: number;
  maxShields: number;
  hull: number;
  maxHull: number;
  torpedoes: number;
  phaserLevel: number; // 0-10, increases damage
  shieldLevel: number; // 0-10, increases max shields
  engineLevel: number; // 0-10, increases dodge
  evasive?: boolean; // Temporary flag for evasive maneuvers
  power: {
    shields: number; // 0-100%
    weapons: number; // 0-100%
    engines: number; // 0-100%
  };
}

export interface Enemy {
  name: string;
  description?: string;
  shields: number;
  maxShields: number;
  hull: number;
  maxHull: number;
  damage: number;
}

export interface DialogueState {
  npcId: string;
  nodeId: string;
}

export interface GameState {
  character: Character | null;
  currentLocation: Location | null;
  log: LogEntry[];
  stardate: number;
  inventory: string[]; // Item IDs
  activeMissionId: string | null;
  completedObjectives: string[];
  gamePhase: 'creation' | 'playing' | 'combat' | 'gameover' | 'dialogue';
  ship: ShipStatus;
  enemy: Enemy | null;
  activeDialogue: DialogueState | null;
}

export interface Action {
  id: string;
  label: string;
  description?: string;
  execute: (state: GameState) => Partial<GameState>; // Simplified for now
}
